import { useState, useMemo, useCallback } from 'react';
import { paginateData } from '../utils/filterHelpers';
import { DEFAULT_PAGE_SIZE } from '../constants';

export function usePagination<T>(data: T[], initialPageSize = DEFAULT_PAGE_SIZE) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedData = useMemo(
    () => paginateData(data, currentPage, pageSize),
    [data, currentPage, pageSize]
  );

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  return {
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
    setCurrentPage,
  };
}
