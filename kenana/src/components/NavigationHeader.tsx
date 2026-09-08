import React from 'react';
import { MapPin, Briefcase, BookOpen, Volume2, VolumeX, RotateCcw, Compass, Clock, Sparkles, User, GitBranch, Calendar, Flame, Mail, AlertOctagon, Radio, FlaskConical, Lock, Users, Footprints, Train, Skull } from 'lucide-react';
import { GameLocation, GameState } from '../types';
import { soundManager } from '../audio/soundManager';
import { heroAvatar } from '../data/gameData';

interface NavigationHeaderProps {
  currentLocation: GameLocation;
  gameState: GameState;
  onOpenDailyMissions: () => void;
  onOpenMap: () => void;
  onOpenInventory: () => void;
  onOpenJournal: () => void;
  onOpenCharacterCustomizer: () => void;
  onOpenEvidenceBoard: () => void;
  onOpenTelegrams?: () => void;
  onOpenRadioScanner?: () => void;
  onOpenForensicLab?: () => void;
  onOpenSafeCracking?: () => void;
  onOpenSuspects?: () => void;
  onOpenStealth?: () => void;
  onOpenNileTrain?: () => void;
  onOpenCurseTrial?: () => void;
  onTriggerEmergencyTrap?: () => void;
  onRestartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentLocation,
  gameState,
  onOpenDailyMissions,
  onOpenMap,
  onOpenInventory,
  onOpenJournal,
  onOpenCharacterCustomizer,
  onOpenEvidenceBoard,
  onOpenTelegrams,
  onOpenRadioScanner,
  onOpenForensicLab,
  onOpenSafeCracking,
  onOpenSuspects,
  onOpenStealth,
  onOpenNileTrain,
  onOpenCurseTrial,
  onTriggerEmergencyTrap,
  onRestartGame,
  isMuted,
  onToggleMute,
}) => {
  const chapterNames = ['خان الخليلي', 'معبد الكرنك', 'نيل أسوان', 'أهرام الجيزة', 'غرفة الأسرار'];
  const threatLevel = gameState.threatLevel ?? 35;
  const unreadTelegrams = gameState.unreadTelegramsCount ?? (gameState.secretTelegrams?.length || 1);

  return (
    <header className="relative z-30 w-full border-b border-[#D4AF37]/30 bg-[#0F0D0C]/90 backdrop-blur-md px-4 md:px-8 py-3 text-[#E6D2A8] shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Location & Time in Geometric Balance layout */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          {/* Geometric Compass Badge */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border border-[#D4AF37]/40 rounded-sm bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.15)]">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] opacity-70">
                الموقع الحالي
              </span>
              <span className="text-base md:text-lg font-bold tracking-wide text-[#F3E5AB] font-cairo">
                {currentLocation.title}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-[#D4AF37]/20 hidden sm:block"></div>

          {/* Time & Region metadata */}
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] opacity-70">
              الإقليم والتوقيت
            </span>
            <span className="text-xs md:text-sm font-semibold tracking-wide text-[#E6D2A8]">
              {currentLocation.region} | الغروب
            </span>
          </div>

          {/* Mobile Audio toggle */}
          <button
            id="mobile-audio-toggle"
            onClick={onToggleMute}
            className="md:hidden p-2 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: Active Quest & Chapter Path (Geometric Indicator) */}
        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-2.5 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-sm bg-[#D4AF37]/5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></div>
            <span className="text-xs font-semibold tracking-wider text-[#F3E5AB]">
              المهمة النشطة: البحث عن أجزاء البردية
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {chapterNames.map((name, index) => {
              const stepNum = index + 1;
              const isCurrent = gameState.chapter === stepNum;
              const isCompleted = gameState.chapter > stepNum;

              return (
                <React.Fragment key={name}>
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-sm border transition-all ${
                      isCurrent
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0F0D0C] font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                        : isCompleted
                        ? 'border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37]'
                        : 'border-[#D4AF37]/10 text-[#E6D2A8]/40'
                    }`}
                  >
                    <span className="text-[10px]">{stepNum}.</span>
                    <span className="text-xs">{name}</span>
                  </div>
                  {index < chapterNames.length - 1 && (
                    <span className="text-[#D4AF37]/40 text-[11px]">←</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right: Gold status badge & Geometric Tool Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {/* Artifacts / Relics Counter Badge matching "Geometric Balance" */}
          <div className="hidden sm:flex items-center gap-2.5 border border-[#D4AF37]/40 px-3 py-1.5 rounded-sm bg-[#D4AF37]/5">
            <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] opacity-70">الآثار</span>
            <span className="text-sm font-bold text-[#D4AF37]">{gameState.inventory.length}/5</span>
          </div>

          {/* Daily Missions 5-Day Real Expedition Button */}
          <button
            id="btn-open-daily-missions"
            onClick={() => {
              soundManager.playClickSFX();
              onOpenDailyMissions();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-sm border border-amber-500/60 bg-gradient-to-r from-amber-950/40 to-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#F3E5AB] text-xs md:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-md shrink-0"
            title="المهام اليومية الطويلة (رحلة الـ 5 أيام الحقيقية)"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">المهام اليومية</span>
            <span className="xs:hidden">المهام</span>
            <span className="text-[10px] bg-amber-400 text-[#0F0D0C] font-black px-1 rounded-xs">
              اليوم {gameState.dailyProgress?.activeDay || 1}
            </span>
          </button>

          {/* Map Button */}
          <button
            id="btn-open-map"
            onClick={() => {
              soundManager.playClickSFX();
              onOpenMap();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#E6D2A8] hover:text-[#F3E5AB] text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>الخريطة</span>
          </button>

          {/* Inventory Button */}
          <button
            id="btn-open-inventory"
            onClick={() => {
              soundManager.playClickSFX();
              onOpenInventory();
            }}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#E6D2A8] hover:text-[#F3E5AB] text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>الحقيبة</span>
            <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#0F0D0C] text-[10px] font-black flex items-center justify-center -mr-0.5">
              {gameState.inventory.length}
            </span>
          </button>

          {/* Journal Button */}
          <button
            id="btn-open-journal"
            onClick={() => {
              soundManager.playClickSFX();
              onOpenJournal();
            }}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#E6D2A8] hover:text-[#F3E5AB] text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>المفكرة</span>
            {gameState.discoveredClues.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37] absolute top-1 left-1 animate-ping"></span>
            )}
          </button>

          {/* Character & Skills Profile Button */}
          <button
            id="btn-open-character"
            onClick={() => {
              soundManager.playClickSFX();
              onOpenCharacterCustomizer();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#F3E5AB] text-xs md:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            title="تخصيص المستكشف ونظام تطوير المهارات المصرية"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-[#D4AF37] shrink-0">
              <img
                src={heroAvatar}
                alt="المستكشف"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:inline">{gameState.player?.name ? gameState.player.name.split(' ')[0] : 'المستكشف'}</span>
            <span className="sm:hidden">الشخصية</span>
            <span className="text-[10px] bg-[#D4AF37] text-[#0F0D0C] font-bold px-1 rounded-xs">
              {gameState.skills ? Math.round((gameState.skills.negotiation + gameState.skills.exploration + gameState.skills.defense) / 3) : 25}%
            </span>
          </button>

          {/* Investigation & Evidence Board Button */}
          <button
            id="btn-open-evidence-board"
            onClick={() => {
              soundManager.playClickSFX();
              onOpenEvidenceBoard();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-amber-500/50 bg-amber-950/30 hover:bg-amber-950/60 text-amber-300 text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
            title="لوحة التحقيق الجنائي وربط خيوط الأدلة"
          >
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">لوحة الأدلة والتحقيق</span>
            <span className="sm:hidden">التحقيق</span>
            {gameState.solvedDeductions && gameState.solvedDeductions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/50">
                {gameState.solvedDeductions.length}
              </span>
            )}
          </button>

          {/* Secret Telegrams Button */}
          {onOpenTelegrams && (
            <button
              id="btn-open-telegrams"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenTelegrams();
              }}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-[#D4AF37]/50 bg-black/60 hover:bg-[#D4AF37]/20 text-[#F3E5AB] text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
              title="البرقيات السرية والمعترضة"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">البرقيات</span>
              {unreadTelegrams > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center -mr-0.5 animate-bounce">
                  {unreadTelegrams}
                </span>
              )}
            </button>
          )}

          {/* Tactical Spy Radio Scanner Button */}
          {onOpenRadioScanner && (
            <button
              id="btn-open-radio-scanner"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenRadioScanner();
              }}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm group"
              title="جهاز التنصت اللاسلكي ورصد موجات المهربين ومورس"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">جهاز الراديو</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>
          )}

          {/* Forensic Artifact Lab Button */}
          {onOpenForensicLab && (
            <button
              id="btn-open-forensic-lab"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenForensicLab();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-[#D4AF37]/60 bg-black/60 hover:bg-[#D4AF37]/20 text-[#F3E5AB] text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm group"
              title="معمل التحليل الجنائي الأثري (فحص UV، البصمات، الكيمياء)"
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">المعمل الجنائي</span>
            </button>
          )}

          {/* Safe Cracking Mini-Game Button */}
          {onOpenSafeCracking && (
            <button
              id="btn-open-safe-cracking"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenSafeCracking();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-amber-500/50 bg-amber-950/30 hover:bg-amber-900/40 text-amber-200 text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
              title="خزينة الباشا الحديدية وفك شفرة الأرقام السرية"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">الخزينة</span>
            </button>
          )}

          {/* Suspects & Interrogation Button */}
          {onOpenSuspects && (
            <button
              id="btn-open-suspects"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenSuspects();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-blue-500/50 bg-blue-950/30 hover:bg-blue-900/40 text-blue-200 text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
              title="شجرة المشتبه بهم وغرفة التحقيق وانتزاع الاعترافات"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">المشتبه بهم</span>
            </button>
          )}

          {/* Stealth Infiltration Button */}
          {onOpenStealth && (
            <button
              id="btn-open-stealth"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenStealth();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-purple-500/50 bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
              title="مهمة التسلل في الظلال وتفادي الحراس"
            >
              <Footprints className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">التسلل</span>
            </button>
          )}

          {/* Nile Train Roof Chase Button */}
          {onOpenNileTrain && (
            <button
              id="btn-open-nile-train"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenNileTrain();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-orange-500/50 bg-orange-950/30 hover:bg-orange-900/40 text-orange-200 text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
              title="مطاردة قطار الصعيد السريع والاشتباك فوق الأسطح"
            >
              <Train className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">قطار الصعيد</span>
            </button>
          )}

          {/* Pharaoh Curse Time Trial Button */}
          {onOpenCurseTrial && (
            <button
              id="btn-open-curse-trial"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenCurseTrial();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-red-500/60 bg-red-950/40 hover:bg-red-900/50 text-red-200 text-xs md:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
              title="لعنة الفراعنة: مصيدة الغاز والجرانيت السريعة"
            >
              <Skull className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">لعنة الفراعنة</span>
            </button>
          )}

          {/* High-Stakes Emergency Trap Button */}
          {onTriggerEmergencyTrap && (
            <button
              id="btn-open-emergency-trap"
              onClick={() => {
                soundManager.playClickSFX();
                onTriggerEmergencyTrap();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-sm border border-red-500/70 bg-gradient-to-r from-red-950/70 to-red-900/40 hover:bg-red-800/60 text-red-200 text-xs md:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse"
              title="مواجهة فخاخ المهربين والهروب السريع مع الوقت"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">فخ طارئ!</span>
              <span className="text-[10px] font-black px-1 rounded-xs bg-red-600 text-white">
                {threatLevel}%
              </span>
            </button>
          )}

          <div className="h-6 w-px bg-[#D4AF37]/20 mx-1 hidden md:block" />

          {/* Desktop Audio Toggle */}
          <button
            id="desktop-audio-toggle"
            onClick={onToggleMute}
            className="hidden md:flex items-center p-2 rounded-sm border border-[#D4AF37]/30 bg-[#0F0D0C]/80 hover:bg-[#D4AF37]/10 text-[#D4AF37] transition-colors"
            title={isMuted ? 'تشغيل الموسيقى والمؤثرات' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Restart Button */}
          <button
            id="btn-restart-game"
            onClick={() => {
              if (window.confirm('هل تود إعادة المغامرة من خان الخليلي؟')) {
                soundManager.playClickSFX();
                onRestartGame();
              }
            }}
            className="p-2 rounded-sm border border-[#D4AF37]/20 bg-[#0F0D0C]/80 hover:bg-red-950/40 hover:border-red-500/40 text-[#E6D2A8]/60 hover:text-red-300 transition-colors"
            title="إعادة المغامرة من البداية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

