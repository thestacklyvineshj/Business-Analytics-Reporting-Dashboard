import { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { RecentActivity } from '../components/RecentActivity';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DashboardSkeleton } from '../components/Skeleton';
import { DataTable } from '../tables/DataTable';
import { useDataFetching } from '../hooks/useDataFetching';
import { getDashboardSummary, orders } from '../utils/mockData';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import type { Order, TableColumn } from '../types';

const orderColumns: TableColumn<Order>[] = [
  { key: 'id', label: 'Order ID', sortable: true },
  { key: 'customerName', label: 'Customer', sortable: true },
  { key: 'productName', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    render: (row) => formatCurrency(row.amount),
    exportValue: (row) => row.amount,
  },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
];

export default function DashboardPage() {
  const fetchDashboard = useMemo(() => () => getDashboardSummary(), []);
  const { data, isLoading, error } = useDataFetching(fetchDashboard, { simulateDelay: 800 });

  if (isLoading) return <DashboardSkeleton />;
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }
  if (!data) return <LoadingSpinner message="Loading dashboard..." className="py-20" />;

  const { kpis, recentActivities, summaryStats } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Total Revenue" value={kpis.totalRevenue} trend={kpis.revenueTrend} icon="revenue" format="currency" />
        <KPICard title="Total Customers" value={kpis.totalCustomers} trend={kpis.customersTrend} icon="customers" format="number" />
        <KPICard title="Total Orders" value={kpis.totalOrders} trend={kpis.ordersTrend} icon="orders" format="number" />
        <KPICard title="Growth" value={kpis.growthPercentage} trend={kpis.growthPercentage} icon="growth" format="percentage" />
        <KPICard title="Active Users" value={kpis.activeUsers} trend={kpis.usersTrend} icon="users" format="number" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(summaryStats.avgOrderValue)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {formatPercentage(summaryStats.conversionRate)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500">Customer Retention</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {formatPercentage(summaryStats.customerRetention, 1)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500">Monthly Growth</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">
            {formatPercentage(summaryStats.monthlyGrowth)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
            <DataTable<Order>
              data={orders.slice(0, 50)}
              columns={orderColumns}
              searchKeys={['id', 'customerName', 'productName', 'category', 'status']}
              searchPlaceholder="Search orders..."
              exportFilename="recent-orders"
            />
          </div>
        </div>
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
}
