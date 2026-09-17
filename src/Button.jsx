import { variants } from './variants.js';
import { Icon } from './icons.jsx';

/* Botón del sistema. Único punto de entrada: en la aplicación no se escribe
   <button> a mano (ver CLAUDE.md).

   - `tone`   cta | blue | ghost | peligro | plano
   - `size` md (40px, objetivo táctil mínimo) | sm
   - `icon`  nombre del registro de iconos, a la izquierda del texto
   - `loading` bloquea el botón y sustituye el texto por el de `loadingText` */
const clase = variants(
  'hrl-btn',
  {
    tone: {
      cta: 'hrl-btn--cta',
      blue: 'hrl-btn--blue',
      ghost: 'hrl-btn--ghost',
      danger: 'hrl-btn--peligro',
      plain: '',
    },
    size: { md: '', sm: 'hrl-btn--mini' },
  },
  { tone: 'cta', size: 'md' },
);

export function Button({
  tone = 'cta',
  size = 'md',
  icon,
  loading = false,
  loadingText = 'Procesando…',
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={clase({ tone, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 16} />}
      {loading ? loadingText : children}
    </button>
  );
}

/* Botón de solo icono. Obliga a `aria-label` porque no tiene texto. */
export function IconButton({ icon, 'aria-label': label, tone = 'plano', className, ...rest }) {
  if (!label && import.meta.env?.DEV) {
    console.warn('IconButton sin aria-label: un botón sin texto necesita nombre accesible.');
  }
  return (
    <button
      type="button"
      className={`hrl-iconbtn${tone === 'accion' ? ' hrl-accion' : ''}${className ? ` ${className}` : ''}`}
      aria-label={label}
      {...rest}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}
