/* Casilla de verificación.

   La etiqueta envuelve al control, así que toda la fila es clicable y el
   objetivo táctil llega a los 40 px aunque la casilla dibujada sea pequeña.
   Sin etiqueta visible —dentro de una tabla, por ejemplo— exige `aria-label`.

   `onChange` recibe el booleano, no el evento. */
export function Checkbox({ checked = false, onChange, label, 'aria-label': etiqueta, disabled = false }) {
  if (!label && !etiqueta && import.meta.env?.DEV) {
    console.warn('Checkbox sin etiqueta: necesita `label` o `aria-label`.');
  }

  return (
    <label
      className="hrl-check"
      style={{ alignItems: 'center', minHeight: 'var(--touch-target)', cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={label ? undefined : etiqueta}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ marginTop: 0 }}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
