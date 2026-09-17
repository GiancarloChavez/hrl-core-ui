import { useCallback, useEffect, useRef, useState } from 'react';

/* Duración de las salidas. Más corta que las entradas a propósito: al cerrar
   algo, cualquier espera se percibe como lentitud. */
export const EXIT_MS = 200;

/* Retrasa el cierre real para que la salida se pueda animar.

   Vive dentro del componente que se cierra —el diálogo, el cajón— y no en
   quien lo monta: así los paneles siguen escribiendo `{abierto && <Dialog/>}`
   sin saber nada de la animación. */
export function useExitAnimation(onClose, ms = EXIT_MS) {
  const [leaving, setSaliendo] = useState(false);
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const close = useCallback(() => {
    /* Un segundo clic durante la salida no reinicia el temporizador. */
    if (temporizador.current) return;
    setSaliendo(true);
    temporizador.current = setTimeout(() => {
      /* Se deja listo para una próxima apertura: hay componentes que no se
         desmontan al cerrarse, como el aviso, que se reutiliza con el
         siguiente mensaje. */
      temporizador.current = null;
      setSaliendo(false);
      onClose?.();
    }, ms);
  }, [onClose, ms]);

  return { leaving, close };
}

/* Mantiene contenido montado mientras se anima su desaparición. Para lo que
   se abre y cierra con un booleano propio, como un bloque plegable. */
export function useMountedWhile(abierto, ms = EXIT_MS) {
  const [montado, setMontado] = useState(abierto);

  useEffect(() => {
    if (abierto) {
      setMontado(true);
      return undefined;
    }
    const t = setTimeout(() => setMontado(false), ms);
    return () => clearTimeout(t);
  }, [abierto, ms]);

  return { mounted: montado, leaving: montado && !abierto };
}

/* Mapa de filas desplegadas con fase de cierre.

   Las sub-tablas se pintan dentro de un `.map()`, donde no se puede usar un
   hook por fila; por eso el estado de cierre lo lleva el mapa: la clave pasa
   por 'cerrando' antes de desaparecer, y la fila se anima mientras dura. */
export function useExpandedRows(ms = EXIT_MS, { single = false } = {}) {
  const [mapa, setMapa] = useState({});

  useEffect(() => {
    const cerrando = Object.keys(mapa).filter((k) => mapa[k] === 'cerrando');
    if (cerrando.length === 0) return undefined;

    const t = setTimeout(() => {
      setMapa((m) => {
        const copia = { ...m };
        for (const k of cerrando) {
          if (copia[k] === 'cerrando') delete copia[k];
        }
        return copia;
      });
    }, ms);
    return () => clearTimeout(t);
  }, [mapa, ms]);

  const toggle = useCallback((clave) => {
    setMapa((m) => {
      const siguiente = m[clave] === 'abierta' ? 'cerrando' : 'abierta';
      /* En modo `single`, abrir una fila cierra las demás con su animación. */
      const base = single ? Object.fromEntries(Object.keys(m).map((c) => [c, 'cerrando'])) : m;
      return { ...base, [clave]: siguiente };
    });
  }, [single]);

  const openAll = useCallback((claves) => {
    setMapa(Object.fromEntries(claves.map((c) => [c, 'abierta'])));
  }, []);

  const closeAll = useCallback(() => {
    setMapa((m) => Object.fromEntries(Object.keys(m).map((c) => [c, 'cerrando'])));
  }, []);

  /* Sin animación: al cambiar de consulta las filas antiguas ya no existen. */
  const clear = useCallback(() => setMapa({}), []);

  return {
    isOpen: (clave) => Boolean(mapa[clave]),
    isLeaving: (clave) => mapa[clave] === 'cerrando',
    openCount: Object.values(mapa).filter((v) => v === 'abierta').length,
    toggle,
    openAll,
    closeAll,
    clear,
  };
}
