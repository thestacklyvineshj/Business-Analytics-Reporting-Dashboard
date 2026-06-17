import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../tables/DataTable';
import { useFilter } from '../hooks/useFilter';
import { useDataFetching } from '../hooks/useDataFetching';
import { reports } from '../utils/mockData';
import { formatDate } from '../utils/formatters';
import { REPORT_TYPES, REPORT_STATUSES } from '../constants';
import type { Report, TableColumn } from '../types';
import { cn } from '../utils/formatters';

const statusColors: Record<Report['status'], string> = {
  Draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  Published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Archived: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Pending Review': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const reportColumns: TableColumn<Report>[] = [
  { key: 'name', label: 'Report Name', sortable: true },
  { key: 'type', label: 'Report Type', sortable: true },
  {
    key: 'createdDate',
    label: 'Created Date',
    sortable: true,
    render: (row) => formatDate(row.createdDate),
    exportValue: (row) => row.createdDate,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => (
      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', statusColors[row.status])}>
        {row.status}
      </span>
    ),
    exportValue: (row) => row.status,
  },
  { key: 'author', label: 'Author', sortable: true },
  { key: 'region', label: 'Region', sortable: true },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const fetchReports = useMemo(() => () => reports, []);
  const { data, isLoading, error } = useDataFetching(fetchReports, { simulateDelay: 500 });

  const { filteredData, setFilter, getFilterValue, clearFilters } = useFilter(data ?? []);

  const handleRowClick = useCallback(
    (row: Report) => {
      navigate(`/reports/${row.id}`);
    },
    [navigate]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={getFilterValue('type')}
          onChange={(e) => setFilter('type', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Types</option>
          {REPORT_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={getFilterValue('status')}
          onChange={(e) => setFilter('status', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Statuses</option>
          {REPORT_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button
          onClick={clearFilters}
          className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          Clear Filters
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <DataTable<Report>
          data={filteredData}
          columns={reportColumns}
          searchKeys={['name', 'type', 'author', 'status']}
          searchPlaceholder="Search reports..."
          exportFilename="reports"
          onRowClick={handleRowClick}
          emptyMessage="No reports found"
        />
      </div>
    </div>
  );
}
