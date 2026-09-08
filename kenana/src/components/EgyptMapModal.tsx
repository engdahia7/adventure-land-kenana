import React from 'react';
import { X, MapPin, CheckCircle, Lock, Navigation, Sparkles } from 'lucide-react';
import { GameLocationId, GameState } from '../types';
import { gameLocations } from '../data/gameData';
import { soundManager } from '../audio/soundManager';

interface EgyptMapModalProps {
  currentLocationId: GameLocationId;
  gameState: GameState;
  onClose: () => void;
  onSelectLocation: (locId: GameLocationId) => void;
}

export const EgyptMapModal: React.FC<EgyptMapModalProps> = ({
  currentLocationId,
  gameState,
  onClose,
  onSelectLocation,
}) => {
  const mapNodes = [
    {
      id: 'cairo',
      title: 'القاهرة - خان الخليلي',
      region: 'شمال مصر - الدلتا',
      desc: 'سوق الآثار والمخطوطات القديمة، بداية خيط اللغز مع العم رضوان.',
      top: '25%',
      left: '60%',
      chapter: 1,
    },
    {
      id: 'giza',
      title: 'الجيزة - سراديب الأهرام',
      region: 'هضبة الأهرام وأبو الهول',
      desc: 'بوابة السرداب ذات الأختام الأربعة ومقر الشيخ منصور.',
      top: '32%',
      left: '52%',
      chapter: 4,
    },
    {
      id: 'luxor',
      title: 'الأقصر - معبد الكرنك',
      region: 'صعيد مصر - طيبة القديمة',
      desc: 'صالة الأعمدة ومسلة حتشبسوت مع عالمة المصريات د. ليلى فؤاد.',
      top: '65%',
      left: '66%',
      chapter: 2,
    },
    {
      id: 'aswan',
      title: 'أسوان - جزيرة الفنتين',
      region: 'أقصى الجنوب - الشلال الأول',
      desc: 'فلوكة النيل والرصد النجمي مع الريس سلامة النوبي.',
      top: '84%',
      left: '70%',
      chapter: 3,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-[#0F0D0C] border border-[#D4AF37]/50 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Subtle Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/30 bg-[#0F0D0C]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F3E5AB] font-cairo">
                خريطة وادي النيل الأثرية
              </h3>
              <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-0.5">
                تنقل بين المعالم التاريخية على امتداد نهر النيل الخالد
              </p>
            </div>
          </div>

          <button
            id="btn-close-map"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Body */}
        <div className="relative flex-1 p-6 overflow-y-auto bg-[#0F0D0C] flex flex-col md:flex-row gap-6">
          {/* Map Graphical Canvas representation */}
          <div className="relative flex-1 min-h-[360px] md:min-h-[440px] bg-[#0F0D0C] rounded-sm border border-[#D4AF37]/30 p-4 overflow-hidden geometric-grid-pattern">
            {/* The River Nile visual vector line */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              {/* Mediterranean Sea top curves */}
              <path
                d="M 20,5 Q 50,15 80,5"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              {/* Delta Branches */}
              <path
                d="M 50,15 Q 45,22 55,27"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <path
                d="M 65,15 Q 62,22 55,27"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              {/* Main River Nile Spine */}
              <path
                d="M 55,27 Q 53,45 60,60 Q 66,70 65,85"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                className="drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]"
              />
            </svg>

            <div className="absolute top-3 right-4 text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 border border-[#D4AF37]/30 px-2.5 py-1 rounded-sm bg-[#0F0D0C]/80">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse"></span>
              <span>مجرى نهر النيل الخالد</span>
            </div>

            {/* Map Location Pins */}
            {mapNodes.map((node) => {
              const isUnlocked = gameState.unlockedLocations.includes(node.id as GameLocationId);
              const isCurrent = currentLocationId === node.id;

              return (
                <div
                  key={node.id}
                  style={{ top: node.top, left: node.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                >
                  <button
                    id={`map-node-${node.id}`}
                    onClick={() => {
                      if (isUnlocked) {
                        soundManager.playClickSFX();
                        onSelectLocation(node.id as GameLocationId);
                        onClose();
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`relative p-3 rounded-sm flex items-center justify-center transition-all duration-300 shadow-xl border cursor-pointer ${
                      isCurrent
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0F0D0C] scale-110 shadow-[0_0_15px_#D4AF37]'
                        : isUnlocked
                        ? 'border-[#D4AF37]/60 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#F3E5AB] hover:scale-105'
                        : 'border-white/10 bg-white/5 text-[#E6D2A8]/30 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isCurrent ? (
                      <MapPin className="w-5 h-5 font-black" />
                    ) : isUnlocked ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </button>

                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0F0D0C]/95 border border-[#D4AF37]/40 px-2.5 py-1 rounded-sm text-[11px] font-bold text-[#F3E5AB] pointer-events-none shadow-md">
                    {node.title.split(' - ')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Location Details Side List */}
          <div className="w-full md:w-80 flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] opacity-80">
              المحطات الأثرية على خط الرحلة:
            </span>

            {mapNodes.map((node) => {
              const isUnlocked = gameState.unlockedLocations.includes(node.id as GameLocationId);
              const isCurrent = currentLocationId === node.id;
              const locData = gameLocations.find((l) => l.id === node.id);

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    if (isUnlocked) {
                      soundManager.playClickSFX();
                      onSelectLocation(node.id as GameLocationId);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-sm border transition-all flex items-center gap-3 ${
                    isCurrent
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-md'
                      : isUnlocked
                      ? 'bg-[#0F0D0C] border-[#D4AF37]/30 hover:border-[#D4AF37]/70 cursor-pointer'
                      : 'bg-[#0F0D0C]/50 border-white/10 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Location Cartoon Thumbnail Preview */}
                  {locData && (
                    <div className="relative w-14 h-14 rounded-xs overflow-hidden border border-[#D4AF37]/40 shrink-0">
                      <img
                        src={locData.imageSrc}
                        alt={locData.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {locData.characters.length > 0 && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border border-[#D4AF37] overflow-hidden bg-[#0F0D0C]">
                          <img
                            src={locData.characters[0].avatar}
                            alt={locData.characters[0].name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-1">
                      <h4 className="text-xs md:text-sm font-bold text-[#F3E5AB] font-cairo truncate">
                        {node.title}
                      </h4>
                      {isCurrent ? (
                        <span className="text-[9px] bg-[#D4AF37] text-[#0F0D0C] px-1.5 py-0.2 rounded-xs font-black shrink-0">
                          أنت هنا
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[9px] text-[#D4AF37] border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-1.5 py-0.2 rounded-xs shrink-0">
                          سفر
                        </span>
                      ) : (
                        <span className="text-[9px] text-[#E6D2A8]/40 flex items-center gap-0.5 shrink-0">
                          <Lock className="w-2.5 h-2.5" /> مقفل
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#E6D2A8]/70 font-amiri leading-tight line-clamp-2">
                      {node.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
