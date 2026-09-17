import { jsx, jsxs } from "react/jsx-runtime";
import { Icon } from "./icons.js";
function EmptyState({ icon = "sh-lines", tone = "var(--subtle-foreground)", title, body, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "hrl-empty", children: [
    /* @__PURE__ */ jsx("span", { className: "hrl-empty__icon", style: { "--tone": tone }, children: /* @__PURE__ */ jsx(Icon, { name: icon, size: 30 }) }),
    /* @__PURE__ */ jsx("strong", { className: "hrl-empty__title", children: title }),
    body && /* @__PURE__ */ jsx("p", { className: "hrl-empty__body", children: body }),
    children
  ] });
}
export {
  EmptyState
};
//# sourceMappingURL=EmptyState.js.map
