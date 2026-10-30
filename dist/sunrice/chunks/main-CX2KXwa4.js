function t() {
  const n = globalThis.Sunrice;
  if (!n)
    throw new Error("[sunrice] This script runs outside the Sunrice admin panel (window.Sunrice is missing).");
  return n;
}
function o(n) {
  const i = t();
  if (i.version !== 3)
    throw new Error(`[sunrice] This plugin was built for admin runtime 3, but the panel runs ${i.version}. Rebuild it with a matching @imajiner/admin-sdk.`);
  for (const [r, e] of Object.entries(n.pages ?? {}))
    i.registerPage(r, e);
  for (const [r, e] of Object.entries(n.lazyPages ?? {}))
    i.registerPageLoader(r, e);
}
function s(n, i = {}) {
  return t().t(n, i);
}
function a(n = "") {
  return t().adminUrl(n);
}
o({
  lazyPages: {
    "ChatFlow/Forms/Index": () => (__sunricePreload(["./urls-CCkQR_q7.js","./api-DaaYNAHm.js","./formIO-BfHyQQ2E.js","./format-CVuBg-UU.js","./search-CpAptKrl.js","./trash-CzeylCxw.js"]), import("./Index-g8O7-TUC.js")),
    "ChatFlow/Forms/Create": () => (__sunricePreload(["./urls-CCkQR_q7.js","./api-DaaYNAHm.js","./formIO-BfHyQQ2E.js"]), import("./Create-CmCN_0r1.js")),
    "ChatFlow/Builder": () => (__sunricePreload(["./urls-CCkQR_q7.js"]), import("./Index-D_Qxo4HB.js")),
    "ChatFlow/Submissions/Index": () => (__sunricePreload(["./urls-CCkQR_q7.js","./api-DaaYNAHm.js","./model-BR-L-RPD.js","./format-CVuBg-UU.js","./search-CpAptKrl.js"]), import("./Index-DPGV20dS.js")),
    "ChatFlow/Submissions/Show": () => (__sunricePreload(["./urls-CCkQR_q7.js","./api-DaaYNAHm.js","./model-BR-L-RPD.js","./format-CVuBg-UU.js","./trash-CzeylCxw.js"]), import("./Show-B-SX62rx.js"))
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
