import { useState, useMemo, useCallback } from 'react';
import { filterBySearch } from '../utils/filterHelpers';

export function useSearch<T>(
  data: T[],
  searchKeys: (keyof T)[],
  initialTerm = ''
) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);

  const filteredData = useMemo(
    () => filterBySearch(data, searchTerm, searchKeys),
    [data, searchTerm, searchKeys]
  );

  const clearSearch = useCallback(() => setSearchTerm(''), []);

  return {
    searchTerm,
    setSearchTerm,
    clearSearch,
    filteredData,
  };
}
