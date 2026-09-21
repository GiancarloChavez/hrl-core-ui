import { useCallback, useState } from "react";
function useFloatingTip() {
  const [tip, setTip] = useState(null);
  const follow = useCallback((e, title, body) => {
    setTip({ title, body, x: e.clientX, y: e.clientY });
  }, []);
  const anchor = useCallback((elemento, title, body) => {
    const r = elemento.getBoundingClientRect();
    setTip({ title, body, x: r.right, y: r.top + r.height / 2, gap: 8 });
  }, []);
  const hide = useCallback(() => setTip(null), []);
  return { tip, follow, anchor, hide };
}
export {
  useFloatingTip
};
//# sourceMappingURL=useFloatingTip.js.map
