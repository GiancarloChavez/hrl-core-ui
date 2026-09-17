import { jsx, jsxs } from "react/jsx-runtime";
import { Tooltip } from "./Tooltip.js";
const SEVERIDAD = {
  neutral: "var(--accent)",
  normal: "var(--success)",
  suspect: "var(--warning)",
  abnormal: "var(--destructive)",
  nodata: "var(--subtle-foreground)"
};
const GLIFO = {
  neutral: "M12 8v8M8 12h8",
  normal: "M7.5 12.5l3 3 6-6.5",
  suspect: "M12 8v5M12 16.5h0",
  abnormal: "M12 7.5v6M12 16.6h0",
  nodata: "M8.5 12h7"
};
function StatCard({ label = "M\xE9trica", value = "\u2014", note, severity = "neutral", percent, delay = 0, info, onClick }) {
  const color = SEVERIDAD[severity] ?? SEVERIDAD.neutral;
  const conBarra = typeof percent === "number";
  const pct = conBarra ? Math.max(0, Math.min(100, percent)) : 0;
  const Etiqueta = onClick ? "button" : "article";
  return /* @__PURE__ */ jsxs(
    Etiqueta,
    {
      type: onClick ? "button" : void 0,
      className: `hrl-stat${onClick ? " hrl-stat--clic" : ""}`,
      style: { "--sev": color, "--delay": `${delay}ms`, "--pct": `${pct}%` },
      onClick,
      "aria-label": onClick ? `${label}: ${value}` : void 0,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "hrl-stat__top", children: [
          info ? /* @__PURE__ */ jsx(Tooltip, { title: label, body: info, focusable: !onClick, children: /* @__PURE__ */ jsxs("span", { className: "hrl-stat__label hrl-stat__label--info", children: [
            label,
            /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7.8", r: "1.3", fill: "currentColor" }),
              /* @__PURE__ */ jsx("path", { d: "M12 11v6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
            ] })
          ] }) }) : /* @__PURE__ */ jsx("span", { className: "hrl-stat__label", children: label }),
          /* @__PURE__ */ jsx("span", { className: "hrl-stat__icon", children: /* @__PURE__ */ jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", fill: "currentColor", opacity: "0.2" }),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: GLIFO[severity] ?? GLIFO.neutral,
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("strong", { className: "hrl-stat__value", children: value }),
        conBarra && /* @__PURE__ */ jsx("div", { className: "hrl-stat__track", children: /* @__PURE__ */ jsx("span", { className: "hrl-stat__bar" }) }),
        note && /* @__PURE__ */ jsx("span", { className: "hrl-stat__note", children: note })
      ]
    }
  );
}
export {
  StatCard
};
//# sourceMappingURL=StatCard.js.map
