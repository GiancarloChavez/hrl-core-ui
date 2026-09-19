/* Calcula el oscurecimiento mínimo (en HSL, mismo matiz y saturación, solo
   baja la luminosidad) que hace falta para que un color llegue a cierto
   contraste contra el texto que lleva encima — mismo tono, menos claro, en
   vez de inventar un color nuevo cuando `check-contrast.mjs` marca un fallo.

   Es una calculadora de apoyo, no un paso del build: imprime candidatos:
   quien decide cuál aplicar a tokens.json es una persona, no este script.
   Editar directamente los valores de abajo para la próxima corrección. */

function hexARgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbAHex([r, g, b]) {
  const c = (v) => Math.round(v).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
function rgbAHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s; const l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}
function hslARgb([h, s, l]) {
  if (s === 0) { const v = l * 255; return [v, v, v]; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3) * 255, hue2rgb(p, q, h) * 255, hue2rgb(p, q, h - 1 / 3) * 255];
}
function luminancia([r, g, b]) {
  const canal = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}
function razon(rgbA, rgbB) {
  const l1 = luminancia(rgbA), l2 = luminancia(rgbB);
  const [c, o] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (c + 0.05) / (o + 0.05);
}

/* Baja la luminosidad (L de HSL) en pasos finos hasta que el color, puesto de
   FONDO bajo `sobreRgb` (el texto que lleva encima), llegue a `objetivo`. */
function oscurecerHasta(hex, sobreRgb, objetivo) {
  const hsl = rgbAHsl(hexARgb(hex));
  for (let l = hsl[2]; l >= 0; l -= 0.002) {
    const candidato = hslARgb([hsl[0], hsl[1], l]);
    if (razon(sobreRgb, candidato) >= objetivo) return { hex: rgbAHex(candidato), l, razon: razon(sobreRgb, candidato) };
  }
  return null;
}

const BLANCO = [255, 255, 255];
const GRIS_BG = hexARgb('#f9fafb'); // background claro

console.log('--- Botones: fondo mínimamente más oscuro para que el texto blanco llegue a 4.5:1 ---');
for (const [nombre, hex] of [['primary (brand)', '#00a76f'], ['destructive (danger)', '#ff5630'], ['accent (action-blue)', '#1877f2']]) {
  const r = oscurecerHasta(hex, BLANCO, 4.5);
  console.log(`  ${nombre}: ${hex} -> ${r.hex}  (blanco encima: ${r.razon.toFixed(2)}:1)`);
}

console.log('\n--- subtle-foreground: dos objetivos distintos, para comparar ---');
for (const objetivo of [3.0, 4.5]) {
  const r = oscurecerHasta('#919eab', GRIS_BG, objetivo);
  const sobreSurface = razon(BLANCO, hexARgb(r.hex));
  console.log(`  objetivo ${objetivo}:1 -> #919eab -> ${r.hex}  (background: ${r.razon.toFixed(2)}:1, surface: ${sobreSurface.toFixed(2)}:1)`);
}
console.log('  muted-foreground de referencia: #637381');
