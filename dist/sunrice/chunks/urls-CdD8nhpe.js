import { t as B, a as m } from "./main-Bd8YTUWf.js";
const A = globalThis.Sunrice;
if (!A) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const te = A.modules["react/jsx-runtime"], y = globalThis.Sunrice;
if (!y) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const u = y.modules.react, _ = globalThis.Sunrice;
if (!_) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const se = _.modules["@inertiajs/react"], $ = globalThis.Sunrice;
if (!$) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const ne = $.modules["@imajiner/admin-sdk/ui"];
const R = (t) => t?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
function U(t, e, n = []) {
  if (e == null)
    throw new Error("[lucide]: iconNode is required when icon name is used");
  return {
    name: R(t),
    size: 24,
    node: e,
    ...n.length > 0 ? { aliases: n } : {}
  };
}
const D = (t) => {
  let e = "", n = !1;
  for (const s of t) {
    if (s === "-" || s === "_" || s <= " ") {
      n = e.length > 0;
      continue;
    }
    e.length === 0 ? e += s.toLowerCase() : e += n ? s.toUpperCase() : s, n = !1;
  }
  return e;
};
const q = (t) => {
  const e = D(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
const x = (...t) => t.filter((e, n, s) => !!e && e.trim() !== "" && s.indexOf(e) === n).join(" ").trim();
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
function K(t, e = {}) {
  const n = e.attributeNames ?? {}, s = (c) => n[c] ?? c, o = t.size ?? t.width ?? h.width, r = t.size ?? t.height ?? h.height, i = t.aliases?.filter((c) => typeof c == "string" && c.trim() !== "").map((c) => `lucide-${c}`) ?? [], a = [...t.name ? [`lucide-${t.name}`] : [], ...i], l = e.className?.split(" ").filter(Boolean) ?? [], w = e.includeDefaultClasses === !1 ? x(...l) : x("lucide", ...a, ...l), S = e.absoluteStrokeWidth ? Number(e.strokeWidth ?? h["stroke-width"]) * Number(t.size ?? t.width ?? h.width) / Number(e.size ?? e.width ?? h.width) : e.strokeWidth ?? h["stroke-width"];
  return [
    "svg",
    {
      ...Object.entries(h).reduce((c, [d, f]) => (c[s(d)] = f, c), {}),
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
      [s("stroke-width")]: S,
      ...w && {
        [s("class")]: w
      },
      [s("viewBox")]: `0 0 ${o} ${r}`,
      ...e.hasA11yProp === !1 ? {
        [s("aria-hidden")]: "true"
      } : {},
      ..."attributes" in e && e.attributes
    },
    t.node.map((c) => {
      const [d, f, g] = c, b = e.nonScalingStroke ? { [s("vector-effect")]: "non-scaling-stroke", ...f } : f;
      return g ? [d, b, g] : [d, b];
    })
  ];
}
function M(t, e = {}) {
  return K(t, {
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
const O = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
}, Y = u.createContext({}), G = () => u.useContext(Y), H = u.forwardRef(
  ({
    color: t,
    size: e,
    width: n,
    height: s,
    strokeWidth: o,
    absoluteStrokeWidth: r,
    nonScalingStroke: i,
    className: a = "",
    children: l,
    iconNode: w = [],
    icon: S = {
      node: w,
      aliases: [],
      size: 24
    },
    ...p
  }, c) => {
    const {
      size: d = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: g = !1,
      nonScalingStroke: b = !1,
      color: j = "currentColor",
      className: v = ""
    } = G() ?? {}, L = !!l || O(p), [P, z, W = []] = M(S, {
      color: t ?? j,
      width: n ?? e ?? d,
      height: s ?? e ?? d,
      strokeWidth: o ?? f,
      absoluteStrokeWidth: r ?? g,
      nonScalingStroke: i ?? b,
      className: x(v, a),
      hasA11yProp: L,
      attributes: p
    });
    return u.createElement(
      P,
      {
        ref: c,
        ...z
      },
      [
        ...W.map(([F, I]) => u.createElement(F, I)),
        ...Array.isArray(l) ? l : [l]
      ]
    );
  }
);
function oe(t, e = [], n = []) {
  const s = typeof t == "string" ? U(t, e, n) : t, o = u.forwardRef(
    ({ className: r, ...i }, a) => u.createElement(H, {
      ref: a,
      icon: s,
      className: r,
      ...i
    })
  );
  return s.name && (o.displayName = q(s.name)), o;
}
function J(t) {
  try {
    return B(t);
  } catch {
    return t;
  }
}
function N(t, e) {
  return J(t);
}
function re(t, ...e) {
  let n = 0;
  return t.replace(/%(?:(\d+)\$)?([sd%])/g, (s, o, r) => {
    if (r === "%") return "%";
    const i = e[o ? Number(o) - 1 : n++];
    return String(r === "d" ? Math.trunc(Number(i)) : i ?? "");
  });
}
const Q = ["short_text", "long_text", "email", "phone", "number", "rating", "scale", "nps", "slider", "date", "single_choice", "multi_choice", "yes_no", "consent", "hidden", "statement", "summary"], E = [...Q, "address", "media", "file_upload", "calculated"], T = /* @__PURE__ */ new Set();
function V(t) {
  for (const e of t) /^[a-z][a-z0-9_]{0,63}$/.test(e) && !E.includes(e) && T.add(e);
}
const ie = (t) => E.includes(t) || T.has(t);
function ce(t, e) {
  return t.capabilities?.[e] === !0;
}
class X extends Error {
  constructor(e, n, s, o = {}) {
    super(n), this.code = e, this.status = s, this.data = o;
  }
}
class Z {
  constructor(e, n = (s, o) => globalThis.fetch(s, o)) {
    this.config = e, this.transport = n, V(e.features?.fieldTypes ?? []);
  }
  /**
   * Build an admin REST URL for both pretty and plain permalinks. With plain
   * permalinks `restUrl` already contains `?rest_route=/cff/v1/`, so appending
   * `?page=1` directly would make the page parameter part of the route.
   */
  urlFor(e) {
    const n = new URL(this.config.restUrl, globalThis.location?.href ?? "https://localhost/"), [s, o = ""] = e.split("?");
    if (n.searchParams.has("rest_route")) {
      const r = (n.searchParams.get("rest_route") ?? "").replace(/\/$/, "");
      n.searchParams.set("rest_route", `${r}/${s}`);
    } else
      n.pathname = `${n.pathname.replace(/\/$/, "")}/${s}`;
    for (const [r, i] of new URLSearchParams(o)) n.searchParams.set(r, i);
    return n.href;
  }
  async request(e, n = "GET", s, o) {
    if (!e.startsWith("admin/") || e.includes("..") || e.includes("://") || /\\|%2e|%2f|%5c/i.test(e.split("?")[0] ?? ""))
      throw new Error("Invalid admin API path");
    const r = await this.transport(this.urlFor(e), {
      method: n,
      credentials: "same-origin",
      cache: "no-store",
      redirect: "error",
      // Laravel: CSRF token instead of the WordPress REST nonce; Accept makes errors come back as JSON.
      headers: { "X-CSRF-TOKEN": this.config.nonce, "Content-Type": "application/json", Accept: "application/json" },
      ...s === void 0 ? {} : { body: JSON.stringify(s) },
      ...o ? { signal: o } : {}
    }), i = await r.json().catch(() => null);
    if (!r.ok) {
      const a = i && typeof i == "object" ? i : {};
      throw new X(
        String(a.code ?? "cff_http_error"),
        String(a.message ?? N("The request failed. Please try again.")),
        r.status,
        a.data ?? {}
      );
    }
    return i;
  }
}
function ae(t) {
  return t instanceof Error ? t.message : N("An unexpected error occurred.");
}
function ue(t) {
  return u.useMemo(() => new Z(t), [t]);
}
const le = {
  forms: (t = {}) => C(m("chatflow/forms"), t),
  createForm: () => m("chatflow/forms/create"),
  form: (t) => m(`chatflow/forms/${t}`),
  formAction: (t, e) => m(`chatflow/forms/${t}/${e}`),
  submissions: (t = {}) => C(m("chatflow/submissions"), t),
  submission: (t) => m(`chatflow/submissions/${t}`)
};
function C(t, e) {
  const n = new URLSearchParams();
  for (const [o, r] of Object.entries(e))
    r !== void 0 && r !== "" && n.set(o, String(r));
  const s = n.toString();
  return s ? `${t}?${s}` : t;
}
export {
  X as A,
  N as _,
  ue as a,
  u as b,
  oe as c,
  le as d,
  ae as e,
  ce as f,
  ie as i,
  te as j,
  se as r,
  re as s,
  ne as u
};
