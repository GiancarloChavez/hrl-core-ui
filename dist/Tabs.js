import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Tooltip } from "./Tooltip.js";
import { Icon } from "./icons.js";
function Tabs({ tabs, active, onChange, alerts = {}, style }) {
  const [vistas, setVistas] = useState(() => ({ [active]: true }));
  useEffect(() => {
    setVistas((v) => v[active] ? v : { ...v, [active]: true });
  }, [active]);
  return /* @__PURE__ */ jsx("div", { className: "hrl-tabs", style, children: tabs.map((p) => {
    const aviso = !vistas[p.key] ? alerts[p.key] : null;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: `hrl-tabs__btn${active === p.key ? " hrl-tabs__btn--on" : ""}`,
        onClick: () => onChange(p.key),
        "aria-current": active === p.key ? "true" : void 0,
        children: [
          p.icon && /* @__PURE__ */ jsx(Icon, { name: p.icon, size: 17 }),
          p.label,
          aviso && /* @__PURE__ */ jsx(Tooltip, { title: "Requiere atenci\xF3n", body: aviso, focusable: false, children: /* @__PURE__ */ jsx("span", { className: "hrl-punto-vivo", role: "img", "aria-label": `Requiere atenci\xF3n: ${aviso}` }) })
        ]
      },
      p.key
    );
  }) });
}
export {
  Tabs
};
//# sourceMappingURL=Tabs.js.map
