import React, { useState, useEffect } from 'react';
import {
  VaultDocumentItem,
  HouseholdMemberItem,
  WorkerRecordItem,
  SharePackItem,
} from './types/vault';
import {
  STORAGE_KEYS,
  INITIAL_MEMBERS,
  INITIAL_DOCS,
  INITIAL_WORKERS,
  INITIAL_SHARE_PACKS,
  loadFromStorage,
} from './data/initialVaultData';
import { AppWorkspaceShell } from './components/layout/AppWorkspaceShell';
import { computeCompletenessScore } from './utils/vaultLogic';

export function App() {
  const [lang, setLang] = useState<'ml' | 'en'>('en');

  // Centralized persistent state synchronized with localStorage v3 keys
  const [docs, setDocs] = useState<VaultDocumentItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.DOCS, INITIAL_DOCS)
  );
  const [members, setMembers] = useState<HouseholdMemberItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS)
  );
  const [workers, setWorkers] = useState<WorkerRecordItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.WORKERS, INITIAL_WORKERS)
  );
  const [sharePacks, setSharePacks] = useState<SharePackItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.SHARE, INITIAL_SHARE_PACKS)
  );

  // Automatic localStorage persistence hooks
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(docs));
    } catch {
      // Ignore quota errors
    }
  }, [docs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.MEMBERS,
        JSON.stringify(members)
      );
    } catch {
      // Ignore quota errors
    }
  }, [members]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.WORKERS,
        JSON.stringify(workers)
      );
    } catch {
      // Ignore quota errors
    }
  }, [workers]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SHARE,
        JSON.stringify(sharePacks)
      );
    } catch {
      // Ignore quota errors
    }
  }, [sharePacks]);

  // Dynamic completeness score based on stored documents
  const completenessScore = computeCompletenessScore(docs.length + 10, 18);

  const handleRenewDocument = (docId: string) => {
    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const baseYear = new Date(d.expiryDate).getFullYear();
        const nextYear = Math.max(
          new Date().getFullYear() + 1,
          isNaN(baseYear) ? new Date().getFullYear() + 1 : baseYear + 1
        );
        const newExpiry =
          d.expiryDate === 'Lifetime'
            ? 'Lifetime'
            : `${nextYear}${d.expiryDate.slice(4)}`;
        return {
          ...d,
          expiryDate: newExpiry,
          status: 'VALID',
          daysTextEn: 'Valid (+1 Yr)',
          daysTextMl: 'സാധുവാണ് (+1 വർഷം)',
          renewalHistory: [
            {
              id: `rh-${Date.now()}`,
              date: new Date().toISOString().slice(0, 10),
              actionMl: `വോൾട്ടിൽ പുതുക്കിയതായി രേഖപ്പെടുത്തി (+1 വർഷം -> ${newExpiry})`,
              actionEn: `Marked as renewed in Kudumba Vault (+1 Year -> ${newExpiry})`,
              by: 'Rahul Nair',
            },
            ...d.renewalHistory,
          ],
        };
      })
    );
  };

  const handleUpdateDocument = (updated: VaultDocumentItem) => {
    setDocs((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleAddCreatedDoc = (newDoc: VaultDocumentItem) => {
    setDocs((prev) => [newDoc, ...prev]);
  };

  const handleAddMember = (newMember: HouseholdMemberItem) => {
    setMembers((prev) => [...prev, newMember]);
  };

  const handleUpdateMember = (updatedMember: HouseholdMemberItem) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleAddWorker = (newWorker: WorkerRecordItem) => {
    setWorkers((prev) => [newWorker, ...prev]);
  };

  const handleUpdateWorker = (updatedWorker: WorkerRecordItem) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === updatedWorker.id ? updatedWorker : w))
    );
  };

  const handleDeleteWorker = (workerId: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));
  };

  const handleAddSharePack = (newPack: SharePackItem) => {
    setSharePacks((prev) => [newPack, ...prev]);
  };

  const handleDeleteSharePack = (packId: string) => {
    setSharePacks((prev) => prev.filter((p) => p.id !== packId));
  };

  return (
    <div
      lang={lang}
      className={`min-h-screen bg-[#FFFFFF] text-[#0B0B0C] ${
        lang === 'ml' ? 'font-malayalam' : 'font-sans'
      }`}
    >
      <AppWorkspaceShell
        lang={lang}
        onToggleLang={setLang}
        docs={docs}
        members={members}
        workers={workers}
        sharePacks={sharePacks}
        completenessScore={completenessScore}
        onRenewDocument={handleRenewDocument}
        onUpdateDocument={handleUpdateDocument}
        onAddCreatedDoc={handleAddCreatedDoc}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onDeleteMember={handleDeleteMember}
        onAddWorker={handleAddWorker}
        onUpdateWorker={handleUpdateWorker}
        onDeleteWorker={handleDeleteWorker}
        onAddSharePack={handleAddSharePack}
        onDeleteSharePack={handleDeleteSharePack}
      />
    </div>
  );
}

export default App;
