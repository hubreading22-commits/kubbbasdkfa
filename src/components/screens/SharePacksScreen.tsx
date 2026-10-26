import React, { useState } from 'react';
import { Plus, Trash2, Check, Download } from 'lucide-react';
import { Button, Card } from '../ui/DesignSystem';
import { SharePackItem, VaultDocumentItem } from '../../types/vault';

export interface SharePacksScreenProps {
  lang: 'ml' | 'en';
  sharePacks: SharePackItem[];
  docs: VaultDocumentItem[];
  onOpenAddShareModal: () => void;
  onDeleteSharePack: (packId: string) => void;
  onOpenDocDetail: (doc: VaultDocumentItem) => void;
}

/**
 * Generates a valid, standards-compliant single-page PDF 1.4 document
 * summarizing the Share Pack and all included household documents.
 */
function buildSharePackPdfBlob(
  pack: SharePackItem,
  bundledDocs: VaultDocumentItem[]
): Blob {
  const escapePdfText = (text: string) =>
    text
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');

  const lines: string[] = [
    'KUDUMBA VAULT - HOUSEHOLD SHARE PACK',
    `Pack Title: ${pack.titleEn}`,
    `Purpose / Recipient: ${pack.recipientEn || pack.descEn || pack.recipientType || 'Authorized Recipient'}`,
    `Created Date: ${pack.createdAt}`,
    `Included Documents (${bundledDocs.length}):`,
    '------------------------------------------------------------',
  ];

  bundledDocs.forEach((doc, idx) => {
    lines.push(`${idx + 1}. ${doc.titleEn}`);
    lines.push(`   Owner: ${doc.ownerEn}`);
    lines.push(`   Doc Number: ${doc.docNumber}   |   Expiry: ${doc.expiryDate}`);
    lines.push(`   Issuing Authority: ${doc.authorityEn}`);
    lines.push('');
  });

  lines.push('------------------------------------------------------------');
  lines.push('Generated offline by Vadakkethil Kudumba Vault.');

  const textOps = [
    'BT',
    '/F1 14 Tf',
    '50 760 Td',
    '18 TL',
    ...lines.map((line, idx) =>
      idx === 0
        ? `(${escapePdfText(line)}) Tj /F1 11 Tf T*`
        : `(${escapePdfText(line)}) Tj T*`
    ),
    'ET',
  ].join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${textOps.length} >>\nstream\n${textOps}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export const SharePacksScreen: React.FC<SharePacksScreenProps> = ({
  lang,
  sharePacks,
  docs,
  onOpenAddShareModal,
  onDeleteSharePack,
  onOpenDocDetail,
}) => {
  const [downloadedPackId, setDownloadedPackId] = useState<string | null>(null);

  const handleDownloadPackPdf = (
    pack: SharePackItem,
    bundledDocs: VaultDocumentItem[]
  ) => {
    const blob = buildSharePackPdfBlob(pack, bundledDocs);
    const url = URL.createObjectURL(blob);
    const slug = pack.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slug || 'share-pack'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);

    setDownloadedPackId(pack.id);
    setTimeout(() => setDownloadedPackId(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-semibold text-[#0B0B0C] font-malayalam">
            {lang === 'ml'
              ? 'സുരക്ഷിത ഷെയർ പായ്ക്കുകൾ'
              : 'Expiring Share Packs'}
          </h2>
          <p className="text-[16px] text-[#5B6168]">
            {lang === 'ml'
              ? 'ആശുപത്രി, സിഎ, വില്ലേജ് ഓഫീസ് എന്നിവർക്ക് നിശ്ചിത സമയത്തേക്ക് മാത്രം രേഖകൾ അയക്കാം.'
              : 'Create time-limited, view-only document bundles for hospitals, CAs, or village offices.'}
          </p>
        </div>

        <Button variant="primary" onClick={onOpenAddShareModal}>
          <Plus className="h-5 w-5" />
          <span>
            {lang === 'ml' ? '+ പുതിയ ഷെയർ പായ്ക്ക്' : '+ Create Share Pack'}
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sharePacks.map((pack) => {
          const bundledDocs = docs.filter((d) => pack.docIds.includes(d.id));
          const isDownloaded = downloadedPackId === pack.id;
          const badgeLabel =
            lang === 'ml'
              ? pack.expiryLabelMl || pack.tag || 'PDF പായ്ക്ക്'
              : pack.expiryLabelEn || pack.tag || 'PDF Pack';
          const subtitleText =
            lang === 'ml'
              ? pack.recipientMl || pack.descMl || ''
              : pack.recipientEn || pack.descEn || '';

          return (
            <Card
              key={pack.id}
              className="flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-full bg-[#FFF4D6] px-3.5 py-1 text-xs font-bold text-[#A85A00]">
                    {badgeLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteSharePack(pack.id)}
                    aria-label="Delete share pack"
                    className="text-[#5B6168] hover:text-[#B3121F] p-2 cursor-pointer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <h3 className="text-[18px] font-semibold text-[#0B0B0C] font-malayalam">
                  {lang === 'ml' ? pack.titleMl : pack.titleEn}
                </h3>
                {subtitleText && (
                  <p className="text-sm text-[#5B6168] font-malayalam">
                    {subtitleText}
                  </p>
                )}

                {bundledDocs.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[16px] font-medium text-[#5B6168]">
                      {lang === 'ml'
                        ? `ഉൾപ്പെടുത്തിയ രേഖകൾ (${bundledDocs.length})`
                        : `Included Docs (${bundledDocs.length})`}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {bundledDocs.map((bd) => (
                        <button
                          key={bd.id}
                          type="button"
                          onClick={() => onOpenDocDetail(bd)}
                          className="rounded-xl bg-[#F4F5F7] border border-[#E6E8EC] px-3 py-1.5 text-[16px] font-medium text-[#0B0B0C] hover:border-[#E03A45] cursor-pointer font-malayalam"
                        >
                          {lang === 'ml' ? bd.titleMl : bd.titleEn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#E6E8EC]">
                <Button
                  variant={isDownloaded ? 'secondary' : 'primary'}
                  className="w-full"
                  onClick={() => handleDownloadPackPdf(pack, bundledDocs)}
                >
                  {isDownloaded ? (
                    <>
                      <Check className="h-5 w-5 text-[#0F7B3E]" />
                      <span>
                        {lang === 'ml'
                          ? 'PDF ഡൗൺലോഡ് ചെയ്തു!'
                          : 'PDF Downloaded!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      <span>
                        {lang === 'ml'
                          ? 'PDF ഡൗൺലോഡ് ചെയ്യുക'
                          : 'Download PDF'}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

