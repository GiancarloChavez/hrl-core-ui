/* Nombres obsoletos de la API pública.

   Toda la API del kit está en inglés (design.md § 7). Los nombres que antes
   estaban en español se siguen aceptando para no romper a quien ya los usa,
   pero avisan una vez por nombre en desarrollo y se retiran en la próxima
   versión mayor. */
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
