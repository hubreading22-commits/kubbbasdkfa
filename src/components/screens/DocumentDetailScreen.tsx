import React, { useState, useRef } from 'react';
import {
  Eye,
  EyeOff,
  RefreshCw,
  Camera,
  Sparkles,
  Lock,
  Maximize2,
  Download,
  X,
  Image as ImageIcon,
  Undo2,
} from 'lucide-react';
import { Button, StatusBadge, Card } from '../ui/DesignSystem';
import { VaultMascot, MascotPose } from '../VaultMascot';
import {
  VaultDocumentItem,
  readFileAsDataUrl,
  formatHumanDate,
} from '../../types/vault';
import { maskSensitiveNumber } from '../../utils/vaultLogic';

export interface Screen3DocumentDetailProps {
  lang: 'ml' | 'en';
  doc: VaultDocumentItem;
  onRenewDocument: (docId: string) => void;
  onUpdateDocument: (updated: VaultDocumentItem) => void;
  onBackToHome: () => void;
}

export const Screen3DocumentDetail: React.FC<Screen3DocumentDetailProps> = ({
  lang,
  doc,
  onRenewDocument,
  onUpdateDocument,
  onBackToHome,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [justRenewed, setJustRenewed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleRenew = () => {
    onRenewDocument(doc.id);
    setJustRenewed(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await readFileAsDataUrl(file);
    const updated: VaultDocumentItem = {
      ...doc,
      attachmentDataUrl: compressed.dataUrl,
      attachmentName: compressed.name,
      attachmentSize: compressed.sizeLabel,
      fileDataUrl: compressed.dataUrl,
      fileName: file.name,
      renewalHistory: [
        {
          id: `rh-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          noteMl: `പുതിയ ഫയൽ അപ്‌ലോഡ് ചെയ്തു (${file.name})`,
          noteEn: `Attached/Updated document scan (${file.name})`,
          actionMl: `പുതിയ ഫയൽ അപ്‌ലോഡ് ചെയ്തു (${file.name})`,
          actionEn: `Attached/Updated document scan (${file.name})`,
          by: 'Rahul Nair',
        },
        ...doc.renewalHistory,
      ],
    };
    onUpdateDocument(updated);
    setUploadStatus(
      lang === 'ml'
        ? 'ഫോട്ടോ / ഫയൽ സ്ഥിരമായി സേവ് ചെയ്തു!'
        : 'Document scan permanently saved!'
    );
    setTimeout(() => setUploadStatus(null), 3000);
  };

  const handleDownloadOriginal = () => {
    const link = document.createElement('a');
    if (doc.fileDataUrl) {
      link.href = doc.fileDataUrl;
      link.download =
        doc.fileName ||
        `${doc.titleEn.toLowerCase().replace(/\s+/g, '-')}.png`;
    } else {
      const summary = `Kudumba Vault Document\nTitle: ${doc.titleEn}\nOwner: ${doc.ownerEn}\nDocument Number: ${doc.docNumber}\nExpiry Date: ${doc.expiryDate}\nAuthority: ${doc.authorityEn}\n`;
      const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
      link.href = URL.createObjectURL(blob);
      link.download = `${doc.titleEn.toLowerCase().replace(/\s+/g, '-')}.txt`;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mascotPose: MascotPose =
    justRenewed || doc.status === 'VALID' ? 'celebrating' : 'worried';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 7 Cols: Document Preview Card + Rich Media Viewer + Masked Number + Renewal Action */}
      <Card className="lg:col-span-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E8EC] pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              aria-label={lang === 'ml' ? 'തിരികെ പോവുക' : 'Back to Dashboard'}
              className="spring-interactive flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-[#E03A45] bg-[#FFF5F5] text-[#E03A45] hover:bg-[#E03A45] hover:text-white transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Undo2 className="h-5 w-5 stroke-[2.3]" />
            </button>
            <div>
              <span className="text-[15px] font-medium text-[#5B6168]">
                {lang === 'ml' ? doc.subMl : doc.subEn} •{' '}
                {lang === 'ml' ? doc.ownerMl : doc.ownerEn}
              </span>
              <h2 className="mt-0.5 text-[22px] sm:text-[24px] font-bold text-[#0B0B0C] font-malayalam">
                {lang === 'ml' ? doc.titleMl : doc.titleEn}
              </h2>
            </div>
          </div>

          <StatusBadge
            status={doc.status}
            daysText={lang === 'ml' ? doc.daysTextMl : doc.daysTextEn}
          />
        </div>

        {/* High-Contrast Scanned Document Card + Rich Media Viewer */}
        <div className="rounded-[20px] border border-[#E6E8EC] bg-[#F4F5F7] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[16px] text-[#5B6168]">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#0B0B0C]">
              <Lock className="h-4 w-4 text-[#E03A45]" />
              {doc.fileName ||
                (lang === 'ml'
                  ? 'എൻക്രിപ്റ്റ് ചെയ്ത ഡിജിറ്റൽ പകർപ്പ് (PDF / JPG)'
                  : 'Encrypted Vault Copy (Front & Back)')}
            </span>
            <span>Auto-cropped</span>
          </div>

          {/* Rich Media Image Preview Box */}
          <div className="rounded-2xl border border-[#E6E8EC] bg-white p-3 overflow-hidden">
            {doc.fileDataUrl ? (
              <div className="relative group">
                <img
                  src={doc.fileDataUrl}
                  alt={doc.titleEn}
                  onClick={() => setLightboxOpen(true)}
                  className="max-h-[300px] w-full rounded-xl object-contain bg-[#F4F5F7] cursor-zoom-in"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl bg-[#F4F5F7] py-8 px-4 text-center">
                <ImageIcon className="h-10 w-10 text-[#5B6168] mb-2" />
                <p className="text-[16px] font-medium text-[#0B0B0C]">
                  {lang === 'ml'
                    ? 'രേഖയുടെ ഫോട്ടോ / സ്കാൻ ചേർത്തിട്ടില്ല'
                    : 'No photo scan attached yet — upload a photo to preview & store permanently'}
                </p>
              </div>
            )}

            {/* Media Control Strip */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E6E8EC]">
              <div className="flex flex-wrap items-center gap-2">
                {doc.fileDataUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#F4F5F7] border border-[#E6E8EC] hover:border-[#E03A45] px-3.5 py-2 text-[16px] font-medium text-[#0B0B0C] transition-colors cursor-pointer"
                  >
                    <Maximize2 className="h-4 w-4 text-[#E03A45]" />
                    <span>{lang === 'ml' ? 'വലുതാക്കി കാണുക' : 'Fullscreen Zoom'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownloadOriginal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#F4F5F7] border border-[#E6E8EC] hover:border-[#E03A45] px-3.5 py-2 text-[16px] font-medium text-[#0B0B0C] transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4 text-[#E03A45]" />
                  <span>{lang === 'ml' ? 'ഡൗൺലോഡ്' : 'Download Original'}</span>
                </button>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#E03A45] hover:bg-[#C42F3A] px-4 py-2 text-[16px] font-semibold text-white transition-colors cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>
                    {doc.fileDataUrl
                      ? lang === 'ml'
                        ? 'ഫോട്ടോ മാറ്റുക'
                        : 'Replace Photo'
                      : lang === 'ml'
                      ? 'ഫോട്ടോ ചേർക്കുക'
                      : 'Attach Photo'}
                  </span>
                </button>
              </div>
            </div>

            {uploadStatus && (
              <p className="mt-2 text-[16px] font-medium text-[#0F7B3E]">
                ✓ {uploadStatus}
              </p>
            )}
          </div>

          {/* Sensitive Number Box with Tap-to-Reveal */}
          <div className="rounded-2xl bg-white border border-[#E6E8EC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[16px] text-[#5B6168]">
                {lang === 'ml'
                  ? 'രേഖയുടെ നമ്പർ (സ്വകാര്യതയ്ക്കായി മറച്ചിരിക്കുന്നു)'
                  : 'Sensitive Document Number (Masked by default)'}
              </p>
              <p className="mt-1 text-[20px] font-semibold tracking-wider text-[#0B0B0C]">
                {revealed ? doc.docNumber : maskSensitiveNumber(doc.docNumber)}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setRevealed((r) => !r)}
              aria-label={revealed ? 'Hide number' : 'Tap to reveal number'}
            >
              {revealed ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>{lang === 'ml' ? 'മറയ്ക്കുക' : 'Mask Number'}</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>{lang === 'ml' ? 'നമ്പർ കാണുക' : 'Tap to Reveal'}</span>
                </>
              )}
            </Button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-3.5 border border-[#E6E8EC]">
              <span className="text-[16px] text-[#5B6168]">
                {lang === 'ml' ? 'കാലാവധി തീയതി' : 'Expiry Date'}
              </span>
              <p className="mt-0.5 text-[18px] font-semibold text-[#0B0B0C]">
                {formatHumanDate(doc.expiryDate, lang)}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-[#E6E8EC]">
              <span className="text-[16px] text-[#5B6168]">
                {lang === 'ml' ? 'അധികാരി / സ്ഥാപനം' : 'Issuing Authority'}
              </span>
              <p className="mt-0.5 text-[16px] font-semibold text-[#0B0B0C]">
                {lang === 'ml' ? doc.authorityMl : doc.authorityEn}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-[#E6E8EC]">
              <span className="text-[16px] text-[#5B6168]">
                {lang === 'ml' ? 'അലേർട്ട് ഷെഡ്യൂൾ' : 'Alert Schedule'}
              </span>
              <p className="mt-0.5 text-[16px] font-semibold text-[#E03A45]">
                60d • 30d • 7d • 1d
              </p>
            </div>
          </div>
        </div>

        {/* Action Strip: Mark as Renewed + Back */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button variant="primary" size="lg" onClick={handleRenew}>
            <RefreshCw className="h-5 w-5" />
            <span>
              {lang === 'ml'
                ? 'പുതുക്കിയതായി രേഖപ്പെടുത്തുക (+1 വർഷം)'
                : 'Mark as Renewed (+1 Year)'}
            </span>
          </Button>

          <Button variant="outline" onClick={onBackToHome}>
            <span>{lang === 'ml' ? '← ഡാഷ്ബോർഡിലേക്ക്' : '← Back to Dashboard'}</span>
          </Button>
        </div>
      </Card>

      {/* Right 5 Cols: Mascot State Feedback + Renewal Audit History */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="flex flex-col items-center text-center">
          <VaultMascot pose={mascotPose} size="md" />
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] px-3.5 py-1 text-[16px] font-medium text-[#A85A00]">
            <Sparkles className="h-4 w-4" />
            {mascotPose === 'celebrating'
              ? lang === 'ml'
                ? 'എല്ലാം സുരക്ഷിതം!'
                : 'All Clear & Valid!'
              : lang === 'ml'
              ? 'ഉടൻ പുതുക്കണം'
              : 'Needs Renewal Soon'}
          </span>
          <h3 className="mt-2 text-[20px] font-semibold text-[#0B0B0C] font-malayalam">
            {mascotPose === 'celebrating'
              ? lang === 'ml'
                ? 'കൊള്ളാം! ഈ രേഖയുടെ കാലാവധി സുരക്ഷിതമാണ്'
                : 'Awesome! This document is valid & up to date'
              : lang === 'ml'
              ? 'ശ്രദ്ധിക്കുക! ഈ രേഖ ഉടൻ പുതുക്കേണ്ടതുണ്ട്'
              : 'Heads up! This document needs renewal soon'}
          </h3>
          <p className="mt-1 text-[16px] text-[#5B6168]">
            {lang === 'ml'
              ? 'കുടുംബാംഗങ്ങൾക്ക് വാട്ട്സ്ആപ്പ് വഴിയും ഇമെയിൽ വഴിയും ഓർമ്മപ്പെടുത്തൽ അയച്ചിട്ടുണ്ട്.'
              : 'Family members receive automated reminders before expiry.'}
          </p>
        </Card>

        <Card>
          <h3 className="text-[18px] font-semibold text-[#0B0B0C] font-malayalam">
            {lang === 'ml' ? 'പുതുക്കിയ ചരിത്രം' : 'Renewal & Audit Log'}
          </h3>
          <div className="mt-4 space-y-3">
            {doc.renewalHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-[#F4F5F7] border border-[#E6E8EC] p-3.5 text-[16px]"
              >
                <div>
                  <p className="font-medium text-[#0B0B0C] font-malayalam">
                    {lang === 'ml' ? entry.actionMl : entry.actionEn}
                  </p>
                  <p className="text-[#5B6168] mt-0.5">
                    {lang === 'ml' ? `ചേർത്തത്: ${entry.by}` : `Recorded by ${entry.by}`}
                  </p>
                </div>
                <span className="text-[#5B6168] shrink-0">
                  {formatHumanDate(entry.date, lang)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      {lightboxOpen && doc.fileDataUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl p-5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EC]">
              <h4 className="text-[18px] font-semibold text-[#0B0B0C] font-malayalam">
                {lang === 'ml' ? doc.titleMl : doc.titleEn}
              </h4>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F5F7] text-[#0B0B0C] hover:bg-[#E6E8EC] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 flex justify-center bg-[#F4F5F7] rounded-2xl p-2">
              <img
                src={doc.fileDataUrl}
                alt={doc.titleEn}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
