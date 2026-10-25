import React, { useState } from 'react';
import {
  AppWorkspaceShell,
  VaultDocItem,
  WorkerRecordItem,
} from './components/VaultScreens';
import { computeCompletenessScore } from './utils/vaultLogic';

const INITIAL_DOCS: VaultDocItem[] = [
  {
    id: 'doc-1',
    titleMl: 'യുഎഇ എമിറേറ്റ്സ് ഐഡി / ഇഖാമ',
    titleEn: 'UAE Emirates ID / Residence Visa',
    categoryMl: 'ഗൾഫ് / NRI',
    categoryEn: 'Gulf / NRI',
    categoryId: 'GULF',
    ownerMl: 'രാഹുൽ നായർ (ദുബായ്)',
    ownerEn: 'Rahul Nair (Dubai)',
    docNumber: '784-1988-4920184-1',
    expiryDate: '2025-05-19',
    daysRemaining: 14,
    status: 'DUE_SOON',
    authorityMl: 'ICP യുഎഇ (ദുബായ്)',
    authorityEn: 'Federal Authority for Identity (UAE)',
    renewalHistory: [
      {
        date: '2023-05-18',
        noteMl: '2 വർഷത്തേക്ക് പുതുക്കി (ദുബായ് ടൈപ്പിംഗ് സെന്റർ)',
        noteEn: 'Renewed for 2 years via Amer Center Dubai',
      },
      {
        date: '2021-05-15',
        noteMl: 'ആദ്യമായി വോൾട്ടിൽ ചേർത്തു',
        noteEn: 'Initial upload to Kudumba Vault',
      },
    ],
  },
  {
    id: 'doc-2',
    titleMl: 'വാഹന ഇൻഷുറൻസ് & പുക പരിശോധന (PUC)',
    titleEn: 'Car Insurance & Pollution (KL-07-CX-4412)',
    categoryMl: 'വാഹനം',
    categoryEn: 'Vehicle',
    categoryId: 'VEHICLE',
    ownerMl: 'വേണുഗോപാൽ നായർ (കൊച്ചി)',
    ownerEn: 'Venugopal Nair (Kochi)',
    docNumber: 'POL-9948-2210-KL07',
    expiryDate: '2025-04-28',
    daysRemaining: -6,
    status: 'EXPIRED',
    authorityMl: 'ന്യൂ ഇന്ത്യ അഷ്വറൻസ്, എറണാകുളം',
    authorityEn: 'New India Assurance, Ernakulam',
    renewalHistory: [
      {
        date: '2024-04-28',
        noteMl: 'വാർഷിക പോളിസി പുതുക്കി (₹8,450)',
        noteEn: 'Annual comprehensive policy renewed (₹8,450)',
      },
    ],
  },
  {
    id: 'doc-3',
    titleMl: 'ഭൂനികുതി രസീത് (കണയന്നൂർ താലൂക്ക്)',
    titleEn: 'Kerala Land Tax Receipt (Kanayannur Taluk)',
    categoryMl: 'വസ്തു / കരം',
    categoryEn: 'Property & Tax',
    categoryId: 'PROPERTY',
    ownerMl: 'ശ്രീദേവി അമ്മ (തറവാട്)',
    ownerEn: 'Sreedevi Amma (Kochi)',
    docNumber: 'LTR-2025-883920',
    expiryDate: '2026-03-31',
    daysRemaining: 318,
    status: 'VALID',
    authorityMl: 'ഇടപ്പള്ളി വില്ലേജ് ഓഫീസ്',
    authorityEn: 'Edappally Village Office (ReLIS)',
    renewalHistory: [
      {
        date: '2025-04-02',
        noteMl: '2025–26 സാമ്പത്തിക വർഷത്തെ കരം അടച്ചു',
        noteEn: 'Paid online for FY 2025-26 and stored receipt',
      },
    ],
  },
  {
    id: 'doc-4',
    titleMl: 'ആധാർ കാർഡ് (Aadhaar Card)',
    titleEn: 'Aadhaar Identity Card',
    categoryMl: 'തിരിച്ചറിയൽ',
    categoryEn: 'Identity',
    categoryId: 'IDENTITY',
    ownerMl: 'അഞ്ജലി രാഹുൽ',
    ownerEn: 'Anjali Rahul',
    docNumber: '5928-4410-9832',
    expiryDate: '2032-12-31',
    daysRemaining: 2400,
    status: 'VALID',
    authorityMl: 'UIDAI ഇന്ത്യ',
    authorityEn: 'Unique Identification Authority (UIDAI)',
    renewalHistory: [
      {
        date: '2024-11-10',
        noteMl: 'വിലാസം പുതുക്കിയ പകർപ്പ് ചേർത്തു',
        noteEn: 'Updated address PVC card front & back',
      },
    ],
  },
  {
    id: 'doc-5',
    titleMl: 'കുടുംബ ആരോഗ്യ ഇൻഷുറൻസ് (Star Health)',
    titleEn: 'Family Floater Health Policy (₹10L Cover)',
    categoryMl: 'ഇൻഷുറൻസ് / മെഡിക്കൽ',
    categoryEn: 'Health & Policy',
    categoryId: 'MEDICAL',
    ownerMl: 'കുടുംബ പോളിസി (4 പേർ)',
    ownerEn: 'All Household Members',
    docNumber: 'SH-FLOATER-772819',
    expiryDate: '2025-11-14',
    daysRemaining: 192,
    status: 'VALID',
    authorityMl: 'സ്റ്റാർ ഹെൽത്ത് ഇൻഷുറൻസ്',
    authorityEn: 'Star Health & Allied Insurance',
    renewalHistory: [
      {
        date: '2024-11-14',
        noteMl: 'ക്യാഷ്‌ലെസ് കാർഡും പോളിസിയും ചേർത്തു',
        noteEn: 'Uploaded cashless TPA cards & policy schedule',
      },
    ],
  },
];

