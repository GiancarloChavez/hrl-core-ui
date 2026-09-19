import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons.jsx';
import { aliasObsoleto } from './deprecated.js';

/* Menú desplegable accesible, sin Radix.

   Cumple lo que el contrato exige de cualquier capa flotante: cierra con Esc y
   con clic exterior, devuelve el foco al trigger, navega con flechas y se
   monta en document.body para que ninguna animación con `transform` de un
   contenedor lo convierta en su bloque contenedor.

     <DropdownMenu
       trigger={<Button icon="sh-gear">Acciones</Button>}
       items={[
         { id: 'editar', label: 'Editar', icon: 'sh-doc', onSelect: () => {} },
         { separator: true },
         { id: 'borrar', label: 'Eliminar', icon: 'sh-trash', tone: 'danger', onSelect: () => {} },
       ]}
     /> */
/* `align`: right (por defecto) | left. `tone` de un ítem: danger. Los nombres en
   español anteriores se siguen aceptando (ver deprecated.js). */
const ALIGN_ALIASES = { derecha: 'right', izquierda: 'left' };
const TONE_ALIASES = { peligro: 'danger' };

export function DropdownMenu({ trigger, items = [], align: alineacionPedida = 'right', label = 'Menú de acciones' }) {
  const align = aliasObsoleto(ALIGN_ALIASES, alineacionPedida, 'DropdownMenu');
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState(null);
  const [activo, setActivo] = useState(-1);
  const refDisparador = useRef(null);
  const refMenu = useRef(null);
  const id = useId();

  const seleccionables = items.filter((i) => !i.separator && !i.disabled);

  const cerrar = useCallback((devolverFoco = true) => {
    setAbierto(false);
    setActivo(-1);
    if (devolverFoco) refDisparador.current?.focus();
  }, []);

  const abrir = () => {
    const r = refDisparador.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ top: r.bottom + 6, left: align === 'right' ? r.right : r.left, align });
    setAbierto(true);
  };

  useEffect(() => {
    if (!abierto) return undefined;

    const alTeclear = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        cerrar();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActivo((v) => (v + 1) % seleccionables.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActivo((v) => (v <= 0 ? seleccionables.length - 1 : v - 1));
      } else if (e.key === 'Tab') {
        cerrar(false);
      }
    };

    const alPulsarFuera = (e) => {
      if (refMenu.current?.contains(e.target) || refDisparador.current?.contains(e.target)) return;
      cerrar(false);
    };

    /* Cerrar al desplazar es más honesto que quedarse pegado a un punto que
       ya no corresponde al trigger. */
    const alMover = () => cerrar(false);

    window.addEventListener('keydown', alTeclear, true);
    window.addEventListener('mousedown', alPulsarFuera);
    window.addEventListener('scroll', alMover, true);
    window.addEventListener('resize', alMover);
    return () => {
      window.removeEventListener('keydown', alTeclear, true);
      window.removeEventListener('mousedown', alPulsarFuera);
      window.removeEventListener('scroll', alMover, true);
      window.removeEventListener('resize', alMover);
    };
  }, [abierto, cerrar, seleccionables.length]);

  useEffect(() => {
    if (abierto && activo >= 0) {
      refMenu.current?.querySelectorAll('[role="menuitem"]')[activo]?.focus();
    }
  }, [abierto, activo]);

  return (
    <>
      <span
        ref={refDisparador}
        onClick={() => (abierto ? cerrar() : abrir())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !abierto) {
            e.preventDefault();
            abrir();
            setActivo(0);
          }
        }}
        style={{ display: 'inline-flex' }}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? id : undefined}
      >
        {trigger}
      </span>

      {abierto &&
        pos &&
        createPortal(
          <div
            id={id}
            ref={refMenu}
            className="hrl-portal hrl-menu"
            role="menu"
            aria-label={label}
            style={{
              top: pos.top,
              left: pos.align === 'right' ? undefined : pos.left,
              right: pos.align === 'right' ? window.innerWidth - pos.left : undefined,
            }}
          >
            {items.map((item, i) =>
              item.separator ? (
                <span key={`sep-${i}`} className="hrl-menu__separador" role="separator" />
              ) : (
                <button
                  key={item.id ?? item.label}
                  type="button"
                  role="menuitem"
                  className={`hrl-menu__item${aliasObsoleto(TONE_ALIASES, item.tone, 'DropdownMenu') === 'danger' ? ' hrl-menu__item--peligro' : ''}`}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onSelect?.();
                    cerrar();
                  }}
                >
                  {item.icon && <Icon name={item.icon} size={16} />}
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.shortcut && <span className="hrl-menu__atajo">{item.shortcut}</span>}
                </button>
              ),
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
