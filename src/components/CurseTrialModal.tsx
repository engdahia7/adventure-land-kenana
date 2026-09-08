import React, { useState, useEffect } from 'react';
import {
  Skull,
  Flame,
  AlertOctagon,
  Timer,
  Zap,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  Compass,
} from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface CurseTrialModalProps {
  onClose: () => void;
  onVictory: () => void;
  onDefeat: () => void;
}

export const CurseTrialModal: React.FC<CurseTrialModalProps> = ({
  onClose,
  onVictory,
  onDefeat,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(35);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [gasDensity, setGasDensity] = useState<number>(15);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>(
    'تصاعد غاز البخور السام وبدأت أبواب المقبرة الجرانيتية بالانغلاق! أجب على أختام الفرعون لتفادي اللعنة!'
  );

  const puzzles = [
    {
      hieroglyph: '𓀭 𓃭 𓆓',
      prompt: 'الختم الأول: أي من الآلهة التالية يمثل حارس الموتى وميزان القلب بريشة ماعت؟',
      options: [
        { text: 'أنوبيس (ابن آوى الأسود)', isCorrect: true, explanation: 'صحيح! انحسر الغاز جزئياً عن الحجرة!' },
        { text: 'ست (إله الفوضى والرمال)', isCorrect: false, explanation: 'خطأ! تسارع تسرب الغاز الخانق!' },
        { text: 'سوبك (إله التمساح)', isCorrect: false, explanation: 'خطأ! اهتزت الجدران الجرانيتية!' },
      ],
    },
    {
      hieroglyph: '𓏠 𓈖 𓏏',
      prompt: 'الختم الثاني: تميمة الحماية الأكثر قدسية لحفظ الروح من قوى الشر في العالم السفلي؟',
      options: [
        { text: 'عين حورس (أوجات)', isCorrect: true, explanation: 'صحيح! انفتحت السقاطة الهيدروليكية الأولى!' },
        { text: 'عصا الراعي فقط', isCorrect: false, explanation: 'خطأ! كاد الباب أن يطبق تماماً!' },
        { text: 'إكليل نبات البردي', isCorrect: false, explanation: 'خطأ! انخفضت الرؤية في الممر!' },
      ],
    },
    {
      hieroglyph: '𓇳 𓄿 𓀭',
      prompt: 'الختم الثالث والأخير: اتجاه شروق قرص الشمس الملكي الذي يرمز للبعث والخلود الأبدي؟',
      options: [
        { text: 'الشرق نحو الأفق المشرق (آخت)', isCorrect: true, explanation: 'مذهل! ارتفعت البوابة الجرانيتية واندفع الهواء النقي!' },
        { text: 'الغرب نحو مدينة الأموات', isCorrect: false, explanation: 'خطأ! الغرب مخصص لعالم الدفن!' },
        { text: 'الجنوب نحو شلالات النوبة', isCorrect: false, explanation: 'خطأ!' },
      ],
    },
  ];

  // Sound effect and timer loop
  useEffect(() => {
    soundManager.playCurseWhisperSFX();
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
      setGasDensity((prev) => Math.min(95, prev + 2));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTimeExpired = () => {
    setIsResolved(true);
    setStatusMessage('أطبقت البوابة الجرانيتية تماماً وخارت قواك أمام الغاز السام!');
    try {
      soundManager.playActionFailureSFX();
    } catch {}
    setTimeout(() => onDefeat(), 2000);
  };

  const handleSelectAnswer = (isCorrect: boolean, explanation: string) => {
    if (isResolved) return;

    if (isCorrect) {
      soundManager.playSafeUnlockSFX();
      setStatusMessage(explanation);
      setGasDensity((prev) => Math.max(10, prev - 20));

      if (currentStep === puzzles.length - 1) {
        // Complete victory!
        setIsResolved(true);
        soundManager.playActionSuccessSFX();
        setTimeout(() => onVictory(), 1800);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      soundManager.playActionFailureSFX();
      setStatusMessage(explanation);
      setTimeLeft((prev) => Math.max(2, prev - 6)); // Penalty
      setGasDensity((prev) => Math.min(95, prev + 25));
    }
  };

  return (
    <div
      id="curse-trial-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md font-cairo text-right animate-fadeIn"
    >
      {/* Toxic Gas Overlay Screen Effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundColor: `rgba(180, 83, 9, ${gasDensity / 160})`,
          boxShadow: 'inset 0 0 120px rgba(220, 38, 38, 0.5)',
        }}
      />

      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#20100A] via-[#140A06] to-[#080302] border-2 border-red-500/80 rounded-sm shadow-[0_0_80px_rgba(239,68,68,0.4)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-amber-950 to-red-950 border-b border-red-500/40 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-red-500/20 border border-red-500/60 flex items-center justify-center text-red-400 animate-pulse">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-red-200 font-amiri flex items-center gap-2">
                <span>لعنة الفراعنة: مصيدة الغاز والجرانيت</span>
                <span className="text-[10px] px-2 py-0.5 rounded-xs bg-red-500/30 text-white font-mono animate-bounce">
                  TIME TRIAL
                </span>
              </h2>
              <p className="text-xs text-amber-200/70">
                تسرب الغاز السام • إغلاق هيدروليكي للحجرة
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-red-950/80 border border-red-500 font-mono font-bold text-red-400 text-sm">
            <Timer className="w-4 h-4 animate-spin" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Gas & Progress Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-red-300 font-bold">كثافة الغاز الخانق في الحجرة:</span>
              <span className="text-red-400">{gasDensity}%</span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-red-900">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-300"
                style={{ width: `${gasDensity}%` }}
              />
            </div>
          </div>

          {/* Current Hieroglyph Stone Tablet */}
          <div className="bg-black/60 border border-[#D4AF37]/50 rounded-sm p-5 text-center space-y-3 shadow-inner">
            <div className="text-3xl md:text-4xl text-[#D4AF37] font-serif tracking-widest animate-pulse select-none">
              {puzzles[currentStep].hieroglyph}
            </div>
            <h3 className="text-sm md:text-base font-bold text-[#F3E5AB] font-amiri">
              {puzzles[currentStep].prompt}
            </h3>
          </div>

          {/* Feedback message */}
          <div className="p-3 rounded-sm bg-black/50 border border-amber-500/30 text-xs text-amber-200/90 font-amiri">
            {statusMessage}
          </div>

          {/* Choices */}
          <div className="space-y-2.5">
            {puzzles[currentStep].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectAnswer(opt.isCorrect, opt.explanation)}
                disabled={isResolved}
                className="w-full p-3.5 rounded-sm bg-[#160B08] border border-red-500/40 hover:border-amber-400 hover:bg-amber-950/30 text-right text-xs md:text-sm text-white font-bold transition-all cursor-pointer active:scale-98 flex items-center justify-between"
              >
                <span>{opt.text}</span>
                <span className="text-amber-400">↵</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
