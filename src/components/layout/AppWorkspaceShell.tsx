import React, { useState, useEffect } from 'react';
import {
  FileText,
  Car,
  Home as HomeIcon,
  HeartPulse,
  Plane,
  UserCheck,
  Plus,
  ChevronDown,
  Undo2,
} from 'lucide-react';
import {
  Button,
  SearchPill,
  IconRail,
  BottomTabs,
  MobileMoreSheet,
  InstallPrompt,
  AppNavTab,
} from '../ui/DesignSystem';
import {
  VaultDocumentItem,
  HouseholdMemberItem,
  WorkerRecordItem,
  SharePackItem,
} from '../../types/vault';
import {
  HomeDashboardScreen,
  CategoryMetaItem,
} from '../screens/HomeDashboardScreen';
import { VaultExplorerScreen } from '../screens/VaultExplorerScreen';
import { Screen3DocumentDetail } from '../screens/DocumentDetailScreen';
import { Screen4AddDocument } from '../screens/AddDocumentScreen';
import { PeopleGridScreen } from '../screens/PeopleGridScreen';
import { MemberDetailScreen } from '../screens/MemberDetailScreen';
import { WorkersBookScreen } from '../screens/WorkersBookScreen';
import { SharePacksScreen } from '../screens/SharePacksScreen';
import { Screen6Pricing } from '../screens/PricingSettingsScreen';
import { AddMemberModal } from '../modals/AddMemberModal';
import { AddWorkerModal } from '../modals/AddWorkerModal';
import { AddSharePackModal } from '../modals/AddSharePackModal';

export interface AppWorkspaceShellProps {
  lang: 'ml' | 'en';
  onToggleLang: (lang: 'ml' | 'en') => void;
  docs: VaultDocumentItem[];
  members: HouseholdMemberItem[];
  workers: WorkerRecordItem[];
  sharePacks: SharePackItem[];
  completenessScore: number;
  onRenewDocument: (docId: string) => void;
  onUpdateDocument: (updated: VaultDocumentItem) => void;
  onAddCreatedDoc: (newDoc: VaultDocumentItem) => void;
  onAddMember: (newMember: HouseholdMemberItem) => void;
  onUpdateMember: (updatedMember: HouseholdMemberItem) => void;
  onDeleteMember: (memberId: string) => void;
  onAddWorker: (newWorker: WorkerRecordItem) => void;
  onUpdateWorker: (updatedWorker: WorkerRecordItem) => void;
  onDeleteWorker: (workerId: string) => void;
  onAddSharePack: (newPack: SharePackItem) => void;
  onDeleteSharePack: (packId: string) => void;
}

