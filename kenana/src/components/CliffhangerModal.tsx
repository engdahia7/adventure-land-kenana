import React, { useState, useEffect } from 'react';
import { DailyCliffhanger } from '../types';
import { getSecondsUntilNextRealDay, formatTimeRemaining } from '../data/dailyMissionsData';
import { soundManager } from '../audio/soundManager';
import { AlertCircle, Clock, FastForward, CheckCircle, ChevronLeft, Sparkles, Flame, ShieldAlert } from 'lucide-react';

interface CliffhangerModalProps {
  cliffhanger: DailyCliffhanger;
  currentDayNumber: number;
  nextDayNumber: number;
  isNextDayUnlocked: boolean;
  onAdvanceSimulatedDay?: () => void;
  onClose: () => void;
  onStartNextDay?: () => void;
}

export const CliffhangerModal: React.FC<CliffhangerModalProps> = ({
  cliffhanger,
  currentDayNumber,
  nextDayNumber,
  isNextDayUnlocked,
  onAdvanceSimulatedDay,
  onClose,
  onStartNextDay,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(getSecondsUntilNextRealDay());

  useEffect(() => {
    soundManager.playCliffhangerSFX();
    const interval = setInterval(() => {
      setSecondsRemaining(getSecondsUntilNextRealDay());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Decorative Golden Egyptian Border Glow */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#181413] via-[#120F0E] to-[#0A0908] border-2 border-[#D4AF37] rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Dramatic Banner */}
        <div className="relative bg-gradient-to-r from-red-950/60 via-[#D4AF37]/20 to-red-950/60 border-b border-[#D4AF37]/50 px-5 py-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/40 border border-red-500/50 text-red-300 text-xs font-bold mb-1.5 shadow-sm animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>نقطة التشويق الكبرى (Cliffhanger) • نهاية اليوم {currentDayNumber}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-[#F3E5AB] font-cairo tracking-wide drop-shadow-md">
            {cliffhanger.title}
          </h2>
          <p className="text-xs text-[#E6D2A8]/80 font-amiri mt-0.5">
            {cliffhanger.subtitle}
          </p>

          {/* Corner Pharaonic Symbols */}
          <div className="absolute top-3 left-3 text-[#D4AF37]/40 hidden sm:block">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="absolute top-3 right-3 text-[#D4AF37]/40 hidden sm:block">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Scrollable Story Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 text-right font-amiri text-sm md:text-base leading-relaxed text-[#E6D2A8]">
          {/* Narrative Paragraphs */}
          <div className="bg-[#0F0D0C]/80 border border-[#D4AF37]/20 p-4 md:p-5 rounded-sm space-y-3.5 shadow-inner">
            {cliffhanger.dramaticNarrative.map((para, idx) => (
              <p
                key={idx}
                className={`text-[#F3E5AB]/95 ${
                  idx === cliffhanger.dramaticNarrative.length - 1
                    ? 'font-bold text-amber-200 border-r-2 border-[#D4AF37] pr-3 py-1 bg-[#D4AF37]/5'
                    : ''
                }`}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Mentor Character Quote */}
          <div className="flex items-center gap-4 bg-[#D4AF37]/10 border border-[#D4AF37]/40 p-3.5 rounded-sm">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] shrink-0 shadow-md">
              <img
                src={cliffhanger.characterQuote.avatar}
                alt={cliffhanger.characterQuote.speakerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-[#D4AF37] font-cairo">
                  {cliffhanger.characterQuote.speakerName}
                </span>
                <span className="text-[10px] text-[#E6D2A8]/60">
                  {cliffhanger.characterQuote.speakerTitle}
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#F3E5AB] italic font-amiri leading-snug">
                "{cliffhanger.characterQuote.quoteText}"
              </p>
            </div>
          </div>

          {/* Cliffhanger Question */}
          <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-sm text-center">
            <span className="text-[11px] font-bold text-red-400 block font-cairo mb-0.5">
              السؤال الغامض الذي يؤرق الليل:
            </span>
            <span className="text-xs md:text-sm font-semibold text-[#F3E5AB]">
              {cliffhanger.cliffhangerQuestion}
            </span>
          </div>

          {/* Real Day Wait / Unlocking Box */}
          <div className="p-4 bg-gradient-to-r from-[#181413] via-[#D4AF37]/15 to-[#181413] border border-[#D4AF37]/50 rounded-sm text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#D4AF37] font-cairo">
              <Clock className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
              <span>
                {isNextDayUnlocked
                  ? `اليوم ${nextDayNumber} متاح الآن للاستكمال!`
                  : `موعد استكمال اليوم ${nextDayNumber} (فجر الغد بالتقويم الحقيقي)`}
              </span>
            </div>

            {!isNextDayUnlocked ? (
              <div>
                <div className="text-2xl md:text-3xl font-mono font-black text-[#F3E5AB] tracking-widest my-1 text-shadow">
                  {formatTimeRemaining(secondsRemaining)}
                </div>
                <p className="text-[11px] text-[#E6D2A8]/70">
                  يفتح اليوم الجديد تلقائياً مع حلول منتصف الليل وبداية يوم حقيقي جديد لاستكمال القصة.
                </p>
              </div>
            ) : (
              <div className="py-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  أشرقت شمس اليوم التالي! يمكنك الانتقال للمهمة التالية مباشرة.
                </span>
              </div>
            )}

            {/* Tomorrow Preview Teaser */}
            <div className="mt-3 pt-3 border-t border-[#D4AF37]/20 text-right">
              <span className="text-[11px] font-bold text-[#D4AF37] block font-cairo">
                {cliffhanger.tomorrowPreviewTitle}
              </span>
              <p className="text-xs text-[#E6D2A8]/80 font-amiri mt-0.5">
                {cliffhanger.tomorrowPreviewTeaser}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0F0D0C] border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3">
          {/* Developer / Testing Fast Forward Button */}
          {onAdvanceSimulatedDay && (
            <button
              id="btn-fast-forward-day"
              onClick={() => {
                soundManager.playClickSFX();
                onAdvanceSimulatedDay();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              title="تسريع الوقت لليوم التالي لغرض الاختبار السريع والمعاينة"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>محاكاة حلول الغد (تسريع للاختبار)</span>
            </button>
          )}

          <div className="flex items-center gap-2 mr-auto">
            {isNextDayUnlocked && onStartNextDay && (
              <button
                id="btn-start-next-day"
                onClick={() => {
                  soundManager.playClickSFX();
                  onStartNextDay();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-sm bg-[#D4AF37] hover:bg-[#E5C158] text-[#0F0D0C] font-bold text-xs md:text-sm shadow-lg transition-all active:scale-95 cursor-pointer font-cairo"
              >
                <span>ابدأ اليوم {nextDayNumber} الآن</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <button
              id="btn-close-cliffhanger"
              onClick={() => {
                soundManager.playClickSFX();
                onClose();
              }}
              className="px-5 py-2 rounded-sm border border-[#D4AF37]/60 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#F3E5AB] font-bold text-xs md:text-sm transition-all active:scale-95 cursor-pointer font-cairo"
            >
              تأكيد الاستعداد والغلق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
