import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icons.js";
import { aliasObsoleto } from "./deprecated.js";
const ALIGN_ALIASES = { derecha: "right", izquierda: "left" };
const TONE_ALIASES = { peligro: "danger" };
function DropdownMenu({ trigger, items = [], align: alineacionPedida = "right", label = "Men\xFA de acciones" }) {
  const align = aliasObsoleto(ALIGN_ALIASES, alineacionPedida, "DropdownMenu");
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState(null);
  const [activo, setActivo] = useState(-1);
  const refDisparador = useRef(null);
  const refMenu = useRef(null);
  const id = useId();
  const seleccionables = items.filter((i) => !i.separator && !i.disabled);
  const cerrar = useCallback((devolverFoco = true) => {
    setAbierto(false);
    setActivo(-1);
    if (devolverFoco) refDisparador.current?.focus();
  }, []);
  const abrir = () => {
    const r = refDisparador.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ top: r.bottom + 6, left: align === "right" ? r.right : r.left, align });
    setAbierto(true);
  };
  useEffect(() => {
    if (!abierto) return void 0;
    const alTeclear = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        cerrar();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActivo((v) => (v + 1) % seleccionables.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActivo((v) => v <= 0 ? seleccionables.length - 1 : v - 1);
      } else if (e.key === "Tab") {
        cerrar(false);
      }
    };
    const alPulsarFuera = (e) => {
      if (refMenu.current?.contains(e.target) || refDisparador.current?.contains(e.target)) return;
      cerrar(false);
    };
    const alMover = () => cerrar(false);
    window.addEventListener("keydown", alTeclear, true);
    window.addEventListener("mousedown", alPulsarFuera);
    window.addEventListener("scroll", alMover, true);
    window.addEventListener("resize", alMover);
    return () => {
      window.removeEventListener("keydown", alTeclear, true);
      window.removeEventListener("mousedown", alPulsarFuera);
      window.removeEventListener("scroll", alMover, true);
      window.removeEventListener("resize", alMover);
    };
  }, [abierto, cerrar, seleccionables.length]);
  useEffect(() => {
    if (abierto && activo >= 0) {
      refMenu.current?.querySelectorAll('[role="menuitem"]')[activo]?.focus();
    }
  }, [abierto, activo]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        ref: refDisparador,
        onClick: () => abierto ? cerrar() : abrir(),
        onKeyDown: (e) => {
          if (e.key === "ArrowDown" && !abierto) {
            e.preventDefault();
            abrir();
            setActivo(0);
          }
        },
        style: { display: "inline-flex" },
        "aria-haspopup": "menu",
        "aria-expanded": abierto,
        "aria-controls": abierto ? id : void 0,
        children: trigger
      }
    ),
    abierto && pos && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          id,
          ref: refMenu,
          className: "hrl-portal hrl-menu",
          role: "menu",
          "aria-label": label,
          style: {
            top: pos.top,
            left: pos.align === "right" ? void 0 : pos.left,
            right: pos.align === "right" ? window.innerWidth - pos.left : void 0
          },
          children: items.map(
            (item, i) => item.separator ? /* @__PURE__ */ jsx("span", { className: "hrl-menu__separador", role: "separator" }, `sep-${i}`) : /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: `hrl-menu__item${aliasObsoleto(TONE_ALIASES, item.tone, "DropdownMenu") === "danger" ? " hrl-menu__item--peligro" : ""}`,
                disabled: item.disabled,
                onClick: () => {
                  item.onSelect?.();
                  cerrar();
                },
                children: [
                  item.icon && /* @__PURE__ */ jsx(Icon, { name: item.icon, size: 16 }),
                  /* @__PURE__ */ jsx("span", { style: { flex: 1, textAlign: "left" }, children: item.label }),
                  item.shortcut && /* @__PURE__ */ jsx("span", { className: "hrl-menu__atajo", children: item.shortcut })
                ]
              },
              item.id ?? item.label
            )
          )
        }
      ),
      document.body
    )
  ] });
}
export {
  DropdownMenu
};
//# sourceMappingURL=DropdownMenu.js.map
