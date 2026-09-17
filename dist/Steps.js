import { jsx, jsxs } from "react/jsx-runtime";
import { Icon } from "./icons.js";
const ESTADOS = {
  empty: { icono: "sh-none", color: "var(--subtle-foreground)" },
  partial: { icono: "sh-clock", color: "var(--warning-fg)" },
  ok: { icono: "sh-ok", color: "var(--success-text)" },
  error: { icono: "sh-crit", color: "var(--destructive-text)" }
};
function Steps({ steps = [], active, onChange, label = "Pasos del formulario" }) {
  return /* @__PURE__ */ jsx("div", { className: "hrl-pasos", role: "tablist", "aria-label": label, children: steps.map((paso, i) => {
    const marca = ESTADOS[paso.status] ?? ESTADOS.empty;
    const seleccionado = paso.key === active;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": seleccionado,
        className: `hrl-paso${seleccionado ? " hrl-paso--on" : ""}`,
        onClick: () => onChange?.(paso.key),
        children: [
          /* @__PURE__ */ jsx("span", { className: "hrl-paso__num", "aria-hidden": "true", children: i + 1 }),
          /* @__PURE__ */ jsxs("span", { className: "hrl-paso__texto", children: [
            /* @__PURE__ */ jsx("span", { className: "hrl-paso__titulo", children: paso.title }),
            /* @__PURE__ */ jsxs("span", { className: "hrl-paso__nota", style: { color: marca.color }, children: [
              /* @__PURE__ */ jsx(Icon, { name: marca.icono, size: 14 }),
              paso.note
            ] })
          ] })
        ]
      },
      paso.key
    );
  }) });
}
export {
  Steps
};
//# sourceMappingURL=Steps.js.map
