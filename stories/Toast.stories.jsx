import { useState } from 'react';
import { Button, Toast } from '../src/index.js';

export default { title: 'Capas flotantes / Toast' };

export const Basico = () => {
  const [mensaje, setMensaje] = useState(null);
  return (
    <>
      <Button onClick={() => setMensaje('Cambios guardados')}>Guardar</Button>
      <Toast message={mensaje} onClose={() => setMensaje(null)} />
    </>
  );
};
