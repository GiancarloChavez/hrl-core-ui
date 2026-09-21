/* Contrato que se le escribe a un proyecto que consume el kit.

   Las reglas del kit van en un bloque con marcas: `upgrade` lo regenera con lo
   que diga la versión nueva y no toca nada fuera de él, que es del proyecto. */
export const INICIO = '<!-- hrl-core-ui:inicio -->';
export const FIN = '<!-- hrl-core-ui:fin -->';

export function bloque(version) {
  return `${INICIO}
<!-- Generado por \`npx hrl-core-ui init\` y refrescado por \`npx hrl-core-ui upgrade\`. No lo edites: lo que sea de este proyecto va fuera de estas marcas. -->

## Sistema de diseño (\`@hrl/core-ui\` v${version})

El sistema de diseño **no vive en este repositorio**: es el paquete \`@hrl/core-ui\`,
fijado a un tag en \`package.json\`. Este proyecto es un consumidor.

- Contrato completo para modificar el kit: \`node_modules/@hrl/core-ui/design.md\`.
  Catálogo de componentes: \`node_modules/@hrl/core-ui/UI_CATALOG.md\`. Léelos antes de
  crear un componente.
- Si falta un componente, un token o un icono, **se pide en el repositorio del kit**,
  se publica una versión y aquí se sube el tag. No se copia ni se edita aquí:
  \`node_modules\` se pierde en cada instalación.
- Importa solo de \`@hrl/core-ui\` y de \`@hrl/core-ui/tokens.css\`; nunca por una ruta
  interna. \`tokens.css\` se carga **antes** que los estilos de la aplicación.
- Sin HTML nativo con contraparte en el kit: \`<button>\` → \`Button\`/\`IconButton\`;
  \`<input>\`/\`<select>\`/\`<textarea>\` → \`Input\`; \`<table>\` → \`DataTable\`/\`PaginatedTable\`;
  modales → \`Dialog\`/\`DetailDialog\`; \`title="…"\` como tooltip → \`Tooltip\`; menús →
  \`DropdownMenu\`; \`alert()\`/\`confirm()\` → \`Dialog\`/\`Toast\`.
- Sin valores arbitrarios: colores, radios, sombras y tamaños de fuente salen de
  tokens (\`var(--…)\`), nunca escritos como literal.
- Los iconos salen solo de \`<Icon name="sh-…" />\`.
- La API del kit está en inglés; el código de la aplicación, sus comentarios y sus
  textos, en español.

Comprobar que la integración sigue sana: \`npx hrl-core-ui doctor\`.
Actualizar el kit: \`npx hrl-core-ui upgrade vX.Y.Z\` (cambia el tag, instala sin subir
otras dependencias, muestra el CHANGELOG y revisa el proyecto).
${FIN}
`;
}

export function esqueleto(nombre, version) {
  return `# Contrato de implementación — ${nombre}

Reglas obligatorias para cualquier trabajo sobre este repositorio. Si una regla
impide resolver algo, dilo y propón cambiarla; no la rodees en silencio.

${bloque(version)}
## Reglas propias de este proyecto

<!-- Lo que solo aplica a este sistema: su dominio, sus datos, sus convenciones. -->
`;
}

/* Sustituye el bloque de kit de un texto existente; devuelve null si no lo tiene. */
export function refrescar(texto, version) {
  const i = texto.indexOf(INICIO);
  const f = texto.indexOf(FIN);
  if (i < 0 || f < i) return null;
  const eol = texto.includes('\r\n') ? '\r\n' : '\n';
  return texto.slice(0, i) + bloque(version).replace(/\n$/, '').replace(/\n/g, eol) + texto.slice(f + FIN.length);
}
