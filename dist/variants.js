function variants(base, map = {}, defaults = {}) {
  return (options = {}) => {
    const chosen = { ...defaults, ...options };
    const partes = [base];
    for (const [grupo, valores] of Object.entries(map)) {
      const clase = valores[chosen[grupo]];
      if (clase) partes.push(clase);
    }
    if (chosen.className) partes.push(chosen.className);
    return partes.filter(Boolean).join(" ");
  };
}
function cx(...partes) {
  return partes.filter(Boolean).join(" ");
}
export {
  cx,
  variants
};
//# sourceMappingURL=variants.js.map
