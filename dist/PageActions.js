import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
const PAGE_ACTIONS_ID = "hrl-acciones-pagina";
function PageActions({ children }) {
  const [destino, setDestino] = useState(null);
  useEffect(() => {
    setDestino(document.getElementById(PAGE_ACTIONS_ID));
  }, []);
  return destino ? createPortal(children, destino) : null;
}
export {
  PAGE_ACTIONS_ID,
  PageActions
};
//# sourceMappingURL=PageActions.js.map
