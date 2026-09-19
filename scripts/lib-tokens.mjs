/* Lectura y resolución de tokens.json, compartida entre generate-tokens.mjs
   y check-contrast.mjs. No se toca tokens.css ni preset.js desde aquí — solo
   lee y resuelve. */
import { readFileSync } from 'node:fs';

export function cargarTokens(ruta = 'tokens.json') {
  const data = JSON.parse(readFileSync(ruta, 'utf8'));

  const lightFlat = {};
  for (const grupo of data.light) Object.assign(lightFlat, grupo.tokens);
  const darkFlat = {};
  for (const grupo of data.dark.groups) Object.assign(darkFlat, grupo.tokens);

  function valorCrudo(nombre, tema) {
    const v = (tema === 'dark' && nombre in darkFlat) ? darkFlat[nombre] : lightFlat[nombre];
    if (v === undefined) throw new Error(`Token no declarado: --${nombre}`);
    return v;
  }

  /* Resuelve TODAS las referencias `var(--x)` dentro de un valor hasta dejar
     solo literales — cubre el caso simple (`var(--brand)`) y uno compuesto
     (`var(--duration-fast) var(--ease)`). */
  function resolverValor(valor, tema, visitados) {
    return valor.replace(/var\(--([a-z0-9-]+)\)/g, (_, ref) => {
      if (visitados.has(ref)) throw new Error(`Referencia circular en --${ref}`);
      return resolverValor(valorCrudo(ref, tema), tema, new Set(visitados).add(ref));
    });
  }

  function resolver(nombre, tema) {
    return resolverValor(valorCrudo(nombre, tema), tema, new Set([nombre]));
  }

  return { data, lightFlat, darkFlat, resolver };
}
