# Registro de cambios

Formato: qué cambió y por qué. Las versiones siguen el criterio semántico —
quitar o renombrar una prop es un cambio mayor, porque rompe a quien ya la usa.

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
