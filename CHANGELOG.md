# Registro de cambios

Formato: qué cambió y por qué. Las versiones siguen el criterio semántico —
quitar o renombrar una prop es un cambio mayor, porque rompe a quien ya la usa.

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
