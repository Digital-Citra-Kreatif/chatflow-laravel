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
    "ChatFlow/Forms/Index": () => (__sunricePreload(["./urls-Dom6XwDc.js","./formIO-CrUzoQFs.js","./useConfirm-BVku3I2-.js","./format-CipxFaFj.js","./rotate-ccw-Drt0_JEn.js","./search-zcxpx0n7.js","./trash-ojNgJdYC.js"]), import("./Index-DGI903y1.js")),
    "ChatFlow/Forms/Create": () => (__sunricePreload(["./urls-Dom6XwDc.js","./formIO-CrUzoQFs.js","./model-B5XKSk9d.js"]), import("./Create-oy4-QSrc.js")),
    "ChatFlow/Builder": () => (__sunricePreload(["./urls-Dom6XwDc.js","./model-B5XKSk9d.js","./trash-ojNgJdYC.js","./rotate-ccw-Drt0_JEn.js","./value-C9KA3Xxk.js","./download-BTZchB_e.js","./useConfirm-BVku3I2-.js"]), import("./Index-hp2h6U0n.js")),
    "ChatFlow/Submissions/Index": () => (__sunricePreload(["./urls-Dom6XwDc.js","./model-Bp1AQAq9.js","./download-BTZchB_e.js","./useConfirm-BVku3I2-.js","./format-CipxFaFj.js","./search-zcxpx0n7.js"]), import("./Index-CzTHBfA-.js")),
    "ChatFlow/Submissions/Show": () => (__sunricePreload(["./urls-Dom6XwDc.js","./value-C9KA3Xxk.js","./model-Bp1AQAq9.js","./useConfirm-BVku3I2-.js","./format-CipxFaFj.js","./trash-ojNgJdYC.js"]), import("./Show-BgX_Bd3w.js"))
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
