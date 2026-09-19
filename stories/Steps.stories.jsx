import { useState } from 'react';
import { Steps } from '../src/index.js';

export default { title: 'Primitivos / Steps' };

export const Basico = () => {
  const [activo, setActivo] = useState('feb');
  return (
    <Steps
      active={activo}
      onChange={setActivo}
      steps={[
        { key: 'ene', title: 'Enero', status: 'ok' },
        { key: 'feb', title: 'Febrero', note: 'faltan 2 días', status: 'partial' },
        { key: 'mar', title: 'Marzo', status: 'empty' },
        { key: 'abr', title: 'Abril', note: 'no cuadra con el reporte', status: 'error' },
      ]}
    />
  );
};
