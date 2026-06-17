import { memo } from 'react';
import { cn } from '../utils/formatters';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

const sizeClasses = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

function LoadingSpinnerComponent({ size = 'md', className, message }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-primary-200 border-t-primary-600',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}

export const LoadingSpinner = memo(LoadingSpinnerComponent);
