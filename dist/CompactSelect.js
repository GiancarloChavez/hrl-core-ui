import { jsx } from "react/jsx-runtime";
function CompactSelect({
  options = [],
  value,
  onChange,
  disabled,
  "aria-label": label,
  width
}) {
  if (!label && import.meta.env?.DEV) {
    console.warn("CompactSelect sin aria-label: un control sin label visible necesita nombre accesible.");
  }
  return /* @__PURE__ */ jsx(
    "select",
    {
      className: "hrl-select-mini",
      value,
      onChange,
      disabled,
      "aria-label": label,
      style: width ? { width } : void 0,
      children: options.map((o) => {
        const value2 = typeof o === "string" ? o : o.value;
        const text = typeof o === "string" ? o : o.label;
        return /* @__PURE__ */ jsx("option", { value: value2, children: text }, value2);
      })
    }
  );
}
export {
  CompactSelect
};
//# sourceMappingURL=CompactSelect.js.map
