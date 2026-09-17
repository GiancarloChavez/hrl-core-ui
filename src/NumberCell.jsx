/* Casilla numérica para rejillas de captura.

   `Input` no sirve aquí: siempre pinta su etiqueta, y en una cuadrícula la
   etiqueta es la fila o la columna. Esta casilla la recibe por `aria-label`,
   así que sigue teniendo nombre accesible sin ocupar espacio.

   Tipo `text` con `inputMode="decimal"` y no `type="number"`: el número nativo
   cambia de valor con la rueda del ratón, y en un cuadro de treinta filas eso
   significa alterar una cifra al desplazarse sin darse cuenta.

   `onChange` recibe un número o `null`. Nunca una cadena vacía ni un NaN: la
   ausencia de dato es `null` y se distingue del cero, que es un dato. */

import { useState } from 'react';

function interpretar(texto) {
  const limpio = texto.trim().replace(',', '.');
  if (limpio === '') return null;
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
}

export function NumberCell({
  value,
  onChange,
  'aria-label': etiqueta,
  width = 96,
  error = false,
  disabled = false,
  suffix,
  placeholder = '—',
}) {
  if (!etiqueta && !disabled && import.meta.env?.DEV) {
    console.warn('NumberCell sin aria-label: una casilla de rejilla no tiene etiqueta visible.');
  }

  /* El texto en curso se guarda aparte del número. Si la casilla pintara
     siempre `String(value)`, teclear un importe sería imposible: «530,» vale
     530 y se redibujaría como «530» antes de escribir los céntimos.

     Cuando el valor cambia desde fuera (otra fila, un reinicio), el texto se
     resincroniza, salvo que ya represente ese mismo número: así «4,50» no se
     convierte en «4.5» mientras se escribe. */
  const [texto, setTexto] = useState(value == null ? '' : String(value));
  const [previo, setPrevio] = useState(value);
  if (value !== previo) {
    setPrevio(value);
    if (interpretar(texto) !== (value ?? null)) setTexto(value == null ? '' : String(value));
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <input
        className={`hrl-input-mini${error ? ' hrl-input-mini--error' : ''}`}
        style={{ width, textAlign: 'right' }}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        aria-label={etiqueta}
        aria-invalid={error || undefined}
        disabled={disabled}
        placeholder={placeholder}
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          onChange?.(interpretar(e.target.value));
        }}
      />
      {suffix && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{suffix}</span>}
    </span>
  );
}
