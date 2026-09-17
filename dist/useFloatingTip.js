import { useCallback, useState } from "react";
function useFloatingTip() {
  const [tip, setTip] = useState(null);
  const follow = useCallback((e, title, body) => {
    setTip({ title, body, x: e.clientX, y: e.clientY - 18 });
  }, []);
  const hide = useCallback(() => setTip(null), []);
  return { tip, follow, hide };
}
export {
  useFloatingTip
};
//# sourceMappingURL=useFloatingTip.js.map
