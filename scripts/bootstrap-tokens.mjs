/* Bootstrap de tokens.json a partir del tokens.css actual.

   Se corre UNA sola vez: lee los bloques :root (claro) y
   :root[data-tema-hrl='oscuro'] (oscuro) de tokens.css tal como existen hoy,
   los agrupa por sus comentarios de sección (que ya documentan el «por qué»
   de cada grupo) y escribe tokens.json. A partir de ahí, tokens.json es la
   fuente y este script no se vuelve a necesitar — queda como registro de
   cómo se hizo la migración.

   No se transcribe nada a mano: un valor de color mal tipeado a mano no se
   nota a simple vista y aquí hay más de cien. */
import { readFileSync, writeFileSync } from 'node:fs';

const CRLF = String.fromCharCode(13, 10);
const LF = String.fromCharCode(10);
const css = readFileSync('tokens.css', 'utf8').split(CRLF).join(LF);

function extraerBloque(inicioMarca, finMarca) {
  const inicio = css.indexOf(inicioMarca);
  const fin = css.indexOf(finMarca, inicio);
  if (inicio < 0 || fin < 0) throw new Error(`No se encontró el bloque entre "${inicioMarca}" y "${finMarca}"`);
  return css.slice(inicio + inicioMarca.length, fin);
}

/* Agrupa las declaraciones `--clave: valor;` por el comentario que las
   precede. Una línea sin comentario nuevo se suma al grupo en curso. */
function agruparPorComentarios(bloque) {
  const grupos = [];
  let comentarioActual = null;
  let actuales = null;

  const lineas = bloque.split(LF);
  let i = 0;
  while (i < lineas.length) {
    const linea = lineas[i];
    const trim = linea.trim();

    if (trim.startsWith('/*')) {
      let texto = trim;
      while (!texto.includes('*/')) {
        i += 1;
        texto += ' ' + lineas[i].trim();
      }
      comentarioActual = texto.replace(/^\/\*\s*/, '').replace(/\s*\*\/$/, '').trim();
      actuales = null;
      i += 1;
      continue;
    }

    const m = trim.match(/^--([a-z0-9-]+):\s*(.+);$/);
    if (m) {
      if (!actuales) {
        actuales = { comment: comentarioActual, tokens: {} };
        grupos.push(actuales);
        comentarioActual = null;
      }
      actuales.tokens[m[1]] = m[2];
    }
    i += 1;
  }
  return grupos;
}

const bloqueClaro = extraerBloque(
  '.hrl-nuevo,' + LF + '.hrl-portal {' + LF,
  LF + LF + '  font-family:',
);
const gruposClaro = agruparPorComentarios(bloqueClaro);

const bloqueOscuro = extraerBloque(
  ":root[data-tema-hrl='oscuro'] .hrl-nuevo," + LF + ":root[data-tema-hrl='oscuro'] .hrl-portal {" + LF,
  LF + LF + '  color-scheme: dark;' + LF + '}',
);
const gruposOscuro = agruparPorComentarios(bloqueOscuro);
const notaOscuro = gruposOscuro[0] && Object.keys(gruposOscuro[0].tokens).length === 0
  ? gruposOscuro.shift().comment
  : null;

const salida = {
  $fuente: 'tokens.css y src/preset.js se generan desde este archivo con '
    + '`npm run tokens` — no se editan a mano.',
  light: gruposClaro,
  dark: { note: notaOscuro, groups: gruposOscuro },
};

writeFileSync('tokens.json', JSON.stringify(salida, null, 2) + LF);
console.log('tokens.json escrito.');
console.log('grupos claro:', gruposClaro.length, '| tokens claro:', gruposClaro.reduce((n, g) => n + Object.keys(g.tokens).length, 0));
console.log('grupos oscuro:', gruposOscuro.length, '| tokens oscuro:', gruposOscuro.reduce((n, g) => n + Object.keys(g.tokens).length, 0));
