import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  RefreshCw,
  Camera,
  Upload,
  Calendar,
  Check,
  Phone,
  MessageCircle,
  FileText,
  Car,
  Home as HomeIcon,
  HeartPulse,
  Briefcase,
  Plane,
  Coins,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Lock,
  UserCheck,
  Wrench,
  Share2,
  Shield,
  Users,
  Plus,
} from 'lucide-react';
import {
  Button,
  Chip,
  StatusBadge,
  Card,
  Gauge,
  SearchPill,
  IconRail,
  BottomTabs,
  Banner,
  EmptyState,
  InstallPrompt,
  AppNavTab,
  DocStatusType,
} from './ui/DesignSystem';
import { VaultMascot, MascotPose } from './VaultMascot';
import { maskSensitiveNumber } from '../utils/vaultLogic';

export interface VaultDocItem {
  id: string;
  titleMl: string;
  titleEn: string;
  categoryMl: string;
  categoryEn: string;
  categoryId: string;
  ownerMl: string;
  ownerEn: string;
  docNumber: string;
  expiryDate: string;
  daysRemaining: number;
  status: DocStatusType;
  authorityMl: string;
  authorityEn: string;
  renewalHistory: { date: string; noteMl: string; noteEn: string }[];
}

export interface WorkerRecordItem {
  id: string;
  nameMl: string;
  nameEn: string;
  tradeMl: string;
  tradeEn: string;
  tradeId: string;
  phone: string;
  whatsapp: string;
  rateMl: string;
  rateEn: string;
  lastVisit: string;
  verifiedByMl: string;
  verifiedByEn: string;
  history: { date: string; workMl: string; workEn: string; cost: string }[];
}

/* ==========================================================================
   UNIFIED APP SHELL (Left Coral IconRail + Main White Canvas — No Top Nav Bar)
   ========================================================================== */
interface AppWorkspaceShellProps {
  lang: 'ml' | 'en';
  onToggleLang: (lang: 'ml' | 'en') => void;
  docs: VaultDocItem[];
  workers: WorkerRecordItem[];
  completenessScore: number;
  onRenewDocument: (docId: string) => void;
  onAddCreatedDoc: (newDoc: VaultDocItem) => void;
}

