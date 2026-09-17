/* Caché de promesas por clave, viva mientras dure la sesión de la pestaña.

   Existe por los avisos de las pestañas: para saber si una pestaña tiene algo
   que advertir hay que consultar su origen de datos antes de que el usuario
   entre. Sin esto, abrir la pestaña repetiría la consulta que el aviso ya
   había hecho.

   Se guarda la promesa, no el resultado, para que dos llamadas simultáneas
   compartan la misma petición. Un fallo se borra para poder reintentar. */
const memoria = new Map();

export function memoize(clave, obtener) {
  if (!memoria.has(clave)) {
    memoria.set(
      clave,
      obtener().catch((e) => {
        memoria.delete(clave);
        throw e;
      }),
    );
  }
  return memoria.get(clave);
}

/* Para los botones de «volver a consultar»: sin esto devolverían el mismo
   resultado cacheado y el botón parecería roto. */
export function invalidate(prefijo) {
  for (const clave of memoria.keys()) {
    if (clave.startsWith(prefijo)) memoria.delete(clave);
  }
}
