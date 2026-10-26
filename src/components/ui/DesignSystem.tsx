import React from 'react';
import {
  XCircle,
  Clock,
  CheckCircle2,
  Search,
  Home,
  FolderLock,
  Users,
  Wrench,
  Share2,
  Settings,
  Plus,
  Download,
  X,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react';
import { VaultMascot } from '../VaultMascot';

/* ==========================================================================
   1. BUTTON
      Uses original Kudumba Vault / Festie colour tokens:
      - primary: --brand-coral-deep (#E03A45, hover #C42F3A)
      - dark: --ink (#0B0B0C)
      - outline / outline-ink / secondary: white / soft gray (#F4F5F7) with #E6E8EC border
   ========================================================================== */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'saffron'
    | 'dark'
    | 'secondary'
    | 'outline'
    | 'outline-white'
    | 'outline-ink'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const base =
    'spring-interactive inline-flex items-center justify-center gap-2 rounded-full font-semibold cursor-pointer select-none';
  const padding =
    size === 'lg'
      ? 'min-h-[52px] px-7 py-3.5 text-base'
      : size === 'sm'
      ? 'min-h-[42px] px-4 py-2 text-base'
      : 'min-h-[48px] px-5 py-2.5 text-base';

  const variants = {
    primary: 'bg-[#E03A45] text-white hover:bg-[#C42F3A] shadow-xs',
    saffron: 'bg-[#E03A45] text-white hover:bg-[#C42F3A] shadow-xs',
    dark: 'bg-[#0B0B0C] text-white hover:bg-[#222428] shadow-xs',
    secondary:
      'bg-[#F4F5F7] text-[#0B0B0C] border border-[#E6E8EC] hover:border-[#0B0B0C] hover:bg-white',
    outline:
      'bg-white text-[#0B0B0C] border border-[#E6E8EC] hover:border-[#0B0B0C] hover:bg-[#F4F5F7]',
    'outline-white':
      'bg-white text-[#0B0B0C] border-2 border-white hover:bg-[#F4F5F7] shadow-xs',
    'outline-ink':
      'bg-white text-[#0B0B0C] border border-[#E6E8EC] hover:border-[#0B0B0C] hover:bg-[#F4F5F7]',
    danger:
      'bg-[#FDECEE] text-[#B3121F] border border-[#B3121F]/30 hover:bg-[#B3121F] hover:text-white',
  };

  return (
    <button
      type="button"
      className={`${base} ${padding} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/* ==========================================================================
   2. CHIP (999px pill filter / category selector with 48px tap target, 16px text)
   ========================================================================== */
interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  label?: string;
  count?: number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  onClick,
  label,
  count,
  icon,
  children,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`spring-interactive inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-4 py-2 text-base font-medium whitespace-nowrap shrink-0 cursor-pointer ${
        active
          ? 'bg-[#E03A45] text-white font-semibold shadow-xs'
          : 'bg-[#F4F5F7] text-[#5B6168] border border-[#E6E8EC] hover:border-[#0B0B0C] hover:text-[#0B0B0C]'
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label ? <span>{label}</span> : children}
      {typeof count === 'number' && (
        <span
          className={`px-2 py-0.5 rounded-full text-sm font-semibold ${
            active
              ? 'bg-white/20 text-white'
              : 'bg-white text-[#5B6168]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

/* ==========================================================================
   3. STATUS BADGE (Never relies on colour alone: always Icon + 16px Text)
      - Expired: #B3121F on #FDECEE, icon x-circle
      - Due soon: #A85A00 on #FFF4D6, icon clock
      - Valid / Paid: #0F7B3E on #E4F7EC, icon check-circle
   ========================================================================== */
export type DocStatusType = 'EXPIRED' | 'DUE_SOON' | 'VALID';

interface StatusBadgeProps {
  status: DocStatusType;
  daysRemaining?: number | null;
  daysText?: string;
  lang?: 'ml' | 'en';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  daysRemaining,
  daysText,
  lang = 'en',
}) => {
  if (status === 'EXPIRED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEE] border border-[#B3121F]/25 px-3.5 py-1 text-base font-semibold text-[#B3121F]">
        <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {daysText ||
            (lang === 'ml'
              ? daysRemaining && daysRemaining < 0
                ? `കാലാവധി കഴിഞ്ഞു (${Math.abs(daysRemaining)} ദിവസം)`
                : 'കാലാവധി കഴിഞ്ഞു'
              : daysRemaining && daysRemaining < 0
              ? `Expired (${Math.abs(daysRemaining)}d ago)`
              : 'Expired')}
        </span>
      </span>
    );
  }

  if (status === 'DUE_SOON') {
    const d = daysRemaining ?? 14;
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] border border-[#A85A00]/25 px-3.5 py-1 text-base font-semibold text-[#A85A00]">
        <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {daysText ||
            (lang === 'ml'
              ? `${d} ദിവസത്തിനുള്ളിൽ അവസാനിക്കും`
              : `Due in ${d} days`)}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7EC] border border-[#0F7B3E]/25 px-3.5 py-1 text-base font-semibold text-[#0F7B3E]">
      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{daysText || (lang === 'ml' ? 'സാധുവാണ്' : 'Valid')}</span>
    </span>
  );
};

/* ==========================================================================
   4. CARD (Soft Gray #F4F5F7 or White #FFFFFF rounded card with #E6E8EC border)
   ========================================================================== */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  white?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  white = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-[22px] border border-[#E6E8EC] ${
        white ? 'bg-white' : 'bg-[#F4F5F7]'
      } p-5 sm:p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

/* ==========================================================================
   5. GAUGE (Semicircular progress gauge with sunny yellow #EFC94C fill)
   ========================================================================== */
interface GaugeProps {
  score: number;
  title: string;
  subtitle: string;
  onAction?: () => void;
}

export const Gauge: React.FC<GaugeProps> = ({
  score,
  title,
  subtitle,
  onAction,
}) => {
  const clamped = Math.max(0, Math.min(100, score));
  const rad = Math.PI * (1 - clamped / 100);
  const cx = 100 + 70 * Math.cos(rad);
  const cy = 95 - 70 * Math.sin(rad);

  return (
    <Card className="flex flex-col justify-between h-full">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[18px] font-semibold text-[#0B0B0C]">{title}</h3>
          <p className="mt-1 tabular-nums text-3xl font-bold text-[#0B0B0C]">
            {clamped}
            <span className="text-base font-normal text-[#5B6168]"> /100</span>
          </p>
        </div>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            aria-label={title}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E03A45] text-white hover:bg-[#C42F3A] cursor-pointer shrink-0"
          >
            <ArrowUpRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="my-3 flex justify-center">
        <svg viewBox="0 0 200 110" className="w-48 h-28 overflow-visible">
          <path
            d="M 30 95 A 70 70 0 0 1 170 95"
            fill="none"
            stroke="#E6E8EC"
            strokeWidth="22"
            strokeDasharray="3 5"
          />
          <path
            d={`M 30 95 A 70 70 0 0 1 ${cx.toFixed(1)} ${cy.toFixed(1)}`}
            fill="none"
            stroke="#EFC94C"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <circle
            cx={cx}
            cy={cy}
            r="9"
            fill="#FFFFFF"
            stroke="#0B0B0C"
            strokeWidth="5"
          />
        </svg>
      </div>

      <p className="text-center text-base text-[#5B6168]">{subtitle}</p>
    </Card>
  );
};

/* ==========================================================================
   6. SEARCH PILL ("Search workers, documents, people…", hides Ctrl K on mobile)
   ========================================================================== */
interface SearchPillProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

export const SearchPill: React.FC<SearchPillProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="relative w-full max-w-md flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#5B6168]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-h-[46px] rounded-full border border-[#E6E8EC] bg-[#F8F9FA] py-2 pr-4 sm:pr-20 pl-11 text-sm text-[#0B0B0C] placeholder:text-[#5B6168] placeholder:font-normal focus:border-[#0B0B0C] focus:bg-white focus:outline-none"
      />
      <span className="hidden sm:inline pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono-tabular text-xs font-medium text-[#5B6168]">
        Ctrl K
      </span>
    </div>
  );
};

/* ==========================================================================
   7. ICON RAIL (Desktop solid coral-red #FF4B55 left rail)
   ========================================================================== */
export type AppNavTab =
  | 'home'
  | 'vault'
  | 'people'
  | 'workers'
  | 'share'
  | 'settings';

interface IconRailProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  lang: 'ml' | 'en';
  counts?: {
    people?: number;
    workers?: number;
    share?: number;
    vaultHasExpiring?: boolean;
  };
}

export const RAIL_ITEMS: {
  id: AppNavTab;
  en: string;
  ml: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'home', en: 'Home', ml: 'ഹോം', icon: Home },
  { id: 'vault', en: 'Vault', ml: 'വോൾട്ട്', icon: FolderLock },
  { id: 'people', en: 'People', ml: 'അംഗങ്ങൾ', icon: Users },
  { id: 'workers', en: 'Workers', ml: 'ജോലിക്കാർ', icon: Wrench },
  { id: 'share', en: 'Share', ml: 'ഷെയർ', icon: Share2 },
  { id: 'settings', en: 'Settings', ml: 'സെറ്റിംഗ്സ്', icon: Settings },
];

export const IconRail: React.FC<IconRailProps> = ({
  activeTab,
  onSelectTab,
  lang,
  counts,
}) => {
  const badgeMap: Partial<Record<AppNavTab, number>> = {
    people: counts?.people ?? 4,
    workers: counts?.workers ?? 3,
    share: counts?.share ?? 3,
  };

  return (
    <aside
      aria-label="Workspace Navigation Rail"
      className="hidden md:flex sticky top-0 h-screen w-[84px] shrink-0 flex-col items-center justify-between bg-[#FF4B55] py-5 text-white select-none"
    >
      <div className="flex flex-col items-center w-full">
        {/* Top Brand Badge */}
        <div className="relative flex items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-xs">
            <div className="grid grid-cols-2 gap-0.5 p-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-[#FF4B55]" />
              <span className="h-2.5 w-2.5 rounded-xs bg-[#EFC94C]" />
              <span className="h-2.5 w-2.5 rounded-xs bg-[#1E4FD8]" />
              <span className="h-2.5 w-2.5 rounded-xs bg-[#0B0B0C]" />
            </div>
          </div>
        </div>

        {/* 6 Navigation Items */}
        <nav className="mt-7 flex flex-col items-center gap-3 w-full px-2">
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeVal = badgeMap[item.id];
          const showVaultDot =
            item.id === 'vault' && (counts?.vaultHasExpiring ?? true);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`spring-interactive relative flex min-h-[60px] w-full flex-col items-center justify-center rounded-2xl px-1 py-2 text-center cursor-pointer ${
                isActive
                  ? 'bg-white text-[#E03A45] shadow-xs font-bold'
                  : 'text-white hover:bg-[#E03A45]'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5 shrink-0" />
                {showVaultDot && (
                  <span className="absolute -top-1 -right-1.5 h-2.5 w-2.5 rounded-full bg-[#F5A623] ring-2 ring-[#FF4B55]" />
                )}
                {typeof badgeVal === 'number' && (
                  <span
                    className={`absolute -top-2 -right-3 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold leading-none ${
                      isActive
                        ? 'bg-[#E03A45] text-white'
                        : 'bg-white text-[#E03A45]'
                    }`}
                  >
                    {badgeVal}
                  </span>
                )}
              </div>
              <span
                className={`mt-1 text-[11px] leading-tight truncate max-w-[72px] ${
                  isActive ? 'text-[#E03A45] font-bold' : 'text-white/95'
                }`}
              >
                {lang === 'ml' ? item.ml : item.en}
              </span>
            </button>
          );
        })}
        </nav>
      </div>

      {/* Bottom Household Avatar with Online Green Dot */}
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-[#E03A45] text-xs font-bold text-white">
        RN
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#0F7B3E] ring-2 ring-[#FF4B55]" />
      </div>
    </aside>
  );
};

interface BottomTabsProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  onAddDocument: () => void;
  onOpenMore?: () => void;
  isMoreOpen?: boolean;
  lang: 'ml' | 'en';
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  onSelectTab,
  onAddDocument,
  onOpenMore,
  isMoreOpen = false,
  lang,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#E6E8EC] bg-white/95 backdrop-blur-md px-2 pt-1 pb-[calc(env(safe-area-inset-bottom,0px)+6px)]">
      <nav
        aria-label="Mobile Navigation Tabs"
        className="grid grid-cols-5 items-center gap-1"
      >
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl py-1 cursor-pointer transition-colors ${
            activeTab === 'home' && !isMoreOpen
              ? 'text-[#E03A45] font-bold'
              : 'text-[#5B6168] hover:text-[#0B0B0C]'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="mt-0.5 text-xs truncate max-w-[64px]">
            {lang === 'ml' ? 'ഹോം' : 'Home'}
          </span>
        </button>

        {/* 2. Vault */}
        <button
          type="button"
          onClick={() => onSelectTab('vault')}
          className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl py-1 cursor-pointer transition-colors ${
            activeTab === 'vault' && !isMoreOpen
              ? 'text-[#E03A45] font-bold'
              : 'text-[#5B6168] hover:text-[#0B0B0C]'
          }`}
        >
          <FolderLock className="h-5 w-5" />
          <span className="mt-0.5 text-xs truncate max-w-[64px]">
            {lang === 'ml' ? 'വോൾട്ട്' : 'Vault'}
          </span>
        </button>

        {/* 3. + Add (Elevated Center Thumb Button) */}
        <div className="flex items-center justify-center -mt-4">
          <button
            type="button"
            onClick={onAddDocument}
            aria-label={lang === 'ml' ? 'പുതിയത് ചേർക്കുക' : 'Add Document'}
            className="spring-interactive flex h-12 w-12 items-center justify-center rounded-full bg-[#E03A45] text-white shadow-lg hover:bg-[#C42F3A] cursor-pointer"
          >
            <Plus className="h-6 w-6 stroke-[2.4]" />
          </button>
        </div>

        {/* 4. Workers */}
        <button
          type="button"
          onClick={() => onSelectTab('workers')}
          className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl py-1 cursor-pointer transition-colors ${
            activeTab === 'workers' && !isMoreOpen
              ? 'text-[#E03A45] font-bold'
              : 'text-[#5B6168] hover:text-[#0B0B0C]'
          }`}
        >
          <Wrench className="h-5 w-5" />
          <span className="mt-0.5 text-xs truncate max-w-[64px]">
            {lang === 'ml' ? 'ജോലിക്കാർ' : 'Workers'}
          </span>
        </button>

        {/* 5. More */}
        <button
          type="button"
          onClick={onOpenMore || (() => onSelectTab('settings'))}
          className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl py-1 cursor-pointer transition-colors ${
            isMoreOpen ||
            activeTab === 'people' ||
            activeTab === 'share' ||
            activeTab === 'settings'
              ? 'text-[#E03A45] font-bold'
              : 'text-[#5B6168] hover:text-[#0B0B0C]'
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="mt-0.5 text-xs truncate max-w-[64px]">
            {lang === 'ml' ? 'കൂടുതൽ' : 'More'}
          </span>
        </button>
      </nav>
    </div>
  );
};

/* ==========================================================================
   8B. MOBILE MORE BOTTOM SHEET (People, Share Packs, Settings, Language)
   ========================================================================== */
export interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AppNavTab) => void;
  onToggleLang: () => void;
  lang: 'ml' | 'en';
  counts?: {
    people?: number;
    share?: number;
  };
}

