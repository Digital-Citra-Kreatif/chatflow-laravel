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
    "ChatFlow/Forms/Index": () => (__sunricePreload(["./urls-B0_osvz3.js","./formIO-CJ65JQIB.js","./useConfirm-DmdBg5Y3.js","./format-CJT6lmVo.js","./plus-DO9FeptJ.js","./search-BXFaXqsK.js","./trash-Chbq1SlF.js"]), import("./Index-Ct5poxBq.js")),
    "ChatFlow/Forms/Create": () => (__sunricePreload(["./urls-B0_osvz3.js","./formIO-CJ65JQIB.js","./model-AyjPKtEP.js"]), import("./Create-D1UkhFMb.js")),
    "ChatFlow/Builder": () => (__sunricePreload(["./urls-B0_osvz3.js","./model-AyjPKtEP.js","./trash-Chbq1SlF.js","./plus-DO9FeptJ.js","./useConfirm-DmdBg5Y3.js","./copy-DX_h8M81.js"]), import("./Index-BivCrNno.js")),
    "ChatFlow/Submissions/Index": () => (__sunricePreload(["./urls-B0_osvz3.js","./model-COPtwvtm.js","./useConfirm-DmdBg5Y3.js","./format-CJT6lmVo.js","./search-BXFaXqsK.js"]), import("./Index-BJZm12gy.js")),
    "ChatFlow/Submissions/Show": () => (__sunricePreload(["./urls-B0_osvz3.js","./model-COPtwvtm.js","./useConfirm-DmdBg5Y3.js","./format-CJT6lmVo.js","./copy-DX_h8M81.js","./trash-Chbq1SlF.js"]), import("./Show-JODBzGK5.js"))
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
