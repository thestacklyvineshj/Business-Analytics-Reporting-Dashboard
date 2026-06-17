import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDataFetching } from '../hooks/useDataFetching';
import { getReportById } from '../utils/mockData';
import { formatDate } from '../utils/formatters';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { cn } from '../utils/formatters';
import type { Report } from '../types';

const statusColors: Record<Report['status'], string> = {
  Draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  Published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Archived: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Pending Review': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchReport = useMemo(
    () => () => {
      const report = getReportById(id ?? '');
      if (!report) throw new Error('Report not found');
      return report;
    },
    [id]
  );

  const { data: report, isLoading, error } = useDataFetching(fetchReport, { simulateDelay: 400 });

  if (isLoading) return <LoadingSpinner message="Loading report..." className="py-20" />;

  if (error || !report) {
    return (
      <EmptyState
        title="Report Not Found"
        description={error ?? 'The requested report could not be found.'}
        icon="report"
        action={{ label: 'Back to Reports', onClick: () => navigate('/reports') }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/reports"
        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Reports
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{report.name}</h2>
            <p className="mt-1 text-sm text-gray-500">ID: {report.id}</p>
          </div>
          <span className={cn('rounded-full px-3 py-1 text-sm font-medium', statusColors[report.status])}>
            {report.status}
          </span>
        </div>

        <p className="mt-4 text-gray-600 dark:text-gray-300">{report.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 dark:border-gray-700 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-gray-500">Type</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{report.type}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Created</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(report.createdDate)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Author</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{report.author}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Region</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{report.region}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Category</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{report.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
