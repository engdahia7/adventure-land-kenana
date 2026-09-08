import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  Flame,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  Search,
  FileQuestion,
} from 'lucide-react';
import { SuspectProfile, SuspectDialogueOption } from '../types';
import { soundManager } from '../audio/soundManager';

interface SuspectInterrogationModalProps {
  suspects: SuspectProfile[];
  discoveredClues: string[];
  onClose: () => void;
  onClueDiscovered: (clue: string) => void;
  onConfessionObtained: (suspectId: string) => void;
}

export const SuspectInterrogationModal: React.FC<SuspectInterrogationModalProps> = ({
  suspects,
  discoveredClues,
  onClose,
  onClueDiscovered,
  onConfessionObtained,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(suspects[0]?.id || 'sobhi_ayad');
  const [activeDialogueResult, setActiveDialogueResult] = useState<{
    response: string;
    confession: boolean;
    clue?: string;
  } | null>(null);

  const currentSuspect = suspects.find((s) => s.id === selectedSuspectId) || suspects[0];

  const handleSelectOption = (option: SuspectDialogueOption) => {
    soundManager.playClickSFX();

    setTimeout(() => {
      setActiveDialogueResult({
        response: option.response,
        confession: option.confessionBreakthrough,
        clue: option.unlockedClue,
      });

      if (option.unlockedClue) {
        onClueDiscovered(option.unlockedClue);
      }

      if (option.confessionBreakthrough) {
        onConfessionObtained(currentSuspect.id);
        try {
          soundManager.playActionSuccessSFX();
        } catch {}
      }
    }, 400);
  };

  return (
    <div
      id="suspect-interrogation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl bg-gradient-to-b from-[#181411] via-[#100D0B] to-[#070504] border-2 border-[#D4AF37]/70 rounded-sm shadow-[0_0_60px_rgba(212,175,55,0.25)] overflow-hidden font-cairo text-right flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B1F17] via-[#35251C] to-[#1C140F] border-b border-[#D4AF37]/40 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#F3E5AB] font-amiri">
                شجرة المشتبه بهم وغرفة التحقيق الجنائي
              </h2>
              <p className="text-xs text-[#E6D2A8]/70">
                استجواب عرابي التهريب، كشف التناقضات، وانتزاع الاعترافات بالأدلة
              </p>
            </div>
          </div>

          <button
            id="btn-close-interrogation"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm text-red-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Suspects Dossier List */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-xs font-bold text-[#F3E5AB] block mb-2">
              ملفات المشتبه بهم المحتجزين:
            </span>
            {suspects.map((suspect) => (
              <button
                key={suspect.id}
                onClick={() => {
                  soundManager.playClickSFX();
                  setSelectedSuspectId(suspect.id);
                  setActiveDialogueResult(null);
                }}
                className={`w-full p-3 rounded-sm border text-right transition-all cursor-pointer ${
                  selectedSuspectId === suspect.id
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-md'
                    : 'bg-black/40 border-white/10 hover:border-white/30 text-white/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs md:text-sm font-bold text-[#F3E5AB] font-amiri">
                    {suspect.name}
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-red-950/60 border border-red-500/40 text-red-300">
                    شبهة: {suspect.suspicionLevel}%
                  </span>
                </div>
                <div className="text-[11px] text-[#D4AF37] font-semibold">{suspect.alias}</div>
                <div className="text-[10px] text-[#E6D2A8]/60 mt-1">{suspect.role}</div>
                {suspect.confessed && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم انتزاع الاعتراف الكامل!</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Interrogation Chamber & Dialogue */}
          <div className="md:col-span-8 bg-[#0B0908] border border-[#D4AF37]/30 rounded-sm p-4 md:p-5 flex flex-col justify-between space-y-4">
            {/* Suspect Profile Card */}
            <div className="bg-black/50 border border-white/10 p-4 rounded-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#F3E5AB] font-amiri">
                    {currentSuspect.name} ({currentSuspect.alias})
                  </h3>
                  <p className="text-xs text-[#E6D2A8]/70">{currentSuspect.role} • {currentSuspect.location}</p>
                </div>
                <div className="px-2.5 py-1 rounded-sm bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-bold">
                  مستوى الشبهة: {currentSuspect.suspicionLevel}%
                </div>
              </div>

              {/* Alibi vs Contradiction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-white/10">
                <div className="p-2.5 rounded-xs bg-black/40 border border-white/5">
                  <span className="text-[10px] text-white/50 block mb-1">الادعاء وحجة الغياب (Alibi):</span>
                  <p className="text-white/90 italic font-amiri">{currentSuspect.alibi}</p>
                </div>
                <div className="p-2.5 rounded-xs bg-red-950/20 border border-red-500/30">
                  <span className="text-[10px] text-red-400 block mb-1">التناقض الجنائي المرصود:</span>
                  <p className="text-red-200/90 font-amiri">{currentSuspect.contradiction}</p>
                </div>
              </div>
            </div>

            {/* Interrogation Dialogue Result Display */}
            {activeDialogueResult && (
              <div
                className={`p-4 rounded-sm border text-xs md:text-sm font-amiri leading-relaxed shadow-lg animate-fadeIn ${
                  activeDialogueResult.confession
                    ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200'
                    : 'bg-[#18130F] border-[#D4AF37]/50 text-[#F3E5AB]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1.5">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>رد المشتبه به أثناء التحقيق:</span>
                </div>
                <p className="text-sm font-semibold">{activeDialogueResult.response}</p>
                {activeDialogueResult.clue && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 text-xs text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تم توثيق قرينة حاسمة: {activeDialogueResult.clue}</span>
                  </div>
                )}
              </div>
            )}

            {/* Interrogation Action Choices */}
            <div className="space-y-2 pt-2 border-t border-[#D4AF37]/20">
              <span className="text-xs font-bold text-[#F3E5AB] block">
                اختر أسلوب الاستجواب والضغط:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {currentSuspect.dialogueOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className="p-3 rounded-sm bg-black/60 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-right transition-all cursor-pointer active:scale-98 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#F3E5AB] block">
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-[#E6D2A8]/60">
                        التكتيك: {opt.tactic === 'present_evidence' ? 'مواجهة بالدليل القاطع' : opt.tactic === 'pressure' ? 'ضغط نفسي وترهيب' : 'مساومة وعرض اتفاق'}
                      </span>
                    </div>
                    <span className="text-xs text-[#D4AF37]">↵</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
