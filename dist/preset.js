const paleta = {
  blanco: "#ffffff",
  gris50: "#f9fafb",
  gris100: "#eff1f3",
  gris200: "rgba(145, 158, 171, 0.2)",
  gris400: "#919eab",
  gris600: "#637381",
  gris900: "#1c252e",
  verde900: "#004b50",
  verde700: "#007867",
  verde500: "#00a76f",
  verde300: "#5be49b",
  azul500: "#1877f2",
  rojo500: "#ff5630",
  ambar500: "#ffab00",
  cian500: "#00b8d9",
  violeta500: "#8e33ff"
};
const series = [
  "#004b50",
  "#0c7bb3",
  "#b7560b",
  "#7a2fd1",
  "#c2185b",
  "#0e8c9c",
  "#4c8a16",
  "#d4451c",
  "#4b4fd6",
  "#96154c",
  "#5119b7"
];
const preset = {
  color: {
    /* superficies y texto */
    background: paleta.gris50,
    foreground: paleta.gris900,
    surface: paleta.blanco,
    muted: "rgba(145, 158, 171, 0.08)",
    "muted-foreground": paleta.gris600,
    "subtle-foreground": paleta.gris400,
    /* acción principal */
    primary: paleta.verde500,
    "primary-foreground": paleta.blanco,
    "primary-strong": paleta.verde900,
    "primary-hover": paleta.verde700,
    /* acción secundaria */
    accent: paleta.azul500,
    "accent-foreground": paleta.blanco,
    /* semáforo */
    destructive: paleta.rojo500,
    "destructive-foreground": paleta.blanco,
    "destructive-text": "#b71d18",
    success: paleta.verde500,
    "success-text": "#00544a",
    warning: paleta.ambar500,
    "warning-fg": "#7a4100",
    info: paleta.cian500,
    "info-fg": "#006c9c",
    /* fondos tenidos de cada estado */
    "info-soft": "rgba(0, 184, 217, 0.06)",
    "success-soft": "rgba(0, 167, 111, 0.08)",
    "warning-soft": "rgba(255, 171, 0, 0.10)",
    "destructive-soft": "rgba(255, 86, 48, 0.08)",
    "neutral-soft": "rgba(145, 158, 171, 0.10)",
    /* identidad institucional: solo para la marca, no cambia con el tema */
    "marca-verde": "#3b5c38",
    "marca-tierra": "#8c3a10",
    "marca-naranja": "#963d0c",
    /* acento categórico y paleta de series */
    violet: paleta.violeta500,
    ...Object.fromEntries(series.map((c, i) => [`serie-${i + 1}`, c])),
    /* bordes, campos, foco */
    border: paleta.gris200,
    input: paleta.blanco,
    "input-border": "rgba(145, 158, 171, 0.32)",
    ring: paleta.verde500
  },
  /* Equivalentes del tema oscuro. Solo los que cambian. */
  colorOscuro: {
    background: "#10161b",
    foreground: "#e9edf1",
    surface: "#18212a",
    muted: "rgba(145, 158, 171, 0.12)",
    "muted-foreground": "#9fb0bd",
    "subtle-foreground": "#788894",
    "primary-foreground": "#06231b",
    "destructive-text": "#ffac9b",
    "success-text": "#5be49b",
    "warning-fg": "#ffd666",
    "info-fg": "#61f3f3",
    "info-soft": "rgba(0, 184, 217, 0.14)",
    "success-soft": "rgba(0, 167, 111, 0.18)",
    "warning-soft": "rgba(255, 171, 0, 0.18)",
    "destructive-soft": "rgba(255, 86, 48, 0.18)",
    "neutral-soft": "rgba(145, 158, 171, 0.16)",
    border: "rgba(145, 158, 171, 0.26)",
    input: "#18212a",
    "input-border": "rgba(145, 158, 171, 0.34)"
  },
  radius: {
    xs: "6px",
    sm: "8px",
    md: "10px",
    DEFAULT: "12px",
    lg: "14px",
    xl: "18px",
    full: "999px"
  },
  shadow: {
    sm: "0 1px 2px rgba(28, 37, 46, 0.08)",
    md: "0 0 2px rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)",
    lg: "0 0 2px rgba(145, 158, 171, 0.2), 0 20px 40px -8px rgba(145, 158, 171, 0.28)",
    overlay: "0 32px 64px -16px rgba(28, 37, 46, 0.44)"
  },
  text: {
    xs: "11px",
    sm: "12.5px",
    base: "13.5px",
    md: "14px",
    lg: "17px",
    xl: "22px",
    "2xl": "30px"
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  leading: { tight: 1.25, normal: 1.5, loose: 1.6 },
  font: {
    sans: "'Public Sans', Helvetica, Arial, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace"
  },
  duration: { fast: "0.2s", base: "0.35s", slow: "0.5s" },
  ease: "cubic-bezier(0.33, 1, 0.68, 1)",
  /* Altura mínima de cualquier control interactivo. */
  touchTarget: { base: "40px", lg: "44px" }
};
function token(nombre, respaldo) {
  return respaldo ? `var(--${nombre}, ${respaldo})` : `var(--${nombre})`;
}
function literalColor(nombre, tema = "claro") {
  if (tema === "oscuro" && nombre in preset.colorOscuro) return preset.colorOscuro[nombre];
  return preset.color[nombre];
}
function tokensToCss({ selector = ":root", selectorOscuro = ':root[data-tema-hrl="oscuro"]' } = {}) {
  const linea = (k, v) => `  --${k}: ${v};`;
  const claro = [
    ...Object.entries(preset.color).map(([k, v]) => linea(k, v)),
    ...Object.entries(preset.radius).map(([k, v]) => linea(k === "DEFAULT" ? "radius" : `radius-${k}`, v)),
    ...Object.entries(preset.shadow).map(([k, v]) => linea(`shadow-${k}`, v)),
    ...Object.entries(preset.text).map(([k, v]) => linea(`text-${k}`, v)),
    ...Object.entries(preset.weight).map(([k, v]) => linea(`weight-${k}`, v)),
    ...Object.entries(preset.leading).map(([k, v]) => linea(`leading-${k}`, v)),
    ...Object.entries(preset.font).map(([k, v]) => linea(`font-${k}`, v)),
    ...Object.entries(preset.duration).map(([k, v]) => linea(`duration-${k}`, v)),
    linea("ease", preset.ease),
    linea("touch-target", preset.touchTarget.base),
    linea("touch-target-lg", preset.touchTarget.lg)
  ].join("\n");
  const oscuro = Object.entries(preset.colorOscuro).map(([k, v]) => linea(k, v)).join("\n");
  return `${selector} {
${claro}
}

${selectorOscuro} {
  color-scheme: dark;
${oscuro}
}
`;
}
export {
  literalColor,
  preset,
  token,
  tokensToCss
};
//# sourceMappingURL=preset.js.map
