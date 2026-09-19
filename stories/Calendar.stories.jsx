import { useState } from 'react';
import { Calendar } from '../src/index.js';

export default { title: 'Gráficos / Calendar' };

export const Basico = () => {
  const [seleccionado, setSeleccionado] = useState(3);
  return (
    <Calendar
      year={2026}
      month={9}
      selected={seleccionado}
      onSelect={setSeleccionado}
      statusOf={(d) => (d % 5 === 0 ? 'empty' : d % 3 === 0 ? 'partial' : 'full')}
      detailOf={(d) => (d % 3 === 0 ? `${d} at.` : undefined)}
      descriptionOf={(d) => `Día ${d}: registro de ejemplo`}
    />
  );
};
