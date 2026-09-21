# @hrl/core-ui

Sistema de diseño del Hospital Regional de Loreto: componentes React y tokens
CSS. **Sin dependencias**: lo único que necesita el proyecto que lo use es
React 19.

Nació dentro del Sistema de Vigilancia Oncológica y se extrajo cuando un
segundo sistema lo necesitó. La lista completa de lo que ofrece está en
[`UI_CATALOG.md`](UI_CATALOG.md).

---

## Instalación

No está publicado en npm. Se instala por URL de Git, **fijando la versión con el
tag**:

```bash
npm i "git+https://github.com/GiancarloChavez/hrl-core-ui.git#v1.4.1"
```

npm deja `git+ssh://git@github.com/…` en el lockfile para cualquier repositorio de
GitHub, escribas la dependencia como la escribas (`github:`, `git+https://`…). Es
normal y no hace falta pelear con ello: no obliga a tener una llave SSH. Lo que
cada máquina necesita es **una credencial de lectura del repositorio**, por SSH o
por https. Comprobado: con SSH desactivado y credenciales https guardadas,
`npm ci` instala igual; sin ninguna credencial falla con
`Could not read from remote repository` sobre `ssh://git@github.com/…`.

El repositorio es **privado**: quien lo instale necesita acceso de lectura,
concedido por el dueño (`GiancarloChavez`) o al invitarlo como colaborador.

- **En tu máquina**, con una llave SSH registrada en GitHub o con Git Credential
  Manager (que guarda el acceso tras el primer `git clone` o `git push` por https).
- **En un CI o servidor**, sin usuario interactivo: un token de solo lectura del
  repositorio y, antes de `npm ci`, decirle a git que lo use tanto para las
  direcciones https como para la SSH que trae el lockfile:

  ```bash
  git config --global url."https://x-access-token:$TOKEN@github.com/".insteadOf "https://github.com/"
  git config --global --add url."https://x-access-token:$TOKEN@github.com/".insteadOf "ssh://git@github.com/"
  ```

  El `--add` de la segunda línea es necesario: sin él sustituiría a la primera. La
  reescritura de las dos direcciones está comprobada con git; lo que no se ha
  probado es que GitHub acepte un token real desde un CI.

- **`EALLOWSCRIPTS` al instalar**: npm prepara las dependencias de Git en una
  instalación anidada, y una línea `allow-scripts=…` en tu `~/.npmrc` global (no es
  una clave real de npm) la rechaza. Coméntala. El kit ya declara `allowScripts`
  para sus propias herramientas de desarrollo.

Actualizar es cambiar el tag. Sin tag, npm toma la rama por defecto y el kit puede
moverse bajo los pies del proyecto: **fija siempre la versión**. El lockfile
guarda además el commit exacto de ese tag.

## Consumir el kit en un proyecto

1. **Instalar** como arriba, con el tag fijado en `package.json` → `dependencies`.
2. **Cargar los tokens una vez**, en el punto de entrada y *antes* que los estilos
   de la aplicación (que pueden ajustar componentes del kit, nunca al revés):

   ```jsx
   import '@hrl/core-ui/tokens.css';
   import './estilos.css';
   ```

3. **Montar la interfaz.** `AppShell` ya monta el sprite de iconos; una pantalla
   sin él (un login, por ejemplo) monta `<IconSprite />` una vez. Toda la base
   —tipografía, tamaños, sombras— cuelga de `.hrl-nuevo`, el contenedor que
   dibuja `AppShell`: un componente suelto fuera de él no tiene fuente ni
   superficies.
4. **Importar solo del punto de entrada**: `@hrl/core-ui` y
   `@hrl/core-ui/tokens.css`, nunca un archivo interno por ruta.
5. **No hace falta configurar nada más**: el paquete trae el código ya compilado
   (`dist/`), así que Vite no tiene que transformar JSX dentro de `node_modules`,
   y no usa ningún alias.
6. **Escribir el contrato del proyecto** (su `CLAUDE.md` o equivalente): que el
   kit no vive en ese repositorio, que un componente o token nuevo se pide **aquí**
   y no se copia, y las reglas de uso de la aplicación. Las del kit están en
   [`design.md`](design.md), que también viaja dentro del paquete
   (`node_modules/@hrl/core-ui/design.md`).
7. **Comprobar** que el paquete resuelve: la prueba de humo de render de la
   aplicación debe importar `@hrl/core-ui` y montar sus componentes.

Para actualizar: cambia el tag en `package.json`, corre `npm install`, lee el
`CHANGELOG.md` de la versión (lo que cambia de aspecto y lo obsoleto), verifica
con lint, build y prueba de humo, y haz commit. Un nombre obsoleto sigue
funcionando hasta la próxima versión mayor y avisa en consola en desarrollo:
sustitúyelo cuando lo veas.

## Uso

```jsx
// Una vez, en el punto de entrada: los tokens antes que nada.
import '@hrl/core-ui/tokens.css';

// En cualquier parte:
import { AppShell, Card, DataTable, Button } from '@hrl/core-ui';
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

Las reglas para modificar el kit —qué entra aquí y qué se queda en cada
aplicación, tokens, iconos, idioma, versiones— están en [`design.md`](design.md).

```bash
npm install
npm run tokens        # regenera tokens.css y preset.js desde tokens.json
npm run build         # compila src/ a dist/ con esbuild
npm run humo          # monta cada componente del compilado y falla si alguno revienta
npm run contrast      # WCAG AA de los tokens, informativo
npm run literales     # falla si un font-size vuelve a escribirse fuera de la escala
npm run verificar     # tokens + literales + build + humo
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
rama `catalogo`, que contiene solo el sitio ya compilado (sin código fuente) y
se sobrescribe entera en cada publicación: no se edita a mano. Se ejecuta al
crear un tag `v*`, o a demanda desde Actions → «Catálogo» → «Run workflow».

Netlify publica esa rama. Una sola vez, en app.netlify.com: *Add new site* →
*Import an existing project* → GitHub → `hrl-core-ui` → rama `catalogo`. El
`netlify.toml` de la rama ya indica que no hay comando de build y que se
publica la raíz; a partir de ahí cada publicación de la rama redespliega sola.

El sitio publicado es **público** aunque el repositorio sea privado: quien tenga
la URL ve los componentes, los tokens y el código compilado. El código fuente
del repositorio no se publica.

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
| Vigilancia Oncológica (HRL) | origen del kit; lo consume como paquete |
| Reporte Estadístico (HRL) | se reconstruye sobre esta v1.0 |
