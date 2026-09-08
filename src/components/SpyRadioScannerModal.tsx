import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Volume2,
  VolumeX,
  X,
  Shield,
  Activity,
  Zap,
  Lock,
  Unlock,
  AlertTriangle,
  Award,
  Sparkles,
  Search,
} from 'lucide-react';
import { RadioFrequencyChannel, InventoryItem } from '../types';
import { radioChannelsData } from '../data/radioChannelsData';
import { soundManager } from '../audio/soundManager';

interface SpyRadioScannerModalProps {
  onClose: () => void;
  onClueDiscovered?: (clue: string) => void;
  onItemAcquired?: (item: InventoryItem) => void;
  onThreatChange?: (delta: number) => void;
}

export const SpyRadioScannerModal: React.FC<SpyRadioScannerModalProps> = ({
  onClose,
  onClueDiscovered,
  onItemAcquired,
  onThreatChange,
}) => {
  const [frequency, setFrequency] = useState<number>(88.0);
  const [activeChannel, setActiveChannel] = useState<RadioFrequencyChannel | null>(null);
  const [signalStrength, setSignalStrength] = useState<number>(0);
  const [decryptedChannels, setDecryptedChannels] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [tuningNoiseActive, setTuningNoiseActive] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check frequency match against known channels
  useEffect(() => {
    let bestChannel: RadioFrequencyChannel | null = null;
    let maxStrength = 0;

    for (const ch of radioChannelsData) {
      const diff = Math.abs(ch.frequency - frequency);
      if (diff < 1.2) {
        // Linear drop off
        const strength = Math.max(0, Math.round((1 - diff / 1.2) * 100));
        if (strength > maxStrength) {
          maxStrength = strength;
          bestChannel = ch;
        }
      }
    }

    setSignalStrength(maxStrength);
    setActiveChannel(bestChannel);

    // Audio static sweep on tune
    const clarity = maxStrength / 100;
    try {
      soundManager.playRadioStaticSweep(clarity);
      if (clarity > 0.85 && bestChannel?.audioEffectType === 'morse') {
        soundManager.playMorseBurst();
      }
    } catch {
      // ignore
    }
  }, [frequency]);

  // Oscilloscope wave canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Sine Wave / Static noise
      const clarity = signalStrength / 100;
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = clarity > 0.8 ? '#10B981' : clarity > 0.4 ? '#F59E0B' : '#EF4444';

      const midY = canvas.height / 2;
      const freqMultiplier = (frequency - 85) * 0.1 + 1;

      for (let x = 0; x < canvas.width; x++) {
        // Pure sine modulated by static
        const sineWave = Math.sin((x * 0.05 * freqMultiplier) + offset) * (15 + clarity * 20);
        const noise = (Math.random() - 0.5) * (1 - clarity) * 35;
        const y = midY + sineWave + noise;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      offset += 0.15 + (1 - clarity) * 0.1;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frequency, signalStrength]);

  const tuneDelta = (delta: number) => {
    try {
      soundManager.playClickSFX();
    } catch {
      // ignore
    }
    setFrequency((prev) => {
      const next = Math.round((prev + delta) * 10) / 10;
      return Math.min(140.0, Math.max(85.0, next));
    });
  };

  const jumpToChannel = (targetFreq: number) => {
    try {
      soundManager.playClickSFX();
    } catch {
      // ignore
    }
    setFrequency(targetFreq);
  };

  const handleDecrypt = () => {
    if (!activeChannel) return;
    try {
      soundManager.playActionSuccessSFX();
    } catch {
      // ignore
    }

    if (!decryptedChannels.includes(activeChannel.frequency)) {
      setDecryptedChannels((prev) => [...prev, activeChannel.frequency]);

      if (activeChannel.decodedClue && onClueDiscovered) {
        onClueDiscovered(activeChannel.decodedClue);
      }
      if (activeChannel.rewardItem && onItemAcquired) {
        onItemAcquired(activeChannel.rewardItem);
      }
      if (onThreatChange) {
        onThreatChange(activeChannel.dangerLevelDelta);
      }
    }
  };

  const isCurrentChannelDecrypted = activeChannel
    ? decryptedChannels.includes(activeChannel.frequency)
    : false;

  return (
    <div
      id="spy-radio-scanner-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#1C1613] via-[#120F0D] to-[#0A0807] border-2 border-[#D4AF37]/60 rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.25)] overflow-hidden font-cairo text-right">
        {/* Vintage Brass Header */}
        <div className="bg-gradient-to-r from-[#2C211A] via-[#3A2C22] to-[#201712] border-b border-[#D4AF37]/40 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-inner">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#F3E5AB] font-amiri tracking-wide flex items-center gap-2">
                <span>جهاز التنصت اللاسلكي العسكري (طراز 1930)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-sans">
                  SHORTWAVE HF
                </span>
              </h2>
              <p className="text-xs text-[#E6D2A8]/70">
                التقط ترددات شبكة المهربين، دوريات الإنتربول، وإشارات مورس المشفرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const muted = soundManager.toggleMute();
                setIsMuted(muted);
              }}
              className="p-2 rounded-sm border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-black/40 text-[#D4AF37] cursor-pointer"
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-close-radio-modal"
              onClick={() => {
                try {
                  soundManager.playClickSFX();
                } catch {}
                onClose();
              }}
              className="p-2 rounded-sm border border-red-500/40 hover:bg-red-500/20 text-red-300 hover:text-white transition-all cursor-pointer"
              title="إغلاق الجهاز"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Radio Tuning Body */}
        <div className="p-4 md:p-6 space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar">
          {/* Top Oscilloscope & Frequency Display Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#090807] border border-[#D4AF37]/40 rounded-sm p-4 shadow-inner">
            {/* Oscilloscope Wave Display */}
            <div className="md:col-span-7 relative h-28 bg-[#050607] border border-[#D4AF37]/30 rounded-xs overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={360}
                height={110}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-black/70 border border-white/10 text-[10px] font-mono text-emerald-400">
                <Activity className="w-3 h-3 animate-spin" />
                <span>SIGNAL: {signalStrength}%</span>
              </div>
              <div className="absolute bottom-2 right-2 text-[9px] text-[#D4AF37]/60 font-mono">
                OSCILLOSCOPE MK-IV
              </div>
            </div>

            {/* Digital Frequency Counter & VU Meter */}
            <div className="md:col-span-5 flex flex-col justify-between h-28 space-y-2 text-center md:text-right">
              <div>
                <span className="text-[10px] text-[#E6D2A8]/70 block font-cairo">التردد المضبوط حالياً:</span>
                <div className="flex items-baseline justify-center md:justify-start gap-1 font-mono">
                  <span className="text-3xl md:text-4xl font-black text-[#F3E5AB] tracking-wider drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]">
                    {frequency.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-[#D4AF37]">MHz</span>
                </div>
              </div>

              {/* Signal VU Indicator */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#E6D2A8]/80 mb-1">
                  <span>قوة الإشارة اللاسلكية:</span>
                  <span
                    className={`font-bold ${
                      signalStrength > 80
                        ? 'text-emerald-400'
                        : signalStrength > 40
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {signalStrength > 80
                      ? 'إشارة ممتازة ومسموعة'
                      : signalStrength > 40
                      ? 'تشويش والتقاط جزئي'
                      : 'ضوضاء فراغية'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-black/90 rounded-full border border-white/10 p-0.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      signalStrength > 80
                        ? 'bg-gradient-to-r from-amber-500 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                        : signalStrength > 40
                        ? 'bg-gradient-to-r from-red-500 to-amber-500'
                        : 'bg-red-600/40'
                    }`}
                    style={{ width: `${Math.max(6, signalStrength)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tuning Dial & Controls */}
          <div className="bg-[#181310] border border-[#D4AF37]/30 rounded-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F3E5AB] flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#D4AF37]" />
                <span>مفتاح التوليف الدقيق لموجات الراديو (Tuning Dial)</span>
              </span>
              <span className="text-[11px] text-[#D4AF37]/80 font-mono">85.0 — 140.0 MHz</span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="85.0"
              max="140.0"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-full h-3 bg-black/80 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] border border-[#D4AF37]/40"
            />

            {/* Stepper Buttons for Tactical Tuning */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => tuneDelta(-5.0)}
                className="px-3 py-1.5 rounded-sm bg-black/50 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-mono text-[#F3E5AB] cursor-pointer active:scale-95"
              >
                -5 MHz
              </button>
              <button
                onClick={() => tuneDelta(-1.0)}
                className="px-3 py-1.5 rounded-sm bg-black/50 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-mono text-[#F3E5AB] cursor-pointer active:scale-95"
              >
                -1 MHz
              </button>
              <button
                onClick={() => tuneDelta(-0.1)}
                className="px-4 py-1.5 rounded-sm bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 border border-[#D4AF37] text-xs font-mono text-white font-bold cursor-pointer active:scale-95"
              >
                -0.1
              </button>
              <button
                onClick={() => tuneDelta(0.1)}
                className="px-4 py-1.5 rounded-sm bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 border border-[#D4AF37] text-xs font-mono text-white font-bold cursor-pointer active:scale-95"
              >
                +0.1
              </button>
              <button
                onClick={() => tuneDelta(1.0)}
                className="px-3 py-1.5 rounded-sm bg-black/50 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-mono text-[#F3E5AB] cursor-pointer active:scale-95"
              >
                +1 MHz
              </button>
              <button
                onClick={() => tuneDelta(5.0)}
                className="px-3 py-1.5 rounded-sm bg-black/50 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-xs font-mono text-[#F3E5AB] cursor-pointer active:scale-95"
              >
                +5 MHz
              </button>
            </div>

            {/* Quick Memory Preset Buttons */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] text-[#E6D2A8]/70 block mb-2 font-cairo">
                ترددات مشبوهة ملتقطة من مذكرات المحقق:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {radioChannelsData.map((ch) => {
                  const isDecrypted = decryptedChannels.includes(ch.frequency);
                  const isSelected = Math.abs(ch.frequency - frequency) < 0.2;
                  return (
                    <button
                      key={ch.frequency}
                      id={`btn-preset-freq-${ch.frequency.toString().replace('.', '_')}`}
                      onClick={() => jumpToChannel(ch.frequency)}
                      className={`p-2 rounded-sm border text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] text-black border-white font-bold shadow-md'
                          : isDecrypted
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                          : 'bg-black/60 border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#F3E5AB]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold">{ch.frequency} MHz</span>
                        {isDecrypted && <span className="text-emerald-400">✓</span>}
                      </div>
                      <p className="text-[10px] truncate opacity-80 mt-0.5">{ch.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Broadcast Audio & Decryption Panel */}
          {activeChannel && signalStrength >= 50 ? (
            <div
              className={`p-4 md:p-5 rounded-sm border transition-all animate-fadeIn ${
                signalStrength >= 80
                  ? 'bg-[#121A15] border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                  : 'bg-[#1C1710] border-amber-500/60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      signalStrength >= 80 ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-xs md:text-sm font-bold text-white font-cairo">
                    {activeChannel.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-xs bg-black/40 border border-white/20 text-[#D4AF37]">
                    {activeChannel.badge}
                  </span>
                </div>
                <span className="text-[11px] text-[#E6D2A8]/70 font-mono">
                  المصدر: {activeChannel.sender}
                </span>
              </div>

              {/* Intercepted Transcript Box */}
              <div className="bg-black/60 border border-white/10 rounded-xs p-3.5 mb-4 text-xs md:text-sm text-[#F3E5AB] font-amiri leading-relaxed">
                {activeChannel.transcript}
              </div>

              {/* Decrypted Clues & Reward */}
              {isCurrentChannelDecrypted ? (
                <div className="p-3.5 rounded-xs bg-emerald-900/30 border border-emerald-500/50 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>تم فك تشفير هذا الاتصال وتوثيق القرائن الجنائية بنجاح!</span>
                  </div>
                  {activeChannel.decodedClue && (
                    <p className="text-xs text-[#E6D2A8] font-cairo">
                      <strong>القرينة المستخلصة:</strong> {activeChannel.decodedClue}
                    </p>
                  )}
                  {activeChannel.rewardItem && (
                    <div className="flex items-center gap-2 text-[11px] text-[#D4AF37] font-cairo pt-1 border-t border-emerald-500/20">
                      <Award className="w-3.5 h-3.5" />
                      <span>عثرت على أداة استخباراتية: {activeChannel.rewardItem.name}</span>
                    </div>
                  )}
                </div>
              ) : signalStrength >= 80 ? (
                <button
                  id="btn-decrypt-channel"
                  onClick={handleDecrypt}
                  className="w-full py-3 rounded-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs md:text-sm tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl font-cairo"
                >
                  <Unlock className="w-4 h-4" />
                  <span>فك شفرة الإرسال وتوثيق الخيوط الجنائية (-{Math.abs(activeChannel.dangerLevelDelta)}% خطر)</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 p-2 rounded-xs bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>الإشارة ضعيفة.. اضبط التوليف بدقة لتصل قوة الإشارة إلى 80% على الأقل لفك التشفير</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-sm bg-black/40 border border-dashed border-[#D4AF37]/30 text-center space-y-2">
              <Search className="w-6 h-6 text-[#D4AF37]/60 mx-auto animate-bounce" />
              <p className="text-xs text-[#E6D2A8]/70 font-cairo">
                أدر مقبض التوليف لمسح النطاق الترددي.. هناك بثوات سرية تتردد بين 85 و 135 ميجاهرتز
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
