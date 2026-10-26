import React, { useState, useRef } from 'react';
import {
  CornerUpLeft,
  MapPin,
  Plus,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Trash2,
  MoreHorizontal,
  Users,
  Layers,
  Hash,
  Mail,
  Phone,
  ArrowUp,
  CreditCard,
  Calendar,
  Camera,
  Pencil,
  Upload,
  X,
} from 'lucide-react';
import {
  Language,
  VaultDocumentItem,
  HouseholdMemberItem,
  formatHumanDate,
  readFileAsDataUrl,
} from '../../types/vault';
import { maskSensitiveNumber } from '../../utils/vaultLogic';
import { Button, StatusBadge } from '../ui/DesignSystem';
import { VaultMascot } from '../VaultMascot';

export const MemberDetailScreen = ({
  lang,
  member,
  docs,
  onBack,
  onSelectDoc,
  onAddDocForMember,
  onRenewDoc,
  onUpdateMember,
  onDeleteMember,
}: {
  lang: Language;
  member: HouseholdMemberItem;
  docs: VaultDocumentItem[];
  onBack: () => void;
  onSelectDoc: (id: string) => void;
  onAddDocForMember: (memberNameEn: string) => void;
  onRenewDoc: (id: string) => void;
  onUpdateMember: (updated: HouseholdMemberItem) => void;
  onDeleteMember: (id: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<
    'DOCUMENTS' | 'RENEWALS' | 'HISTORY'
  >('DOCUMENTS');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingDp, setIsUploadingDp] = useState(false);

  const dpInputRef = useRef<HTMLInputElement | null>(null);
  const modalDpInputRef = useRef<HTMLInputElement | null>(null);

  const memberCode = `KV#${member.id.replace(/\D/g, '').padStart(3, '0') || '001'}`;
  const isNri = `${member.location || ''} ${member.locEn || ''} ${member.relationEn || ''}`
    .toLowerCase()
    .match(/dubai|uae|nri|gulf|doha|sharjah/);
  const emailSlug = member.nameEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');

  const defaultEmail = member.email || `${emailSlug}@kudumba.in`;
  const defaultWhatsapp = member.whatsapp || member.phone || '+91 98470 33102';
  const defaultHomePhone = member.homePhone || '+91 484 234 9102';
  const defaultLocation =
    member.location ||
    (lang === 'ml' ? member.locMl : member.locEn) ||
    'Kochi';
  const defaultResidency =
    member.residencyStatus ||
    (isNri ? 'status: NRI (Gulf)' : 'status: Resident');
  const defaultHousehold =
    member.householdName || (lang === 'ml' ? 'വടക്കേതിൽ' : 'Vadakkethil');

  // Edit Modal Form State
  const [editNameEn, setEditNameEn] = useState(member.nameEn);
  const [editNameMl, setEditNameMl] = useState(member.nameMl);
  const [editRelationEn, setEditRelationEn] = useState(member.relationEn);
  const [editRelationMl, setEditRelationMl] = useState(member.relationMl);
  const [editHousehold, setEditHousehold] = useState(
    member.householdName || 'Vadakkethil'
  );
  const [editResidency, setEditResidency] = useState(defaultResidency);
  const [editRole, setEditRole] = useState<'OWNER' | 'EDITOR'>(
    member.role || (member.id === 'mem-1' || member.id === 'mem-2' ? 'OWNER' : 'EDITOR')
  );
  const [editLocation, setEditLocation] = useState(
    member.location || member.locEn || 'Kochi'
  );
  const [editEmail, setEditEmail] = useState(defaultEmail);
  const [editWhatsapp, setEditWhatsapp] = useState(defaultWhatsapp);
  const [editHomePhone, setEditHomePhone] = useState(defaultHomePhone);
  const [editAvatarDataUrl, setEditAvatarDataUrl] = useState<
    string | undefined
  >(member.avatarDataUrl);

  const openEditProfileModal = () => {
    setEditNameEn(member.nameEn);
    setEditNameMl(member.nameMl);
    setEditRelationEn(member.relationEn);
    setEditRelationMl(member.relationMl);
    setEditHousehold(member.householdName || 'Vadakkethil');
    setEditResidency(defaultResidency);
    setEditRole(
      member.role ||
        (member.id === 'mem-1' || member.id === 'mem-2' ? 'OWNER' : 'EDITOR')
    );
    setEditLocation(member.location || member.locEn || 'Kochi');
    setEditEmail(defaultEmail);
    setEditWhatsapp(defaultWhatsapp);
    setEditHomePhone(defaultHomePhone);
    setEditAvatarDataUrl(member.avatarDataUrl);
    setShowMenu(false);
    setIsEditModalOpen(true);
  };

  const handleDirectDpUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDp(true);
    try {
      const result = await readFileAsDataUrl(file);
      onUpdateMember({
        ...member,
        avatarDataUrl: result.dataUrl,
      });
    } catch {
      // Ignore file read errors
    } finally {
      setIsUploadingDp(false);
      e.target.value = '';
    }
  };

  const handleModalDpUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await readFileAsDataUrl(file);
      setEditAvatarDataUrl(result.dataUrl);
    } catch {
      // Ignore file read errors
    } finally {
      e.target.value = '';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNameEn = editNameEn.trim() || member.nameEn;
    const finalNameMl = editNameMl.trim() || finalNameEn;
    const finalRelEn = editRelationEn.trim() || member.relationEn;
    const finalRelMl = editRelationMl.trim() || finalRelEn;
    const computedInitials = finalNameEn
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('');

    onUpdateMember({
      ...member,
      nameEn: finalNameEn,
      nameMl: finalNameMl,
      relationEn: finalRelEn,
      relationMl: finalRelMl,
      householdName: editHousehold.trim() || 'Vadakkethil',
      residencyStatus: editResidency.trim() || 'status: Resident',
      role: editRole,
      location: editLocation.trim() || 'Kochi',
      locEn: editLocation.trim() || 'Kochi',
      email: editEmail.trim() || `${emailSlug}@kudumba.in`,
      phone: editWhatsapp.trim() || defaultWhatsapp,
      whatsapp: editWhatsapp.trim() || defaultWhatsapp,
      homePhone: editHomePhone.trim() || defaultHomePhone,
      initials: computedInitials || member.initials,
      avatarDataUrl: editAvatarDataUrl,
    });
    setIsEditModalOpen(false);
  };

  const memberDocs = docs.filter(
    (d) =>
      d.ownerEn
        .toLowerCase()
        .includes(member.nameEn.split(' ')[0].toLowerCase()) ||
      d.ownerEn.includes('All Family')
  );

  const validDocs = memberDocs.filter((d) => d.status === 'VALID');
  const dueSoonDocs = memberDocs.filter((d) => d.status === 'DUE_SOON');
  const expiredDocs = memberDocs.filter((d) => d.status === 'EXPIRED');
  const needsRenewalDocs = memberDocs.filter((d) => d.status !== 'VALID');

  const totalDocsCount = memberDocs.length;
  const healthPct =
    totalDocsCount > 0
      ? Math.round((validDocs.length / totalDocsCount) * 100)
      : 100;

  const displayedDocs =
    activeTab === 'RENEWALS' ? needsRenewalDocs : memberDocs;

  // Flatten renewal history across this member's documents
  const memberHistory = memberDocs.flatMap((doc) =>
    (doc.renewalHistory || []).map((h, idx) => ({
      id: h.id || `${doc.id}-rh-${idx}`,
      date: h.date,
      docTitleEn: doc.titleEn,
      docTitleMl: doc.titleMl,
      noteEn: h.actionEn || h.noteEn || 'Updated in Vault',
      noteMl: h.actionMl || h.noteMl || 'വോൾട്ടിൽ പുതുക്കി',
    }))
  );

  const toggleReveal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Mini gauge arc math for Card 3
  const arcRatio = totalDocsCount > 0 ? validDocs.length / totalDocsCount : 0;
  const arcAngle = Math.PI * (1 - arcRatio);
  const dotX = 40 + 28 * Math.cos(arcAngle);
  const dotY = 36 - 28 * Math.sin(arcAngle);

  return (
    <div className="space-y-6">
      {/* Hidden Direct DP File Input */}
      <input
        ref={dpInputRef}
        type="file"
        accept="image/*"
        onChange={handleDirectDpUpload}
        className="hidden"
      />

      {/* Top Header Bar (Matches Candidate Profile reference) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={lang === 'ml' ? 'തിരികെ പോവുക' : 'Back to Family Members'}
            className="spring-interactive flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-[#E03A45] bg-[#FFF5F5] text-[#E03A45] hover:bg-[#E03A45] hover:text-white transition-all cursor-pointer shadow-xs shrink-0"
          >
            <CornerUpLeft className="w-5 h-5 stroke-[2.3]" />
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B0B0C] font-malayalam">
            {lang === 'ml' ? 'കുടുംബാംഗത്തിന്റെ പ്രൊഫൈൽ' : 'Member Profile'}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Overflow ⋯ Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Member actions"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E8EC] bg-white text-[#5B6168] hover:text-[#0B0B0C] hover:bg-[#F4F5F7] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-[#E6E8EC] bg-white shadow-lg py-1.5 z-30">
                <button
                  type="button"
                  onClick={openEditProfileModal}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#0B0B0C] hover:bg-[#F4F5F7] flex items-center gap-2 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#0B0B0C]" />
                  <span>
                    {lang === 'ml' ? 'പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക' : 'Edit Profile & DP'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    dpInputRef.current?.click();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#0B0B0C] hover:bg-[#F4F5F7] flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#E03A45]" />
                  <span>
                    {lang === 'ml' ? 'ഫോട്ടോ മാറ്റുക (Upload DP)' : 'Upload / Change DP'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onAddDocForMember(member.nameEn);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#0B0B0C] hover:bg-[#F4F5F7] flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E03A45]" />
                  <span>
                    {lang === 'ml' ? 'രേഖ ചേർക്കുക' : 'Add New Document'}
                  </span>
                </button>
                {member.id !== 'mem-1' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDeleteMember(member.id);
                      onBack();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#B3121F] hover:bg-[#FDECEE] flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'ml' ? 'അംഗത്തെ നീക്കം ചെയ്യുക' : 'Remove Member'}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Outline Action Pill (Matches "Download Chest Card" button style) */}
          <button
            type="button"
            onClick={() => onAddDocForMember(member.nameEn)}
            className="spring-interactive inline-flex h-10 items-center gap-2 rounded-xl border border-[#E6E8EC] bg-white hover:border-[#0B0B0C] px-4 text-xs sm:text-sm font-bold text-[#0B0B0C] transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#0B0B0C]" />
            <span>
              {lang === 'ml' ? '+ പുതിയ രേഖ ചേർക്കുക' : 'Add Document Card'}
            </span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split Layout: Left Profile Card + Right KPI Cards & Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR: Member Identity, DP Upload, Overview & Personal Details */}
        <div className="lg:col-span-3 rounded-[24px] bg-[#F8F9FA] border border-[#E6E8EC] p-6">
          {/* Large Coral Circle Avatar / Uploaded DP with Camera Overlay Button */}
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              {member.avatarDataUrl ? (
                <img
                  src={member.avatarDataUrl}
                  alt={member.nameEn}
                  referrerPolicy="no-referrer"
                  onClick={() => dpInputRef.current?.click()}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#FDECEE] shadow-2xs cursor-pointer"
                />
              ) : (
                <div
                  onClick={() => dpInputRef.current?.click()}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#EB4D4B] text-white text-4xl font-bold flex items-center justify-center border-4 border-[#FDECEE] shadow-2xs select-none cursor-pointer"
                >
                  {member.initials || member.nameEn.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Hover dark tint for quick DP change */}
              <button
                type="button"
                onClick={() => dpInputRef.current?.click()}
                aria-label={lang === 'ml' ? 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക' : 'Upload profile photo'}
                title={lang === 'ml' ? 'ഫോട്ടോ മാറ്റുക' : 'Upload / Change DP'}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>{isUploadingDp ? '...' : lang === 'ml' ? 'ഫോട്ടോ' : 'Upload DP'}</span>
              </button>

              {/* Floating Bottom-Right Camera Badge */}
              <button
                type="button"
                onClick={() => dpInputRef.current?.click()}
                aria-label={lang === 'ml' ? 'ഫോട്ടോ മാറ്റുക' : 'Upload DP'}
                title={lang === 'ml' ? 'ഫോട്ടോ മാറ്റുക' : 'Upload DP'}
                className="absolute bottom-0.5 right-0.5 h-9 w-9 rounded-full bg-[#0B0B0C] hover:bg-[#EB4D4B] text-white border-2 border-white shadow-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-[#0B0B0C] font-malayalam">
              {lang === 'ml' ? member.nameMl : member.nameEn}
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-[#8A949E]">
              {lang === 'ml' ? `അംഗം ${memberCode}` : `Vault ${memberCode}`}
            </p>

            {/* Quick Action Pills: Edit Profile + Upload DP */}
            <div className="mt-3.5 flex items-center justify-center gap-2 w-full">
              <button
                type="button"
                onClick={openEditProfileModal}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E6E8EC] bg-white hover:border-[#0B0B0C] px-3 py-2 text-xs font-bold text-[#0B0B0C] transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-[#EB4D4B]" />
                <span>{lang === 'ml' ? 'എഡിറ്റ്' : 'Edit Profile'}</span>
              </button>
              <button
                type="button"
                onClick={() => dpInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E6E8EC] bg-white hover:border-[#0B0B0C] px-3 py-2 text-xs font-bold text-[#5B6168] hover:text-[#0B0B0C] transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#5B6168]" />
                <span>{lang === 'ml' ? 'DP' : 'Upload DP'}</span>
              </button>
            </div>
          </div>

          <hr className="my-5 border-[#E6E8EC]" />

          {/* OVERVIEW Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#5B6168]">
                {lang === 'ml' ? 'ഒറ്റനോട്ടത്തിൽ' : 'OVERVIEW'}
              </h3>
              <button
                type="button"
                onClick={openEditProfileModal}
                aria-label="Edit overview"
                className="text-[11px] font-bold text-[#EB4D4B] hover:underline cursor-pointer"
              >
                {lang === 'ml' ? 'മാറ്റുക' : 'Edit'}
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[#5B6168]">
                  <Users className="w-3.5 h-3.5 text-[#8A949E]" />
                  <span>{lang === 'ml' ? 'കുടുംബം' : 'Household'}</span>
                </span>
                <span className="font-semibold text-[#0B0B0C] truncate">
                  {defaultHousehold}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[#5B6168]">
                  <Layers className="w-3.5 h-3.5 text-[#8A949E]" />
                  <span>{lang === 'ml' ? 'ബന്ധം' : 'Relation'}</span>
                </span>
                <span className="font-semibold text-[#0B0B0C] font-malayalam">
                  {lang === 'ml' ? member.relationMl : member.relationEn}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[#5B6168]">
                  <Layers className="w-3.5 h-3.5 text-[#8A949E]" />
                  <span>{lang === 'ml' ? 'വിഭാഗം' : 'Residency'}</span>
                </span>
                <span className="font-semibold text-[#0B0B0C] truncate max-w-[140px]">
                  {defaultResidency}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[#5B6168]">
                  <Hash className="w-3.5 h-3.5 text-[#8A949E]" />
                  <span>{lang === 'ml' ? 'വോൾട്ട് ഐഡി' : 'Vault ID'}</span>
                </span>
                <span className="font-semibold text-[#0B0B0C] tabular-nums">
                  {memberCode}
                </span>
              </div>
            </div>
          </div>

          <hr className="my-5 border-[#E6E8EC]" />

          {/* PERSONAL DETAILS Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#5B6168]">
                {lang === 'ml' ? 'വ്യക്തിഗത വിവരങ്ങൾ' : 'PERSONAL DETAILS'}
              </h3>
              <button
                type="button"
                onClick={openEditProfileModal}
                aria-label="Edit personal details"
                className="text-[11px] font-bold text-[#EB4D4B] hover:underline cursor-pointer"
              >
                {lang === 'ml' ? 'മാറ്റുക' : 'Edit'}
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[#5B6168]">
                  <MapPin className="w-3.5 h-3.5 text-[#8A949E]" />
                  <span>{lang === 'ml' ? 'സ്ഥലം' : 'Location'}</span>
                </span>
                <span className="font-semibold text-[#0B0B0C] truncate max-w-[130px]">
                  {defaultLocation}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[#5B6168]">
                  <Mail className="w-3.5 h-3.5 text-[#8A949E]" />
                  <span>{lang === 'ml' ? 'ഇമെയിൽ' : 'Email'}</span>
                </span>
                <span className="font-semibold text-[#0B0B0C] truncate max-w-[130px]">
                  {defaultEmail}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[#5B6168]">
                  <Phone className="w-3.5 h-3.5 text-[#8A949E]" />
                  <span>WhatsApp</span>
                </span>
                <span className="font-semibold text-[#0B0B0C] tabular-nums">
                  {defaultWhatsapp}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[#5B6168]">
                  <Phone className="w-3.5 h-3.5 text-[#8A949E]" />
                  <span className="truncate">
                    {lang === 'ml' ? 'ഹോം ഫോൺ' : 'Home Line'}
                  </span>
                </span>
                <span className="font-semibold text-[#0B0B0C] tabular-nums">
                  {defaultHomePhone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT AREA: 4 KPI Cards + Underline Tabs + Tab Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* 4-Card KPI Strip (Exact visual match to Candidate Profile reference) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 1: TOTAL DOCUMENTS */}
            <div className="rounded-[22px] bg-[#F8F9FA] border border-[#E6E8EC] p-5 flex flex-col justify-between min-h-[128px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6168]">
                {lang === 'ml' ? 'ആകെ രേഖകൾ' : 'TOTAL DOCUMENTS'}
              </span>

              <div className="mt-4 flex items-end justify-between gap-2">
                <div className="inline-flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-[#0B0B0C] tabular-nums">
                    {totalDocsCount}
                  </span>
                  <span className="text-xs font-semibold text-[#5B6168]">
                    {lang === 'ml' ? 'രേഖകൾ' : 'docs'}
                  </span>
                  <ArrowUp className="w-3.5 h-3.5 text-[#EB4D4B] self-center" />
                </div>

                {/* 3 mini pill dots */}
                <div className="flex items-center gap-1 pb-1">
                  <span
                    className={`h-1.5 w-2.5 rounded-full ${
                      totalDocsCount >= 1 ? 'bg-[#EB4D4B]' : 'bg-[#D0D5DD]'
                    }`}
                  />
                  <span
                    className={`h-1.5 w-2.5 rounded-full ${
                      totalDocsCount >= 2 ? 'bg-[#EB4D4B]' : 'bg-[#D0D5DD]'
                    }`}
                  />
                  <span
                    className={`h-1.5 w-2.5 rounded-full ${
                      totalDocsCount >= 3 ? 'bg-[#EB4D4B]' : 'bg-[#D0D5DD]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: VAULT HEALTH PERCENTAGE */}
            <div className="rounded-[22px] bg-[#F8F9FA] border border-[#E6E8EC] p-5 flex flex-col justify-between min-h-[128px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6168]">
                {lang === 'ml' ? 'വോൾട്ട് നിലവാരം' : 'TOTAL HEALTH'}
              </span>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#0B0B0C] tabular-nums">
                    {healthPct}%
                  </span>
                  <ArrowUp className="w-3.5 h-3.5 text-[#EB4D4B] self-center" />
                </div>

                {/* Red line with circle thumb */}
                <div className="relative flex items-center w-20 pb-2">
                  <div className="h-[2px] w-full bg-[#EB4D4B] rounded-full" />
                  <span
                    style={{ left: `${Math.min(92, Math.max(8, healthPct))}%` }}
                    className="absolute -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-[#EB4D4B] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: VALID DOCUMENTS (with semicircular gauge) */}
            <div className="rounded-[22px] bg-[#F8F9FA] border border-[#E6E8EC] p-5 flex flex-col justify-between min-h-[128px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6168]">
                {lang === 'ml' ? 'സാധുവായ രേഖകൾ' : 'VALID DOCUMENTS'}
              </span>

              <div className="mt-2 flex items-end justify-between gap-2">
                <div>
                  <div className="inline-flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#0B0B0C] tabular-nums">
                      {validDocs.length}
                    </span>
                    <ArrowUp className="w-3.5 h-3.5 text-[#EB4D4B] self-center" />
                  </div>
                  <p className="text-[11px] font-medium text-[#5B6168] mt-1 tabular-nums">
                    {validDocs.length} valid · {dueSoonDocs.length} due soon
                  </p>
                </div>

                {/* Mini Semicircular Arc SVG */}
                <svg
                  viewBox="0 0 80 44"
                  className="w-18 h-11 overflow-visible shrink-0"
                >
                  <path
                    d="M 12 36 A 28 28 0 0 1 68 36"
                    fill="none"
                    stroke="#E2E5EA"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={dotX}
                    cy={dotY}
                    r="3.5"
                    fill="#FFFFFF"
                    stroke="#EB4D4B"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>

            {/* Card 4: NEEDS RENEWAL */}
            <div className="rounded-[22px] bg-[#F8F9FA] border border-[#E6E8EC] p-5 flex flex-col justify-between min-h-[128px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6168]">
                {lang === 'ml' ? 'പുതുക്കേണ്ടവ' : 'NEEDS RENEWAL'}
              </span>

              <div className="mt-4 flex items-end justify-between gap-2">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#0B0B0C] tabular-nums">
                    {needsRenewalDocs.length}
                  </span>
                  <ArrowUp className="w-3.5 h-3.5 text-[#EB4D4B] self-center" />
                </div>

                {/* 3 mini red slashed badges */}
                <div className="flex items-center gap-1 pb-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`inline-flex h-2.5 w-3 items-center justify-center rounded-[3px] border text-[8px] font-bold leading-none ${
                        i < needsRenewalDocs.length
                          ? 'border-[#EB4D4B] bg-[#FDECEE] text-[#EB4D4B]'
                          : 'border-[#EB4D4B]/50 text-[#EB4D4B]/60'
                      }`}
                    >
                      /
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Underline Tabs Row (Matches Programs | Results | Adjustments) */}
          <div className="border-b border-[#E6E8EC] flex items-center justify-between gap-4">
            <div className="flex items-center gap-6 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('DOCUMENTS')}
                className={`pb-3 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                  activeTab === 'DOCUMENTS'
                    ? 'border-[#EB4D4B] text-[#EB4D4B]'
                    : 'border-transparent text-[#5B6168] hover:text-[#0B0B0C]'
                }`}
              >
                {lang === 'ml'
                  ? `രേഖകൾ (${memberDocs.length})`
                  : `Documents (${memberDocs.length})`}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('RENEWALS')}
                className={`pb-3 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                  activeTab === 'RENEWALS'
                    ? 'border-[#EB4D4B] text-[#EB4D4B]'
                    : 'border-transparent text-[#5B6168] hover:text-[#0B0B0C]'
                }`}
              >
                {lang === 'ml'
                  ? `പുതുക്കേണ്ടവ (${needsRenewalDocs.length})`
                  : `Needs Renewal (${needsRenewalDocs.length})`}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('HISTORY')}
                className={`pb-3 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                  activeTab === 'HISTORY'
                    ? 'border-[#EB4D4B] text-[#EB4D4B]'
                    : 'border-transparent text-[#5B6168] hover:text-[#0B0B0C]'
                }`}
              >
                {lang === 'ml'
                  ? `പുതുക്കൽ ചരിത്രം (${memberHistory.length})`
                  : `Renewal History (${memberHistory.length})`}
              </button>
            </div>
          </div>

          {/* Tab Panel Content */}
          {activeTab === 'HISTORY' ? (
            memberHistory.length === 0 ? (
              <div className="py-14 flex flex-col items-center justify-center text-center">
                <VaultMascot pose="pointing" size="md" />
                <h3 className="mt-5 text-lg font-extrabold text-[#0B0B0C]">
                  {lang === 'ml'
                    ? 'പുതുക്കൽ രേഖകളൊന്നും കണ്ടെത്തിയില്ല.'
                    : 'No renewal logs found.'}
                </h3>
                <button
                  type="button"
                  onClick={() => onAddDocForMember(member.nameEn)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#EB4D4B] hover:bg-[#E03A45] text-white px-5 py-2.5 text-sm font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {lang === 'ml' ? 'രേഖ ചേർക്കുക' : 'Add Document'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {memberHistory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-[#E6E8EC] bg-[#F8F9FA] p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#E6E8EC] flex items-center justify-center text-[#EB4D4B] shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0B0B0C] font-malayalam">
                          {lang === 'ml' ? item.docTitleMl : item.docTitleEn}
                        </p>
                        <p className="text-xs text-[#5B6168] mt-0.5 font-malayalam">
                          {lang === 'ml' ? item.noteMl : item.noteEn}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#5B6168] tabular-nums shrink-0">
                      {formatHumanDate(item.date, lang)}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : displayedDocs.length === 0 ? (
            /* Centered Mascot Empty State (Exact match to "No programme registrations found" in reference) */
            <div className="py-14 flex flex-col items-center justify-center text-center">
              <VaultMascot pose="pointing" size="md" />
              <h3 className="mt-5 text-lg font-extrabold text-[#0B0B0C]">
                {activeTab === 'RENEWALS'
                  ? lang === 'ml'
                    ? 'ഉടൻ പുതുക്കേണ്ട രേഖകളൊന്നുമില്ല.'
                    : 'No pending document renewals found.'
                  : lang === 'ml'
                  ? 'രേഖകളൊന്നും ചേർത്തിട്ടില്ല.'
                  : 'No document registrations found.'}
              </h3>
              <button
                type="button"
                onClick={() => onAddDocForMember(member.nameEn)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#EB4D4B] hover:bg-[#E03A45] text-white px-5 py-2.5 text-sm font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {lang === 'ml' ? 'രേഖ ചേർക്കുക' : 'Add Document'}
                </span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedDocs.map((doc) => {
                const isRevealed = !!revealedIds[doc.id];
                const displayNum = isRevealed
                  ? doc.docNumber
                  : maskSensitiveNumber(doc.docNumber);

                return (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    className="rounded-[22px] border border-[#E6E8EC] bg-[#F8F9FA] hover:bg-white hover:border-[#EB4D4B] p-5 transition-all flex flex-col justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <StatusBadge
                          status={doc.status}
                          daysText={
                            lang === 'ml' ? doc.daysTextMl : doc.daysTextEn
                          }
                        />
                        <span className="text-xs font-semibold text-[#5B6168] tabular-nums">
                          {doc.expiryDate !== 'Lifetime'
                            ? `${lang === 'ml' ? 'കാലാവധി:' : 'Expires:'} ${formatHumanDate(doc.expiryDate, lang)}`
                            : lang === 'ml'
                            ? 'ആജീവനാന്തം'
                            : 'Lifetime'}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#0B0B0C] font-malayalam mt-2">
                        {lang === 'ml' ? doc.titleMl : doc.titleEn}
                      </h3>
                      <p className="text-xs text-[#5B6168] font-malayalam mt-0.5">
                        {lang === 'ml'
                          ? doc.authorityMl || doc.subMl
                          : doc.authorityEn || doc.subEn}
                      </p>

                      <div className="mt-4 flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-[#E6E8EC]">
                        <span className="text-sm font-bold text-[#0B0B0C] font-mono-tabular">
                          {displayNum}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleReveal(doc.id, e)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EB4D4B] hover:underline cursor-pointer"
                        >
                          {isRevealed ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                          {isRevealed
                            ? lang === 'ml'
                              ? 'മറയ്ക്കുക'
                              : 'Hide'
                            : lang === 'ml'
                            ? 'കാണുക'
                            : 'Show'}
                        </button>
                      </div>
                    </div>

                    {doc.status !== 'VALID' && (
                      <div className="pt-3 border-t border-[#E6E8EC] flex justify-end">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRenewDoc(doc.id);
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#0F7B3E]" />
                          {lang === 'ml'
                            ? '+1 വർഷം പുതുക്കുക'
                            : 'Mark Renewed (+1 Yr)'}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile & Upload DP Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-t-[24px] md:rounded-[24px] border border-[#E6E8EC] w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E8EC]">
              <div>
                <h3 className="text-lg font-extrabold text-[#0B0B0C] font-malayalam">
                  {lang === 'ml'
                    ? 'പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക'
                    : 'Edit Member Profile & DP'}
                </h3>
                <p className="text-xs text-[#5B6168]">
                  {lang === 'ml'
                    ? 'ഫോട്ടോയും വ്യക്തിഗത വിവരങ്ങളും മാറ്റുക'
                    : `Update profile picture, overview and contact details (${memberCode})`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Close modal"
                className="w-10 h-10 rounded-full bg-[#F4F5F7] border border-[#E6E8EC] flex items-center justify-center text-[#0B0B0C] hover:bg-[#E6E8EC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleSaveProfile}
              className="p-6 space-y-5 overflow-y-auto flex-1"
            >
              {/* DP Upload & Preview Section */}
              <div className="rounded-2xl bg-[#F8F9FA] border border-[#E6E8EC] p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative shrink-0">
                  {editAvatarDataUrl ? (
                    <img
                      src={editAvatarDataUrl}
                      alt={editNameEn || member.nameEn}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full object-cover border-4 border-[#FDECEE] shadow-2xs"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#EB4D4B] text-white text-2xl font-bold flex items-center justify-center border-4 border-[#FDECEE] select-none">
                      {(editNameEn || member.nameEn)
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p) => p[0]?.toUpperCase())
                        .join('') || member.initials}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-bold text-[#0B0B0C]">
                    {lang === 'ml' ? 'പ്രൊഫൈൽ ചിത്രം (DP)' : 'Profile Picture (DP)'}
                  </p>
                  <p className="text-xs text-[#5B6168] mt-0.5">
                    {lang === 'ml'
                      ? 'JPG, PNG അല്ലെങ്കിൽ WEBP ചിത്രം തിരഞ്ഞെടുക്കുക'
                      : 'Upload a clear portrait photo (JPG, PNG, WEBP). Auto-compressed for offline vault storage.'}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <input
                      ref={modalDpInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleModalDpUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => modalDpInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#EB4D4B] hover:bg-[#E03A45] text-white px-3.5 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'ml' ? 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക' : 'Upload Photo'}
                      </span>
                    </button>
                    {editAvatarDataUrl && (
                      <button
                        type="button"
                        onClick={() => setEditAvatarDataUrl(undefined)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E8EC] bg-white hover:bg-[#FDECEE] hover:text-[#B3121F] px-3 py-2 text-xs font-semibold text-[#5B6168] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>
                          {lang === 'ml' ? 'ഒഴിവാക്കുക' : 'Remove Photo'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name Fields (EN & ML) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'പേര് (English)' : 'Full Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    placeholder="e.g., Rahul Nair"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'പേര് (മലയാളം)' : 'Name (Malayalam)'}
                  </label>
                  <input
                    type="text"
                    value={editNameMl}
                    onChange={(e) => setEditNameMl(e.target.value)}
                    placeholder="ഉദാ: രാഹുൽ നായർ"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] font-malayalam focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
              </div>

              {/* Overview Fields: Household, Relation, Residency, Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'കുടുംബപ്പേര്' : 'Household'}
                  </label>
                  <input
                    type="text"
                    value={editHousehold}
                    onChange={(e) => setEditHousehold(e.target.value)}
                    placeholder="e.g., Vadakkethil"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'ബന്ധം (English)' : 'Relation'}
                  </label>
                  <input
                    type="text"
                    value={editRelationEn}
                    onChange={(e) => setEditRelationEn(e.target.value)}
                    placeholder="e.g., Son (NRI)"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'വിഭാഗം (Residency)' : 'Residency Status'}
                  </label>
                  <input
                    type="text"
                    value={editResidency}
                    onChange={(e) => setEditResidency(e.target.value)}
                    placeholder="e.g., status: NRI (Gulf)"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'വോൾട്ട് റോൾ' : 'Vault Access Role'}
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) =>
                      setEditRole(e.target.value as 'OWNER' | 'EDITOR')
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] focus:outline-none focus:border-[#EB4D4B]"
                  >
                    <option value="OWNER">OWNER (Full Vault Control)</option>
                    <option value="EDITOR">EDITOR (Can Add & Renew)</option>
                  </select>
                </div>
              </div>

              {/* Personal Details: Location, Email, WhatsApp, Home Line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'സ്ഥലം' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g., Dubai, UAE (NRI)"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'ഇമെയിൽ' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="e.g., rahul.nair@kudumba.in"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    placeholder="e.g., +971 50 482 9104"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6168] mb-1.5">
                    {lang === 'ml' ? 'ഹോം ഫോൺ' : 'Home Line'}
                  </label>
                  <input
                    type="text"
                    value={editHomePhone}
                    onChange={(e) => setEditHomePhone(e.target.value)}
                    placeholder="e.g., +91 484 234 9102"
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E6E8EC] text-sm font-semibold text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#EB4D4B]"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6E8EC]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  {lang === 'ml' ? 'റദ്ദാക്കുക' : 'Cancel'}
                </Button>
                <Button type="submit" variant="primary">
                  {lang === 'ml' ? 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

