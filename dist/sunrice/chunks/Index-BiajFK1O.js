import { t as u } from "./main-BrnfRXyx.js";
const r = globalThis.Sunrice;
if (!r) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const o = r.modules["react/jsx-runtime"], s = globalThis.Sunrice;
if (!s) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const e = s.modules["@imajiner/admin-sdk/ui"];
function t(n) {
  try {
    return u(n);
  } catch {
    return n;
  }
}
function i(n, c) {
  return t(n);
}
function d() {
  return e.useBreadcrumbs([{ label: i("Forms") }]), /* @__PURE__ */ o.jsx(e.PageHeader, { title: i("Forms") });
}
export {
  d as default
};
