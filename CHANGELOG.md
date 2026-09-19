# Registro de cambios

Formato: qué cambió y por qué. Las versiones siguen el criterio semántico —
quitar o renombrar una prop es un cambio mayor, porque rompe a quien ya la usa.

## 1.2.0 — 19/09/2026

La tipografía y las formas pasan a ser tan configurables como los colores.
Hasta ahora `--font-sans`, `--text-*` y `--radius-*` existían como tokens pero
casi ningún componente los usaba: el CSS tenía 53 radios y 85 tamaños de
fuente escritos como literal, así que cambiar un token no cambiaba nada.

- Toda `font-family` de `tokens.css` usa `var(--font-sans)` / `var(--font-mono)`
  (5 lugares que llevaban el nombre de la fuente escrito). Cambiar la fuente
  del sistema es ahora cambiar un token.
- 25 `border-radius` y 50 `font-size` que coincidían **exactamente** con un
  valor de la escala pasan a `var(--radius-*)` / `var(--text-*)`. Cada uno
  lleva el valor original como respaldo (`var(--radius, 12px)`), de modo que
  fuera de `.hrl-nuevo` / `.hrl-portal` —donde los tokens no existen— se ve
  igual que antes. Con los tokens por defecto el resultado es idéntico:
  se compararon las 72 historias del catálogo antes y después, y las
  diferencias que quedaron se explican por animaciones, datos aleatorios y
  la carga tardía de la fuente de Google, no por el CSS.
- Token nuevo `--radius-card` (16 px): es el radio de `Card`/`StatCard`, que
  no coincidía con ningún escalón de la escala.
- Sin cambios de API ni de aspecto por defecto. **Pendiente**: quedan
  literales que no coinciden con la escala (p. ej. `9px`, `13px`, `50%` de los
  círculos) y no se tocaron; llevarlos a la escala cambiaría el aspecto y es
  una decisión de diseño aparte.

Además, el repositorio suma un **catálogo visual** (Ladle): `npm run
ladle:serve`. Ver README.

## 1.1.2 — 18/09/2026

Solo declara `allowScripts` para `esbuild` en `package.json`, necesario para
instalar el kit por Git con npm reciente.

## 1.1.1 — 18/09/2026

Corrige los hallazgos que reportó `npm run contrast` en 1.1.0. Cada color se
oscureció lo mínimo posible en HSL (mismo matiz y saturación, solo baja la
luminosidad) para no cambiar la identidad de marca más de lo necesario.

- `--brand` (y con él `--primary`/`--success`/`--ring`) baja de `#00a76f` a
  `#008659` **en tema claro únicamente**: el texto blanco de un botón
  `primary` pasa de 3.11:1 a 4.62:1. El tema oscuro **conserva el verde
  original** — el mismo valor no puede servir a la vez al texto blanco del
  claro y al texto casi negro que ya usaba el oscuro (la ventana donde ambos
  llegan a 4.5:1 es de un punto de luminosidad, prácticamente inexistente);
  forzarlo habría bajado el oscuro de 5.35:1 a 3.65:1. Es la primera vez que
  `--brand` distingue tema, y queda documentado en tokens.json por qué.
- `--danger` baja de `#ff5630` a `#e52a00`: el texto blanco del botón
  `destructive` pasa de 3.17:1 a 4.52:1, en los dos temas (no está
  redefinido en oscuro).
- `--action-blue` baja de `#1877f2` a `#0e71f1`: el texto blanco del botón
  `accent` pasa de 4.23:1 a 4.52:1, en los dos temas.
- `--text-disabled` (de donde cuelga `--subtle-foreground`) baja de
  `#919eab` a `#8493a1` **en tema claro**, pero solo hasta 3:1, no 4.5:1: es
  el umbral que le corresponde porque su uso real es sobre todo iconografía
  (`EmptyState`, `StatCard`, `Steps`, iconos de `Input`) más un caso de
  estado deshabilitado, exento por la propia norma. Llevarlo a 4.5:1 lo
  dejaba a un paso de `--muted-foreground` (`#657585` contra `#637381`),
  perdiendo la diferencia entre "secundario" y "terciario" que existe a
  propósito. El texto oscuro no se tocó (ya daba 4.46:1, por encima de 3:1).
  El único uso real de texto que tenía —el metadato de una notificación en
  `AppShell`— se movió a `--muted-foreground`, que sí llega a 4.5:1.

