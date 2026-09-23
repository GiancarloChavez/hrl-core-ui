/* Revisiones de lo que una migración suele dejar a medias.

   Salieron de la primera migración completa a un proyecto real (ficha_14): el
   kit y el `doctor` estaban en verde y aun así la interfaz salía con el icono de
   Vite en la pestaña, con colores escritos a mano y con `<button>` y `<input>`
   nativos que el contrato prohíbe, pidiendo además recursos a internet. Ninguna
   rompe la compilación, por eso no son errores; pero nadie las encuentra sin
   abrir la aplicación o leer todo el código.

   Las usan `doctor` (las comprueba) e `init` (las deja como pasos manuales con
   su arreglo, para que quien integra el kit no tenga que pedir ayuda). Cada
   revisión devuelve {nivel, titulo, detalle?, arreglo?}, igual que las de doctor. */
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { finDeEtiqueta, fuentes, leerTexto, lineaDe } from './proyecto.mjs';

/* Hosts de los que un sistema hospitalario no debe depender: la red interna puede
   no tener salida a internet, y entonces el sistema se ve sin fuentes, sin iconos
   o sin scripts, de forma distinta según la máquina. */
const HOSTS = '(?:fonts\\.googleapis\\.com|fonts\\.gstatic\\.com|unpkg\\.com|cdn\\.jsdelivr\\.net|cdnjs\\.cloudflare\\.com|use\\.fontawesome\\.com|kit\\.fontawesome\\.com|ajax\\.googleapis\\.com|code\\.jquery\\.com|stackpath\\.bootstrapcdn\\.com|maxcdn\\.bootstrapcdn\\.com)';
/* Solo cuenta si de verdad se carga algo (src=, href=, @import, url(, import(, from),
   no si un comentario menciona la dirección. */
const CARGA_EXTERNA = new RegExp(`(?:(?:src|href)\\s*=\\s*|@import\\s+(?:url\\(\\s*)?|url\\(\\s*|import\\(\\s*|from\\s+)["']?https?://${HOSTS}[^\\s'"\`)>]*`, 'g');

/* Colores del logo de la plantilla de Vite: un favicon que los lleva es el de fábrica. */
export const LOGO_DE_VITE = /#863bff|#41d1ff|#bd34fe|#47caff/i;

/* Un color hexadecimal completo (#fff, #ffff, #ffffff, #ffffffff). */
const HEX = '#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![0-9a-z_-])';

/* Qué componente del kit reemplaza a cada etiqueta nativa. */
const NATIVOS = {
  button: 'Button o IconButton',
  select: 'Input con kind="select"',
  textarea: 'Input',
  table: 'DataTable o PaginatedTable',
  input: 'Input (o Checkbox si es de tipo checkbox)',
};

/* Los comentarios se blanquean conservando los saltos de línea: un color o una etiqueta que solo
   se mencionan en un comentario no cuentan, y la numeración de líneas no se pierde. */
const sinComentarios = (texto) => texto
  .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
  .replace(/^[ \t]*\/\/.*$/gm, (c) => c.replace(/[^\n]/g, ' '));

const LIMITE = 8;
const con = (lista) => lista.slice(0, LIMITE).join('\n') + (lista.length > LIMITE ? `\n… y ${lista.length - LIMITE} más` : '');

