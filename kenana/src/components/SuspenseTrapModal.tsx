import React, { useState, useEffect, useRef } from 'react';
import {
  AlertOctagon,
  Timer,
  Shield,
  Compass,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  Flame,
  ArrowRight,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react';
import { SuspenseTrapEvent, SuspenseTrapOption, InventoryItem, PlayerSkills } from '../types';
import { soundManager } from '../audio/soundManager';

interface SuspenseTrapModalProps {
  trap: SuspenseTrapEvent;
  playerSkills?: PlayerSkills;
  onSuccess?: (rewardClue?: string, rewardItem?: InventoryItem, dangerReduction?: number) => void;
  onResolve?: (result: {
    success: boolean;
    escapedStepId: string;
    rewardItem?: InventoryItem;
    clueReward?: string;
    xpGain?: number;
    threatLevelChange?: number;
  }) => void;
  onClose: () => void;
}

export const SuspenseTrapModal: React.FC<SuspenseTrapModalProps> = ({
  trap,
  playerSkills,
  onSuccess,
  onResolve,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(trap.timeLimitSeconds);
  const [selectedOption, setSelectedOption] = useState<SuspenseTrapOption | null>(null);
  const [stepFeedback, setStepFeedback] = useState<{
    isCorrect: boolean;
    text: string;
  } | null>(null);
  const [isStepProcessing, setIsStepProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [adrenalineSurgeUsed, setAdrenalineSurgeUsed] = useState<boolean>(false);
  const [isAdrenalineActive, setIsAdrenalineActive] = useState<boolean>(false);

  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleUseAdrenaline = () => {
    if (adrenalineSurgeUsed || isSuccess || isFailed) return;
    setAdrenalineSurgeUsed(true);
    setIsAdrenalineActive(true);
    try {
      soundManager.playActionSuccessSFX();
    } catch {
      // ignore
    }
    setTimeLeft((prev) => prev + 6);
    setTimeout(() => setIsAdrenalineActive(false), 2000);
  };

  // Play warning audio on mount
  useEffect(() => {
    try {
      soundManager.playTrapWarningSFX();
      soundManager.playStoneCrumbleSFX();
    } catch {
      // ignore
    }

    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };
  }, []);

  // Countdown timer with accelerating heartbeat
  useEffect(() => {
    if (isSuccess || isFailed || isStepProcessing) {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, isFailed, isStepProcessing]);

  // Heartbeat sound loop that accelerates as time runs out
  useEffect(() => {
    if (isSuccess || isFailed || isStepProcessing) {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
      return;
    }

    const intervalMs = timeLeft <= 4 ? 400 : timeLeft <= 8 ? 700 : 1000;
    const speed = timeLeft <= 4 ? 1.8 : timeLeft <= 8 ? 1.4 : 1.0;

    heartbeatTimerRef.current = setInterval(() => {
      try {
        soundManager.playHeartbeatSFX(speed);
      } catch {
        // ignore
      }
    }, intervalMs);

    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };
  }, [timeLeft, isSuccess, isFailed, isStepProcessing]);

  const handleTimeExpired = () => {
    try {
      soundManager.playActionFailureSFX();
    } catch {
      // ignore
    }
    setIsFailed(true);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const handleSelectOption = (option: SuspenseTrapOption) => {
    if (stepFeedback || isSuccess || isFailed || isStepProcessing) return;

    setSelectedOption(option);
    setIsStepProcessing(true);

    if (option.isCorrect) {
      try {
        soundManager.playActionSuccessSFX();
      } catch {
        // ignore
      }
      setStepFeedback({
        isCorrect: true,
        text: option.feedback,
      });

      if (currentStepIndex + 1 >= trap.steps.length) {
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current);
          heartbeatTimerRef.current = null;
        }
      }

      setTimeout(() => {
        setStepFeedback(null);
        setSelectedOption(null);
        setIsStepProcessing(false);
        if (currentStepIndex + 1 < trap.steps.length) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          // All steps completed successfully!
          setIsSuccess(true);
          try {
            soundManager.playTriumphSFX();
          } catch {
            // ignore
          }
        }
      }, 1200);
    } else {
      try {
        soundManager.playActionFailureSFX();
      } catch {
        // ignore
      }
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setStepFeedback({
        isCorrect: false,
        text: option.feedback,
      });
      // Penalty: deduct 3 seconds from timer
      setTimeLeft((prev) => Math.max(1, prev - 3));

      setTimeout(() => {
        setStepFeedback(null);
        setSelectedOption(null);
        setIsStepProcessing(false);
      }, 1400);
    }
  };

  const handleRetry = () => {
    try {
      soundManager.playClickSFX();
      soundManager.playTrapWarningSFX();
    } catch {
      // ignore
    }
    setCurrentStepIndex(0);
    setTimeLeft(trap.timeLimitSeconds);
    setSelectedOption(null);
    setStepFeedback(null);
    setIsStepProcessing(false);
    setIsFailed(false);
    setIsSuccess(false);
  };

  const handleFinishSuccess = () => {
    try {
      soundManager.playClickSFX();
    } catch {
      // ignore
    }

    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }

    if (onResolve) {
      try {
        onResolve({
          success: true,
          escapedStepId: trap.steps[trap.steps.length - 1]?.id || 'escaped',
          rewardItem: trap.rewardItem,
          clueReward: trap.rewardClue,
          xpGain: 60,
          threatLevelChange: -(trap.dangerReduction || 25),
        });
      } catch (err) {
        console.error('Error resolving trap:', err);
      }
    }

    if (onSuccess) {
      try {
        onSuccess(trap.rewardClue, trap.rewardItem, trap.dangerReduction);
      } catch (err) {
        console.error('Error in trap onSuccess:', err);
      }
    }

    onClose();
  };

  const handleCloseModal = () => {
    try {
      soundManager.playClickSFX();
    } catch {
      // ignore
    }
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    onClose();
  };

  const handleRetreat = () => {
    try {
      soundManager.playClickSFX();
    } catch {
      // ignore
    }
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (onResolve) {
      try {
        onResolve({
          success: false,
          escapedStepId: trap.steps[currentStepIndex]?.id || 'failed',
          threatLevelChange: 15,
        });
      } catch (err) {
        console.error('Error reporting retreat:', err);
      }
    }
    onClose();
  };

  const currentStep = trap.steps[currentStepIndex];
  const progressPercent = ((currentStepIndex + (isSuccess ? 1 : 0)) / trap.steps.length) * 100;
  const timePercent = (timeLeft / trap.timeLimitSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-lg select-none">
      {/* Red danger pulsing vignette */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          timeLeft <= 4
            ? 'opacity-80 shadow-[inset_0_0_120px_rgba(239,68,68,0.7)] animate-pulse'
            : timeLeft <= 8
            ? 'opacity-40 shadow-[inset_0_0_80px_rgba(245,158,11,0.5)]'
            : 'opacity-20 shadow-[inset_0_0_50px_rgba(239,68,68,0.3)]'
        }`}
      />

      <div
        className={`relative w-full max-w-2xl bg-[#0F0D0C] border-2 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-transform ${
          isShaking ? 'translate-x-1 -translate-y-1 rotate-[0.5deg]' : ''
        } ${
          timeLeft <= 4
            ? 'border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.5)]'
            : 'border-amber-500/80 shadow-[0_0_30px_rgba(212,175,55,0.3)]'
        }`}
      >
        {/* Emergency Hazard Top Banner */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-b border-red-600/60 px-4 md:px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-red-600 text-white animate-bounce shadow-md">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider font-cairo">
                  ⚠️ خطر ميداني داهم ومطاردة!
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-xs bg-black/60 text-amber-300 border border-amber-500/40 font-bold">
                  {trap.locationName}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white font-cairo mt-0.5">
                {trap.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tactical Adrenaline Surge Trigger */}
            {!adrenalineSurgeUsed && !isSuccess && !isFailed && (
              <button
                id="btn-adrenaline-surge"
                onClick={handleUseAdrenaline}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-black font-bold text-[11px] shadow-lg active:scale-95 cursor-pointer animate-pulse"
                title="تفعيل اندفاع الأدرينالين لكسب 6 ثوانٍ إضافية حاسمة"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span className="hidden sm:inline">أدرينالين (+6ث)</span>
                <span className="sm:hidden">+6ث</span>
              </button>
            )}

            {/* Adrenaline Ticking Timer */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border font-mono font-bold tracking-wider ${
                timeLeft <= 4
                  ? 'bg-red-600 text-white border-white animate-ping'
                  : timeLeft <= 8
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-black/50 text-[#F3E5AB] border-amber-500/50'
              }`}
            >
              <Timer className="w-4 h-4 animate-spin" />
              <span className="text-base md:text-lg">{timeLeft}s</span>
            </div>

            {/* Direct Close Button */}
            <button
              id="btn-close-trap-modal"
              onClick={handleCloseModal}
              className="p-1.5 rounded-sm border border-white/20 bg-black/40 hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
              title="إغلاق والانسحاب"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Time Progress Bar */}
        <div className="w-full bg-black/80 h-2 relative overflow-hidden border-b border-white/10">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 4 ? 'bg-red-600' : timeLeft <= 8 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* Content Container */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 bg-[#0F0D0C]">
          {/* Situation Brief */}
          <div className="bg-red-950/20 border border-red-600/30 rounded-sm p-4 text-xs md:text-sm text-[#F3E5AB] font-amiri leading-relaxed">
            <div className="flex items-center gap-2 text-red-400 font-bold mb-1 font-cairo text-xs">
              <Flame className="w-4 h-4 animate-pulse" />
              <span>لحظة الذعر والمحاصرة:</span>
            </div>
            <p className="text-justify">{trap.scenario}</p>
          </div>

          {/* Main Interactive Decision Arena */}
          {!isSuccess && !isFailed ? (
            <div className="space-y-4">
              {/* Step counter */}
              <div className="flex items-center justify-between text-xs font-cairo text-[#E6D2A8]/80 border-b border-white/10 pb-2">
                <span>
                  المرحلة {currentStepIndex + 1} من {trap.steps.length}:
                </span>
                <span className="text-amber-400 font-bold font-mono">
                  {Math.round(progressPercent)}% تم تجاوزه
                </span>
              </div>

              {/* Step Question */}
              <div className="p-3.5 bg-white/5 border border-amber-500/40 rounded-sm text-sm md:text-base font-bold text-white font-cairo shadow-inner">
                {currentStep.prompt}
              </div>

              {/* Step Feedback Banner (if user just made a choice) */}
              {stepFeedback && (
                <div
                  className={`p-3 rounded-sm border text-xs md:text-sm font-bold font-cairo flex items-center gap-2 animate-fadeIn ${
                    stepFeedback.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-red-950/80 border-red-500 text-red-300 animate-shake'
                  }`}
                >
                  {stepFeedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <span>{stepFeedback.text}</span>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.id}
                    disabled={!!stepFeedback || isStepProcessing}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-right p-3.5 rounded-sm border transition-all text-xs md:text-sm font-cairo flex items-center justify-between gap-3 cursor-pointer ${
                      selectedOption?.id === opt.id
                        ? opt.isCorrect
                          ? 'bg-emerald-900/40 border-emerald-500 text-white'
                          : 'bg-red-900/40 border-red-500 text-white'
                        : 'bg-[#0F0D0C] hover:bg-amber-500/10 border-amber-500/30 hover:border-amber-400 text-[#F3E5AB] active:scale-[0.99]'
                    } ${isStepProcessing ? 'opacity-80 cursor-wait' : ''}`}
                  >
                    <span className="font-semibold leading-relaxed">{opt.text}</span>
                    {opt.skillUsed && (
                      <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-xs bg-black/60 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                        {opt.skillUsed === 'exploration' ? (
                          <Compass className="w-3 h-3 text-cyan-400" />
                        ) : opt.skillUsed === 'defense' ? (
                          <Shield className="w-3 h-3 text-amber-400" />
                        ) : (
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>
                          {opt.skillUsed === 'exploration'
                            ? 'استكشاف'
                            : opt.skillUsed === 'defense'
                            ? 'دفاع'
                            : 'تفاوض'}
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : isSuccess ? (
            /* Triumph Screen */
            <div className="space-y-4 text-center animate-scaleUp py-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-white font-cairo">
                نجوت بأعجوبة وتجاوزت الفخ القاتل!
              </h4>
              <p className="text-xs md:text-sm text-[#E6D2A8] font-amiri max-w-md mx-auto leading-relaxed">
                بفضل سرعة بديهتك ودقة قراراتك تحت الضغط الشديد، أحبطت مكيدة المهربين وتفاديت
                الانهيار الحجري بنجاح!
              </p>

              {trap.rewardClue && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/60 rounded-sm text-amber-200 text-xs md:text-sm font-bold flex items-center gap-2 text-right">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{trap.rewardClue}</span>
                </div>
              )}

              {trap.rewardItem && (
                <div className="p-3 bg-[#D4AF37]/15 border border-[#D4AF37] rounded-sm text-[#F3E5AB] text-xs md:text-sm font-bold flex items-center gap-2 text-right">
                  <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span>حصلت على أثر ومعدات نادرة: {trap.rewardItem.name}</span>
                </div>
              )}

              <div className="p-2 bg-emerald-950/30 border border-emerald-500/30 rounded-sm text-emerald-300 text-xs font-cairo">
                ⚡ انخفض مؤشر الخطر والمطاردة بنسبة -{trap.dangerReduction}%
              </div>

              <button
                id="btn-claim-trap-victory"
                onClick={handleFinishSuccess}
                className="w-full py-3.5 rounded-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl font-cairo"
              >
                <span>التقاط الغنائم والعودة للاستكشاف</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Failure Screen */
            <div className="space-y-4 text-center animate-scaleUp py-3">
              <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                <AlertOctagon className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-red-400 font-cairo">
                داهمك الفخ وضاق بك الوقت!
              </h4>
              <p className="text-xs md:text-sm text-[#E6D2A8] font-amiri max-w-md mx-auto leading-relaxed">
                تأخرت في اتخاذ القرار الحاسم وأطبقت المصيدة عليك! يمكنك إعادة المحاولة فوراً بتركيز
                أعلى وسرعة أكبر للنجاة.
              </p>

              <div className="flex gap-3">
                <button
                  id="btn-retry-trap"
                  onClick={handleRetry}
                  className="flex-1 py-3 rounded-sm bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all font-cairo"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المحاولة فوراً</span>
                </button>
                <button
                  id="btn-retreat-trap"
                  onClick={handleRetreat}
                  className="px-5 py-3 rounded-sm border border-white/20 hover:bg-white/10 text-white font-bold text-sm cursor-pointer active:scale-95 transition-all font-cairo"
                >
                  انسحاب تكتيكي
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

