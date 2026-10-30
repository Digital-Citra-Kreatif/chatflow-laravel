function t() {
  const n = globalThis.Sunrice;
  if (!n)
    throw new Error("[sunrice] This script runs outside the Sunrice admin panel (window.Sunrice is missing).");
  return n;
}
function o(n) {
  const r = t();
  if (r.version !== 3)
    throw new Error(`[sunrice] This plugin was built for admin runtime 3, but the panel runs ${r.version}. Rebuild it with a matching @imajiner/admin-sdk.`);
  for (const [e, i] of Object.entries(n.pages ?? {}))
    r.registerPage(e, i);
  for (const [e, i] of Object.entries(n.lazyPages ?? {}))
    r.registerPageLoader(e, i);
}
function s(n, r = {}) {
  return t().t(n, r);
}
function a(n = "") {
  return t().adminUrl(n);
}
o({
  lazyPages: {
    "ChatFlow/Forms/Index": () => (__sunricePreload(["./urls-2n-KvCIk.js","./api-DZKLC0QC.js"]), import("./Index-CcA8MEs6.js")),
    "ChatFlow/Forms/Create": () => (__sunricePreload(["./urls-2n-KvCIk.js","./api-DZKLC0QC.js"]), import("./Create-v0xBHuxj.js")),
    "ChatFlow/Builder": () => (__sunricePreload(["./urls-2n-KvCIk.js"]), import("./Index-Bt1RbhW0.js"))
  }
});
export {
  a,
  s as t
};

function __sunricePreload(files) {
    if (typeof document === 'undefined') return;
    for (const file of files) {
        const href = new URL(file, import.meta.url).href;
        if (document.querySelector('link[rel="modulepreload"][href="' + CSS.escape(href) + '"]')) continue;
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = href;
        document.head.appendChild(link);
    }
}
