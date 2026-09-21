/* Nombres obsoletos de la API pública.

   Toda la API del kit está en inglés (design.md § 7). Los nombres que antes
   estaban en español se siguen aceptando para no romper a quien ya los usa,
   pero avisan una vez por nombre en desarrollo y se retiran en la próxima
   versión mayor. */
import { ICON_ALIASES } from './icon-catalog.js';

/* Valores de prop en español que la API tuvo antes de pasar a inglés, por
   componente y prop. `itemTone` es el `tone` de cada elemento de `items`. Es la
   única fuente: los componentes la leen para aceptarlos y `hrl-core-ui doctor`
   para encontrarlos y corregirlos en un proyecto. */
export const PROP_ALIASES = Object.freeze({
  IconButton: Object.freeze({ tone: Object.freeze({ plano: 'plain', accion: 'action' }) }),
  DropdownMenu: Object.freeze({
    align: Object.freeze({ derecha: 'right', izquierda: 'left' }),
    itemTone: Object.freeze({ peligro: 'danger' }),
  }),
});

export const DEPRECATED = Object.freeze({ icons: ICON_ALIASES, props: PROP_ALIASES });

const avisados = new Set();

export function aliasObsoleto(alias, valor, donde) {
  const actual = alias[valor];
  if (actual === undefined) return valor;

  const clave = `${donde}:${valor}`;
  if (import.meta.env?.DEV && !avisados.has(clave)) {
    avisados.add(clave);
    console.warn(`${donde}: «${valor}» está obsoleto y se retirará en la próxima versión mayor; usa «${actual}».`);
  }
  return actual;
}
