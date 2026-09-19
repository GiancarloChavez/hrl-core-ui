import { useState } from 'react';
import { Pagination } from '../src/index.js';

export default { title: 'Datos / Pagination' };

export const Basico = () => {
  const [pagina, setPagina] = useState(1);
  return <Pagination page={pagina} totalPages={8} totalItems={76} onChange={setPagina} />;
};

export const ConSelectorDeFilas = () => {
  const [pagina, setPagina] = useState(3);
  const [porPagina, setPorPagina] = useState(20);
  return (
    <Pagination
      page={pagina}
      totalPages={12}
      totalItems={234}
      perPage={porPagina}
      onChange={setPagina}
      onPerPageChange={setPorPagina}
    />
  );
};
