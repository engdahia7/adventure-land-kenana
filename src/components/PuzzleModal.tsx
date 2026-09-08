import React, { useState } from 'react';
import {
  X,
  Key,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Award,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { PuzzleDefinition, InventoryItem, SkillReward } from '../types';
import { soundManager } from '../audio/soundManager';

interface PuzzleModalProps {
  puzzle: PuzzleDefinition;
  onClose: () => void;
  onSolve: (rewardItem: InventoryItem, rewardClue: string, skillReward?: SkillReward) => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({ puzzle, onClose, onSolve }) => {
  // Pool of available tiles from puzzle.options or puzzle.solution
  const [availableTiles, setAvailableTiles] = useState<string[]>(() => {
    const pool = puzzle.options ? [...puzzle.options] : [...puzzle.solution];
    return pool.sort(() => Math.random() - 0.5);
  });
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(1);

  // Progressive hints (3 tiers)
  const defaultHints: [string, string, string] = [
    puzzle.hints?.[0] ||
      `إشارة أثرية: ارجع إلى السياق التاريخي أعلاه؛ الحل يبدأ برمز أو عنصر التأسيس الملكي ثم يتدرج حسب دورة الحياة والفلك.`,
    puzzle.hints?.[1] ||
      `كشف هندسي: الموضع الأول يبدأ بـ "${puzzle.solution[0]}" والموضع الثاني هو "${puzzle.solution[1]}".`,
    puzzle.hints?.[2] ||
      `كشف اللغز الكامل: الترتيب الأثري الموثق بالكامل هو: [${puzzle.solution.join(' ثم ')}].`,
  ];

  const handleUnlockNextHint = () => {
    soundManager.playClickSFX();
    setUnlockedHintLevel((prev) => Math.min(3, prev + 1));
  };

  const handleApplySolutionFromHint = () => {
    soundManager.playClickSFX();
    setSelectedSequence([...puzzle.solution]);
    const pool = puzzle.options ? [...puzzle.options] : [...puzzle.solution];
    setAvailableTiles(pool.filter((tile) => !puzzle.solution.includes(tile)));
    setErrorMsg(null);
  };

  const handleAddTile = (tile: string) => {
    if (selectedSequence.length >= puzzle.solution.length) {
      setErrorMsg(`لقد ملأت المواضع الـ ${puzzle.solution.length} بالفعل. أزل عنصراً لتغييره أو تحقق من الحل.`);
      return;
    }
    soundManager.playClickSFX();
    setErrorMsg(null);
    setSelectedSequence((prev) => [...prev, tile]);
    setAvailableTiles((prev) => prev.filter((t) => t !== tile));
  };

  const handleRemoveTile = (tile: string) => {
    soundManager.playClickSFX();
    setErrorMsg(null);
    setSelectedSequence((prev) => [...prev, tile]);
    setAvailableTiles((prev) => [...prev, tile]);
  };

  const handleReset = () => {
    soundManager.playClickSFX();
    setErrorMsg(null);
    const pool = puzzle.options ? [...puzzle.options] : [...puzzle.solution];
    setAvailableTiles(pool.sort(() => Math.random() - 0.5));
    setSelectedSequence([]);
  };

  const handleCheckSolution = () => {
    soundManager.playClickSFX();

    const isCorrect =
      selectedSequence.length === puzzle.solution.length &&
      selectedSequence.every((val, idx) => val === puzzle.solution[idx]);

    if (isCorrect) {
      soundManager.playTriumphSFX();
      setIsSuccess(true);
    } else {
      setErrorMsg('الترتيب غير متطابق مع النقش الأثري وقوانين البناء القديمة.. أعد ترتيب العناصر أو استعن بالتلميحات (الهنتات).');
    }
  };

  const handleClaimReward = () => {
    onSolve(puzzle.rewardItem, puzzle.rewardClue, puzzle.skillReward);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-[#0F0D0C] border border-[#D4AF37]/50 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Subtle Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-[#D4AF37]/30 bg-[#0F0D0C]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base md:text-lg font-bold text-[#F3E5AB] font-cairo">
                  {puzzle.title}
                </h3>
                {puzzle.puzzleCategory && (
                  <span className="text-[10px] px-2 py-0.5 rounded-sm border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
                    {puzzle.puzzleCategory}
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-sm border border-amber-500/40 bg-amber-950/40 text-amber-300 font-bold">
                  الصعوبة: {puzzle.difficulty || 'متوسط'}
                </span>
              </div>
              <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-0.5">{puzzle.location}</p>
            </div>
          </div>

          <button
            id="btn-close-puzzle"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 bg-[#0F0D0C]">
          {/* Historical Context Box */}
          {puzzle.historicalContext && (
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-sm p-3.5 text-xs text-[#F3E5AB] font-amiri leading-relaxed flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#D4AF37] block font-cairo text-[11px] uppercase tracking-wider mb-0.5">
                  السياق التاريخي والمعماري الموثق:
                </span>
                {puzzle.historicalContext}
              </div>
            </div>
          )}

          {/* Instructions Box */}
          <div className="bg-white/5 border border-white/10 rounded-sm p-3 text-xs md:text-sm text-[#E6D2A8]/90 font-amiri leading-relaxed flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#D4AF37] block mb-0.5 font-cairo text-xs uppercase tracking-wider">
                المطلوب لحل اللغز:
              </span>
              <span>{puzzle.instruction}</span>
            </div>

            {/* Hint Trigger Button */}
            {!isSuccess && (
              <button
                id="btn-toggle-hints"
                onClick={() => {
                  soundManager.playClickSFX();
                  setShowHints(!showHints);
                }}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-bold font-cairo transition-all cursor-pointer ${
                  showHints
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                    : 'border-[#D4AF37]/50 hover:border-[#D4AF37] bg-[#D4AF37]/10 text-[#F3E5AB]'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>تلميحات وهنتات ({unlockedHintLevel}/3)</span>
                {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Expandable Archaeological Hints Drawer */}
          {showHints && !isSuccess && (
            <div className="bg-[#14110F] border border-amber-500/40 rounded-sm p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-cairo">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>دليل الكهنة والتلميحات الأثرية المتدرجة (هنتات اللغز)</span>
                </div>
                {unlockedHintLevel < 3 && (
                  <button
                    id="btn-unlock-next-hint"
                    onClick={handleUnlockNextHint}
                    className="text-[11px] px-2.5 py-1 rounded-sm bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-cairo font-bold cursor-pointer transition-all active:scale-95"
                  >
                    + كشف التلميح التالي ({unlockedHintLevel + 1}/3)
                  </button>
                )}
              </div>

              {/* Hint Cards Tier List */}
              <div className="space-y-2">
                {/* Level 1: Historical Pointer */}
                <div className="p-2.5 rounded-sm bg-black/40 border border-amber-500/30 text-xs font-amiri text-[#F3E5AB]">
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold mb-1 font-cairo">
                    <span>المستوى 1: إشارة أثرية استكشافية</span>
                    <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-3 h-3" /> متاح</span>
                  </div>
                  <p>{defaultHints[0]}</p>
                </div>

                {/* Level 2: Blueprint Guidance */}
                {unlockedHintLevel >= 2 ? (
                  <div className="p-2.5 rounded-sm bg-black/40 border border-amber-500/30 text-xs font-amiri text-[#F3E5AB] animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold mb-1 font-cairo">
                      <span>المستوى 2: هندسة النقش والمواضع الأولى</span>
                      <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-3 h-3" /> مكشوف</span>
                    </div>
                    <p>{defaultHints[1]}</p>
                  </div>
                ) : (
                  <div className="p-2 rounded-sm bg-black/20 border border-dashed border-white/10 text-[11px] text-[#E6D2A8]/50 flex items-center justify-between">
                    <span>المستوى 2: كشف أول موضعين من الحل</span>
                    <span className="text-amber-500/70">انقر "كشف التلميح التالي" لفتحه</span>
                  </div>
                )}

                {/* Level 3: Full Solution & Auto-fill */}
                {unlockedHintLevel >= 3 ? (
                  <div className="p-2.5 rounded-sm bg-black/50 border border-amber-400/50 text-xs font-amiri text-[#F3E5AB] animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold mb-1 font-cairo">
                      <span>المستوى 3: كشف الحل الأثري الكامل</span>
                      <span className="text-amber-400 font-bold">الحل الإرشادي</span>
                    </div>
                    <p className="font-bold text-amber-200 mb-2">{defaultHints[2]}</p>
                    <button
                      id="btn-apply-hint-solution"
                      onClick={handleApplySolutionFromHint}
                      className="w-full py-1.5 rounded-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold font-cairo transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تطبيق الترتيب الصحيح في المواضع تلقائياً</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2 rounded-sm bg-black/20 border border-dashed border-white/10 text-[11px] text-[#E6D2A8]/50 flex items-center justify-between">
                    <span>المستوى 3: كشف الترتيب الشامل والتطبيق التلقائي</span>
                    <span className="text-amber-500/70">تلميح إنقاذ متقدم</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Card */}
          {isSuccess ? (
            <div className="bg-[#0F0D0C] border border-[#D4AF37] rounded-sm p-6 text-center space-y-4 shadow-xl animate-scaleUp">
              <div className="w-16 h-16 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#F3E5AB] font-cairo">
                  تم فك اللغز الأثري بنجاح!
                </h4>
                <p className="text-xs text-[#E6D2A8]/80 font-amiri mt-1.5">
                  لقد استخرجت: <span className="text-[#D4AF37] font-bold">{puzzle.rewardItem.name}</span>
                </p>
                <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-1">
                  {puzzle.rewardClue}
                </p>

                {puzzle.skillReward && (
                  <div className="mt-3 p-2.5 rounded-sm border border-cyan-400/40 bg-cyan-950/20 text-cyan-300 text-xs font-bold inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>
                      مكافأة المهارة: +{puzzle.skillReward.amount}{' '}
                      {puzzle.skillReward.skill === 'negotiation'
                        ? 'تفاوض'
                        : puzzle.skillReward.skill === 'exploration'
                        ? 'استكشاف'
                        : 'دفاع'}{' '}
                      ({puzzle.skillReward.description})
                    </span>
                  </div>
                )}
              </div>

              <button
                id="btn-claim-reward"
                onClick={handleClaimReward}
                className="w-full py-3 rounded-sm bg-[#D4AF37] hover:bg-[#E6D2A8] text-[#0F0D0C] font-bold text-sm tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ضم الأثر إلى الحقيبة والمتابعة</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Target Slots Sequence (Drop / Click zone) */}
              <div>
                <div className="text-xs font-bold text-[#F3E5AB] mb-2 flex items-center justify-between">
                  <span>التسلسل المختار (انقر للإزالة):</span>
                  <span className="text-[11px] text-[#E6D2A8]/60">
                    {selectedSequence.length} من {puzzle.solution.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 min-h-[70px] p-3 rounded-sm bg-[#0F0D0C] border border-[#D4AF37]/30">
                  {puzzle.solution.map((_, idx) => {
                    const item = selectedSequence[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => item && handleRemoveTile(item)}
                        className={`h-14 rounded-sm border flex items-center justify-center text-center p-2 text-xs font-bold transition-all ${
                          item
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#F3E5AB] cursor-pointer shadow-md'
                            : 'bg-white/5 border-dashed border-[#D4AF37]/20 text-[#E6D2A8]/30'
                        }`}
                      >
                        {item ? (
                          <div className="flex flex-col items-center">
                            <span>{item}</span>
                            <span className="text-[9px] text-[#D4AF37]/70 mt-0.5">انقر للإلغاء</span>
                          </div>
                        ) : (
                          <span>الموضع {idx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Tile Options */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2 block opacity-80">
                  الرموز والأدوات المتاحة (انقر للاختيار بالترتيب):
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {availableTiles.map((tile) => (
                    <button
                      key={tile}
                      onClick={() => handleAddTile(tile)}
                      className="p-3.5 rounded-sm bg-[#0F0D0C] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#F3E5AB] text-xs font-bold font-cairo text-right transition-all flex items-center justify-between shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>{tile}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-sm bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-amiri">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  id="btn-reset-puzzle"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-[#D4AF37]/30 text-[#E6D2A8] hover:bg-[#D4AF37]/10 text-xs font-medium transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>إعادة الضبط</span>
                </button>

                <button
                  id="btn-verify-puzzle"
                  onClick={handleCheckSolution}
                  disabled={selectedSequence.length !== puzzle.solution.length}
                  className="flex-1 py-2.5 rounded-sm bg-[#D4AF37] hover:bg-[#E6D2A8] text-[#0F0D0C] font-bold text-sm shadow-md active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>التحقق من الترتيب وفتح التجويف</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
