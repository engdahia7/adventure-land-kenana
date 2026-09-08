import React, { useState } from 'react';
import {
  X,
  Compass,
  AlertTriangle,
  Award,
  Sparkles,
  Shield,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  AdventureEvent,
  AdventureEventChoice,
  PlayerSkills,
  InventoryItem,
  SkillReward,
} from '../types';
import { soundManager } from '../audio/soundManager';

interface AdventureEventModalProps {
  event: AdventureEvent;
  playerSkills: PlayerSkills;
  onClose: () => void;
  onResolve: (
    choice: AdventureEventChoice,
    outcomeClue?: string,
    outcomeItem?: InventoryItem,
    skillReward?: SkillReward,
    trustChange?: { characterId: string; amount: number }
  ) => void;
}

export const AdventureEventModal: React.FC<AdventureEventModalProps> = ({
  event,
  playerSkills,
  onClose,
  onResolve,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<AdventureEventChoice | null>(null);
  const [resolved, setResolved] = useState<boolean>(false);

  const handleChoose = (choice: AdventureEventChoice) => {
    soundManager.playClickSFX();
    setSelectedChoice(choice);
    setResolved(true);

    if (choice.skillReward) {
      soundManager.playTriumphSFX();
    }
  };

  const handleFinish = () => {
    if (!selectedChoice) return;
    const skillReward: SkillReward | undefined = selectedChoice.skillReward
      ? {
          skill: selectedChoice.skillReward.skill,
          amount: selectedChoice.skillReward.amount,
          description: selectedChoice.skillReward.reason,
        }
      : undefined;

    onResolve(
      selectedChoice,
      selectedChoice.gainClue,
      selectedChoice.gainItem,
      skillReward,
      selectedChoice.trustChange
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-[#0F0D0C] border border-[#D4AF37]/60 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/30 bg-[#0F0D0C]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm border border-amber-500/40 bg-amber-950/30 text-amber-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#F3E5AB] font-cairo">
                  {event.title}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-sm border border-amber-500/40 bg-amber-950/40 text-amber-300 font-bold">
                  {event.category}
                </span>
              </div>
              <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-0.5">{event.locationName}</p>
            </div>
          </div>

          <button
            id="btn-close-adventure-event"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#0F0D0C]">
          {/* Narrative Box */}
          <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-sm p-4 text-sm text-[#F3E5AB] font-amiri leading-relaxed">
            <span className="text-[#D4AF37] font-bold block mb-1 text-xs font-cairo uppercase tracking-wider">
              الموقف الميداني الطارئ:
            </span>
            <p className="text-justify">{event.narrative}</p>
          </div>

          {!resolved ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#D4AF37] block font-cairo uppercase tracking-wider">
                اختر خطتك للتصرف في هذا الموقف:
              </span>

              <div className="space-y-2.5">
                {event.choices.map((choice) => {
                  const skillType = choice.skillType;
                  const currentLevel = skillType ? playerSkills[skillType] : 100;
                  const reqLevel = choice.minSkillLevel || 0;
                  const canPerform = currentLevel >= reqLevel;

                  return (
                    <button
                      key={choice.id}
                      onClick={() => canPerform && handleChoose(choice)}
                      disabled={!canPerform}
                      className={`w-full text-right p-3.5 rounded-sm border transition-all flex flex-col gap-1.5 ${
                        canPerform
                          ? 'border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#0F0D0C] hover:bg-[#D4AF37]/10 text-[#F3E5AB] cursor-pointer shadow-md active:scale-[0.99]'
                          : 'border-red-900/40 bg-red-950/10 text-[#E6D2A8]/40 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs md:text-sm font-bold font-cairo">
                          {choice.text}
                        </span>
                        {skillType && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {skillType === 'exploration' ? (
                              <Compass className="w-4 h-4 text-cyan-400" />
                            ) : skillType === 'defense' ? (
                              <Shield className="w-4 h-4 text-amber-400" />
                            ) : (
                              <MessageSquare className="w-4 h-4 text-emerald-400" />
                            )}
                            <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#0F0D0C] border border-white/10 text-[#E6D2A8]/80 font-cairo">
                              {skillType === 'exploration'
                                ? 'استكشاف'
                                : skillType === 'defense'
                                ? 'دفاع'
                                : 'تفاوض'}{' '}
                              ({currentLevel}/{reqLevel})
                            </span>
                          </div>
                        )}
                      </div>

                      {!canPerform && (
                        <p className="text-[11px] text-red-400 font-amiri">
                          يتطلب مستوى {reqLevel} على الأقل في هذه المهارة. طوّر مهاراتك من خلال الألغاز والمحادثات.
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Outcome View */
            <div className="space-y-4 animate-scaleUp">
              <div className="bg-[#0F0D0C] border border-[#D4AF37] rounded-sm p-5 text-center space-y-3 shadow-xl">
                <div className="w-14 h-14 rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-[#F3E5AB] font-cairo">
                  تم التصرف بنجاح وتجاوز الموقف!
                </h4>
                <p className="text-xs text-[#E6D2A8]/90 font-amiri leading-relaxed text-justify bg-white/5 p-3 rounded-sm border border-white/10">
                  {selectedChoice?.outcomeText}
                </p>

                {selectedChoice?.gainClue && (
                  <div className="p-2.5 rounded-sm border border-amber-500/40 bg-amber-950/20 text-amber-300 text-xs font-bold flex items-center gap-2 text-right">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{selectedChoice.gainClue}</span>
                  </div>
                )}

                {selectedChoice?.gainItem && (
                  <div className="p-2.5 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F3E5AB] text-xs font-bold flex items-center gap-2 text-right">
                    <Award className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span>حصلت على أثر جديد: {selectedChoice.gainItem.name}</span>
                  </div>
                )}

                {selectedChoice?.skillReward && (
                  <div className="p-2 rounded-sm border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-bold inline-flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      +{selectedChoice.skillReward.amount}{' '}
                      {selectedChoice.skillReward.skill === 'exploration'
                        ? 'استكشاف'
                        : selectedChoice.skillReward.skill === 'defense'
                        ? 'دفاع'
                        : 'تفاوض'}{' '}
                      • {selectedChoice.skillReward.reason}
                    </span>
                  </div>
                )}
              </div>

              <button
                id="btn-confirm-adventure-outcome"
                onClick={handleFinish}
                className="w-full py-3 rounded-sm bg-[#D4AF37] hover:bg-[#E6D2A8] text-[#0F0D0C] font-bold text-sm tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>تسجيل النتيجة ومواصلة المغامرة</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
