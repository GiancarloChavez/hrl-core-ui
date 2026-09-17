/* Placeholder de carga. Se usa cuando ya se conoce la forma del contenido
   —rows de una tabla, tarjetas de una rejilla—; cuando no se conoce, va el
   Spinner de Spinner. */
export function Skeleton({ width = '100%', height = 14, radius = 'var(--radius-xs)', style }) {
  return <span className="hrl-skeleton" style={{ width: width, height: height, borderRadius: radius, ...style }} />;
}

/* Bloque de filas para una tabla mientras llegan los datos. */
export function SkeletonRows({ rows = 5, columns = 4 }) {
  return (
    <>
      {Array.from({ length: rows }, (_, f) => (
        <tr key={f} className="hrl-skeleton-fila">
          {Array.from({ length: columns }, (_, c) => (
            <td key={c}>
              <Skeleton width={c === 0 ? '65%' : `${40 + ((f + c) % 4) * 12}%`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
