import { useState } from 'react';
import { DataTable } from './DataTable.jsx';
import { Pagination } from './Pagination.jsx';
import { sortRows } from './sort.js';
import { usePagination, ROWS_PER_PAGE } from './paginate.js';

/* Tabla con orden y paginación de diez filas. Recibe la lista completa y se
   encarga del recorte: así el orden se aplica sobre todos los registros y no
   solo sobre los visibles, que es el error habitual al paginar a mano. */
export function PaginatedTable({
  columns,
  rows,
  sort,
  onSortChange,
  rowKey,
  legend,
  empty,
  accent = 'var(--accent)',
  perPage = ROWS_PER_PAGE,
  presorted = false,
  loading = false,
  /* Si es true, el paginador ofrece cambiar las filas por página. */
  resizable = false,
}) {
  const [tamano, setTamano] = useState(perPage);
  /* `presorted` para las tablas cuyo orden inicial usa una clave que no es
     ninguna columna visible: reordenar aquí con `columns` la trataría como
     texto y cambiaría el orden que el panel quiso dar. */
  const ordenadas = sort && !presorted ? sortRows(rows, sort, columns) : rows;
  const pag = usePagination(ordenadas, resizable ? tamano : perPage);

  return (
    <>
      <DataTable
        columns={columns}
        rows={pag.pageRows}
        sort={sort}
        onSortChange={(s) => {
          /* Reordenar cambia qué fila es la primera: volver al inicio evita
             quedarse mirando una página intermedia de otro orden. */
          pag.goTo(1);
          onSortChange?.(s);
        }}
        rowKey={rowKey}
        legend={legend}
        empty={empty}
        cambiando={pag.changing}
        loading={loading}
      />
      {pag.hasPages && (
        <Pagination
          page={pag.page}
          totalPages={pag.pages}
          perPage={pag.perPage}
          totalItems={pag.total}
          accent={accent}
          onChange={pag.goTo}
          onPerPageChange={resizable ? setTamano : undefined}
        />
      )}
    </>
  );
}

/* Paginator suelto, para las tablas escritas a mano que no pasan por
   DataTable. Se alimenta del mismo hook. */
export function Paginator({ state, accent = 'var(--accent)' }) {
  if (!state.hasPages) return null;
  return (
    <Pagination
      page={state.page}
      totalPages={state.pages}
      perPage={state.perPage}
      totalItems={state.total}
      accent={accent}
      onChange={state.goTo}
    />
  );
}
