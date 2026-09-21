import { Button, DropdownMenu } from '../src/index.js';

export default { title: 'Capas flotantes / DropdownMenu' };

export const Basico = () => (
  <DropdownMenu
    trigger={<Button icon="sh-gear">Acciones</Button>}
    items={[
      { id: 'editar', label: 'Editar', icon: 'sh-doc', onSelect: () => {} },
      { id: 'exportar', label: 'Exportar', icon: 'sh-export', onSelect: () => {} },
      { separator: true },
      { id: 'borrar', label: 'Eliminar', icon: 'sh-trash', tone: 'danger', onSelect: () => {} },
    ]}
  />
);

/* El menú tiene que quedar dentro de la ventana aunque el disparador esté
   pegado a un borde: se abre hacia arriba si abajo no cabe y se acota
   horizontalmente. Cada historia fija el disparador a una esquina. */
const ITEMS_ESQUINA = [
  { id: 'editar', label: 'Editar', icon: 'sh-doc', onSelect: () => {} },
  { id: 'exportar', label: 'Exportar', icon: 'sh-export', onSelect: () => {} },
  { separator: true },
  { id: 'borrar', label: 'Eliminar', icon: 'sh-trash', tone: 'danger', onSelect: () => {} },
];

const enEsquina = (posicion, align) => () => (
  <div style={{ position: 'fixed', ...posicion }}>
    <DropdownMenu trigger={<Button icon="sh-gear">Acciones</Button>} items={ITEMS_ESQUINA} align={align} />
  </div>
);

export const EsquinaInferiorDerecha = enEsquina({ right: 24, bottom: 24 }, 'right');
export const EsquinaInferiorIzquierda = enEsquina({ left: 24, bottom: 24 }, 'right');
export const EsquinaSuperiorDerecha = enEsquina({ right: 24, top: 24 }, 'left');
