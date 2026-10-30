import { c as d } from "./urls-CdD8nhpe.js";
const y = {
  name: "copy",
  size: 24,
  node: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
  ]
};
y.node;
const m = d(y), g = (e, r) => Object.prototype.hasOwnProperty.call(e, r), $ = (e, r, a, i) => i === void 0 ? { path: e, code: r, message: a } : { path: e, code: r, message: a, fieldKey: i }, w = (e) => typeof e == "object" && e !== null && !Array.isArray(e) && Object.keys(e).sort().join(",") === "other,value" && typeof e.value == "string" && typeof e.other == "string", p = (e) => typeof e == "number" && Number.isFinite(e);
function x(e) {
  if (typeof e != "string" || e.length > 512 || /[^\x20-\x7e]|[()|]/.test(e)) return null;
  const r = { d: "0-9", w: "A-Za-z0-9_", s: " \\t\\r\\n\\f\\x0b" }, a = (n, t) => r[n] ? t ? r[n] : `[${r[n]}]` : ["D", "W", "S"].includes(n) ? t ? null : `[^${r[n.toLowerCase()]}]` : n === "-" && !t ? "-" : "nrt\\.[]{}^$*+?-/".includes(n) ? `\\${n}` : null;
  let i = "", f = !1, h = 0;
  for (let n = 0; n < e.length; n++) {
    const t = e[n];
    if (t === "\\") {
      const l = e[++n];
      if (l === void 0) return null;
      const s = a(l, !1);
      if (s === null) return null;
      i += s, f = !0;
    } else if (t === "[") {
      let l = "[", s = !1;
      for (n++; n < e.length; n++) {
        const u = e[n];
        if (u === "]") {
          s = !0, l += "]";
          break;
        }
        if (u === "[") return null;
        if (u === "\\") {
          const c = e[++n];
          if (c === void 0) return null;
          const o = a(c, !0);
          if (o === null) return null;
          l += o;
        } else l += u;
      }
      if (!s) return null;
      i += l, f = !0;
    } else if (["*", "+", "?", "{"].includes(t)) {
      if (!f) return null;
      let l = t, s = !0;
      if (t === "{") {
        const u = /^\{(\d+)(?:,(\d*))?\}/.exec(e.slice(n));
        if (!u) return null;
        const c = Number(u[1]), o = u[2] === "" ? 1 / 0 : Number(u[2] ?? u[1]);
        if (c > 1e3 || o !== 1 / 0 && (o > 1e3 || o < c)) return null;
        s = c !== o, l = u[0], n += l.length - 1;
      }
      if (s && ++h > 1 || (t === "*" || t === "+" || l.endsWith(",}")) && !(e.startsWith("^") && e.endsWith("$"))) return null;
      i += l, f = !1;
    } else if (t === "^" || t === "$") {
      if (t === "^" && n !== 0 || t === "$" && n !== e.length - 1) return null;
      i += t === "$" ? "$(?![\\s\\S])" : t, f = !1;
    } else {
      if (t === "]" || t === "}") return null;
      i += t === "." ? "[^\\n\\r\u2028\u2029]" : t, f = !0;
    }
  }
  return i;
}
function j(e) {
  const r = x(e);
  if (r === null) return null;
  try {
    return new RegExp(r, "u");
  } catch {
    return null;
  }
}
export {
  m as C,
  w as a,
  $ as i,
  p as n,
  g as o,
  j as r
};
