import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CATEGORIES, REGIONS } from '../constants';
import type { AnalyticsFilters } from '../types';
import { useAppContext } from '../context/AppContext';

const filterSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  category: z.string(),
  region: z.string(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface FilterPanelProps {
  onApply?: (filters: AnalyticsFilters) => void;
}

function FilterPanelComponent({ onApply }: FilterPanelProps) {
  const { state, setAnalyticsFilters, saveFilter, resetFilters } = useAppContext();
  const { register, handleSubmit, reset } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      startDate: state.analyticsFilters.dateRange.startDate,
      endDate: state.analyticsFilters.dateRange.endDate,
      category: state.analyticsFilters.category,
      region: state.analyticsFilters.region,
    },
  });

  const onSubmit = useCallback(
    (data: FilterFormData) => {
      const filters: AnalyticsFilters = {
        dateRange: { startDate: data.startDate, endDate: data.endDate },
        category: data.category as AnalyticsFilters['category'],
        region: data.region as AnalyticsFilters['region'],
      };
      setAnalyticsFilters(filters);
      onApply?.(filters);
    },
    [setAnalyticsFilters, onApply]
  );

  const handleSave = useCallback(
    (data: FilterFormData) => {
      const filters: AnalyticsFilters = {
        dateRange: { startDate: data.startDate, endDate: data.endDate },
        category: data.category as AnalyticsFilters['category'],
        region: data.region as AnalyticsFilters['region'],
      };
      saveFilter(filters);
    },
    [saveFilter]
  );

  const handleReset = useCallback(() => {
    resetFilters();
    reset({
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      category: 'all',
      region: 'all',
    });
  }, [resetFilters, reset]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Start Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">End Date</label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Category</label>
            <select
              {...register('category')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Region</label>
            <select
              {...register('region')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Regions</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleSubmit(handleSave)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Save Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            Reset
          </button>
        </div>
      </form>
      {state.savedFilters.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <p className="mb-2 text-xs font-medium text-gray-500">Saved Filters ({state.savedFilters.length})</p>
          <div className="flex flex-wrap gap-2">
            {state.savedFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
              >
                {filter.region} · {filter.category}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const FilterPanel = memo(FilterPanelComponent);
