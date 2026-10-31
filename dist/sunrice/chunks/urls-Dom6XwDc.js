import { t as R, a as m } from "./main-CkqQQ8dX.js";
const A = globalThis.Sunrice;
if (!A) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const se = A.modules["react/jsx-runtime"], C = globalThis.Sunrice;
if (!C) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const u = C.modules.react, _ = globalThis.Sunrice;
if (!_) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const ne = _.modules["@inertiajs/react"], N = globalThis.Sunrice;
if (!N) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const re = N.modules["@imajiner/admin-sdk/ui"];
const U = (t) => t?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
function D(t, e, n = []) {
  if (e == null)
    throw new Error("[lucide]: iconNode is required when icon name is used");
  return {
    name: U(t),
    size: 24,
    node: e,
    ...n.length > 0 ? { aliases: n } : {}
  };
}
const q = (t) => {
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
const K = (t) => {
  const e = q(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
const $ = (...t) => t.filter((e, n, s) => !!e && e.trim() !== "" && s.indexOf(e) === n).join(" ").trim();
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
function M(t, e = {}) {
  const n = e.attributeNames ?? {}, s = (c) => n[c] ?? c, o = t.size ?? t.width ?? h.width, r = t.size ?? t.height ?? h.height, i = t.aliases?.filter((c) => typeof c == "string" && c.trim() !== "").map((c) => `lucide-${c}`) ?? [], a = [...t.name ? [`lucide-${t.name}`] : [], ...i], l = e.className?.split(" ").filter(Boolean) ?? [], w = e.includeDefaultClasses === !1 ? $(...l) : $("lucide", ...a, ...l), p = e.absoluteStrokeWidth ? Number(e.strokeWidth ?? h["stroke-width"]) * Number(t.size ?? t.width ?? h.width) / Number(e.size ?? e.width ?? h.width) : e.strokeWidth ?? h["stroke-width"];
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
      [s("stroke-width")]: p,
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
function O(t, e = {}) {
  return M(t, {
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
const Y = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
}, G = u.createContext({}), H = () => u.useContext(G), J = u.forwardRef(
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
    icon: p = {
      node: w,
      aliases: [],
      size: 24
    },
    ...S
  }, c) => {
    const {
      size: d = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: g = !1,
      nonScalingStroke: b = !1,
      color: v = "currentColor",
      className: L = ""
    } = H() ?? {}, P = !!l || Y(S), [z, W, F = []] = O(p, {
      color: t ?? v,
      width: n ?? e ?? d,
      height: s ?? e ?? d,
      strokeWidth: o ?? f,
      absoluteStrokeWidth: r ?? g,
      nonScalingStroke: i ?? b,
      className: $(L, a),
      hasA11yProp: P,
      attributes: S
    });
    return u.createElement(
      z,
      {
        ref: c,
        ...W
      },
      [
        ...F.map(([I, B]) => u.createElement(I, B)),
        ...Array.isArray(l) ? l : [l]
      ]
    );
  }
);
function oe(t, e = [], n = []) {
  const s = typeof t == "string" ? D(t, e, n) : t, o = u.forwardRef(
    ({ className: r, ...i }, a) => u.createElement(J, {
      ref: a,
      icon: s,
      className: r,
      ...i
    })
  );
  return s.name && (o.displayName = K(s.name)), o;
}
function Q(t) {
  try {
    return R(t);
  } catch {
    return t;
  }
}
function x(t, e) {
  return Q(t);
}
function V(t, ...e) {
  let n = 0;
  return t.replace(/%(?:(\d+)\$)?([sd%])/g, (s, o, r) => {
    if (r === "%") return "%";
    const i = e[o ? Number(o) - 1 : n++];
    return String(r === "d" ? Math.trunc(Number(i)) : i ?? "");
  });
}
const X = ["short_text", "long_text", "email", "phone", "number", "rating", "scale", "nps", "slider", "date", "single_choice", "multi_choice", "yes_no", "consent", "hidden", "statement", "summary"], E = [...X, "address", "media", "file_upload", "calculated"], T = /* @__PURE__ */ new Set();
function Z(t) {
  for (const e of t) /^[a-z][a-z0-9_]{0,63}$/.test(e) && !E.includes(e) && T.add(e);
}
const ie = (t) => E.includes(t) || T.has(t);
function ce(t, e) {
  return t.capabilities?.[e] === !0;
}
class j extends Error {
  constructor(e, n, s, o = {}) {
    super(n), this.code = e, this.status = s, this.data = o;
  }
}
class ee {
  constructor(e, n = (s, o) => globalThis.fetch(s, o)) {
    this.config = e, this.transport = n, Z(e.features?.fieldTypes ?? []);
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
      throw new j(
        String(a.code ?? "cff_http_error"),
        String(a.message ?? x("The request failed. Please try again.")),
        r.status,
        a.data ?? {}
      );
    }
    return i;
  }
}
function ae(t) {
  if (!(t instanceof Error)) return x("An unexpected error occurred.");
  const e = t instanceof j && Array.isArray(t.data.errors) ? t.data.errors : [], n = e.find((r) => r && typeof r.message == "string");
  if (!n) return t.message;
  const s = typeof n.path == "string" && n.path ? `${n.path}: ` : "", o = e.length > 1 ? ` ${V(x("(and %d more)"), e.length - 1)}` : "";
  return `${t.message} ${s}${String(n.message)}${o}`;
}
function ue(t) {
  return u.useMemo(() => new ee(t), [t]);
}
const le = {
  forms: (t = {}) => y(m("chatflow/forms"), t),
  createForm: () => m("chatflow/forms/create"),
  form: (t) => m(`chatflow/forms/${t}`),
  formAction: (t, e) => m(`chatflow/forms/${t}/${e}`),
  submissions: (t = {}) => y(m("chatflow/submissions"), t),
  submission: (t) => m(`chatflow/submissions/${t}`)
};
function y(t, e) {
  const n = new URLSearchParams();
  for (const [o, r] of Object.entries(e))
    r !== void 0 && r !== "" && n.set(o, String(r));
  const s = n.toString();
  return s ? `${t}?${s}` : t;
}
export {
  j as A,
  x as _,
  ue as a,
  u as b,
  oe as c,
  le as d,
  ae as e,
  ce as f,
  ie as i,
  se as j,
  ne as r,
  V as s,
  re as u
};
