import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { FloatingTip } from "./Tooltip.js";
import { useFloatingTip } from "./useFloatingTip.js";
function SelectionStrip({ items = [], active, onChange, label = "Selecci\xF3n" }) {
  const { tip, follow, hide } = useFloatingTip();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "hrl-tira", role: "group", "aria-label": label, children: items.map((item) => {
      const titulo = item.tip?.title ?? item.title;
      const cuerpo = item.tip?.body ?? item.description ?? "";
      const anclar = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        follow({ clientX: r.left + r.width / 2, clientY: r.top }, titulo, cuerpo);
      };
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: `hrl-tira__item${item.key === active ? " hrl-tira__item--on" : ""}${item.marked ? " hrl-tira__item--marcado" : ""}`,
          "aria-pressed": item.key === active,
          "aria-label": item.description ?? item.title,
          onClick: () => onChange?.(item.key),
          onMouseEnter: (e) => cuerpo && follow(e, titulo, cuerpo),
          onMouseMove: (e) => cuerpo && follow(e, titulo, cuerpo),
          onMouseLeave: hide,
          onFocus: (e) => cuerpo && anclar(e),
          onBlur: hide,
          children: [
            /* @__PURE__ */ jsx("span", { className: "hrl-tira__titulo", children: item.title }),
            item.subtitle && /* @__PURE__ */ jsx("span", { className: "hrl-tira__sub", children: item.subtitle })
          ]
        },
        item.key
      );
    }) }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
export {
  SelectionStrip
};
//# sourceMappingURL=SelectionStrip.js.map
