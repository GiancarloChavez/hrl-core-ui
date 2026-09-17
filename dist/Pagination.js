import { jsx, jsxs } from "react/jsx-runtime";
import { PAGE_SIZES } from "./paginate.js";
function numeros(total, actual) {
  const salida = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - actual) <= 1) salida.push(i);
    else if (salida[salida.length - 1] !== "\u2026") salida.push("\u2026");
  }
  return salida;
}
function Pagination({
  page = 1,
  totalPages = 1,
  perPage = 20,
  totalItems = 0,
  accent = "var(--accent)",
  onChange,
  /* Opcional: si se pasa, aparece el selector de filas por página. */
  onPerPageChange,
  sizes = PAGE_SIZES
}) {
  const actual = Math.max(1, Math.min(totalPages, page));
  const ir = (n) => onChange?.(Math.max(1, Math.min(totalPages, n)));
  const botones = [
    { clave: "prev", etiqueta: "\xAB", ir: () => ir(actual - 1), off: actual === 1 },
    ...numeros(totalPages, actual).map((n, i) => ({
      clave: n === "\u2026" ? `gap-${i}` : `p-${n}`,
      etiqueta: String(n),
      ir: n === "\u2026" ? void 0 : () => ir(n),
      off: n === "\u2026",
      on: n === actual
    })),
    { clave: "next", etiqueta: "\xBB", ir: () => ir(actual + 1), off: actual === totalPages }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "hrl-pag", style: { "--accent": accent }, children: [
    /* @__PURE__ */ jsx("span", { className: "hrl-pag__counter", children: onPerPageChange ? `P\xE1gina ${actual} de ${totalPages} \xB7 ${totalItems.toLocaleString("es-PE")} registros` : `P\xE1gina ${actual} de ${totalPages} \xB7 ${perPage} por p\xE1gina \xB7 ${totalItems.toLocaleString("es-PE")} registros` }),
    onPerPageChange && /* @__PURE__ */ jsxs("label", { className: "hrl-pag__tamano", children: [
      "Filas por p\xE1gina",
      /* @__PURE__ */ jsx("select", { value: perPage, onChange: (e) => onPerPageChange(Number(e.target.value)), "aria-label": "Filas por p\xE1gina", children: sizes.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hrl-pag__pages", children: botones.map((b) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: `hrl-pag__btn${b.on ? " hrl-pag__btn--on" : ""}`,
        onClick: b.ir,
        disabled: b.off,
        children: b.etiqueta
      },
      b.clave
    )) })
  ] });
}
export {
  Pagination
};
//# sourceMappingURL=Pagination.js.map
