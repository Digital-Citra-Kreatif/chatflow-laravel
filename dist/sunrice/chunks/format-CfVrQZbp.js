import { _ as a } from "./urls-BB4MaRFd.js";
function m(t) {
  if (!t) return null;
  const e = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(t) ? t : `${t.replace(" ", "T")}Z`);
  return Number.isNaN(e.getTime()) ? null : e;
}
function c(t) {
  const e = m(t);
  return e ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(e) : "—";
}
function d(t, e = /* @__PURE__ */ new Date()) {
  const r = m(t);
  if (!r) return "";
  const n = Math.round((r.getTime() - e.getTime()) / 1e3), u = [["year", 31536e3], ["month", 2592e3], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]], o = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
  for (const [s, i] of u)
    if (Math.abs(n) >= i) return o.format(Math.round(n / i), s);
  return o.format(0, "minute");
}
function T(t) {
  return `${new Intl.NumberFormat(void 0, { maximumFractionDigits: 1 }).format(t)}%`;
}
function l(t, e) {
  return t === !0 ? a("Yes") : t === !1 ? a("No") : e(t);
}
export {
  c as a,
  l as b,
  T as f,
  d as r
};
