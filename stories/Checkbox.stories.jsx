import { useState } from 'react';
import { Checkbox } from '../src/index.js';

export default { title: 'Primitivos / Checkbox' };

export const Basico = () => {
  const [marcado, setMarcado] = useState(true);
  return <Checkbox label="Incluir inactivos" checked={marcado} onChange={setMarcado} />;
};

export const Deshabilitado = () => <Checkbox label="No editable" checked disabled />;
