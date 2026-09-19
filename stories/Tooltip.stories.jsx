import { Tooltip, Icon } from '../src/index.js';

export default { title: 'Capas flotantes / Tooltip' };

export const Basico = () => (
  <Tooltip body="Explicación de qué mide este indicador">
    <Icon name="sh-info" />
  </Tooltip>
);

export const ConTitulo = () => (
  <Tooltip title="Cobertura" body="Porcentaje de pacientes tamizados sobre el total esperado en el periodo.">
    <span style={{ textDecoration: 'underline dotted' }}>Cobertura</span>
  </Tooltip>
);
