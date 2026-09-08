import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Compass,
  MessageSquare,
  Sparkles,
  Award,
  Check,
  RotateCcw,
  Palette,
  Shirt,
  Crown,
} from 'lucide-react';
import { PlayerCustomization, PlayerSkills, PlayerSkillType } from '../types';
import { soundManager } from '../audio/soundManager';
import { heroAvatar } from '../data/gameData';

interface CharacterCustomizerModalProps {
  player: PlayerCustomization;
  skills: PlayerSkills;
  onUpdatePlayer: (customization: Partial<PlayerCustomization>) => void;
  onClose: () => void;
}

export const CharacterCustomizerModal: React.FC<CharacterCustomizerModalProps> = ({
  player,
  skills,
  onUpdatePlayer,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'customizer' | 'skills'>('customizer');
  const [editName, setEditName] = useState<string>(player.name);

  const headwearOptions = [
    { id: 'nemes', label: 'تاج النمس الملكي المذهب', desc: 'غطاء الرأس الفرعوني الأزرق والذهبي لملوك وحماة مصر' },
    { id: 'lotus_crown', label: 'إكليل اللوتس وحية الكوبرا', desc: 'تاج زهرة اللوتس المقدسة والصل الملكي الحامي من السحر' },
    { id: 'priest_linen', label: 'عصابة الكاهن الكتانية وعين حورس', desc: 'نسيج كتان كهنوتي يحمل رمز الحماية الروحية والبصيرة' },
    { id: 'anubis_mask', label: 'قناع أنوبيس الاحتفالي المذهب', desc: 'غطاء طقسي ذهبي مستوحى من حماة السراديب والمقابر المقدسة' },
    { id: 'pharaoh_scarf', label: 'كوفية المستكشف بخرطوش الفراعنة', desc: 'كوفية وادي النيل مطرزة بختم الخرطوش الملكي العتيق' },
    { id: 'explorer_hat', label: 'قبعة المغامر والباحث الكلاسيكية', desc: 'قبعة رحلات تقليدية مخصصة لحماية باحثي الآثار في الهضبة' },
  ] as const;

  const outfitOptions = [
    { id: 'pharaoh_shendyt', label: 'زي الشنديت الملكي مع طوق الأوشخ', desc: 'نقبة فرعونية مطوية من الكتان الأبيض مع قلادة أوشخ ذهبية عريضة' },
    { id: 'linen_tunic', label: 'ثوب الكتان الأبيض المطرز بالذهب', desc: 'رداء ملوكي أبيض بأكمام فضفاضة مطرزة بنقوش الخراطيش' },
    { id: 'warrior_armor', label: 'درع المحارب الفرعوني بوشاح أزرق', desc: 'درع صدري مرصع بالبرونز والذهب مع وشاح حورس الملكي' },
    { id: 'high_priest', label: 'رداء كاهن معبد آمون الحريري', desc: 'كسوة كهنوتية مقدسة لحماة الأسرار والبرديات' },
    { id: 'desert_linen', label: 'سترة الكتان والقطن المصري', desc: 'سترة رحلات مريحة بجيوب متعددة لحفظ الأدوات والعدسات' },
  ] as const;

  const accessoryOptions = [
    { id: 'was_sceptre', label: 'صولجان الواس الذهبي ومفتاح الحياة', desc: 'رمز القوة والسيادة والحياة الأبدية في مصر القديمة', icon: 'Sparkles' },
    { id: 'horus_eye', label: 'تميمة عين حورس الفضية واللازورد', desc: 'رمز البصيرة الثاقبة والحماية في السراديب المظلمة', icon: 'Eye' },
    { id: 'scarab_amulet', label: 'قلادة الجعران الفرعوني المقدس', desc: 'رمز البعث والتجدد المستمر وطاقة الحياة الأبدية', icon: 'Shield' },
    { id: 'thoth_papyrus', label: 'لفافة بردية تحوت ومحبرة الحكمة', desc: 'أدوات الكاتب المقدس لتدوين وترجمة العلوم والرموز', icon: 'Award' },
    { id: 'ankh_pendant', label: 'مفتاح الحياة عنخ المذهب', desc: 'مفتاح الأسرار الفرعونية والخلود المعرفي', icon: 'Sparkles' },
  ] as const;

  const colorThemes = [
    { color: '#D4AF37', label: 'ذهب الفراعنة' },
    { color: '#2AA8A8', label: 'فيروز سيناء' },
    { color: '#E09F3E', label: 'كهرمان الصحراء' },
    { color: '#9E2A2B', label: 'عقيق الكرنك' },
    { color: '#2D6A4F', label: 'زمرد وادي النيل' },
  ];

  const titles = [
    'حامي أسرار الفراعنة وحكيم المخطوطات',
    'كبير موثقي كنوز الأهرامات ووادي الملوك',
    'باحث وموثق التراث المصري الأصيل',
    'خبير فك الخطوط والبرديات القديمة',
    'سفير الحكمة المصرية وحضارة الأجداد',
  ];

  const getSkillRank = (level: number) => {
    if (level >= 80) return { title: 'أستاذ حكيم', color: 'text-[#D4AF37]' };
    if (level >= 50) return { title: 'مستكشف متمرس', color: 'text-[#2AA8A8]' };
    if (level >= 30) return { title: 'باحث ميداني', color: 'text-[#E09F3E]' };
    return { title: 'مغامر مبتدئ', color: 'text-[#E6D2A8]/70' };
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdatePlayer({ name: editName.trim() });
      soundManager.playClickSFX();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-[#0F0D0C] border border-[#D4AF37]/50 rounded-sm shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Subtle Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/30 bg-[#0F0D0C]/95">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-sm border flex items-center justify-center shadow-md transition-colors"
              style={{
                borderColor: player.accentColor,
                backgroundColor: `${player.accentColor}15`,
                color: player.accentColor,
              }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#F3E5AB] font-cairo">
                  ملف المستكشف وتطوير المهارات
                </h3>
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm border"
                  style={{
                    borderColor: `${player.accentColor}60`,
                    color: player.accentColor,
                    backgroundColor: `${player.accentColor}10`,
                  }}
                >
                  مرتبط بالبيئة المصرية
                </span>
              </div>
              <p className="text-xs text-[#E6D2A8]/70 font-amiri">
                خصص مظهر شخصيتك وتابع تطور مهاراتك من خلال مغامراتك في خان الخليلي والأقصر وأسوان والجيزة
              </p>
            </div>
          </div>

          <button
            id="btn-close-character-modal"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#D4AF37]/20 bg-[#0F0D0C] px-6">
          <button
            id="tab-customizer"
            onClick={() => {
              soundManager.playClickSFX();
              setActiveTab('customizer');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'customizer'
                ? 'border-[#D4AF37] text-[#F3E5AB] bg-[#D4AF37]/10'
                : 'border-transparent text-[#E6D2A8]/60 hover:text-[#E6D2A8]'
            }`}
          >
            <Shirt className="w-4 h-4 text-[#D4AF37]" />
            <span>تخصيص المظهر والملابس</span>
          </button>

          <button
            id="tab-skills"
            onClick={() => {
              soundManager.playClickSFX();
              setActiveTab('skills');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'skills'
                ? 'border-[#D4AF37] text-[#F3E5AB] bg-[#D4AF37]/10'
                : 'border-transparent text-[#E6D2A8]/60 hover:text-[#E6D2A8]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>المهارات الأساسية وتاريخ الأفعال</span>
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
          </button>
        </div>

        {/* Tab 1: Customizer */}
        {activeTab === 'customizer' && (
          <div className="p-5 md:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Live Explorer Card Preview */}
            <div className="lg:col-span-4 flex flex-col items-center gap-4 bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-5 shadow-xl relative">
              <div className="w-full text-center pb-3 border-b border-[#D4AF37]/20">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  بطاقة عضوية المستكشف المصري
                </span>
              </div>

              {/* Dynamic Stylized Avatar with Cartoon Pharaonic Portrait */}
              <div
                className="relative w-40 h-40 rounded-sm border-2 overflow-hidden flex flex-col items-center justify-center p-1.5 shadow-xl bg-gradient-to-b from-[#181413] to-[#0F0D0C] group"
                style={{ borderColor: player.accentColor }}
              >
                <div className="relative w-full h-full rounded-xs overflow-hidden border border-[#D4AF37]/30">
                  <img
                    src={heroAvatar}
                    alt={player.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-xs bg-[#0F0D0C]/80 border border-[#D4AF37]/60 text-[9px] font-bold text-[#D4AF37] flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" />
                    <span>زي فرعوني</span>
                  </div>

                  <div className="absolute bottom-1.5 left-0 right-0 text-center px-1">
                    <span className="text-[10px] font-bold font-cairo text-[#F3E5AB] drop-shadow-md block truncate">
                      {headwearOptions.find(h => h.id === player.headwear)?.label || 'المظهر الفرعوني'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable Name & Title Display */}
              <div className="w-full text-center">
                <h4 className="text-lg font-bold text-[#F3E5AB] font-cairo">{player.name}</h4>
                <p className="text-xs text-[#E6D2A8]/80 font-amiri mt-1">{player.title}</p>
              </div>

              {/* Selected Equipments Mini-Overview */}
              <div className="w-full space-y-2 border-t border-[#D4AF37]/20 pt-3 text-xs">
                <div className="flex items-center justify-between text-[#E6D2A8]/75">
                  <span>الغطاء:</span>
                  <span className="font-semibold text-[#F3E5AB]">
                    {headwearOptions.find(h => h.id === player.headwear)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#E6D2A8]/75">
                  <span>الزي المصري:</span>
                  <span className="font-semibold text-[#F3E5AB]">
                    {outfitOptions.find(o => o.id === player.outfit)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#E6D2A8]/75">
                  <span>التميمة:</span>
                  <span className="font-semibold text-[#D4AF37]">
                    {accessoryOptions.find(a => a.id === player.accessory)?.label}
                  </span>
                </div>
              </div>

              {/* Quick Skill Levels Badges */}
              <div className="w-full grid grid-cols-3 gap-1.5 pt-2 border-t border-[#D4AF37]/20">
                <div className="text-center p-1.5 rounded-sm bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                  <span className="text-[9px] text-[#D4AF37] block">تفاوض</span>
                  <span className="text-xs font-bold text-[#F3E5AB]">{skills.negotiation}%</span>
                </div>
                <div className="text-center p-1.5 rounded-sm bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                  <span className="text-[9px] text-[#D4AF37] block">استكشاف</span>
                  <span className="text-xs font-bold text-[#F3E5AB]">{skills.exploration}%</span>
                </div>
                <div className="text-center p-1.5 rounded-sm bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                  <span className="text-[9px] text-[#D4AF37] block">دفاع</span>
                  <span className="text-xs font-bold text-[#F3E5AB]">{skills.defense}%</span>
                </div>
              </div>
            </div>

            {/* Right: Customization Controls */}
            <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-1">
              {/* Name & Title Section */}
              <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>اسم المستكشف واللقب الأثري:</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    id="input-player-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="اكتب اسم المستكشف..."
                    className="flex-1 bg-[#0F0D0C] border border-[#D4AF37]/40 rounded-sm px-3.5 py-2 text-sm text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37] font-cairo"
                  />
                  <button
                    id="btn-save-name"
                    onClick={handleSaveName}
                    className="px-4 py-2 rounded-sm border border-[#D4AF37] bg-[#D4AF37] hover:bg-[#b8972f] text-[#0F0D0C] font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    تثبيت الاسم
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-[#E6D2A8]/70">اختر لقباً:</span>
                  {titles.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundManager.playClickSFX();
                        onUpdatePlayer({ title: t });
                      }}
                      className={`text-xs px-2.5 py-1 rounded-sm border transition-all cursor-pointer ${
                        player.title === t
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F3E5AB] font-bold'
                          : 'border-white/10 bg-white/5 text-[#E6D2A8]/60 hover:text-[#E6D2A8]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Accent Selection */}
              <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  <Palette className="w-4 h-4" />
                  <span>اللون المميز (سمة الشعار المصري):</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {colorThemes.map((item) => (
                    <button
                      key={item.color}
                      onClick={() => {
                        soundManager.playClickSFX();
                        onUpdatePlayer({ accentColor: item.color });
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                        player.accentColor === item.color
                          ? 'border-white text-white font-bold shadow-md'
                          : 'border-white/15 text-[#E6D2A8]/70 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: `${item.color}25` }}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Headwear Selection */}
              <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  <Crown className="w-4 h-4" />
                  <span>غطاء الرأس والشعر:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {headwearOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        soundManager.playClickSFX();
                        onUpdatePlayer({ headwear: opt.id as any });
                      }}
                      className={`p-3 rounded-sm border text-right transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        player.headwear === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-sm'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#F3E5AB] font-cairo">{opt.label}</div>
                        <div className="text-[11px] text-[#E6D2A8]/70 font-amiri mt-0.5 leading-tight">{opt.desc}</div>
                      </div>
                      {player.headwear === opt.id && (
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfits Selection */}
              <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  <Shirt className="w-4 h-4" />
                  <span>الزي المصري التقليدي والميداني:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {outfitOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        soundManager.playClickSFX();
                        onUpdatePlayer({ outfit: opt.id as any });
                      }}
                      className={`p-3 rounded-sm border text-right transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        player.outfit === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-sm'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#F3E5AB] font-cairo">{opt.label}</div>
                        <div className="text-[11px] text-[#E6D2A8]/70 font-amiri mt-0.5 leading-tight">{opt.desc}</div>
                      </div>
                      {player.outfit === opt.id && (
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessory / Amulet Selection */}
              <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>التميمة أو القلادة المصرية التراثية:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accessoryOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        soundManager.playClickSFX();
                        onUpdatePlayer({ accessory: opt.id as any });
                      }}
                      className={`p-3 rounded-sm border text-right transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        player.accessory === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-sm'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#F3E5AB] font-cairo">{opt.label}</div>
                        <div className="text-[11px] text-[#E6D2A8]/70 font-amiri mt-0.5 leading-tight">{opt.desc}</div>
                      </div>
                      {player.accessory === opt.id && (
                        <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Skills & Growth History */}
        {activeTab === 'skills' && (
          <div className="p-5 md:p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            {/* Top Explanation Banner */}
            <div className="p-4 rounded-sm border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F3E5AB] font-cairo">
                  نظام التطور القائم على البيئة المصرية
                </h4>
                <p className="text-xs text-[#E6D2A8]/80 font-amiri mt-0.5 leading-relaxed">
                  تتطور مهاراتك بشكل طبيعي عبر خياراتك الحوارية في الأسواق، واستكشاف العمارة الفرعونية والمملوكية، وحل الألغاز التاريخية، ومواجهة المخاطر في السراديب.
                </p>
              </div>
            </div>

            {/* Core 3 Skills Detailed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Skill 1: Negotiation */}
              <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-4 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-sm bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-sm text-[#F3E5AB] font-cairo">التفاوض والدبلوماسية</h5>
                    </div>
                    <span className="text-xs font-bold text-[#D4AF37]">{skills.negotiation}%</span>
                  </div>

                  <p className="text-xs text-[#E6D2A8]/70 font-amiri leading-relaxed">
                    القدرة على كسب ثقة تجار خان الخليلي، محاورة العلماء بالكرنك، ومفاوضة أصحاب المراكب النيلية بأسوان.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#E6D2A8]/60">الرتبة:</span>
                    <span className={`font-bold ${getSkillRank(skills.negotiation).color}`}>
                      {getSkillRank(skills.negotiation).title}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-[#D4AF37]/20">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-[#D4AF37] rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, skills.negotiation)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skill 2: Exploration */}
              <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-4 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-sm bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                        <Compass className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-sm text-[#F3E5AB] font-cairo">الاستكشاف الأثري</h5>
                    </div>
                    <span className="text-xs font-bold text-cyan-400">{skills.exploration}%</span>
                  </div>

                  <p className="text-xs text-[#E6D2A8]/70 font-amiri leading-relaxed">
                    فهم أسرار العمارة المصرية القديمة، فك شفرات الخراطيش الهيروغليفية، ومحاذاة النجوم ومسارات الشمس.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#E6D2A8]/60">الرتبة:</span>
                    <span className={`font-bold ${getSkillRank(skills.exploration).color}`}>
                      {getSkillRank(skills.exploration).title}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-cyan-400/20">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, skills.exploration)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skill 3: Defense & Combat */}
              <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-4 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-sm bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-sm text-[#F3E5AB] font-cairo">الدفاع والبراعة الحركية</h5>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{skills.defense}%</span>
                  </div>

                  <p className="text-xs text-[#E6D2A8]/70 font-amiri leading-relaxed">
                    تجنب الفخاخ الميكانيكية الرملية في سراديب الأهرام، وتسلق الأعمدة، وتأمين وحماية الآثار المكتشفة.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#E6D2A8]/60">الرتبة:</span>
                    <span className={`font-bold ${getSkillRank(skills.defense).color}`}>
                      {getSkillRank(skills.defense).title}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-emerald-400/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, skills.defense)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Development Action Log */}
            <div className="bg-[#0F0D0C] border border-[#D4AF37]/30 rounded-sm p-5">
              <div className="flex items-center justify-between mb-3 border-b border-[#D4AF37]/20 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>سجل الأفعال وتطور المهارات الميدانية:</span>
                </div>
                <span className="text-[10px] text-[#E6D2A8]/60">
                  {skills.skillHistory.length} أفعال موثقة
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {skills.skillHistory.map((item, index) => {
                  const getSkillBadge = (s: PlayerSkillType) => {
                    switch (s) {
                      case 'negotiation':
                        return { label: 'تفاوض', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
                      case 'exploration':
                        return { label: 'استكشاف', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
                      case 'defense':
                        return { label: 'دفاع', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
                    }
                  };

                  const badge = getSkillBadge(item.skill);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-sm bg-white/5 border border-white/10 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-sm border font-bold ${badge.color}`}>
                          +{item.amount} {badge.label}
                        </span>
                        <span className="text-[#F3E5AB] font-amiri text-xs md:text-sm">{item.reason}</span>
                      </div>
                      <span className="text-[10px] text-[#E6D2A8]/50 shrink-0">{item.timestamp}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#D4AF37]/20 bg-[#0F0D0C] flex items-center justify-between text-xs text-[#E6D2A8]/70">
          <span>تم حفظ التعديلات تلقائياً في ملف المستكشف</span>
          <button
            id="btn-confirm-character"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="px-5 py-1.5 rounded-sm border border-[#D4AF37] bg-[#D4AF37] hover:bg-[#b8972f] text-[#0F0D0C] font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            متابعة المغامرة
          </button>
        </div>
      </div>
    </div>
  );
};
