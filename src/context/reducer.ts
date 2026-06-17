import type { AppAction, AppState } from '../types';

export const initialState: AppState = {
  theme: 'light',
  analyticsFilters: {
    dateRange: { startDate: '2024-01-01', endDate: '2025-12-31' },
    category: 'all',
    region: 'all',
  },
  savedFilters: [],
  isLoading: false,
  error: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_ANALYTICS_FILTERS':
      return { ...state, analyticsFilters: action.payload };
    case 'SAVE_FILTER':
      return { ...state, savedFilters: [...state.savedFilters, action.payload] };
    case 'REMOVE_SAVED_FILTER':
      return {
        ...state,
        savedFilters: state.savedFilters.filter((_, i) => i !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_FILTERS':
      return { ...state, analyticsFilters: initialState.analyticsFilters };
    default:
      return state;
  }
}
