import React from 'react';
import { Award, Sparkles, Scroll, RotateCcw, Compass, MapPin, CheckCircle } from 'lucide-react';
import { GameState } from '../types';
import { soundManager } from '../audio/soundManager';

interface VictoryModalProps {
  gameState: GameState;
  onRestart: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ gameState, onRestart, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-[#0F0D0C] border border-[#D4AF37] rounded-sm p-6 md:p-8 shadow-2xl text-center flex flex-col items-center space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none"></div>

        {/* Badge */}
        <div className="relative">
          <div className="w-20 h-20 rounded-sm bg-[#D4AF37]/10 border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center text-[#D4AF37]">
            <Award className="w-10 h-10" />
          </div>
          <Sparkles className="w-5 h-5 text-[#D4AF37] absolute -top-2 -right-2 animate-pulse" />
        </div>

        {/* Title */}
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-3 py-1 rounded-sm border border-[#D4AF37]/40">
            اكتملت المغامرة التاريخية الكبرى
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F3E5AB] font-cairo mt-3 drop-shadow-md">
            المستكشف الأكبر لأرض الكنانة
          </h2>
          <p className="text-sm md:text-base text-[#E6D2A8]/80 font-amiri mt-2 max-w-lg leading-relaxed">
            لقد نجحت في تتبع خطى الفراعنة، جمعت أجزاء بردية تحوت المفقودة من القاهرة وطيبة وأسوان، وفتحت سراديب الأهرام الخفية!
          </p>
        </div>

        {/* Papyrus Scroll Certificate */}
        <div className="w-full bg-[#0F0D0C] border border-[#D4AF37]/40 rounded-sm p-5 text-right font-amiri shadow-md relative overflow-hidden">
          <div className="absolute top-2 left-2 opacity-5 pointer-events-none">
            <Scroll className="w-28 h-28 text-[#D4AF37]" />
          </div>
          <h4 className="text-[#D4AF37] font-bold text-sm mb-2 flex items-center gap-1.5 font-cairo">
            <Scroll className="w-4 h-4 text-[#D4AF37]" />
            <span>نص نبوءة حكماء مصر الخالدة:</span>
          </h4>
          <p className="text-xs md:text-sm text-[#F3E5AB]/90 leading-relaxed italic">
            "طوبى لمن طلب الحكمة قبل الذهب، وسار على ضفاف النيل بقلب نقي وعقلٍ مستنير.. إن أسرار الكنانة لا تُوهب إلا لمن يصونها ويحترم تراث الأجداد. هذا السجل يشهد لك بأنك حامي المعرفة وسفير التاريخ المصري العظيم."
          </p>
        </div>

        {/* Adventure Stats Summary */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <div className="p-3.5 bg-[#0F0D0C] rounded-sm border border-[#D4AF37]/30">
            <span className="text-xl font-bold text-[#D4AF37] font-cairo">
              {gameState.inventory.length}
            </span>
            <span className="text-[11px] text-[#E6D2A8]/60 block mt-0.5 font-cairo">آثار جُمعت</span>
          </div>
          <div className="p-3.5 bg-[#0F0D0C] rounded-sm border border-[#D4AF37]/30">
            <span className="text-xl font-bold text-[#D4AF37] font-cairo">
              {gameState.solvedPuzzles.length}
            </span>
            <span className="text-[11px] text-[#E6D2A8]/60 block mt-0.5 font-cairo">ألغاز فُكّت</span>
          </div>
          <div className="p-3.5 bg-[#0F0D0C] rounded-sm border border-[#D4AF37]/30">
            <span className="text-xl font-bold text-[#D4AF37] font-cairo">4</span>
            <span className="text-[11px] text-[#E6D2A8]/60 block mt-0.5 font-cairo">شخصيات أثرية</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            id="btn-victory-explore"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="w-full sm:flex-1 py-3 rounded-sm bg-[#0F0D0C] hover:bg-[#D4AF37]/10 text-[#E6D2A8] font-bold text-sm border border-[#D4AF37]/30 transition-colors cursor-pointer"
          >
            مواصلة تفقد غرفة الأسرار
          </button>

          <button
            id="btn-victory-restart"
            onClick={() => {
              soundManager.playClickSFX();
              onRestart();
            }}
            className="w-full sm:flex-1 py-3 rounded-sm bg-[#D4AF37] hover:bg-[#E6D2A8] text-[#0F0D0C] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>بدء رحلة جديدة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
