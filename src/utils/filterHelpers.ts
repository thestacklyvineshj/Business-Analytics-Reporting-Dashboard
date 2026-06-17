import type { SortConfig, SortDirection } from '../types';

export function sortData<T>(
  data: T[],
  sortConfig: SortConfig | null,
  getValue: (item: T, key: string) => string | number
): T[] {
  if (!sortConfig) return data;

  return [...data].sort((a, b) => {
    const aVal = getValue(a, sortConfig.key);
    const bVal = getValue(b, sortConfig.key);

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    const comparison = aStr.localeCompare(bStr);
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

export function toggleSortDirection(direction: SortDirection): SortDirection {
  return direction === 'asc' ? 'desc' : 'asc';
}

export function filterBySearch<T>(
  data: T[],
  searchTerm: string,
  searchKeys: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return data;

  const term = searchTerm.toLowerCase();
  return data.filter((item) =>
    searchKeys.some((key) => {
      const value = item[key];
      return String(value).toLowerCase().includes(term);
    })
  );
}

export function filterByField<T>(
  data: T[],
  field: keyof T,
  value: string
): T[] {
  if (value === 'all' || !value) return data;
  return data.filter((item) => String(item[field]) === value);
}

export function filterByDateRange<T>(
  data: T[],
  dateField: keyof T,
  startDate: string,
  endDate: string
): T[] {
  if (!startDate && !endDate) return data;

  const start = startDate ? new Date(startDate).getTime() : 0;
  const end = endDate ? new Date(endDate).getTime() : Infinity;

  return data.filter((item) => {
    const date = new Date(String(item[dateField])).getTime();
    return date >= start && date <= end;
  });
}

export function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}
