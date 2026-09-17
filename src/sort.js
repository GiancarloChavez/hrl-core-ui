/* Primer clic: descendente en columnas numéricas, ascendente en texto.
   El segundo clic invierte. */
export function nextSort(sort, columna) {
  if (sort?.key === columna.key) {
    return { key: columna.key, dir: sort.dir === 'asc' ? 'desc' : 'asc' };
  }
  return { key: columna.key, dir: columna.numeric ? 'desc' : 'asc' };
}

export function sortRows(rows, sort, columns) {
  if (!sort?.key) return rows;
  const col = columns.find((c) => c.key === sort.key);
  const signo = sort.dir === 'asc' ? 1 : -1;

  return [...rows].sort((a, b) => {
    const va = a[sort.key];
    const vb = b[sort.key];
    if (col?.numeric) return (Number(va) - Number(vb)) * signo;
    return String(va ?? '').localeCompare(String(vb ?? ''), 'es', { sensitivity: 'base' }) * signo;
  });
}
