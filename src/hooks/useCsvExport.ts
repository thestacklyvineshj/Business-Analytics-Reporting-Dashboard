import { useCallback } from 'react';
import { exportToCsv } from '../utils/csvExport';

interface CsvColumn<T> {
  key: string;
  label: string;
  getValue?: (row: T) => string | number;
}

export function useCsvExport<T>() {
  const exportCsv = useCallback(
    (data: T[], columns: CsvColumn<T>[], filename: string) => {
      exportToCsv(data, columns, filename);
    },
    []
  );

  return { exportCsv };
}
