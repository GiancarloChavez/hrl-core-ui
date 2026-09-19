import { Badge } from '../src/index.js';

export default { title: 'Primitivos / Badge' };

export const Tonos = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <Badge label="Normal" tone="ok" />
    <Badge label="Alerta" tone="warn" />
    <Badge label="Crítico" tone="crit" />
    <Badge label="Informativo" tone="info" />
    <Badge label="Sin dato" tone="none" />
  </div>
);
