import { memo } from 'react';
import { cn, formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: 'revenue' | 'customers' | 'orders' | 'growth' | 'users';
  format?: 'currency' | 'number' | 'percentage' | 'raw';
}

const iconPaths = {
  revenue: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  customers: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  orders: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  growth: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
};

const iconColors = {
  revenue: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  customers: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  orders: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  growth: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  users: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
};

function formatValue(value: string | number, format?: KPICardProps['format']): string {
  if (typeof value === 'string') return value;
  switch (format) {
    case 'currency': return formatCurrency(value);
    case 'number': return formatNumber(value);
    case 'percentage': return formatPercentage(value);
    default: return String(value);
  }
}

function KPICardComponent({ title, value, trend, icon, format }: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(value, format)}
          </p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span className={cn('text-sm font-medium', isPositive ? 'text-emerald-600' : 'text-red-500')}>
                {formatPercentage(trend)}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5', iconColors[icon])}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[icon]} />
          </svg>
        </div>
      </div>
    </div>
  );
}

export const KPICard = memo(KPICardComponent);