export const AppWorkspaceShell: React.FC<AppWorkspaceShellProps> = ({
  lang,
  onToggleLang,
  docs,
  members,
  workers,
  sharePacks,
  completenessScore,
  onRenewDocument,
  onUpdateDocument,
  onAddCreatedDoc,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAddWorker,
  onUpdateWorker,
  onDeleteWorker,
  onAddSharePack,
  onDeleteSharePack,
}) => {
  const [activeNav, setActiveNav] = useState<AppNavTab>('home');
  const [subView, setSubView] = useState<
    'none' | 'doc-detail' | 'add-doc' | 'member-detail'
  >('none');
  const [selectedDocId, setSelectedDocId] = useState<string>(
    docs[0]?.id || 'doc-1'
  );
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    members[0]?.id || 'mem-1'
  );
  const [preselectedMemberForDoc, setPreselectedMemberForDoc] = useState<
    string | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showAddShareModal, setShowAddShareModal] = useState(false);
  const [showMobileMoreSheet, setShowMobileMoreSheet] = useState(false);

  const selectedDoc = docs.find((d) => d.id === selectedDocId) || docs[0];
  const selectedMember =
    members.find((m) => m.id === selectedMemberId) || members[0];

  const countByCat = (catId: string) =>
    catId === 'ALL'
      ? docs.length
      : docs.filter((d) => d.categoryId === catId || d.category === catId)
          .length;

  const categories: CategoryMetaItem[] = [
    {
      id: 'ALL',
      ml: 'എല്ലാം (All)',
      en: 'All Vault',
      count: countByCat('ALL'),
      icon: FileText,
    },
    {
      id: 'IDENTITY',
      ml: 'തിരിച്ചറിയൽ',
      en: 'Identity',
      count: countByCat('IDENTITY'),
      icon: UserCheck,
    },
    {
      id: 'GULF',
      ml: 'ഗൾഫ് / NRI',
      en: 'Gulf / NRI',
      count: countByCat('GULF'),
      icon: Plane,
    },
    {
      id: 'VEHICLE',
      ml: 'വാഹനം',
      en: 'Vehicle',
      count: countByCat('VEHICLE'),
      icon: Car,
    },
    {
      id: 'PROPERTY',
      ml: 'വസ്തു / കരം',
      en: 'Property & Tax',
      count: countByCat('PROPERTY'),
      icon: HomeIcon,
    },
    {
      id: 'MEDICAL',
      ml: 'ഇൻഷുറൻസ് / മെഡിക്കൽ',
      en: 'Health & Policy',
      count: countByCat('MEDICAL') + countByCat('HEALTH'),
      icon: HeartPulse,
    },
  ];

  const filteredDocs = docs.filter((d) => {
    const matchesCat =
      selectedCategory === 'ALL' ||
      d.categoryId === selectedCategory ||
      d.category === selectedCategory ||
      (selectedCategory === 'MEDICAL' && d.category === 'HEALTH');
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      d.titleEn.toLowerCase().includes(q) ||
      d.titleMl.toLowerCase().includes(q) ||
      d.ownerEn.toLowerCase().includes(q) ||
      d.ownerMl.toLowerCase().includes(q) ||
      d.authorityEn.toLowerCase().includes(q) ||
      d.authorityMl.toLowerCase().includes(q) ||
      d.docNumber.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchEl = document.querySelector(
          'input[type="search"]'
        ) as HTMLInputElement | null;
        searchEl?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Backward navigation history stack
  const [navHistory, setNavHistory] = useState<
    Array<{
      nav: AppNavTab;
      subView: 'none' | 'doc-detail' | 'add-doc' | 'member-detail';
      docId?: string;
      memberId?: string;
    }>
  >([{ nav: 'home', subView: 'none' }]);

  const pushHistory = (
    nextNav: AppNavTab,
    nextSubView: 'none' | 'doc-detail' | 'add-doc' | 'member-detail',
    docId?: string,
    memberId?: string
  ) => {
    setNavHistory((prev) => {
      const top = prev[prev.length - 1];
      if (
        top &&
        top.nav === nextNav &&
        top.subView === nextSubView &&
        top.docId === docId &&
        top.memberId === memberId
      ) {
        return prev;
      }
      return [
        ...prev,
        {
          nav: nextNav,
          subView: nextSubView,
          docId,
          memberId,
        },
      ];
    });
  };

  const canGoBack =
    navHistory.length > 1 || subView !== 'none' || activeNav !== 'home';

  const handleGoBackward = () => {
    if (navHistory.length > 1) {
      const updated = [...navHistory];
      updated.pop(); // Pop current
      const prev = updated[updated.length - 1];
      setNavHistory(updated);
      setActiveNav(prev.nav);
      setSubView(prev.subView);
      if (prev.docId) setSelectedDocId(prev.docId);
      if (prev.memberId) setSelectedMemberId(prev.memberId);
      return;
    }

    if (subView !== 'none') {
      setSubView('none');
    } else if (activeNav !== 'home') {
      setActiveNav('home');
    }
  };

  // Keyboard shortcut listener: Alt + LeftArrow to go backward
  useEffect(() => {
    const onKeyNav = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (e.altKey && e.key === 'ArrowLeft') {
        if (canGoBack) {
          e.preventDefault();
          handleGoBackward();
        }
      } else if (!isInput && e.key === 'Backspace') {
        if (subView !== 'none' || activeNav !== 'home') {
          e.preventDefault();
          handleGoBackward();
        }
      }
    };
    window.addEventListener('keydown', onKeyNav);
    return () => window.removeEventListener('keydown', onKeyNav);
  }, [canGoBack, navHistory, subView, activeNav]);

  const handleSelectRailTab = (tab: AppNavTab) => {
    pushHistory(tab, 'none', selectedDocId, selectedMemberId);
    setActiveNav(tab);
    setSubView('none');
  };

  const handleOpenDocDetail = (doc: VaultDocumentItem) => {
    pushHistory(activeNav, 'doc-detail', doc.id, selectedMemberId);
    setSelectedDocId(doc.id);
    setSubView('doc-detail');
  };

  const handleOpenAddDoc = (forMemberName?: string) => {
    pushHistory(activeNav, 'add-doc', selectedDocId, selectedMemberId);
    setPreselectedMemberForDoc(forMemberName);
    setSubView('add-doc');
  };

  const handleOpenMemberDetailById = (memberId: string) => {
    pushHistory('people', 'member-detail', selectedDocId, memberId);
    setSelectedMemberId(memberId);
    setActiveNav('people');
    setSubView('member-detail');
  };

  const getPrimaryAddConfig = () => {
    if (activeNav === 'people') {
      return {
        label: lang === 'ml' ? '+ അംഗത്തെ ചേർക്കുക' : '+ Add Member',
        onClick: () => setShowAddMemberModal(true),
      };
    }
    if (activeNav === 'workers') {
      return {
        label: lang === 'ml' ? '+ ജോലിക്കാരനെ ചേർക്കുക' : '+ Add Worker',
        onClick: () => setShowAddWorkerModal(true),
      };
    }
    if (activeNav === 'share') {
      return {
        label: lang === 'ml' ? '+ ഷെയർ പായ്ക്ക്' : '+ Share Pack',
        onClick: () => setShowAddShareModal(true),
      };
    }
    return {
      label: lang === 'ml' ? '+ രേഖ ചേർക്കുക' : '+ Add Document',
      onClick: () => handleOpenAddDoc(),
    };
  };

  const primaryAdd = getPrimaryAddConfig();
  const expiringCount = docs.filter((d) => d.status !== 'VALID').length;

  const handleCreateServiceReminder = (
    worker: WorkerRecordItem,
    logEntry: { id: string; date: string; workEn: string; workMl: string }
  ) => {
    const baseDate = new Date(logEntry.date);
    const nextYear = isNaN(baseDate.getTime())
      ? new Date().getFullYear() + 1
      : baseDate.getFullYear() + 1;
    const monthDay =
      logEntry.date.length >= 10 ? logEntry.date.slice(4) : '-03-15';
    const nextExpiryDate = `${nextYear}${monthDay}`;
    const roleEn = worker.tradeEn || worker.roleEn || 'Household';
    const roleMl = worker.tradeMl || worker.roleMl || 'ഹൗസ്ഹോൾഡ്';

    const reminderDoc: VaultDocumentItem = {
      id: `doc-rem-${Date.now()}`,
      titleEn: `${roleEn} Annual Service (${worker.nameEn})`,
      titleMl: `${roleMl} വാർഷിക സർവീസ് (${worker.nameMl})`,
      subEn: `Scheduled maintenance • ${logEntry.workEn}`,
      subMl: `നിശ്ചയിച്ച സർവീസ് • ${logEntry.workMl}`,
      category: 'PROPERTY',
      ownerEn: 'All Family (Kochi)',
      ownerMl: 'കുടുംബം (കൊച്ചി)',
      docNumber: worker.phone,
      expiryDate: nextExpiryDate,
      status: 'VALID',
      daysTextEn: 'Scheduled',
      daysTextMl: 'നിശ്ചയിച്ചു',
      authorityEn: `${worker.nameEn} (${worker.areaEn})`,
      authorityMl: `${worker.nameMl} (${worker.areaMl})`,
      renewalHistory: [
        {
          id: `rh-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          actionEn: `Created annual reminder from Workers Book (${logEntry.workEn})`,
          actionMl: `ജോലിക്കാരുടെ ബുക്കിൽ നിന്ന് വാർഷിക ഓർമ്മപ്പെടുത്തൽ ചേർത്തു (${logEntry.workMl})`,
          by: 'Rahul Nair',
        },
      ],
    };

    onAddCreatedDoc(reminderDoc);
    onUpdateWorker({
      ...worker,
      history: worker.history.map((h) =>
        h.id === logEntry.id ? { ...h, reminderCreated: true } : h
      ),
    });
  };

  return (
    <div className="relative flex min-h-screen w-full bg-white">
      {/* Desktop Left Coral-Red IconRail */}
      <IconRail
        activeTab={activeNav}
        onSelectTab={handleSelectRailTab}
        lang={lang}
        counts={{
          people: members.length,
          workers: workers.length,
          share: sharePacks.length,
          vaultHasExpiring: expiringCount > 0,
        }}
      />

      {/* Main White Dashboard Canvas with Balanced Left & Right Side Gaps */}
      <div className="flex-1 flex flex-col justify-between px-5 sm:px-10 md:px-14 lg:px-20 xl:px-24 py-6 pb-24 md:pb-8 overflow-x-hidden">
        <div className="w-full max-w-[1140px] mx-auto">
          {/* Top Utility Bar: Backward Button + Brand Block + SearchPill + Kochi+Dubai Pill + Language Toggle + Split Add CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6E8EC]">
            {/* Left Backward Button & Household Title Badge (Matches image_f3555173.png) */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Backward Option Button */}
              <button
                type="button"
                onClick={handleGoBackward}
                disabled={!canGoBack}
                title={
                  lang === 'ml'
                    ? 'പുറകോട്ട് പോവുക (Back - Alt+Left)'
                    : 'Go Backward (Alt+Left)'
                }
                aria-label={lang === 'ml' ? 'പുറകോട്ട് പോവുക' : 'Go Backward'}
                className={`spring-interactive flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 transition-all cursor-pointer ${
                  canGoBack
                    ? 'border-[#E03A45] bg-[#FFF5F5] text-[#E03A45] hover:bg-[#E03A45] hover:text-white hover:scale-105 shadow-xs'
                    : 'border-[#E6E8EC] bg-[#F8F9FA] text-[#8A949E] opacity-45 cursor-not-allowed'
                }`}
              >
                <Undo2 className="h-5 w-5 stroke-[2.3]" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectRailTab('home')}
                className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer"
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-[#FDECEE] text-[#E03A45]">
                  <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-sm sm:text-[15px] font-extrabold text-[#0B0B0C] leading-tight">
                    {lang === 'ml' ? 'വടക്കേതിൽ വോൾട്ട്' : 'Vadakkethil Vault'}
                  </p>
                  <p className="text-xs font-medium text-[#5B6168] leading-tight mt-0.5">
                    {lang === 'ml' ? 'ഫാമിലി ഡാഷ്‌ബോർഡ്' : 'Family Dashboard'}
                  </p>
                </div>
              </button>
            </div>

            <SearchPill
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                if (subView !== 'none') setSubView('none');
              }}
              placeholder={
                lang === 'ml'
                  ? 'രേഖകൾ, അംഗങ്ങൾ, ജോലിക്കാർ തിരയുക...'
                  : 'Search navigations... Ctrl K'
              }
            />

            <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
              <div className="hidden lg:flex items-center gap-2 rounded-full bg-[#F8F9FA] border border-[#E6E8EC] px-3.5 py-2 text-xs font-bold text-[#0B0B0C]">
                <span className="h-2 w-2 rounded-full bg-[#0F7B3E]" />
                <span>
                  {lang === 'ml' ? 'കൊച്ചി + ദുബായ്' : 'Kochi + Dubai'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onToggleLang(lang === 'ml' ? 'en' : 'ml')}
                className="spring-interactive inline-flex h-[42px] items-center gap-2 rounded-full border border-[#E6E8EC] bg-[#F8F9FA] pl-3.5 pr-1.5 text-xs font-bold text-[#0B0B0C] hover:border-[#0B0B0C] cursor-pointer"
              >
                <span>{lang === 'ml' ? 'English' : 'മലയാളം'}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B0B0C] text-[11px] font-bold text-white">
                  {lang === 'ml' ? 'മല' : 'EN'}
                </span>
              </button>

              {/* Split Coral Red Action Button (Matches image_b32f5beb.png, hidden on mobile) */}
              <div className="hidden sm:inline-flex items-center rounded-full bg-[#E03A45] text-white shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={primaryAdd.onClick}
                  className="inline-flex h-[42px] items-center gap-1.5 pl-4 pr-3.5 text-xs sm:text-sm font-bold hover:bg-[#C42F3A] transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{primaryAdd.label}</span>
                </button>
                <button
                  type="button"
                  onClick={primaryAdd.onClick}
                  aria-label="More add options"
                  className="inline-flex h-[42px] items-center justify-center border-l border-white/20 px-2.5 hover:bg-[#C42F3A] transition-colors cursor-pointer"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {subView === 'add-doc' && (
            <div className="mt-6">
              <Screen4AddDocument
                lang={lang}
                members={members}
                defaultOwner={preselectedMemberForDoc}
                onAddCreatedDoc={(newDoc) => {
                  onAddCreatedDoc(newDoc);
                  setSelectedDocId(newDoc.id);
                  setSubView('doc-detail');
                }}
                onCancel={() => setSubView('none')}
              />
            </div>
          )}

          {subView === 'doc-detail' && selectedDoc && (
            <div className="mt-6">
              <Screen3DocumentDetail
                lang={lang}
                doc={selectedDoc}
                onRenewDocument={onRenewDocument}
                onUpdateDocument={onUpdateDocument}
                onBackToHome={() => setSubView('none')}
              />
            </div>
          )}

          {subView === 'member-detail' && selectedMember && (
            <div className="mt-6">
              <MemberDetailScreen
                lang={lang}
                member={selectedMember}
                docs={docs}
                onBack={() => setSubView('none')}
                onSelectDoc={(docId) => {
                  setSelectedDocId(docId);
                  setSubView('doc-detail');
                }}
                onAddDocForMember={(memberName) => handleOpenAddDoc(memberName)}
                onRenewDoc={onRenewDocument}
                onUpdateMember={onUpdateMember}
                onDeleteMember={(id) => {
                  onDeleteMember(id);
                  setSubView('none');
                }}
              />
            </div>
          )}

          {subView === 'none' && activeNav === 'home' && (
            <div className="mt-6">
              <HomeDashboardScreen
                lang={lang}
                docs={docs}
                filteredDocs={filteredDocs}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                completenessScore={completenessScore}
                expiringCount={expiringCount}
                onOpenDocDetail={handleOpenDocDetail}
                onOpenAddDoc={() => handleOpenAddDoc()}
                onOpenWorkers={() => handleSelectRailTab('workers')}
              />
            </div>
          )}

          {subView === 'none' && activeNav === 'vault' && (
            <div className="mt-6">
              <VaultExplorerScreen
                lang={lang}
                filteredDocs={filteredDocs}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onOpenDocDetail={handleOpenDocDetail}
                onOpenAddDoc={() => handleOpenAddDoc()}
              />
            </div>
          )}

          {subView === 'none' && activeNav === 'people' && (
            <div className="mt-6">
              <PeopleGridScreen
                lang={lang}
                members={members}
                docs={docs}
                onSelectMember={handleOpenMemberDetailById}
                onSelectDoc={(docId) => {
                  setSelectedDocId(docId);
                  setSubView('doc-detail');
                }}
                onOpenAddMember={() => setShowAddMemberModal(true)}
                onAddDocForMember={(memberName) => handleOpenAddDoc(memberName)}
              />
            </div>
          )}

          {subView === 'none' && activeNav === 'workers' && (
            <div className="mt-6">
              <WorkersBookScreen
                lang={lang}
                workers={workers}
                searchQuery={searchQuery}
                onOpenAddWorker={() => setShowAddWorkerModal(true)}
                onAddLog={(workerId, newEntry) => {
                  const target = workers.find((w) => w.id === workerId);
                  if (!target) return;
                  onUpdateWorker({
                    ...target,
                    lastVisit: newEntry.date,
                    lastServiceDate: newEntry.date,
                    history: [newEntry, ...target.history],
                  });
                }}
                onUpdateWorker={onUpdateWorker}
                onDeleteWorker={onDeleteWorker}
                onCreateServiceReminder={handleCreateServiceReminder}
              />
            </div>
          )}

          {subView === 'none' && activeNav === 'share' && (
            <div className="mt-6">
              <SharePacksScreen
                lang={lang}
                sharePacks={sharePacks}
                docs={docs}
                onOpenAddShareModal={() => setShowAddShareModal(true)}
                onDeleteSharePack={onDeleteSharePack}
                onOpenDocDetail={handleOpenDocDetail}
              />
            </div>
          )}

          {subView === 'none' && activeNav === 'settings' && (
            <div className="mt-6">
              <Screen6Pricing
                lang={lang}
                onStart={() => handleSelectRailTab('home')}
              />
            </div>
          )}
        </div>

        {showInstallPrompt && subView === 'none' && (
          <div className="w-full max-w-[1140px] mx-auto mt-8 flex justify-end">
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
        onSelectTab={(tab) => {
          setShowMobileMoreSheet(false);
          handleSelectRailTab(tab);
        }}
        onAddDocument={primaryAdd.onClick}
        onOpenMore={() => setShowMobileMoreSheet((prev) => !prev)}
        isMoreOpen={showMobileMoreSheet}
        lang={lang}
      />

      {/* Mobile More Options Bottom Sheet */}
      <MobileMoreSheet
        isOpen={showMobileMoreSheet}
        onClose={() => setShowMobileMoreSheet(false)}
        onSelectTab={(tab) => {
          setShowMobileMoreSheet(false);
          handleSelectRailTab(tab);
        }}
        onToggleLang={() => onToggleLang(lang === 'ml' ? 'en' : 'ml')}
        lang={lang}
        counts={{
          people: members.length,
          share: sharePacks.length,
        }}
      />

      {showAddMemberModal && (
        <AddMemberModal
          lang={lang}
          onClose={() => setShowAddMemberModal(false)}
          onSave={(member) => {
            onAddMember(member);
            setShowAddMemberModal(false);
            setSelectedMemberId(member.id);
            setActiveNav('people');
            setSubView('member-detail');
          }}
        />
      )}

      {showAddWorkerModal && (
        <AddWorkerModal
          lang={lang}
          onClose={() => setShowAddWorkerModal(false)}
          onSave={(worker) => {
            onAddWorker(worker);
            setShowAddWorkerModal(false);
            setActiveNav('workers');
          }}
        />
      )}

      {showAddShareModal && (
        <AddSharePackModal
          lang={lang}
          docs={docs}
          members={members}
          onClose={() => setShowAddShareModal(false)}
          onSave={(pack) => {
            onAddSharePack(pack);
            setShowAddShareModal(false);
            setActiveNav('share');
          }}
        />
      )}
    </div>
  );
};
