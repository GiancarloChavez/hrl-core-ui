import { PageHeader, Button } from '../src/index.js';

export default { title: 'Layout / PageHeader' };

export const Basico = () => <PageHeader title="Indicadores" description="Resumen del periodo seleccionado" />;

export const Completo = () => (
  <PageHeader
    title="Consistencia"
    description="Hallazgos pendientes de revisión"
    breadcrumbs={[{ label: 'Inicio', href: '#' }, { label: 'Consistencia' }]}
    actions={<Button icon="sh-export">Exportar</Button>}
  />
);
