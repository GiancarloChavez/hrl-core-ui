/* Compila el kit de JSX a JavaScript.

   Hace falta por una razón concreta: Vite no transforma JSX dentro de
   `node_modules`. Si el paquete publicara los `.jsx` tal cual, cada proyecto
   que lo instalara tendría que configurar su propio Vite para transformarlos,
   y esa configuración se rompe al subir de versión. Compilando aquí, el
   consumidor instala y usa, sin configurar nada.

   No se empaqueta en un solo archivo a propósito: se compila archivo por
   archivo conservando la estructura, así el `import { Button }` del consumidor
   arrastra solo lo que usa y su bundler puede descartar el resto.

   esbuild es dependencia de desarrollo de este repositorio; quien instala el
   paquete no la ve. `dist/` se versiona para que una instalación por URL de
   Git funcione sin compilar nada. */

import { build } from 'esbuild';
import { readdirSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';

const entradas = readdirSync('src')
  .filter((f) => f.endsWith('.jsx') || f.endsWith('.js'))
  .map((f) => `src/${f}`);

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

await build({
  entryPoints: entradas,
  outdir: 'dist',
  outbase: 'src',
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'automatic',
  /* Sin empaquetar: cada import se deja como está, así React lo resuelve el
     consumidor (va como peerDependency) y nunca viaja dentro del paquete, que
     acabaría con dos Reacts en la misma página. */
  bundle: false,
  sourcemap: true,
  logLevel: 'info',
});

/* Los imports relativos del kit apuntan a `.jsx`; en `dist` son `.js`. */
const { readFileSync, writeFileSync } = await import('node:fs');
for (const f of readdirSync('dist').filter((n) => n.endsWith('.js'))) {
  const ruta = `dist/${f}`;
  const texto = readFileSync(ruta, 'utf8').replace(/(from\s+['"]\.\/[\w.-]+)\.jsx(['"])/g, '$1.js$2');
  writeFileSync(ruta, texto);
}

copyFileSync('tokens.css', 'dist/tokens.css');
console.log(`\n${entradas.length} archivos compilados en dist/`);
