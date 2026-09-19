import { useEffect, useState } from 'react';

/* El tema vive como atributo en <html>, no en el estado de React: cambia
   desde el selector de Ladle, fuera del árbol de la historia. Las muestras
   de color leen el valor calculado del navegador, así que necesitan
   enterarse de ese cambio para volver a leerlo. */
export function useTemaHrl() {
  const [tema, setTema] = useState(() => document.documentElement.dataset.temaHrl ?? 'claro');

  useEffect(() => {
    const observador = new MutationObserver(() => {
      setTema(document.documentElement.dataset.temaHrl ?? 'claro');
    });
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema-hrl'] });
    return () => observador.disconnect();
  }, []);

  return tema;
}
