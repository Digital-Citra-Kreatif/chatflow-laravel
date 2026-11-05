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
    "ChatFlow/Forms/Index": () => (__sunricePreload(["./urls-D9s6uq7k.js","./formIO-CT7l1262.js","./useConfirm-CiydtHQ5.js","./format-D8XrOzw5.js","./rotate-ccw-xmFXByWi.js","./search-BG_nwZJs.js","./trash-DAQtAiiX.js"]), import("./Index-oXh06sd5.js")),
    "ChatFlow/Forms/Create": () => (__sunricePreload(["./urls-D9s6uq7k.js","./formIO-CT7l1262.js","./model-0TgKc8mT.js"]), import("./Create-BZ2evEmF.js")),
    "ChatFlow/Builder": () => (__sunricePreload(["./urls-D9s6uq7k.js","./model-0TgKc8mT.js","./trash-DAQtAiiX.js","./rotate-ccw-xmFXByWi.js","./value-BfA2d9_6.js","./download-BsK2augw.js","./useConfirm-CiydtHQ5.js"]), import("./Index-CuGI0m4S.js")),
    "ChatFlow/Submissions/Index": () => (__sunricePreload(["./urls-D9s6uq7k.js","./model-C-MOyDx9.js","./download-BsK2augw.js","./useConfirm-CiydtHQ5.js","./format-D8XrOzw5.js","./search-BG_nwZJs.js"]), import("./Index-B5J7rbXz.js")),
    "ChatFlow/Submissions/Show": () => (__sunricePreload(["./urls-D9s6uq7k.js","./value-BfA2d9_6.js","./model-C-MOyDx9.js","./useConfirm-CiydtHQ5.js","./format-D8XrOzw5.js","./trash-DAQtAiiX.js"]), import("./Show-8fVIn9mw.js"))
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
