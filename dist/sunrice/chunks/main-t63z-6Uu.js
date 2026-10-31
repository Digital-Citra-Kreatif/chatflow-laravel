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
    "ChatFlow/Forms/Index": () => (__sunricePreload(["./urls-BB4MaRFd.js","./formIO-DneCsNb-.js","./useConfirm-BbCeRslr.js","./format-CfVrQZbp.js","./rotate-ccw-DUMRnzt7.js","./search-BSKIvx55.js","./trash--O34YeeQ.js"]), import("./Index-CzlW1EE-.js")),
    "ChatFlow/Forms/Create": () => (__sunricePreload(["./urls-BB4MaRFd.js","./formIO-DneCsNb-.js","./model-BTuNCoDr.js"]), import("./Create-BHTZ-59Q.js")),
    "ChatFlow/Builder": () => (__sunricePreload(["./urls-BB4MaRFd.js","./model-BTuNCoDr.js","./trash--O34YeeQ.js","./rotate-ccw-DUMRnzt7.js","./value-BDnwcnnV.js","./download-BomVY03l.js","./useConfirm-BbCeRslr.js"]), import("./Index-BMvgTUQR.js")),
    "ChatFlow/Submissions/Index": () => (__sunricePreload(["./urls-BB4MaRFd.js","./model-DfLCnZf1.js","./download-BomVY03l.js","./useConfirm-BbCeRslr.js","./format-CfVrQZbp.js","./search-BSKIvx55.js"]), import("./Index-0TMaTXkz.js")),
    "ChatFlow/Submissions/Show": () => (__sunricePreload(["./urls-BB4MaRFd.js","./value-BDnwcnnV.js","./model-DfLCnZf1.js","./useConfirm-BbCeRslr.js","./format-CfVrQZbp.js","./trash--O34YeeQ.js"]), import("./Show-yd2E3eyc.js"))
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
