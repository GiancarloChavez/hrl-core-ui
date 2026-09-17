import { useCallback, useState } from 'react';

/* Estado compartido del tooltip para zonas con muchos objetivos: la matriz de
   producción tiene más de mil celdas y montar un componente por celda sería
   inviable. El prefijo `use` es requisito de React para los hooks. */
export function useFloatingTip() {
  const [tip, setTip] = useState(null);

  const follow = useCallback((e, title, body) => {
    setTip({ title, body, x: e.clientX, y: e.clientY - 18 });
  }, []);

  const hide = useCallback(() => setTip(null), []);

  return { tip, follow, hide };
}
