import React, { useState, useEffect } from 'react';
import { DailyMission, DailyProgressState, GameLocationId } from '../types';
import { dailyMissions, getSecondsUntilNextRealDay, formatTimeRemaining } from '../data/dailyMissionsData';
import { soundManager } from '../audio/soundManager';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Flame,
  ChevronLeft,
  FastForward,
  RotateCcw,
  Sparkles,
  MapPin,
  MessageSquare,
  Key,
  Shield,
  Eye,
  Award,
} from 'lucide-react';

interface DailyMissionsModalProps {
  progress: DailyProgressState;
  onClose: () => void;
  onNavigateToStage: (locationId: GameLocationId, actionType: string, targetId?: string) => void;
  onShowCliffhanger: (dayNumber: number) => void;
  onAdvanceSimulatedDay: () => void;
  onResetDailyProgress: () => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  progress,
  onClose,
  onNavigateToStage,
  onShowCliffhanger,
  onAdvanceSimulatedDay,
  onResetDailyProgress,
}) => {
  const [selectedDayNum, setSelectedDayNum] = useState<number>(progress.activeDay || 1);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(getSecondsUntilNextRealDay());

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(getSecondsUntilNextRealDay());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedMission = dailyMissions.find((m) => m.dayNumber === selectedDayNum) || dailyMissions[0];
  const selectedDayProgress = progress.days[selectedDayNum] || {
    dayNumber: selectedDayNum,
    status: 'locked',
    completedStages: [],
    cliffhangerSeen: false,
  };

  const isCompleted = selectedDayProgress.status === 'completed';
  const isUnlocked = selectedDayProgress.status === 'unlocked' || selectedDayProgress.status === 'in_progress';
  const isLocked = selectedDayProgress.status === 'locked';

  // Overall statistics
  const totalCompletedDays = (Object.values(progress.days) as { status: string }[]).filter(
    (d) => d?.status === 'completed'
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#120F0E] border-2 border-[#D4AF37] rounded-sm shadow-[0_0_40px_rgba(212,175,55,0.2)] flex flex-col max-h-[92vh] overflow-hidden text-right font-sans">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#1E1917] via-[#2A221E] to-[#1E1917] border-b border-[#D4AF37]/40 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-base md:text-xl font-black text-[#F3E5AB] font-cairo">
                المهام اليومية الطويلة (رحلة الـ 5 أيام الحقيقية)
              </h2>
            </div>
            <p className="text-xs text-[#E6D2A8]/70 font-amiri">
              مهمة يومية متعددة المراحل تنتهي بلحظة تشويق، ويستكمل اليوم التالي بعد فجر الغد الحقيقي.
            </p>
          </div>

          {/* Quick Real Date & Countdown Pill */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex flex-col items-end px-3 py-1.5 rounded-sm bg-[#0F0D0C]/80 border border-[#D4AF37]/30 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-[#D4AF37] font-bold font-cairo">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>العد التنازلي لفجر الغد:</span>
              </div>
              <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">
                {formatTimeRemaining(secondsRemaining)}
              </span>
            </div>

            <button
              id="btn-close-daily-modal"
              onClick={() => {
                soundManager.playClickSFX();
                onClose();
              }}
              className="px-3 py-1.5 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 text-[#F3E5AB] text-xs font-bold font-cairo transition-all cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>

        {/* Days Navigation Timeline Bar */}
        <div className="bg-[#0F0D0C] border-b border-[#D4AF37]/25 p-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {dailyMissions.map((m) => {
              const dProg = progress.days[m.dayNumber];
              const dCompleted = dProg?.status === 'completed';
              const dCurrent = progress.activeDay === m.dayNumber && !dCompleted;
              const dLocked = dProg?.status === 'locked';
              const isSelected = selectedDayNum === m.dayNumber;

              return (
                <button
                  key={m.dayNumber}
                  onClick={() => {
                    soundManager.playClickSFX();
                    setSelectedDayNum(m.dayNumber);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-sm border transition-all cursor-pointer text-xs font-bold font-cairo ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37]/25 text-[#F3E5AB] shadow-md scale-[1.02]'
                      : 'border-white/10 bg-[#181413]/60 text-[#E6D2A8]/70 hover:border-[#D4AF37]/40'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  {dCompleted ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : dCurrent ? (
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center animate-pulse">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-white/10 text-white/40 flex items-center justify-center">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}

                  <span>اليوم {m.dayNumber}</span>

                  <span className="text-[10px] opacity-75 font-normal hidden md:inline truncate max-w-[110px]">
                    {m.locationName.split('،')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Day Hero Header Card */}
          <div className="relative rounded-sm border border-[#D4AF37]/40 bg-gradient-to-r from-[#1A1513] via-[#241D1A] to-[#1A1513] p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shrink-0 shadow-md">
                <img
                  src={selectedMission.mentorAvatar}
                  alt={selectedMission.mentorName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-xs bg-[#D4AF37] text-[#0F0D0C] font-black font-cairo">
                    اليوم {selectedMission.dayNumber}
                  </span>
                  <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedMission.locationName}
                  </span>
                  <span className="text-[11px] text-[#E6D2A8]/60">
                    • الحقبة: {selectedMission.era}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-bold text-[#F3E5AB] font-cairo leading-snug">
                  {selectedMission.title}
                </h3>
                <p className="text-xs md:text-sm text-[#E6D2A8]/80 font-amiri mt-0.5">
                  {selectedMission.subtitle}
                </p>
              </div>
            </div>

            {/* Day Status Action Banner */}
            <div className="flex flex-col sm:flex-row items-end md:items-center gap-2.5 w-full md:w-auto justify-end">
              {isCompleted ? (
                <button
                  id="btn-reopen-cliffhanger"
                  onClick={() => {
                    soundManager.playClickSFX();
                    onShowCliffhanger(selectedMission.dayNumber);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-gradient-to-r from-red-900/60 to-red-950/80 border border-red-500/50 hover:border-red-400 text-[#F3E5AB] text-xs md:text-sm font-bold font-cairo shadow-lg cursor-pointer transition-all"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>مشاهدة نقطة التشويق الكبرى (Cliffhanger)</span>
                </button>
              ) : isLocked ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-white/5 border border-white/10 text-white/60 text-xs">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>مقفل حتى إكمال اليوم السابق وحلول فجر الغد الحقيقي</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37] text-[#F3E5AB] text-xs font-bold font-cairo">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>مهمة اليوم النشطة حالياً!</span>
                </div>
              )}
            </div>
          </div>

          {/* 3 Sequential Mission Stages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#F3E5AB] font-cairo flex items-center gap-2">
                <span>مراحل اليوم الثلاث المتسلسلة</span>
                <span className="text-xs font-normal text-[#D4AF37]/80 font-sans">
                  ({selectedDayProgress.completedStages.length} من 3 مكتملة)
                </span>
              </h4>

              {isCompleted && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  اكتملت جميع مراحل اليوم بنجاح!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedMission.stages.map((stage) => {
                const isStageFinished = selectedDayProgress.completedStages.includes(stage.stageNumber);
                const isCurrentStage =
                  !isStageFinished &&
                  (stage.stageNumber === 1 ||
                    selectedDayProgress.completedStages.includes(stage.stageNumber - 1));

                return (
                  <div
                    key={stage.id}
                    className={`p-4 rounded-sm border transition-all flex flex-col justify-between ${
                      isStageFinished
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : isCurrentStage && isUnlocked
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/30'
                        : 'bg-[#0F0D0C]/40 border-white/10 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Stage Type & Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-black/40 border border-white/10 text-[#D4AF37] font-cairo">
                          المرحلة {stage.stageNumber}
                        </span>

                        {isStageFinished ? (
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> تم الإنجاز
                          </span>
                        ) : stage.actionType === 'puzzle' ? (
                          <span className="text-[11px] text-amber-300 flex items-center gap-1">
                            <Key className="w-3.5 h-3.5" /> لغز أثري
                          </span>
                        ) : stage.actionType === 'dialogue' ? (
                          <span className="text-[11px] text-cyan-300 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> حوار ونقاش
                          </span>
                        ) : (
                          <span className="text-[11px] text-blue-300 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> معاينة وتوثيق
                          </span>
                        )}
                      </div>

                      <h5 className="text-xs md:text-sm font-bold text-[#F3E5AB] font-cairo leading-tight mb-1">
                        {stage.title}
                      </h5>
                      <p className="text-[11px] md:text-xs text-[#E6D2A8]/75 font-amiri leading-relaxed">
                        {stage.detailedInstruction}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-[#D4AF37]/80 font-amiri truncate">
                        {stage.locationName}
                      </span>

                      {isUnlocked && !isStageFinished && (
                        <button
                          onClick={() => {
                            soundManager.playClickSFX();
                            onClose();
                            onNavigateToStage(stage.targetLocationId, stage.actionType, stage.targetId);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#D4AF37] hover:bg-[#E5C158] text-[#0F0D0C] text-[11px] font-bold font-cairo shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                          <span>انطلق للمرحلة</span>
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cliffhanger Spotlight Card */}
          <div className="p-4 md:p-5 rounded-sm border border-red-500/30 bg-gradient-to-r from-red-950/30 via-[#181413] to-red-950/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs md:text-sm font-bold text-[#F3E5AB] font-cairo">
                  نقطة التشويق الكبرى لنهاية اليوم: {selectedMission.cliffhanger.title}
                </h4>
              </div>

              <span className="text-[11px] text-red-300/80 font-amiri hidden sm:inline">
                تنتهي كل مهمة عند عقدة مشوقة
              </span>
            </div>

            <p className="text-xs text-[#E6D2A8]/80 font-amiri leading-relaxed">
              {selectedMission.cliffhanger.dramaticNarrative[0]}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-red-500/20">
              <div className="text-[11px] text-[#D4AF37] italic font-amiri">
                "{selectedMission.culturalWisdom}"
              </div>

              {isCompleted ? (
                <button
                  onClick={() => {
                    soundManager.playClickSFX();
                    onShowCliffhanger(selectedMission.dayNumber);
                  }}
                  className="px-3 py-1.5 rounded-xs bg-red-900/50 hover:bg-red-800/60 border border-red-500/50 text-[#F3E5AB] text-xs font-bold font-cairo flex items-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>عرض مشهد التشويق والعد التنازلي</span>
                </button>
              ) : (
                <span className="text-[11px] text-amber-400/90 font-cairo">
                  يُكشف المشهد فور إتمام المرحلة الثالثة من اليوم.
                </span>
              )}
            </div>
          </div>

          {/* Real Calendar & Fast-Forward Testing Section */}
          <div className="p-3.5 bg-[#0A0908] border border-amber-500/30 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#F3E5AB] font-cairo block">
                  نظام الأيام الحقيقية والتحكم في الوقت
                </span>
                <p className="text-[11px] text-[#E6D2A8]/70 font-amiri">
                  اللعبة تعتمد التقويم الحقيقي؛ كل يوم ينفتح تلقائياً عند فجر اليوم التالي. يمكنك أيضاً استخدام محاكي الوقت للاختبار السريع دون انتظار 24 ساعة.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-advance-sim-day"
                onClick={() => {
                  soundManager.playClickSFX();
                  onAdvanceSimulatedDay();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-amber-500/50 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 text-xs font-bold font-cairo cursor-pointer transition-all active:scale-95"
                title="الانتقال الفوري إلى الغد لاختبار اليوم التالي فوراً"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>محاكاة فجر الغد (تسريع للاختبار)</span>
              </button>

              <button
                id="btn-reset-daily-progress"
                onClick={() => {
                  if (window.confirm('هل تود إعادة ضبط سجل الأيام لليوم الأول؟')) {
                    soundManager.playClickSFX();
                    onResetDailyProgress();
                  }
                }}
                className="p-1.5 rounded-xs border border-white/10 hover:border-red-500/40 text-white/40 hover:text-red-300 cursor-pointer transition-colors"
                title="إعادة ضبط سجل الأيام"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="bg-[#0F0D0C] border-t border-[#D4AF37]/30 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#E6D2A8]/70 font-amiri">
          <div>
            <span>إجمالي التقدم: </span>
            <span className="text-[#D4AF37] font-bold font-cairo">{totalCompletedDays} من 5 أيام حقيقية مكتملة</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>يُحفظ التقدم تلقائياً عبر جلسات التصفح</span>
          </div>
        </div>
      </div>
    </div>
  );
};
