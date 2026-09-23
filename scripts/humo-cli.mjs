/* Prueba de la herramienta `hrl-core-ui` contra un proyecto de ejemplo.

   Monta en un directorio temporal un proyecto que consume el kit —con el kit
   «instalado» copiando dist/ y tokens.css a su node_modules— y comprueba que
   `init`, `doctor` y `upgrade` hacen lo que dicen: integran, detectan lo que
   está mal, corrigen lo que se puede corregir y no cambian nada de más.

     node scripts/humo-cli.mjs   (después de `npm run build`) */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { cambiosEntre, dependenciasAjenas } from '../bin/lib/upgrade.mjs';

const KIT = resolve(import.meta.dirname, '..');
const CLI = join(KIT, 'bin', 'hrl-core-ui.mjs');
const version = JSON.parse(readFileSync(join(KIT, 'package.json'), 'utf8')).version;

let fallos = 0;
const ok = (condicion, texto) => {
  if (!condicion) fallos += 1;
  console.log(`  ${condicion ? 'ok   ' : 'FALLA'} ${texto}`);
};

const raiz = mkdtempSync(join(tmpdir(), 'hrl-cli-'));
const app = join(raiz, 'app');

function montarProyecto() {
  rmSync(app, { recursive: true, force: true });
  mkdirSync(join(app, 'src'), { recursive: true });
  writeFileSync(join(app, 'package.json'), JSON.stringify({
    name: 'app-ejemplo', private: true, type: 'module', scripts: { verificar: 'echo ok' },
    dependencies: { '@hrl/core-ui': 'github:GiancarloChavez/hrl-core-ui', react: '^19.0.0', 'react-dom': '^19.0.0' },
  }, null, 2) + '\n');
  writeFileSync(join(app, 'src', 'main.jsx'), "import { createRoot } from 'react-dom/client';\nimport './estilos.css';\nimport App from './App.jsx';\n\ncreateRoot(document.getElementById('root')).render(<App />);\n");
  writeFileSync(join(app, 'src', 'estilos.css'), '.caja { font-size: 12px; }\n');
  writeFileSync(join(app, 'src', 'App.jsx'), [
    "import { Icon, IconButton, DropdownMenu } from '@hrl/core-ui';",
    '',
    'export default function App() {',
    '  return (',
    '    <div>',
    '      <Icon name="sh-plegar" />',
    '      <IconButton icon="sh-eye" aria-label="Ver" tone="accion" onClick={() => {}} />',
    '      <DropdownMenu trigger="x" align="izquierda" items={[{ id: \'b\', label: \'Borrar\', tone: \'peligro\', onSelect: () => {} }]} />',
    '    </div>',
    '  );',
    '}',
    '',
  ].join('\n'));
  // «Instalación» del kit y de React, sin red.
  const nm = join(app, 'node_modules');
  const destino = join(nm, '@hrl', 'core-ui');
  mkdirSync(destino, { recursive: true });
  for (const f of ['dist', 'fonts', 'assets', 'tokens.css', 'package.json', 'CHANGELOG.md', 'design.md', 'UI_CATALOG.md']) cpSync(join(KIT, f), join(destino, f), { recursive: true });
  for (const p of ['react', 'react-dom']) symlinkSync(join(KIT, 'node_modules', p), join(nm, p), 'junction');
}

const correr = (...args) => spawnSync(process.execPath, [CLI, ...args], { cwd: app, encoding: 'utf8' });
const hash = () => {
  const h = createHash('sha1');
  const rec = (d) => { for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { if (e.name === 'node_modules') continue; const r = join(d, e.name); if (e.isDirectory()) rec(r); else { h.update(r); h.update(readFileSync(r)); } } };
  rec(app);
  return h.digest('hex');
};
const leer = (r) => readFileSync(join(app, r), 'utf8');

