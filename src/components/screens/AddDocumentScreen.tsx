import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Calendar,
  Check,
  Car,
  Home as HomeIcon,
  HeartPulse,
  Briefcase,
  Plane,
  Coins,
  Award,
  CheckCircle2,
  UserCheck,
  Undo2,
} from 'lucide-react';
import { Button, Card } from '../ui/DesignSystem';
import {
  VaultDocumentItem,
  HouseholdMemberItem,
  DocStatus,
  VaultCategory,
  readFileAsDataUrl,
} from '../../types/vault';

export interface Screen4AddDocumentProps {
  lang: 'ml' | 'en';
  members: HouseholdMemberItem[];
  defaultOwner?: string;
  onAddCreatedDoc: (newDoc: VaultDocumentItem) => void;
  onCancel?: () => void;
}

export const Screen4AddDocument: React.FC<Screen4AddDocumentProps> = ({
  lang,
  members,
  defaultOwner,
  onAddCreatedDoc,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [selectedType, setSelectedType] = useState('PASSPORT');
  const [expiryDate, setExpiryDate] = useState('');
  const [ownerName, setOwnerName] = useState(
    defaultOwner || members[0]?.nameEn || 'Rahul Nair'
  );
  const [docNum, setDocNum] = useState('');
  const [authority, setAuthority] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const docTypes: Array<{
    id: string;
    ml: string;
    en: string;
    cat: VaultCategory;
    catMl: string;
    catEn: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      id: 'AADHAAR',
      ml: 'ആധാർ കാർഡ്',
      en: 'Aadhaar Card',
      cat: 'IDENTITY',
      catMl: 'തിരിച്ചറിയൽ രേഖ',
      catEn: 'Identity Document',
      icon: UserCheck,
    },
    {
      id: 'PASSPORT',
      ml: 'പാസ്‌പോർട്ട്',
      en: 'Passport',
      cat: 'GULF',
      catMl: 'ഗൾഫ് / NRI രേഖ',
      catEn: 'Gulf / NRI Document',
      icon: Plane,
    },
    {
      id: 'IQAMA',
      ml: 'ഇഖാമ / എമിറേറ്റ്സ് ID',
      en: 'Iqama / Emirates ID',
      cat: 'GULF',
      catMl: 'ഗൾഫ് / NRI രേഖ',
      catEn: 'Gulf / NRI Document',
      icon: Briefcase,
    },
    {
      id: 'RC',
      ml: 'വാഹന RC / ഇൻഷുറൻസ്',
      en: 'Vehicle RC / Insurance',
      cat: 'VEHICLE',
      catMl: 'വാഹന രേഖ',
      catEn: 'Vehicle Document',
      icon: Car,
    },
    {
      id: 'LAND_TAX',
      ml: 'ഭൂനികുതി രസീത്',
      en: 'Land Tax Receipt',
      cat: 'PROPERTY',
      catMl: 'വസ്തു / കരം രേഖ',
      catEn: 'Property & Tax',
      icon: HomeIcon,
    },
    {
      id: 'GOLD_LOAN',
      ml: 'സ്വർണ്ണ വായ്പ രസീത്',
      en: 'Gold Loan Token',
      cat: 'PROPERTY',
      catMl: 'വസ്തു / കരം രേഖ',
      catEn: 'Property & Tax',
      icon: Coins,
    },
    {
      id: 'HEALTH',
      ml: 'ആരോഗ്യ ഇൻഷുറൻസ്',
      en: 'Health Policy',
      cat: 'HEALTH',
      catMl: 'ഇൻഷുറൻസ് / മെഡിക്കൽ',
      catEn: 'Health & Policy',
      icon: HeartPulse,
    },
    {
      id: 'WARRANTY',
      ml: 'വാറന്റി കാർഡ്',
      en: 'Appliance Warranty',
      cat: 'IDENTITY',
      catMl: 'വാറന്റി രേഖ',
      catEn: 'Warranty Record',
      icon: Award,
    },
  ];

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await readFileAsDataUrl(file);
    setFileDataUrl(res.dataUrl);
    setFileName(res.name);
    setStep(2);
  };

  const handleSave = () => {
    const chosen = docTypes.find((t) => t.id === selectedType) || docTypes[1];
    const matchedMember = members.find(
      (m) =>
        ownerName.toLowerCase().includes(m.nameEn.toLowerCase()) ||
        ownerName.includes(m.nameMl)
    );

    const finalExpiry = expiryDate || '2028-08-15';
    const diffDays = Math.round(
      (new Date(finalExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const computedStatus: DocStatus =
      diffDays < 0 ? 'EXPIRED' : diffDays <= 60 ? 'DUE_SOON' : 'VALID';

    const daysTextEn =
      computedStatus === 'EXPIRED'
        ? 'Expired'
        : computedStatus === 'DUE_SOON'
        ? `Due in ${Math.max(1, diffDays)} days`
        : 'Valid';
    const daysTextMl =
      computedStatus === 'EXPIRED'
        ? 'കാലാവധി കഴിഞ്ഞു'
        : computedStatus === 'DUE_SOON'
        ? `${Math.max(1, diffDays)} ദിവസത്തിനുള്ളിൽ`
        : 'സാധുവാണ്';

    const created: VaultDocumentItem = {
      id: `doc-${Date.now()}`,
      titleMl: chosen.ml,
      titleEn: chosen.en,
      subMl: chosen.catMl,
      subEn: chosen.catEn,
      category: chosen.cat,
      ownerMl: matchedMember ? matchedMember.nameMl : ownerName,
      ownerEn: ownerName,
      docNumber: docNum.trim() || 'P84920144',
      expiryDate: finalExpiry,
      status: computedStatus,
      daysTextEn,
      daysTextMl,
      authorityMl: authority.trim() || 'Regional Passport Office, Kochi',
      authorityEn: authority.trim() || 'Regional Passport Office, Kochi',
      fileDataUrl,
      fileName,
      renewalHistory: [
        {
          id: `rh-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          actionMl: '3-ടാപ്പ് സ്കാനർ വഴി ചേർത്തു',
          actionEn: 'Added via 3-Tap Smart Scanner',
          by: ownerName,
        },
      ],
    };
    setSavedToast(true);
    setTimeout(() => {
      onAddCreatedDoc(created);
    }, 250);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label={lang === 'ml' ? 'തിരികെ പോവുക' : 'Back to Dashboard'}
              className="spring-interactive flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-[#E03A45] bg-[#FFF5F5] text-[#E03A45] hover:bg-[#E03A45] hover:text-white transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Undo2 className="h-5 w-5 stroke-[2.3]" />
            </button>
          )}
          <h2 className="text-[22px] font-bold text-[#0B0B0C] font-malayalam">
            {lang === 'ml'
              ? '3 ടാപ്പിൽ പുതിയ രേഖ ചേർക്കുക'
              : 'Add Document in 3 Taps'}
          </h2>
        </div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            {lang === 'ml' ? 'റദ്ദാക്കുക' : 'Cancel'}
          </Button>
        )}
      </div>

      {/* 3-Tap Step Progress Bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            s: 1,
            ml: 'ടാപ്പ് 1: ഫോട്ടോ / സ്കാൻ',
            en: 'Tap 1: Camera / Upload',
          },
          {
            s: 2,
            ml: 'ടാപ്പ് 2: രേഖയുടെ തരം',
            en: 'Tap 2: Choose Type',
          },
          {
            s: 3,
            ml: 'ടാപ്പ് 3: കാലാവധി & സേവ്',
            en: 'Tap 3: Expiry & Save',
          },
        ].map((item) => {
          const active = step === item.s;
          const done = step > item.s;
          return (
            <button
              key={item.s}
              type="button"
              onClick={() => setStep(item.s as 1 | 2 | 3)}
              className={`flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-[16px] font-semibold cursor-pointer transition-colors ${
                active
                  ? 'border-[#E03A45] bg-[#E03A45] text-white shadow-xs'
                  : done
                  ? 'border-[#0F7B3E] bg-[#E4F7EC] text-[#0F7B3E]'
                  : 'border-[#E6E8EC] bg-white text-[#5B6168]'
              }`}
            >
              <span>{done ? '✓' : item.s}</span>
              <span className="truncate font-malayalam">{lang === 'ml' ? item.ml : item.en}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content Card */}
      <Card className="p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto max-w-md space-y-2">
              <h3 className="text-[22px] font-semibold text-[#0B0B0C] font-malayalam">
                {lang === 'ml'
                  ? 'ടാപ്പ് 1: രേഖയുടെ ഫോട്ടോ എടുക്കുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യുക'
                  : 'Tap 1: Snap a Photo or Upload Image / PDF'}
              </h3>
              <p className="text-[16px] text-[#5B6168]">
                {lang === 'ml'
                  ? 'അപ്‌ലോഡ് ചെയ്യുന്ന ചിത്രങ്ങൾ സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.'
                  : 'Files are compressed and permanently stored in your household vault.'}
              </p>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFilePick}
              className="hidden"
            />
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFilePick}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-[#E03A45] bg-[#F4F5F7]/60 p-6 text-[#0B0B0C] cursor-pointer hover:bg-[#F4F5F7] transition-colors"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E03A45] text-white">
                  <Camera className="h-7 w-7" />
                </div>
                <span className="text-[18px] font-semibold font-malayalam">
                  {lang === 'ml' ? 'ക്യാമറ തുറക്കുക' : 'Scan with Camera'}
                </span>
                <span className="text-[16px] text-[#5B6168]">
                  {lang === 'ml' ? 'ഓട്ടോ-ക്രോപ്പ് സ്കാനർ' : 'Opens mobile camera directly'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-[#E6E8EC] bg-[#F4F5F7] p-6 text-[#0B0B0C] hover:border-[#E03A45] cursor-pointer transition-colors"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B0B0C] text-white">
                  <Upload className="h-7 w-7" />
                </div>
                <span className="text-[18px] font-semibold font-malayalam">
                  {lang === 'ml' ? 'PDF / ഫോട്ടോ തിരഞ്ഞെടുക്കുക' : 'Upload Photo / PDF'}
                </span>
                <span className="text-[16px] text-[#5B6168]">
                  {fileName ||
                    (lang === 'ml'
                      ? 'ഫോണിൽ നിന്ന് തിരഞ്ഞെടുക്കാം'
                      : 'Choose file from your device')}
                </span>
              </button>
            </div>

            {fileDataUrl && (
              <div className="mx-auto max-w-xs rounded-2xl border border-[#E6E8EC] bg-[#F4F5F7] p-3">
                <img
                  src={fileDataUrl}
                  alt="Preview"
                  className="max-h-36 mx-auto rounded-xl object-contain"
                />
                <p className="mt-1.5 text-[16px] font-medium text-[#0F7B3E] truncate">
                  ✓ {fileName}
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                <span>
                  {lang === 'ml'
                    ? 'അടുത്തത്: രേഖയുടെ തരം തിരഞ്ഞെടുക്കുക →'
                    : 'Next: Choose Document Type →'}
                </span>
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-[22px] font-semibold text-[#0B0B0C] font-malayalam">
                {lang === 'ml'
                  ? 'ടാപ്പ് 2: ഇത് ഏത് രേഖയാണ്?'
                  : 'Tap 2: Choose Document Type'}
              </h3>
              <p className="text-[16px] text-[#5B6168]">
                {lang === 'ml'
                  ? 'കേരളത്തിലെയും ഗൾഫിലെയും പ്രധാനപ്പെട്ട രേഖകൾ ഇതിൽ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്'
                  : 'Pre-seeded with Kerala & Gulf NRI household document templates'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {docTypes.map((t) => {
                const Icon = t.icon;
                const active = selectedType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.id);
                      setStep(3);
                    }}
                    className={`flex min-h-[96px] flex-col items-start justify-between rounded-2xl border p-4 text-left cursor-pointer transition-colors ${
                      active
                        ? 'border-[#E03A45] bg-[#F4F5F7] text-[#E03A45] shadow-xs'
                        : 'border-[#E6E8EC] bg-[#F4F5F7] text-[#0B0B0C] hover:border-[#E03A45]'
                    }`}
                  >
                    <Icon className="h-6 w-6 text-[#E03A45]" />
                    <span className="text-[16px] font-semibold leading-snug font-malayalam">
                      {lang === 'ml' ? t.ml : t.en}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                {lang === 'ml' ? '← പിന്നോട്ട്' : '← Back'}
              </Button>
              <Button variant="primary" onClick={() => setStep(3)}>
                {lang === 'ml'
                  ? 'അടുത്തത്: കാലാവധി തീയതി →'
                  : 'Next: Pick Expiry Date →'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-[22px] font-semibold text-[#0B0B0C] font-malayalam">
                {lang === 'ml'
                  ? 'ടാപ്പ് 3: കാലാവധി തീയതി തിരഞ്ഞെടുത്ത് സേവ് ചെയ്യുക'
                  : 'Tap 3: Pick Expiry Date & Save to Vault'}
              </h3>
              <p className="text-[16px] text-[#5B6168]">
                {lang === 'ml'
                  ? 'കാലാവധി കഴിയുന്നതിന് 60, 30, 7, 1 ദിവസം മുൻപ് ഞങ്ങൾ ഓർമ്മിപ്പിക്കും.'
                  : 'We will alert your household 60, 30, 7, and 1 days before expiry.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5">
                  {lang === 'ml' ? 'കാലാവധി തീയതി (Expiry Date)' : 'Expiry Date'}
                </label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-[#5B6168]" />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full h-12 rounded-xl border border-[#E6E8EC] bg-white pl-11 pr-3 text-[16px] font-normal text-[#0B0B0C] focus:outline-none focus:border-[#E03A45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5">
                  {lang === 'ml' ? 'കുടുംബാംഗം (Family Member)' : 'Family Member'}
                </label>
                <select
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full h-12 rounded-xl border border-[#E6E8EC] bg-white px-3.5 text-[16px] font-normal text-[#0B0B0C] focus:outline-none focus:border-[#E03A45]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.nameEn}>
                      {lang === 'ml' ? `${m.nameMl} (${m.location})` : `${m.nameEn} (${m.location})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5">
                  {lang === 'ml'
                    ? 'രേഖയുടെ നമ്പർ'
                    : 'Document Number'}
                </label>
                <input
                  type="text"
                  value={docNum}
                  onChange={(e) => setDocNum(e.target.value)}
                  placeholder="e.g., P84920144"
                  className="w-full h-12 rounded-xl border border-[#E6E8EC] bg-white px-3.5 text-[16px] font-normal text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#E03A45]"
                />
              </div>

              <div>
                <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5">
                  {lang === 'ml'
                    ? 'അധികാരി / സ്ഥാപനം'
                    : 'Issuing Authority'}
                </label>
                <input
                  type="text"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  placeholder="e.g., Regional Passport Office, Kochi"
                  className="w-full h-12 rounded-xl border border-[#E6E8EC] bg-white px-3.5 text-[16px] font-normal text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#E03A45]"
                />
              </div>
            </div>

            {savedToast && (
              <div className="rounded-2xl bg-[#E4F7EC] border border-[#0F7B3E]/30 p-4 flex items-center gap-3 text-[#0F7B3E] font-medium text-[16px]">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>
                  {lang === 'ml'
                    ? 'രേഖ സുരക്ഷിതമായി കുടുംബ വോൾട്ടിൽ ചേർത്തു!'
                    : 'Document permanently saved to household vault!'}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                {lang === 'ml' ? '← പിന്നോട്ട്' : '← Back'}
              </Button>
              <Button variant="primary" size="lg" onClick={handleSave}>
                <Check className="h-5 w-5" />
                <span>
                  {lang === 'ml'
                    ? 'വോൾട്ടിൽ സേവ് ചെയ്യുക'
                    : 'Save to Household Vault'}
                </span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
