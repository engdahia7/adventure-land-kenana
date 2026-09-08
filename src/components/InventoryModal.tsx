import React, { useState } from 'react';
import { X, Briefcase, BookOpen, Search, Coins, Scroll, Sun, Shield, Award, Sparkles, MapPin } from 'lucide-react';
import { InventoryItem } from '../types';
import { soundManager } from '../audio/soundManager';

interface InventoryModalProps {
  items: InventoryItem[];
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ items, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem>(items[0] || null);

  const getItemIcon = (iconName: string) => {
    const className = "w-6 h-6";
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'Coins':
        return <Coins className={className} />;
      case 'Scroll':
        return <Scroll className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Award':
        return <Award className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-[#0F0D0C] border border-[#D4AF37]/50 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Subtle Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none z-10"></div>
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none z-10"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/30 bg-[#0F0D0C]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F3E5AB] font-cairo">
                حقيبة المستكشف والآثار
              </h3>
              <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-0.5">
                القطع الأثرية، المعدات، وأجزاء المخطوطة الفرعونية المكتشفة ({items.length})
              </p>
            </div>
          </div>

          <button
            id="btn-close-inventory"
            onClick={() => {
              soundManager.playClickSFX();
              onClose();
            }}
            className="p-1.5 rounded-sm border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col md:flex-row gap-6 bg-[#0F0D0C]">
          {/* Items Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    id={`inventory-item-${item.id}`}
                    onClick={() => {
                      soundManager.playClickSFX();
                      setSelectedItem(item);
                    }}
                    className={`flex flex-col items-center text-center p-4 rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                        : 'bg-[#0F0D0C] border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-sm flex items-center justify-center mb-2.5 border transition-all ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0F0D0C]'
                          : 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]'
                      }`}
                    >
                      {getItemIcon(item.icon)}
                    </div>
                    <span className="text-xs font-bold text-[#F3E5AB] line-clamp-1 font-cairo">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#D4AF37]/70 mt-1 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Item Detail Panel */}
          {selectedItem && (
            <div className="w-full md:w-80 bg-[#0F0D0C] border border-[#D4AF37]/40 rounded-sm p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-sm border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] uppercase tracking-wider">
                    {selectedItem.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#E6D2A8]/70">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{selectedItem.discoveredAt}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-[#F3E5AB] font-cairo mb-2">
                  {selectedItem.name}
                </h4>

                <p className="text-xs text-[#E6D2A8]/80 font-amiri leading-relaxed mb-4">
                  {selectedItem.description}
                </p>

                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-sm p-3.5 text-xs text-[#F3E5AB] font-amiri leading-relaxed">
                  <span className="font-bold block text-[#D4AF37] mb-1 font-cairo text-[11px] uppercase tracking-wider">
                    المعلومة التاريخية:
                  </span>
                  {selectedItem.historicalFact}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-[#E6D2A8]/60">
                <span>جاهز للاستخدام في الألغاز</span>
                <span className="text-[#D4AF37] font-bold">نشط</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
