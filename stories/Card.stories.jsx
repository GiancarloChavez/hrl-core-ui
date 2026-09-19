import { Card, Button } from '../src/index.js';

export default { title: 'Primitivos / Card' };

export const Basica = () => <Card title="Sección">Contenido de la sección.</Card>;

export const ConSubtituloYTotal = () => (
  <Card title="Pacientes en seguimiento" subtitle="Últimos 30 días" total="128" accent="var(--accent)">
    Contenido de la sección.
  </Card>
);

export const ConAcciones = () => (
  <Card title="Producción" actions={<Button size="sm" tone="ghost">Ver todo</Button>}>
    Contenido de la sección.
  </Card>
);