Quedan, a propósito, tres combinaciones con `subtle-foreground` entre 3:1 y
4.5:1: es el trato correcto para un token pensado para iconos, no para texto
de lectura.

## 1.1.0 — 18/09/2026

`tokens.json` pasa a ser la única fuente de los tokens. `tokens.css` y
`src/preset.js` se generan desde ahí (`npm run tokens`) y dejan de editarse a
mano — que es exactamente cómo, sin que nadie lo notara, las dos copias del
kit habían llegado a diferir 658 líneas en esta hoja.

Consecuencia directa, no cosmética: `preset.color` tenía una selección hecha a
mano que se había desalineado de `tokens.css` — `row-hover`, `head-bg`,
`head-solido`, `fila-solida`, `toast-bg`, `brand-texto`, `text-primary`,
`text-secondary`, `text-disabled` y otros existían como variable CSS pero
`literalColor()` no podía devolverlos. Ahora `preset.color` cubre los 70
tokens de color declarados, en los dos temas. Aditivo: nada de lo que ya
existía cambió de valor ni de nombre.

Se agrega `preset.transition` (`fast`/`base`/`slow`, duración + curva ya
compuestas), resuelto desde los mismos tokens que `duration` y `ease`.

**Nuevo:** `npm run contrast` — verifica WCAG 2.1 AA (4.5:1 texto normal, 3:1
texto grande) de cada combinación texto/fondo real del sistema, en claro y en
oscuro. No bloquea el build. Primer resultado sobre esta paleta: dos
combinaciones no llegan ni al mínimo de texto grande (`subtle-foreground`
sobre fondo, ambas superficies, tema claro) y el texto blanco de los botones
`primary`, `destructive` y `accent` da entre 3.11:1 y 4.23:1 — por debajo de
4.5:1, el umbral que le corresponde a un texto de 13.5 px. Quedan reportadas,
no corregidas: cambiar un color de marca es una decisión de diseño.

## 1.0.0 — 17/09/2026

Primera versión extraíble. El kit venía funcionando dentro del Sistema de
Vigilancia Oncológica; esto es esa base, ya sin nada de ese hospital dentro.

**Componentes.** Primitivos (`Button`, `Input`, `CompactSelect`, `Checkbox`,
`NumberCell`, `Badge`, `Card`, `StatCard`, `Alert`, `Dialog`, `DetailDialog`,
`Tooltip`, `Tabs`, `Toast`, `DropdownMenu`, `Steps`, `SelectionStrip`,
`Skeleton`, `Spinner`, `EmptyState`), datos (`DataTable` con grupos de
columnas, `PaginatedTable`, `Pagination`, `Timeline`), gráficos en SVG y CSS
sin librería (`GaugeArc`, `Sparkline`, `StackedBars`, `SeriesBars`, `Funnel`,
`Ranking`, `SplitBar`, `Calendar`) y layout (`AppShell`, `PageHeader`,
`PageActions`, `FilterBar`).

**Lo que trae de serie, y no es casual:**

- Un dato ausente no se dibuja como cero. `SeriesBars` deja un hueco rotulado
  donde no hubo dato, y `NumberCell` distingue `null` de `0`.
- El color nunca es la única señal: cada estado lleva además icono o texto.
- Objetivo táctil de 40 px en todo control, y `aria-label` obligatorio en los
  que no tienen texto visible.
- Todo lo que flota (diálogos, menús, tooltips) se monta con portal, cierra con
  `Esc` y con clic exterior, y anima su salida antes de desmontarse.
- Modo oscuro por redefinición de tokens, nunca por reglas nuevas.

**API en inglés.** Nombres, props y valores. Los comentarios siguen en español.

**Sin dependencias.** Solo React como `peerDependency`. `esbuild` es
dependencia de desarrollo y no llega al consumidor.
