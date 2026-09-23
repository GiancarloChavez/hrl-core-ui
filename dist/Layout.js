import { jsx } from "react/jsx-runtime";
import { cx } from "./variants.js";
const ALINEACION = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
const REPARTO = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" };
function Stack({
  direction = "column",
  gap = 4,
  align,
  justify,
  wrap = false,
  as: Etiqueta = "div",
  className,
  style,
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsx(
    Etiqueta,
    {
      className: cx("hrl-stack", direction === "row" && "hrl-stack--fila", wrap && "hrl-stack--envuelta", className),
      style: {
        "--hrl-gap": `var(--space-${gap})`,
        alignItems: ALINEACION[align],
        justifyContent: REPARTO[justify],
        ...style
      },
      ...rest,
      children
    }
  );
}
function Grid({
  min = 240,
  columns,
  gap = 4,
  as: Etiqueta = "div",
  className,
  style,
  children,
  ...rest
}) {
  const columnas = columns ? `repeat(${columns}, minmax(0, 1fr))` : `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`;
  return /* @__PURE__ */ jsx(
    Etiqueta,
    {
      className: cx("hrl-grid", className),
      style: { "--hrl-gap": `var(--space-${gap})`, gridTemplateColumns: columnas, ...style },
      ...rest,
      children
    }
  );
}
export {
  Grid,
  Stack
};
//# sourceMappingURL=Layout.js.map
