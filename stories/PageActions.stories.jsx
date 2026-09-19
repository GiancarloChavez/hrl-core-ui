import { PageHeader, PageActions, Button } from '../src/index.js';

export default { title: 'Layout / PageActions' };

/* PageActions se porta hacia el destino que PageHeader ya deja montado
   (PAGE_ACTIONS_ID): así una vista declara sus controles donde vive su
   estado, sin que el shell tenga que conocerlo. */
export const Basico = () => (
  <div style={{ border: '1px dashed var(--border)' }}>
    <PageHeader title="Producción" description="Vista de ejemplo" />
    <PageActions>
      <Button icon="sh-export" size="sm">Exportar</Button>
    </PageActions>
  </div>
);
