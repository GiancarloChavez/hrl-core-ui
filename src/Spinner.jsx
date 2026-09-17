/* Animación de carga única para todo el sistema: un aro fino centrado en el
   espacio del módulo y el text de lo que se está calculando. El text importa
   porque una consulta lenta se entiende mejor si dice qué está haciendo.

   `height` reserva sitio para que el panel no dé un salto cuando llegan los
   datos; en bloques pequeños se pasa un valor menor. */
export function Spinner({ text = 'Cargando…', height = 220 }) {
  return (
    <div className="hrl-cargando" style={{ minHeight: height }} role="status" aria-live="polite">
      <span className="hrl-cargando__aro" aria-hidden="true" />
      <span className="hrl-cargando__texto">{text}</span>
    </div>
  );
}
