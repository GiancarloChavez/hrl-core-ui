/* Las fuentes del kit tienen que viajar dentro del paquete.

   Antes tokens.css pedía Public Sans e IBM Plex Mono a Google Fonts. En la red de
   un hospital sin salida a internet, el sistema caía en Helvetica o Arial y dejaba
   de verse como se diseñó, y nadie lo notaba hasta abrirlo en esa máquina. Ahora
   las fuentes son archivos del paquete (fonts/) y este script impide que vuelva a
   depender de internet o que un archivo declarado falte:

   - tokens.css no carga nada por http(s) (ni @import ni url()),
   - cada url() relativo (fuentes, logo, fachadas) apunta a un archivo que existe,
   - la primera familia de --font-sans y --font-mono tiene su @font-face,
   - fonts/ lleva la licencia y package.json la publica (`files`).

     node scripts/check-fuentes.mjs */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const KIT = resolve(import.meta.dirname, '..');
const css = readFileSync(join(KIT, 'tokens.css'), 'utf8');
const pkg = JSON.parse(readFileSync(join(KIT, 'package.json'), 'utf8'));
let fallos = 0;
const ok = (condicion, texto) => {
  if (!condicion) fallos += 1;
  console.log(`  ${condicion ? 'ok   ' : 'FALLA'} ${texto}`);
};

const remotos = [...css.matchAll(/(?:@import\s+(?:url\()?|url\()\s*['"]?(https?:)?\/\/[^\s'")]+/g)].map((m) => m[0]);
ok(remotos.length === 0, remotos.length ? `tokens.css carga recursos remotos: ${remotos.join(', ')}` : 'tokens.css no carga nada desde internet');

const locales = [...new Set([...css.matchAll(/url\(\s*['"]?(\.\/[^'")\s]+)['"]?\s*\)/g)].map((m) => m[1]))];
ok(locales.length > 0, `tokens.css referencia ${locales.length} archivo(s) locales (fuentes, logo, fachadas)`);
for (const ruta of locales) ok(existsSync(join(KIT, ruta)), `${ruta} existe`);

const declaradas = new Set([...css.matchAll(/@font-face\s*\{[^}]*font-family:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]));
for (const token of ['font-sans', 'font-mono']) {
  const familia = (css.match(new RegExp(`--${token}:\\s*['"]([^'"]+)['"]`)) || [])[1];
  ok(familia && declaradas.has(familia), `--${token} usa «${familia}», que tiene @font-face propio`);
}

ok(existsSync(join(KIT, 'fonts', 'LICENSE.txt')), 'fonts/LICENSE.txt está (la OFL exige distribuirla con las fuentes)');
for (const carpeta of ['fonts', 'assets']) ok((pkg.files || []).includes(carpeta), `package.json publica la carpeta ${carpeta}`);

console.log(`\n${fallos === 0 ? 'Sin fallos.' : `${fallos} fallo(s).`}`);
process.exit(fallos === 0 ? 0 : 1);
