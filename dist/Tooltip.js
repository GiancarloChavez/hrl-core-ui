import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { createPortal } from "react-dom";
const MARGEN = 12;
const ANCHO_MAX = 320;
const ALTO_RESERVA = 150;
function acotarX(x) {
  const mitad = ANCHO_MAX / 2;
  return Math.min(Math.max(x, mitad + MARGEN), window.innerWidth - mitad - MARGEN);
}
function ubicar(x, y) {
  const espacioArriba = y;
  const espacioAbajo = window.innerHeight - y;
  const arribaCabe = espacioArriba >= ALTO_RESERVA + MARGEN;
  const haciaAbajo = !arribaCabe && (espacioAbajo >= ALTO_RESERVA + MARGEN || espacioAbajo > espacioArriba);
  return {
    left: acotarX(x),
    top: Math.min(Math.max(y, MARGEN), window.innerHeight - MARGEN),
    haciaAbajo
  };
}
function FloatingTip({ tip }) {
  if (!tip) return null;
  const { left, top, haciaAbajo } = ubicar(tip.x, tip.y);
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `hrl-portal hrl-tip${haciaAbajo ? " hrl-tip--abajo" : ""}`,
        style: { left, top },
        role: "tooltip",
        children: [
          tip.title && /* @__PURE__ */ jsx("strong", { className: "hrl-tip__title", children: tip.title }),
          tip.body
        ]
      }
    ),
    document.body
  );
}
function Tooltip({ title, body, children, as: Etiqueta = "span", focusable = true, style }) {
  const [pos, setPos] = useState(null);
  const mover = (e) => setPos({ x: e.clientX, y: e.clientY - 18 });
  const alEnfocar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top - 6 });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Etiqueta,
      {
        style: { display: "inline-flex", alignItems: "center", gap: 6, ...style },
        onMouseEnter: mover,
        onMouseMove: mover,
        onMouseLeave: () => setPos(null),
        onFocus: alEnfocar,
        onBlur: () => setPos(null),
        tabIndex: focusable ? 0 : void 0,
        children
      }
    ),
    /* @__PURE__ */ jsx(FloatingTip, { tip: pos ? { title, body, x: pos.x, y: pos.y } : null })
  ] });
}
export {
  FloatingTip,
  Tooltip
};
//# sourceMappingURL=Tooltip.js.map
