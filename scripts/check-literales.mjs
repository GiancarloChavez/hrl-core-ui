/* Guardián de la escala tipográfica.

   Falla si un tamaño de fuente vuelve a escribirse como literal: todo
   `font-size` de tokens.css y todo `fontSize` de src/ tiene que salir de la
   escala (`var(--text-*)`). El valor de respaldo dentro de un `var()` sí está
   permitido: es lo que evita que un componente montado fuera de `.hrl-nuevo`
   pierda su tamaño (design.md § 2.2).

   No revisa los radios: quedan literales que no coinciden con la escala y
   se tratan como deuda, no como error.

     node scripts/check-literales.mjs */
import { readFileSync, readdirSync } from 'node:fs';

const problemas = [];

readFileSync('tokens.css', 'utf8').split(/\r?\n/).forEach((linea, i) => {
  if (/font-size:\s*[0-9.]+(px|rem|em)\b/.test(linea)) problemas.push(`tokens.css:${i + 1}  ${linea.trim()}`);
});

for (const archivo of readdirSync('src').filter((f) => f.endsWith('.jsx'))) {
  readFileSync(`src/${archivo}`, 'utf8').split(/\r?\n/).forEach((linea, i) => {
    if (/fontSize(:|=)\s*\{?\s*['"]?[0-9]/.test(linea)) problemas.push(`src/${archivo}:${i + 1}  ${linea.trim()}`);
  });
}

if (problemas.length) {
  console.log(`Tamaños de fuente fuera de la escala (${problemas.length}):\n`);
  problemas.forEach((p) => console.log('  ' + p));
  console.log('\nUsa var(--text-xs|sm|base|md|lg|xl|2xl), o añade un escalón a tokens.json.');
  process.exit(1);
}
console.log('Todos los tamaños de fuente salen de la escala.');
