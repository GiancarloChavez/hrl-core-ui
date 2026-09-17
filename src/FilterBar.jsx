/* Barra de filtros de una vista.

   Rejilla de cuatro columns con los campos y una fila propia para los
   botones: el número de filtros cambia según la vista, y una posición fija de
   las actions acaba solapando el último campo.

     <FilterBar
       actions={
         <>
           <Button onClick={consultar}>Consultar</Button>
           <Button tone="ghost" onClick={limpiar}>Limpiar</Button>
         </>
       }
       footer={<span>Consulta acotada al último mes cerrado.</span>}
     >
       <Input label="Desde" kind="date" value={desde} onChange={...} />
       <Input label="Hasta" kind="date" value={hasta} onChange={...} />
     </FilterBar> */
export function FilterBar({ children, actions, footer, columns }) {
  return (
    <>
      <div
        className="hrl-filtros-barra"
        style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {children}
        {actions && (
          <div className="hrl-filtros-barra__acciones" style={{ gridColumn: '1 / -1', justifySelf: 'end' }}>
            {actions}
          </div>
        )}
      </div>
      {footer && <div className="hrl-chips-consulta">{footer}</div>}
    </>
  );
}
