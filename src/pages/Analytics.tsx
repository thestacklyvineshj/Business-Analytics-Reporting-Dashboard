import { useMemo } from 'react';
import { FilterPanel } from '../components/FilterPanel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MonthlyRevenueChart } from '../charts/MonthlyRevenueChart';
import { OrdersByCategoryChart } from '../charts/OrdersByCategoryChart';
import { CustomerDistributionChart } from '../charts/CustomerDistributionChart';
import { RevenueVsExpensesChart } from '../charts/RevenueVsExpensesChart';
import { useAppContext } from '../context/AppContext';
import { useDataFetching } from '../hooks/useDataFetching';
import {
  getMonthlyRevenueTrend,
  getOrdersByCategory,
  getCustomerDistribution,
  getRevenueVsExpenses,
} from '../utils/mockData';
import type { AnalyticsFilters } from '../types';

interface AnalyticsData {
  revenueTrend: ReturnType<typeof getMonthlyRevenueTrend>;
  ordersByCategory: ReturnType<typeof getOrdersByCategory>;
  customerDistribution: ReturnType<typeof getCustomerDistribution>;
  revenueVsExpenses: ReturnType<typeof getRevenueVsExpenses>;
}

function fetchAnalyticsData(filters: AnalyticsFilters): AnalyticsData {
  return {
    revenueTrend: getMonthlyRevenueTrend(filters.region, filters.category),
    ordersByCategory: getOrdersByCategory(filters.region),
    customerDistribution: getCustomerDistribution(),
    revenueVsExpenses: getRevenueVsExpenses(filters.region, filters.category),
  };
}

export default function AnalyticsPage() {
  const { state } = useAppContext();
  const filters = state.analyticsFilters;

  const fetchFn = useMemo(
    () => () => fetchAnalyticsData(filters),
    [filters]
  );

  const { data, isLoading, error, refetch } = useDataFetching(fetchFn, { simulateDelay: 600 });

  return (
    <div className="space-y-6">
      <FilterPanel onApply={() => refetch()} />

      {isLoading && (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" message="Loading analytics..." />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {data && !isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MonthlyRevenueChart data={data.revenueTrend} />
          <OrdersByCategoryChart data={data.ordersByCategory} />
          <CustomerDistributionChart data={data.customerDistribution} />
          <RevenueVsExpensesChart data={data.revenueVsExpenses} />
        </div>
      )}
    </div>
  );
}
