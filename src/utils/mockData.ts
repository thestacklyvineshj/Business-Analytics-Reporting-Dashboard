import { CATEGORIES, MONTHS, REGIONS, REPORT_STATUSES, REPORT_TYPES } from '../constants';
import type {
  Activity,
  ActivityType,
  Category,
  Customer,
  DashboardSummary,
  KPIData,
  MonthlyRevenuePoint,
  CategoryOrderPoint,
  RegionDistributionPoint,
  RevenueExpensePoint,
  Order,
  Product,
  Region,
  Report,
  RevenueRecord,
} from '../types';
import {
  generateId,
  randomBetween,
  randomDate,
  randomFrom,
} from './formatters';

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

const PRODUCT_NAMES: Record<Category, string[]> = {
  Electronics: ['Laptop Pro', 'Smartphone X', 'Wireless Earbuds', '4K Monitor', 'Tablet Air', 'Smart Watch'],
  Clothing: ['Denim Jacket', 'Cotton T-Shirt', 'Running Shoes', 'Wool Sweater', 'Leather Belt', 'Summer Dress'],
  'Home & Garden': ['Coffee Maker', 'Garden Hose', 'LED Lamp', 'Throw Pillow', 'Plant Pot Set', 'Vacuum Cleaner'],
  Sports: ['Yoga Mat', 'Dumbbell Set', 'Tennis Racket', 'Basketball', 'Cycling Helmet', 'Fitness Tracker'],
  Books: ['Business Strategy', 'Data Science Guide', 'Cookbook Deluxe', 'Fiction Anthology', 'History of Tech', 'Self Help'],
  'Food & Beverage': ['Organic Coffee', 'Green Tea Pack', 'Protein Bars', 'Olive Oil', 'Honey Jar', 'Snack Mix'],
};

const ACTIVITY_TITLES: Record<ActivityType, string[]> = {
  order: ['New order placed', 'Order shipped', 'Order completed', 'Bulk order received'],
  customer: ['New customer registered', 'Customer upgraded plan', 'Customer feedback received'],
  report: ['Report generated', 'Report published', 'Report scheduled'],
  system: ['System backup completed', 'Data sync finished', 'Cache cleared'],
  payment: ['Payment received', 'Refund processed', 'Invoice sent'],
};

function generateCustomers(count: number): Customer[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);
    const region = randomFrom(REGIONS);
    const orderCount = randomBetween(1, 25);
    return {
      id: generateId('CUST', i + 1),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      region,
      joinDate: randomDate(2022, 2025),
      totalSpent: randomBetween(100, 15000),
      orderCount,
      status: Math.random() > 0.15 ? 'active' : 'inactive',
    };
  });
}

function generateProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => {
    const category = randomFrom(CATEGORIES);
    const names = PRODUCT_NAMES[category];
    return {
      id: generateId('PROD', i + 1),
      name: `${randomFrom(names)} ${randomBetween(100, 999)}`,
      category,
      price: randomBetween(10, 2000),
      stock: randomBetween(0, 500),
      region: randomFrom(REGIONS),
    };
  });
}

function generateOrders(count: number, customers: Customer[], products: Product[]): Order[] {
  const statuses: Order['status'][] = ['completed', 'pending', 'cancelled', 'shipped'];
  return Array.from({ length: count }, (_, i) => {
    const customer = randomFrom(customers);
    const product = randomFrom(products);
    const quantity = randomBetween(1, 5);
    return {
      id: generateId('ORD', i + 1),
      customerId: customer.id,
      customerName: customer.name,
      productId: product.id,
      productName: product.name,
      category: product.category,
      region: customer.region,
      amount: product.price * quantity,
      quantity,
      date: randomDate(2024, 2025),
      status: randomFrom(statuses),
    };
  });
}

function generateRevenueRecords(count: number): RevenueRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const revenue = randomBetween(50000, 500000);
    return {
      id: generateId('REV', i + 1),
      month: randomFrom(MONTHS),
      year: randomBetween(2023, 2025),
      revenue,
      expenses: Math.floor(revenue * (0.4 + Math.random() * 0.3)),
      region: randomFrom(REGIONS),
      category: randomFrom(CATEGORIES),
    };
  });
}

function generateReports(count: number): Report[] {
  const reportNames = [
    'Q1 Sales Summary', 'Annual Revenue Report', 'Customer Acquisition Analysis',
    'Inventory Status Report', 'Marketing Campaign ROI', 'Regional Performance Review',
    'Product Category Breakdown', 'Monthly Financial Statement', 'Operational Efficiency Report',
    'Customer Retention Analysis', 'Supply Chain Overview', 'Digital Marketing Metrics',
    'Quarterly Business Review', 'Expense Analysis Report', 'Sales Forecast 2025',
    'Market Share Analysis', 'Employee Productivity Report', 'Vendor Performance Review',
    'Budget Variance Report', 'Risk Assessment Summary',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: generateId('RPT', i + 1),
    name: `${randomFrom(reportNames)} ${randomBetween(1, 99)}`,
    type: randomFrom(REPORT_TYPES),
    createdDate: randomDate(2023, 2025),
    status: randomFrom(REPORT_STATUSES),
    description: `Comprehensive analysis covering key metrics and trends for business decision-making. Report #${i + 1}.`,
    author: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    region: randomFrom(REGIONS),
    category: randomFrom(CATEGORIES),
  }));
}

