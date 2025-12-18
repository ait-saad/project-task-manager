import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Plus Icon
export const PlusIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Trash Icon
export const TrashIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// Edit Icon
export const EditIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

// Arrow Left Icon
export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12,19 5,12 12,5"></polyline>
  </svg>
);

// Check Icon
export const CheckIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

// Calendar Icon
export const CalendarIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// Clock Icon
export const ClockIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

// User Icon
export const UserIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Log Out Icon
export const LogOutIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="m9 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h5"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

// Folder Icon
export const FolderIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Grid Icon
export const GridIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

// List Icon
export const ListIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// Search Icon
export const SearchIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21l-4.35-4.35"></path>
  </svg>
);

// Filter Icon
export const FilterIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
  </svg>
);

// Settings Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m19.21-4.39l-1.42 1.42M6.21 8.39l-1.42-1.42M19.21 17.61l-1.42-1.42M6.21 15.61l-1.42 1.42"></path>
  </svg>
);

// Heart Icon
export const HeartIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

// Star Icon
export const StarIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"></polygon>
  </svg>
);

// Alert Circle Icon
export const AlertCircleIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// Eye Icon
export const EyeIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// Chevron Down Icon
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

// Chevron Right Icon
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

// X (Close) Icon
export const XIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);