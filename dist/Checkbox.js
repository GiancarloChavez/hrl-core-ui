import { jsx, jsxs } from "react/jsx-runtime";
function Checkbox({ checked = false, onChange, label, "aria-label": etiqueta, disabled = false }) {
  if (!label && !etiqueta && import.meta.env?.DEV) {
    console.warn("Checkbox sin etiqueta: necesita `label` o `aria-label`.");
  }
  return /* @__PURE__ */ jsxs(
    "label",
    {
      className: "hrl-check",
      style: { alignItems: "center", minHeight: "var(--touch-target)", cursor: disabled ? "not-allowed" : "pointer" },
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked,
            disabled,
            "aria-label": label ? void 0 : etiqueta,
            onChange: (e) => onChange?.(e.target.checked),
            style: { marginTop: 0 }
          }
        ),
        label && /* @__PURE__ */ jsx("span", { children: label })
      ]
    }
  );
}
export {
  Checkbox
};
//# sourceMappingURL=Checkbox.js.map
