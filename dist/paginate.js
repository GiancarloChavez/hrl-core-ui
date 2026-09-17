import { useCallback, useEffect, useRef, useState } from "react";
import { EXIT_MS } from "./useExitAnimation.js";
const ROWS_PER_PAGE = 10;
const PAGE_SIZES = [10, 25, 50, 100];
const MS_CAMBIO_PAGINA = Math.round(EXIT_MS * 0.65);
function usePagination(rows, perPage = ROWS_PER_PAGE) {
  const [page, setPagina] = useState(1);
  const [changing, setCambiando] = useState(false);
  const temporizador = useRef(null);
  useEffect(() => () => clearTimeout(temporizador.current), []);
  const goTo = useCallback((n) => {
    clearTimeout(temporizador.current);
    setCambiando(true);
    temporizador.current = setTimeout(() => {
      temporizador.current = null;
      setPagina(n);
      setCambiando(false);
    }, MS_CAMBIO_PAGINA);
  }, []);
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const actual = Math.min(Math.max(1, page), pages);
  return {
    pageRows: rows.slice((actual - 1) * perPage, actual * perPage),
    page: actual,
    pages,
    total,
    perPage,
    goTo,
    changing,
    /* Con diez filas o menos el paginador no aporta nada y solo añade ruido. */
    hasPages: total > perPage
  };
}
export {
  PAGE_SIZES,
  ROWS_PER_PAGE,
  usePagination
};
//# sourceMappingURL=paginate.js.map
