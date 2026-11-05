import { _ as m } from "./urls-D9s6uq7k.js";
function f(t) {
  if (!t) return null;
  const e = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(t) ? t : `${t.replace(" ", "T")}Z`);
  return Number.isNaN(e.getTime()) ? null : e;
}
function d(t) {
  const e = f(t);
  return e ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(e) : "—";
}
function y(t, e = /* @__PURE__ */ new Date()) {
  const r = f(t);
  if (!r) return "";
  const o = Math.round((r.getTime() - e.getTime()) / 1e3), s = [["year", 31536e3], ["month", 2592e3], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]], i = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
  for (const [c, a] of s)
    if (Math.abs(o) >= a) return i.format(Math.round(o / a), c);
  return i.format(0, "minute");
}
function h(t) {
  return `${new Intl.NumberFormat(void 0, { maximumFractionDigits: 1 }).format(t)}%`;
}
function b(t) {
  return t?.options?.length ? Object.fromEntries(t.options.map((e) => [e.value, e.label])) : void 0;
}
function l(t, e, r) {
  return t === !0 ? m("Yes") : t === !1 ? m("No") : e(r ? n(t, r) : t);
}
function n(t, e) {
  if (typeof t == "string") return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : t;
  if (Array.isArray(t)) return t.map((r) => n(r, e));
  if (t && typeof t == "object") {
    const r = t;
    if (typeof r.value == "string" && typeof r.other == "string") return `${n(r.value, e)}: ${r.other}`;
  }
  return t;
}
export {
  d as a,
  l as b,
  h as f,
  b as o,
  y as r
};
