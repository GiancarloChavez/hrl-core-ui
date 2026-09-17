/* Prueba de humo del paquete ya compilado.

   No comprueba el código fuente: importa `dist/`, que es lo que recibe quien
   instala, y monta cada componente. Así se detecta lo que un build correcto no
   ve —un import que no exporta lo que se le pide, un componente que lee una
   propiedad de undefined— y además se verifica que el compilado es importable
   tal cual, sin Vite ni configuración.

     node scripts/humo.mjs   (después de `npm run build`) */

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import * as kit from '../dist/index.js';

const CASOS = [
  ['Button', { children: 'Aceptar' }],
  ['Button', { tone: 'danger', size: 'sm', icon: 'sh-close', children: 'Eliminar' }],
  ['IconButton', { icon: 'sh-eye', 'aria-label': 'Ver' }],
  ['Input', { label: 'Campo' }],
  ['Input', { label: 'Lista', kind: 'select', options: [{ value: 'a', label: 'A' }] }],
  ['Input', { label: 'Monto', kind: 'number', disabled: true }],
  ['CompactSelect', { 'aria-label': 'Año', options: ['2026'] }],
  ['Checkbox', { label: 'Incluir', checked: true, onChange: () => {} }],
  ['NumberCell', { 'aria-label': 'Atenciones', value: 4.5, onChange: () => {} }],
  ['Badge', { label: 'Activo', tone: 'ok' }],
  ['Card', { title: 'Sección', children: 'x' }],
  ['StatCard', { label: 'KPI', value: '10', severity: 'nodata', info: 'Qué mide' }],
  ['Alert', { tone: 'warning', title: 'Atención', children: 'x' }],

  ['Tooltip', { body: 'Explicación', children: 'x' }],
  ['TruncatedText', { text: 'Un texto largo', width: 200, label: 'Detalle' }],
  ['Tabs', { tabs: [{ key: 'a', label: 'A', icon: 'sh-gear' }], active: 'a', onChange: () => {} }],
  ['DropdownMenu', { trigger: 'x', items: [{ id: '1', label: 'Editar', onSelect: () => {} }] }],
  ['Steps', { steps: [{ key: 'a', title: 'Paso', note: 'faltan 2', status: 'partial' }], active: 'a', onChange: () => {} }],
  ['SelectionStrip', { items: [{ key: '1', title: '1', subtitle: 'L', marked: true }], active: '1', onChange: () => {} }],
  ['Calendar', { year: 2026, month: 9, selected: 3, onSelect: () => {}, statusOf: (d) => (d % 3 ? 'empty' : 'full') }],
  ['EmptyState', { title: 'Sin datos', body: 'x' }],
  ['Spinner', { text: 'Cargando…' }],
  ['Skeleton', {}],
  ['SkeletonRows', { rows: 2, columns: 3 }],
  ['Timeline', { title: 'Historial', items: [{ key: 'a', date: '2026-01-01', title: 'Evento' }] }],
  ['Pagination', { page: 1, totalPages: 3, totalItems: 30, onChange: () => {} }],
  ['DataTable', { columns: [{ key: 'a', label: 'A', group: 'SIS' }], rows: [{ a: 1 }] }],
  ['PaginatedTable', { columns: [{ key: 'a', label: 'A' }], rows: [{ a: 1 }] }],
  ['GaugeArc', { value: 42, color: 'var(--success)' }],
  ['GaugeArc', { value: null, color: 'var(--success)' }],
  ['Sparkline', { values: [1, 2, 3], color: 'var(--accent)' }],
  ['StackedBars', { labels: ['ene'], series: [{ name: 'S', color: 'var(--accent)', values: [1] }] }],
  ['SeriesBars', { points: [{ label: 'ene', value: 3 }, { label: 'feb', value: null }] }],
  ['Funnel', { stages: [{ name: 'A', value: 10, color: 'var(--accent)' }] }],
  ['Ranking', { rows: [{ name: 'A', value: 1, color: 'var(--accent)' }] }],
  ['SplitBar', { value: 1, total: 2, color: 'var(--accent)' }],
  ['PageHeader', { title: 'Vista' }],
  ['FilterBar', { children: 'x' }],
  ['IconSprite', {}],
  ['Icon', { name: 'sh-ok' }],
];

/* Dialog, DetailDialog y Toast se montan con createPortal en document.body,
   que en Node no existe: no se pueden renderizar aquí sin traer un DOM falso,
   y un DOM falso taparía los errores que esta prueba busca. De ellos se
   comprueba que el paquete los exporta; su render lo cubre la prueba de humo
   de la aplicación, que corre con el cargador de Vite. */
const PORTALES = ['Dialog', 'DetailDialog', 'Toast'];

/* En SSR no hay almacenamiento; sin esto fallaría por el entorno y no por un
   defecto del componente. */
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

let fallos = 0;
for (const [nombre, props] of CASOS) {
  try {
    const Componente = kit[nombre];
    if (!Componente) throw new Error('el paquete no exporta ' + nombre);
    renderToString(createElement(Componente, props));
    console.log(`  ok   ${nombre}(${Object.keys(props).join(', ') || '—'})`);
  } catch (e) {
    fallos += 1;
    console.log(`  FALLA ${nombre}\n        ${e.message.split('\n')[0]}`);
  }
}

for (const nombre of PORTALES) {
  if (typeof kit[nombre] === 'function') {
    console.log(`  ok   ${nombre} (solo export: usa portal y necesita DOM)`);
  } else {
    fallos += 1;
    console.log(`  FALLA ${nombre}: el paquete no lo exporta`);
  }
}

/* El barril tiene que exportar todo lo que documenta el catálogo: un export
   que se olvida al renombrar no lo detecta ningún build. */
const esperados = ['Button', 'Input', 'DataTable', 'AppShell', 'PageActions', 'usePagination',
  'useExitAnimation', 'useExpandedRows', 'useFloatingTip', 'readTheme', 'applyTheme',
  'memoize', 'invalidate', 'sortRows', 'nextSort', 'variants', 'cx', 'preset', 'token', 'ICONS'];
const faltan = esperados.filter((n) => !(n in kit));
if (faltan.length) {
  fallos += 1;
  console.log(`  FALLA barril: no exporta ${faltan.join(', ')}`);
}

console.log(`\n${fallos === 0 ? 'Sin fallos.' : `${fallos} fallo(s).`}`);
process.exit(fallos === 0 ? 0 : 1);
