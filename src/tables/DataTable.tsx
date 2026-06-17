import {
  memo,
  useState,
  useMemo,
  useCallback,
  type ChangeEvent,
} from 'react';
import type { TableColumn, SortConfig } from '../types';
import { useSearch } from '../hooks/useSearch';
import { usePagination } from '../hooks/usePagination';
import { useCsvExport } from '../hooks/useCsvExport';
import { sortData, toggleSortDirection } from '../utils/filterHelpers';
import { EmptyState } from '../components/EmptyState';
import { cn } from '../utils/formatters';
import { PAGE_SIZE_OPTIONS } from '../constants';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  searchKeys: (keyof T)[];
  searchPlaceholder?: string;
  exportFilename?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

function DataTableComponent<T>({
  data,
  columns,
  searchKeys,
  searchPlaceholder = 'Search...',
  exportFilename = 'export',
  onRowClick,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(columns.map((c) => String(c.key)))
  );
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  const { searchTerm, setSearchTerm, filteredData: searchedData } = useSearch(data, searchKeys);
  const { exportCsv } = useCsvExport<T>();

  const getValue = useCallback((item: T, key: string): string | number => {
    const col = columns.find((c) => String(c.key) === key);
    if (col?.exportValue) return col.exportValue(item);
    const val = item[key as keyof T];
    if (typeof val === 'number' || typeof val === 'string') return val;
    return String(val ?? '');
  }, [columns]);

  const sortedData = useMemo(
    () => sortData(searchedData, sortConfig, getValue),
    [searchedData, sortConfig, getValue]
  );

  const {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    resetPage,
  } = usePagination(sortedData);

  const visibleColumnList = useMemo(
    () => columns.filter((c) => visibleColumns.has(String(c.key))),
    [columns, visibleColumns]
  );

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: toggleSortDirection(prev.direction) };
      }
      return { key, direction: 'asc' };
    });
    resetPage();
  }, [resetPage]);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      resetPage();
    },
    [setSearchTerm, resetPage]
  );

  const handleExport = useCallback(() => {
    const exportColumns = visibleColumnList.map((col) => ({
      key: String(col.key),
      label: col.label,
      getValue: col.exportValue
        ? (row: T) => col.exportValue!(row)
        : (row: T) => String(row[col.key as keyof T] ?? ''),
    }));
    exportCsv(sortedData, exportColumns, exportFilename);
  }, [visibleColumnList, sortedData, exportFilename, exportCsv]);

  const toggleColumn = useCallback((key: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} icon="data" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowColumnToggle((p) => !p)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Columns
            </button>
            {showColumnToggle && (
              <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                {columns.map((col) => (
                  <label key={String(col.key)} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(String(col.key))}
                      onChange={() => toggleColumn(String(col.key))}
                      className="rounded border-gray-300"
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {visibleColumnList.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 font-medium text-gray-600 dark:text-gray-300',
                    col.sortable !== false && 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-white'
                  )}
                  onClick={() => col.sortable !== false && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig?.key === String(col.key) && (
                      <span className="text-primary-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnList.length} className="px-4 py-8 text-center text-gray-500">
                  No matching results
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    'bg-white transition-colors dark:bg-gray-900',
                    onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {visibleColumnList.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
          </span>
          <select
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm',
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                )}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;