export const AppWorkspaceShell: React.FC<AppWorkspaceShellProps> = ({
  lang,
  onToggleLang,
  docs,
  workers,
  completenessScore,
  onRenewDocument,
  onAddCreatedDoc,
}) => {
  const [activeNav, setActiveNav] = useState<AppNavTab>('home');
  const [subView, setSubView] = useState<'none' | 'doc-detail' | 'add-doc'>('none');
  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.id || 'doc-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  const selectedDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  const categories = [
    { id: 'ALL', ml: 'എല്ലാം (All)', en: 'All Vault', count: docs.length, icon: FileText },
    { id: 'IDENTITY', ml: 'തിരിച്ചറിയൽ', en: 'Identity', count: 3, icon: UserCheck },
    { id: 'GULF', ml: 'ഗൾഫ് / NRI', en: 'Gulf / NRI', count: 2, icon: Plane },
    { id: 'VEHICLE', ml: 'വാഹനം', en: 'Vehicle', count: 2, icon: Car },
    { id: 'PROPERTY', ml: 'വസ്തു / കരം', en: 'Property & Tax', count: 2, icon: HomeIcon },
    { id: 'MEDICAL', ml: 'ഇൻഷുറൻസ് / മെഡിക്കൽ', en: 'Health & Policy', count: 2, icon: HeartPulse },
  ];

  const filteredDocs = docs.filter((d) => {
    const matchesCat = selectedCategory === 'ALL' || d.categoryId === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      d.titleEn.toLowerCase().includes(q) ||
      d.titleMl.toLowerCase().includes(q) ||
      d.ownerEn.toLowerCase().includes(q) ||
      d.ownerMl.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleSelectRailTab = (tab: AppNavTab) => {
    setActiveNav(tab);
    setSubView('none');
  };

  const handleOpenDocDetail = (doc: VaultDocItem) => {
    setSelectedDocId(doc.id);
    setSubView('doc-detail');
  };

  const handleOpenAddDoc = () => {
    setSubView('add-doc');
  };

  return (
    <div className="relative flex min-h-screen w-full bg-white">
      {/* ONLY NAVIGATION: Left Solid Coral-Red IconRail on Desktop */}
      <IconRail
        activeTab={activeNav}
        onSelectTab={handleSelectRailTab}
        lang={lang}
      />

      {/* Main White Dashboard Canvas */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-7 pb-24 md:pb-7 overflow-x-hidden">
        <div>
          {/* Top In-Canvas Utility Bar: SearchPill + Household Pill + Language Pill + Add Document */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E8EC]">
            <SearchPill
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                if (subView !== 'none') setSubView('none');
              }}
              placeholder={
                lang === 'ml'
                  ? 'രേഖകൾ തിരയുക... Ctrl K'
                  : 'Search navigations... Ctrl K'
              }
            />

            <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
              {/* Household Indicator Pill */}
              <div className="hidden lg:flex items-center gap-2 rounded-full bg-[#F4F5F7] border border-[#E6E8EC] px-3.5 py-2 text-xs font-bold text-[#0B0B0C]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0F7B3E]" />
                <span>
                  {lang === 'ml'
                    ? 'വടക്കേതിൽ കുടുംബം (കൊച്ചി + ദുബായ്)'
                    : 'Vadakkethil Kudumbam (Kochi + Dubai)'}
                </span>
              </div>

              {/* Compact Bilingual Toggle (Malayalam / EN) */}
              <div
                role="group"
                aria-label="Language switcher"
                className="inline-flex items-center rounded-full border border-[#E6E8EC] bg-[#F4F5F7] p-1"
              >
                <button
                  type="button"
                  onClick={() => onToggleLang('ml')}
                  className={`font-ml min-h-[36px] rounded-full px-3 py-1 text-xs font-extrabold cursor-pointer transition-colors ${
                    lang === 'ml'
                      ? 'bg-[#0B0B0C] text-white'
                      : 'text-[#5B6168] hover:text-[#0B0B0C]'
                  }`}
                >
                  മലയാളം
                </button>
                <button
                  type="button"
                  onClick={() => onToggleLang('en')}
                  className={`min-h-[36px] rounded-full px-3 py-1 text-xs font-extrabold cursor-pointer transition-colors ${
                    lang === 'en'
                      ? 'bg-[#0B0B0C] text-white'
                      : 'text-[#5B6168] hover:text-[#0B0B0C]'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Primary + Add Document Button */}
              <Button variant="primary" onClick={handleOpenAddDoc}>
                <span>{lang === 'ml' ? '+ രേഖ ചേർക്കുക' : '+ Add Document'}</span>
              </Button>
            </div>
          </div>

          {/* ================================================================
              SUB-VIEW 1: ADD DOCUMENT 3-TAP FLOW
              ================================================================ */}
          {subView === 'add-doc' && (
            <div className="mt-6">
              <Screen4AddDocument
                lang={lang}
                onAddCreatedDoc={(newDoc) => {
                  onAddCreatedDoc(newDoc);
                  setSelectedDocId(newDoc.id);
                  setSubView('none');
                  setActiveNav('home');
                }}
                onCancel={() => setSubView('none')}
              />
            </div>
          )}

          {/* ================================================================
              SUB-VIEW 2: DOCUMENT DETAIL
              ================================================================ */}
          {subView === 'doc-detail' && selectedDoc && (
            <div className="mt-6">
              <Screen3DocumentDetail
                lang={lang}
                doc={selectedDoc}
                onRenewDocument={onRenewDocument}
                onBackToHome={() => setSubView('none')}
              />
            </div>
          )}

          {/* ================================================================
              MAIN RAIL TABS (when subView === 'none')
              ================================================================ */}
          {subView === 'none' && activeNav === 'home' && (
            <>
              {/* Row 1: Festie-style Banner Card (Left 8 cols) + Vault Completeness Gauge (Right 4 cols) */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8">
                  <Banner
                    statusLabel={
                      lang === 'ml'
                        ? 'വോൾട്ട് സംരക്ഷിതമാണ്'
                        : 'Household Vault Active'
                    }
                    headline={
                      lang === 'ml'
                        ? 'വടക്കേതിൽ കുടുംബ വോൾട്ട് — 2 രേഖകൾ ഉടൻ പുതുക്കണം'
                        : 'Vadakkethil Family Vault — 2 documents need renewal soon'
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
                      const urgent =
                        docs.find((d) => d.status !== 'VALID') || docs[0];
                      if (urgent) handleOpenDocDetail(urgent);
                    }}
                  />
                </div>

                <div className="lg:col-span-4">
                  <Gauge
                    score={completenessScore}
                    title={
                      lang === 'ml'
                        ? 'വോൾട്ട് പൂർണ്ണത (Completeness)'
                        : 'Vault Completeness'
                    }
                    subtitle={
                      lang === 'ml'
                        ? 'കുടുംബത്തിലെ 18 പ്രധാന രേഖകളിൽ 15 എണ്ണം ചേർത്തു.'
                        : '15 of 18 recommended Kerala & NRI household documents stored.'
                    }
                    onAction={handleOpenAddDoc}
                  />
                </div>
              </div>

              {/* Row 2: Category Filter Tiles + Latest Household Documents & Status */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Category Tiles (Left 5 cols) */}
                <Card className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-[#0B0B0C]">
                        {lang === 'ml'
                          ? 'രേഖകളുടെ വിഭാഗങ്ങൾ'
                          : 'Document Categories'}
                      </h3>
                      <span className="text-xs font-bold text-[#5B6168]">
                        {categories.length} {lang === 'ml' ? 'വിഭാഗങ്ങൾ' : 'folders'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const active = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`spring-interactive flex min-h-[60px] items-center justify-between rounded-2xl border p-3 text-left cursor-pointer ${
                              active
                                ? 'border-[#E03A45] bg-[#E03A45] text-white shadow-xs'
                                : 'border-[#E6E8EC] bg-white text-[#0B0B0C] hover:border-[#0B0B0C]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                className={`h-4 w-4 shrink-0 ${
                                  active ? 'text-white' : 'text-[#E03A45]'
                                }`}
                              />
                              <span className="text-xs font-bold truncate">
                                {lang === 'ml' ? cat.ml : cat.en}
                              </span>
                            </div>
                            <span
                              className={`font-mono-tabular text-xs font-extrabold px-2 py-0.5 rounded-full ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#F4F5F7] text-[#5B6168]'
                              }`}
                            >
                              {cat.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E6E8EC] flex items-center justify-between text-xs text-[#5B6168]">
                    <span>
                      {lang === 'ml'
                        ? 'AES-256 ആപ്പ്-ലെവൽ എൻക്രിപ്ഷൻ'
                        : 'App-level masked ID protection'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectRailTab('workers')}
                      className="font-bold text-[#1E4FD8] hover:underline cursor-pointer"
                    >
                      {lang === 'ml' ? 'പണിക്കാരുടെ ഡയറി →' : 'Open Workers Book →'}
                    </button>
                  </div>
                </Card>

                {/* Latest Documents Preview Card (Right 7 cols) */}
                <Card className="lg:col-span-7 flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0B0B0C]">
                        {lang === 'ml'
                          ? 'അടുത്തിടെ ചേർത്ത രേഖകളും കാലാവധിയും'
                          : 'Latest Household Documents & Status'}
                      </h3>
                      <p className="text-xs text-[#5B6168]">
                        {lang === 'ml'
                          ? 'വിശദാംശങ്ങൾ കാണാനും പുതുക്കാനും ഏതെങ്കിലും രേഖയിൽ തൊടുക'
                          : 'Tap any document card to reveal masked numbers or mark as renewed'}
                      </p>
                    </div>
                    <Button
                      variant="outline-ink"
                      onClick={handleOpenAddDoc}
                      className="min-h-[40px] px-4 py-1.5 text-xs"
                    >
                      <span>{lang === 'ml' ? '+ പുതിയ രേഖ' : '+ Quick Scan'}</span>
                    </Button>
                  </div>

                  {filteredDocs.length === 0 ? (
                    <EmptyState
                      title={
                        lang === 'ml'
                          ? 'രേഖകളൊന്നും കണ്ടെത്തിയില്ല'
                          : 'No matching documents'
                      }
                      description={
                        lang === 'ml'
                          ? 'പുതിയ രേഖ 3 ടാപ്പിൽ ചേർക്കാൻ താഴെയുള്ള ബട്ടൺ അമർത്തുക.'
                          : 'Add a new household document in 3 taps.'
                      }
                      actionLabel={
                        lang === 'ml' ? 'രേഖ ചേർക്കുക' : 'Add Document'
                      }
                      onAction={handleOpenAddDoc}
                    />
                  ) : (
                    <div className="space-y-3">
                      {filteredDocs.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => handleOpenDocDetail(doc)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                              handleOpenDocDetail(doc);
                          }}
                          className="spring-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E6E8EC] bg-white p-4 hover:border-[#0B0B0C] cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-[#0B0B0C]">
                                {lang === 'ml' ? doc.titleMl : doc.titleEn}
                              </span>
                              <span className="rounded-full bg-[#F4F5F7] px-2.5 py-0.5 text-[11px] font-bold text-[#5B6168]">
                                {lang === 'ml' ? doc.ownerMl : doc.ownerEn}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5B6168]">
                              <span className="font-mono-tabular font-semibold text-[#0B0B0C]">
                                {maskSensitiveNumber(doc.docNumber)}
                              </span>
                              <span>•</span>
                              <span className="font-mono-tabular">
                                {lang === 'ml' ? 'കാലാവധി: ' : 'Exp: '}
                                {doc.expiryDate}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <StatusBadge
                              status={doc.status}
                              daysRemaining={doc.daysRemaining}
                              lang={lang}
                            />
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F5F7] text-[#0B0B0C]">
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </>
          )}

          {/* ================================================================
              RAIL TAB: VAULT (Full Document Vault & Category Explorer)
              ================================================================ */}
          {subView === 'none' && activeNav === 'vault' && (
            <div className="mt-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0B0B0C]">
                    {lang === 'ml'
                      ? 'കുടുംബ രേഖകളുടെ വോൾട്ട് (All Household Documents)'
                      : 'Household Document Vault'}
                  </h2>
                  <p className="text-sm text-[#5B6168]">
                    {lang === 'ml'
                      ? 'എല്ലാ രേഖകളും എൻക്രിപ്റ്റ് ചെയ്ത് സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുന്നു.'
                      : 'Encrypted identity, Gulf NRI, vehicle, property, and medical records.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      active={selectedCategory === cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span>{lang === 'ml' ? cat.ml : cat.en}</span>
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleOpenDocDetail(doc)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        handleOpenDocDetail(doc);
                    }}
                    className="spring-interactive rounded-[22px] border border-[#E6E8EC] bg-[#F4F5F7] p-5 hover:bg-white hover:border-[#0B0B0C] cursor-pointer flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#5B6168]">
                          {lang === 'ml' ? doc.categoryMl : doc.categoryEn} •{' '}
                          {lang === 'ml' ? doc.ownerMl : doc.ownerEn}
                        </span>
                        <h3 className="mt-1 text-base font-extrabold text-[#0B0B0C]">
                          {lang === 'ml' ? doc.titleMl : doc.titleEn}
                        </h3>
                      </div>
                      <StatusBadge
                        status={doc.status}
                        daysRemaining={doc.daysRemaining}
                        lang={lang}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#E6E8EC] text-xs text-[#5B6168]">
                      <span className="font-mono-tabular font-bold text-[#0B0B0C]">
                        {maskSensitiveNumber(doc.docNumber)}
                      </span>
                      <span className="font-mono-tabular">
                        {lang === 'ml' ? 'കാലാവധി: ' : 'Exp: '}
                        {doc.expiryDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              RAIL TAB: PEOPLE (Family Member Profiles across Kerala & Gulf)
              ================================================================ */}
          {subView === 'none' && activeNav === 'people' && (
            <div className="mt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0B0B0C]">
                  {lang === 'ml'
                    ? 'കുടുംബാംഗങ്ങൾ (Family Members — Kochi & Dubai)'
                    : 'Household Members & Roles'}
                </h2>
                <p className="text-sm text-[#5B6168]">
                  {lang === 'ml'
                    ? 'ഓരോ അംഗത്തിന്റെയും രേഖകളും റോളുകളും (Owner / Editor / Viewer).'
                    : 'Manage family profiles across Kerala and the Gulf with role-based access.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    nameMl: 'രാഹുൽ നായർ',
                    nameEn: 'Rahul Nair',
                    locMl: 'ദുബായ്, യുഎഇ (NRI)',
                    locEn: 'Dubai, UAE (NRI)',
                    role: 'OWNER',
                    docsCount: 5,
                    initials: 'RN',
                    bg: 'bg-[#E03A45]',
                  },
                  {
                    nameMl: 'വേണുഗോപാൽ നായർ',
                    nameEn: 'Venugopal Nair',
                    locMl: 'ഇടപ്പള്ളി, കൊച്ചി (അച്ഛൻ)',
                    locEn: 'Edappally, Kochi (Father)',
                    role: 'EDITOR',
                    docsCount: 4,
                    initials: 'VN',
                    bg: 'bg-[#1E4FD8]',
                  },
                  {
                    nameMl: 'ശ്രീദേവി അമ്മ',
                    nameEn: 'Sreedevi Amma',
                    locMl: 'ഇടപ്പള്ളി, കൊച്ചി (അമ്മ)',
                    locEn: 'Edappally, Kochi (Mother)',
                    role: 'EDITOR',
                    docsCount: 3,
                    initials: 'SA',
                    bg: 'bg-[#0F7B3E]',
                  },
                  {
                    nameMl: 'അഞ്ജലി രാഹുൽ',
                    nameEn: 'Anjali Rahul',
                    locMl: 'ദുബായ് / കൊച്ചി',
                    locEn: 'Dubai / Kochi',
                    role: 'EDITOR',
                    docsCount: 3,
                    initials: 'AR',
                    bg: 'bg-[#0B0B0C]',
                  },
                ].map((m, idx) => (
                  <Card key={idx} className="flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-extrabold text-white ${m.bg}`}
                      >
                        {m.initials}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#0B0B0C]">
                          {lang === 'ml' ? m.nameMl : m.nameEn}
                        </h3>
                        <p className="text-xs text-[#5B6168]">
                          {lang === 'ml' ? m.locMl : m.locEn}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#E6E8EC] text-xs">
                      <span className="rounded-full bg-white px-2.5 py-1 font-mono-tabular font-extrabold text-[#0B0B0C] border border-[#E6E8EC]">
                        {m.role}
                      </span>
                      <span className="font-bold text-[#5B6168]">
                        {m.docsCount} {lang === 'ml' ? 'രേഖകൾ' : 'documents'}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              RAIL TAB: WORKERS (Trusted Household Workers Book)
              ================================================================ */}
          {subView === 'none' && activeNav === 'workers' && (
            <div className="mt-6">
              <Screen5WorkersBook lang={lang} workers={workers} />
            </div>
          )}

          {/* ================================================================
              RAIL TAB: SHARE (Expiring Share Packs for CA, Village Office, Hospital)
              ================================================================ */}
          {subView === 'none' && activeNav === 'share' && (
            <div className="mt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0B0B0C]">
                  {lang === 'ml'
                    ? 'സുരക്ഷിത ഷെയർ പായ്ക്കുകൾ (Expiring Share Packs)'
                    : 'Expiring Share Packs'}
                </h2>
                <p className="text-sm text-[#5B6168]">
                  {lang === 'ml'
                    ? 'ആശുപത്രി, സിഎ, വില്ലേജ് ഓഫീസ് എന്നിവർക്ക് നിശ്ചിത സമയത്തേക്ക് മാത്രം രേഖകൾ അയക്കാം.'
                    : 'Create time-limited, view-only document bundles for hospitals, CAs, or village offices.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    titleMl: 'അടിയന്തര ആശുപത്രി പായ്ക്ക്',
                    titleEn: 'Emergency Hospital Pack',
                    descMl: 'സ്റ്റാർ ഹെൽത്ത് കാർഡ് + ആധാർ + ബ്ലഡ് ഗ്രൂപ്പ് (24 മണിക്കൂർ ലിങ്ക്)',
                    descEn: 'Star Health Cashless Card + Aadhaar + Allergy Summary (Expires in 24h)',
                    tag: '24h Link',
                  },
                  {
                    titleMl: 'വസ്തു കരം & വില്ലേജ് ഓഫീസ് പായ്ക്ക്',
                    titleEn: 'Property & Village Office Pack',
                    descMl: 'ഭൂനികുതി രസീത് + കൈവശാവകാശ സർട്ടിഫിക്കറ്റ് + കെട്ടിട നികുതി',
                    descEn: 'Land Tax Receipt + Possession Certificate + Building Tax Receipt',
                    tag: '7-Day Link',
                  },
                  {
                    titleMl: 'ഗൾഫ് വിസ പുതുക്കൽ പായ്ക്ക്',
                    titleEn: 'Gulf Visa / Typing Center Pack',
                    descMl: 'പാസ്‌പോർട്ട് + എമിറേറ്റ്സ് ഐഡി + ഫോട്ടോ',
                    descEn: 'Passport Front/Back + Emirates ID + Visa Copy',
                    tag: '48h Link',
                  },
                ].map((pack, i) => (
                  <Card key={i} className="flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <span className="inline-block rounded-full bg-[#FFF4D6] px-3 py-1 font-mono-tabular text-xs font-extrabold text-[#A85A00]">
                        {pack.tag}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#0B0B0C]">
                        {lang === 'ml' ? pack.titleMl : pack.titleEn}
                      </h3>
                      <p className="text-xs text-[#5B6168]">
                        {lang === 'ml' ? pack.descMl : pack.descEn}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => handleOpenDocDetail(docs[0])}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>
                        {lang === 'ml' ? 'ഷെയർ ലിങ്ക് നിർമ്മിക്കുക' : 'Create Share Link'}
                      </span>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              RAIL TAB: SETTINGS (Household Plan, Pricing & Security)
              ================================================================ */}
          {subView === 'none' && activeNav === 'settings' && (
            <div className="mt-6">
              <Screen6Pricing
                lang={lang}
                onStart={() => handleSelectRailTab('home')}
              />
            </div>
          )}
        </div>

        {/* Bottom-Right PWA Install Prompt inside Dashboard */}
        {showInstallPrompt && subView === 'none' && (
          <div className="mt-6 flex justify-end">
            <InstallPrompt
              lang={lang}
              onInstall={() => setShowInstallPrompt(false)}
              onDismiss={() => setShowInstallPrompt(false)}
            />
          </div>
        )}
      </div>

      {/* Mobile Bottom Tabs + Floating Coral "+" Button */}
      <BottomTabs
        activeTab={activeNav}
        onSelectTab={handleSelectRailTab}
        onAddDocument={handleOpenAddDoc}
        lang={lang}
      />
    </div>
  );
};

