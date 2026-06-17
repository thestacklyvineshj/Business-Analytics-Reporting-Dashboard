export function exportToCsv<T>(
  data: T[],
  columns: { key: string; label: string; getValue?: (row: T) => string | number }[],
  filename: string
): void {
  if (data.length === 0) return;

  const headers = columns.map((col) => col.label);
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = col.getValue
        ? col.getValue(row)
        : String((row as Record<string, unknown>)[col.key] ?? '');
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
