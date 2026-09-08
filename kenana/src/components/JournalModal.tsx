import React from 'react';
import { X, BookOpen, Clock, MapPin, Feather, CheckCircle2 } from 'lucide-react';
import { JournalEntry } from '../types';
import { soundManager } from '../audio/soundManager';

interface JournalModalProps {
  entries: JournalEntry[];
  clues: string[];
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ entries, clues, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl bg-[#0F0D0C] border border-[#D4AF37]/50 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Subtle Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/30 bg-[#0F0D0C]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F3E5AB] font-cairo">
                مفكرة المغامر والقرائن الموثقة
              </h3>
              <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-0.5">
                تدوين الملاحظات، الشواهد التاريخية، والرموز التي تم فك شفرتها
              </p>
            </div>
          </div>

          <button
            id="btn-close-journal"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Journal Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#0F0D0C]">
          {/* Active Clues Section */}
          {clues.length > 0 && (
            <div className="bg-[#0F0D0C] border border-[#D4AF37]/40 rounded-sm p-4 shadow-sm">
              <h4 className="text-xs font-bold text-[#D4AF37] flex items-center gap-2 mb-3 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>القرائن والإشارات المكتشفة حديثاً:</span>
              </h4>
              <div className="space-y-2">
                {clues.map((clue, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-[#F3E5AB] font-amiri bg-[#D4AF37]/5 p-3 rounded-sm border border-[#D4AF37]/20"
                  >
                    <span className="text-[#D4AF37] font-bold">•</span>
                    <span>{clue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diary Entries List */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] opacity-80 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>صفحات المفكرة الميدانية:</span>
            </h4>

            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-5 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-bold text-[#F3E5AB] font-cairo">
                    {entry.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-sm border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] uppercase tracking-wider">
                    {entry.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#E6D2A8]/60 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{entry.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>{entry.timestamp}</span>
                  </span>
                </div>

                <p className="text-sm text-[#E6D2A8]/85 font-amiri leading-relaxed">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
