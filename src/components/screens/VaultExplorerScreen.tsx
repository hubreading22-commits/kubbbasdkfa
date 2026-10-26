import React from 'react';
import { FileText } from 'lucide-react';
import { Chip, StatusBadge, EmptyState } from '../ui/DesignSystem';
import { VaultDocumentItem, formatHumanDate } from '../../types/vault';
import { maskSensitiveNumber } from '../../utils/vaultLogic';
import { CategoryMetaItem } from './HomeDashboardScreen';

export interface VaultExplorerScreenProps {
  lang: 'ml' | 'en';
  filteredDocs: VaultDocumentItem[];
  categories: CategoryMetaItem[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onOpenDocDetail: (doc: VaultDocumentItem) => void;
  onOpenAddDoc: () => void;
}

export const VaultExplorerScreen: React.FC<VaultExplorerScreenProps> = ({
  lang,
  filteredDocs,
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenDocDetail,
  onOpenAddDoc,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-semibold text-[#0B0B0C] font-malayalam">
            {lang === 'ml'
              ? 'കുടുംബ രേഖകളുടെ വോൾട്ട്'
              : 'Household Document Vault'}
          </h2>
          <p className="text-[16px] text-[#5B6168]">
            {lang === 'ml'
              ? 'എല്ലാ രേഖകളും സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുന്നു.'
              : 'Identity, Gulf NRI, vehicle, property, and medical records.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={lang === 'ml' ? cat.ml : cat.en}
              count={cat.count}
              active={selectedCategory === cat.id}
              onClick={() => onSelectCategory(cat.id)}
            />
          ))}
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <EmptyState
          title={
            lang === 'ml'
              ? 'ഈ വിഭാഗത്തിൽ രേഖകളില്ല'
              : 'No documents in this category'
          }
          subtitle={
            lang === 'ml'
              ? '3 ടാപ്പിൽ പുതിയ രേഖ ചേർക്കാൻ താഴെയുള്ള ബട്ടൺ അമർത്തുക.'
              : 'Upload or scan a document in 3 taps.'
          }
          ctaLabel={lang === 'ml' ? '+ രേഖ ചേർക്കുക' : '+ Add Document'}
          onCta={onOpenAddDoc}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocDetail(doc)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onOpenDocDetail(doc);
              }}
              className="rounded-[20px] border border-[#E6E8EC] bg-white p-5 hover:border-[#E03A45] transition-all cursor-pointer flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  {doc.fileDataUrl ? (
                    <img
                      src={doc.fileDataUrl}
                      alt={doc.titleEn}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover border border-[#E6E8EC]"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F4F5F7] text-[#E03A45] border border-[#E6E8EC]">
                      <FileText className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-[16px] text-[#5B6168] block truncate font-malayalam">
                      {lang === 'ml' ? doc.subMl : doc.subEn} •{' '}
                      {lang === 'ml' ? doc.ownerMl : doc.ownerEn}
                    </span>
                    <h3 className="mt-0.5 text-[18px] font-semibold text-[#0B0B0C] truncate font-malayalam">
                      {lang === 'ml' ? doc.titleMl : doc.titleEn}
                    </h3>
                  </div>
                </div>
                <StatusBadge
                  status={doc.status}
                  daysText={lang === 'ml' ? doc.daysTextMl : doc.daysTextEn}
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E6E8EC] text-[16px] text-[#5B6168]">
                <span className="font-medium text-[#0B0B0C]">
                  {maskSensitiveNumber(doc.docNumber)}
                </span>
                <span>
                  {lang === 'ml' ? 'കാലാവധി: ' : 'Expires: '}
                  {formatHumanDate(doc.expiryDate, lang)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