const INITIAL_WORKERS: WorkerRecordItem[] = [
  {
    id: 'w-1',
    nameMl: 'സുരേഷ് കുമാർ (ഇടപ്പള്ളി)',
    nameEn: 'Suresh Kumar (Edappally)',
    tradeMl: 'ഇലക്ട്രീഷ്യൻ & ഇൻവെർട്ടർ',
    tradeEn: 'Licensed Electrician & Inverter Tech',
    tradeId: 'ELECTRICIAN',
    phone: '+91 98470 44210',
    whatsapp: '919847044210',
    rateMl: 'മിനിമം ചാർജ്: ₹400 / സന്ദർശനം',
    rateEn: 'Base visit charge: ₹400 • Exide Inverter specialist',
    lastVisit: '2025-03-14',
    verifiedByMl: 'അച്ഛൻ നിർദ്ദേശിച്ച വിശ്വസ്തനായ ആളാണ്',
    verifiedByEn: 'Trusted family electrician for 8+ years',
    history: [
      {
        date: '2025-03-14',
        workMl: 'ഇൻവെർട്ടർ ബാറ്ററി സർവീസും അടുക്കളയിലെ എംസിബി മാറ്റലും',
        workEn: 'Inverter tubular battery distilled water top-up & MCB replacement',
        cost: '₹850',
      },
      {
        date: '2024-10-02',
        workMl: 'മോട്ടോർ പമ്പ് സ്വിച്ച് ബോർഡ് റിപ്പയർ',
        workEn: 'Well water pump starter capacitor replacement',
        cost: '₹600',
      },
    ],
  },
  {
    id: 'w-2',
    nameMl: 'ബഷീർ കെ.എം (കാക്കനാട്)',
    nameEn: 'Basheer K.M (Kakkanad)',
    tradeMl: 'പ്ലംബർ & വാട്ടർ ടാങ്ക് ഫിൽട്ടർ',
    tradeEn: 'Master Plumber & Overhead Tank Specialist',
    tradeId: 'PLUMBER',
    phone: '+91 94471 88320',
    whatsapp: '919447188320',
    rateMl: 'മിനിമം ചാർജ്: ₹450 / സന്ദർശനം',
    rateEn: 'Base visit charge: ₹450 • Well filter & Grohe fittings',
    lastVisit: '2025-02-09',
    verifiedByMl: 'അയൽക്കാർ വഴി ലഭിച്ച നമ്പർ',
    verifiedByEn: 'Verified by Resident Association',
    history: [
      {
        date: '2025-02-09',
        workMl: 'കിണർ വെള്ളത്തിന്റെ കാർബൺ ഫിൽട്ടർ മീഡിയ മാറ്റി',
        workEn: 'Replaced sand/carbon media in iron removal filter',
        cost: '₹3,200',
      },
    ],
  },
  {
    id: 'w-3',
    nameMl: 'വിനീത് പി.ആർ (തൃപ്പൂണിത്തുറ)',
    nameEn: 'Vineeth P.R (Tripunithura)',
    tradeMl: 'എസി സർവീസ് (Daikin / LG)',
    tradeEn: 'AC Gas & PCB Technician',
    tradeId: 'AC_TECH',
    phone: '+91 99952 11904',
    whatsapp: '919995211904',
    rateMl: 'എസി വെറ്റ് സർവീസ്: ₹650 / യൂണിറ്റ്',
    rateEn: 'Jet wash service: ₹650 per split AC unit',
    lastVisit: '2025-01-22',
    verifiedByMl: 'വാറന്റി കാർഡ് വോൾട്ടിൽ സൂക്ഷിച്ചിട്ടുണ്ട്',
    verifiedByEn: 'Annual pre-summer AC service',
    history: [
      {
        date: '2025-01-22',
        workMl: '3 ബെഡ്‌റൂം എസികളുടെ ജെറ്റ് വാഷ് സർവീസ്',
        workEn: 'Jet-wash servicing of 3 split ACs before summer',
        cost: '₹1,950',
      },
    ],
  },
];

export function App() {
  const [lang, setLang] = useState<'ml' | 'en'>('en');
  const [docs, setDocs] = useState<VaultDocItem[]>(INITIAL_DOCS);

  const completenessScore = computeCompletenessScore(15, 18);

  const handleRenewDocument = (docId: string) => {
    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        return {
          ...d,
          expiryDate: '2027-05-19',
          daysRemaining: 730,
          status: 'VALID',
          renewalHistory: [
            {
              date: new Date().toISOString().slice(0, 10),
              noteMl: 'വോൾട്ടിൽ പുതുക്കിയതായി രേഖപ്പെടുത്തി (+1 വർഷം)',
              noteEn: 'Marked as renewed in Kudumba Vault (+1 Year)',
            },
            ...d.renewalHistory,
          ],
        };
      })
    );
  };

  const handleAddCreatedDoc = (newDoc: VaultDocItem) => {
    setDocs((prev) => [newDoc, ...prev]);
  };

  return (
    <div
      lang={lang}
      className={`min-h-screen bg-[#FFFFFF] text-[#0B0B0C] ${
        lang === 'ml' ? 'font-ml' : 'font-sans'
      }`}
    >
      <AppWorkspaceShell
        lang={lang}
        onToggleLang={setLang}
        docs={docs}
        workers={INITIAL_WORKERS}
        completenessScore={completenessScore}
        onRenewDocument={handleRenewDocument}
        onAddCreatedDoc={handleAddCreatedDoc}
      />
    </div>
  );
}

export default App;
