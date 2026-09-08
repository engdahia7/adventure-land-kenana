import React, { useState, useEffect } from 'react';
import {
  Train,
  Wind,
  Flame,
  AlertTriangle,
  Zap,
  Sparkles,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface NileTrainChaseModalProps {
  onClose: () => void;
  onVictory: () => void;
  onThreatDelta: (delta: number) => void;
}

export const NileTrainChaseModal: React.FC<NileTrainChaseModalProps> = ({
  onClose,
  onVictory,
  onThreatDelta,
}) => {
  const [trainSpeedKmH, setTrainSpeedKmH] = useState<number>(85);
  const [roofPosition, setRoofPosition] = useState<number>(3); // Car 3 of 7
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [narrativeLog, setNarrativeLog] = useState<string>(
    'أنت الآن فوق سطح قطار الصعيد السريع المنطلق وسط حقول القصب ليلاً! الرياح عاتية ودخان القاطرة يعمي الأبصار!'
  );
  const [chaseResolved, setChaseResolved] = useState<boolean>(false);

  useEffect(() => {
    soundManager.playTrainSteamWhistleSFX();
  }, []);

  const handleLeapToCar = (carNumber: number) => {
    if (chaseResolved || isJumping) return;
    setIsJumping(true);
    soundManager.playClickSFX();

    setTimeout(() => {
      setIsJumping(false);
      setRoofPosition(carNumber);

      if (carNumber === 7) {
        // Final carriage with the royal sarcophagus!
        setChaseResolved(true);
        soundManager.playSafeUnlockSFX();
        setNarrativeLog(
          'قفزة بطولية أسطورية! هبطت على سقف العربة رقم 7 واقتحمت فتحة التهوية وقطعت خرطوم فرامل الطوارئ! توقف القطار وتم تأمين الآثار!'
        );
        onThreatDelta(-35);
        try {
          soundManager.playActionSuccessSFX();
        } catch {}
        setTimeout(() => onVictory(), 2500);
      } else {
        setNarrativeLog(
          `تقدمت بنجاح إلى سقف العربة رقم ${carNumber} وتفاديت كوابل التلغراف المنخفضة بمهارة فائقة!`
        );
      }
    }, 600);
  };

  return (
    <div
      id="nile-train-chase-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md font-cairo text-right animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#1C130D] via-[#100B07] to-[#080503] border-2 border-amber-500/70 rounded-sm shadow-[0_0_80px_rgba(245,158,11,0.3)] overflow-hidden">
        {/* Train Header */}
        <div className="bg-gradient-to-r from-amber-950 via-[#361E10] to-amber-950 border-b border-amber-500/40 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-amber-100 font-amiri flex items-center gap-2">
                <span>مطاردة قطار الصعيد الليلي (Nile Express)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-xs bg-red-600 text-white font-mono animate-pulse">
                  HIGH SPEED
                </span>
              </h2>
              <p className="text-xs text-amber-200/70">
                اشتباك فوق أسطح العربات المتحركة لإيقاف تهريب التابوت الذهبي
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm text-red-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Train Train Cars Visual Progress */}
          <div className="bg-black/60 border border-amber-500/30 p-4 rounded-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-200">
              <span className="flex items-center gap-1">
                <Wind className="w-4 h-4 text-amber-400 animate-spin" />
                <span>سرعة القطار: {trainSpeedKmH} كم/س</span>
              </span>
              <span>موقعك: العربة رقم {roofPosition} من 7</span>
            </div>

            {/* Visual carriages bar */}
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={num}
                  className={`p-2 rounded-xs border text-center transition-all ${
                    roofPosition === num
                      ? 'bg-amber-500 border-amber-300 text-black font-bold shadow-lg scale-105'
                      : num === 7
                      ? 'bg-red-950/60 border-red-500 text-red-300'
                      : 'bg-black/40 border-white/10 text-white/50'
                  }`}
                >
                  <span className="text-xs block font-mono">عربة {num}</span>
                  {num === 7 && <span className="text-[9px] text-amber-300 block font-cairo">التابوت</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Narrative Display */}
          <div className="p-4 rounded-sm bg-[#160E08] border border-amber-500/40 text-xs md:text-sm text-amber-100 font-amiri leading-relaxed shadow-inner">
            <p className="font-semibold">{narrativeLog}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-[#F3E5AB] block">
              مناورات الحركة فوق السطح المتحرك:
            </span>

            {roofPosition < 7 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleLeapToCar(roofPosition + 1)}
                  disabled={isJumping}
                  className="p-3.5 rounded-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs md:text-sm cursor-pointer active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>القفز للأمام إلى العربة رقم {roofPosition + 1}</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playTrainSteamWhistleSFX();
                    handleLeapToCar(Math.min(7, roofPosition + 2));
                  }}
                  disabled={isJumping}
                  className="p-3.5 rounded-sm bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs md:text-sm cursor-pointer active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>قفزة اندفاعية مزدوجة (تخطي عربتين)</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-bold text-center rounded-sm">
                تمت السيطرة الكاملة على عربة الآثار وتوقيف قطار الصعيد!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
