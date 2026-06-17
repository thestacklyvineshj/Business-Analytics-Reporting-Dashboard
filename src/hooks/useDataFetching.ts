import { useState, useEffect, useCallback } from 'react';
import type { FetchState } from '../types';
import { delay } from '../utils/formatters';

interface UseDataFetchingOptions {
  simulateDelay?: number;
}

export function useDataFetching<T>(
  fetchFn: () => T | Promise<T>,
  options: UseDataFetchingOptions = {}
): FetchState<T> & { refetch: () => void } {
  const { simulateDelay = 500 } = options;
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      if (simulateDelay > 0) await delay(simulateDelay);
      const result = await fetchFn();
      setState({ data: result, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState({ data: null, isLoading: false, error: message });
    }
  }, [fetchFn, simulateDelay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
