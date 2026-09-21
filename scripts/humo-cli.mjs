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
  for (const f of ['dist', 'tokens.css', 'package.json', 'CHANGELOG.md', 'design.md', 'UI_CATALOG.md']) cpSync(join(KIT, f), join(destino, f), { recursive: true });
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
