import { useState } from 'react';
import { FilterBar, Input, Button } from '../src/index.js';

export default { title: 'Layout / FilterBar' };

export const Basico = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  return (
    <FilterBar
      actions={
        <>
          <Button>Consultar</Button>
          <Button tone="ghost">Limpiar</Button>
        </>
      }
      footer={<span>Consulta acotada al último mes cerrado.</span>}
    >
      <Input label="Desde" kind="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
      <Input label="Hasta" kind="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
    </FilterBar>
  );
};
