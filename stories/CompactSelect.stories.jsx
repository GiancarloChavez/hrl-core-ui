import { useState } from 'react';
import { CompactSelect } from '../src/index.js';

export default { title: 'Primitivos / CompactSelect' };

export const Basico = () => {
  const [anio, setAnio] = useState('2026');
  return (
    <CompactSelect
      aria-label="Año"
      options={['2024', '2025', '2026']}
      value={anio}
      onChange={(e) => setAnio(e.target.value)}
    />
  );
};

export const Deshabilitado = () => (
  <CompactSelect aria-label="Año" options={['2026']} value="2026" disabled />
);
