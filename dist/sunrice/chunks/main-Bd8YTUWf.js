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
    "ChatFlow/Forms/Index": () => (__sunricePreload(["./urls-CdD8nhpe.js","./formIO-CUx_bobg.js","./useConfirm-E4vHXa4k.js","./format-DiMcGQie.js","./rotate-ccw-DY2CwJuB.js","./search-BK2UJkPQ.js","./trash-oPmPAl7u.js"]), import("./Index-hEZQgVn6.js")),
    "ChatFlow/Forms/Create": () => (__sunricePreload(["./urls-CdD8nhpe.js","./formIO-CUx_bobg.js","./model-B34PEzfW.js"]), import("./Create-6ooZexM3.js")),
    "ChatFlow/Builder": () => (__sunricePreload(["./urls-CdD8nhpe.js","./model-B34PEzfW.js","./trash-oPmPAl7u.js","./rotate-ccw-DY2CwJuB.js","./value-Dfk8sdww.js","./download-CkQUiVgy.js","./useConfirm-E4vHXa4k.js"]), import("./Index-DfOwgtEA.js")),
    "ChatFlow/Submissions/Index": () => (__sunricePreload(["./urls-CdD8nhpe.js","./model-D35m8_lA.js","./download-CkQUiVgy.js","./useConfirm-E4vHXa4k.js","./format-DiMcGQie.js","./search-BK2UJkPQ.js"]), import("./Index-DD7-Q_wX.js")),
    "ChatFlow/Submissions/Show": () => (__sunricePreload(["./urls-CdD8nhpe.js","./value-Dfk8sdww.js","./model-D35m8_lA.js","./useConfirm-E4vHXa4k.js","./format-DiMcGQie.js","./trash-oPmPAl7u.js"]), import("./Show-B8pn-Tu1.js"))
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
