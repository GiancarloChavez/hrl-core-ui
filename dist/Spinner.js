import { jsx, jsxs } from "react/jsx-runtime";
function Spinner({ text = "Cargando\u2026", height = 220 }) {
  return /* @__PURE__ */ jsxs("div", { className: "hrl-cargando", style: { minHeight: height }, role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ jsx("span", { className: "hrl-cargando__aro", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("span", { className: "hrl-cargando__texto", children: text })
  ] });
}
export {
  Spinner
};
//# sourceMappingURL=Spinner.js.map
