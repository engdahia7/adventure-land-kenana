import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  RotateCw,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  X,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import { SafeLockPuzzle, InventoryItem } from '../types';
import { soundManager } from '../audio/soundManager';

interface SafeCrackingModalProps {
  puzzle: SafeLockPuzzle;
  onClose: () => void;
  onUnlocked: (loot: InventoryItem, secretDoc: string) => void;
}

export const SafeCrackingModal: React.FC<SafeCrackingModalProps> = ({
  puzzle,
  onClose,
  onUnlocked,
}) => {
  const [dialValue, setDialValue] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(0); // 0, 1, 2
  const [unlockedStages, setUnlockedStages] = useState<boolean[]>([false, false, false]);
  const [isCracked, setIsCracked] = useState<boolean>(false);
  const [hintMessage, setHintMessage] = useState<string>(
    'أدر القرص المعدني واستمع إلى نقرات التروس الدقيقة للعثور على الأرقام الثلاثة السرية.'
  );

  const targetCode = puzzle.targetCombination; // [28, 64, 15]

  const handleRotateDial = (delta: number) => {
    if (isCracked) return;
    const nextVal = (dialValue + delta + 100) % 100;
    setDialValue(nextVal);

    const targetForStage = targetCode[currentStage];
    const diff = Math.abs(nextVal - targetForStage);

    // If extremely close, play sweet spot click
    if (diff === 0) {
      soundManager.playSafeClickSFX(true);
      setHintMessage('طنين تروس نقي! اضغط «تثبيت الترس» الآن!');
    } else if (diff <= 2) {
      soundManager.playSafeClickSFX(true);
      setHintMessage('تذبذب قوي في المقبض... أنت قريب جداً!');
    } else {
      soundManager.playSafeClickSFX(false);
      setHintMessage('تدوير الترس الفولاذي...');
    }
  };

  const handleConfirmTumbler = () => {
    if (isCracked) return;
    const targetForStage = targetCode[currentStage];

    if (dialValue === targetForStage) {
      // Stage unlocked
      soundManager.playSafeClickSFX(true);
      const nextStages = [...unlockedStages];
      nextStages[currentStage] = true;
      setUnlockedStages(nextStages);

      if (currentStage === 2) {
        // Full unlock!
        setIsCracked(true);
        soundManager.playSafeUnlockSFX();
        setHintMessage('انزلق لسان القفل الفولاذي الثقيل! الخزينة مفتوحة!');
      } else {
        setCurrentStage((prev) => prev + 1);
        setHintMessage(`تم قفل الترس ${currentStage + 1} بنجاح! انتقل للرقم التالي.`);
      }
    } else {
      soundManager.playClickSFX();
      setHintMessage('صوت ارتداد معدني خاطئ! الرقم غير مطابق، حاول مجدداً.');
    }
  };

  const handleClaimLoot = () => {
    onUnlocked(puzzle.lootItem, puzzle.secretDocument);
    onClose();
  };

  return (
    <div
      id="safe-cracking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1C1815] via-[#120F0D] to-[#080605] border-2 border-[#D4AF37] rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.3)] overflow-hidden font-cairo text-right">
        {/* Safe Header */}
        <div className="bg-gradient-to-r from-[#2F2218] via-[#38281E] to-[#1C140F] border-b border-[#D4AF37]/40 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37]">
              {isCracked ? <Unlock className="w-5 h-5 text-emerald-400 animate-bounce" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F3E5AB] font-amiri">
                {puzzle.title}
              </h2>
              <p className="text-xs text-[#E6D2A8]/70">
                قفل تروس إنجليزي ثلاثي المراحل غير قابل للكسر بالقوة
              </p>
            </div>
          </div>

          <button
            id="btn-close-safe-modal"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm text-red-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safe Body */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Combination Stages Indicator */}
          <div className="flex items-center justify-center gap-4 bg-black/40 border border-[#D4AF37]/30 p-3 rounded-sm">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xs border text-xs font-mono font-bold ${
                  unlockedStages[idx]
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                    : currentStage === idx
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] animate-pulse'
                    : 'bg-black/50 border-white/10 text-white/40'
                }`}
              >
                <span>الترس #{idx + 1}:</span>
                <span>{unlockedStages[idx] ? targetCode[idx] : '??'}</span>
                {unlockedStages[idx] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            ))}
          </div>

          {!isCracked ? (
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Rotating Metal Dial Visual */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-[#1A1817] via-[#332E28] to-[#1A1817] border-4 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.25)] flex items-center justify-center">
                {/* Dial Ticks Ring */}
                <div className="absolute inset-2 rounded-full border border-dashed border-[#D4AF37]/40" />

                {/* Inner Turn Wheel */}
                <div
                  className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-b from-[#4A3B2C] to-[#1D1712] border-2 border-[#D4AF37] flex flex-col items-center justify-center shadow-inner transition-transform duration-100"
                  style={{ transform: `rotate(${dialValue * 3.6}deg)` }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red] mb-2" />
                  <span className="text-xl md:text-2xl font-bold font-mono text-[#F3E5AB] select-none">
                    {dialValue}
                  </span>
                </div>
              </div>

              {/* Dial Control Buttons */}
              <div className="flex items-center gap-3">
                <button
                  id="btn-rotate-dial-left-5"
                  onClick={() => handleRotateDial(-5)}
                  className="px-3 py-2 rounded-sm bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-mono font-bold text-[#F3E5AB] cursor-pointer active:scale-95"
                >
                  -5
                </button>
                <button
                  id="btn-rotate-dial-left-1"
                  onClick={() => handleRotateDial(-1)}
                  className="p-3 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37]/60 hover:bg-[#D4AF37]/40 text-[#D4AF37] cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  id="btn-confirm-tumbler"
                  onClick={handleConfirmTumbler}
                  className="px-5 py-3 rounded-sm bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E5C158] hover:to-[#D4AF37] text-black font-bold text-xs md:text-sm shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>تثبيت الترس</span>
                </button>

                <button
                  id="btn-rotate-dial-right-1"
                  onClick={() => handleRotateDial(1)}
                  className="p-3 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37]/60 hover:bg-[#D4AF37]/40 text-[#D4AF37] cursor-pointer active:scale-95"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                <button
                  id="btn-rotate-dial-right-5"
                  onClick={() => handleRotateDial(5)}
                  className="px-3 py-2 rounded-sm bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-mono font-bold text-[#F3E5AB] cursor-pointer active:scale-95"
                >
                  +5
                </button>
              </div>

              {/* Audio & Haptic Hint */}
              <p className="text-xs text-[#E6D2A8]/80 text-center max-w-md italic">
                {hintMessage}
              </p>
            </div>
          ) : (
            /* Safe Open Reward View */
            <div className="bg-black/60 border-2 border-emerald-500/60 p-5 rounded-sm space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>تم فتح الخزينة واستخراج الغنائم الملكية والوثائق!</span>
              </div>

              <div className="p-3.5 rounded-sm bg-[#16120E] border border-[#D4AF37]/40 text-xs text-[#E6D2A8] space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                  <FileText className="w-4 h-4" />
                  <span>الوثيقة السرية المصادرة:</span>
                </div>
                <p className="font-amiri leading-relaxed">{puzzle.secretDocument}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-sm bg-emerald-950/30 border border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F3E5AB]">{puzzle.lootItem.name}</h4>
                    <span className="text-[11px] text-emerald-400">{puzzle.lootItem.category}</span>
                  </div>
                </div>
                <button
                  id="btn-claim-safe-loot"
                  onClick={handleClaimLoot}
                  className="px-4 py-2 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer active:scale-95"
                >
                  مصادرة إلى الحقيبة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