/* ==========================================================================
   SCREEN 3: DOCUMENT DETAIL (Masked ID, Tap-to-Reveal, Mark as Renewed)
   ========================================================================== */
interface Screen3DocumentDetailProps {
  lang: 'ml' | 'en';
  doc: VaultDocItem;
  onRenewDocument: (docId: string) => void;
  onBackToHome: () => void;
}

export const Screen3DocumentDetail: React.FC<Screen3DocumentDetailProps> = ({
  lang,
  doc,
  onRenewDocument,
  onBackToHome,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [justRenewed, setJustRenewed] = useState(false);

  const handleRenew = () => {
    onRenewDocument(doc.id);
    setJustRenewed(true);
  };

  const mascotPose: MascotPose =
    justRenewed || doc.status === 'VALID' ? 'celebrating' : 'worried';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 7 Cols: Document Preview Card + Masked Number + Renewal Action */}
      <Card className="lg:col-span-7 space-y-6" white>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E8EC] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B6168]">
              {lang === 'ml' ? doc.categoryMl : doc.categoryEn} •{' '}
              {lang === 'ml' ? doc.ownerMl : doc.ownerEn}
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-[#0B0B0C]">
              {lang === 'ml' ? doc.titleMl : doc.titleEn}
            </h2>
          </div>

          <StatusBadge
            status={doc.status}
            daysRemaining={doc.daysRemaining}
            lang={lang}
          />
        </div>

        {/* High-Contrast Scanned Document Card Mock */}
        <div className="rounded-[22px] border-2 border-dashed border-[#E6E8EC] bg-[#F4F5F7] p-5 sm:p-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#5B6168] mb-4">
            <span className="inline-flex items-center gap-1.5 text-[#0B0B0C]">
              <Lock className="h-4 w-4 text-[#E03A45]" />
              {lang === 'ml'
                ? 'എൻക്രിപ്റ്റ് ചെയ്ത ഡിജിറ്റൽ പകർപ്പ് (PDF / JPG)'
                : 'Encrypted Vault Copy (Front & Back PDF)'}
            </span>
            <span className="font-mono-tabular">240 KB • Auto-cropped</span>
          </div>

          {/* Sensitive Number Box with Tap-to-Reveal */}
          <div className="rounded-2xl bg-white border border-[#E6E8EC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#5B6168]">
                {lang === 'ml'
                  ? 'രേഖയുടെ നമ്പർ (സ്വകാര്യതയ്ക്കായി മറച്ചിരിക്കുന്നു)'
                  : 'Sensitive Document Number (Masked by default)'}
              </p>
              <p className="mt-1 font-mono-tabular text-xl sm:text-2xl font-extrabold tracking-wider text-[#0B0B0C]">
                {revealed ? doc.docNumber : maskSensitiveNumber(doc.docNumber)}
              </p>
            </div>

            <Button
              variant="outline-ink"
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
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-3 border border-[#E6E8EC]">
              <span className="text-[11px] font-semibold text-[#5B6168]">
                {lang === 'ml' ? 'കാലാവധി തീയതി' : 'Expiry Date'}
              </span>
              <p className="mt-0.5 font-mono-tabular text-sm font-extrabold text-[#0B0B0C]">
                {doc.expiryDate}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 border border-[#E6E8EC]">
              <span className="text-[11px] font-semibold text-[#5B6168]">
                {lang === 'ml' ? 'അധികാരി / സ്ഥാപനം' : 'Issuing Authority'}
              </span>
              <p className="mt-0.5 text-sm font-extrabold text-[#0B0B0C]">
                {lang === 'ml' ? doc.authorityMl : doc.authorityEn}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 border border-[#E6E8EC] col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-[#5B6168]">
                {lang === 'ml' ? 'അലേർട്ട് ഷെഡ്യൂൾ' : 'Alert Schedule'}
              </span>
              <p className="mt-0.5 font-mono-tabular text-sm font-extrabold text-[#1E4FD8]">
                60d • 30d • 7d • 1d
              </p>
            </div>
          </div>
        </div>

        {/* Action Strip: Mark as Renewed + Back */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button variant="primary" size="lg" onClick={handleRenew}>
            <RefreshCw className="h-4 w-4" />
            <span>
              {lang === 'ml'
                ? 'പുതുക്കിയതായി രേഖപ്പെടുത്തുക (Mark as Renewed)'
                : 'Mark as Renewed (+1 Year)'}
            </span>
          </Button>

          <Button variant="outline-ink" onClick={onBackToHome}>
            <span>{lang === 'ml' ? '← ഡാഷ്ബോർഡിലേക്ക്' : '← Back to Dashboard'}</span>
          </Button>
        </div>
      </Card>

      {/* Right 5 Cols: Mascot State Feedback + Renewal Audit History */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="flex flex-col items-center text-center">
          <VaultMascot pose={mascotPose} size="md" />
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] px-3 py-1 text-xs font-bold text-[#A85A00]">
            <Sparkles className="h-3.5 w-3.5" />
            {mascotPose === 'celebrating'
              ? lang === 'ml'
                ? 'മസ്കറ്റ് പോസ്: ആഘോഷം (Celebrating)'
                : 'Mascot Pose: Celebrating (All Clear!)'
              : lang === 'ml'
              ? 'മസ്കറ്റ് പോസ്: ആശങ്ക (Worried — Expiring)'
              : 'Mascot Pose: Worried (Needs Renewal)'}
          </span>
          <h3 className="mt-2 text-lg font-extrabold text-[#0B0B0C]">
            {mascotPose === 'celebrating'
              ? lang === 'ml'
                ? 'കൊള്ളാം! ഈ രേഖയുടെ കാലാവധി സുരക്ഷിതമാണ്'
                : 'Awesome! This document is valid & up to date'
              : lang === 'ml'
              ? 'ശ്രദ്ധിക്കുക! ഈ രേഖ ഉടൻ പുതുക്കേണ്ടതുണ്ട്'
              : 'Heads up! This document needs renewal soon'}
          </h3>
          <p className="mt-1 text-xs text-[#5B6168]">
            {lang === 'ml'
              ? 'കുടുംബാംഗങ്ങൾക്ക് വാട്ട്സ്ആപ്പ് വഴിയും ഇമെയിൽ വഴിയും ഓർമ്മപ്പെടുത്തൽ അയച്ചിട്ടുണ്ട്.'
              : 'Household owners & editors receive automated reminders before expiry.'}
          </p>
        </Card>

        <Card white>
          <h3 className="text-base font-extrabold text-[#0B0B0C]">
            {lang === 'ml' ? 'പുതുക്കിയ ചരിത്രം (Renewal History)' : 'Renewal & Audit Log'}
          </h3>
          <div className="mt-4 space-y-3">
            {doc.renewalHistory.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 rounded-xl bg-[#F4F5F7] p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-[#0B0B0C]">
                    {lang === 'ml' ? entry.noteMl : entry.noteEn}
                  </p>
                  <p className="text-[#5B6168] mt-0.5">
                    {lang === 'ml' ? 'പരിശോധിച്ചത്: രാഹുൽ നായർ' : 'Verified by Rahul Nair'}
                  </p>
                </div>
                <span className="font-mono-tabular font-bold text-[#5B6168] shrink-0">
                  {entry.date}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ==========================================================================
   SCREEN 4: ADD-DOCUMENT 3-TAP FLOW (Camera -> Type -> Expiry -> Save)
   ========================================================================== */
interface Screen4AddDocumentProps {
  lang: 'ml' | 'en';
  onAddCreatedDoc: (newDoc: VaultDocItem) => void;
  onCancel?: () => void;
}

export const Screen4AddDocument: React.FC<Screen4AddDocumentProps> = ({
  lang,
  onAddCreatedDoc,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [scanCaptured, setScanCaptured] = useState(true);
  const [selectedType, setSelectedType] = useState('PASSPORT');
  const [expiryDate, setExpiryDate] = useState('2028-08-15');
  const [ownerName, setOwnerName] = useState('Rahul Nair (Dubai)');
  const [docNum, setDocNum] = useState('P84920144');
  const [savedToast, setSavedToast] = useState(false);

  const docTypes = [
    { id: 'AADHAAR', ml: 'ആധാർ കാർഡ്', en: 'Aadhaar Card', cat: 'IDENTITY', icon: UserCheck },
    { id: 'PASSPORT', ml: 'പാസ്‌പോർട്ട്', en: 'Passport', cat: 'GULF', icon: Plane },
    { id: 'IQAMA', ml: 'ഇഖാമ / എമിറേറ്റ്സ് ID', en: 'Iqama / Emirates ID', cat: 'GULF', icon: Briefcase },
    { id: 'RC', ml: 'വാഹന RC / ഇൻഷുറൻസ്', en: 'Vehicle RC / Insurance', cat: 'VEHICLE', icon: Car },
    { id: 'LAND_TAX', ml: 'ഭൂനികുതി രസീത്', en: 'Land Tax Receipt', cat: 'PROPERTY', icon: HomeIcon },
    { id: 'GOLD_LOAN', ml: 'സ്വർണ്ണ വായ്പ രസീത്', en: 'Gold Loan Token', cat: 'PROPERTY', icon: Coins },
    { id: 'HEALTH', ml: 'ആരോഗ്യ ഇൻഷുറൻസ്', en: 'Health Policy', cat: 'MEDICAL', icon: HeartPulse },
    { id: 'WARRANTY', ml: 'വാറന്റി കാർഡ്', en: 'Appliance Warranty', cat: 'IDENTITY', icon: Award },
  ];

  const handleSave = () => {
    const chosen = docTypes.find((t) => t.id === selectedType) || docTypes[1];
    const created: VaultDocItem = {
      id: `doc-${Date.now()}`,
      titleMl: chosen.ml,
      titleEn: chosen.en,
      categoryMl: chosen.cat === 'GULF' ? 'ഗൾഫ് / NRI' : 'തിരിച്ചറിയൽ',
      categoryEn: chosen.cat,
      categoryId: chosen.cat,
      ownerMl: ownerName,
      ownerEn: ownerName,
      docNumber: docNum,
      expiryDate,
      daysRemaining: 420,
      status: 'VALID',
      authorityMl: 'ഔദ്യോഗിക രേഖ (Kudumba Vault)',
      authorityEn: 'Verified Household Upload',
      renewalHistory: [
        {
          date: new Date().toISOString().slice(0, 10),
          noteMl: '3-ടാപ്പ് സ്കാനർ വഴി ചേർത്തു',
          noteEn: 'Added via 3-Tap Smart Scanner',
        },
      ],
    };
    setSavedToast(true);
    setTimeout(() => {
      onAddCreatedDoc(created);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#0B0B0C]">
          {lang === 'ml' ? '3 ടാപ്പിൽ പുതിയ രേഖ ചേർക്കുക' : 'Add Document in 3 Taps'}
        </h2>
        {onCancel && (
          <Button variant="outline-ink" onClick={onCancel}>
            {lang === 'ml' ? '← ഡാഷ്ബോർഡിലേക്ക്' : '← Back to Dashboard'}
          </Button>
        )}
      </div>

      {/* 3-Tap Step Progress Pill Bar */}
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
              className={`spring-interactive flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-xs sm:text-sm font-extrabold cursor-pointer ${
                active
                  ? 'border-[#E03A45] bg-[#E03A45] text-white shadow-sm'
                  : done
                  ? 'border-[#0F7B3E] bg-[#E4F7EC] text-[#0F7B3E]'
                  : 'border-[#E6E8EC] bg-[#F4F5F7] text-[#5B6168]'
              }`}
            >
              <span className="font-mono-tabular">{done ? '✓' : item.s}</span>
              <span className="truncate">{lang === 'ml' ? item.ml : item.en}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content Card */}
      <Card white className="p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto max-w-md space-y-2">
              <h3 className="text-2xl font-extrabold text-[#0B0B0C]">
                {lang === 'ml'
                  ? 'ടാപ്പ് 1: രേഖയുടെ ഫോട്ടോ എടുക്കുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യുക'
                  : 'Tap 1: Snap a Photo or Upload PDF'}
              </h3>
              <p className="text-sm text-[#5B6168]">
                {lang === 'ml'
                  ? 'ഫോണിൽ തന്നെ ഓട്ടോ-ക്രോപ്പ് ചെയ്ത് PDF ആക്കി മാറ്റുന്നു.'
                  : 'Auto-crops, straightens, and compresses right on your phone before encrypting.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => {
                  setScanCaptured(true);
                  setStep(2);
                }}
                className="spring-interactive flex flex-col items-center justify-center gap-3 rounded-[22px] border-2 border-[#E03A45] bg-[#FDECEE] p-6 text-[#0B0B0C] cursor-pointer"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E03A45] text-white">
                  <Camera className="h-7 w-7" />
                </div>
                <span className="text-base font-extrabold">
                  {lang === 'ml' ? 'ക്യാമറ തുറക്കുക (Front/Back)' : 'Scan with Camera'}
                </span>
                <span className="text-xs text-[#5B6168]">
                  {lang === 'ml' ? 'ഓട്ടോ-ക്രോപ്പ് സ്കാനർ' : 'Auto-crop & glare removal'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScanCaptured(true);
                  setStep(2);
                }}
                className="spring-interactive flex flex-col items-center justify-center gap-3 rounded-[22px] border border-[#E6E8EC] bg-[#F4F5F7] p-6 text-[#0B0B0C] hover:border-[#0B0B0C] cursor-pointer"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B0B0C] text-white">
                  <Upload className="h-7 w-7" />
                </div>
                <span className="text-base font-extrabold">
                  {lang === 'ml' ? 'PDF / ഫോട്ടോ തിരഞ്ഞെടുക്കുക' : 'Upload PDF / Image'}
                </span>
                <span className="text-xs text-[#5B6168]">
                  {lang === 'ml' ? 'വാട്ട്സ്ആപ്പ് PDF കൾ ചേർക്കാം' : 'Supports multi-page PDFs'}
                </span>
              </button>
            </div>

            {scanCaptured && (
              <div className="pt-2">
                <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                  <span>
                    {lang === 'ml'
                      ? 'അടുത്തത്: രേഖയുടെ തരം തിരഞ്ഞെടുക്കുക →'
                      : 'Next: Choose Document Type →'}
                  </span>
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#0B0B0C]">
                {lang === 'ml'
                  ? 'ടാപ്പ് 2: ഇത് ഏത് രേഖയാണ്?'
                  : 'Tap 2: Choose Document Type'}
              </h3>
              <p className="text-sm text-[#5B6168]">
                {lang === 'ml'
                  ? 'കേരളത്തിലെയും ഗൾഫിലെയും പ്രധാനപ്പെട്ട 18 രേഖകൾ ഇതിൽ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്'
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
                    className={`spring-interactive flex min-h-[96px] flex-col items-start justify-between rounded-2xl border p-4 text-left cursor-pointer ${
                      active
                        ? 'border-[#E03A45] bg-[#E03A45] text-white shadow-sm'
                        : 'border-[#E6E8EC] bg-[#F4F5F7] text-[#0B0B0C] hover:border-[#0B0B0C]'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${active ? 'text-white' : 'text-[#E03A45]'}`} />
                    <span className="text-xs sm:text-sm font-extrabold leading-snug">
                      {lang === 'ml' ? t.ml : t.en}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline-ink" onClick={() => setStep(1)}>
                {lang === 'ml' ? '← പിന്നോട്ട്' : '← Back'}
              </Button>
              <Button variant="primary" onClick={() => setStep(3)}>
                {lang === 'ml' ? 'അടുത്തത്: കാലാവധി തീയതി →' : 'Next: Pick Expiry Date →'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#0B0B0C]">
                {lang === 'ml'
                  ? 'ടാപ്പ് 3: കാലാവധി തീയതി തിരഞ്ഞെടുത്ത് സേവ് ചെയ്യുക'
                  : 'Tap 3: Pick Expiry Date & Save to Vault'}
              </h3>
              <p className="text-sm text-[#5B6168]">
                {lang === 'ml'
                  ? 'കാലാവധി കഴിയുന്നതിന് 60, 30, 7, 1 ദിവസം മുൻപ് ഞങ്ങൾ ഓർമ്മിപ്പിക്കും.'
                  : 'We will alert your household 60, 30, 7, and 1 days before expiry.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B0B0C] mb-1.5">
                  {lang === 'ml' ? 'കാലാവധി തീയതി (Expiry Date)' : 'Expiry Date'}
                </label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5B6168]" />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full min-h-[48px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] pl-10 pr-3 font-mono-tabular text-sm font-bold text-[#0B0B0C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0B0C] mb-1.5">
                  {lang === 'ml' ? 'കുടുംബാംഗം (Family Member)' : 'Family Member'}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 text-sm font-bold text-[#0B0B0C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0B0C] mb-1.5">
                  {lang === 'ml' ? 'രേഖയുടെ നമ്പർ (എൻക്രിപ്റ്റഡ്)' : 'Document ID (Encrypted)'}
                </label>
                <input
                  type="text"
                  value={docNum}
                  onChange={(e) => setDocNum(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 font-mono-tabular text-sm font-bold text-[#0B0B0C]"
                />
              </div>
            </div>

            {savedToast && (
              <div className="rounded-2xl bg-[#E4F7EC] border border-[#0F7B3E]/30 p-4 flex items-center gap-3 text-[#0F7B3E] font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>
                  {lang === 'ml'
                    ? 'രേഖ സുരക്ഷിതമായി കുടുംബ വോൾട്ടിൽ ചേർത്തു!'
                    : 'Document encrypted and saved to household vault!'}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button variant="outline-ink" onClick={() => setStep(2)}>
                {lang === 'ml' ? '← പിന്നോട്ട്' : '← Back'}
              </Button>
              <Button variant="primary" size="lg" onClick={handleSave}>
                <Check className="h-5 w-5" />
                <span>
                  {lang === 'ml' ? 'വോൾട്ടിൽ സേവ് ചെയ്യുക (Save)' : 'Save to Household Vault'}
                </span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

/* ==========================================================================
   SCREEN 5: WORKERS BOOK LIST & DETAIL (Call & WhatsApp 1-Tap Actions)
   ========================================================================== */
interface Screen5WorkersBookProps {
  lang: 'ml' | 'en';
  workers: WorkerRecordItem[];
}

export const Screen5WorkersBook: React.FC<Screen5WorkersBookProps> = ({
  lang,
  workers,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [activeWorker, setActiveWorker] = useState<WorkerRecordItem>(workers[0]);

  const trades = [
    { id: 'ALL', ml: 'എല്ലാവരും (All)', en: 'All Trades' },
    { id: 'ELECTRICIAN', ml: 'ഇലക്ട്രീഷ്യൻ', en: 'Electrician' },
    { id: 'PLUMBER', ml: 'പ്ലംബർ', en: 'Plumber' },
    { id: 'AC_TECH', ml: 'എസി സർവീസ്', en: 'AC / Inverter' },
    { id: 'COCONUT', ml: 'തെങ്ങ് കയറ്റം / തോട്ടം', en: 'Garden & Coconut' },
  ];

  const filtered = workers.filter(
    (w) => selectedTrade === 'ALL' || w.tradeId === selectedTrade
  );

  return (
    <div className="space-y-6">
      {/* Trade Filter Chip Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {trades.map((t) => (
          <Chip
            key={t.id}
            active={selectedTrade === t.id}
            onClick={() => setSelectedTrade(t.id)}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>{lang === 'ml' ? t.ml : t.en}</span>
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Workers List */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map((w) => {
            const isSelected = activeWorker.id === w.id;
            return (
              <div
                key={w.id}
                onClick={() => setActiveWorker(w)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveWorker(w);
                }}
                className={`spring-interactive rounded-[22px] border p-4 cursor-pointer ${
                  isSelected
                    ? 'border-[#E03A45] bg-white shadow-md'
                    : 'border-[#E6E8EC] bg-[#F4F5F7] hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block rounded-full bg-[#FFF4D6] px-2.5 py-0.5 text-[11px] font-bold text-[#A85A00]">
                      {lang === 'ml' ? w.tradeMl : w.tradeEn}
                    </span>
                    <h3 className="mt-1 text-base font-extrabold text-[#0B0B0C]">
                      {lang === 'ml' ? w.nameMl : w.nameEn}
                    </h3>
                    <p className="text-xs text-[#5B6168] mt-0.5">
                      {lang === 'ml' ? w.rateMl : w.rateEn}
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xs font-bold text-[#5B6168]">
                    {w.lastVisit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Selected Worker Detail + Call & WhatsApp Buttons + Work Log */}
        <Card className="lg:col-span-7 space-y-6" white>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E8EC] pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7EC] px-3 py-1 text-xs font-bold text-[#0F7B3E]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {lang === 'ml' ? activeWorker.verifiedByMl : activeWorker.verifiedByEn}
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0B0B0C]">
                {lang === 'ml' ? activeWorker.nameMl : activeWorker.nameEn}
              </h2>
              <p className="text-sm text-[#5B6168]">
                {lang === 'ml' ? activeWorker.tradeMl : activeWorker.tradeEn} •{' '}
                <span className="font-mono-tabular font-bold text-[#0B0B0C]">
                  {activeWorker.phone}
                </span>
              </p>
            </div>

            {/* 1-Tap Call and WhatsApp Buttons */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${activeWorker.phone.replace(/\s+/g, '')}`}
                className="spring-interactive inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#E03A45] px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#C42F3A]"
              >
                <Phone className="h-4 w-4" />
                <span>{lang === 'ml' ? 'വിളിക്കുക (Call)' : 'Call Now'}</span>
              </a>

              <a
                href={`https://wa.me/${activeWorker.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="spring-interactive inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#0F7B3E] px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:opacity-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#5B6168]">
              {lang === 'ml'
                ? 'വീട്ടിൽ ചെയ്ത ജോലികളുടെ കണക്ക് (Work & Warranty History)'
                : 'Household Work & Service History'}
            </h3>
            <div className="mt-3 space-y-3">
              {activeWorker.history.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#F4F5F7] p-4 border border-[#E6E8EC]"
                >
                  <div>
                    <p className="text-sm font-extrabold text-[#0B0B0C]">
                      {lang === 'ml' ? item.workMl : item.workEn}
                    </p>
                    <p className="font-mono-tabular text-xs text-[#5B6168] mt-0.5">
                      {item.date}
                    </p>
                  </div>
                  <span className="font-mono-tabular text-sm font-extrabold text-[#0B0B0C] bg-white px-3 py-1.5 rounded-full border border-[#E6E8EC]">
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ==========================================================================
   SCREEN 6: PRICING CARDS (Inside Settings Tab)
   ========================================================================== */
export const Screen6Pricing: React.FC<{ lang: 'ml' | 'en'; onStart: () => void }> = ({
  lang,
  onStart,
}) => {
  const plans = [
    {
      nameMl: 'തുടക്കം (Starter Free)',
      nameEn: 'Starter Vault',
      price: '₹0',
      periodMl: '/ എന്നേക്കും സൗജന്യം',
      periodEn: '/ forever free',
      badge: null,
      featuresMl: [
        '10 പ്രധാന കുടുംബ രേഖകൾ വരെ സൂക്ഷിക്കാം',
        '2 കുടുംബാംഗങ്ങൾക്ക് പ്രവേശനം',
        'ഇമെയിൽ വഴി കാലാവധി അലേർട്ടുകൾ',
        'പണിക്കാരുടെ ഡയറി (5 പേർ വരെ)',
      ],
      featuresEn: [
        'Up to 10 encrypted household documents',
        '2 family members (Owner + Editor)',
        'Email expiry alerts (60, 30, 7 days)',
        'Workers Book (up to 5 trusted tradespeople)',
      ],
      ctaMl: 'സൗജന്യമായി തുടങ്ങുക',
      ctaEn: 'Current Free Plan',
      highlighted: false,
    },
    {
      nameMl: 'കുടുംബം പ്ലാൻ (Kudumbam Plus)',
      nameEn: 'Kudumbam Family',
      price: '₹99',
      periodMl: '/ മാസം (₹999/വർഷം)',
      periodEn: '/ month (billed ₹999/yr)',
      badge: lang === 'ml' ? 'ഏറ്റവും ജനപ്രിയം' : 'MOST POPULAR FOR KERALA + GULF',
      featuresMl: [
        'പരിധിയില്ലാത്ത രേഖകളും PDF സ്കാനുകളും',
        '6 കുടുംബാംഗങ്ങൾ (നാട്ടിലും ഗൾഫിലും ഉള്ളവർക്ക്)',
        'വാട്ട്സ്ആപ്പ് + ഇമെയിൽ കാലാവധി അലേർട്ടുകൾ',
        'ഇഖാമ, പാസ്‌പോർട്ട്, ഭൂനികുതി, വാഹന RC ട്രാക്കർ',
        'പണിക്കാരുടെ പൂർണ്ണ ഡയറിയും വാറന്റി രസീതുകളും',
      ],
      featuresEn: [
        'Unlimited documents, multi-page PDFs & photos',
        'Up to 6 family members across Kerala & Gulf',
        'WhatsApp + Email expiry reminders (60/30/7/1d)',
        'Iqama, Passport, Land Tax & Gold Loan trackers',
        'Unlimited Workers Book & service history logs',
      ],
      ctaMl: 'കുടുംബ പ്ലാൻ തിരഞ്ഞെടുക്കുക',
      ctaEn: 'Choose Family Plan',
      highlighted: true,
    },
    {
      nameMl: 'തറവാട് / NRI Pro',
      nameEn: 'Tharavadu / NRI Pro',
      price: '₹249',
      periodMl: '/ മാസം',
      periodEn: '/ month',
      badge: null,
      featuresMl: [
        '2 വീടുകൾ (ഉദാ: കൊച്ചി + ദുബായ് / മാതാപിതാക്കളുടെ വീട്)',
        '15 കുടുംബാംഗങ്ങൾ വരെ (Owner / Editor / Viewer)',
        'സിഎ / ലോയർ / ഏജന്റ് എന്നിവർക്ക് സുരക്ഷിത ഷെയർ ലിങ്ക്',
        'അടിയന്തര മെഡിക്കൽ & ഇൻഷുറൻസ് കാർഡ് പായ്ക്ക്',
      ],
      featuresEn: [
        '2 Households (e.g., Parents home in Kerala + NRI home)',
        'Up to 15 members with granular Viewer/Editor roles',
        'Expiring CA / Lawyer / Agent share links',
        '1-tap Emergency Medical & Insurance Share Pack',
      ],
      ctaMl: 'NRI Pro തിരഞ്ഞെടുക്കുക',
      ctaEn: 'Start NRI Pro Trial',
      highlighted: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-block rounded-full bg-[#FFF4D6] px-4 py-1 text-xs font-extrabold text-[#A85A00]">
          {lang === 'ml' ? 'ലളിതമായ നിരക്കുകൾ' : 'SIMPLE HOUSEHOLD PRICING'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0C]">
          {lang === 'ml'
            ? 'ഒരു രേഖയുടെ പിഴത്തുകയേക്കാൾ കുറഞ്ഞ നിരക്കിൽ കുടുംബ വോൾട്ട്'
            : 'Cheaper than a single late vehicle insurance or Iqama fine'}
        </h2>
        <p className="text-sm text-[#5B6168]">
          {lang === 'ml'
            ? 'സർക്കാർ അംഗീകാരമോ ഔദ്യോഗിക പരിശോധനയോ ഞങ്ങൾ അവകാശപ്പെടുന്നില്ല — ഇത് നിങ്ങളുടെ കുടുംബത്തിന്റെ സ്വകാര്യ ഡിജിറ്റൽ ലോക്കറാണ്.'
            : 'Private family organizer — never sells data, no ads, cancel anytime.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-[28px] border p-6 sm:p-8 flex flex-col justify-between ${
              plan.highlighted
                ? 'border-2 border-[#E03A45] bg-white shadow-xl relative'
                : 'border-[#E6E8EC] bg-[#F4F5F7]'
            }`}
          >
            <div>
              {plan.badge && (
                <span className="inline-block mb-3 rounded-full bg-[#EFC94C] px-3.5 py-1 text-xs font-extrabold text-[#0B0B0C]">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-xl font-extrabold text-[#0B0B0C]">
                {lang === 'ml' ? plan.nameMl : plan.nameEn}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono-tabular text-4xl font-extrabold text-[#0B0B0C]">
                  {plan.price}
                </span>
                <span className="text-xs font-bold text-[#5B6168]">
                  {lang === 'ml' ? plan.periodMl : plan.periodEn}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {(lang === 'ml' ? plan.featuresMl : plan.featuresEn).map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-sm text-[#0B0B0C]">
                    <CheckCircle2 className="h-4 w-4 text-[#0F7B3E] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button
                variant={plan.highlighted ? 'primary' : 'dark'}
                size="lg"
                className="w-full"
                onClick={onStart}
              >
                <span>{lang === 'ml' ? plan.ctaMl : plan.ctaEn}</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
