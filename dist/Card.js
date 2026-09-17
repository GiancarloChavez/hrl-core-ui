import { jsx, jsxs } from "react/jsx-runtime";
function Card({ title = "Secci\xF3n", subtitle, total, accent, actions, flush = false, children }) {
  return /* @__PURE__ */ jsxs("section", { className: `hrl-section${flush ? " hrl-section--flush" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "hrl-section__head", children: [
      /* @__PURE__ */ jsxs("div", { className: "hrl-section__title-row", children: [
        accent && /* @__PURE__ */ jsx("span", { className: "hrl-section__accent", style: { "--accent": accent } }),
        /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ jsx("h3", { className: "hrl-section__title", children: title }),
          subtitle && /* @__PURE__ */ jsx("p", { className: "hrl-section__subtitle", children: subtitle })
        ] }),
        total && /* @__PURE__ */ jsxs("span", { className: "hrl-section__total", children: [
          "\xB7 ",
          total
        ] })
      ] }),
      actions && /* @__PURE__ */ jsx("div", { className: "hrl-section__acciones", children: actions })
    ] }),
    children
  ] });
}
export {
  Card
};
//# sourceMappingURL=Card.js.map
