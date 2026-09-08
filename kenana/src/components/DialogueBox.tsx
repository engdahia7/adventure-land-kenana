import React, { useState } from 'react';
import { X, Send, Sparkles, MessageCircle, RefreshCw, Volume2, ShieldCheck, HelpCircle, Package, CheckCircle2 } from 'lucide-react';
import { Character, ChatMessage, DialogueOption, GameState, InventoryItem } from '../types';
import { soundManager } from '../audio/soundManager';

interface DialogueBoxProps {
  character: Character;
  gameState: GameState;
  onClose: () => void;
  onSelectOption: (option: DialogueOption) => void;
  onOpenPuzzle: (puzzleId: string) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  character,
  gameState,
  onClose,
  onSelectOption,
  onOpenPuzzle,
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'free_discussion' | 'evidence'>('story');
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [presentedItemFeedback, setPresentedItemFeedback] = useState<{
    item: InventoryItem;
    reaction: string;
    trustBoost: number;
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init_greet',
      role: 'character',
      speakerName: character.name,
      content: character.initialGreeting,
      timestamp: 'الآن',
    },
  ]);

  const currentNode = character.dialogueTree[currentNodeId] || character.dialogueTree['start'];
  const trustLevel = gameState.characterTrust[character.id] || 60;

  const handlePresentItem = (item: InventoryItem) => {
    soundManager.playDiscoverySFX();
    let reaction = `تمعن ${character.name} في ${item.name} بدقة وانبهار...`;
    let trustBoost = 10;

    if (character.id === 'radwan') {
      if (item.category === 'أثر ذهبي' || item.name.includes('بازلت') || item.name.includes('خاتم')) {
        reaction = `ارتعدت يد الأسطى رضوان: "يا الله! هذا النقش أعرفه جيداً.. كان من ضمن الصندوق الذي استلمه تاجر مجهول قبل هروبه إلى الإسكندرية!"`;
        trustBoost = 15;
      } else {
        reaction = `تفحص الأسطى رضوان ${item.name}: "قطعة أصيلة وفريدة، تثبت أن البردية ليست مجرد خرافة."`;
      }
    } else if (character.id === 'laila') {
      if (item.name.includes('صولجان') || item.name.includes('شمس') || item.name.includes('بردية')) {
        reaction = `شهقت د. ليلى بحماس: "هذا يطابق نقوش معبد الكرنك التي وثقناها! أنت باحث أثري استثنائي يا بني!"`;
        trustBoost = 20;
      } else {
        reaction = `قالت د. ليلى: "هذا الدليل ممتاز، يؤكد وجود شبكة منظمة تحاول طمس المعالم التاريخية."`;
      }
    } else if (character.id === 'salama') {
      reaction = `ابتسم عم سلامة وهو يتأمل ${item.name}: "نور النيل ونقاء فيلة معك يا ولدي، هذا الأثر حمله كهنة آمون لحماية سراديب الجنوب."`;
      trustBoost = 15;
    } else if (character.id === 'mansour') {
      reaction = `دقق المفتش منصور في ${item.name} بعدسته المكبرة: "قرينة دامغة تثبت صحة استنتاجاتك! سأصدر أمراً فورياً بتشديد الحراسة على غرفة الملك خوفو."`;
      trustBoost = 20;
    } else if (character.id === 'spirit_thoth') {
      reaction = `تردد صدى صوت تحوت المهيب: "لقد وازنت ريشة الحق بعقلك وعملك، يا باحث الحكمة الأبدية."`;
      trustBoost = 25;
    } else {
      reaction = `تفحص ${character.name} ${item.name} بإمعان وأكد أهميته القصوى في إتمام التحقيق.`;
      trustBoost = 10;
    }

    setPresentedItemFeedback({ item, reaction, trustBoost });

    onSelectOption({
      id: `present_${item.id}`,
      text: `مواجهة بـ: ${item.name}`,
      response: reaction,
      trustChange: trustBoost,
      gainClue: `شهادة خاصة من ${character.name} بخصوص ${item.name}`,
      storyImpact: `كسبت ثقة ${character.name} (+${trustBoost} ثقة) بتقديم دليل حاسم`,
    });
  };

  const handleSendQuestion = async (customText?: string) => {
    const question = (customText || inputQuestion).trim();
    if (!question || isAiLoading) return;

    soundManager.playClickSFX();

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      speakerName: 'أنت (المغامر)',
      content: question,
      timestamp: 'الآن',
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/dialogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: character.id,
          characterName: character.name,
          characterRole: character.title,
          location: character.locationName,
          playerMessage: question,
          conversationHistory: chatHistory.slice(-4),
          gameState: {
            inventory: gameState.inventory.map((i) => i.name),
            chapter: gameState.chapter,
            discoveredClues: gameState.discoveredClues,
          },
        }),
      });

      const data = await response.json();
      soundManager.playDialogueChirp();

      const aiReply = data.reply || data.fallbackReply || 'يا بني، أعد السؤال مرة أخرى.. صدى المكان حجب كلماتك.';

      const characterMsg: ChatMessage = {
        id: `char_${Date.now()}`,
        role: 'character',
        speakerName: character.name,
        content: aiReply,
        timestamp: 'الآن',
      };

      setChatHistory((prev) => [...prev, characterMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'character',
        speakerName: character.name,
        content: 'يا ولدي، سراديب التاريخ عميقة.. استمر في فحص الأدوات وسنجد الحل معاً.',
        timestamp: 'الآن',
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOptionClick = (option: DialogueOption) => {
    soundManager.playDialogueChirp();
    onSelectOption(option);

    if (option.triggerPuzzle) {
      onOpenPuzzle(option.triggerPuzzle);
      onClose();
      return;
    }

    if (option.nextStepId && character.dialogueTree[option.nextStepId]) {
      setCurrentNodeId(option.nextStepId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0F0D0C] border border-[#D4AF37]/50 rounded-sm shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Subtle Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-[#D4AF37]/30 bg-[#0F0D0C]/95">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-[#D4AF37] shadow-md bg-[#D4AF37]/10 shrink-0">
              <img
                src={character.avatar}
                alt={character.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#D4AF37] border border-[#0F0D0C]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#F3E5AB] font-cairo">
                  {character.name}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
                  {character.locationName}
                </span>
              </div>
              <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-0.5">{character.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Trust Meter with Geometric Balance styling */}
            <div className="hidden sm:flex items-center gap-2.5 border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1.5 rounded-sm">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#D4AF37] opacity-80 uppercase tracking-wider">
                  مستوى الثقة: {trustLevel}%
                </span>
                <div className="w-24 h-1.5 bg-[#D4AF37]/20 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-[#D4AF37] rounded-full transition-all duration-500 shadow-[0_0_8px_#D4AF37]"
                    style={{ width: `${Math.min(100, trustLevel)}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              id="btn-close-dialogue"
              onClick={() => {
                soundManager.playClickSFX();
                onClose();
              }}
              className="p-1.5 rounded-sm border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
              title="إغلاق الحوار"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation: Story Dialogue vs Free AI Discussion */}
        <div className="flex border-b border-[#D4AF37]/20 bg-[#0F0D0C] px-5">
          <button
            id="tab-story-dialogue"
            onClick={() => {
              soundManager.playClickSFX();
              setActiveTab('story');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'story'
                ? 'border-[#D4AF37] text-[#F3E5AB] bg-[#D4AF37]/10'
                : 'border-transparent text-[#E6D2A8]/60 hover:text-[#E6D2A8]'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>مسار القصة الرئيسي</span>
          </button>

          <button
            id="tab-free-discussion"
            onClick={() => {
              soundManager.playClickSFX();
              setActiveTab('free_discussion');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'free_discussion'
                ? 'border-[#D4AF37] text-[#F3E5AB] bg-[#D4AF37]/10'
                : 'border-transparent text-[#E6D2A8]/60 hover:text-[#E6D2A8]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>نقاش حر بالذكاء الاصطناعي</span>
          </button>

          <button
            id="tab-present-evidence"
            onClick={() => {
              soundManager.playClickSFX();
              setActiveTab('evidence');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'evidence'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-[#E6D2A8]/60 hover:text-[#E6D2A8]'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>مواجهة بالدليل ({gameState.inventory.length})</span>
          </button>
        </div>

        {/* Tab Content 1: Main Story Dialogue */}
        {activeTab === 'story' && (
          <div className="p-5 md:p-7 flex-1 overflow-y-auto flex flex-col justify-between gap-6">
            {/* Character Speech Bubble */}
            <div className="bg-[#0F0D0C] border border-[#D4AF37]/40 rounded-sm p-5 md:p-6 shadow-xl relative">
              <div className="flex items-center gap-2 mb-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Volume2 className="w-4 h-4" />
                <span>{currentNode.speakerName} يتحدث:</span>
              </div>
              <p className="text-base md:text-xl text-[#F3E5AB] font-amiri leading-relaxed">
                "{currentNode.text}"
              </p>
            </div>

            {/* Player Choice Options matching Geometric Balance */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs text-[#D4AF37] font-bold px-1 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                  <span>اختر ردك أو مسار تحركك (تؤثر الخيارات على المهارات والعلاقات):</span>
                </div>
                <span className="text-[10px] text-[#E6D2A8]/60 font-normal">
                  مستوى المهارات: تفاوض {gameState.skills?.negotiation || 25}% • استكشاف {gameState.skills?.exploration || 30}% • دفاع {gameState.skills?.defense || 20}%
                </span>
              </div>
              {currentNode.options.map((option, idx) => {
                const req = option.skillRequirement;
                const currentVal = req ? (gameState.skills ? gameState.skills[req.skill] : 0) : 100;
                const isLocked = req ? currentVal < req.level : false;

                const getSkillBadgeColor = (skillName?: string) => {
                  switch (skillName) {
                    case 'negotiation':
                      return 'border-amber-500/40 bg-amber-500/15 text-amber-300';
                    case 'exploration':
                      return 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300';
                    case 'defense':
                      return 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300';
                    default:
                      return 'border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37]';
                  }
                };

                return (
                  <button
                    key={option.id}
                    id={`dialogue-option-${option.id}`}
                    onClick={() => {
                      if (!isLocked) {
                        handleOptionClick(option);
                      }
                    }}
                    disabled={isLocked}
                    className={`flex flex-col gap-2 text-right p-3.5 md:p-4 rounded-sm border transition-all shadow-sm group cursor-pointer ${
                      isLocked
                        ? 'border-red-500/30 bg-red-950/10 text-red-300/50 cursor-not-allowed opacity-60'
                        : idx === 0
                        ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#F3E5AB]'
                        : 'border-white/15 bg-white/5 hover:bg-white/10 text-[#E6D2A8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isLocked ? 'bg-red-500' : idx === 0 ? 'bg-[#D4AF37]' : 'bg-white/40'
                          }`}
                        ></span>
                        <span className="font-cairo text-sm font-semibold leading-snug">{option.text}</span>
                      </div>
                      <span className="text-[#D4AF37] text-xs font-bold shrink-0 opacity-80 group-hover:opacity-100">
                        {isLocked ? '🔒' : '←'}
                      </span>
                    </div>

                    {/* Metadata Badges: Skill Requirements, Rewards, Trust and Story Impacts */}
                    <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1 pr-4">
                      {req && (
                        <span
                          className={`px-2 py-0.5 rounded-sm border font-bold ${
                            isLocked
                              ? 'border-red-500/40 bg-red-900/30 text-red-300'
                              : 'border-emerald-500/40 bg-emerald-900/30 text-emerald-300'
                          }`}
                        >
                          {isLocked ? '🔒 يتطلب' : '✓ مستوفي'}:{' '}
                          {req.skill === 'negotiation'
                            ? 'تفاوض'
                            : req.skill === 'exploration'
                            ? 'استكشاف'
                            : 'دفاع'}{' '}
                          {req.level}%
                        </span>
                      )}

                      {option.skillReward && (
                        <span
                          className={`px-2 py-0.5 rounded-sm border font-bold ${getSkillBadgeColor(
                            option.skillReward.skill
                          )}`}
                        >
                          +{option.skillReward.amount}{' '}
                          {option.skillReward.skill === 'negotiation'
                            ? 'تفاوض'
                            : option.skillReward.skill === 'exploration'
                            ? 'استكشاف'
                            : 'دفاع'}
                        </span>
                      )}

                      {option.trustChange && (
                        <span className="px-2 py-0.5 rounded-sm border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
                          +{option.trustChange} ثقة
                        </span>
                      )}

                      {option.storyImpact && (
                        <span className="text-[11px] text-[#E6D2A8]/70 font-amiri">
                          • {option.storyImpact}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Free AI Discussion Mode */}
        {activeTab === 'free_discussion' && (
          <div className="flex flex-col flex-1 overflow-hidden p-5 md:p-7 gap-4">
            {/* Discussion Log */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[380px]">
              {chatHistory.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-[#D4AF37] opacity-70 mb-1 px-1 uppercase tracking-wider">
                      {msg.speakerName} • {msg.timestamp}
                    </div>
                    <div
                      className={`max-w-[85%] md:max-w-[75%] p-4 rounded-sm text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#D4AF37] text-[#0F0D0C] font-bold shadow-md'
                          : 'bg-[#0F0D0C] border border-[#D4AF37]/40 text-[#F3E5AB] font-amiri shadow-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {isAiLoading && (
                <div className="flex items-center gap-2 text-[#D4AF37] text-xs py-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{character.name} يسترجع المعلومات ويصيغ جوابه الأثري...</span>
                </div>
              )}
            </div>

            {/* Quick Discussion Prompts */}
            <div className="border-t border-[#D4AF37]/20 pt-3">
              <div className="text-[11px] text-[#D4AF37] opacity-70 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>أسئلة سريعة شائعة:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap overflow-x-auto pb-1">
                {character.quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuestion(q)}
                    disabled={isAiLoading}
                    className="text-xs px-3 py-1 rounded-sm border border-[#D4AF37]/30 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 text-[#E6D2A8] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Custom Question Input */}
            <div className="flex items-center gap-2.5">
              <input
                id="input-dialogue-question"
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendQuestion();
                }}
                placeholder={`اسأل ${character.name.split(' ')[0]} أي سؤال عن الآثار، البردية، أو التاريخ المصري...`}
                disabled={isAiLoading}
                className="flex-1 bg-[#0F0D0C] border border-[#D4AF37]/40 rounded-sm px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#E6D2A8]/40 focus:outline-none focus:border-[#D4AF37] transition-colors font-cairo"
              />
              <button
                id="btn-send-question"
                onClick={() => handleSendQuestion()}
                disabled={!inputQuestion.trim() || isAiLoading}
                className="px-5 py-2.5 rounded-sm border border-[#D4AF37] bg-[#D4AF37] hover:bg-[#b8972f] text-[#0F0D0C] font-bold text-sm shadow-md active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>إرسال</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 3: Present Evidence from Inventory */}
        {activeTab === 'evidence' && (
          <div className="p-5 md:p-7 flex-1 overflow-y-auto flex flex-col gap-5">
            <div className="bg-[#1C1715] border border-amber-500/40 rounded-sm p-4 text-right">
              <div className="flex items-center gap-2 mb-1 text-amber-300 font-bold text-sm font-cairo">
                <Package className="w-4 h-4" />
                <span>مواجهة {character.name} بقطع أثرية من حقيبتك:</span>
              </div>
              <p className="text-xs text-[#E6D2A8]/75 font-amiri leading-relaxed">
                قدّم قطعة أثرية أو وثيقة لـ {character.name} لدراسة ردة فعله، استخلاص شهادات خفية ورفع مستوى الثقة المتبادلة.
              </p>
            </div>

            {presentedItemFeedback && (
              <div className="p-4 rounded-sm bg-emerald-950/40 border border-emerald-500/60 shadow-lg animate-fadeIn text-right">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs font-cairo mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ردة فعل {character.name} عند معاينة ({presentedItemFeedback.item.name}):</span>
                </div>
                <p className="text-sm text-[#F3E5AB] font-amiri leading-relaxed">
                  {presentedItemFeedback.reaction}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded-xs border border-emerald-500/30">
                  +{presentedItemFeedback.trustBoost}% زيادة في مستوى الثقة والتعاون
                </span>
              </div>
            )}

            {gameState.inventory.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[#D4AF37]/30 rounded-sm bg-black/20">
                <Package className="w-10 h-10 text-[#D4AF37]/40 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#F3E5AB] font-cairo">
                  حقيبتك فارغة من الآثار حالياً
                </h4>
                <p className="text-xs text-[#E6D2A8]/60 font-amiri mt-1">
                  استكشف معالم المنطقة وافحص الصناديق القديمة أو حل الألغاز للحصول على أدلة حقيقية.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gameState.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-sm bg-[#161210] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all flex flex-col justify-between gap-3 text-right"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <h5 className="text-xs md:text-sm font-bold text-[#F3E5AB] font-cairo">
                            {item.name}
                          </h5>
                          <span className="text-[10px] text-[#D4AF37]">{item.category}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#E6D2A8]/70 font-amiri line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePresentItem(item)}
                      className="w-full py-1.5 px-3 rounded-sm bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                    >
                      قدّم هذا الأثر للشخصية
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-[#0F0D0C] border-t border-[#D4AF37]/20 text-[#E6D2A8]/60 text-[11px] flex items-center justify-between">
          <span>نبرة الحوار: {character.voiceStyle}</span>
          <span>موقع الحدث: {character.locationName}</span>
        </div>
      </div>
    </div>
  );
};
