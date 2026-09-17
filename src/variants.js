/* Variantes de clase, equivalente mínimo de class-variance-authority.

   No se instala CVA porque el kit no tiene dependencias: son doce líneas y el
   contrato es el mismo. `variants()` devuelve una función que compone la
   clase base con la de cada variante elegida.

     const clase = variants('hrl-btn', {
       tone: { cta: 'hrl-btn--cta', ghost: 'hrl-btn--ghost' },
       size: { md: '', sm: 'hrl-btn-mini' },
     }, { tone: 'cta', size: 'md' });

     clase({ tone: 'ghost' })   // 'hrl-btn hrl-btn--ghost'
*/
export function variants(base, map = {}, defaults = {}) {
  return (options = {}) => {
    const chosen = { ...defaults, ...options };
    const partes = [base];

    for (const [grupo, valores] of Object.entries(map)) {
      const clase = valores[chosen[grupo]];
      if (clase) partes.push(clase);
    }
    if (chosen.className) partes.push(chosen.className);

    return partes.filter(Boolean).join(' ');
  };
}

/* Une clases condicionales. Equivalente de clsx, sin dependencia. */
export function cx(...partes) {
  return partes.filter(Boolean).join(' ');
}
