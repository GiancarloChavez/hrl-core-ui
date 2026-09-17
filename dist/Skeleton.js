import { Fragment, jsx } from "react/jsx-runtime";
function Skeleton({ width = "100%", height = 14, radius = "var(--radius-xs)", style }) {
  return /* @__PURE__ */ jsx("span", { className: "hrl-skeleton", style: { width, height, borderRadius: radius, ...style } });
}
function SkeletonRows({ rows = 5, columns = 4 }) {
  return /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: rows }, (_, f) => /* @__PURE__ */ jsx("tr", { className: "hrl-skeleton-fila", children: Array.from({ length: columns }, (_2, c) => /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Skeleton, { width: c === 0 ? "65%" : `${40 + (f + c) % 4 * 12}%` }) }, c)) }, f)) });
}
export {
  Skeleton,
  SkeletonRows
};
//# sourceMappingURL=Skeleton.js.map
