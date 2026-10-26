import React from 'react';
import { Plus, Phone, ArrowRight } from 'lucide-react';
import {
  Language,
  VaultDocumentItem,
  HouseholdMemberItem,
} from '../../types/vault';

const SOLID_AVATAR_COLORS: Record<string, string> = {
  'mem-1': '#E03A45',
  'mem-2': '#1E4FD8',
  'mem-3': '#0F7B3E',
  'mem-4': '#A85A00',
};

const DEFAULT_PHONES: Record<string, string> = {
  'mem-1': '+971 50 849 2014',
  'mem-2': '+91 94470 44210',
  'mem-3': '+91 94471 22334',
  'mem-4': '+971 52 334 9912',
};

const DEFAULT_LOCATIONS_EN: Record<string, string> = {
  'mem-1': 'Dubai, UAE (NRI)',
  'mem-2': 'Kochi, Kerala (Parents)',
  'mem-3': 'Kochi, Kerala (Tharavadu)',
  'mem-4': 'Dubai / Kochi',
};

const DEFAULT_ROLES: Record<string, 'OWNER' | 'EDITOR'> = {
  'mem-1': 'OWNER',
  'mem-2': 'OWNER',
  'mem-3': 'EDITOR',
  'mem-4': 'EDITOR',
};

export const PeopleGridScreen = ({
  lang,
  members,
  docs,
  onSelectMember,
  onOpenAddMember,
}: {
  lang: Language;
  members: HouseholdMemberItem[];
  docs: VaultDocumentItem[];
  onSelectMember: (id: string) => void;
  onSelectDoc?: (id: string) => void;
  onOpenAddMember: () => void;
  onAddDocForMember?: (nameEn: string) => void;
}) => {
  const getMemberDocCount = (m: HouseholdMemberItem, idx: number) => {
    const matched = docs.filter(
      (d) =>
        d.ownerEn
          .toLowerCase()
          .includes(m.nameEn.split(' ')[0].toLowerCase()) ||
        d.ownerEn.includes('All Family')
    ).length;
    if (matched > 0) return matched;
    return [5, 4, 3, 3][idx % 4] || 1;
  };

  return (
    <div className="space-y-7">
      {/* Top Section Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-[32px] font-extrabold tracking-tight text-[#0B0B0C] font-malayalam">
            {lang === 'ml'
              ? 'കുടുംബാംഗങ്ങളും ചുമതലകളും'
              : 'Household Members & Roles'}
          </h2>
          <p className="text-sm sm:text-base text-[#5B6168] mt-1 font-malayalam">
            {lang === 'ml'
              ? 'കേരളത്തിലും ഗൾഫിലുമുള്ള കുടുംബാംഗങ്ങളുടെ പ്രൊഫൈലുകൾ നിയന്ത്രിക്കുക. കൂടുതൽ വിവരങ്ങൾക്ക് കാർഡിൽ ക്ലിക്ക് ചെയ്യുക.'
              : 'Manage family profiles across Kerala and the Gulf with role-based access. Tap any card for full details.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddMember}
          className="spring-interactive inline-flex items-center justify-center gap-2 rounded-full bg-[#E03A45] hover:bg-[#C42F3A] text-white px-6 py-3.5 text-sm font-bold shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>
            {lang === 'ml'
              ? '+ കുടുംബാംഗത്തെ ചേർക്കുക'
              : '+ Add Family Member'}
          </span>
        </button>
      </div>

      {/* 4-Column Member Cards Grid + Dashed "+ Add Member" Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {members.map((m, idx) => {
          const role =
            m.role || DEFAULT_ROLES[m.id] || (idx < 2 ? 'OWNER' : 'EDITOR');
          const isOwner = role === 'OWNER';
          const docCount = getMemberDocCount(m, idx);
          const avatarColor =
            SOLID_AVATAR_COLORS[m.id] ||
            m.colorHex ||
            ['#E03A45', '#1E4FD8', '#0F7B3E', '#A85A00'][idx % 4];
          const phoneStr =
            m.whatsapp || m.phone || DEFAULT_PHONES[m.id] || '+91 98470 33102';
          const locationStr =
            lang === 'ml'
              ? m.locMl || m.location || 'കൊച്ചി, കേരളം'
              : m.location ||
                DEFAULT_LOCATIONS_EN[m.id] ||
                m.locEn ||
                'Kochi, Kerala';

          return (
            <div
              key={m.id}
              onClick={() => onSelectMember(m.id)}
              className="group rounded-[22px] border border-[#E6E8EC] bg-white hover:border-[#E03A45]/50 hover:shadow-md p-5 sm:p-6 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Top Identity Row */}
                <div className="flex items-center gap-3.5">
                  {m.avatarDataUrl ? (
                    <img
                      src={m.avatarDataUrl}
                      alt={m.nameEn}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-[16px] object-cover shrink-0 border border-[#E6E8EC]"
                    />
                  ) : (
                    <div
                      className="w-13 h-13 rounded-[16px] flex items-center justify-center font-extrabold text-base text-white shrink-0 select-none"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {m.initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-[17px] font-extrabold text-[#0B0B0C] truncate font-malayalam">
                      {lang === 'ml' ? m.nameMl : m.nameEn}
                    </h3>
                    <p className="text-xs font-medium text-[#5B6168] truncate mt-0.5 font-malayalam">
                      {locationStr}
                    </p>
                  </div>
                </div>

                {/* Phone Number Row */}
                <div className="mt-4 flex items-center gap-2 text-xs text-[#5B6168] font-mono-tabular">
                  <Phone className="w-3.5 h-3.5 text-[#5B6168] shrink-0" />
                  <span>{phoneStr}</span>
                </div>

                <hr className="my-4 border-[#F0F1F4]" />

                {/* Role Badge + Document Count Row */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${
                      isOwner
                        ? 'bg-[#FDECEE] text-[#E03A45]'
                        : 'bg-[#E4F7EC] text-[#0F7B3E]'
                    }`}
                  >
                    {role}
                  </span>

                  <span className="text-xs font-bold text-[#4A5056] tabular-nums">
                    {lang === 'ml'
                      ? `${docCount} രേഖകൾ`
                      : `${docCount} documents`}
                  </span>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-5 flex items-center justify-between text-xs font-extrabold text-[#E03A45] group-hover:translate-x-0.5 transition-transform">
                <span>
                  {lang === 'ml'
                    ? 'വിവരങ്ങളും ചുമതലയും കാണുക'
                    : 'View Details & Role'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </div>
            </div>
          );
        })}

        {/* Dashed "+ Add Member" Card */}
        <button
          type="button"
          onClick={onOpenAddMember}
          className="rounded-[22px] border-2 border-dashed border-[#E6E8EC] bg-[#FAFAFB] hover:bg-white hover:border-[#E03A45] p-6 flex flex-col items-center justify-center text-center min-h-[210px] transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full bg-[#FDECEE] text-[#E03A45] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-sm font-extrabold text-[#0B0B0C]">
            {lang === 'ml' ? '+ അംഗത്തെ ചേർക്കുക' : '+ Add Member'}
          </span>
          <span className="text-xs font-medium text-[#8A949E] mt-1">
            {lang === 'ml' ? 'ചുമതലയും സ്ഥലവും സഹിതം' : 'With role & location'}
          </span>
        </button>
      </div>
    </div>
  );
};
