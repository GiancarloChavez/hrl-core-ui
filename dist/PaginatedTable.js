import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { DataTable } from "./DataTable.js";
import { Pagination } from "./Pagination.js";
import { sortRows } from "./sort.js";
import { usePagination, ROWS_PER_PAGE } from "./paginate.js";
function PaginatedTable({
  columns,
  rows,
  sort,
  onSortChange,
  rowKey,
  legend,
  empty,
  accent = "var(--accent)",
  perPage = ROWS_PER_PAGE,
  presorted = false,
  loading = false,
  /* Si es true, el paginador ofrece cambiar las filas por página. */
  resizable = false
}) {
  const [tamano, setTamano] = useState(perPage);
  const ordenadas = sort && !presorted ? sortRows(rows, sort, columns) : rows;
  const pag = usePagination(ordenadas, resizable ? tamano : perPage);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DataTable,
      {
        columns,
        rows: pag.pageRows,
        sort,
        onSortChange: (s) => {
          pag.goTo(1);
          onSortChange?.(s);
        },
        rowKey,
        legend,
        empty,
        cambiando: pag.changing,
        loading
      }
    ),
    pag.hasPages && /* @__PURE__ */ jsx(
      Pagination,
      {
        page: pag.page,
        totalPages: pag.pages,
        perPage: pag.perPage,
        totalItems: pag.total,
        accent,
        onChange: pag.goTo,
        onPerPageChange: resizable ? setTamano : void 0
      }
    )
  ] });
}
function Paginator({ state, accent = "var(--accent)" }) {
  if (!state.hasPages) return null;
  return /* @__PURE__ */ jsx(
    Pagination,
    {
      page: state.page,
      totalPages: state.pages,
      perPage: state.perPage,
      totalItems: state.total,
      accent,
      onChange: state.goTo
    }
  );
}
export {
  PaginatedTable,
  Paginator
};
//# sourceMappingURL=PaginatedTable.js.map
