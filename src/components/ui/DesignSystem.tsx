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
} from 'lucide-react';
import { VaultMascot } from '../VaultMascot';

/* ==========================================================================
   1. BUTTON (primary: #E03A45, dark: #0B0B0C, outline: white/ink, 999px pill)
   ========================================================================== */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'outline-white' | 'outline-ink';
  size?: 'md' | 'lg';
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
    'spring-interactive inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full font-bold cursor-pointer select-none';
  const padding = size === 'lg' ? 'px-7 py-3.5 text-base' : 'px-5 py-2.5 text-sm';

  const variants = {
    primary: 'bg-[#E03A45] text-white hover:bg-[#C42F3A] shadow-sm',
    dark: 'bg-[#0B0B0C] text-white hover:bg-[#222226] shadow-md',
    'outline-white':
      'bg-white text-[#0B0B0C] border-2 border-white hover:bg-[#F4F5F7] shadow-md',
    'outline-ink':
      'bg-white text-[#0B0B0C] border border-[#E6E8EC] hover:border-[#0B0B0C] hover:bg-[#F4F5F7]',
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
   2. CHIP (999px pill filter / category selector with 48px tap target)
   ========================================================================== */
interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  onClick,
  children,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`spring-interactive inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer ${
        active
          ? 'bg-[#E03A45] text-white shadow-xs'
          : 'bg-[#F4F5F7] text-[#5B6168] border border-[#E6E8EC] hover:text-[#0B0B0C]'
      } ${className}`}
    >
      {children}
    </button>
  );
};

/* ==========================================================================
   3. STATUS BADGE (Never relies on colour alone: always Icon + Text)
      - Expired: #B3121F on #FDECEE, icon x-circle
      - Due soon: #A85A00 on #FFF4D6, icon clock
      - Valid: #0F7B3E on #E4F7EC, icon check-circle
   ========================================================================== */
export type DocStatusType = 'EXPIRED' | 'DUE_SOON' | 'VALID';

interface StatusBadgeProps {
  status: DocStatusType;
  daysRemaining?: number | null;
  lang: 'ml' | 'en';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  daysRemaining,
  lang,
}) => {
  if (status === 'EXPIRED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEE] border border-[#B3121F]/20 px-3 py-1 text-xs font-bold text-[#B3121F]">
        <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {lang === 'ml'
            ? daysRemaining && daysRemaining < 0
              ? `കാലാവധി കഴിഞ്ഞു (${Math.abs(daysRemaining)} ദിവസം)`
              : 'കാലാവധി കഴിഞ്ഞു'
            : daysRemaining && daysRemaining < 0
            ? `Expired (${Math.abs(daysRemaining)}d ago)`
            : 'Expired'}
        </span>
      </span>
    );
  }

  if (status === 'DUE_SOON') {
    const d = daysRemaining ?? 14;
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] border border-[#A85A00]/20 px-3 py-1 text-xs font-bold text-[#A85A00]">
        <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {lang === 'ml' ? `${d} ദിവസത്തിനുള്ളിൽ അവസാനിക്കും` : `Due in ${d} days`}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7EC] border border-[#0F7B3E]/20 px-3 py-1 text-xs font-bold text-[#0F7B3E]">
      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{lang === 'ml' ? 'സാധുവാണ് (Valid)' : 'Valid'}</span>
    </span>
  );
};

