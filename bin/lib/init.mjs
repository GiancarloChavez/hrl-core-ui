/* `hrl-core-ui init`: integra el kit en un proyecto que ya lo tiene instalado.

   Es idempotente: cada paso comprueba si ya está hecho y, si lo está, no toca
   nada. Solo hace lo que se puede hacer sin adivinar; lo que depende de cómo es
   la aplicación (qué navegación lleva su AppShell) lo deja indicado. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  KIT, entradaDe, escribirJson, especificacionKit, etiquetaDe, importsDe, leerJson, leerTexto, nombreDe, raizGit, versionInstalada,
} from './proyecto.mjs';
import { bloque, esqueleto, INICIO } from './plantilla.mjs';

const REPO = 'git+https://github.com/GiancarloChavez/hrl-core-ui.git';
const TOKENS = '@hrl/core-ui/tokens.css';

/* Punto donde insertar el import de tokens.css: antes del primer import de CSS
   (los tokens tienen que ir antes que los estilos propios) o, si no hay, tras el
   último import estático. */
function puntoDeInsercion(texto) {
  const css = importsDe(texto, /\.css$/);
  if (css.length) {
    const inicioLinea = texto.lastIndexOf('\n', css[0].indice) + 1;
    return { indice: inicioLinea, envuelto: texto.slice(inicioLinea, css[0].indice).includes('await') };
  }
  let ultimo = 0;
  for (const m of texto.matchAll(/^import[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*$/gm)) ultimo = m.index + m[0].length;
  return { indice: ultimo ? ultimo + 1 : 0, envuelto: false };
}

export function init({ dir, pkg }, { dryRun = false } = {}) {
  const pasos = [];
  const hecho = (estado, texto) => pasos.push({ estado, texto });
  const version = versionInstalada(dir);
  const rutaPkg = join(dir, 'package.json');
  const rel = (r) => relative(dir, r).replace(/\\/g, '/') || '.';

  // 1. El kit tiene que estar instalado y con la versión fija.
  const espec = especificacionKit(pkg);
  if (!espec || !version) {
    return { pasos: [{ estado: 'error', texto: `Instala primero el kit:  npm i "${REPO}#vX.Y.Z"   y vuelve a ejecutar esto.` }], errores: 1 };
  }
  if (etiquetaDe(espec.valor)) hecho('ya', `Versión fija en package.json (${espec.valor.split('#')[1]})`);
  else {
    const p = leerJson(rutaPkg);
    p.datos[espec.seccion][KIT] = `${REPO}#v${version}`;
    if (!dryRun) escribirJson(rutaPkg, p);
    hecho('hecho', `Versión fijada en package.json: ${REPO}#v${version}`);
  }

  // 2. Los tokens, antes que los estilos de la aplicación.
  const entrada = entradaDe(dir);
  if (!entrada) hecho('manual', `No encuentro el punto de entrada (src/main.jsx…). Añade tú:  import '${TOKENS}'  antes de tus estilos.`);
  else {
    const ruta = join(dir, entrada);
    const texto = leerTexto(ruta);
    if (importsDe(texto, /^@hrl\/core-ui\/tokens\.css$/).length) hecho('ya', `${entrada} ya carga tokens.css`);
    else {
      const eol = texto.includes('\r\n') ? '\r\n' : '\n';
      const { indice, envuelto } = puntoDeInsercion(texto);
      const linea = envuelto ? `await import('${TOKENS}')` : `import '${TOKENS}';`;
      if (!dryRun) writeFileSync(ruta, texto.slice(0, indice) + linea + eol + texto.slice(indice));
      hecho('hecho', `${entrada}: añadido  ${linea}  antes de los estilos propios`);
    }
  }

  // 3. El contrato del proyecto.
  const raiz = raizGit(dir);
  const existente = [join(dir, 'CLAUDE.md'), join(raiz, 'CLAUDE.md')].find(existsSync);
  const nombre = nombreDe(dir, pkg);
  if (!existente) {
    const destino = join(raiz, 'CLAUDE.md');
    if (!dryRun) writeFileSync(destino, esqueleto(nombre, version));
    hecho('hecho', `${rel(destino)}: creado con las reglas del kit y un hueco para las de este proyecto`);
  } else {
    const texto = leerTexto(existente);
    if (texto.includes(INICIO)) hecho('ya', `${rel(existente)} ya tiene el bloque del kit`);
    else if (texto.includes(KIT)) hecho('ya', `${rel(existente)} ya documenta el kit por su cuenta: no se toca`);
    else {
      const eol = texto.includes('\r\n') ? '\r\n' : '\n';
      if (!dryRun) writeFileSync(existente, texto.replace(/\s*$/, eol + eol) + bloque(version).replace(/\n/g, eol));
      hecho('hecho', `${rel(existente)}: añadido el bloque del kit al final`);
    }
  }

  // 4. Un script para comprobar.
  const p = leerJson(rutaPkg);
  p.datos.scripts ??= {};
  if (p.datos.scripts['kit:doctor']) hecho('ya', 'package.json ya tiene el script kit:doctor');
  else {
    p.datos.scripts['kit:doctor'] = 'hrl-core-ui doctor';
    if (!dryRun) escribirJson(rutaPkg, p);
    hecho('hecho', 'package.json: añadido el script  kit:doctor  (npm run kit:doctor)');
  }

  hecho('manual', 'Falta lo que depende de tu aplicación: montar <AppShell> con su navegación y su usuario. Ejemplo mínimo:\n'
    + "    <AppShell navItems={[{ id: 'inicio', label: 'Inicio', icon: 'sh-home' }]} active={id} onSelect={setId}\n"
    + "              title=\"Inicio\" brand=\"Nombre del sistema\" themeKey=\"clave_del_tema\" user={{ name }} onSignOut={salir}>\n"
    + '      …contenido…\n    </AppShell>\n'
    + '    (brand y themeKey son del sistema, no del kit). Catálogo: npm run ladle:serve en el kit, o node_modules/@hrl/core-ui/UI_CATALOG.md');
  return { pasos, errores: 0 };
}
