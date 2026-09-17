import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
function interpretar(texto) {
  const limpio = texto.trim().replace(",", ".");
  if (limpio === "") return null;
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
}
function NumberCell({
  value,
  onChange,
  "aria-label": etiqueta,
  width = 96,
  error = false,
  disabled = false,
  suffix,
  placeholder = "\u2014"
}) {
  if (!etiqueta && !disabled && import.meta.env?.DEV) {
    console.warn("NumberCell sin aria-label: una casilla de rejilla no tiene etiqueta visible.");
  }
  const [texto, setTexto] = useState(value == null ? "" : String(value));
  const [previo, setPrevio] = useState(value);
  if (value !== previo) {
    setPrevio(value);
    if (interpretar(texto) !== (value ?? null)) setTexto(value == null ? "" : String(value));
  }
  return /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        className: `hrl-input-mini${error ? " hrl-input-mini--error" : ""}`,
        style: { width, textAlign: "right" },
        type: "text",
        inputMode: "decimal",
        autoComplete: "off",
        "aria-label": etiqueta,
        "aria-invalid": error || void 0,
        disabled,
        placeholder,
        value: texto,
        onChange: (e) => {
          setTexto(e.target.value);
          onChange?.(interpretar(e.target.value));
        }
      }
    ),
    suffix && /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--text-sm)", color: "var(--muted-foreground)" }, children: suffix })
  ] });
}
export {
  NumberCell
};
//# sourceMappingURL=NumberCell.js.map
