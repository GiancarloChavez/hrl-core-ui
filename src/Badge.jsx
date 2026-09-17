/* El color nunca es la única señal: cada tono lleva su propio icono. */
const TONOS = {
  ok: { fg: 'var(--ok-text)', bg: 'rgba(0,167,111,0.16)', glifo: 'M7.5 12.5l3 3 6-6.5' },
  warn: { fg: 'var(--warning-text)', bg: 'rgba(255,171,0,0.18)', glifo: 'M12 8v5M12 16.4h0' },
  crit: { fg: 'var(--danger-text)', bg: 'rgba(255,86,48,0.16)', glifo: 'M12 7.5v6M12 16.6h0' },
  info: { fg: 'var(--accent-text)', bg: 'rgba(24,119,242,0.14)', glifo: 'M12 11v6M12 7.9h0' },
  none: { fg: 'var(--neutral-text)', bg: 'rgba(145,158,171,0.16)', glifo: 'M8.5 12h7' },
};

export function Badge({ label = 'Estado', tone = 'none' }) {
  const t = TONOS[tone] ?? TONOS.none;

  return (
    <span className="hrl-badge" style={{ '--tone-fg': t.fg, '--tone-bg': t.bg }}>
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.22" />
        <path d={t.glifo} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}
