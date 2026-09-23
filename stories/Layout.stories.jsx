import { Card, Grid, Stack, StatCard } from '../src/index.js';

export default { title: 'Composición / Layout' };

const Caja = ({ children }) => (
  <div style={{ padding: 'var(--space-3)', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>{children}</div>
);

export const Columna = () => (
  <Stack gap={3}>
    <Caja>Primero</Caja>
    <Caja>Segundo</Caja>
    <Caja>Tercero</Caja>
  </Stack>
);

export const FilaConSeparacion = () => (
  <Stack direction="row" gap={4} align="center" justify="between" wrap>
    <Caja>Título de la vista</Caja>
    <Stack direction="row" gap={2}>
      <Caja>Filtro</Caja>
      <Caja>Exportar</Caja>
    </Stack>
  </Stack>
);

export const RejillaAutomatica = () => (
  <Grid min={220} gap={4}>
    <StatCard label="Atenciones" value="1 240" />
    <StatCard label="Pacientes" value="318" />
    <StatCard label="Con biopsia" value="96" />
    <StatCard label="En quimioterapia" value="41" />
  </Grid>
);

export const ColumnasFijas = () => (
  <Grid columns={2} gap={5}>
    <Card title="Izquierda">Contenido</Card>
    <Card title="Derecha">Contenido</Card>
  </Grid>
);
