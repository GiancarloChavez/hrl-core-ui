import { Tooltip } from './Tooltip.jsx';

/* Texto de una línea que se recorta con puntos suspensivos y muestra el
   contenido completo en el tooltip del kit.

   Existe para que ninguna tabla vuelva a resolverlo con `title="..."` nativo:
   ese tooltip del navegador tarda un segundo en aparecer, no se puede leer con
   el teclado y no respeta la tipografía del sistema (ver design.md § 2.1).

     <TruncatedText text={f.descripcion} width={520} label="Descripción" />

   `width` acota la línea; sin él vale el máximo de `.hrl-trunc`. `label` es
   el título del tooltip: si no se pasa, el tooltip muestra solo el texto. */
export function TruncatedText({ text, width, label, empty = '—' }) {
  const contenido = text || '';

  /* Sin texto no hay nada que ampliar: se evita un tooltip vacío. */
  if (!contenido) {
    return <span className="hrl-trunc">{empty}</span>;
  }

  return (
    <Tooltip
      title={label}
      body={contenido}
      focusable={false}
      style={{ display: 'block', minWidth: 0, maxWidth: width }}
    >
      <span className="hrl-trunc" style={width ? { maxWidth: width } : undefined}>
        {contenido}
      </span>
    </Tooltip>
  );
}
