import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const GroupIcon: React.FC<IconProps> = ({ size = 20, strokeWidth = 1.9, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="6.6" r="2.6"/>
    <circle cx="5.8" cy="15.6" r="2.6"/>
    <circle cx="18.2" cy="15.6" r="2.6"/>
    <path d="M10.3 8.8 7.5 13.2"/>
    <path d="M13.7 8.8l2.8 4.4"/>
    <path d="M8.4 16.8h7.2"/>
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 19, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9.2" cy="8" r="3.2"/>
    <path d="M3.6 19.6c0-3.1 2.5-5 5.6-5s5.6 1.9 5.6 5"/>
    <path d="M16.2 5.5a3.2 3.2 0 0 1 0 5.9"/>
    <path d="M17.6 15c2 .6 3.4 2 3.4 4.6"/>
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ size = 19, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3.6 10.2 12 3.8l8.4 6.4V19a1.4 1.4 0 0 1-1.4 1.4h-4.2v-5.6H9.2v5.6H5a1.4 1.4 0 0 1-1.4-1.4z"/>
  </svg>
);

export const GridIcon: React.FC<IconProps> = ({ size = 19, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3.6" y="3.6" width="7" height="7" rx="1.6"/>
    <rect x="13.4" y="3.6" width="7" height="7" rx="1.6"/>
    <rect x="3.6" y="13.4" width="7" height="7" rx="1.6"/>
    <rect x="13.4" y="13.4" width="7" height="7" rx="1.6"/>
  </svg>
);

export const InboxIcon: React.FC<IconProps> = ({ size = 19, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export const HandIcon: React.FC<IconProps> = ({ size = 19, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
  </svg>
);

export const VideoIcon: React.FC<IconProps> = ({ size = 19, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

export const QrIcon: React.FC<IconProps> = ({ size = 19, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="6" height="6" rx="1.4"/>
    <rect x="14" y="4" width="6" height="6" rx="1.4"/>
    <rect x="4" y="14" width="6" height="6" rx="1.4"/>
    <path d="M14 14h2.5v2.5H14z"/>
    <path d="M20 14v6h-3.5"/>
  </svg>
);

export const SlidersIcon: React.FC<IconProps> = ({ size = 19, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="21" x2="4" y2="14"/>
    <line x1="4" y1="10" x2="4" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12" y2="3"/>
    <line x1="20" y1="21" x2="20" y2="16"/>
    <line x1="20" y1="12" x2="20" y2="3"/>
    <line x1="1" y1="14" x2="7" y2="14"/>
    <line x1="9" y1="8" x2="15" y2="8"/>
    <line x1="17" y1="16" x2="23" y2="16"/>
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ size = 18, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.4 11.6c0 4-3.8 7.2-8.4 7.2-1 0-2-.14-2.9-.4L4.4 20l1.2-3.4a6.9 6.9 0 0 1-2-5c0-4 3.8-7.2 8.4-7.2s8.4 3.2 8.4 7.2z"/>
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 14, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m5 12.6 4.6 4.6L19 7.4"/>
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ size = 17, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 17, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5.2v13.6"/>
    <path d="M5.2 12h13.6"/>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 17, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="6.2"/>
    <path d="m15.6 15.6 4.4 4.4"/>
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 18, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const UserPlusIcon: React.FC<IconProps> = ({ size = 18, strokeWidth = 1.7, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.8, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const RotateIcon: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.8, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);
