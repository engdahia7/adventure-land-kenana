import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Search,
  Fingerprint,
  SunMedium,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ForensicArtifact } from '../types';
import { soundManager } from '../audio/soundManager';

interface ForensicArtifactLabModalProps {
  artifacts: ForensicArtifact[];
  onClose: () => void;
  onClueDiscovered: (clue: string) => void;
  onArtifactExamined: (artifactId: string, toolType: string) => void;
}

export const ForensicArtifactLabModal: React.FC<ForensicArtifactLabModalProps> = ({
  artifacts,
  onClose,
  onClueDiscovered,
  onArtifactExamined,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeTool, setActiveTool] = useState<'uv' | 'fingerprint' | 'chemical' | 'microscope' | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processFeedback, setProcessFeedback] = useState<string | null>(null);

  const currentArtifact = artifacts[selectedIndex] || artifacts[0];

  const handleApplyTool = (tool: 'uv' | 'fingerprint' | 'chemical' | 'microscope') => {
    if (isProcessing || !currentArtifact) return;
    setActiveTool(tool);
    setIsProcessing(true);
    setProcessFeedback(null);

    // Play appropriate sfx
    if (tool === 'uv') {
      soundManager.playUVHumSFX();
    } else if (tool === 'chemical') {
      soundManager.playChemicalReagentSFX();
    } else {
      soundManager.playClickSFX();
    }

    setTimeout(() => {
      setIsProcessing(false);
      onArtifactExamined(currentArtifact.id, tool);

      let msg = '';
      if (tool === 'uv') {
        msg = currentArtifact.revealedSecretText || 'كشفت الأشعة الفوسفورية عن نقوش حبر سرية مخفية!';
      } else if (tool === 'fingerprint') {
        msg = currentArtifact.revealedFingerprint || 'ظهرت خطوط البصمة بوضوح تام تحت بودرة الفحم!';
      } else if (tool === 'chemical') {
        msg = `كشف المحلول الكيميائي: الأثر ${currentArtifact.authenticityStatus === 'genuine' ? 'أصلي وتاريخي 100%' : 'قطعة مقلدة حديثاً لتمويه السلطات'}`;
      } else if (tool === 'microscope') {
        msg = 'أظهر المجهر الأثري خدوش أداة قطع حديثة وختم ورشة صاغة سرية!';
      }

      setProcessFeedback(msg);
      onClueDiscovered(currentArtifact.associatedClue);
      try {
        soundManager.playActionSuccessSFX();
      } catch {}
    }, 900);
  };

  return (
    <div
      id="forensic-artifact-lab-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#181310] via-[#100D0B] to-[#080605] border-2 border-[#D4AF37]/60 rounded-sm shadow-[0_0_60px_rgba(212,175,55,0.25)] overflow-hidden font-cairo text-right">
        {/* Lab Header */}
        <div className="bg-gradient-to-r from-[#2B1F17] via-[#35251C] to-[#1C140F] border-b border-[#D4AF37]/40 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-inner">
              <FlaskConical className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#F3E5AB] font-amiri tracking-wide flex items-center gap-2">
                <span>معمل التحليل الجنائي الأثري (1930)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono">
                  FORENSIC LAB
                </span>
              </h2>
              <p className="text-xs text-[#E6D2A8]/70">
                فحص البصمات، الأحبار السرية بأشعة UV، والكشف الكيميائي عن أصالة الآثار
              </p>
            </div>
          </div>

          <button
            id="btn-close-forensic-lab"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-2 rounded-sm border border-red-500/40 hover:bg-red-500/20 text-red-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lab Body */}
        <div className="p-4 md:p-6 space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar">
          {/* Artifact Carousel & Selector */}
          <div className="flex items-center justify-between bg-black/40 border border-[#D4AF37]/30 rounded-sm p-3">
            <button
              onClick={() => {
                soundManager.playClickSFX();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : artifacts.length - 1));
                setProcessFeedback(null);
              }}
              className="p-2 rounded-sm bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="text-xs text-[#E6D2A8]/60 font-mono">
                قطعة ({selectedIndex + 1} من {artifacts.length})
              </span>
              <h3 className="text-base md:text-lg font-bold text-[#F3E5AB] font-amiri">
                {currentArtifact.name}
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-xs bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
                {currentArtifact.era} • {currentArtifact.category}
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.playClickSFX();
                setSelectedIndex((prev) => (prev < artifacts.length - 1 ? prev + 1 : 0));
                setProcessFeedback(null);
              }}
              className="p-2 rounded-sm bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Inspection Workbench Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Visual Inspection Viewport */}
            <div className="md:col-span-7 bg-[#0A0807] border-2 border-[#D4AF37]/40 rounded-sm p-5 relative overflow-hidden flex flex-col justify-between min-h-[260px] shadow-inner">
              {/* Dynamic UV / Chemical Filter Overlay */}
              {activeTool === 'uv' && !isProcessing && (
                <div className="absolute inset-0 bg-purple-900/30 backdrop-hue-rotate-90 pointer-events-none animate-pulse" />
              )}
              {activeTool === 'chemical' && !isProcessing && (
                <div className="absolute inset-0 bg-emerald-950/25 pointer-events-none" />
              )}

              <div>
                <span className="text-[10px] text-[#D4AF37]/80 font-mono uppercase tracking-wider block mb-1">
                  طاولة الفحص المجهري المباشر
                </span>
                <p className="text-xs md:text-sm text-[#E6D2A8]/90 font-amiri leading-relaxed">
                  {currentArtifact.description}
                </p>
              </div>

              {/* In-Depth Feedback Result */}
              {processFeedback && (
                <div className="p-3.5 rounded-sm bg-black/80 border border-[#D4AF37]/60 text-xs md:text-sm text-[#F3E5AB] font-amiri leading-relaxed shadow-lg animate-fadeIn mt-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>نتيجة التحليل الجنائي الدقيق:</span>
                  </div>
                  {processFeedback}
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-[#F3E5AB] font-mono animate-pulse">
                    جاري التحليل الكيميائي والبصري للأثر...
                  </span>
                </div>
              )}

              {/* Authenticity Badge */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#E6D2A8]/70">
                <span>الحالة الجنائية:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تم توثيق القرينة في ملف التحقيق</span>
                </span>
              </div>
            </div>

            {/* Forensic Tool Station */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs font-bold text-[#F3E5AB] block">
                اختر أداة المعمل الميداني للفحص:
              </span>

              {/* Tool 1: UV Light */}
              <button
                onClick={() => handleApplyTool('uv')}
                className={`w-full p-3 rounded-sm border text-right transition-all flex items-center gap-3 cursor-pointer ${
                  currentArtifact.examinedWithUV
                    ? 'bg-purple-950/40 border-purple-500/60 text-purple-200'
                    : 'bg-black/50 border-[#D4AF37]/30 hover:border-[#D4AF37] text-white'
                }`}
              >
                <div className="w-9 h-9 rounded-sm bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300 shrink-0">
                  <SunMedium className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-cairo">مصباح الأشعة فوق البنفسجية (UV)</span>
                    {currentArtifact.examinedWithUV && <span className="text-[10px] text-purple-400">مكتمل ✓</span>}
                  </div>
                  <span className="text-[10px] text-[#E6D2A8]/70">
                    لكشف الأحبار الفوسفورية والرسائل المخفية
                  </span>
                </div>
              </button>

              {/* Tool 2: Fingerprint Powder */}
              <button
                onClick={() => handleApplyTool('fingerprint')}
                className={`w-full p-3 rounded-sm border text-right transition-all flex items-center gap-3 cursor-pointer ${
                  currentArtifact.dustedForFingerprints
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                    : 'bg-black/50 border-[#D4AF37]/30 hover:border-[#D4AF37] text-white'
                }`}
              >
                <div className="w-9 h-9 rounded-sm bg-amber-600/30 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-cairo">بودرة الفحم ورفع البصمات</span>
                    {currentArtifact.dustedForFingerprints && <span className="text-[10px] text-amber-400">مكتمل ✓</span>}
                  </div>
                  <span className="text-[10px] text-[#E6D2A8]/70">
                    لكشف آثار ولمسات المهربين المشتبه بهم
                  </span>
                </div>
              </button>

              {/* Tool 3: Chemical Reagent */}
              <button
                onClick={() => handleApplyTool('chemical')}
                className={`w-full p-3 rounded-sm border text-right transition-all flex items-center gap-3 cursor-pointer ${
                  currentArtifact.chemicallyCleaned
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : 'bg-black/50 border-[#D4AF37]/30 hover:border-[#D4AF37] text-white'
                }`}
              >
                <div className="w-9 h-9 rounded-sm bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-cairo">محلول النيتريك والأحماض الأثرية</span>
                    {currentArtifact.chemicallyCleaned && <span className="text-[10px] text-emerald-400">مكتمل ✓</span>}
                  </div>
                  <span className="text-[10px] text-[#E6D2A8]/70">
                    لتحديد عمر السبيكة والتحقق من التزييف
                  </span>
                </div>
              </button>

              {/* Tool 4: Microscope */}
              <button
                onClick={() => handleApplyTool('microscope')}
                className={`w-full p-3 rounded-sm border text-right transition-all flex items-center gap-3 cursor-pointer ${
                  currentArtifact.microscopeAnalyzed
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                    : 'bg-black/50 border-[#D4AF37]/30 hover:border-[#D4AF37] text-white'
                }`}
              >
                <div className="w-9 h-9 rounded-sm bg-cyan-600/30 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-cairo">المجهر الأثري ذو التكبير العالي</span>
                    {currentArtifact.microscopeAnalyzed && <span className="text-[10px] text-cyan-400">مكتمل ✓</span>}
                  </div>
                  <span className="text-[10px] text-[#E6D2A8]/70">
                    لفحص الأختام الهيروغليفية وألياف البردي
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
