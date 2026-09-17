import { Icon } from './icons.jsx';

/* Paso a paso de un formulario largo.

   Cada paso dice su estado con icono y con texto, nunca solo con color. En un
   reporte de treinta días, «faltan cuatro días» tiene que poder leerse sin
   interpretar un tono de verde.

   Los pasos son navegables en cualquier orden a propósito: quien llena un
   reporte mensual no va de principio a fin de una sentada, vuelve a completar
   lo que le faltaba. Bloquear el paso 3 hasta terminar el 2 obligaría a
   inventar datos para poder avanzar.

     steps: { key, title, note, status }[]
     status: 'empty' | 'partial' | 'ok' | 'error' */

const ESTADOS = {
  empty: { icono: 'sh-none', color: 'var(--subtle-foreground)' },
  partial: { icono: 'sh-clock', color: 'var(--warning-fg)' },
  ok: { icono: 'sh-ok', color: 'var(--success-text)' },
  error: { icono: 'sh-crit', color: 'var(--destructive-text)' },
};

export function Steps({ steps = [], active, onChange, label = 'Pasos del formulario' }) {
  return (
    <div className="hrl-pasos" role="tablist" aria-label={label}>
      {steps.map((paso, i) => {
        const marca = ESTADOS[paso.status] ?? ESTADOS.empty;
        const seleccionado = paso.key === active;

        return (
          <button
            key={paso.key}
            type="button"
            role="tab"
            aria-selected={seleccionado}
            className={`hrl-paso${seleccionado ? ' hrl-paso--on' : ''}`}
            onClick={() => onChange?.(paso.key)}
          >
            <span className="hrl-paso__num" aria-hidden="true">
              {i + 1}
            </span>
            <span className="hrl-paso__texto">
              <span className="hrl-paso__titulo">{paso.title}</span>
              <span className="hrl-paso__nota" style={{ color: marca.color }}>
                <Icon name={marca.icono} size={14} />
                {paso.note}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
