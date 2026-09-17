import { jsx, jsxs } from "react/jsx-runtime";
import { Icon } from "./icons.js";
const TONOS = {
  info: { icono: "sh-info", clase: "hrl-aviso-info" },
  success: { icono: "sh-ok", clase: "hrl-aviso hrl-aviso--ok" },
  warning: { icono: "sh-warn", clase: "hrl-aviso" },
  error: { icono: "sh-close", clase: "hrl-error" }
};
function Alert({ tone = "info", title, children, action }) {
  const t = TONOS[tone] ?? TONOS.info;
  return /* @__PURE__ */ jsxs("div", { className: t.clase, role: tone === "error" ? "alert" : "status", children: [
    /* @__PURE__ */ jsx(Icon, { name: t.icono, size: 18 }),
    /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
      title && /* @__PURE__ */ jsx("strong", { style: { display: "block", fontSize: "var(--text-md)" }, children: title }),
      children && /* @__PURE__ */ jsx("p", { style: { margin: title ? "4px 0 0" : 0, fontWeight: 400, lineHeight: "var(--leading-normal)" }, children })
    ] }),
    action
  ] });
}
export {
  Alert
};
//# sourceMappingURL=Alert.js.map
