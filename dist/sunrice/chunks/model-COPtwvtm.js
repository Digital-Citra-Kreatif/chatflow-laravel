import { c, _ as e } from "./urls-B0_osvz3.js";
const r = {
  name: "star",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
        key: "r04s7s"
      }
    ]
  ]
};
r.node;
const d = c(r), u = ["completed", "partial", "abandoned", "spam", "trash"];
function f(t) {
  return {
    completed: e("Completed"),
    partial: e("Partial"),
    abandoned: e("Abandoned"),
    spam: e("Spam"),
    trash: e("Trash")
  }[t] ?? t;
}
const b = [
  "eq",
  "neq",
  "contains",
  "gt",
  "gte",
  "lt",
  "lte",
  "is_empty",
  "is_not_empty"
];
function s(t) {
  return t == null ? "" : Array.isArray(t) ? t.map(s).join(", ") : typeof t == "object" ? Object.entries(t).map(([a, n]) => `${a}: ${s(n)}`).join(", ") : String(t);
}
function p(t) {
  return Object.fromEntries(
    Object.entries(t).filter(([, a]) => a !== void 0 && a !== "")
  );
}
function y(t, a, n, o, i, l = "csv") {
  return {
    ...t.formId ? { formId: t.formId } : {},
    filters: p(t),
    ...a.length ? { ids: [...a] } : {},
    columns: [...n],
    headerStyle: o,
    delimiter: i,
    format: l
  };
}
function _(t) {
  return `${e("Response")} #${t}`;
}
function h(t) {
  return {
    eq: e("Equals"),
    neq: e("Does not equal"),
    contains: e("Contains"),
    gt: e("Greater than"),
    gte: e("Greater than or equal to"),
    lt: e("Less than"),
    lte: e("Less than or equal to"),
    is_empty: e("Is empty"),
    is_not_empty: e("Is not empty")
  }[t] ?? t;
}
export {
  d as S,
  b as a,
  u as b,
  s as d,
  y as e,
  h as o,
  _ as r,
  f as s
};
