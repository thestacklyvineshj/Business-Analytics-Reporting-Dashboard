import type { ReactNode } from 'react';

export type Region = 'North America' | 'Europe' | 'Asia Pacific' | 'Latin America' | 'Middle East';
export type Category = 'Electronics' | 'Clothing' | 'Home & Garden' | 'Sports' | 'Books' | 'Food & Beverage';
export type ReportType = 'Sales' | 'Financial' | 'Operational' | 'Marketing' | 'Inventory';
export type ReportStatus = 'Draft' | 'Published' | 'Archived' | 'Pending Review';
export type ActivityType = 'order' | 'customer' | 'report' | 'system' | 'payment';
export type SortDirection = 'asc' | 'desc';
export type Theme = 'light' | 'dark';

export interface Customer {
  id: string;
  name: string;
  email: string;
  region: Region;
  joinDate: string;
  totalSpent: number;
  orderCount: number;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  region: Region;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  category: Category;
  region: Region;
  amount: number;
  quantity: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled' | 'shipped';
}

export interface RevenueRecord {
  id: string;
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  region: Region;
  category: Category;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  createdDate: string;
  status: ReportStatus;
  description: string;
  author: string;
  region: Region;
  category: Category;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface KPIData {
  totalRevenue: number;
  totalCustomers: number;
  totalOrders: number;
  growthPercentage: number;
  activeUsers: number;
  revenueTrend: number;
  customersTrend: number;
  ordersTrend: number;
  usersTrend: number;
}

export interface DashboardSummary {
  kpis: KPIData;
  recentActivities: Activity[];
  summaryStats: {
    avgOrderValue: number;
    conversionRate: number;
    customerRetention: number;
    monthlyGrowth: number;
  };
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface AnalyticsFilters {
  dateRange: DateRangeFilter;
  category: Category | 'all';
  region: Region | 'all';
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  exportValue?: (row: T) => string | number;
}

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface AppState {
  theme: Theme;
  analyticsFilters: AnalyticsFilters;
  savedFilters: AnalyticsFilters[];
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_ANALYTICS_FILTERS'; payload: AnalyticsFilters }
  | { type: 'SAVE_FILTER'; payload: AnalyticsFilters }
  | { type: 'REMOVE_SAVED_FILTER'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FILTERS' };

export interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
}

export interface CategoryOrderPoint {
  category: string;
  orders: number;
}

export interface RegionDistributionPoint {
  name: string;
  value: number;
}

export interface RevenueExpensePoint {
  month: string;
  revenue: number;
  expenses: number;
}
