function anchoVisible() {
  const html = document.documentElement.getBoundingClientRect().width;
  return Math.min(window.innerWidth, html || window.innerWidth);
}
export {
  anchoVisible
};
//# sourceMappingURL=viewport.js.map
