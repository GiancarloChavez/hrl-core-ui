import { useEffect, useState } from 'react';
import { Tooltip } from './Tooltip.jsx';
import { Icon } from './icons.jsx';

/* Barra de pestañas con aviso.

   El punto naranja no es decorativo: aparece solo cuando el panel que hay
   detrás tiene realmente algo que avisar, y el texto del aviso lo pone quien
   consultó el dato. En cuanto se entra a la pestaña desaparece: ya se vio.

   `alerts` es {key: texto | null}. Una key sin texto no pinta nada.

   Cada pestaña es {key, label, icon?}: el icon es opcional porque hay
   barras que lo usan (Configuración) y otras que no (Indicadores). */
export function Tabs({ tabs, active, onChange, alerts = {}, style }) {
  const [vistas, setVistas] = useState(() => ({ [active]: true }));

  /* También cuenta como vista si el panel cambia de pestaña por su cuenta,
     por ejemplo desde un enlace de otra vista. */
  useEffect(() => {
    setVistas((v) => (v[active] ? v : { ...v, [active]: true }));
  }, [active]);

  return (
    <div className="hrl-tabs" style={style}>
      {tabs.map((p) => {
        const aviso = !vistas[p.key] ? alerts[p.key] : null;

        return (
          <button
            key={p.key}
            type="button"
            className={`hrl-tabs__btn${active === p.key ? ' hrl-tabs__btn--on' : ''}`}
            onClick={() => onChange(p.key)}
            aria-current={active === p.key ? 'true' : undefined}
          >
            {p.icon && <Icon name={p.icon} size={17} />}
            {p.label}
            {aviso && (
              <Tooltip title="Requiere atención" body={aviso} focusable={false}>
                <span className="hrl-punto-vivo" role="img" aria-label={`Requiere atención: ${aviso}`} />
              </Tooltip>
            )}
          </button>
        );
      })}
    </div>
  );
}
