import { Tooltip } from './Tooltip.jsx';

const SEVERIDAD = {
  neutral: 'var(--accent)',
  normal: 'var(--success)',
  suspect: 'var(--warning)',
  abnormal: 'var(--destructive)',
  nodata: 'var(--subtle-foreground)',
};

const GLIFO = {
  neutral: 'M12 8v8M8 12h8',
  normal: 'M7.5 12.5l3 3 6-6.5',
  suspect: 'M12 8v5M12 16.5h0',
  abnormal: 'M12 7.5v6M12 16.6h0',
  nodata: 'M8.5 12h7',
};

export function StatCard({ label = 'Métrica', value = '—', note, severity = 'neutral', percent, delay = 0, info, onClick }) {
  const color = SEVERIDAD[severity] ?? SEVERIDAD.neutral;
  const conBarra = typeof percent === 'number';
  const pct = conBarra ? Math.max(0, Math.min(100, percent)) : 0;
  /* Con `onClick` la tarjeta es un control real (botón), no un `article` con
     un manejador pegado: así queda alcanzable con teclado y no rompe la
     selección de texto del resto de la tarjeta. */
  const Etiqueta = onClick ? 'button' : 'article';

  return (
    <Etiqueta
      type={onClick ? 'button' : undefined}
      className={`hrl-stat${onClick ? ' hrl-stat--clic' : ''}`}
      style={{ '--sev': color, '--delay': `${delay}ms`, '--pct': `${pct}%` }}
      onClick={onClick}
      aria-label={onClick ? `${label}: ${value}` : undefined}
    >
      <div className="hrl-stat__top">
        {info ? (
          <Tooltip title={label} body={info} focusable={!onClick}>
            <span className="hrl-stat__label hrl-stat__label--info">
              {label}
              <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="7.8" r="1.3" fill="currentColor" />
                <path d="M12 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </Tooltip>
        ) : (
          <span className="hrl-stat__label">{label}</span>
        )}
        <span className="hrl-stat__icon">
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" />
            <path
              d={GLIFO[severity] ?? GLIFO.neutral}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <strong className="hrl-stat__value">{value}</strong>
      {conBarra && (
        <div className="hrl-stat__track">
          <span className="hrl-stat__bar" />
        </div>
      )}
      {note && <span className="hrl-stat__note">{note}</span>}
    </Etiqueta>
  );
}
