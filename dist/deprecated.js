const avisados = /* @__PURE__ */ new Set();
function aliasObsoleto(alias, valor, donde) {
  const actual = alias[valor];
  if (actual === void 0) return valor;
  const clave = `${donde}:${valor}`;
  if (import.meta.env?.DEV && !avisados.has(clave)) {
    avisados.add(clave);
    console.warn(`${donde}: \xAB${valor}\xBB est\xE1 obsoleto y se retirar\xE1 en la pr\xF3xima versi\xF3n mayor; usa \xAB${actual}\xBB.`);
  }
  return actual;
}
export {
  aliasObsoleto
};
//# sourceMappingURL=deprecated.js.map