/* ==========================================================================
   4. CARD (Soft gray #F4F5F7 rounded 22px card with #E6E8EC border)
   ========================================================================== */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  white?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  white = false,
}) => {
  return (
    <div
      className={`rounded-[22px] border border-[#E6E8EC] ${
        white ? 'bg-white' : 'bg-[#F4F5F7]'
      } p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
};

/* ==========================================================================
   5. GAUGE (Festie 33/100 style semicircular progress gauge)
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
  // Angle from 180 deg (left) to 0 deg (right)
  const rad = Math.PI * (1 - clamped / 100);
  const cx = 100 + 70 * Math.cos(rad);
  const cy = 95 - 70 * Math.sin(rad);

  return (
    <Card className="flex flex-col justify-between h-full">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#0B0B0C]">{title}</h3>
          <p className="mt-1 font-mono-tabular text-3xl font-extrabold text-[#0B0B0C]">
            {clamped}
            <span className="text-base font-normal text-[#5B6168]"> /100</span>
          </p>
        </div>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            aria-label={title}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E03A45] text-white hover:bg-[#C42F3A] cursor-pointer shrink-0"
          >
            <ArrowUpRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="my-3 flex justify-center">
        <svg viewBox="0 0 200 110" className="w-48 h-28 overflow-visible">
          {/* Hatched background arc */}
          <path
            d="M 30 95 A 70 70 0 0 1 170 95"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="22"
            strokeDasharray="3 5"
          />
          {/* Coral active fill arc */}
          <path
            d={`M 30 95 A 70 70 0 0 1 ${cx.toFixed(1)} ${cy.toFixed(1)}`}
            fill="none"
            stroke="#FF4B55"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {/* Indicator knob */}
          <circle
            cx={cx}
            cy={cy}
            r="9"
            fill="#FFFFFF"
            stroke="#FF4B55"
            strokeWidth="5"
          />
        </svg>
      </div>

      <p className="text-center text-xs text-[#5B6168]">{subtitle}</p>
    </Card>
  );
};

/* ==========================================================================
   6. SEARCH PILL ("Search navigations... Ctrl K")
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
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#5B6168]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-h-[48px] rounded-full border border-[#E6E8EC] bg-[#F4F5F7] py-2.5 pr-16 pl-11 text-sm text-[#0B0B0C] placeholder:text-[#5B6168] focus:border-[#1E4FD8] focus:bg-white focus:outline-none"
      />
      <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono-tabular text-xs font-semibold text-[#5B6168]">
        Ctrl K
      </span>
    </div>
  );
};

/* ==========================================================================
   7. ICON RAIL (Desktop solid #FF4B55 left rail with 6 items & small labels)
   ========================================================================== */
export type AppNavTab = 'home' | 'vault' | 'people' | 'workers' | 'share' | 'settings';

interface IconRailProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  lang: 'ml' | 'en';
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
}) => {
  return (
    <aside
      aria-label="Workspace Navigation Rail"
      className="hidden md:flex w-[84px] shrink-0 flex-col items-center justify-between bg-[#FF4B55] py-5 text-white select-none"
    >
      {/* Top Mascot Badge */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="grid grid-cols-2 gap-0.5 p-1.5">
          <span className="h-3 w-3 rounded-xs bg-[#FF4B55]" />
          <span className="h-3 w-3 rounded-xs bg-[#EFC94C]" />
          <span className="h-3 w-3 rounded-xs bg-[#1E4FD8]" />
          <span className="h-3 w-3 rounded-xs bg-[#0B0B0C]" />
        </div>
      </div>

      {/* 6 Navigation Items with Small Labels Under Each Icon */}
      <nav className="my-6 flex flex-col items-center gap-3 w-full px-2">
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`spring-interactive flex min-h-[56px] w-full flex-col items-center justify-center rounded-2xl px-1 py-2 text-center cursor-pointer ${
                isActive
                  ? 'bg-white text-[#E03A45] shadow-sm font-bold'
                  : 'text-white hover:bg-[#E03A45]'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="mt-1 text-[11px] leading-tight truncate max-w-[68px]">
                {lang === 'ml' ? item.ml : item.en}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Household Avatar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-[#E03A45] text-xs font-extrabold text-white">
        RN
      </div>
    </aside>
  );
};

/* ==========================================================================
   8. BOTTOM TABS (Mobile 5 items + Floating Coral "+" Add Document Button)
   ========================================================================== */
interface BottomTabsProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  onAddDocument: () => void;
  lang: 'ml' | 'en';
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  onSelectTab,
  onAddDocument,
  lang,
}) => {
  const mobileItems = RAIL_ITEMS.slice(0, 5); // Home, Vault, People, Workers, Share

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#E6E8EC] bg-white/95 backdrop-blur-md px-2 py-1.5">
      {/* Floating Coral "+" Button for Adding a Document */}
      <button
        type="button"
        onClick={onAddDocument}
        aria-label={lang === 'ml' ? 'രേഖ ചേർക്കുക' : 'Add document'}
        className="spring-interactive absolute -top-14 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E03A45] text-white shadow-lg hover:bg-[#C42F3A] cursor-pointer"
      >
        <Plus className="h-6 w-6" />
      </button>

      <nav aria-label="Mobile Navigation Tabs" className="grid grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl py-1 cursor-pointer ${
                isActive ? 'text-[#E03A45] font-bold' : 'text-[#5B6168]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-0.5 text-[10px] truncate max-w-[60px]">
                {lang === 'ml' ? item.ml : item.en}
              </span>
            </button>
          );
        })}
      </nav>
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
      {/* Concentric Target Circles on Right (matching Festie dashboard banner) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-1/2 -translate-y-1/2 h-80 w-80 opacity-65"
        viewBox="0 0 280 280"
        fill="none"
      >
        <circle cx="140" cy="140" r="125" stroke="#E2E4E9" strokeWidth="16" />
        <circle cx="140" cy="140" r="90" stroke="#E2E4E9" strokeWidth="16" />
        <circle cx="140" cy="140" r="55" stroke="#E2E4E9" strokeWidth="16" />
      </svg>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7EC] px-3.5 py-1 text-xs font-bold text-[#0F7B3E]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{statusLabel}</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0B0C] balance-text">
            {headline}
          </h2>

          <p className="text-sm sm:text-base text-[#5B6168]">{description}</p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] px-3.5 py-1.5 text-xs font-bold text-[#A85A00]">
              <Clock className="h-3.5 w-3.5" />
              <span>{urgentTag}</span>
            </span>

            <Button variant="primary" onClick={onPrimaryClick}>
              {primaryLabel}
            </Button>
          </div>
        </div>

        {/* Pointing 3D Mascot on the Concentric Rings */}
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
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <VaultMascot pose="sleeping" size="md" />
      <h3 className="mt-4 text-lg font-extrabold text-[#0B0B0C]">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-[#5B6168]">{description}</p>
      <div className="mt-5">
        <Button variant="primary" onClick={onAction}>
          <Plus className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      </div>
    </Card>
  );
};

/* ==========================================================================
   11. INSTALL PROMPT (Festie bottom-right PWA install card)
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
      aria-label={lang === 'ml' ? 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക' : 'Install Kudumba Vault App'}
      className="flex items-center justify-between gap-4 rounded-2xl border border-[#E6E8EC] bg-white p-4 shadow-xl max-w-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FDECEE] text-[#E03A45]">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-[#0B0B0C]">
            {lang === 'ml' ? 'കുടുംബ വോൾട്ട് ഇൻസ്റ്റാൾ ചെയ്യുക' : 'Install Kudumba Vault'}
          </h4>
          <p className="text-xs text-[#5B6168]">
            {lang === 'ml'
              ? 'ഓഫ്‌ലൈൻ ഉപയോഗത്തിനായി ഹോം സ്ക്രീനിൽ ചേർക്കുക.'
              : 'Add your household vault for fast 10-second offline access.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="primary" onClick={onInstall} className="min-h-[40px] px-4 py-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          <span>{lang === 'ml' ? 'ഇൻസ്റ്റാൾ' : 'Install'}</span>
        </Button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss install prompt"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#5B6168] hover:bg-[#F4F5F7] cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
