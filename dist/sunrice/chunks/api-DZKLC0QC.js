import { _ as p } from "./urls-2n-KvCIk.js";
const C = globalThis.Sunrice;
if (!C) throw new Error("[sunrice] This bundle needs the Sunrice admin panel (window.Sunrice is missing).");
const l = C.modules.react;
const T = (t) => t?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
function F(t, e, s = []) {
  if (e == null)
    throw new Error("[lucide]: iconNode is required when icon name is used");
  return {
    name: T(t),
    size: 24,
    node: e,
    ...s.length > 0 ? { aliases: s } : {}
  };
}
const P = (t) => {
  let e = "", s = !1;
  for (const o of t) {
    if (o === "-" || o === "_" || o <= " ") {
      s = e.length > 0;
      continue;
    }
    e.length === 0 ? e += o.toLowerCase() : e += s ? o.toUpperCase() : o, s = !1;
  }
  return e;
};
const z = (t) => {
  const e = P(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
const A = (...t) => t.filter((e, s, o) => !!e && e.trim() !== "" && o.indexOf(e) === s).join(" ").trim();
const d = {
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
function y(t) {
  return t != null;
}
function W(t, e = {}) {
  const s = e.attributeNames ?? {}, o = (r) => s[r] ?? r, n = t.size ?? t.width ?? d.width, i = t.size ?? t.height ?? d.height, c = t.aliases?.filter((r) => typeof r == "string" && r.trim() !== "").map((r) => `lucide-${r}`) ?? [], a = [...t.name ? [`lucide-${t.name}`] : [], ...c], h = e.className?.split(" ").filter(Boolean) ?? [], m = e.includeDefaultClasses === !1 ? A(...h) : A("lucide", ...a, ...h), b = e.absoluteStrokeWidth ? Number(e.strokeWidth ?? d["stroke-width"]) * Number(t.size ?? t.width ?? d.width) / Number(e.size ?? e.width ?? d.width) : e.strokeWidth ?? d["stroke-width"];
  return [
    "svg",
    {
      ...Object.entries(d).reduce((r, [u, f]) => (r[o(u)] = f, r), {}),
      ..."color" in e && e.color && {
        [o("stroke")]: e.color
      },
      ..."size" in e && y(e.size) && {
        [o("width")]: e.size,
        [o("height")]: e.size
      },
      ..."width" in e && y(e.width) && {
        [o("width")]: e.width
      },
      ..."height" in e && y(e.height) && {
        [o("height")]: e.height
      },
      [o("stroke-width")]: b,
      ...m && {
        [o("class")]: m
      },
      [o("viewBox")]: `0 0 ${n} ${i}`,
      ...e.hasA11yProp === !1 ? {
        [o("aria-hidden")]: "true"
      } : {},
      ..."attributes" in e && e.attributes
    },
    t.node.map((r) => {
      const [u, f, w] = r, g = e.nonScalingStroke ? { [o("vector-effect")]: "non-scaling-stroke", ...f } : f;
      return w ? [u, g, w] : [u, g];
    })
  ];
}
function $(t, e = {}) {
  return W(t, {
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
const I = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
}, B = l.createContext({}), R = () => l.useContext(B), U = l.forwardRef(
  ({
    color: t,
    size: e,
    width: s,
    height: o,
    strokeWidth: n,
    absoluteStrokeWidth: i,
    nonScalingStroke: c,
    className: a = "",
    children: h,
    iconNode: m = [],
    icon: b = {
      node: m,
      aliases: [],
      size: 24
    },
    ...k
  }, r) => {
    const {
      size: u = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: w = !1,
      nonScalingStroke: g = !1,
      color: S = "currentColor",
      className: x = ""
    } = R() ?? {}, _ = !!h || I(k), [E, N, v = []] = $(b, {
      color: t ?? S,
      width: s ?? e ?? u,
      height: o ?? e ?? u,
      strokeWidth: n ?? f,
      absoluteStrokeWidth: i ?? w,
      nonScalingStroke: c ?? g,
      className: A(x, a),
      hasA11yProp: _,
      attributes: k
    });
    return l.createElement(
      E,
      {
        ref: r,
        ...N
      },
      [
        ...v.map(([L, j]) => l.createElement(L, j)),
        ...Array.isArray(h) ? h : [h]
      ]
    );
  }
);
function H(t, e = [], s = []) {
  const o = typeof t == "string" ? F(t, e, s) : t, n = l.forwardRef(
    ({ className: i, ...c }, a) => l.createElement(U, {
      ref: a,
      icon: o,
      className: i,
      ...c
    })
  );
  return o.name && (n.displayName = z(o.name)), n;
}
function O(t) {
  const e = structuredClone(t.settings);
  return e.integrations?.webhooks && (e.integrations.webhooks = e.integrations.webhooks.map((s) => ({
    ...s,
    secret: "",
    headers: {},
    enabled: !1
  }))), {
    format: "chatflow/form",
    version: 1,
    title: t.title,
    schema: structuredClone(t.schema),
    settings: e
  };
}
function q(t) {
  if (new TextEncoder().encode(t).length > 1048576)
    throw new Error(p("Form file exceeds 1 MiB."));
  const e = JSON.parse(t);
  if (!e || typeof e != "object" || !("format" in e) || e.format !== "chatflow/form" || !("version" in e) || e.version !== 1 || !("title" in e) || typeof e.title != "string" || !("schema" in e) || !e.schema || typeof e.schema != "object" || !("schemaVersion" in e.schema) || e.schema.schemaVersion !== 1 || !("steps" in e.schema) || !Array.isArray(e.schema.steps) || !("endings" in e.schema) || !Array.isArray(e.schema.endings) || !("settings" in e) || !e.settings || typeof e.settings != "object" || Array.isArray(e.settings))
    throw new Error(p("Invalid ChatFlow form file."));
  const s = e, o = structuredClone(s.settings);
  return Array.isArray(o.integrations?.webhooks) && (o.integrations.webhooks = o.integrations.webhooks.map((n) => ({
    ...n,
    secret: "",
    enabled: !1,
    headers: {}
  }))), { ...s, settings: o };
}
async function X(t, e) {
  const s = q(t);
  return e.request("admin/forms", "POST", {
    title: s.title,
    schema: s.schema,
    settings: s.settings
  });
}
function Z(t) {
  const e = URL.createObjectURL(
    new Blob([JSON.stringify(O(t), null, 2)], { type: "application/json" })
  ), s = document.createElement("a");
  s.href = e, s.download = `chatflow-form-${t.id}.json`, document.body.appendChild(s), s.click(), s.remove(), setTimeout(() => URL.revokeObjectURL(e), 1e3);
}
const D = ["short_text", "long_text", "email", "phone", "number", "rating", "scale", "nps", "slider", "date", "single_choice", "multi_choice", "yes_no", "consent", "hidden", "statement", "summary"], J = [...D, "address", "media", "file_upload", "calculated"], M = /* @__PURE__ */ new Set();
function V(t) {
  for (const e of t) /^[a-z][a-z0-9_]{0,63}$/.test(e) && !J.includes(e) && M.add(e);
}
class K extends Error {
  constructor(e, s, o, n = {}) {
    super(s), this.code = e, this.status = o, this.data = n;
  }
}
class Y {
  constructor(e, s = (o, n) => globalThis.fetch(o, n)) {
    this.config = e, this.transport = s, V(e.features?.fieldTypes ?? []);
  }
  /**
   * Build an admin REST URL for both pretty and plain permalinks. With plain
   * permalinks `restUrl` already contains `?rest_route=/cff/v1/`, so appending
   * `?page=1` directly would make the page parameter part of the route.
   */
  urlFor(e) {
    const s = new URL(this.config.restUrl, globalThis.location?.href ?? "https://localhost/"), [o, n = ""] = e.split("?");
    if (s.searchParams.has("rest_route")) {
      const i = (s.searchParams.get("rest_route") ?? "").replace(/\/$/, "");
      s.searchParams.set("rest_route", `${i}/${o}`);
    } else
      s.pathname = `${s.pathname.replace(/\/$/, "")}/${o}`;
    for (const [i, c] of new URLSearchParams(n)) s.searchParams.set(i, c);
    return s.href;
  }
  async request(e, s = "GET", o, n) {
    if (!e.startsWith("admin/") || e.includes("..") || e.includes("://") || /\\|%2e|%2f|%5c/i.test(e.split("?")[0] ?? ""))
      throw new Error("Invalid admin API path");
    const i = await this.transport(this.urlFor(e), {
      method: s,
      credentials: "same-origin",
      cache: "no-store",
      redirect: "error",
      // Laravel: CSRF token instead of the WordPress REST nonce; Accept makes errors come back as JSON.
      headers: { "X-CSRF-TOKEN": this.config.nonce, "Content-Type": "application/json", Accept: "application/json" },
      ...o === void 0 ? {} : { body: JSON.stringify(o) },
      ...n ? { signal: n } : {}
    }), c = await i.json().catch(() => null);
    if (!i.ok) {
      const a = c && typeof c == "object" ? c : {};
      throw new K(
        String(a.code ?? "cff_http_error"),
        String(a.message ?? p("The request failed. Please try again.")),
        i.status,
        a.data ?? {}
      );
    }
    return c;
  }
}
function Q(t) {
  return t instanceof Error ? t.message : p("An unexpected error occurred.");
}
function ee(t) {
  return l.useMemo(() => new Y(t), [t]);
}
export {
  l as _,
  H as c,
  Z as d,
  Q as e,
  X as i,
  ee as u
};
