import { b as l, j as e, u as n, _ as c } from "./urls-CdD8nhpe.js";
function h() {
  const [r, o] = l.useState(null), i = l.useRef(null), s = l.useCallback((t) => {
    i.current?.(t), i.current = null, o(null);
  }, []), a = l.useCallback((t) => (i.current?.(!1), o(t), new Promise((d) => {
    i.current = d;
  })), []), u = /* @__PURE__ */ e.jsx(n.Dialog, { open: r !== null, onOpenChange: (t) => !t && s(!1), children: /* @__PURE__ */ e.jsxs(n.DialogContent, { children: [
    /* @__PURE__ */ e.jsxs(n.DialogHeader, { children: [
      /* @__PURE__ */ e.jsx(n.DialogTitle, { children: r?.title }),
      r?.description && /* @__PURE__ */ e.jsx(n.DialogDescription, { children: r.description })
    ] }),
    /* @__PURE__ */ e.jsxs(n.DialogFooter, { children: [
      /* @__PURE__ */ e.jsx(n.Button, { variant: "outline", onClick: () => s(!1), children: c("Cancel") }),
      /* @__PURE__ */ e.jsx(n.Button, { variant: r?.destructive ? "destructive" : "default", onClick: () => s(!0), children: r?.confirmLabel ?? c("Confirm") })
    ] })
  ] }) });
  return [a, u];
}
export {
  h as u
};
