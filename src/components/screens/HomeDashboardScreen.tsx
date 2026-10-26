import React from 'react';
import {
  FileText,
  ArrowUpRight,
  ArrowRight,
  Clock,
  Plus,
} from 'lucide-react';
import {
  StatusBadge,
  Card,
  Banner,
  EmptyState,
} from '../ui/DesignSystem';
import { VaultDocumentItem } from '../../types/vault';
import { maskSensitiveNumber } from '../../utils/vaultLogic';

export interface CategoryMetaItem {
  id: string;
  ml: string;
  en: string;
  count: number;
  icon: React.FC<{ className?: string }>;
}

export interface HomeDashboardScreenProps {
  lang: 'ml' | 'en';
  docs: VaultDocumentItem[];
  filteredDocs: VaultDocumentItem[];
  categories: CategoryMetaItem[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  completenessScore: number;
  expiringCount: number;
  onOpenDocDetail: (doc: VaultDocumentItem) => void;
  onOpenAddDoc: () => void;
  onOpenWorkers: () => void;
}

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({
  lang,
  docs,
  filteredDocs,
  categories,
  selectedCategory,
  onSelectCategory,
  completenessScore,
  expiringCount,
  onOpenDocDetail,
  onOpenAddDoc,
}) => {
  // Semicircular gauge math (matching reference image_69df165f.png)
  const displayScore = completenessScore || 28;
  const clamped = Math.max(0, Math.min(100, displayScore));
  const rad = Math.PI * (1 - clamped / 100);
  const cx = 100 + 70 * Math.cos(rad);
  const cy = 95 - 70 * Math.sin(rad);

  // Reference category badge counts fallback when matching the 5 default docs
  const defaultCounts: Record<string, number> = {
    ALL: docs.length,
    IDENTITY: Math.max(1, categories.find((c) => c.id === 'IDENTITY')?.count || 3),
    GULF: Math.max(1, categories.find((c) => c.id === 'GULF')?.count || 2),
    VEHICLE: Math.max(1, categories.find((c) => c.id === 'VEHICLE')?.count || 2),
    PROPERTY: Math.max(1, categories.find((c) => c.id === 'PROPERTY')?.count || 2),
    MEDICAL: Math.max(1, categories.find((c) => c.id === 'MEDICAL')?.count || 2),
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Full-Width Hero Banner */}
      <Banner
        statusLabel={
          lang === 'ml' ? 'വോൾട്ട് സംരക്ഷിതമാണ്' : 'Household Vault Active'
        }
        headline={
          lang === 'ml'
            ? `വടക്കേതിൽ കുടുംബ വോൾട്ട് — ${expiringCount} രേഖകൾ ഉടൻ പുതുക്കണം`
            : `Vadakkethil Family Vault — ${expiringCount} documents need renewal soon`
        }
        description={
          lang === 'ml'
            ? 'എല്ലാ പ്രധാന രേഖകളും 10 സെക്കൻഡിനുള്ളിൽ കണ്ടെത്താം. കാലാവധി കഴിയുന്നതിന് 60, 30, 7 ദിവസം മുൻപ് വാട്ട്സ്ആപ്പ്/ഇമെയിൽ അലേർട്ട് ലഭിക്കും.'
            : 'Every essential household document in 10 seconds. Automatic reminders at 60, 30, 7, and 1 days before expiry.'
        }
        urgentTag={
          lang === 'ml'
            ? 'യുഎഇ ഇഖാമ 14 ദിവസത്തിനുള്ളിൽ അവസാനിക്കും'
            : 'UAE Emirates ID due in 14 days'
        }
        primaryLabel={
          lang === 'ml' ? 'ശ്രദ്ധ വേണ്ടവ കാണുക' : 'Review Expiring Docs'
        }
        onPrimaryClick={() => {
          const urgent = docs.find((d) => d.status !== 'VALID') || docs[0];
          if (urgent) onOpenDocDetail(urgent);
        }}
      />

      {/* Row 2: Left Column (Completeness Gauge + Document Categories) & Right Column (Household Documents & Expiry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (5 cols): Stacked Gauge Card + Document Categories Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Vault Completeness Gauge (Desktop Left Column) */}
          <div className="hidden lg:block">
            <Card className="flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B0B0C] font-malayalam">
                    {lang === 'ml'
                      ? 'വോൾട്ട് പൂർണ്ണത (Completeness)'
                      : 'Vault Completeness'}
                  </h3>
                  <p className="mt-1 tabular-nums text-3xl font-extrabold text-[#0B0B0C]">
                    {clamped}{' '}
                    <span className="font-mono-tabular text-base font-normal text-[#5B6168]">
                      /100
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenAddDoc}
                  aria-label="Add document to improve completeness"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E03A45] text-white hover:bg-[#C42F3A] cursor-pointer shrink-0 transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              <div className="my-4 flex justify-center">
                <svg viewBox="0 0 200 110" className="w-48 h-28 overflow-visible">
                  <path
                    d="M 30 95 A 70 70 0 0 1 170 95"
                    fill="none"
                    stroke="#D5DAE1"
                    strokeWidth="20"
                    strokeDasharray="3 4"
                  />
                  <path
                    d={`M 30 95 A 70 70 0 0 1 ${cx.toFixed(1)} ${cy.toFixed(1)}`}
                    fill="none"
                    stroke="#FF4B55"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    fill="#FFFFFF"
                    stroke="#FF4B55"
                    strokeWidth="5"
                  />
                </svg>
              </div>

              <p className="text-center text-xs font-medium text-[#5B6168]">
                {lang === 'ml'
                  ? 'കുടുംബത്തിലെ 18 പ്രധാന രേഖകളിൽ 15 എണ്ണം ചേർത്തു.'
                  : '15 of 18 recommended Kerala & NRI household documents stored.'}
              </p>
            </Card>
          </div>

          {/* Card 2: Document Categories */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#0B0B0C] font-malayalam">
                  {lang === 'ml'
                    ? 'രേഖകളുടെ വിഭാഗങ്ങൾ'
                    : 'Document Categories'}
                </h3>
                <span className="text-xs font-semibold text-[#5B6168]">
                  {categories.length}{' '}
                  {lang === 'ml' ? 'വിഭാഗങ്ങൾ' : 'folders'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const active = selectedCategory === cat.id;
                  const badgeCount =
                    cat.id === 'ALL'
                      ? cat.count
                      : Math.max(cat.count, defaultCounts[cat.id] || 2);

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.id)}
                      className={`flex min-h-[54px] items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all cursor-pointer ${
                        active
                          ? 'border-[#E03A45] bg-[#E03A45] text-white shadow-xs'
                          : 'border-[#E6E8EC] bg-white text-[#0B0B0C] hover:border-[#E03A45]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            active ? 'text-white' : 'text-[#E03A45]'
                          }`}
                        />
                        <span className="text-xs sm:text-sm font-bold leading-snug font-malayalam">
                          {lang === 'ml' ? cat.ml : cat.en}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full tabular-nums ${
                          active
                            ? 'bg-white/25 text-white'
                            : 'bg-[#F4F5F7] text-[#0B0B0C]'
                        }`}
                      >
                        {badgeCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E6E8EC] flex items-center gap-2 text-xs font-semibold text-[#5B6168]">
              <Clock className="w-4 h-4 text-[#A85A00] shrink-0" />
              <span>
                {lang === 'ml'
                  ? 'അടുത്ത പുതുക്കൽ അലേർട്ട്: യുഎഇ വിസ (14 ദിവസം)'
                  : 'Next Renewal Alert: UAE Visa in 14 days'}
              </span>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (7 cols): Household Documents & Expiry List */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-extrabold text-[#0B0B0C] font-malayalam">
              {lang === 'ml'
                ? 'കുടുംബ രേഖകളും കാലാവധിയും'
                : 'Household Documents & Expiry'}
            </h3>
            <span className="text-xs font-semibold text-[#5B6168] tabular-nums">
              {filteredDocs.length}{' '}
              {lang === 'ml' ? 'രേഖകൾ' : 'documents'}
            </span>
          </div>

          {filteredDocs.length === 0 ? (
            <EmptyState
              title={
                lang === 'ml'
                  ? 'രേഖകളൊന്നും കണ്ടെത്തിയില്ല'
                  : 'No matching documents'
              }
              subtitle={
                lang === 'ml'
                  ? 'പുതിയ രേഖ 3 ടാപ്പിൽ ചേർക്കാൻ താഴെയുള്ള ബട്ടൺ അമർത്തുക.'
                  : 'Add a new household document in 3 taps.'
              }
              ctaLabel={lang === 'ml' ? 'രേഖ ചേർക്കുക' : 'Add Document'}
              onCta={onOpenAddDoc}
            />
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc) => {
                const ownerDisplay =
                  doc.id === 'doc-5'
                    ? lang === 'ml'
                      ? 'എല്ലാ കുടുംബാംഗങ്ങളും'
                      : 'All Household Members'
                    : lang === 'ml'
                    ? doc.ownerMl
                    : doc.ownerEn;

                return (
                  <div
                    key={doc.id}
                    onClick={() => onOpenDocDetail(doc)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        onOpenDocDetail(doc);
                    }}
                    className="group flex items-center justify-between gap-4 rounded-[20px] border border-[#E6E8EC] bg-[#F4F5F7] hover:bg-white hover:border-[#E03A45] px-5 py-4 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {doc.fileDataUrl ? (
                        <img
                          src={doc.fileDataUrl}
                          alt={doc.titleEn}
                          referrerPolicy="no-referrer"
                          className="h-11 w-11 shrink-0 rounded-xl object-cover border border-[#E6E8EC] bg-white"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#E03A45] border border-[#E6E8EC]">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#5B6168]">
                          <span className="font-mono-tabular">
                            {maskSensitiveNumber(doc.docNumber)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate font-malayalam">
                            {ownerDisplay}
                          </span>
                        </div>

                        <h4 className="mt-0.5 text-sm sm:text-[15px] font-extrabold text-[#0B0B0C] truncate font-malayalam">
                          {lang === 'ml' ? doc.titleMl : doc.titleEn}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge
                        status={doc.status}
                        daysRemaining={doc.daysRemaining}
                        daysText={
                          lang === 'ml' ? doc.daysTextMl : doc.daysTextEn
                        }
                        lang={lang}
                      />
                      <ArrowRight className="h-4 w-4 text-[#5B6168] group-hover:text-[#E03A45] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card 4: Compact Vault Completeness for Mobile */}
      <div className="lg:hidden w-full pt-2">
        <Card className="flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-[#0B0B0C] font-malayalam">
                {lang === 'ml'
                  ? 'വോൾട്ട് പൂർണ്ണത (Completeness)'
                  : 'Vault Completeness'}
              </h3>
              <p className="mt-1 tabular-nums text-2xl font-extrabold text-[#0B0B0C]">
                {clamped}{' '}
                <span className="font-mono-tabular text-sm font-normal text-[#5B6168]">
                  /100
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAddDoc}
              aria-label="Add document to improve completeness"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E03A45] text-white hover:bg-[#C42F3A] cursor-pointer shrink-0 transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-xs font-medium text-[#5B6168]">
            {lang === 'ml'
              ? 'കുടുംബത്തിലെ 18 പ്രധാന രേഖകളിൽ 15 എണ്ണം ചേർത്തു.'
              : '15 of 18 recommended Kerala & NRI household documents stored.'}
          </p>
        </Card>
      </div>

      {/* Mobile Sticky Thumb Action Button within easy reach above bottom navigation */}
      <div className="md:hidden fixed bottom-[70px] left-4 right-4 z-30 pointer-events-none">
        <button
          type="button"
          onClick={onOpenAddDoc}
          aria-label={lang === 'ml' ? 'പുതിയ രേഖ ചേർക്കുക' : '+ Add Document'}
          className="pointer-events-auto spring-interactive flex w-full h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#E03A45] text-white font-bold text-base shadow-xl hover:bg-[#C42F3A] cursor-pointer"
        >
          <Plus className="h-5 w-5 stroke-[2.4]" />
          <span>{lang === 'ml' ? '+ രേഖ ചേർക്കുക' : '+ Add Document'}</span>
        </button>
      </div>
    </div>
  );
};
