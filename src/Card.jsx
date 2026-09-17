export function Card({ title = 'Sección', subtitle, total, accent, actions, flush = false, children }) {
  return (
    <section className={`hrl-section${flush ? ' hrl-section--flush' : ''}`}>
      <div className="hrl-section__head">
        <div className="hrl-section__title-row">
          {accent && <span className="hrl-section__accent" style={{ '--accent': accent }} />}
          <div style={{ minWidth: 0 }}>
            <h3 className="hrl-section__title">{title}</h3>
            {subtitle && <p className="hrl-section__subtitle">{subtitle}</p>}
          </div>
          {total && <span className="hrl-section__total">· {total}</span>}
        </div>
        {/* Al otro extremo de la fila, a la altura del título: así una acción
           propia de la sección (exportar, expandir todo) no cae en una fila
           aparte más abajo, descuadrada del encabezado. */}
        {actions && <div className="hrl-section__acciones">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