export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onToggleLang,
  lang,
  counts,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-[28px] bg-white border-t border-[#E6E8EC] p-5 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="h-1.5 w-12 rounded-full bg-[#D1D5DB] mx-auto mb-2" />

        <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EC]">
          <div>
            <h4 className="text-[17px] font-bold text-[#0B0B0C] font-malayalam">
              {lang === 'ml' ? 'കൂടുതൽ സേവനങ്ങൾ' : 'More Options'}
            </h4>
            <p className="text-[13px] text-[#5B6168]">
              {lang === 'ml' ? 'കുടുംബ വോൾട്ട് നാവിഗേഷൻ' : 'Kudumba Vault Navigation'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F5F7] text-[#0B0B0C] hover:bg-[#E6E8EC] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {/* People / Family Members */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('people');
              onClose();
            }}
            className="w-full min-h-[52px] flex items-center justify-between p-3.5 rounded-2xl border border-[#E6E8EC] bg-[#FAFAFA] hover:bg-white text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDECEE] text-[#E03A45]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[15px] font-bold text-[#0B0B0C] block">
                  {lang === 'ml' ? 'കുടുംബാംഗങ്ങൾ' : 'Family Members'}
                </span>
                <span className="text-[12px] text-[#5B6168]">
                  {counts?.people ?? 4} {lang === 'ml' ? 'അംഗങ്ങൾ' : 'profiles'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#E03A45] bg-[#E03A45]/10 px-2.5 py-1 rounded-full">
              {counts?.people ?? 4}
            </span>
          </button>

          {/* Share Packs */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('share');
              onClose();
            }}
            className="w-full min-h-[52px] flex items-center justify-between p-3.5 rounded-2xl border border-[#E6E8EC] bg-[#FAFAFA] hover:bg-white text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F7EC] text-[#0F7B3E]">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[15px] font-bold text-[#0B0B0C] block">
                  {lang === 'ml' ? 'ഷെയർ പായ്ക്കുകൾ' : 'Expiring Share Packs'}
                </span>
                <span className="text-[12px] text-[#5B6168]">
                  {lang === 'ml' ? 'ആശുപത്രി, സി.എ പായ്ക്കുകൾ' : 'CA, Hospital & Visa packs'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#0F7B3E] bg-[#0F7B3E]/10 px-2.5 py-1 rounded-full">
              {counts?.share ?? 3}
            </span>
          </button>

          {/* Settings & Vault Profile */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('settings');
              onClose();
            }}
            className="w-full min-h-[52px] flex items-center justify-between p-3.5 rounded-2xl border border-[#E6E8EC] bg-[#FAFAFA] hover:bg-white text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F5F7] text-[#0B0B0C]">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[15px] font-bold text-[#0B0B0C] block">
                  {lang === 'ml' ? 'സെറ്റിംഗ്സ്' : 'Vault Settings & Profile'}
                </span>
                <span className="text-[12px] text-[#5B6168]">
                  {lang === 'ml' ? 'ബാക്കപ്പ് & സുരക്ഷ' : 'Backups & security'}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#8A949E]">
              &gt;
            </span>
          </button>

          {/* Quick Language Toggle */}
          <button
            type="button"
            onClick={() => {
              onToggleLang();
              onClose();
            }}
            className="w-full min-h-[52px] flex items-center justify-between p-3.5 rounded-2xl border border-[#E6E8EC] bg-white text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B0B0C] text-xs font-bold text-white">
                {lang === 'ml' ? 'മല' : 'EN'}
              </span>
              <div>
                <span className="text-[15px] font-bold text-[#0B0B0C] block">
                  {lang === 'ml' ? 'ഭാഷ മാറ്റുക' : 'Change Language'}
                </span>
                <span className="text-[12px] text-[#5B6168]">
                  {lang === 'ml' ? 'English-ലേക്ക് മാറ്റാം' : 'Switch to മലയാളം'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#0B0B0C] bg-[#F4F5F7] px-3 py-1 rounded-full">
              {lang === 'ml' ? 'English' : 'മലയാളം'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   9. BANNER (28px rounded card with concentric target rings, status chip & mascot)
   ========================================================================== */
interface BannerProps {
  statusLabel: string;
  headline: string;
  description: string;
  urgentTag: string;
  primaryLabel: string;
  onPrimaryClick: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  statusLabel,
  headline,
  description,
  urgentTag,
  primaryLabel,
  onPrimaryClick,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#E6E8EC] bg-[#F4F5F7] p-6 sm:p-8">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-1/2 -translate-y-1/2 h-80 w-80 opacity-45"
        viewBox="0 0 280 280"
        fill="none"
      >
        <circle cx="140" cy="140" r="125" stroke="#E6E8EC" strokeWidth="16" />
        <circle cx="140" cy="140" r="90" stroke="#E6E8EC" strokeWidth="16" />
        <circle cx="140" cy="140" r="55" stroke="#E6E8EC" strokeWidth="16" />
      </svg>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7EC] px-3.5 py-1 text-sm font-semibold text-[#0F7B3E]">
            <CheckCircle2 className="h-4 w-4" />
            <span>{statusLabel}</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B0B0C]">
            {headline}
          </h2>

          <p className="text-base text-[#5B6168]">{description}</p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] px-4 py-2 text-base font-semibold text-[#A85A00]">
              <Clock className="h-4 w-4" />
              <span>{urgentTag}</span>
            </span>

            <Button variant="primary" onClick={onPrimaryClick}>
              {primaryLabel}
            </Button>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end shrink-0">
          <VaultMascot pose="pointing" size="lg" />
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   10. EMPTY STATE (Sleeping Mascot + Message + Action)
   ========================================================================== */
interface EmptyStateProps {
  title: string;
  description?: string;
  subtitle?: string;
  actionLabel?: string;
  ctaLabel?: string;
  onAction?: () => void;
  onCta?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  subtitle,
  actionLabel,
  ctaLabel,
  onAction,
  onCta,
}) => {
  return (
    <Card className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <VaultMascot pose="sleeping" size="md" />
      <h3 className="mt-4 text-[18px] font-semibold text-[#0B0B0C]">{title}</h3>
      <p className="mt-1.5 max-w-md text-base text-[#5B6168]">
        {description || subtitle}
      </p>
      <div className="mt-5">
        <Button variant="primary" onClick={onAction || onCta}>
          <Plus className="h-5 w-5" />
          <span>{actionLabel || ctaLabel}</span>
        </Button>
      </div>
    </Card>
  );
};

/* ==========================================================================
   11. INSTALL PROMPT (Bottom-right PWA install card)
   ========================================================================== */
interface InstallPromptProps {
  lang: 'ml' | 'en';
  onInstall: () => void;
  onDismiss: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  lang,
  onInstall,
  onDismiss,
}) => {
  return (
    <div
      role="region"
      aria-label={
        lang === 'ml'
          ? 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക'
          : 'Install Kudumba Vault App'
      }
      className="flex items-center justify-between gap-4 rounded-2xl border border-[#E6E8EC] bg-white p-4 shadow-lg max-w-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDECEE] text-[#E03A45]">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-[#0B0B0C]">
            {lang === 'ml'
              ? 'കുടുംബ വോൾട്ട് ഇൻസ്റ്റാൾ ചെയ്യുക'
              : 'Install Kudumba Vault'}
          </h4>
          <p className="text-sm text-[#5B6168]">
            {lang === 'ml'
              ? 'ഓഫ്‌ലൈൻ ഉപയോഗത്തിനായി ഹോം സ്ക്രീനിൽ ചേർക്കുക.'
              : 'Add your household vault for fast 10-second offline access.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="primary"
          onClick={onInstall}
          className="min-h-[44px] px-4 py-2 text-sm"
        >
          <Download className="h-4 w-4" />
          <span>{lang === 'ml' ? 'ഇൻസ്റ്റാൾ' : 'Install'}</span>
        </Button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss install prompt"
          className="flex h-12 w-12 items-center justify-center rounded-full text-[#5B6168] hover:bg-[#F4F5F7] cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
