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
npm i github:GiancarloChavez/hrl-core-ui#v1.0.0
```

> El repositorio es privado: quien lo instale necesita acceso de lectura
> concedido por el dueño (`GiancarloChavez`), o que se lo den al invitarlo como
> colaborador del repo.

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

## Los tokens

`tokens.json` es la única fuente de los valores del sistema —colores, radios,
sombras, tipografía, movimiento—. `tokens.css` y `src/preset.js` se generan
desde ahí; no se editan a mano, empiezan con un aviso de que son generados.
Cambiar un color es cambiar `tokens.json` y correr:

```bash
npm run tokens        # regenera tokens.css y src/preset.js
```

Antes de esto, `tokens.css` y `preset.js` se mantenían a mano en paralelo, y
fue exactamente así como dos copias del kit terminaron con 658 líneas de
diferencia en esta hoja sin que nadie lo notara.

### Contraste

```bash
npm run contrast      # WCAG 2.1 AA de cada combinación texto/fondo, en los dos temas
```

Solo falla (y hace fallar el CI) si una combinación cae por debajo de 3:1, el
umbral mínimo de cualquier texto o componente. Por encima de eso reporta la
razón exacta de contraste de cada combinación
real que produce el sistema (no cada combinación matemáticamente posible) y
contra qué umbral pasa —4.5:1 para texto normal, 3:1 para texto grande o
componentes de interfaz—, para que decidir qué corregir sea una decisión de
diseño, no una sorpresa en producción.

## Desarrollo

```bash
npm install
npm run tokens        # regenera tokens.css y preset.js desde tokens.json
npm run build         # compila src/ a dist/ con esbuild
npm run humo          # monta cada componente del compilado y falla si alguno revienta
npm run contrast      # WCAG AA de los tokens, informativo
npm run verificar     # tokens + build + humo
npm run ladle:serve   # catálogo visual en local
npm run ladle:build   # catálogo como sitio estático en build/
```

### Catálogo visual

Ladle muestra cada componente y los fundamentos (colores, tipografía, formas)
leyendo directamente `tokens.json`, en claro y en oscuro. «Composición /
Personalizar» permite cambiar el color de marca, la fuente y el redondeo en
vivo y calcula el contraste del color elegido. Las historias viven en
`stories/`; los datos de ejemplo son genéricos a propósito, porque el kit no
sabe de ningún sistema concreto.

### Publicar el catálogo

El workflow `.github/workflows/catalogo.yml` compila el catálogo y lo sube a la
rama `gh-pages`, que es solo salida generada (se sobrescribe entera; no se
edita a mano). Se ejecuta al crear un tag `v*`, o a demanda desde la pestaña
Actions → «Catálogo» → «Run workflow».

Una sola vez, en GitHub: Settings → Pages → *Deploy from a branch* →
rama `gh-pages`, carpeta `/ (root)`. El sitio queda en
`https://<usuario>.github.io/hrl-core-ui/`.

- GitHub Pages en un repositorio **privado** requiere un plan de pago (Pro,
  Team o Enterprise). Con el plan gratuito, la opción no está disponible.
- El sitio publicado es **público** aunque el repositorio sea privado: quien
  tenga la URL ve los componentes, los tokens y el código compilado. El código
  fuente del repositorio no se publica.

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
| Vigilancia Oncológica (HRL) | origen del kit; ya lo consume como paquete (v1.1.2) |
| Reporte Estadístico (HRL) | se reconstruye sobre esta v1.0 |
