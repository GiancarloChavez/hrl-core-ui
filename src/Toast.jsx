import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useExitAnimation, EXIT_MS } from './useExitAnimation.js';

/* En document.body por el mismo motivo que los modales: dentro del panel, su
   `position: fixed` se resolvía contra el panel y el aviso aparecía al pie del
   contenido en lugar de al pie de la ventana. */
export function Toast({ message, onClose, duration = 3600 }) {
  const { leaving, close } = useExitAnimation(onClose);

  /* El aviso se va solo: se descuenta la salida para que el tiempo total en
     pantalla siga siendo el pedido. */
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(close, Math.max(0, duration - EXIT_MS));
    return () => clearTimeout(t);
  }, [message, close, duration]);

  if (!message) return null;

  return createPortal(
    <div className={`hrl-portal hrl-toast${leaving ? ' hrl-toast--saliendo' : ''}`} role="status">
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ color: 'var(--success-text)', flex: '0 0 auto' }} aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.24" />
        <path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {message}
    </div>,
    document.body,
  );
}