try {
  console.log('Ayuda');
  const ayuda = spawnSync(process.execPath, [CLI, '--help'], { encoding: 'utf8' });
  ok(ayuda.status === 0 && /init/.test(ayuda.stdout) && /doctor/.test(ayuda.stdout) && /upgrade/.test(ayuda.stdout), '--help lista init, doctor y upgrade');
  ok(spawnSync(process.execPath, [CLI, 'algo'], { encoding: 'utf8' }).status === 2, 'un comando desconocido sale con código 2');

  console.log('\ndoctor antes de integrar');
  montarProyecto();
  const antes = correr('doctor');
  ok(antes.status === 1, 'sale con error (falta tokens.css y la versión no está fija)');
  ok(/no carga @hrl\/core-ui\/tokens\.css/.test(antes.stdout), 'dice que main.jsx no carga tokens.css');

  console.log('\ninit');
  const h0 = hash();
  const simulado = correr('init', '--dry-run');
  ok(simulado.status === 0 && hash() === h0, '--dry-run no cambia ningún archivo');
  const real = correr('init');
  ok(real.status === 0, 'init termina bien');
  const main = leer('src/main.jsx');
  ok(main.indexOf("@hrl/core-ui/tokens.css") > -1 && main.indexOf('@hrl/core-ui/tokens.css') < main.indexOf('./estilos.css'), 'tokens.css se importa antes que los estilos propios');
  ok(new RegExp(`#v${version.replace(/\./g, '\\.')}"`).test(leer('package.json')), `la versión queda fijada en package.json (#v${version})`);
  ok(/"kit:doctor": "hrl-core-ui doctor"/.test(leer('package.json')), 'añade el script kit:doctor');
  ok(existsSync(join(app, 'CLAUDE.md')) && /hrl-core-ui:inicio/.test(leer('CLAUDE.md')) && /Reglas propias de este proyecto/.test(leer('CLAUDE.md')), 'crea CLAUDE.md con el bloque del kit y un hueco para lo propio');
  const h1 = hash();
  const otra = correr('init');
  ok(otra.status === 0 && hash() === h1, 'repetir init no cambia nada (idempotente)');

  console.log('\ndoctor tras integrar');
  const sano = correr('doctor');
  ok(sano.status === 0, 'ya no hay errores');
  ok(/4 uso\(s\) de nombres obsoletos/.test(sano.stdout), 'encuentra los 4 nombres obsoletos (icono, IconButton, DropdownMenu align e ítem)');
  ok(/10 componentes del kit se montan/.test(sano.stdout), 'los 10 componentes de prueba se montan con el React del proyecto');
  ok(correr('doctor', '--strict').status === 1, '--strict falla por los avisos');
  const h2 = hash();
  correr('doctor');
  ok(hash() === h2, 'doctor sin --fix no modifica nada');

  console.log('\ndoctor --fix');
  const arreglo = correr('doctor', '--fix');
  const app2 = leer('src/App.jsx');
  ok(arreglo.status === 0 && /sh-sidebar-collapse/.test(app2) && /tone="action"/.test(app2) && /align="left"/.test(app2) && /tone: 'danger'/.test(app2), 'reescribe los cuatro nombres obsoletos');
  ok(!/plegar|accion|izquierda|peligro/.test(app2), 'no queda ningún nombre viejo');
  ok(/No hay nombres obsoletos/.test(correr('doctor').stdout), 'un doctor posterior no encuentra nada');

  console.log('\ndoctor detecta lo que rompe el contrato');
  writeFileSync(join(app, 'src', 'Malo.jsx'), "import { Button } from '@hrl/core-ui/dist/Button.js';\nexport default Button;\n");
  const interno = correr('doctor');
  ok(interno.status === 1 && /por ruta interna/.test(interno.stdout) && /Malo\.jsx:1/.test(interno.stdout), 'un import por ruta interna es un error, con archivo y línea');
  rmSync(join(app, 'src', 'Malo.jsx'));
  writeFileSync(join(app, 'src', 'main.jsx'), "import './estilos.css';\nimport '@hrl/core-ui/tokens.css';\n");
  ok(correr('doctor').status === 1 && /antes que @hrl\/core-ui\/tokens\.css/.test(correr('doctor').stdout), 'estilos propios antes que los tokens es un error');
  writeFileSync(join(app, 'src', 'main.jsx'), "if (a) {\n  await import('./viejo.css');\n} else {\n  await import('@hrl/core-ui/tokens.css');\n  await import('./nuevo.css');\n}\n");
  ok(correr('doctor').status === 0, 'un CSS propio en otra rama (if/else) no cuenta como anterior a los tokens');

  console.log('\nmigración a medias: icono, recursos externos, clases, colores y HTML nativo');
  writeFileSync(join(app, 'index.html'), '<!doctype html>\n<html>\n<head>\n  <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n  <script src="https://unpkg.com/@phosphor-icons/web"></script>\n</head>\n<body><div id="root"></div></body>\n</html>\n');
  writeFileSync(join(app, 'src', 'Marco.jsx'), [
    "import { Button } from '@hrl/core-ui';",
    'export default function Marco() {',
    '  return (',
    '    <div className="hrl-nuevo hrl-inventada" style={{ color: \'#ff0000\' }}>',
    '      <button>Aceptar</button>',
    '      {/* hrl-nativo: no hay equivalente */}',
    '      <button>Excepción</button>',
    '      <input type="file" hidden />',
    '      <Button>Ok</Button>',
    '      <button /* hrl-nativo: sin equivalente */ type="button">Enlace</button>',
    '    </div>',
    '  );',
    '}',
    "// un color en un comentario no cuenta: '#00ff00'",
    '',
  ].join('\n'));
  const media = correr('doctor');
  ok(media.status === 0, 'son avisos, no errores: doctor no falla');
  ok(/1 recurso\(s\) que se cargan desde internet/.test(media.stdout) && /index\.html:5/.test(media.stdout), 'detecta un script de un CDN, con archivo y línea');
  ok(/plantilla de Vite/.test(media.stdout), 'detecta el icono de pestaña de Vite');
  ok(/1 clase\(s\) hrl-… usadas sin definición/.test(media.stdout) && /\.hrl-inventada/.test(media.stdout), 'detecta una clase hrl-… sin definir');
  ok(!/\.hrl-nuevo\b/.test(media.stdout), 'una clase que define el kit (hrl-nuevo) no se marca');
  ok(/1 color\(es\) escritos como literal/.test(media.stdout) && /Marco\.jsx:4  #ff0000/.test(media.stdout), 'detecta un color escrito como literal (y no el de un comentario)');
  ok(/1 etiqueta\(s\) HTML nativa\(s\)/.test(media.stdout) && /Marco\.jsx:5  <button>/.test(media.stdout), 'detecta un <button> nativo');
  ok(!/Marco\.jsx:7/.test(media.stdout) && !/Marco\.jsx:8/.test(media.stdout) && !/Marco\.jsx:10/.test(media.stdout), 'no marca los que llevan «hrl-nativo» (en la línea anterior o dentro de la etiqueta) ni el <input type="file">');

  const h3 = hash();
  const simulacion = correr('init', '--dry-run');
  ok(simulacion.status === 0 && hash() === h3 && /haría\s+index\.html: icono de pestaña/.test(simulacion.stdout), 'init --dry-run anuncia el cambio del icono sin hacerlo');
  const guiado = correr('init');
  ok(guiado.status === 0 && /hecho\s+index\.html: icono de pestaña sustituido/.test(guiado.stdout), 'init sustituye solo el icono de pestaña de Vite por el escudo del hospital');
  ok(existsSync(join(app, 'public', 'icono-hrl.png')) && /icono-hrl\.png/.test(leer('index.html')) && !/vite\.svg/.test(leer('index.html')), 'copia el escudo a public/ y enlaza index.html');
  ok(/manual .*recurso\(s\) que se cargan desde internet/.test(guiado.stdout) && /manual .*color\(es\) escritos como literal/.test(guiado.stdout) && /manual .*HTML nativa/.test(guiado.stdout), 'lo que no se puede arreglar sin adivinar queda como pasos manuales, con su arreglo');
  ok(!/manual .*icono de la pestaña/.test(guiado.stdout) && /MIGRACION\.md/.test(guiado.stdout), 'el icono ya no se pide a mano, y se remite a la guía de migración');
  const h4 = hash();
  const repetido = correr('init');
  ok(repetido.status === 0 && hash() === h4 && /ya\s+index\.html ya tiene un icono de pestaña propio/.test(repetido.stdout), 'repetir init no vuelve a tocar el icono');

  writeFileSync(join(app, 'index.html'), '<!doctype html>\n<html>\n<head>\n  <link rel="icon" type="image/png" href="/icono-hrl.png" />\n</head>\n<body><div id="root"></div></body>\n</html>\n');
  writeFileSync(join(app, 'src', 'Marco.jsx'), "import { Button } from '@hrl/core-ui';\nexport default function Marco() {\n  return <div className=\"hrl-nuevo\" style={{ color: 'var(--primary)' }}><Button>Ok</Button></div>;\n}\n");
  const resuelta = correr('doctor');
  ok(/Nada se carga desde internet/.test(resuelta.stdout) && /icono de la pestaña es propio/.test(resuelta.stdout) && /Todas las clases hrl-… que usa el código tienen definición/.test(resuelta.stdout) && /Ningún color escrito como literal/.test(resuelta.stdout) && /No hay HTML nativo/.test(resuelta.stdout), 'corregido lo anterior, las cinco revisiones pasan');
  rmSync(join(app, 'index.html'));
  rmSync(join(app, 'public'), { recursive: true, force: true });
  rmSync(join(app, 'src', 'Marco.jsx'));

  console.log('\nupgrade (piezas)');
  const log = '# Registro\n\n## 1.2.0 — c\n\ntercero\n\n## 1.1.0 — b\n\nsegundo\n\n## 1.0.0 — a\n\nprimero\n';
  const entre = cambiosEntre(log, '1.0.0', '1.1.0');
  ok(entre.length === 1 && /segundo/.test(entre[0]), 'el CHANGELOG entre 1.0.0 y 1.1.0 trae solo 1.1.0');
  ok(cambiosEntre(log, '1.0.0', '1.2.0').length === 2, 'entre 1.0.0 y 1.2.0 trae dos secciones');
  ok(dependenciasAjenas({ 'node_modules/react': '19.2.8', 'node_modules/@hrl/core-ui': '1.4.1' }, { 'node_modules/react': '19.2.8', 'node_modules/@hrl/core-ui': '1.5.0' }).length === 0, 'que cambie el kit no cuenta como cambio ajeno');
  ok(dependenciasAjenas({ 'node_modules/react': '19.2.8' }, { 'node_modules/react': '19.3.0' }).join() === 'node_modules/react', 'que suba React sí se detecta');
  ok(dependenciasAjenas({ 'node_modules/a': '1' }, { 'node_modules/a': '1', 'node_modules/b': '2' }).join() === 'node_modules/b', 'un paquete nuevo también se detecta');
} finally {
  rmSync(raiz, { recursive: true, force: true });
}

console.log(`\n${fallos === 0 ? 'Sin fallos.' : `${fallos} fallo(s).`}`);
process.exit(fallos === 0 ? 0 : 1);
