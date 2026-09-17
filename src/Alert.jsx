import { Icon } from './icons.jsx';

/* Aviso en línea. No confundir con Toast (efímero) ni con Dialog (bloquea):
   Alert explica una condición persistente dentro de la página.

   `tone`: info | success | warning | error
   El color nunca es la única señal: cada tone trae su icono y su texto. */
const TONOS = {
  info: { icono: 'sh-info', clase: 'hrl-aviso-info' },
  success: { icono: 'sh-ok', clase: 'hrl-aviso hrl-aviso--ok' },
  warning: { icono: 'sh-warn', clase: 'hrl-aviso' },
  error: { icono: 'sh-close', clase: 'hrl-error' },
};

export function Alert({ tone = 'info', title, children, action }) {
  const t = TONOS[tone] ?? TONOS.info;

  return (
    <div className={t.clase} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={t.icono} size={18} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <strong style={{ display: 'block', fontSize: 'var(--text-md)' }}>{title}</strong>}
        {children && (
          <p style={{ margin: title ? '4px 0 0' : 0, fontWeight: 400, lineHeight: 'var(--leading-normal)' }}>
            {children}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
