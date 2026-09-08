import React, { useState, useEffect, useRef } from 'react';
import {
  AlertOctagon,
  Flame,
  Shield,
  Compass,
  MessageSquare,
  Timer,
  Zap,
  ArrowRight,
  Sparkles,
  Volume2,
  Skull,
  Award,
} from 'lucide-react';
import { PursuitEvent, PursuitOption, PlayerSkills } from '../types';
import { soundManager } from '../audio/soundManager';

interface PursuitEncounterModalProps {
  encounter: PursuitEvent;
  playerSkills: PlayerSkills;
  onResolve: (result: {
    success: boolean;
    threatChange: number;
    xpGain: number;
    skillUsed?: string;
  }) => void;
  onClose: () => void;
}

export const PursuitEncounterModal: React.FC<PursuitEncounterModalProps> = ({
  encounter,
  playerSkills,
  onResolve,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(18);
  const [selectedOption, setSelectedOption] = useState<PursuitOption | null>(null);
  const [outcome, setOutcome] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  useEffect(() => {
    try {
      soundManager.playPursuitAlertSFX();
      soundManager.playHeartbeatSFX(1.4);
    } catch {
      // ignore
    }
  }, []);

  // Adrenaline ticking countdown
  useEffect(() => {
    if (outcome) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, outcome]);

  const handleTimeout = () => {
    try {
      soundManager.playActionFailureSFX();
    } catch {}
    setOutcome({
      success: false,
      text: 'انتهت الثواني الحرجة! باغتتك عناصر العصابة واضطررت للقفز في ممر مائي والهرب بأعجوبة بعد إصابة طفيفة!',
    });
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleChooseOption = (opt: PursuitOption) => {
    if (outcome) return;
    setSelectedOption(opt);

    // Calculate dynamic success chance using player skills
    let adjustedChance = opt.successRate;
    if (opt.skillType && playerSkills[opt.skillType]) {
      const skillVal = playerSkills[opt.skillType];
      const minVal = opt.minSkillLevel || 20;
      if (skillVal >= minVal) {
        adjustedChance = Math.min(95, opt.successRate + (skillVal - minVal) * 0.8);
      } else {
        adjustedChance = Math.max(30, opt.successRate - (minVal - skillVal) * 1.5);
      }
    }

    const roll = Math.random() * 100;
    const isSuccess = roll <= adjustedChance;

    if (isSuccess) {
      try {
        soundManager.playActionSuccessSFX();
      } catch {}
      setOutcome({
        success: true,
        text: opt.successOutcome,
      });
    } else {
      try {
        soundManager.playActionFailureSFX();
      } catch {}
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      setOutcome({
        success: false,
        text: opt.failureOutcome,
      });
    }
  };

  const handleFinish = () => {
    try {
      soundManager.playClickSFX();
    } catch {}

    if (outcome) {
      const threatDelta = outcome.success
        ? selectedOption?.threatDeltaSuccess || -30
        : selectedOption?.threatDeltaFailure || 15;
      const xp = outcome.success ? selectedOption?.xpReward || 40 : 15;

      onResolve({
        success: outcome.success,
        threatChange: threatDelta,
        xpGain: xp,
        skillUsed: selectedOption?.skillType,
      });
    }
    onClose();
  };

  return (
    <div
      id="pursuit-encounter-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-lg animate-fadeIn"
    >
      <div
        className={`relative w-full max-w-2xl bg-gradient-to-b from-[#1F0A0A] via-[#140807] to-[#0A0404] border-2 border-red-600/80 rounded-sm shadow-[0_0_60px_rgba(220,38,38,0.4)] overflow-hidden font-cairo text-right transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Urgent Hazard Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-b border-red-600 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm bg-red-600 text-white animate-bounce shadow-md">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-xs bg-red-500/30 border border-red-400 text-red-200 font-bold uppercase tracking-wider animate-pulse">
                  كمين ومطاردة فورية
                </span>
                <span className="text-xs text-[#E6D2A8]/70 font-mono">{encounter.locationName}</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-white font-amiri">
                {encounter.title}
              </h2>
            </div>
          </div>

          {/* Ticking Urgency Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm border font-mono font-bold tracking-wider ${
              timeLeft <= 5
                ? 'bg-red-600 text-white border-white animate-ping'
                : 'bg-black/60 text-amber-300 border-amber-500'
            }`}
          >
            <Timer className="w-4 h-4 animate-spin" />
            <span className="text-base md:text-lg">{timeLeft}s</span>
          </div>
        </div>

        {/* Narrative & Options */}
        <div className="p-5 md:p-6 space-y-5">
          <div className="p-4 rounded-sm bg-black/60 border border-red-500/30 text-xs md:text-sm text-[#F3E5AB] font-amiri leading-relaxed">
            <p className="text-red-400 font-bold mb-1.5 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" />
              <span>{encounter.dangerAlert}</span>
            </p>
            {encounter.narrative}
          </div>

          {!outcome ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-red-300 block">
                اختر خطتك التكتيكية السريعة لتفادي الكمين:
              </span>
              <div className="space-y-2.5">
                {encounter.options.map((opt) => {
                  const skillLevel = opt.skillType ? playerSkills[opt.skillType] : 0;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleChooseOption(opt)}
                      className="w-full p-3.5 rounded-sm bg-[#120807] hover:bg-red-950/40 border border-red-500/40 hover:border-red-400 text-right transition-all cursor-pointer group active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-xs md:text-sm text-white group-hover:text-red-200">
                          {opt.text}
                        </span>
                        {opt.skillType && (
                          <span className="text-[10px] px-2 py-0.5 rounded-xs bg-black/50 border border-white/20 text-[#D4AF37] font-sans">
                            {opt.skillType === 'defense'
                              ? 'دفاع'
                              : opt.skillType === 'exploration'
                              ? 'استكشاف'
                              : 'تفاوض'}
                            : {skillLevel}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#E6D2A8]/70 font-amiri leading-normal">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className={`p-4 md:p-5 rounded-sm border space-y-4 animate-fadeIn ${
                outcome.success
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/40 border-red-500 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                {outcome.success ? (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>تم الإفلات وإسقاط الملاحقين ببراعة!</span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-5 h-5 text-red-400" />
                    <span>إفلات شاق ونجاة تحت النيران!</span>
                  </>
                )}
              </div>

              <p className="text-xs md:text-sm font-amiri leading-relaxed text-white/90">
                {outcome.text}
              </p>

              <button
                id="btn-finish-pursuit"
                onClick={handleFinish}
                className="w-full py-3.5 rounded-sm bg-gradient-to-r from-[#D4AF37] via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs md:text-sm tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <span>مواصلة التحقيق والمغامرة</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
