import React, { useState } from 'react';
import { X, Mail, AlertTriangle, ShieldCheck, Sparkles, ChevronLeft } from 'lucide-react';
import { SecretTelegram } from '../types';
import { soundManager } from '../audio/soundManager';

interface SecretTelegramsModalProps {
  telegrams: SecretTelegram[];
  onClose: () => void;
  onSelectTelegram?: (id: string) => void;
}

export const SecretTelegramsModal: React.FC<SecretTelegramsModalProps> = ({
  telegrams,
  onClose,
}) => {
  const [activeTelegramId, setActiveTelegramId] = useState<string>(
    telegrams[0]?.id || ''
  );

  const activeTelegram =
    telegrams.find((t) => t.id === activeTelegramId) || telegrams[0];

  const handleSelect = (id: string) => {
    soundManager.playClickSFX();
    setActiveTelegramId(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0F0D0C] border border-[#D4AF37]/60 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/30 bg-gradient-to-r from-[#0F0D0C] via-[#1A1614] to-[#0F0D0C]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm border border-red-500/50 bg-red-950/40 text-red-400">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#F3E5AB] font-cairo">
                  البرقيات السرية والرسائل المعترضة
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-xs bg-red-950/60 border border-red-500/50 text-red-300 font-bold">
                  {telegrams.length} برقيات مشفرة
                </span>
              </div>
              <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-0.5">
                رسائل استخباراتية، تحذيرات أمنية، واعتراضات شبكة "العقرب الأسود"
              </p>
            </div>
          </div>

          <button
            id="btn-close-telegrams"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10 overflow-y-auto flex-1 bg-[#0F0D0C]">
          {/* Telegram List Sidebar */}
          <div className="p-3 space-y-2 bg-black/40 overflow-y-auto max-h-[35vh] md:max-h-full">
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-2 font-cairo">
              أرشيف البرقيات الواردة:
            </span>
            {telegrams.map((t) => {
              const isSelected = t.id === activeTelegram?.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className={`w-full text-right p-3 rounded-sm border transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F3E5AB] shadow-md'
                      : 'border-white/10 hover:border-white/20 bg-white/5 text-[#E6D2A8]/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-xs font-bold font-cairo ${
                        t.urgency === 'عاجل جداً'
                          ? 'bg-red-950 text-red-300 border border-red-600/60'
                          : t.urgency === 'سري للغاية'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600/60'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-600/60'
                      }`}
                    >
                      {t.urgency}
                    </span>
                    <span className="text-[10px] text-[#E6D2A8]/50 font-amiri">
                      {t.timestamp}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold font-cairo line-clamp-1">{t.title}</h4>
                  <p className="text-[11px] text-[#E6D2A8]/60 font-amiri">من: {t.sender}</p>
                </button>
              );
            })}
          </div>

          {/* Active Telegram Reader */}
          <div className="p-5 md:p-6 md:col-span-2 space-y-4 overflow-y-auto bg-gradient-to-b from-[#14110F] to-[#0A0908]">
            {activeTelegram ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Header info */}
                <div className="border-b border-[#D4AF37]/30 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-cairo text-[#D4AF37] font-semibold block">
                      المرسل: {activeTelegram.sender}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-white font-cairo mt-1">
                      {activeTelegram.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-sm bg-red-950/80 border border-red-500/50 text-red-300 font-bold font-cairo">
                      {activeTelegram.urgency}
                    </span>
                  </div>
                </div>

                {/* Message Body Styled like Aged Telegram Paper */}
                <div className="p-4 md:p-5 rounded-sm bg-[#FAF3DD]/5 border border-[#D4AF37]/40 shadow-inner font-amiri text-sm md:text-base text-[#F3E5AB] leading-relaxed text-justify relative overflow-hidden">
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 tracking-widest uppercase">
                    CONFIDENTIAL // TELEGRAPH
                  </div>
                  <p className="whitespace-pre-line mt-2">{activeTelegram.message}</p>
                </div>

                {/* Plot Twist / Revealed Secret Callout */}
                <div className="p-3.5 rounded-sm bg-amber-950/40 border border-amber-500/60 text-amber-200 text-xs md:text-sm font-amiri space-y-1 shadow-md">
                  <div className="flex items-center gap-1.5 font-bold font-cairo text-amber-400 text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>السر المكشوف والتحليل التكتيكي:</span>
                  </div>
                  <p>{activeTelegram.revealsSecret}</p>
                </div>

                {/* Advice / Safety note */}
                <div className="flex items-center gap-2 text-xs text-[#E6D2A8]/70 font-cairo p-2 rounded-xs bg-white/5 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    الاستفادة من هذه المعلومات تنقذ حياتك أثناء فحص أفخاخ المواقع الأثرية ومواجهة
                    المهربين.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#E6D2A8]/60 font-cairo">
                لا توجد برقية محددة حالياً.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