function generateActivities(count: number): Activity[] {
  const types: ActivityType[] = ['order', 'customer', 'report', 'system', 'payment'];
  return Array.from({ length: count }, (_, i) => {
    const type = randomFrom(types);
    return {
      id: generateId('ACT', i + 1),
      type,
      title: randomFrom(ACTIVITY_TITLES[type]),
      description: `Activity recorded for tracking and audit purposes. Reference ID: ${generateId('REF', i + 1)}`,
      timestamp: randomDate(2025, 2025),
      user: `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const customers: Customer[] = generateCustomers(120);
export const products: Product[] = generateProducts(120);
export const orders: Order[] = generateOrders(150, customers, products);
export const revenueRecords: RevenueRecord[] = generateRevenueRecords(120);
export const reports: Report[] = generateReports(60);
export const activities: Activity[] = generateActivities(100);

export function calculateKPIs(): KPIData {
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);
  const activeCustomers = customers.filter((c) => c.status === 'active').length;

  return {
    totalRevenue,
    totalCustomers: customers.length,
    totalOrders: orders.length,
    growthPercentage: 12.5,
    activeUsers: activeCustomers,
    revenueTrend: 8.3,
    customersTrend: 5.2,
    ordersTrend: 11.7,
    usersTrend: 3.8,
  };
}

export function getDashboardSummary(): DashboardSummary {
  const kpis = calculateKPIs();
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const avgOrderValue = completedOrders.length > 0
    ? completedOrders.reduce((sum, o) => sum + o.amount, 0) / completedOrders.length
    : 0;

  return {
    kpis,
    recentActivities: activities.slice(0, 10),
    summaryStats: {
      avgOrderValue,
      conversionRate: 3.2,
      customerRetention: 87.5,
      monthlyGrowth: 12.5,
    },
  };
}

export function getMonthlyRevenueTrend(
  region?: Region | 'all',
  category?: Category | 'all'
): MonthlyRevenuePoint[] {
  const filtered = revenueRecords.filter((r) => {
    if (region && region !== 'all' && r.region !== region) return false;
    if (category && category !== 'all' && r.category !== category) return false;
    return true;
  });

  const monthMap = new Map<string, number>();
  MONTHS.forEach((month) => monthMap.set(month, 0));

  filtered.forEach((r) => {
    const current = monthMap.get(r.month) ?? 0;
    monthMap.set(r.month, current + r.revenue);
  });

  return MONTHS.map((month) => ({
    month,
    revenue: monthMap.get(month) ?? 0,
  }));
}

export function getOrdersByCategory(
  region?: Region | 'all'
): CategoryOrderPoint[] {
  const filtered = region && region !== 'all'
    ? orders.filter((o) => o.region === region)
    : orders;

  const categoryMap = new Map<string, number>();
  CATEGORIES.forEach((cat) => categoryMap.set(cat, 0));

  filtered.forEach((o) => {
    const current = categoryMap.get(o.category) ?? 0;
    categoryMap.set(o.category, current + 1);
  });

  return CATEGORIES.map((category) => ({
    category,
    orders: categoryMap.get(category) ?? 0,
  }));
}

export function getCustomerDistribution(): RegionDistributionPoint[] {
  const regionMap = new Map<string, number>();
  REGIONS.forEach((r) => regionMap.set(r, 0));

  customers.forEach((c) => {
    const current = regionMap.get(c.region) ?? 0;
    regionMap.set(c.region, current + 1);
  });

  return REGIONS.map((name) => ({
    name,
    value: regionMap.get(name) ?? 0,
  }));
}

export function getRevenueVsExpenses(
  region?: Region | 'all',
  category?: Category | 'all'
): RevenueExpensePoint[] {
  const filtered = revenueRecords.filter((r) => {
    if (region && region !== 'all' && r.region !== region) return false;
    if (category && category !== 'all' && r.category !== category) return false;
    return true;
  });

  const monthMap = new Map<string, { revenue: number; expenses: number }>();
  MONTHS.forEach((month) => monthMap.set(month, { revenue: 0, expenses: 0 }));

  filtered.forEach((r) => {
    const current = monthMap.get(r.month) ?? { revenue: 0, expenses: 0 };
    monthMap.set(r.month, {
      revenue: current.revenue + r.revenue,
      expenses: current.expenses + r.expenses,
    });
  });

  return MONTHS.map((month) => {
    const data = monthMap.get(month) ?? { revenue: 0, expenses: 0 };
    return { month, ...data };
  });
}

export function getReportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id);
}
