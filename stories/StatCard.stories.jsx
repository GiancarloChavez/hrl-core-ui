import { StatCard } from '../src/index.js';

export default { title: 'Primitivos / StatCard' };

export const Severidades = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
    <StatCard label="En rango" value="82%" severity="normal" info="Qué mide este indicador" />
    <StatCard label="Por revisar" value="12%" severity="suspect" info="Qué mide este indicador" />
    <StatCard label="Fuera de rango" value="6%" severity="abnormal" info="Qué mide este indicador" />
    <StatCard label="Neutral" value="10" severity="neutral" info="Qué mide este indicador" />
    <StatCard label="Sin dato" value="—" severity="nodata" info="Denominador cero: no se muestra 0%" />
  </div>
);

export const ConBarraYClic = () => (
  <StatCard label="Cobertura" value="64%" percent={64} severity="normal" info="Qué mide" onClick={() => {}} />
);
