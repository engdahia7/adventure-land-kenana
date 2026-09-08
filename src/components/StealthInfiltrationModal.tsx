import React, { useState } from 'react';
import {
  Compass,
  Footprints,
  Eye,
  EyeOff,
  Flame,
  Shield,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface StealthInfiltrationModalProps {
  onClose: () => void;
  onSuccess: (xp: number, clue: string) => void;
  onDetected: (threatIncrease: number) => void;
}

export const StealthInfiltrationModal: React.FC<StealthInfiltrationModalProps> = ({
  onClose,
  onSuccess,
  onDetected,
}) => {
  const [detectionLevel, setDetectionLevel] = useState<number>(20); // 0 - 100
  const [currentStage, setCurrentStage] = useState<number>(0); // 0, 1, 2
  const [logMessages, setLogMessages] = useState<string[]>([
    'تسللت تحت جنح الظلام إلى باحة مستودع قطار الصعيد السري...',
  ]);

  const stages = [
    {
      title: 'بوابة المستودع والحراس بالبنادق',
      description: 'حارسان يدخنان السجائر أمام المدخل الحديدي، وهناك ضوء كشاف متحرك يمسح الساحة.',
      options: [
        {
          label: 'إلقاء عملة معدنية نحاسية لتشتيت انتباه الحارس نحو الظلال',
          risk: 15,
          soundSfx: 'click',
          outcome: 'انخدع الحارس وتحرك ليتفقد مصدر الصوت بعيداً عن البوابة!',
        },
        {
          label: 'التسلل السريع بين براميل القطران عبر النقطة العمياء للكشاف',
          risk: 30,
          soundSfx: 'footstep',
          outcome: 'مررت كالشبح تماماً خلف ظهر الحراس دون إثارة أي جلبة!',
        },
        {
          label: 'إطفاء مصباح الكيروسين بحجر دقيق',
          risk: 25,
          soundSfx: 'click',
          outcome: 'انطفأ المصباح وغرقت البوابة في ظلام دامس مكنك من العبور!',
        },
      ],
    },
    {
      title: 'عربات البضائع وصناديق التماثيل',
      description: 'كلاب حراسة مقيدة تنبح على مسافة، وصناديق الآثار محملة في العربة رقم 7.',
      options: [
        {
          label: 'استخدام لحم مجفف مهدئ لإسكات كلاب الحراسة',
          risk: 10,
          soundSfx: 'click',
          outcome: 'انشغلت الكلاب بالتهام الطعام وساد الهدوء في الرصيف!',
        },
        {
          label: 'التسلق عبر السلالم الحديدية لسطح العربة لتفادي الدوريات',
          risk: 25,
          soundSfx: 'footstep',
          outcome: 'وصلت لسطح القطار متخفياً وسط دخان القاطرة البخارية!',
        },
      ],
    },
    {
      title: 'خزنة الشحن ووثائق التسليم',
      description: 'رئيس عصابة التهريب يضع ختم الشحن على التابوت الذهبي قبل إغلاق العربة.',
      options: [
        {
          label: 'التقاط صورة سرية بكاميرا التجسس الدقيقة ومصادرة دفتر الشحن',
          risk: 20,
          soundSfx: 'click',
          outcome: 'وثقت العملية بالكامل وحصلت على وثيقة الشحن دون أن يشعر أحد!',
        },
        {
          label: 'إطلاق قنبلة دخانية وسحب صندوق التمائم الملكية في الفوضى',
          risk: 40,
          soundSfx: 'click',
          outcome: 'أحدث الدخان إرباكاً تاماً للمهربين وخرجت بالصندوق سالماً!',
        },
      ],
    },
  ];

  const handleAction = (opt: { label: string; risk: number; outcome: string }) => {
    soundManager.playClickSFX();
    const roll = Math.random() * 100;
    const newDetection = detectionLevel + (roll < opt.risk ? opt.risk + 15 : -5);

    if (newDetection >= 100) {
      // Detected!
      soundManager.playActionFailureSFX();
      setDetectionLevel(100);
      setLogMessages((prev) => [
        `صافرة إنذار! تم رصدك من قبل حراس المستودع: ${opt.label}`,
        ...prev,
      ]);
      setTimeout(() => onDetected(25), 1800);
    } else {
      setDetectionLevel(Math.max(5, Math.min(95, newDetection)));
      setLogMessages((prev) => [opt.outcome, ...prev]);

      if (currentStage === stages.length - 1) {
        // Complete stealth victory!
        soundManager.playActionSuccessSFX();
        setTimeout(() => {
          onSuccess(50, 'تمت عملية التسلل للمستودع بنجاح تام ومصادرة وثائق تسليم الآثار الملكية!');
        }, 1500);
      } else {
        setCurrentStage((prev) => prev + 1);
      }
    }
  };

  return (
    <div
      id="stealth-infiltration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md font-cairo text-right animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#121110] via-[#0C0B0A] to-[#050504] border-2 border-[#D4AF37]/50 rounded-sm shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#201813] to-[#120F0C] border-b border-[#D4AF37]/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-black/60 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#F3E5AB] font-amiri flex items-center gap-2">
                <span>تكتيك التسلل والظلال: رصيف قطار الصعيد</span>
                <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono">
                  STEALTH OP
                </span>
              </h2>
              <p className="text-xs text-[#E6D2A8]/70">
                تحرك في النقطة العمياء وتفادَ كشافات ودوريات حراسة المهربين
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

        {/* Content */}
        <div className="p-5 md:p-6 space-y-5">
          {/* Detection Meter */}
          <div className="space-y-1.5 bg-black/40 p-3 rounded-sm border border-white/10">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white/80 font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>مستوى رصد الحراس وشكوك الدورية:</span>
              </span>
              <span
                className={`font-bold ${
                  detectionLevel > 70
                    ? 'text-red-400 animate-pulse'
                    : detectionLevel > 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {detectionLevel}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/80 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full transition-all duration-300 ${
                  detectionLevel > 70
                    ? 'bg-red-500'
                    : detectionLevel > 40
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${detectionLevel}%` }}
              />
            </div>
          </div>

          {/* Current Infiltration Stage */}
          <div className="bg-[#181410] border border-[#D4AF37]/40 p-4 rounded-sm space-y-2">
            <h3 className="text-base font-bold text-[#F3E5AB] font-amiri">
              المرحلة {currentStage + 1}: {stages[currentStage].title}
            </h3>
            <p className="text-xs md:text-sm text-[#E6D2A8]/90 font-amiri leading-relaxed">
              {stages[currentStage].description}
            </p>
          </div>

          {/* Infiltration Log */}
          <div className="p-3 bg-black/60 border border-white/10 rounded-sm text-xs font-amiri text-emerald-300 space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
            {logMessages.map((msg, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span>
                <span>{msg}</span>
              </div>
            ))}
          </div>

          {/* Action Options */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#F3E5AB] block">
              اختر مناورة التسلل القادمة:
            </span>
            {stages[currentStage].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAction(opt)}
                className="w-full p-3.5 rounded-sm bg-black/50 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-right text-xs md:text-sm text-white font-bold transition-all cursor-pointer active:scale-98 flex items-center justify-between"
              >
                <span>{opt.label}</span>
                <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded-xs bg-amber-950/40 border border-amber-500/30">
                  خطر: {opt.risk}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
