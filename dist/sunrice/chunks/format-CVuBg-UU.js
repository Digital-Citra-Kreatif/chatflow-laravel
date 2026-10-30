import { j as n, u as r, _ as l } from "./urls-CCkQR_q7.js";
import { _ as c } from "./api-DaaYNAHm.js";
function g() {
  const [e, t] = c.useState(null), i = c.useRef(null), s = c.useCallback((o) => {
    i.current?.(o), i.current = null, t(null);
  }, []), m = c.useCallback((o) => (i.current?.(!1), t(o), new Promise((u) => {
    i.current = u;
  })), []), a = /* @__PURE__ */ n.jsx(r.Dialog, { open: e !== null, onOpenChange: (o) => !o && s(!1), children: /* @__PURE__ */ n.jsxs(r.DialogContent, { children: [
    /* @__PURE__ */ n.jsxs(r.DialogHeader, { children: [
      /* @__PURE__ */ n.jsx(r.DialogTitle, { children: e?.title }),
      e?.description && /* @__PURE__ */ n.jsx(r.DialogDescription, { children: e.description })
    ] }),
    /* @__PURE__ */ n.jsxs(r.DialogFooter, { children: [
      /* @__PURE__ */ n.jsx(r.Button, { variant: "outline", onClick: () => s(!1), children: l("Cancel") }),
      /* @__PURE__ */ n.jsx(r.Button, { variant: e?.destructive ? "destructive" : "default", onClick: () => s(!0), children: e?.confirmLabel ?? l("Confirm") })
    ] })
  ] }) });
  return [m, a];
}
function f(e) {
  if (!e) return null;
  const t = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(e) ? e : `${e.replace(" ", "T")}Z`);
  return Number.isNaN(t.getTime()) ? null : t;
}
function p(e) {
  const t = f(e);
  return t ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(t) : "—";
}
function x(e, t = /* @__PURE__ */ new Date()) {
  const i = f(e);
  if (!i) return "";
  const s = Math.round((i.getTime() - t.getTime()) / 1e3), m = [["year", 31536e3], ["month", 2592e3], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]], a = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
  for (const [o, u] of m)
    if (Math.abs(s) >= u) return a.format(Math.round(s / u), o);
  return a.format(0, "minute");
}
function D(e) {
  return `${new Intl.NumberFormat(void 0, { maximumFractionDigits: 1 }).format(e)}%`;
}
function j(e, t) {
  return e === !0 ? l("Yes") : e === !1 ? l("No") : t(e);
}
export {
  p as a,
  j as b,
  D as f,
  x as r,
  g as u
};
