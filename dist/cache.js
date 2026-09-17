const memoria = /* @__PURE__ */ new Map();
function memoize(clave, obtener) {
  if (!memoria.has(clave)) {
    memoria.set(
      clave,
      obtener().catch((e) => {
        memoria.delete(clave);
        throw e;
      })
    );
  }
  return memoria.get(clave);
}
function invalidate(prefijo) {
  for (const clave of memoria.keys()) {
    if (clave.startsWith(prefijo)) memoria.delete(clave);
  }
}
export {
  invalidate,
  memoize
};
//# sourceMappingURL=cache.js.map
