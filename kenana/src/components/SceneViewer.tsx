import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Key,
  Search,
  Sparkles,
  Sun,
  Compass,
  ShieldAlert,
  Award,
  GitBranch,
  Eye,
  Info,
  ChevronLeft,
  Calendar,
  Wind,
  Sunset,
  CloudRain,
  Moon,
  Thermometer,
  Shield,
  Layers,
  ChevronDown,
  AlertOctagon,
  Mail,
  Flame,
  Radio,
} from 'lucide-react';
import { GameLocation, Hotspot, WeatherType, GameLocationId } from '../types';
import { soundManager } from '../audio/soundManager';
import { WeatherParticleCanvas } from './WeatherParticleCanvas';
import { weatherConditionsData, defaultLocationWeather } from '../data/weatherData';

interface SceneViewerProps {
  location: GameLocation;
  threatLevel?: number;
  unreadTelegramsCount?: number;
  onSelectHotspot: (hotspot: Hotspot) => void;
  onOpenDialogue: (characterId: string) => void;
  onOpenPuzzle: (puzzleId: string) => void;
  onOpenEvidenceBoard?: () => void;
  onTriggerAdventureEvent?: () => void;
  onTriggerEmergencyTrap?: (trapId?: string) => void;
  onOpenTelegrams?: () => void;
  onOpenRadioScanner?: () => void;
  onTriggerPursuit?: () => void;
  dailyMissionSummary?: {
    dayNumber: number;
    dayTitle: string;
    stageNumber: number;
    stageTitle: string;
    isDayCompleted: boolean;
  };
  onOpenDailyMissions?: () => void;
}

