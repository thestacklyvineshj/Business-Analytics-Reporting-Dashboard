import type { Category, Region, ReportType, ReportStatus } from '../types';

export const REGIONS: Region[] = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East',
];

export const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Food & Beverage',
];

export const REPORT_TYPES: ReportType[] = [
  'Sales',
  'Financial',
  'Operational',
  'Marketing',
  'Inventory',
];

export const REPORT_STATUSES: ReportStatus[] = [
  'Draft',
  'Published',
  'Archived',
  'Pending Review',
];

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

export const DEFAULT_PAGE_SIZE = 10;

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/reports', label: 'Reports', icon: 'FileText' },
] as const;

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;
