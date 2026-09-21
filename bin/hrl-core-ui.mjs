#!/usr/bin/env node
/* Herramienta de integración del kit. Solo módulos de Node: el kit no tiene
   dependencias de ejecución (design.md § 0). */
import { readFileSync } from 'node:fs';
import { doctor } from './lib/doctor.mjs';
import { init } from './lib/init.mjs';
import { encontrarProyecto, KIT } from './lib/proyecto.mjs';
import { upgrade } from './lib/upgrade.mjs';

const version = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

const AYUDA = `hrl-core-ui ${version} — integra y mantiene ${KIT} en un proyecto

Uso (desde la carpeta del proyecto, con el kit ya instalado):

  npx hrl-core-ui init [--dry-run]        Integra el kit: carga tokens.css antes que tus estilos,
                                          fija la versión, escribe el contrato del proyecto
                                          (CLAUDE.md) y añade el script "kit:doctor".
                                          Es idempotente: repetirlo no cambia nada.
  npx hrl-core-ui doctor [--fix] [--strict]
                                          Comprueba que la integración sigue sana: versión,
                                          orden de estilos, imports internos, sprite de iconos,
                                          nombres obsoletos y que los componentes se montan.
                                          --fix corrige solos los nombres obsoletos.
                                          --strict hace que los avisos también fallen (para CI).
  npx hrl-core-ui upgrade <vX.Y.Z|latest> [--fix]
                                          Sube la versión: cambia el tag, instala sin subir otras
                                          dependencias, muestra el CHANGELOG y corre doctor.

Código de salida distinto de 0 si hay errores.`;

const ETIQUETA = { ok: 'ok    ', aviso: 'aviso ', error: 'ERROR ', info: 'info  ' };

function mostrar({ resultados, errores, avisos }) {
  for (const x of resultados) {
    console.log(`  ${ETIQUETA[x.nivel]} ${x.titulo}`);
    if (x.detalle) console.log(x.detalle.split('\n').map((l) => `           ${l}`).join('\n'));
    if (x.arreglo && x.nivel !== 'ok') console.log(`           → ${x.arreglo}`);
  }
  console.log(`\n${errores} error(es), ${avisos} aviso(s).`);
}

const [comando, ...resto] = process.argv.slice(2);
const flags = new Set(resto.filter((a) => a.startsWith('--')));
const posicionales = resto.filter((a) => !a.startsWith('--'));

if (!comando || comando === '--help' || comando === '-h' || comando === 'help') {
  console.log(AYUDA);
} else if (comando === '--version' || comando === '-v') {
  console.log(version);
} else if (!['init', 'doctor', 'upgrade'].includes(comando)) {
  console.error(`Comando desconocido: "${comando}".\n\n${AYUDA}`);
  process.exitCode = 2;
} else {
  const proyecto = encontrarProyecto(process.cwd());
  if (!proyecto) {
    console.error('No encuentro un package.json de un proyecto React desde aquí. Ejecuta esto dentro de la carpeta del proyecto.');
    process.exit(2);
  }
  if (proyecto.pkg.name === KIT) {
    console.error(`Esto es el propio kit (${KIT}), no un proyecto que lo consume.`);
    process.exit(2);
  }
  console.log(`hrl-core-ui ${comando} — ${proyecto.dir}\n`);

  if (comando === 'init') {
    const { pasos, errores } = init(proyecto, { dryRun: flags.has('--dry-run') });
    const simbolo = { hecho: flags.has('--dry-run') ? 'haría  ' : 'hecho  ', ya: 'ya     ', manual: 'manual ', error: 'ERROR  ' };
    for (const p of pasos) console.log(`  ${simbolo[p.estado]} ${p.texto}`);
    if (!errores) console.log(`\n${flags.has('--dry-run') ? 'Simulación: no se cambió nada.' : 'Listo. Comprueba con:  npx hrl-core-ui doctor'}`);
    process.exitCode = errores ? 1 : 0;
  } else if (comando === 'doctor') {
    const r = await doctor(proyecto, { fix: flags.has('--fix') });
    mostrar(r);
    process.exitCode = r.errores || (flags.has('--strict') && r.avisos) ? 1 : 0;
  } else {
    if (!posicionales[0]) {
      console.error('Falta la versión:  npx hrl-core-ui upgrade vX.Y.Z   (o latest)');
      process.exit(2);
    }
    const r = await upgrade(proyecto, posicionales[0], { fix: flags.has('--fix') });
    if (r.error) {
      console.error(`  ERROR  ${r.error}`);
      process.exitCode = 1;
    } else {
      console.log(`\nComprobación tras subir v${r.actual} → v${r.nueva}:\n`);
      mostrar(r.resultado);
      process.exitCode = r.resultado.errores || r.extra.length ? 1 : 0;
    }
  }
}