export const SceneViewer: React.FC<SceneViewerProps> = ({
  location,
  threatLevel = 35,
  unreadTelegramsCount = 1,
  onSelectHotspot,
  onOpenDialogue,
  onOpenPuzzle,
  onOpenEvidenceBoard,
  onTriggerAdventureEvent,
  onTriggerEmergencyTrap,
  onOpenTelegrams,
  onOpenRadioScanner,
  onTriggerPursuit,
  dailyMissionSummary,
  onOpenDailyMissions,
}) => {
  // Weather state synchronized with current location or custom chosen
  const initialWeather: WeatherType =
    defaultLocationWeather[location.id as GameLocationId] || 'sandstorm';
  const [currentWeather, setCurrentWeather] = useState<WeatherType>(initialWeather);
  const [showWeatherMenu, setShowWeatherMenu] = useState<boolean>(false);

  // Update weather when location changes
  useEffect(() => {
    const locWeather = defaultLocationWeather[location.id as GameLocationId] || 'sandstorm';
    setCurrentWeather(locWeather);
  }, [location.id]);

  const weatherConfig = weatherConditionsData[currentWeather] || weatherConditionsData.sandstorm;

  const renderWeatherIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Wind':
        return <Wind className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'Sunset':
        return <Sunset className={className} />;
      case 'CloudRain':
        return <CloudRain className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      default:
        return <Wind className={className} />;
    }
  };

  const renderHotspotIcon = (iconName: string) => {
    const className = 'w-5 h-5';
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'Key':
        return <Key className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Eye':
        return <Eye className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] md:min-h-[680px] flex flex-col justify-between overflow-hidden bg-[#0F0D0C] select-none">
      {/* Background Cinematic Artwork & Atmospheric Weather Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src={location.imageSrc}
          alt={location.title}
          referrerPolicy="no-referrer"
          style={{ filter: weatherConfig.filterStyle }}
          className="w-full h-full object-cover object-center transition-all duration-1000 scale-100"
        />

        {/* Dynamic Weather Color Tint Overlay */}
        <div
          className={`absolute inset-0 transition-all duration-1000 pointer-events-none ${weatherConfig.overlayClass}`}
        />

        {/* Geometric Balance Vignette and Radial Atmospheric Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0C] via-transparent to-[#0F0D0C]/75 pointer-events-none" />
        <div className="absolute inset-0 bg-[#D4AF37]/5 mix-blend-color-dodge pointer-events-none torch-glow" />
        <div className="absolute inset-0 geometric-grid-pattern pointer-events-none opacity-40" />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(15,13,12,0.9)] pointer-events-none" />

        {/* Canvas Particle Weather Simulation (Sandstorm, heat shimmer, dust, stars) */}
        <div className="absolute inset-0 z-5 pointer-events-none">
          <WeatherParticleCanvas weather={currentWeather} density={70} />
        </div>

        {/* Geometric Precision Framing Border */}
        <div className="absolute inset-4 md:inset-6 border border-[#D4AF37]/20 pointer-events-none z-10">
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]"></div>
        </div>
      </div>

      {/* Top Location Information Banner, Weather HUD & Daily Mission HUD */}
      <div className="relative z-10 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pointer-events-none">
        {/* Left: Location Banner */}
        <div className="bg-[#0F0D0C]/90 backdrop-blur-md p-3.5 md:p-4 rounded-sm border border-[#D4AF37]/30 shadow-2xl pointer-events-auto max-w-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
              {location.region}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[#F3E5AB] font-cairo drop-shadow-md">
            {location.title}
          </h2>
          <p className="text-xs text-[#E6D2A8]/80 font-amiri mt-0.5 leading-relaxed">
            {location.subtitle}
          </p>
        </div>

        {/* Right Controls: Weather System HUD & Daily Mission */}
        <div className="flex items-center gap-2.5 flex-wrap pointer-events-auto">
          {/* Dynamic Weather HUD Control */}
          <div className="relative">
            <button
              id="hud-weather-toggle"
              onClick={() => {
                soundManager.playClickSFX();
                setShowWeatherMenu(!showWeatherMenu);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-sm bg-[#0F0D0C]/90 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-right shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer text-xs group"
              title="تغيير الطقس الديناميكي وتأثيرات الإضاءة"
            >
              <div className="w-7 h-7 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 group-hover:rotate-12 transition-transform">
                {renderWeatherIcon(weatherConfig.iconName, 'w-4 h-4')}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#D4AF37] font-bold font-cairo">
                    {weatherConfig.arabicName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#D4AF37] opacity-70" />
                </div>
                <div className="text-[9px] text-[#E6D2A8]/70 font-amiri flex items-center gap-1">
                  <span>{weatherConfig.temperature}</span>
                  <span>•</span>
                  <span>{weatherConfig.windSpeed}</span>
                </div>
              </div>
            </button>

            {/* Weather Selection Menu Dropdown */}
            {showWeatherMenu && (
              <div className="absolute left-0 sm:right-0 mt-2 w-64 bg-[#0F0D0C]/98 border border-[#D4AF37]/60 rounded-sm shadow-2xl backdrop-blur-xl p-2 z-50 animate-fadeIn space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold text-[#D4AF37] border-b border-[#D4AF37]/20 flex items-center justify-between font-cairo">
                  <span>أحوال الطقس والبيئة الأثرية</span>
                  <span className="text-[9px] text-[#E6D2A8]/60">طقس ديناميكي</span>
                </div>
                {(Object.keys(weatherConditionsData) as WeatherType[]).map((wKey) => {
                  const w = weatherConditionsData[wKey];
                  const isSelected = currentWeather === wKey;
                  return (
                    <button
                      key={wKey}
                      id={`weather-option-${wKey}`}
                      onClick={() => {
                        soundManager.playClickSFX();
                        setCurrentWeather(wKey);
                        setShowWeatherMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xs text-right text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F3E5AB] font-bold'
                          : 'hover:bg-white/5 border border-transparent text-[#E6D2A8]/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#D4AF37]">{renderWeatherIcon(w.iconName, 'w-3.5 h-3.5')}</span>
                        <span className="font-cairo text-xs">{w.arabicName}</span>
                      </div>
                      <span className="text-[10px] text-[#E6D2A8]/60">{w.temperature}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily Mission Floating HUD Tracker */}
          {dailyMissionSummary && onOpenDailyMissions && (
            <button
              id="hud-daily-mission-tracker"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenDailyMissions();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-sm bg-[#0F0D0C]/90 border border-amber-500/50 hover:border-amber-400 text-right shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer max-w-xs group"
              title="انقر لعرض تفاصيل المهمة اليومية ومراحل اليوم"
            >
              <div className="w-7 h-7 rounded-sm bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-amber-300 font-cairo">
                    {dailyMissionSummary.isDayCompleted
                      ? `اكتمل اليوم ${dailyMissionSummary.dayNumber} ✅`
                      : `اليوم ${dailyMissionSummary.dayNumber}`}
                  </span>
                  <span className="text-[9px] text-[#E6D2A8]/60 group-hover:text-[#F3E5AB]">المهام ↵</span>
                </div>
                <p className="text-xs font-semibold text-[#F3E5AB] font-cairo truncate">
                  {dailyMissionSummary.isDayCompleted ? 'نقطة التشويق' : dailyMissionSummary.stageTitle}
                </p>
              </div>
            </button>
          )}

          {/* Threat & Pursuit Level HUD */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#0F0D0C]/90 border border-red-500/40 text-right shadow-xl backdrop-blur-md">
            <Flame className={`w-4 h-4 ${threatLevel > 60 ? 'text-red-500 animate-bounce' : 'text-amber-400'}`} />
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-red-300 font-bold font-cairo">الخطر والمطاردة:</span>
                <span className="text-[10px] font-bold text-white font-cairo">{threatLevel}%</span>
              </div>
              <div className="w-20 bg-black/80 rounded-full h-1.5 overflow-hidden border border-white/10 mt-0.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    threatLevel > 70 ? 'bg-red-500' : threatLevel > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${threatLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Tactical Radio Scanner Button */}
          {onOpenRadioScanner && (
            <button
              id="scene-btn-radio-scanner"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenRadioScanner();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-sm bg-[#0F0D0C]/90 border border-emerald-500/50 hover:border-emerald-400 text-right shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
              title="فتح جهاز التنصت اللاسلكي ورصد إشارات مورس وترددات المهربين"
            >
              <div className="w-7 h-7 rounded-sm bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 group-hover:rotate-12 transition-transform">
                <Radio className="w-4 h-4" />
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-bold text-emerald-300 font-cairo block leading-none">
                  جهاز الراديو
                </span>
                <span className="text-[9px] text-[#E6D2A8]/70 font-mono">
                  رصد الترددات
                </span>
              </div>
            </button>
          )}

          {/* High Pursuit Alert Trigger Button */}
          {threatLevel >= 50 && onTriggerPursuit && (
            <button
              id="scene-btn-trigger-pursuit"
              onClick={() => {
                soundManager.playClickSFX();
                onTriggerPursuit();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-sm bg-gradient-to-r from-red-950/90 to-red-900/90 border-2 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] backdrop-blur-md transition-all active:scale-95 cursor-pointer animate-pulse"
              title="اشتباك ومواجهة سريعة مع مطاردي شبكة العقرب"
            >
              <AlertOctagon className="w-4 h-4 text-red-300 animate-bounce" />
              <div className="text-right">
                <span className="text-[10px] font-black text-white font-cairo block leading-none">
                  كمين وشيك!
                </span>
                <span className="text-[9px] text-red-200 font-cairo">
                  مواجهة المطاردين ↵
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* High-Tension Red Danger Vignette Overlay */}
      {threatLevel > 60 && (
        <div className="absolute inset-0 pointer-events-none z-15 shadow-[inset_0_0_90px_rgba(220,38,38,0.4)] animate-pulse" />
      )}

      {/* Interactive Hotspots Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {location.hotspots.map((spot) => {
          const isTrap = spot.actionType === 'trap';
          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
            >
              {/* Geometric Pulsing Aura Rings */}
              <div
                className={`absolute -inset-3 rounded-full animate-ping duration-1000 opacity-60 pointer-events-none ${
                  isTrap ? 'bg-red-600/40' : 'bg-[#D4AF37]/20'
                }`}
              />
              <div
                className={`absolute -inset-1 rounded-full blur-xs pointer-events-none ${
                  isTrap ? 'bg-red-500/40' : 'bg-[#D4AF37]/30'
                }`}
              />

              {/* Interactive Button */}
              <button
                id={`hotspot-${spot.id}`}
                onClick={() => {
                  soundManager.playClickSFX();
                  if (isTrap && onTriggerEmergencyTrap) {
                    onTriggerEmergencyTrap(spot.targetId);
                  } else {
                    onSelectHotspot(spot);
                  }
                }}
                className={`relative w-12 h-12 md:w-13 md:h-13 rounded-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ${
                  isTrap
                    ? 'border-2 border-red-500 bg-gradient-to-br from-red-600 via-red-900 to-black text-white shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse'
                    : 'border border-[#D4AF37] bg-gradient-to-br from-[#D4AF37] via-[#b8972f] to-[#785e17] text-[#0F0D0C] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                }`}
                title={spot.title}
              >
                {isTrap ? <AlertOctagon className="w-5 h-5 text-red-200" /> : renderHotspotIcon(spot.iconName)}
              </button>

              {/* Geometric Tooltip Label */}
              <div
                className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 md:w-56 rounded-sm p-3 shadow-2xl backdrop-blur-md text-center z-30 ${
                  isTrap
                    ? 'bg-[#180907]/98 border border-red-500/80 text-red-200'
                    : 'bg-[#0F0D0C]/95 border border-[#D4AF37]/50'
                }`}
              >
                <p className={`text-xs font-bold font-cairo ${isTrap ? 'text-red-300' : 'text-[#F3E5AB]'}`}>
                  {spot.title}
                </p>
                <p className="text-[11px] text-[#E6D2A8]/80 font-amiri mt-1 line-clamp-2 leading-tight">
                  {spot.description}
                </p>
                <div
                  className={`mt-2 flex items-center justify-center gap-1.5 text-[10px] font-semibold py-0.5 rounded-sm border ${
                    isTrap
                      ? 'border-red-500/50 bg-red-950/50 text-red-300'
                      : 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isTrap ? 'bg-red-400' : 'bg-[#D4AF37]'}`} />
                  <span>{isTrap ? '⚠️ خطر فخ داهم!' : 'انقر للتفاعل'}</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Scene Control Bar */}
      <div className="relative z-10 p-4 md:p-6 flex flex-col md:flex-row items-end md:items-center justify-between gap-3 bg-gradient-to-t from-[#0F0D0C] via-[#0F0D0C]/85 to-transparent pt-12 border-t border-[#D4AF37]/10">
        <div className="text-xs text-[#E6D2A8]/70 flex items-center gap-2 bg-[#0F0D0C]/80 px-3.5 py-1.5 rounded-sm border border-[#D4AF37]/20 backdrop-blur-sm">
          <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span className="font-amiri">انقر على النقاط المتوهجة لفحص المعالم، حل الألغاز، أو التحدث مع الشخصيات.</span>
        </div>

        {/* Quick Location Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Dynamic Adventure Event Trigger Button */}
          {onTriggerAdventureEvent && (
            <button
              id="btn-quick-adventure-event"
              onClick={() => {
                soundManager.playClickSFX();
                onTriggerAdventureEvent();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-sm border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-bold text-xs md:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              title="بدء مغامرة استكشافية ومواقف اتخاذ قرار"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>مغامرة وتحدي استكشافي</span>
            </button>
          )}

          {/* High-Stakes Emergency Trap Challenge Button */}
          {onTriggerEmergencyTrap && (
            <button
              id="btn-quick-emergency-trap"
              onClick={() => {
                soundManager.playClickSFX();
                onTriggerEmergencyTrap();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-sm border border-red-500/80 bg-gradient-to-r from-red-950/80 via-red-900/50 to-black hover:bg-red-800/70 text-red-200 font-bold text-xs md:text-sm shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all cursor-pointer animate-pulse"
              title="مواجهة فخ طارئ وسباق هروب سريع مع الوقت"
            >
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
              <span>⚡ مواجهة فخ طارئ</span>
            </button>
          )}

          {/* Intercepted Secret Telegrams Reader Button */}
          {onOpenTelegrams && (
            <button
              id="btn-quick-telegrams"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenTelegrams();
              }}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-sm border border-[#D4AF37]/50 bg-black/70 hover:bg-[#D4AF37]/20 text-[#F3E5AB] font-bold text-xs md:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              title="قراءة البرقيات المشفرة والرسائل المعترضة"
            >
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>البرقيات السرية</span>
              {(unreadTelegramsCount ?? 0) > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center -mr-1 animate-bounce">
                  {unreadTelegramsCount}
                </span>
              )}
            </button>
          )}

          {location.characters.length > 0 && (
            <button
              id="btn-quick-talk"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenDialogue(location.characters[0].id);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#D4AF37]/80 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#F3E5AB] font-bold text-xs md:text-sm shadow-lg active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform">
                <img
                  src={location.characters[0].avatar}
                  alt={location.characters[0].name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>حوار مع {location.characters[0].name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#0F0D0C] text-[#D4AF37] border border-[#D4AF37]/40 hidden sm:inline">زي فرعوني</span>
            </button>
          )}

          {location.hotspots.some((h) => h.actionType === 'puzzle') && (
            <button
              id="btn-quick-puzzle"
              onClick={() => {
                soundManager.playClickSFX();
                const puzzleHotspot = location.hotspots.find((h) => h.actionType === 'puzzle');
                if (puzzleHotspot && puzzleHotspot.targetId) {
                  onOpenPuzzle(puzzleHotspot.targetId);
                }
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-sm border border-white/20 bg-white/5 hover:bg-white/10 text-[#E6D2A8] font-bold text-xs md:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Key className="w-4 h-4 text-[#D4AF37]" />
              <span>حل لغز الموقع</span>
            </button>
          )}

          {onOpenEvidenceBoard && (
            <button
              id="btn-quick-evidence-board"
              onClick={() => {
                soundManager.playClickSFX();
                onOpenEvidenceBoard();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-sm border border-amber-500/50 bg-amber-950/40 hover:bg-amber-950/60 text-amber-300 font-bold text-xs md:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <GitBranch className="w-4 h-4 text-amber-400" />
              <span>لوحة ربط الأدلة والتحقيق</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
