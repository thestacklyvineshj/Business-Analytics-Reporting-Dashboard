import { memo } from 'react';
import type { Activity } from '../types';
import { getRelativeTime } from '../utils/formatters';

interface RecentActivityProps {
  activities: Activity[];
}

const typeColors: Record<Activity['type'], string> = {
  order: 'bg-blue-500',
  customer: 'bg-emerald-500',
  report: 'bg-violet-500',
  system: 'bg-gray-500',
  payment: 'bg-amber-500',
};

function RecentActivityComponent({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      <div className="max-h-96 overflow-y-auto p-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${typeColors[activity.type]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                {activity.description}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                <span>{activity.user}</span>
                <span>·</span>
                <span>{getRelativeTime(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const RecentActivity = memo(RecentActivityComponent);
