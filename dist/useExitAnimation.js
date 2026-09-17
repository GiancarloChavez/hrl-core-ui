import { useCallback, useEffect, useRef, useState } from "react";
const EXIT_MS = 200;
function useExitAnimation(onClose, ms = EXIT_MS) {
  const [leaving, setSaliendo] = useState(false);
  const temporizador = useRef(null);
  useEffect(() => () => clearTimeout(temporizador.current), []);
  const close = useCallback(() => {
    if (temporizador.current) return;
    setSaliendo(true);
    temporizador.current = setTimeout(() => {
      temporizador.current = null;
      setSaliendo(false);
      onClose?.();
    }, ms);
  }, [onClose, ms]);
  return { leaving, close };
}
function useMountedWhile(abierto, ms = EXIT_MS) {
  const [montado, setMontado] = useState(abierto);
  useEffect(() => {
    if (abierto) {
      setMontado(true);
      return void 0;
    }
    const t = setTimeout(() => setMontado(false), ms);
    return () => clearTimeout(t);
  }, [abierto, ms]);
  return { mounted: montado, leaving: montado && !abierto };
}
function useExpandedRows(ms = EXIT_MS, { single = false } = {}) {
  const [mapa, setMapa] = useState({});
  useEffect(() => {
    const cerrando = Object.keys(mapa).filter((k) => mapa[k] === "cerrando");
    if (cerrando.length === 0) return void 0;
    const t = setTimeout(() => {
      setMapa((m) => {
        const copia = { ...m };
        for (const k of cerrando) {
          if (copia[k] === "cerrando") delete copia[k];
        }
        return copia;
      });
    }, ms);
    return () => clearTimeout(t);
  }, [mapa, ms]);
  const toggle = useCallback((clave) => {
    setMapa((m) => {
      const siguiente = m[clave] === "abierta" ? "cerrando" : "abierta";
      const base = single ? Object.fromEntries(Object.keys(m).map((c) => [c, "cerrando"])) : m;
      return { ...base, [clave]: siguiente };
    });
  }, [single]);
  const openAll = useCallback((claves) => {
    setMapa(Object.fromEntries(claves.map((c) => [c, "abierta"])));
  }, []);
  const closeAll = useCallback(() => {
    setMapa((m) => Object.fromEntries(Object.keys(m).map((c) => [c, "cerrando"])));
  }, []);
  const clear = useCallback(() => setMapa({}), []);
  return {
    isOpen: (clave) => Boolean(mapa[clave]),
    isLeaving: (clave) => mapa[clave] === "cerrando",
    openCount: Object.values(mapa).filter((v) => v === "abierta").length,
    toggle,
    openAll,
    closeAll,
    clear
  };
}
export {
  EXIT_MS,
  useExitAnimation,
  useExpandedRows,
  useMountedWhile
};
//# sourceMappingURL=useExitAnimation.js.map
