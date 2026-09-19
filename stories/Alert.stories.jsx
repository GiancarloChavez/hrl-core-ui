import { Alert, Button } from '../src/index.js';

export default { title: 'Primitivos / Alert' };

export const Tonos = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <Alert tone="info" title="Información">Un dato que conviene saber.</Alert>
    <Alert tone="success" title="Listo">La operación se completó.</Alert>
    <Alert tone="warning" title="Atención">Hay campos sin completar.</Alert>
    <Alert tone="error" title="Error">No se pudo guardar el registro.</Alert>
  </div>
);

export const ConAccion = () => (
  <Alert tone="warning" title="Meta no definida" action={<Button size="sm" tone="ghost">Configurar</Button>}>
    Esta métrica no tiene una meta registrada.
  </Alert>
);
