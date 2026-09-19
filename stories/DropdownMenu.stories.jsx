import { Button, DropdownMenu } from '../src/index.js';

export default { title: 'Capas flotantes / DropdownMenu' };

export const Basico = () => (
  <DropdownMenu
    trigger={<Button icon="sh-gear">Acciones</Button>}
    items={[
      { id: 'editar', label: 'Editar', icon: 'sh-doc', onSelect: () => {} },
      { id: 'exportar', label: 'Exportar', icon: 'sh-export', onSelect: () => {} },
      { separator: true },
      { id: 'borrar', label: 'Eliminar', icon: 'sh-trash', tone: 'peligro', onSelect: () => {} },
    ]}
  />
);
