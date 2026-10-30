import { t as f, a as i } from "./main-CX2KXwa4.js";
const a = globalThis.Sunrice;
if (!a) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const w = a.modules["react/jsx-runtime"], m = globalThis.Sunrice;
if (!m) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const S = m.modules["@inertiajs/react"], l = globalThis.Sunrice;
if (!l) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const b = l.modules["@imajiner/admin-sdk/ui"];
function h(n) {
  try {
    return f(n);
  } catch {
    return n;
  }
}
function g(n, r) {
  return h(n);
}
function $(n, ...r) {
  let e = 0;
  return n.replace(/%(?:(\d+)\$)?([sd%])/g, (o, t, s) => {
    if (s === "%") return "%";
    const c = r[t ? Number(t) - 1 : e++];
    return String(s === "d" ? Math.trunc(Number(c)) : c ?? "");
  });
}
const p = {
  forms: (n = {}) => u(i("chatflow/forms"), n),
  createForm: () => i("chatflow/forms/create"),
  form: (n) => i(`chatflow/forms/${n}`),
  formAction: (n, r) => i(`chatflow/forms/${n}/${r}`),
  submissions: (n = {}) => u(i("chatflow/submissions"), n),
  submission: (n) => i(`chatflow/submissions/${n}`)
};
function u(n, r) {
  const e = new URLSearchParams();
  for (const [t, s] of Object.entries(r))
    s !== void 0 && s !== "" && e.set(t, String(s));
  const o = e.toString();
  return o ? `${n}?${o}` : n;
}
export {
  g as _,
  p as a,
  w as j,
  S as r,
  $ as s,
  b as u
};
