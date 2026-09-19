import { EmptyState, Button } from '../src/index.js';

export default { title: 'Estados / EmptyState' };

export const Basico = () => (
  <EmptyState
    title="Sin registros en este periodo"
    body="No se encontraron atenciones para el filtro seleccionado. Prueba con otro rango de fechas."
  />
);

export const ConAccion = () => (
  <EmptyState title="Aún no hay metas configuradas" body="Define una meta para que este indicador tenga con qué compararse.">
    <Button size="sm">Configurar meta</Button>
  </EmptyState>
);
