import { useState } from 'react';
import { SelectionStrip } from '../src/index.js';

export default { title: 'Primitivos / SelectionStrip' };

export const Basico = () => {
  const [activo, setActivo] = useState('3');
  const items = Array.from({ length: 10 }, (_, i) => ({
    key: String(i + 1),
    title: String(i + 1),
    subtitle: i % 7 === 6 ? 'D' : 'L',
    marked: i % 4 === 0,
    description: i % 4 === 0 ? 'Día con registro completo' : 'Sin registro',
  }));
  return <SelectionStrip items={items} active={activo} onChange={setActivo} label="Días del mes" />;
};
