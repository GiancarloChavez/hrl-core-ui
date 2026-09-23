import { jsx } from "react/jsx-runtime";
import { cx } from "./variants.js";
function HrlLogo({ variant = "full", width, label = "Hospital Regional de Loreto", className, style }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      role: "img",
      "aria-label": label,
      className: cx("hrl-logo", variant === "mark" && "hrl-logo--escudo", className),
      style: width == null ? style : { "--hrl-logo-ancho": typeof width === "number" ? `${width}px` : width, ...style }
    }
  );
}
export {
  HrlLogo
};
//# sourceMappingURL=HrlLogo.js.map
