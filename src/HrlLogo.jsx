import { cx } from './variants.js';

/* Marca del Hospital Regional de Loreto.

   Los sistemas del hospital comparten una sola identidad, así que el logo viaja
   con el kit (assets/) en vez de copiarse —y desactualizarse— proyecto por
   proyecto. Se dibuja como fondo CSS: el bundler del proyecto empaqueta el
   archivo al importar tokens.css, sin configurar nada.

     variant   full (por defecto): escudo, nombre y hospital, en horizontal
               mark: solo el escudo, cuadrado
     width     ancho en px o cualquier medida CSS; la altura sale de la proporción
     label     texto alternativo (el nombre del hospital por defecto)

   En el tema oscuro el logo se asienta sobre una placa clara: sus verdes
   oscuros no se leen sobre un fondo oscuro. */
export function HrlLogo({ variant = 'full', width, label = 'Hospital Regional de Loreto', className, style }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cx('hrl-logo', variant === 'mark' && 'hrl-logo--escudo', className)}
      style={width == null ? style : { '--hrl-logo-ancho': typeof width === 'number' ? `${width}px` : width, ...style }}
    />
  );
}
