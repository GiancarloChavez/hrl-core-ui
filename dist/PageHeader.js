import { jsx, jsxs } from "react/jsx-runtime";
import { Icon } from "./icons.js";
import { PAGE_ACTIONS_ID } from "./PageActions.js";
function PageHeader({ title, description, breadcrumbs = [], actions }) {
  return /* @__PURE__ */ jsxs("header", { className: "hrl-pagehead", children: [
    /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
      breadcrumbs.length > 0 && /* @__PURE__ */ jsx("nav", { className: "hrl-migas", "aria-label": "Ruta de navegaci\xF3n", children: breadcrumbs.map((m, i) => {
        const ultimo = i === breadcrumbs.length - 1;
        return /* @__PURE__ */ jsxs("span", { className: "hrl-migas__paso", children: [
          i > 0 && /* @__PURE__ */ jsx(Icon, { name: "sh-chevron", size: 12 }),
          ultimo || !m.href ? /* @__PURE__ */ jsx("span", { "aria-current": ultimo ? "page" : void 0, children: m.label }) : /* @__PURE__ */ jsx("a", { href: m.href, children: m.label })
        ] }, m.label);
      }) }),
      /* @__PURE__ */ jsx("h1", { children: title }),
      description && /* @__PURE__ */ jsx("p", { children: description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hrl-pagehead__acciones", id: PAGE_ACTIONS_ID, children: actions })
  ] });
}
export {
  PageHeader
};
//# sourceMappingURL=PageHeader.js.map