/* Ubicación del icono de pestaña de index.html: { html, href, enlace } o null. */
export function iconoDePestana(dir) {
  const ruta = join(dir, 'index.html');
  if (!existsSync(ruta)) return null;
  const html = leerTexto(ruta);
  const enlace = html.match(/<link\b[^>]*\brel=["'](?:shortcut )?icon["'][^>]*>/i);
  const href = enlace && (enlace[0].match(/\bhref=["']([^"']+)["']/i) || [])[1];
  const local = href && href.startsWith('/') ? [join(dir, 'public', href), join(dir, href.slice(1))].find(existsSync) : null;
  const deFabrica = !href || /(^|\/)vite\.svg$/.test(href) || Boolean(local && LOGO_DE_VITE.test(leerTexto(local)));
  return { ruta, html, href: href || null, enlace: enlace ? enlace[0] : null, deFabrica };
}

export function revisiones(dir) {
  const r = [];
  const anota = (nivel, titulo, detalle, arreglo, clave) => r.push({ nivel, titulo, detalle, arreglo, clave });
  const rel = (ruta) => relative(dir, ruta).replace(/\\/g, '/');

  const codigo = fuentes(dir);
  const textos = new Map(codigo.map((a) => [a, leerTexto(a)]));
  const estilos = fuentes(dir, /\.css$/);
  const indice = join(dir, 'index.html');
  const html = existsSync(indice) ? leerTexto(indice) : null;

  // 1. Nada se carga de internet.
  const externos = [];
  const buscar = (ruta, texto) => {
    for (const m of texto.matchAll(CARGA_EXTERNA)) externos.push(`${rel(ruta)}:${lineaDe(texto, m.index)}  ${m[0].slice(m[0].search(/https?:\/\//))}`);
  };
  if (html) buscar(indice, html);
  for (const [a, t] of textos) buscar(a, t);
  for (const a of estilos) buscar(a, leerTexto(a));
  if (externos.length) {
    anota('aviso', `${externos.length} recurso(s) que se cargan desde internet`, con(externos),
      'Instálalos como paquete (npm) o quítalos: el sistema tiene que abrir igual sin salida a internet. Las fuentes, los iconos y el logo del kit ya vienen incluidos.');
  } else anota('ok', 'Nada se carga desde internet (CDN, Google Fonts…)');

  // 2. El icono de la pestaña es el del hospital, no el de la plantilla de Vite.
  const icono = iconoDePestana(dir);
  if (icono) {
    if (icono.deFabrica) {
      anota('aviso', icono.href ? `El icono de la pestaña (${icono.href}) es el de la plantilla de Vite` : 'index.html no declara un icono de pestaña', null,
        'npx hrl-core-ui init lo sustituye por el escudo del hospital que trae el kit.', 'icono');
    } else anota('ok', 'El icono de la pestaña es propio');
  }

  // 3. Toda clase hrl-… que el código usa tiene una definición (en el kit o en los estilos propios).
  const definidas = new Set();
  const kitCss = join(dir, 'node_modules', '@hrl', 'core-ui', 'tokens.css');
  const fuentesCss = [...(existsSync(kitCss) ? [kitCss] : []), ...estilos];
  for (const a of fuentesCss) for (const m of leerTexto(a).matchAll(/\.(hrl-[a-z0-9_-]+)/gi)) definidas.add(m[1]);
  if (definidas.size) {
    const sinDefinir = new Map();
    for (const [a, t] of textos) {
      for (const m of t.matchAll(/className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*[`'"]([^`'"]*))/g)) {
        for (const clase of (m[1] ?? m[2] ?? m[3] ?? '').split(/\s+/)) {
          if (!/^hrl-[a-z][a-z0-9_-]*$/i.test(clase) || definidas.has(clase)) continue;
          const previo = sinDefinir.get(clase);
          if (previo) previo.usos += 1;
          else sinDefinir.set(clase, { donde: `${rel(a)}:${lineaDe(t, m.index)}`, usos: 1 });
        }
      }
    }
    if (sinDefinir.size) {
      anota('aviso', `${sinDefinir.size} clase(s) hrl-… usadas sin definición`,
        con([...sinDefinir].map(([c, v]) => `.${c}  ${v.donde}${v.usos > 1 ? ` (${v.usos} usos)` : ''}`)),
        'Defínelas en los estilos del proyecto o pide el componente al kit: sin definición el elemento sale sin estilo.');
    } else anota('ok', 'Todas las clases hrl-… que usa el código tienen definición');
  }

  // 4. Sin colores escritos como literal: salen de tokens (var(--…), o token('…') en JS).
  const colores = [];
  for (const a of estilos) {
    const texto = sinComentarios(leerTexto(a));
    for (const m of texto.matchAll(new RegExp(`(?<![&\\w(])${HEX}`, 'gi'))) colores.push(`${rel(a)}:${lineaDe(texto, m.index)}  ${m[0]}`);
  }
  for (const [a, original] of textos) {
    const t = sinComentarios(original);
    for (const m of t.matchAll(new RegExp(`(['"\`])(${HEX})\\1`, 'gi'))) colores.push(`${rel(a)}:${lineaDe(t, m.index)}  ${m[2]}`);
  }
  if (colores.length) {
    anota('aviso', `${colores.length} color(es) escritos como literal`, con(colores),
      "Usa tokens: var(--primary), var(--serie-1…8) para series de gráficos; en JS, token('serie-1') del kit. Un color nuevo se pide al kit.");
  } else anota('ok', 'Ningún color escrito como literal');

  // 5. Sin HTML nativo que el kit ya ofrece. Marca `hrl-nativo` en la línea (o la anterior) para justificar una excepción.
  const nativos = [];
  for (const [a, original] of textos) {
    if (!/\.(jsx|tsx)$/.test(a)) continue;
    const t = sinComentarios(original);
    /* Las marcas `hrl-nativo` viven en comentarios: se buscan en el texto original. */
    const lineas = original.split('\n');
    for (const m of t.matchAll(/<(button|input|select|textarea|table)\b/g)) {
      const fin = finDeEtiqueta(t, m.index);
      const etiqueta = t.slice(m.index, fin < 0 ? m.index + 200 : fin + 1);
      if (m[1] === 'input' && /\btype\s*=\s*["'](file|hidden|radio)["']/.test(etiqueta)) continue;
      const n = lineaDe(t, m.index);
      /* `t` tiene los comentarios blanqueados con la misma longitud que el original: la misma
         posición en `original` da la etiqueta con sus comentarios, donde puede ir la marca. */
      const conComentarios = original.slice(m.index, m.index + etiqueta.length);
      if (/hrl-nativo/.test(conComentarios) || /hrl-nativo/.test(lineas[n - 1] || '') || /hrl-nativo/.test(lineas[n - 2] || '')) continue;
      const checkbox = m[1] === 'input' && /\btype\s*=\s*["']checkbox["']/.test(etiqueta);
      nativos.push(`${rel(a)}:${n}  <${m[1]}>  →  ${checkbox ? 'Checkbox' : NATIVOS[m[1]]}`);
    }
  }
  if (nativos.length) {
    anota('aviso', `${nativos.length} etiqueta(s) HTML nativa(s) con un componente equivalente en el kit`, con(nativos),
      'Cámbialas por el componente. Si de verdad no hay equivalente, pídelo al kit; mientras tanto, justifícalo con un comentario «hrl-nativo: motivo» en esa línea o la anterior. Sin equivalente hoy: <input type="file"> (oculto tras un Button), que no se marca.');
  } else anota('ok', 'No hay HTML nativo con equivalente en el kit');

  return r;
}
