import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useExitAnimation, EXIT_MS } from "./useExitAnimation.js";
function Toast({ message, onClose, duration = 3600 }) {
  const { leaving, close } = useExitAnimation(onClose);
  useEffect(() => {
    if (!message) return void 0;
    const t = setTimeout(close, Math.max(0, duration - EXIT_MS));
    return () => clearTimeout(t);
  }, [message, close, duration]);
  if (!message) return null;
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: `hrl-portal hrl-toast${leaving ? " hrl-toast--saliendo" : ""}`, role: "status", children: [
      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", style: { color: "var(--success-text)", flex: "0 0 auto" }, "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", fill: "currentColor", opacity: "0.24" }),
        /* @__PURE__ */ jsx("path", { d: "M7.5 12.5l3 3 6-6.5", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
      ] }),
      message
    ] }),
    document.body
  );
}
export {
  Toast
};
//# sourceMappingURL=Toast.js.map
