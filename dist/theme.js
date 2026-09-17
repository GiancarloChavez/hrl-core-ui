const CLAVE_POR_DEFECTO = "hrl_theme";
function readTheme(key = CLAVE_POR_DEFECTO) {
  try {
    return localStorage.getItem(key) === "dark" ? "oscuro" : "claro";
  } catch {
    return "claro";
  }
}
function applyTheme(tema, key = CLAVE_POR_DEFECTO) {
  document.documentElement.dataset.temaHrl = tema;
  try {
    localStorage.setItem(key, tema === "oscuro" ? "dark" : "light");
  } catch {
  }
}
export {
  applyTheme,
  readTheme
};
//# sourceMappingURL=theme.js.map
