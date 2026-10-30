import { _ as x } from "./urls-CCkQR_q7.js";
const C = globalThis.Sunrice;
if (!C) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const l = C.modules.react;
const W = (t) => t?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
function v(t, e, o = []) {
  if (e == null)
    throw new Error("[lucide]: iconNode is required when icon name is used");
  return {
    name: W(t),
    size: 24,
    node: e,
    ...o.length > 0 ? { aliases: o } : {}
  };
}
const T = (t) => {
  let e = "", o = !1;
  for (const s of t) {
    if (s === "-" || s === "_" || s <= " ") {
      o = e.length > 0;
      continue;
    }
    e.length === 0 ? e += s.toLowerCase() : e += o ? s.toUpperCase() : s, o = !1;
  }
  return e;
};
const $ = (t) => {
  const e = T(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
const S = (...t) => t.filter((e, o, s) => !!e && e.trim() !== "" && s.indexOf(e) === o).join(" ").trim();
const h = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function k(t) {
  return t != null;
}
function j(t, e = {}) {
  const o = e.attributeNames ?? {}, s = (r) => o[r] ?? r, n = t.size ?? t.width ?? h.width, i = t.size ?? t.height ?? h.height, c = t.aliases?.filter((r) => typeof r == "string" && r.trim() !== "").map((r) => `lucide-${r}`) ?? [], a = [...t.name ? [`lucide-${t.name}`] : [], ...c], u = e.className?.split(" ").filter(Boolean) ?? [], w = e.includeDefaultClasses === !1 ? S(...u) : S("lucide", ...a, ...u), b = e.absoluteStrokeWidth ? Number(e.strokeWidth ?? h["stroke-width"]) * Number(t.size ?? t.width ?? h.width) / Number(e.size ?? e.width ?? h.width) : e.strokeWidth ?? h["stroke-width"];
  return [
    "svg",
    {
      ...Object.entries(h).reduce((r, [d, f]) => (r[s(d)] = f, r), {}),
      ..."color" in e && e.color && {
        [s("stroke")]: e.color
      },
      ..."size" in e && k(e.size) && {
        [s("width")]: e.size,
        [s("height")]: e.size
      },
      ..."width" in e && k(e.width) && {
        [s("width")]: e.width
      },
      ..."height" in e && k(e.height) && {
        [s("height")]: e.height
      },
      [s("stroke-width")]: b,
      ...w && {
        [s("class")]: w
      },
      [s("viewBox")]: `0 0 ${n} ${i}`,
      ...e.hasA11yProp === !1 ? {
        [s("aria-hidden")]: "true"
      } : {},
      ..."attributes" in e && e.attributes
    },
    t.node.map((r) => {
      const [d, f, g] = r, m = e.nonScalingStroke ? { [s("vector-effect")]: "non-scaling-stroke", ...f } : f;
      return g ? [d, m, g] : [d, m];
    })
  ];
}
function I(t, e = {}) {
  return j(t, {
    ...e,
    attributeNames: {
      ...e.attributeNames,
      class: "className",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "vector-effect": "vectorEffect"
    }
  });
}
const B = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
}, F = l.createContext({}), R = () => l.useContext(F), D = l.forwardRef(
  ({
    color: t,
    size: e,
    width: o,
    height: s,
    strokeWidth: n,
    absoluteStrokeWidth: i,
    nonScalingStroke: c,
    className: a = "",
    children: u,
    iconNode: w = [],
    icon: b = {
      node: w,
      aliases: [],
      size: 24
    },
    ...p
  }, r) => {
    const {
      size: d = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: g = !1,
      nonScalingStroke: m = !1,
      color: _ = "currentColor",
      className: A = ""
    } = R() ?? {}, y = !!u || B(p), [N, E, L = []] = I(b, {
      color: t ?? _,
      width: o ?? e ?? d,
      height: s ?? e ?? d,
      strokeWidth: n ?? f,
      absoluteStrokeWidth: i ?? g,
      nonScalingStroke: c ?? m,
      className: S(A, a),
      hasA11yProp: y,
      attributes: p
    });
    return l.createElement(
      N,
      {
        ref: r,
        ...E
      },
      [
        ...L.map(([z, P]) => l.createElement(z, P)),
        ...Array.isArray(u) ? u : [u]
      ]
    );
  }
);
function H(t, e = [], o = []) {
  const s = typeof t == "string" ? v(t, e, o) : t, n = l.forwardRef(
    ({ className: i, ...c }, a) => l.createElement(D, {
      ref: a,
      icon: s,
      className: i,
      ...c
    })
  );
  return s.name && (n.displayName = $(s.name)), n;
}
const U = ["short_text", "long_text", "email", "phone", "number", "rating", "scale", "nps", "slider", "date", "single_choice", "multi_choice", "yes_no", "consent", "hidden", "statement", "summary"], q = [...U, "address", "media", "file_upload", "calculated"], K = /* @__PURE__ */ new Set();
function M(t) {
  for (const e of t) /^[a-z][a-z0-9_]{0,63}$/.test(e) && !q.includes(e) && K.add(e);
}
function J(t, e) {
  return t.capabilities?.[e] === !0;
}
class O extends Error {
  constructor(e, o, s, n = {}) {
    super(o), this.code = e, this.status = s, this.data = n;
  }
}
class Y {
  constructor(e, o = (s, n) => globalThis.fetch(s, n)) {
    this.config = e, this.transport = o, M(e.features?.fieldTypes ?? []);
  }
  /**
   * Build an admin REST URL for both pretty and plain permalinks. With plain
   * permalinks `restUrl` already contains `?rest_route=/cff/v1/`, so appending
   * `?page=1` directly would make the page parameter part of the route.
   */
  urlFor(e) {
    const o = new URL(this.config.restUrl, globalThis.location?.href ?? "https://localhost/"), [s, n = ""] = e.split("?");
    if (o.searchParams.has("rest_route")) {
      const i = (o.searchParams.get("rest_route") ?? "").replace(/\/$/, "");
      o.searchParams.set("rest_route", `${i}/${s}`);
    } else
      o.pathname = `${o.pathname.replace(/\/$/, "")}/${s}`;
    for (const [i, c] of new URLSearchParams(n)) o.searchParams.set(i, c);
    return o.href;
  }
  async request(e, o = "GET", s, n) {
    if (!e.startsWith("admin/") || e.includes("..") || e.includes("://") || /\\|%2e|%2f|%5c/i.test(e.split("?")[0] ?? ""))
      throw new Error("Invalid admin API path");
    const i = await this.transport(this.urlFor(e), {
      method: o,
      credentials: "same-origin",
      cache: "no-store",
      redirect: "error",
      // Laravel: CSRF token instead of the WordPress REST nonce; Accept makes errors come back as JSON.
      headers: { "X-CSRF-TOKEN": this.config.nonce, "Content-Type": "application/json", Accept: "application/json" },
      ...s === void 0 ? {} : { body: JSON.stringify(s) },
      ...n ? { signal: n } : {}
    }), c = await i.json().catch(() => null);
    if (!i.ok) {
      const a = c && typeof c == "object" ? c : {};
      throw new O(
        String(a.code ?? "cff_http_error"),
        String(a.message ?? x("The request failed. Please try again.")),
        i.status,
        a.data ?? {}
      );
    }
    return c;
  }
}
function V(t) {
  return t instanceof Error ? t.message : x("An unexpected error occurred.");
}
function X(t) {
  return l.useMemo(() => new Y(t), [t]);
}
export {
  l as _,
  J as a,
  H as c,
  V as e,
  X as u
};
