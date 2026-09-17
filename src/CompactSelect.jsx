/* Desplegable sin etiqueta encima, para donde no cabe un `Input`: una celda
   de tabla o una barra de acciones.

   No sustituye a `Input kind="select"` — ese sigue siendo el de los
   formularios y filtros. Este existe porque, sin él, cada panel que necesita
   un select en línea termina escribiendo un `<select>` a mano con su propia
   clase, que es como aparecieron tres estilos distintos para lo mismo.

   Al no tener label visible, `aria-label` es obligatorio.

     <CompactSelect
       aria-label="Año a exportar"
       options={anios}
       value={anio}
       onChange={(e) => setAnio(e.target.value)}
     /> */
export function CompactSelect({
  options = [],
  value,
  onChange,
  disabled,
  'aria-label': label,
  width,
}) {
  if (!label && import.meta.env?.DEV) {
    console.warn('CompactSelect sin aria-label: un control sin label visible necesita nombre accesible.');
  }

  return (
    <select
      className="hrl-select-mini"
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={label}
      style={width ? { width: width } : undefined}
    >
      {options.map((o) => {
        const value = typeof o === 'string' ? o : o.value;
        const text = typeof o === 'string' ? o : o.label;
        return (
          <option key={value} value={value}>
            {text}
          </option>
        );
      })}
    </select>
  );
}
