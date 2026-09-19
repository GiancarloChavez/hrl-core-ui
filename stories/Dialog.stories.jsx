import { useState } from 'react';
import { Dialog, Button } from '../src/index.js';

export default { title: 'Capas flotantes / Dialog' };

/* Se monta con createPortal en document.body: solo se ve correctamente
   sirviendo la historia en el navegador (`ladle serve`), no en una captura
   estática del árbol de React. */
export const Basico = () => {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <Button onClick={() => setAbierto(true)}>Abrir diálogo</Button>
      {abierto && (
        <Dialog title="Confirmar acción" subtitle="Esta operación no se puede deshacer" onClose={() => setAbierto(false)}>
          Contenido del diálogo.
        </Dialog>
      )}
    </>
  );
};

export const Destructivo = () => {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <Button tone="danger" onClick={() => setAbierto(true)}>Eliminar registro</Button>
      {abierto && (
        <Dialog
          title="Eliminar registro"
          subtitle="Se perderá el historial asociado. Esta acción no se puede deshacer."
          onClose={() => setAbierto(false)}
          footer={
            <>
              <Button tone="ghost" onClick={() => setAbierto(false)}>Cancelar</Button>
              <Button tone="danger" onClick={() => setAbierto(false)}>Eliminar</Button>
            </>
          }
        >
          ¿Confirmas que quieres eliminar este registro?
        </Dialog>
      )}
    </>
  );
};
