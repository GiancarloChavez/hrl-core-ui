import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function FilterBar({ children, actions, footer, columns }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "hrl-filtros-barra",
        style: columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : void 0,
        children: [
          children,
          actions && /* @__PURE__ */ jsx("div", { className: "hrl-filtros-barra__acciones", style: { gridColumn: "1 / -1", justifySelf: "end" }, children: actions })
        ]
      }
    ),
    footer && /* @__PURE__ */ jsx("div", { className: "hrl-chips-consulta", children: footer })
  ] });
}
export {
  FilterBar
};
//# sourceMappingURL=FilterBar.js.map
