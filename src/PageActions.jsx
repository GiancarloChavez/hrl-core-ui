import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/* Ranura del encabezado de página, a la derecha del título.

   `PageHeader` la dibuja siempre, vacía. El título lo pone el shell, pero los
   controles que van a su lado (un periodo, un Exportar) dependen del estado de
   la vista que está abierta, y esa vista vive más abajo en el árbol. Subirlos
   por props obligaría al shell a conocer el estado de cada módulo; con un
   portal, la vista los declara donde tiene su estado y se muestran arriba.

   Al desmontarse la vista, sus controles desaparecen con ella.

     <PageActions>
       <Button icon="sh-export">Exportar</Button>
     </PageActions> */
export const PAGE_ACTIONS_ID = 'hrl-acciones-pagina';

export function PageActions({ children }) {
  /* El destino se busca tras montar: durante el primer render del árbol el
     encabezado todavía no está en el DOM. */
  const [destino, setDestino] = useState(null);

  useEffect(() => {
    setDestino(document.getElementById(PAGE_ACTIONS_ID));
  }, []);

  return destino ? createPortal(children, destino) : null;
}
