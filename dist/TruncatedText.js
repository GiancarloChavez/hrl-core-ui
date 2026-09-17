import { jsx } from "react/jsx-runtime";
import { Tooltip } from "./Tooltip.js";
function TruncatedText({ text, width, label, empty = "\u2014" }) {
  const contenido = text || "";
  if (!contenido) {
    return /* @__PURE__ */ jsx("span", { className: "hrl-trunc", children: empty });
  }
  return /* @__PURE__ */ jsx(
    Tooltip,
    {
      title: label,
      body: contenido,
      focusable: false,
      style: { display: "block", minWidth: 0, maxWidth: width },
      children: /* @__PURE__ */ jsx("span", { className: "hrl-trunc", style: width ? { maxWidth: width } : void 0, children: contenido })
    }
  );
}
export {
  TruncatedText
};
//# sourceMappingURL=TruncatedText.js.map
