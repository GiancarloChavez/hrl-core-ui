import { useState } from 'react';
import { createPortal } from 'react-dom';

const MARGEN = 12;
const ANCHO_MAX = 320;
/* No se mide el DOM real antes de posicionar: este tooltip compartido se
   reubica en cada mousemove sobre superficies con miles de celdas (la matriz
   de producción), y medir ahí saldría caro. Esta altura es una cota amplia
   para decidir si cabe arriba, no la altura exacta de cada tooltip. */
const ALTO_RESERVA = 150;

/* Se mantiene dentro de la ventana: pegado al borde el tooltip se cortaba. */
function acotarX(x) {
  const mitad = ANCHO_MAX / 2;
  return Math.min(Math.max(x, mitad + MARGEN), window.innerWidth - mitad - MARGEN);
}

/* El tooltip se dibuja arriba del punto de anclaje por defecto (ver el
   `transform` en `.hrl-tip`). Cerca del borde superior de la ventana no hay
   sitio arriba, así que se voltea hacia abajo; si tampoco cabe abajo (ventana
   muy baja), se ancla al lado con más espacio y el `top` se recorta para que
   el punto de anclaje mismo nunca quede fuera de la ventana. */
function ubicar(x, y) {
  const espacioArriba = y;
  const espacioAbajo = window.innerHeight - y;
  const arribaCabe = espacioArriba >= ALTO_RESERVA + MARGEN;
  const haciaAbajo = !arribaCabe && (espacioAbajo >= ALTO_RESERVA + MARGEN || espacioAbajo > espacioArriba);

  return {
    left: acotarX(x),
    top: Math.min(Math.max(y, MARGEN), window.innerHeight - MARGEN),
    haciaAbajo,
  };
}

/* Capa flotante del tooltip. Una sola instancia alimentada con
   {title, body, x, y}: en la matriz de producción hay más de mil celdas y
   montar un componente por celda sería inviable. */
export function FloatingTip({ tip }) {
  if (!tip) return null;
  const { left, top, haciaAbajo } = ubicar(tip.x, tip.y);

  return createPortal(
    <div
      className={`hrl-portal hrl-tip${haciaAbajo ? ' hrl-tip--abajo' : ''}`}
      style={{ left, top }}
      role="tooltip"
    >
      {tip.title && <strong className="hrl-tip__title">{tip.title}</strong>}
      {tip.body}
    </div>,
    document.body,
  );
}

/* Envoltorio para objetivos puntuales. Sigue al cursor mientras esté encima y
   se cierra al salir.

   `focusable` en false cuando el contenido ya es focusable (un botón, un
   select): así no se crea un segundo punto de tabulación. El tooltip sigue
   apareciendo al enfocar, porque el evento focus burbujea hasta aquí.

   `style` se mezcla con el del envoltorio, para los casos en los que el
   objetivo ocupa toda una fila y el `inline-flex` por defecto lo encogería. */
export function Tooltip({ title, body, children, as: Etiqueta = 'span', focusable = true, style }) {
  const [pos, setPos] = useState(null);

  const mover = (e) => setPos({ x: e.clientX, y: e.clientY - 18 });

  const alEnfocar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top - 6 });
  };

  return (
    <>
      <Etiqueta
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...style }}
        onMouseEnter={mover}
        onMouseMove={mover}
        onMouseLeave={() => setPos(null)}
        onFocus={alEnfocar}
        onBlur={() => setPos(null)}
        tabIndex={focusable ? 0 : undefined}
      >
        {children}
      </Etiqueta>

      <FloatingTip tip={pos ? { title, body, x: pos.x, y: pos.y } : null} />
    </>
  );
}
