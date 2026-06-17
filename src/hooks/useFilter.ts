import { useState, useMemo, useCallback } from 'react';
import { filterByField, filterByDateRange } from '../utils/filterHelpers';

interface FilterConfig<T> {
  field: keyof T;
  value: string;
}

interface DateFilterConfig<T> {
  field: keyof T;
  startDate: string;
  endDate: string;
}

export function useFilter<T>(data: T[]) {
  const [filters, setFilters] = useState<FilterConfig<T>[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilterConfig<T> | null>(null);

  const filteredData = useMemo(() => {
    let result = data;
    filters.forEach(({ field, value }) => {
      result = filterByField(result, field, value);
    });
    if (dateFilter) {
      result = filterByDateRange(
        result,
        dateFilter.field,
        dateFilter.startDate,
        dateFilter.endDate
      );
    }
    return result;
  }, [data, filters, dateFilter]);

  const setFilter = useCallback((field: keyof T, value: string) => {
    setFilters((prev) => {
      const existing = prev.findIndex((f) => f.field === field);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { field, value };
        return updated;
      }
      return [...prev, { field, value }];
    });
  }, []);

  const setDateRangeFilter = useCallback(
    (field: keyof T, startDate: string, endDate: string) => {
      setDateFilter({ field, startDate, endDate });
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters([]);
    setDateFilter(null);
  }, []);

  const getFilterValue = useCallback(
    (field: keyof T): string => {
      const filter = filters.find((f) => f.field === field);
      return filter?.value ?? 'all';
    },
    [filters]
  );

  return {
    filteredData,
    filters,
    dateFilter,
    setFilter,
    setDateRangeFilter,
    clearFilters,
    getFilterValue,
  };
}
