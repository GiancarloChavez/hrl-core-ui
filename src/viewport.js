/* Ancho del área donde puede dibujarse un elemento fijo.

   No es window.innerWidth: ese cuenta la barra de desplazamiento y el hueco
   que reserva `scrollbar-gutter: stable` (tokens.css lo pone en <html>), y en
   algunos navegadores también lo cuenta clientWidth. El bloque contenedor de un
   `position: fixed` no incluye ninguno de los dos, así que calcular con
   innerWidth deja tooltips y menús hasta 15 px fuera del área visible. */
export function anchoVisible() {
  const html = document.documentElement.getBoundingClientRect().width;
  return Math.min(window.innerWidth, html || window.innerWidth);
}
