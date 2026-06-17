import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import type { AnalyticsFilters, AppState, Theme } from '../types';
import { appReducer, initialState } from './reducer';

interface AppContextValue {
  state: AppState;
  setTheme: (theme: Theme) => void;
  setAnalyticsFilters: (filters: AnalyticsFilters) => void;
  saveFilter: (filters: AnalyticsFilters) => void;
  removeSavedFilter: (index: number) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const setAnalyticsFilters = useCallback((filters: AnalyticsFilters) => {
    dispatch({ type: 'SET_ANALYTICS_FILTERS', payload: filters });
  }, []);

  const saveFilter = useCallback((filters: AnalyticsFilters) => {
    dispatch({ type: 'SAVE_FILTER', payload: filters });
  }, []);

  const removeSavedFilter = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_SAVED_FILTER', payload: index });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      setTheme,
      setAnalyticsFilters,
      saveFilter,
      removeSavedFilter,
      resetFilters,
      setLoading,
      setError,
    }),
    [state, setTheme, setAnalyticsFilters, saveFilter, removeSavedFilter, resetFilters, setLoading, setError]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
