# @hrl/core-ui

Sistema de diseño del Hospital Regional de Loreto: componentes React y tokens
CSS. **Sin dependencias**: lo único que necesita el proyecto que lo use es
React 19.

Nació dentro del Sistema de Vigilancia Oncológica y se extrajo cuando un
segundo sistema lo necesitó. La lista completa de lo que ofrece está en
[`UI_CATALOG.md`](UI_CATALOG.md).

---

## Instalación

No está publicado en npm. Se instala por URL de Git, fijando la versión con el
tag:

```bash
npm i github:evatissac/hrl-core-ui#v1.0.0
```

Actualizar es cambiar el tag. Sin tag, npm toma la rama por defecto y el kit
puede moverse bajo los pies del proyecto: **fija siempre la versión**.

## Uso

```jsx
// Una vez, en el punto de entrada: los tokens antes que nada.
import '@hrl/core-ui/tokens.css';

// En cualquier parte:
import { AppShell, Card, DataTable, Button } from '@hrl/core-ui';
```

El sprite de iconos se monta una sola vez, en la raíz de la aplicación:

```jsx
import { IconSprite } from '@hrl/core-ui';
```

`AppShell` no sabe de qué sistema forma parte: el nombre que se ve en la barra
superior se le pasa por `brand`, y la clave con la que recuerda el modo oscuro
por `themeKey`.

## Qué es de aquí y qué no

- **Del kit:** lo reutilizable. Un componente de aquí no hace `fetch`, no
  conoce ningún endpoint y no nombra ningún dominio: si necesita datos, los
  recibe por props.
- **De cada aplicación:** sus pantallas, sus reglas y sus estilos propios, en su
  propia hoja CSS, que se carga después de `tokens.css` y puede ajustar
  componentes del kit dentro de su contexto. Al revés nunca: el kit no sabe de
  la aplicación.

**Idioma:** la API pública —nombres, props y valores— está en inglés, porque es
el vocabulario del sistema de diseño y se comparte entre proyectos. Los
comentarios y las variables internas están en español, como el resto del
código del hospital.

**Nada de valores arbitrarios:** un color, un radio, una sombra o un tamaño de
fuente se escriben con su token. Los únicos literales de color viven en
`tokens.css` y en `preset.js`, y solo en la definición del token.

## Desarrollo

```bash
npm install
npm run build        # compila src/ a dist/ con esbuild
npm run humo         # monta cada componente del compilado y falla si alguno revienta
npm run verificar    # las dos cosas
```

`dist/` se versiona a propósito: así una instalación por URL de Git funciona sin
que el consumidor compile nada.

### Publicar una versión

1. Cambia lo que tengas que cambiar en `src/` o en `tokens.css`.
2. Anota el cambio en `CHANGELOG.md`.
3. `npm run verificar`.
4. Sube la versión en `package.json` y crea el tag: `git tag v1.1.0`.
5. `git push && git push --tags`.

La versión es semántica: quitar o renombrar una prop es un cambio mayor, porque
rompe a quien ya la usa.

## Consumidores

| Sistema | Estado |
|---|---|
| Vigilancia Oncológica (HRL) | origen del kit; pendiente de pasar a consumirlo como paquete |
| Reporte Estadístico (HRL) | se reconstruye sobre esta v1.0 |
