import React from 'react';
import {
  GroupIcon,
  UsersIcon,
  HomeIcon,
  GridIcon,
  InboxIcon,
  HandIcon,
  VideoIcon,
  QrIcon,
  SlidersIcon,
} from './Icons.tsx';
import { AdminUser } from '../types.ts';

export type NavItemKey =
  | 'Overview'
  | 'Applicants'
  | 'People'
  | 'Households'
  | 'Care Groups'
  | 'Serving'
  | 'Sermons'
  | 'Church code'
  | 'Settings';

interface AdminLayoutShellProps {
  currentAdmin?: AdminUser | null;
  activeNav: NavItemKey;
  onNavChange: (nav: NavItemKey) => void;
  onSignOut?: () => void;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminLayoutShell: React.FC<AdminLayoutShellProps> = ({
  currentAdmin,
  activeNav,
  onNavChange,
  onSignOut,
  title,
  subtitle,
  actions,
  children,
}) => {
  const adminName = currentAdmin?.name || 'Lidya S.';
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navItemsOffice: Array<{ key: NavItemKey; label: string; icon: React.ReactNode; badge?: string }> = [
    { key: 'Overview', label: 'Overview', icon: <GridIcon size={19} strokeWidth={activeNav === 'Overview' ? 2 : 1.7} /> },
    { key: 'Applicants', label: 'Applicants', icon: <InboxIcon size={19} strokeWidth={activeNav === 'Applicants' ? 2 : 1.7} />, badge: '5' },
    { key: 'People', label: 'People', icon: <UsersIcon size={19} strokeWidth={activeNav === 'People' ? 2 : 1.7} /> },
    { key: 'Households', label: 'Households', icon: <HomeIcon size={19} strokeWidth={activeNav === 'Households' ? 2 : 1.7} /> },
    { key: 'Care Groups', label: 'Care Groups', icon: <GroupIcon size={19} strokeWidth={activeNav === 'Care Groups' ? 2 : 1.7} /> },
    { key: 'Serving', label: 'Serving', icon: <HandIcon size={19} strokeWidth={activeNav === 'Serving' ? 2 : 1.7} /> },
    { key: 'Sermons', label: 'Sermons', icon: <VideoIcon size={19} strokeWidth={activeNav === 'Sermons' ? 2 : 1.7} /> },
  ];

  const navItemsChurch: Array<{ key: NavItemKey; label: string; icon: React.ReactNode }> = [
    { key: 'Church code', label: 'Church code', icon: <QrIcon size={19} strokeWidth={activeNav === 'Church code' ? 2 : 1.7} /> },
    { key: 'Settings', label: 'Settings', icon: <SlidersIcon size={19} strokeWidth={activeNav === 'Settings' ? 2 : 1.7} /> },
  ];

  return (
    <div className="w-full min-h-screen bg-bg flex" style={{ minHeight: '900px' }}>
      {/* 246px Persistent Left Sidebar */}
      <aside className="w-[246px] flex-[0_0_246px] bg-surfaceAlt border-r border-line flex flex-col p-[26px_16px_20px]">
        {/* Brand header */}
        <div className="flex items-center gap-[11px] px-[6px]">
          <div className="w-[34px] h-[34px] rounded-input bg-accent text-white flex items-center justify-center">
            <GroupIcon size={20} strokeWidth={1.9} />
          </div>
          <div className="font-serif text-[20px] font-medium tracking-[-0.01em]">Jemaat</div>
        </div>

        {/* Church Office section */}
        <div className="text-[11px] font-bold tracking-[0.09em] text-ink3 m-[26px_12px_8px]">
          CHURCH OFFICE
        </div>
        <nav className="flex flex-col gap-[3px]">
          {navItemsOffice.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavChange(item.key)}
                className={`flex items-center gap-[11px] h-[40px] px-3 rounded-input text-[14px] transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-accentTint text-accent font-bold'
                    : 'text-ink2 font-semibold hover:bg-surface'
                }`}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                <span className="flex-1 min-w-0 truncate">{item.label}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-[6px] rounded-full bg-accent text-white text-[11px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* This Church section */}
        <div className="text-[11px] font-bold tracking-[0.09em] text-ink3 m-[22px_12px_8px]">
          THIS CHURCH
        </div>
        <nav className="flex flex-col gap-[3px]">
          {navItemsChurch.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavChange(item.key)}
                className={`flex items-center gap-[11px] h-[40px] px-3 rounded-input text-[14px] transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-accentTint text-accent font-bold'
                    : 'text-ink2 font-semibold hover:bg-surface'
                }`}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                <span className="flex-1 min-w-0 truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1"></div>

        {/* Logged in admin profile */}
        <div className="flex items-center gap-[11px] p-[11px_8px] border-t border-line">
          <div className="w-[34px] h-[34px] flex-[0_0_34px] rounded-input bg-accentTint text-accent font-bold text-[13px] flex items-center justify-center">
            {initials || 'LS'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate">{adminName}</div>
            <div className="text-[11px] text-ink3 truncate">Church office</div>
          </div>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              title="Sign out"
              className="text-[11px] text-ink3 hover:text-accent font-semibold px-1 py-1"
            >
              Sign out
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 flex flex-col p-[26px_28px] gap-[18px] overflow-y-auto">
        {/* Top Header pageHead */}
        <header className="flex items-end gap-[10px] pb-2">
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-[27px] font-medium tracking-[-0.015em] text-ink m-0">
              {title}
            </h1>
            <div className="text-[13px] text-ink2 mt-[5px]">{subtitle}</div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        {/* Content area */}
        <div className="flex-1 min-h-0 flex flex-col">{children}</div>
      </main>
    </div>
  );
};

export const ActionButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}> = ({ label, icon, primary = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 h-[40px] px-4 rounded-input text-[13px] font-semibold transition-colors cursor-pointer ${
      primary
        ? 'bg-accent text-white hover:bg-accentDark'
        : 'bg-surface border border-line text-ink hover:bg-surfaceAlt'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
