import { cx } from './variants.js';

/* Primitivas de maquetación. Existen para que una pantalla no tenga que escribir
   `style={{ display: 'flex', gap: '1rem' }}`: en la primera migración completa a
   un proyecto real quedaron 67 estilos en línea de este tipo, cada uno con su
   propia separación. Aquí la separación sale de la escala `--space-1…6`.

   Stack   una fila o una columna con separación fija entre sus hijos
     direction  column (por defecto) | row
     gap        1…6 (4, 8, 12, 16, 24, 32 px); por defecto 4
     align      start | center | end | stretch | baseline
     justify    start | center | end | between
     wrap       en fila, permite pasar a otra línea
     as         etiqueta que se dibuja (div por defecto)

   Grid    una rejilla que reparte el ancho sin escribir columnas
     min        ancho mínimo de cada celda en px (240 por defecto): cuantas quepan
     columns    número fijo de columnas; si se da, `min` no se usa
     gap        1…6, por defecto 4 */

const ALINEACION = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' };
const REPARTO = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' };

export function Stack({
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  as: Etiqueta = 'div',
  className,
  style,
  children,
  ...rest
}) {
  return (
    <Etiqueta
      className={cx('hrl-stack', direction === 'row' && 'hrl-stack--fila', wrap && 'hrl-stack--envuelta', className)}
      style={{
        '--hrl-gap': `var(--space-${gap})`,
        alignItems: ALINEACION[align],
        justifyContent: REPARTO[justify],
        ...style,
      }}
      {...rest}
    >
      {children}
    </Etiqueta>
  );
}

export function Grid({
  min = 240,
  columns,
  gap = 4,
  as: Etiqueta = 'div',
  className,
  style,
  children,
  ...rest
}) {
  const columnas = columns
    ? `repeat(${columns}, minmax(0, 1fr))`
    : `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`;
  return (
    <Etiqueta
      className={cx('hrl-grid', className)}
      style={{ '--hrl-gap': `var(--space-${gap})`, gridTemplateColumns: columnas, ...style }}
      {...rest}
    >
      {children}
    </Etiqueta>
  );
}
