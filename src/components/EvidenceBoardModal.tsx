import React, { useState } from 'react';
import {
  X,
  Sparkles,
  GitBranch,
  FileText,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Link,
  HelpCircle,
  FolderLock,
  Layers,
  BookOpen,
  ArrowLeftRight,
} from 'lucide-react';
import { EvidenceCard, DeductionRecipe, InvestigationCase, PlayerSkillType } from '../types';
import { initialCases, initialEvidenceCards, allDeductionRecipes } from '../data/evidenceData';
import { soundManager } from '../audio/soundManager';

interface EvidenceBoardModalProps {
  discoveredClues: string[];
  solvedDeductions: string[];
  onSolveDeduction: (recipe: DeductionRecipe) => void;
  onClose: () => void;
}

export const EvidenceBoardModal: React.FC<EvidenceBoardModalProps> = ({
  discoveredClues,
  solvedDeductions,
  onSolveDeduction,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'artifact' | 'testimony' | 'cases' | 'solved'>('all');
  const [selectedCardA, setSelectedCardA] = useState<EvidenceCard | null>(null);
  const [selectedCardB, setSelectedCardB] = useState<EvidenceCard | null>(null);
  const [deductionFeedback, setDeductionFeedback] = useState<{
    type: 'success' | 'error' | 'hint';
    message: string;
    sub?: string;
  } | null>(null);

  // Available evidence cards
  const evidenceCards = initialEvidenceCards;

  // Filter cards based on tab
  const filteredCards = evidenceCards.filter((card) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'artifact') return card.type === 'artifact' || card.type === 'clue';
    if (activeTab === 'testimony') return card.type === 'testimony';
    return true;
  });

  const handleSelectCard = (card: EvidenceCard) => {
    soundManager.playClickSFX();
    setDeductionFeedback(null);

    if (!selectedCardA) {
      setSelectedCardA(card);
    } else if (selectedCardA.id === card.id) {
      setSelectedCardA(null);
    } else if (!selectedCardB) {
      setSelectedCardB(card);
    } else if (selectedCardB.id === card.id) {
      setSelectedCardB(null);
    } else {
      // Replace card B
      setSelectedCardB(card);
    }
  };

  const handleAttemptDeduction = () => {
    if (!selectedCardA || !selectedCardB) {
      setDeductionFeedback({
        type: 'hint',
        message: 'حدد دليلين من اللوحة لتجربة الربط واستخلاص النتيجة',
        sub: 'اختر قرينة مادية أو شهادة لترى إن كان بينهما خيط استنتاجي مشترك.',
      });
      return;
    }

    // Find if there is a recipe matching these two cards
    const match = allDeductionRecipes.find(
      (recipe) =>
        (recipe.cardAId === selectedCardA.id && recipe.cardBId === selectedCardB.id) ||
        (recipe.cardAId === selectedCardB.id && recipe.cardBId === selectedCardA.id)
    );

    if (match) {
      if (solvedDeductions.includes(match.id)) {
        setDeductionFeedback({
          type: 'hint',
          message: 'هذا الاستنتاج مسجل بالفعل في ملفات قضيتك!',
          sub: match.breakthroughText,
        });
      } else {
        soundManager.playTriumphSFX();
        onSolveDeduction(match);
        setDeductionFeedback({
          type: 'success',
          message: `تم التوصل إلى استنتاج قاطع: ${match.title}!`,
          sub: match.breakthroughText,
        });
      }
    } else {
      soundManager.playClickSFX();
      setDeductionFeedback({
        type: 'error',
        message: 'لا يوجد رابط استنتاجي مباشر بين هذين الدليلين حالياً',
        sub: 'تمعّن في تفاصيل الشهادات وتواريخ الشحنات، وجرب دمج أدلة أخرى من موقع مختلف.',
      });
    }
  };

  const clearSelection = () => {
    soundManager.playClickSFX();
    setSelectedCardA(null);
    setSelectedCardB(null);
    setDeductionFeedback(null);
  };

  // Calculate overall case progress
  const totalDeductions = allDeductionRecipes.length;
  const completedDeductionsCount = solvedDeductions.length;
  const progressPercent = Math.round((completedDeductionsCount / totalDeductions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#120F0E] border-2 border-[#D4AF37] rounded-sm shadow-[0_0_40px_rgba(212,175,55,0.25)] flex flex-col max-h-[92vh] overflow-hidden text-right font-sans">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#1C1715] via-[#2A221E] to-[#1C1715] border-b border-[#D4AF37]/40 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-black text-[#F3E5AB] font-cairo">
                  لوحة التحقيق الجنائي والأدلة الأثرية
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  {completedDeductionsCount}/{totalDeductions} خيوط مكتشفة
                </span>
              </div>
              <p className="text-xs text-[#E6D2A8]/75 font-amiri mt-0.5">
                اربط بين القرائن المادية، شهادات الشهود ومواقع الجرائم لاستنتاج خفايا المؤامرة الفرعونية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Investigation Progress Bar */}
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="text-[10px] text-[#D4AF37] font-bold">اكتمال التحقيق: {progressPercent}%</span>
              <div className="w-28 h-2 bg-black/60 border border-[#D4AF37]/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-[#D4AF37] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              id="btn-close-evidence-modal"
              onClick={onClose}
              className="p-2 rounded-sm text-[#E6D2A8]/70 hover:text-[#F3E5AB] hover:bg-white/10 transition-colors cursor-pointer"
              title="إغلاق اللوحة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="bg-[#181412] px-4 md:px-6 py-2.5 border-b border-[#D4AF37]/20 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#221C19] text-[#E6D2A8]/80 hover:text-white border border-[#D4AF37]/30'
              }`}
            >
              كافة الأدلة ({evidenceCards.length})
            </button>
            <button
              onClick={() => setActiveTab('artifact')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                activeTab === 'artifact'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#221C19] text-[#E6D2A8]/80 hover:text-white border border-[#D4AF37]/30'
              }`}
            >
              القرائن والآثار ({evidenceCards.filter((c) => c.type === 'artifact' || c.type === 'clue').length})
            </button>
            <button
              onClick={() => setActiveTab('testimony')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                activeTab === 'testimony'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#221C19] text-[#E6D2A8]/80 hover:text-white border border-[#D4AF37]/30'
              }`}
            >
              إفادات المشتبه بهم ({evidenceCards.filter((c) => c.type === 'testimony').length})
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                activeTab === 'cases'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#221C19] text-[#E6D2A8]/80 hover:text-white border border-[#D4AF37]/30'
              }`}
            >
              ملفات القضايا ({initialCases.length})
            </button>
            <button
              onClick={() => setActiveTab('solved')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                activeTab === 'solved'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#221C19] text-emerald-300/80 hover:text-emerald-200 border border-emerald-500/30'
              }`}
            >
              الاستنتاجات المحققة ({completedDeductionsCount})
            </button>
          </div>

          {(selectedCardA || selectedCardB) && (
            <button
              onClick={clearSelection}
              className="text-xs text-red-400 hover:text-red-300 underline shrink-0 cursor-pointer"
            >
              إلغاء التحديد
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Active Deduction Workbench Panel */}
          {activeTab !== 'cases' && activeTab !== 'solved' && (
            <div className="bg-[#191513] border-2 border-dashed border-[#D4AF37]/40 rounded-sm p-4 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-sm font-black text-[#F3E5AB] font-cairo">
                    طاولة الربط والاستنتاج الجنائي
                  </h3>
                </div>
                <span className="text-[11px] text-[#E6D2A8]/70">
                  انقر على أي بطاقتين بالأسفل وضعهما في الخانتين
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Slot 1 */}
                <div
                  className={`p-3 rounded-sm border transition-all min-h-[90px] flex items-center gap-3 ${
                    selectedCardA
                      ? 'bg-amber-950/30 border-[#D4AF37]'
                      : 'bg-black/40 border-dashed border-[#D4AF37]/30 justify-center text-[#E6D2A8]/40'
                  }`}
                >
                  {selectedCardA ? (
                    <>
                      <div className="w-9 h-9 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                        {selectedCardA.type === 'testimony' ? (
                          <MessageSquare className="w-5 h-5" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-[#D4AF37] font-bold">الدليل الأول:</span>
                        <h4 className="text-xs font-bold text-[#F3E5AB] font-cairo truncate">
                          {selectedCardA.title}
                        </h4>
                        <p className="text-[11px] text-[#E6D2A8]/70 line-clamp-1">{selectedCardA.locationName}</p>
                      </div>
                      <button
                        onClick={() => setSelectedCardA(null)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        title="إزالة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-cairo">انقر لاختيار الدليل الأول (أ)</span>
                  )}
                </div>

                {/* Slot 2 */}
                <div
                  className={`p-3 rounded-sm border transition-all min-h-[90px] flex items-center gap-3 ${
                    selectedCardB
                      ? 'bg-amber-950/30 border-[#D4AF37]'
                      : 'bg-black/40 border-dashed border-[#D4AF37]/30 justify-center text-[#E6D2A8]/40'
                  }`}
                >
                  {selectedCardB ? (
                    <>
                      <div className="w-9 h-9 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                        {selectedCardB.type === 'testimony' ? (
                          <MessageSquare className="w-5 h-5" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-[#D4AF37] font-bold">الدليل الثاني:</span>
                        <h4 className="text-xs font-bold text-[#F3E5AB] font-cairo truncate">
                          {selectedCardB.title}
                        </h4>
                        <p className="text-[11px] text-[#E6D2A8]/70 line-clamp-1">{selectedCardB.locationName}</p>
                      </div>
                      <button
                        onClick={() => setSelectedCardB(null)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        title="إزالة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-cairo">انقر لاختيار الدليل الثاني (ب)</span>
                  )}
                </div>
              </div>

              {/* Deduction Action Button */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  id="btn-deduce-connection"
                  onClick={handleAttemptDeduction}
                  disabled={!selectedCardA || !selectedCardB}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-sm font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedCardA && selectedCardB
                      ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black shadow-lg active:scale-95'
                      : 'bg-[#2A2320] text-[#E6D2A8]/40 border border-[#D4AF37]/20 cursor-not-allowed'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>ربط الخيوط واستنتاج الحقيقة</span>
                </button>

                {deductionFeedback && (
                  <div
                    className={`flex-1 p-3 rounded-sm text-right text-xs leading-relaxed animate-fadeIn border ${
                      deductionFeedback.type === 'success'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                        : deductionFeedback.type === 'error'
                        ? 'bg-red-950/40 border-red-500 text-red-200'
                        : 'bg-amber-950/40 border-amber-500 text-amber-200'
                    }`}
                  >
                    <div className="font-bold font-cairo flex items-center gap-1.5">
                      {deductionFeedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {deductionFeedback.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {deductionFeedback.type === 'hint' && <HelpCircle className="w-4 h-4 text-amber-400" />}
                      <span>{deductionFeedback.message}</span>
                    </div>
                    {deductionFeedback.sub && (
                      <p className="text-[11px] opacity-80 mt-1 font-amiri">{deductionFeedback.sub}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {activeTab !== 'cases' && activeTab !== 'solved' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">
                  الأدلة والشهادات المعلقة على اللوحة ({filteredCards.length})
                </h3>
                <span className="text-[11px] text-[#E6D2A8]/60">انقر على بطاقة لاختيارها</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredCards.map((card) => {
                  const isSelected = selectedCardA?.id === card.id || selectedCardB?.id === card.id;
                  const isTestimony = card.type === 'testimony';

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleSelectCard(card)}
                      className={`relative p-4 rounded-sm border transition-all cursor-pointer group flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#2A201A] border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-xl'
                          : 'bg-[#181412]/90 border-[#D4AF37]/25 hover:border-[#D4AF37]/70 hover:bg-[#1E1916]'
                      }`}
                    >
                      {/* Pushpin Graphic */}
                      <div className="absolute -top-2.5 right-4 w-5 h-5 rounded-full bg-red-600 border-2 border-amber-300 shadow-md flex items-center justify-center text-[9px] text-white font-black">
                        📌
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-xs border ${
                              isTestimony
                                ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
                                : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                            }`}
                          >
                            {isTestimony ? 'شهادة مسجلة' : 'قرينة مادية'}
                          </span>
                          <span className="text-[10px] text-[#E6D2A8]/50 truncate">{card.locationName}</span>
                        </div>

                        <h4 className="text-sm font-bold text-[#F3E5AB] font-cairo mb-1.5 leading-snug group-hover:text-amber-300">
                          {card.title}
                        </h4>
                        <p className="text-xs text-[#E6D2A8]/75 font-amiri leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-[#D4AF37]/80 font-cairo">
                        <span>المصدر: {card.source}</span>
                        <span className="underline font-bold">
                          {isSelected ? '✓ تم التحديد' : '+ حدد للربط'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cases Tab */}
          {activeTab === 'cases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F3E5AB] font-cairo flex items-center gap-2">
                  <FolderLock className="w-4 h-4 text-[#D4AF37]" />
                  <span>ملفات القضايا والجرائم الأثرية الكبرى</span>
                </h3>
              </div>

              <div className="space-y-3.5">
                {initialCases.map((c) => {
                  const caseSolvedCount = c.requiredDeductions.filter((dId) =>
                    solvedDeductions.includes(dId)
                  ).length;
                  const isCaseDone = caseSolvedCount >= c.requiredDeductions.length;

                  return (
                    <div
                      key={c.id}
                      className={`p-5 rounded-sm border transition-all ${
                        isCaseDone
                          ? 'bg-emerald-950/20 border-emerald-500/50'
                          : 'bg-[#181412] border-[#D4AF37]/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                                isCaseDone
                                  ? 'bg-emerald-500 text-black'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {isCaseDone ? 'قضية محلولة ومغلقة ✓' : 'قيد التحقيق الميداني'}
                            </span>
                            <h4 className="text-base font-bold text-[#F3E5AB] font-cairo">
                              {c.title}
                            </h4>
                          </div>
                          <p className="text-xs text-[#E6D2A8]/70 font-amiri mt-0.5">{c.subtitle}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-[#D4AF37] font-bold">
                            {caseSolvedCount}/{c.requiredDeductions.length} استنتاجات
                          </span>
                          {isCaseDone && (
                            <span className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500">
                              <Award className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#E6D2A8]/85 font-amiri leading-relaxed mb-3">
                        {c.description}
                      </p>

                      <div className="bg-black/40 p-3 rounded-sm border border-[#D4AF37]/15">
                        <span className="text-[11px] text-[#D4AF37] font-bold block mb-1.5">
                          الاستنتاجات المطلوبة لإغلاق القضية:
                        </span>
                        <div className="space-y-1.5">
                          {c.requiredDeductions.map((recipeId) => {
                            const recipe = allDeductionRecipes.find((r) => r.id === recipeId);
                            const isDone = solvedDeductions.includes(recipeId);

                            return (
                              <div
                                key={recipeId}
                                className="flex items-center justify-between text-xs font-cairo px-2 py-1 bg-white/5 rounded-xs"
                              >
                                <span className={isDone ? 'text-emerald-300 font-bold' : 'text-[#E6D2A8]/60'}>
                                  {recipe?.title || recipeId}
                                </span>
                                <span className={isDone ? 'text-emerald-400' : 'text-amber-400/60'}>
                                  {isDone ? '✓ تم الاستنتاج' : 'بانتظار الربط'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Solved Deductions Tab */}
          {activeTab === 'solved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-emerald-300 font-cairo flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>الاستنتاجات المحققة والمؤكدة رسمياً ({completedDeductionsCount})</span>
                </h3>
              </div>

              {completedDeductionsCount === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#D4AF37]/30 rounded-sm bg-black/20">
                  <GitBranch className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-[#F3E5AB] font-cairo">
                    لم تقم بربط أي استنتاج جنائي بعد
                  </h4>
                  <p className="text-xs text-[#E6D2A8]/60 font-amiri mt-1 max-w-sm mx-auto">
                    انتقل إلى تبويب "كافة الأدلة"، وحدد دليلين من اللوحة، ثم انقر على زر الربط لاستخلاص أول خيط مؤكد.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {solvedDeductions.map((recipeId) => {
                    const recipe = allDeductionRecipes.find((r) => r.id === recipeId);
                    if (!recipe) return null;

                    return (
                      <div
                        key={recipeId}
                        className="p-4 rounded-sm bg-[#132018] border border-emerald-500/40 shadow-md relative overflow-hidden"
                      >
                        {/* Solved Stamp */}
                        <div className="absolute top-3 left-4 text-[10px] font-black uppercase tracking-wider text-emerald-400 border-2 border-emerald-500 px-2 py-0.5 rounded-xs transform -rotate-6 opacity-85">
                          تم الكشف والتأكيد
                        </div>

                        <span className="text-[10px] text-amber-400 font-bold block mb-1">
                          {recipe.caseTitle}
                        </span>
                        <h4 className="text-sm font-bold text-white font-cairo mb-1.5">
                          {recipe.title}
                        </h4>
                        <p className="text-xs text-emerald-100/80 font-amiri leading-relaxed mb-2">
                          {recipe.breakthroughText}
                        </p>
                        <div className="p-2 rounded-xs bg-black/40 border border-emerald-500/30 text-[11px] text-emerald-300 font-cairo">
                          💡 النتيجة الأثرية: {recipe.unlockedClue}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#181412] px-4 md:px-6 py-3 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E6D2A8]/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>نصيحة المحقق: كلما تقدمت في الحوارات وفحص المواقع، ازدادت الأدلة المتاحة للربط.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm bg-[#2A221E] hover:bg-[#382F2A] border border-[#D4AF37]/40 text-[#F3E5AB] font-bold transition-all cursor-pointer"
          >
            العودة للمغامرة
          </button>
        </div>
      </div>
    </div>
  );
};
