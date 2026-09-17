import { FloatingTip } from './Tooltip.jsx';
import { useFloatingTip } from './useFloatingTip.js';

/* Tira de fichas donde solo una está activa y algunas están marcadas.

   Nació para elegir el día de un registro diario, pero el kit no sabe qué
   representan las fichas: recibe la lista ya construida. Sirve igual para
   turnos, lotes o semanas.

   Usa una sola capa flotante compartida para los tooltips. Con treinta y un
   fichas, montar un tooltip por ficha sería desproporcionado; y sin tooltip, un
   subtítulo de una letra es una adivinanza.

     items: { key, title, subtitle?, marked?, tip?: {title, body}, description? }[] */
export function SelectionStrip({ items = [], active, onChange, label = 'Selección' }) {
  const { tip, follow, hide } = useFloatingTip();

  return (
    <>
      <div className="hrl-tira" role="group" aria-label={label}>
        {items.map((item) => {
          const titulo = item.tip?.title ?? item.title;
          const cuerpo = item.tip?.body ?? item.description ?? '';

          /* Con el teclado no hay puntero: el tooltip se ancla a la ficha. */
          const anclar = (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            follow({ clientX: r.left + r.width / 2, clientY: r.top }, titulo, cuerpo);
          };

          return (
            <button
              key={item.key}
              type="button"
              className={`hrl-tira__item${item.key === active ? ' hrl-tira__item--on' : ''}${item.marked ? ' hrl-tira__item--marcado' : ''}`}
              aria-pressed={item.key === active}
              aria-label={item.description ?? item.title}
              onClick={() => onChange?.(item.key)}
              onMouseEnter={(e) => cuerpo && follow(e, titulo, cuerpo)}
              onMouseMove={(e) => cuerpo && follow(e, titulo, cuerpo)}
              onMouseLeave={hide}
              onFocus={(e) => cuerpo && anclar(e)}
              onBlur={hide}
            >
              <span className="hrl-tira__titulo">{item.title}</span>
              {item.subtitle && <span className="hrl-tira__sub">{item.subtitle}</span>}
            </button>
          );
        })}
      </div>

      <FloatingTip tip={tip} />
    </>
  );
}
