import { Tooltip, Icon } from '../src/index.js';

export default { title: 'Capas flotantes / Tooltip' };

export const Basico = () => (
  <Tooltip body="Explicación de qué mide este indicador">
    <Icon name="sh-info" />
  </Tooltip>
);

export const ConTitulo = () => (
  <Tooltip title="Cobertura" body="Porcentaje de registros completos sobre el total esperado en el periodo.">
    <span style={{ textDecoration: 'underline dotted' }}>Cobertura</span>
  </Tooltip>
);

/* El tooltip sale al costado del cursor y nunca debajo de él; cerca de un
   borde cambia de lado o se acota. Cada disparador está pegado a una esquina. */
const Esquina = ({ posicion, etiqueta }) => (
  <div style={{ position: 'fixed', ...posicion }}>
    <Tooltip title={etiqueta} body="Explicación de qué mide este indicador, con el texto suficiente para ocupar varias líneas dentro del tooltip.">
      <span style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>{etiqueta}</span>
    </Tooltip>
  </div>
);

export const EnLasEsquinas = () => (
  <>
    <Esquina posicion={{ left: 24, top: 24 }} etiqueta="Arriba izquierda" />
    <Esquina posicion={{ right: 24, top: 24 }} etiqueta="Arriba derecha" />
    <Esquina posicion={{ left: 24, bottom: 24 }} etiqueta="Abajo izquierda" />
    <Esquina posicion={{ right: 24, bottom: 24 }} etiqueta="Abajo derecha" />
  </>
);
