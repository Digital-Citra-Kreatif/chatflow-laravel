function t() {
  const n = globalThis.Sunrice;
  if (!n)
    throw new Error("[sunrice] This script runs outside the Sunrice admin panel (window.Sunrice is missing).");
  return n;
}
function s(n) {
  const e = t();
  if (e.version !== 3)
    throw new Error(`[sunrice] This plugin was built for admin runtime 3, but the panel runs ${e.version}. Rebuild it with a matching @imajiner/admin-sdk.`);
  for (const [i, r] of Object.entries(n.pages ?? {}))
    e.registerPage(i, r);
  for (const [i, r] of Object.entries(n.lazyPages ?? {}))
    e.registerPageLoader(i, r);
}
function o(n, e = {}) {
  return t().t(n, e);
}
s({
  lazyPages: {
    "ChatFlow/Forms/Index": () => import("./Index-BiajFK1O.js")
  }
});
export {
  o as t
};
