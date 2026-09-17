import { useCallback, useEffect, useRef, useState } from 'react';
import { EXIT_MS } from './useExitAnimation.js';

/* Una sola cifra para todo el sistema: las tablas muestran diez filas y el
   resto se alcanza con el paginador. Cambiarla aquí la cambia en todas. */
export const ROWS_PER_PAGE = 10;

/* Tamaños de página que ofrece el paginador cuando la tabla deja cambiarlo. */
export const PAGE_SIZES = [10, 25, 50, 100];

/* Lo que dura el desvanecido de las filas al cambiar de página. Por debajo de
   EXIT_MS: es una transición dentro de la misma tabla, no un cierre. */
const MS_CAMBIO_PAGINA = Math.round(EXIT_MS * 0.65);

/* Recorta una lista ya ordenada a la página vigente.

   No reinicia la página con un efecto: acota el número al total de páginas, de
   modo que al filtrar o al cambiar de rango la vista cae sola en la última
   página disponible en lugar de quedarse en blanco. */
export function usePagination(rows, perPage = ROWS_PER_PAGE) {
  const [page, setPagina] = useState(1);
  const [changing, setCambiando] = useState(false);
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  /* Las filas visibles se apagan antes de sustituirse. Sin esto, cambiar de
     página reemplazaba el contenido de golpe mientras las rows nuevas
     entraban con su animación, y el salto se notaba. */
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
    hasPages: total > perPage,
  };
}
