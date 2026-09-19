import { useState } from 'react';
import { NumberCell } from '../src/index.js';

export default { title: 'Primitivos / NumberCell' };

export const Basico = () => {
  const [valor, setValor] = useState(4.5);
  return <NumberCell aria-label="Atenciones" value={valor} onChange={setValor} />;
};

export const ConError = () => <NumberCell aria-label="Atenciones" value={null} onChange={() => {}} error />;
