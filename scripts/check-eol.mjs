/* El generador de tokens tiene que respetar el fin de línea de los archivos.

   Escribía siempre CRLF. En Windows no se notaba (git normaliza los saltos de
   línea al comparar), pero en un checkout LF —el del CI de Linux— todas las
   líneas de tokens.css y preset.js salían distintas y `git diff --exit-code`
   fallaba aunque el contenido fuera idéntico. Aquí se ejecuta el generador sobre
   una copia con LF y otra con CRLF y se exige que cada una salga como entró y sin
   cambiar de contenido.

     node scripts/check-eol.mjs */
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const KIT = resolve(import.meta.dirname, '..');
const normalizado = (ruta) => readFileSync(join(KIT, ruta), 'utf8').replace(/\r\n/g, '\n');
let fallos = 0;

function probar(nombre, eol) {
  const dir = mkdtempSync(join(tmpdir(), 'hrl-eol-'));
  try {
    mkdirSync(join(dir, 'src'));
    cpSync(join(KIT, 'scripts'), join(dir, 'scripts'), { recursive: true });
    cpSync(join(KIT, 'tokens.json'), join(dir, 'tokens.json'));
    for (const f of ['tokens.css', 'src/preset.js']) writeFileSync(join(dir, f), normalizado(f).replace(/\n/g, eol));

    const r = spawnSync(process.execPath, ['scripts/generate-tokens.mjs'], { cwd: dir, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`el generador falló: ${r.stderr.split('\n')[0]}`);

    for (const f of ['tokens.css', 'src/preset.js']) {
      const salida = readFileSync(join(dir, f), 'utf8');
      const mezclado = eol === '\n' ? salida.includes('\r') : /(^|[^\r])\n/.test(salida);
      const mismoContenido = salida.replace(/\r\n/g, '\n') === normalizado(f);
      const ok = !mezclado && mismoContenido;
      if (!ok) fallos += 1;
      console.log(`  ${ok ? 'ok   ' : 'FALLA'} ${nombre} · ${f}${ok ? '' : mezclado ? ': cambió el fin de línea' : ': el contenido no coincide con el del repositorio'}`);
    }
  } catch (e) {
    fallos += 1;
    console.log(`  FALLA ${nombre}: ${e.message}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

probar('checkout LF (Linux, CI)', '\n');
probar('checkout CRLF (Windows)', '\r\n');

console.log(`\n${fallos === 0 ? 'Sin fallos.' : `${fallos} fallo(s).`}`);
process.exit(fallos === 0 ? 0 : 1);
