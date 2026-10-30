import { c as te, j as e, u as l, _ as n, b as P, s as R, e as W, i as an, a as sn, d as ce, r as Ft } from "./urls-CdD8nhpe.js";
import { e as de, r as rn, u as ze, w as ln, m as st, a as it, c as on, d as cn, D as dn, p as un, f as fn, g as hn, h as gn, i as mn, j as pn } from "./model-B34PEzfW.js";
import { T as V } from "./trash-oPmPAl7u.js";
import { P as $, R as bn } from "./rotate-ccw-DY2CwJuB.js";
import { i as Ut, n as Q, r as rt, C as He } from "./value-Dfk8sdww.js";
import { D as xn } from "./download-CkQUiVgy.js";
import { u as vn } from "./useConfirm-E4vHXa4k.js";
const Vt = {
  name: "external-link",
  size: 24,
  node: [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
  ]
};
Vt.node;
const Ot = te(Vt);
const zt = {
  name: "eye",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]
};
zt.node;
const yn = te(zt);
const Ht = {
  name: "redo-2",
  size: 24,
  node: [
    ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
    ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
  ]
};
Ht.node;
const jn = te(Ht);
const Kt = {
  name: "send",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
        key: "1ffxy3"
      }
    ],
    ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
  ]
};
Kt.node;
const wn = te(Kt);
const Jt = {
  name: "undo-2",
  size: 24,
  node: [
    ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
    ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
  ]
};
Jt.node;
const kn = te(Jt);
function Cn({ form: t, onChange: s }) {
  const { schema: o } = t, i = t.settings.completion, r = i?.defaultEndingId ?? o.endings[0]?.id ?? "", a = (d) => s({
    ...t,
    schema: { ...o, endings: o.endings.map((f) => f.id === d.id ? d : f) }
  }), c = (d) => s({
    ...t,
    settings: { ...t.settings, completion: { ...i, defaultEndingId: r, ...d } }
  }), u = () => s({
    ...t,
    schema: { ...o, endings: [...o.endings, { id: ze("end"), type: "message", messages: [n("Thank you!")] }] }
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
    /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsx(l.CardHeader, { children: /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Finishing") }) }),
      /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: "cf-default-ending", children: n("Default ending") }),
          /* @__PURE__ */ e.jsxs(l.Select, { value: r, onValueChange: (d) => c({ defaultEndingId: d }), children: [
            /* @__PURE__ */ e.jsx(l.SelectTrigger, { id: "cf-default-ending", children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
            /* @__PURE__ */ e.jsx(l.SelectContent, { children: o.endings.map((d, f) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: d.id, children: de(d, f) }, d.id)) })
          ] }),
          /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("Used unless a rule chooses another ending.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: "cf-review", children: n("After the last question") }),
          /* @__PURE__ */ e.jsxs(l.Select, { value: i?.review ?? "off", onValueChange: (d) => c({ review: d }), children: [
            /* @__PURE__ */ e.jsx(l.SelectTrigger, { id: "cf-review", children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(l.SelectItem, { value: "off", children: n("Submit automatically") }),
              /* @__PURE__ */ e.jsx(l.SelectItem, { value: "button", children: n("Show a Submit button") }),
              /* @__PURE__ */ e.jsx(l.SelectItem, { value: "show", children: n("Show the answers for review, then Submit") })
            ] })
          ] })
        ] })
      ] })
    ] }),
    o.endings.map((d, f) => /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsxs(l.CardHeader, { className: "cf:flex cf:flex-row cf:items-center cf:justify-between cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { className: "cf:truncate", children: de(d, f) }),
        /* @__PURE__ */ e.jsx(
          l.Button,
          {
            variant: "ghost",
            size: "icon",
            className: "cf:size-8",
            "aria-label": n("Remove ending"),
            disabled: o.endings.length <= 1,
            onClick: () => s(rn(t, d.id)),
            children: /* @__PURE__ */ e.jsx(V, {})
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-ending-type-${d.id}`, children: n("Ending type") }),
          /* @__PURE__ */ e.jsxs(l.Select, { value: d.type, onValueChange: (g) => a({ ...d, type: g }), children: [
            /* @__PURE__ */ e.jsx(l.SelectTrigger, { id: `cf-ending-type-${d.id}`, children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(l.SelectItem, { value: "message", children: n("Show a thank-you message") }),
              /* @__PURE__ */ e.jsx(l.SelectItem, { value: "redirect", children: n("Go to a page or WhatsApp") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-ending-messages-${d.id}`, children: n("Messages (one per line)") }),
          /* @__PURE__ */ e.jsx(
            l.Textarea,
            {
              id: `cf-ending-messages-${d.id}`,
              rows: 3,
              value: d.messages?.join(`
`) ?? "",
              onChange: (g) => a({ ...d, messages: g.target.value.split(`
`).slice(0, 50) })
            }
          )
        ] }),
        d.type === "redirect" && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
            /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-ending-url-${d.id}`, children: n("Redirect URL") }),
            /* @__PURE__ */ e.jsx(
              l.Input,
              {
                id: `cf-ending-url-${d.id}`,
                type: "url",
                value: d.url ?? "",
                placeholder: "https://",
                onChange: (g) => a({ ...d, url: g.target.value })
              }
            ),
            /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("The submission is saved before the visitor leaves. A wa.me link opens WhatsApp with a message the visitor still sends.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
            /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-ending-append-${d.id}`, children: n("Add answers to the link") }),
            /* @__PURE__ */ e.jsx(l.Switch, { id: `cf-ending-append-${d.id}`, checked: !!d.appendQuery, onCheckedChange: (g) => a({ ...d, appendQuery: g }) })
          ] }),
          d.appendQuery && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
            /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-ending-keys-${d.id}`, children: n("Answers to add (field keys, comma separated)") }),
            /* @__PURE__ */ e.jsx(
              l.Input,
              {
                id: `cf-ending-keys-${d.id}`,
                value: d.queryKeys?.join(", ") ?? "",
                onChange: (g) => a({ ...d, queryKeys: g.target.value.split(",").map((m) => m.trim()).filter(Boolean).slice(0, 100) })
              }
            )
          ] })
        ] })
      ] })
    ] }, d.id)),
    /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", className: "cf:self-start", disabled: o.endings.length >= 20, onClick: u, children: [
      /* @__PURE__ */ e.jsx($, {}),
      " ",
      n("Add ending")
    ] })
  ] });
}
function Xe({ label: t, value: s, validate: o, onCommit: i, help: r }) {
  const a = P.useId(), [c, u] = P.useState(s), [d, f] = P.useState("");
  P.useEffect(() => {
    u(s), f("");
  }, [s]);
  const g = () => {
    if (c === s) return;
    const m = o(c);
    f(m), m || i(c);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(l.Label, { htmlFor: a, children: t }),
    /* @__PURE__ */ e.jsx(
      l.Input,
      {
        id: a,
        value: c,
        "aria-invalid": d ? !0 : void 0,
        "aria-describedby": `${a}-help`,
        onChange: (m) => u(m.target.value),
        onBlur: g,
        onKeyDown: (m) => {
          m.key === "Enter" && g(), m.key === "Escape" && (u(s), f(""));
        }
      }
    ),
    /* @__PURE__ */ e.jsx("p", { id: `${a}-help`, className: d ? "cf:text-xs cf:text-destructive" : "cf:text-xs cf:text-muted-foreground", children: d || r })
  ] });
}
const Sn = [
  "eq",
  "neq",
  "contains",
  "not_contains",
  "in",
  "not_in",
  "gt",
  "gte",
  "lt",
  "lte",
  "between",
  "is_empty",
  "is_not_empty",
  "starts_with",
  "matches",
  "date_before",
  "date_after",
  "age_gte"
];
function Ke(t) {
  return {
    eq: n("is"),
    neq: n("is not"),
    contains: n("contains"),
    not_contains: n("does not contain"),
    in: n("is one of"),
    not_in: n("is none of"),
    gt: n("is more than"),
    gte: n("is at least"),
    lt: n("is less than"),
    lte: n("is at most"),
    between: n("is between"),
    is_empty: n("is empty"),
    is_not_empty: n("is answered"),
    starts_with: n("starts with"),
    matches: n("matches the pattern"),
    date_before: n("is before"),
    date_after: n("is after"),
    age_gte: n("is at least (years old)")
  }[t] ?? t;
}
function Yt(t) {
  return { answer: n("Answer"), variable: n("Variable"), hidden: n("Hidden value"), url: n("URL parameter") }[t];
}
function le(t) {
  return {
    show: n("Show"),
    hide: n("Hide"),
    jump: n("Go to"),
    require: n("Make required"),
    unrequire: n("Make optional"),
    end: n("End with"),
    set_variable: n("Set variable")
  }[t];
}
const Je = (t) => t === "is_empty" || t === "is_not_empty", ae = (t) => t === "in" || t === "not_in", lt = (t) => t === "between";
function Ye(t) {
  return "field" in t;
}
function ee(t) {
  return { field: t.steps[0]?.key ?? "field", source: "answer", op: "eq", value: "" };
}
function Nn(t, s) {
  const o = t.steps.findIndex((r) => r.id === s), i = t.steps[o + 1] ?? t.steps[0];
  return { if: { all: [ee(t)] }, then: { action: "jump", to: i?.id ?? "" } };
}
function Tn(t) {
  return Array.isArray(t) ? t.map(String).join(", ") : t == null ? "" : String(t);
}
function Ge(t, s) {
  if ("all" in t || "any" in t) {
    const r = "all" in t ? t.all : t.any;
    return r.length ? r.map((c) => Ye(c) ? Ge(c, s) : `(${Ge(c, s)})`).join("all" in t ? ` ${n("and")} ` : ` ${n("or")} `) : n("always");
  }
  const o = t.source ?? "answer", i = o === "answer" ? s.steps.find((r) => r.key === t.field)?.label || t.field : `${Yt(o)} ${t.field}`;
  return Je(t.op) ? `${i} ${Ke(t.op)}` : `${i} ${Ke(t.op)} ${Tn(t.value)}`;
}
function En(t, s) {
  if (t.action === "set_variable") {
    const i = t.operation === "add" ? "+" : t.operation === "subtract" ? "−" : "=";
    return `${le("set_variable")} ${t.key} ${i} ${String(t.value)}`;
  }
  if (t.action === "end") {
    const i = s.endings.findIndex((r) => r.id === t.to);
    return `${le("end")} ${i >= 0 ? R(n("ending %d"), i + 1) : t.to}`;
  }
  const o = s.steps.find((i) => i.id === t.to);
  return `${le(t.action)} ${o ? o.label || o.key : t.to}`;
}
const Bn = 50;
function In({ schema: t, rules: s, onChange: o, after: i, actions: r = ["jump", "show", "hide", "require", "unrequire", "end", "set_variable"] }) {
  const a = (c, u) => o(s.map((d, f) => f === c ? u : d));
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
    s.map((c, u) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3 cf:rounded-md cf:border cf:p-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
        /* @__PURE__ */ e.jsx("span", { className: "cf:text-sm cf:font-medium", children: n("If") }),
        /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", className: "cf:size-8", "aria-label": n("Remove rule"), onClick: () => o(s.filter((d, f) => f !== u)), children: /* @__PURE__ */ e.jsx(V, {}) })
      ] }),
      /* @__PURE__ */ e.jsx(ue, { schema: t, value: c.if, onChange: (d) => a(u, { ...c, if: d }) }),
      /* @__PURE__ */ e.jsx("span", { className: "cf:text-sm cf:font-medium", children: n("Then") }),
      /* @__PURE__ */ e.jsx(_n, { schema: t, value: c.then, actions: r, onChange: (d) => a(u, { ...c, then: d }) })
    ] }, u)),
    /* @__PURE__ */ e.jsxs(
      l.Button,
      {
        variant: "outline",
        size: "sm",
        className: "cf:self-start",
        disabled: s.length >= Bn || !t.steps.length,
        onClick: () => o([...s, Nn(t, i)]),
        children: [
          /* @__PURE__ */ e.jsx($, {}),
          " ",
          n("Add rule")
        ]
      }
    )
  ] });
}
function ue({ schema: t, value: s, onChange: o, depth: i = 0 }) {
  const r = Ye(s) ? { all: [s] } : s, a = "any" in r ? "any" : "all", c = "any" in r ? r.any : r.all, u = (d) => o(a === "any" ? { any: d } : { all: d });
  return /* @__PURE__ */ e.jsxs("div", { className: `cf:flex cf:flex-col cf:gap-2 ${i ? "cf:rounded-md cf:border-l-2 cf:pl-3" : ""}`, children: [
    c.length > 1 && /* @__PURE__ */ e.jsxs(l.Select, { value: a, onValueChange: (d) => o(d === "any" ? { any: c } : { all: c }), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { className: "cf:w-48", "aria-label": n("Match"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "all", children: n("All of these are true") }),
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "any", children: n("Any of these is true") })
      ] })
    ] }),
    c.map((d, f) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-start cf:gap-2", children: [
      /* @__PURE__ */ e.jsx("div", { className: "cf:min-w-0 cf:flex-1", children: Ye(d) ? /* @__PURE__ */ e.jsx(An, { schema: t, value: d, onChange: (g) => u(c.map((m, h) => h === f ? g : m)) }) : /* @__PURE__ */ e.jsx(ue, { schema: t, value: d, depth: i + 1, onChange: (g) => u(c.map((m, h) => h === f ? g : m)) }) }),
      /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", className: "cf:size-8 cf:shrink-0", "aria-label": n("Remove condition"), onClick: () => u(c.filter((g, m) => m !== f)), children: /* @__PURE__ */ e.jsx(V, {}) })
    ] }, f)),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-2", children: [
      /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => u([...c, ee(t)]), children: [
        /* @__PURE__ */ e.jsx($, {}),
        " ",
        n("Condition")
      ] }),
      i < 2 && /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => u([...c, { any: [ee(t)] }]), children: [
        /* @__PURE__ */ e.jsx($, {}),
        " ",
        n("Group")
      ] })
    ] }),
    !c.length && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("No conditions: the rule always applies.") })
  ] });
}
function An({ schema: t, value: s, onChange: o }) {
  const i = s.source ?? "answer", r = i === "answer" ? t.steps.find((c) => c.key === s.field) : void 0, a = r?.options?.length ? r.options : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-2 cf:sm:grid-cols-[8rem_minmax(0,1fr)_10rem_minmax(0,1fr)]", children: [
    /* @__PURE__ */ e.jsxs(l.Select, { value: i, onValueChange: (c) => {
      const u = c, d = u === "answer" ? t.steps[0]?.key : u === "variable" ? t.variables?.[0]?.key : "";
      o({ ...s, source: u, field: d ?? "", value: "" });
    }, children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Compare"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: ["answer", "variable", "hidden", "url"].map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c, children: Yt(c) }, c)) })
    ] }),
    i === "answer" || i === "variable" ? /* @__PURE__ */ e.jsxs(l.Select, { value: s.field, onValueChange: (c) => o({ ...s, field: c, value: "" }), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": i === "answer" ? n("Question") : n("Variable"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Choose…") }) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: i === "answer" ? t.steps.map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c.key, children: c.label || c.key }, c.id)) : (t.variables ?? []).map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c.key, children: c.key }, c.key)) })
    ] }) : /* @__PURE__ */ e.jsx(
      l.Input,
      {
        "aria-label": n("Name"),
        value: s.field,
        placeholder: i === "url" ? "utm_source" : "field_key",
        onChange: (c) => o({ ...s, field: c.target.value })
      }
    ),
    /* @__PURE__ */ e.jsxs(l.Select, { value: s.op, onValueChange: (c) => {
      const u = c;
      o({ ...s, op: u, value: Je(u) ? void 0 : ae(u) || lt(u) ? [] : "" });
    }, children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Operator"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: Sn.map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c, children: Ke(c) }, c)) })
    ] }),
    !Je(s.op) && (lt(s.op) ? /* @__PURE__ */ e.jsx("div", { className: "cf:grid cf:grid-cols-2 cf:gap-2", children: [0, 1].map((c) => /* @__PURE__ */ e.jsx(
      l.Input,
      {
        "aria-label": c ? n("To") : n("From"),
        value: String((Array.isArray(s.value) ? s.value : [])[c] ?? ""),
        onChange: (u) => {
          const d = [...Array.isArray(s.value) ? s.value : [], "", ""].slice(0, 2);
          d[c] = We(u.target.value), o({ ...s, value: d });
        }
      },
      c
    )) }) : a && !ae(s.op) ? /* @__PURE__ */ e.jsxs(l.Select, { value: String(s.value ?? ""), onValueChange: (c) => o({ ...s, value: c }), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Value"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Choose…") }) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: a.map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c.value, children: c.label }, c.id)) })
    ] }) : /* @__PURE__ */ e.jsx(
      l.Input,
      {
        "aria-label": n("Value"),
        value: Array.isArray(s.value) ? s.value.join(", ") : String(s.value ?? ""),
        placeholder: ae(s.op) ? n("a, b, c") : "",
        onChange: (c) => o({
          ...s,
          value: ae(s.op) ? c.target.value.split(",").map((u) => u.trim()).filter(Boolean) : We(c.target.value)
        })
      }
    ))
  ] });
}
function We(t) {
  return t.trim() !== "" && Number.isFinite(Number(t)) && !/^0\d/.test(t.trim()) ? Number(t) : t;
}
function _n({ schema: t, value: s, actions: o, onChange: i }) {
  const r = (a) => {
    i(a === "set_variable" ? { action: a, key: t.variables?.[0]?.key ?? "", operation: "set", value: "" } : a === "end" ? { action: a, to: t.endings[0]?.id ?? "" } : { action: a, to: "to" in s && s.action !== "end" ? s.to : t.steps[0]?.id ?? "" });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-2 cf:sm:grid-cols-[10rem_minmax(0,1fr)]", children: [
    /* @__PURE__ */ e.jsxs(l.Select, { value: s.action, onValueChange: (a) => r(a), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Action"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: o.map((a) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: a, children: le(a) }, a)) })
    ] }),
    s.action === "set_variable" ? /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:grid-cols-3 cf:gap-2", children: [
      /* @__PURE__ */ e.jsxs(l.Select, { value: s.key, onValueChange: (a) => i({ ...s, key: a }), children: [
        /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Variable"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Variable") }) }),
        /* @__PURE__ */ e.jsx(l.SelectContent, { children: (t.variables ?? []).map((a) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: a.key, children: a.key }, a.key)) })
      ] }),
      /* @__PURE__ */ e.jsxs(l.Select, { value: s.operation, onValueChange: (a) => i({ ...s, operation: a }), children: [
        /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Operation"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
        /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
          /* @__PURE__ */ e.jsx(l.SelectItem, { value: "set", children: n("to") }),
          /* @__PURE__ */ e.jsx(l.SelectItem, { value: "add", children: n("plus") }),
          /* @__PURE__ */ e.jsx(l.SelectItem, { value: "subtract", children: n("minus") })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(l.Input, { "aria-label": n("Value"), value: String(s.value ?? ""), onChange: (a) => i({ ...s, value: We(a.target.value) }) })
    ] }) : /* @__PURE__ */ e.jsxs(l.Select, { value: s.to, onValueChange: (a) => i({ ...s, to: a }), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Target"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Choose…") }) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: s.action === "end" ? t.endings.map((a, c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: a.id, children: de(a, c) }, a.id)) : t.steps.map((a) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: a.id, children: a.label || a.key }, a.id)) })
    ] })
  ] });
}
function Ze(t) {
  return {
    short_text: n("Short text"),
    long_text: n("Long text"),
    email: n("Email"),
    phone: n("Phone"),
    number: n("Number"),
    rating: n("Rating (1–5)"),
    scale: n("Scale (1–10)"),
    nps: n("NPS (0–10)"),
    slider: n("Slider"),
    calculated: n("Calculated number"),
    file_upload: n("File upload"),
    address: n("Address"),
    media: n("Media"),
    date: n("Date"),
    single_choice: n("Single choice"),
    multi_choice: n("Multiple choice"),
    yes_no: n("Yes / No"),
    consent: n("Consent"),
    hidden: n("Hidden field"),
    statement: n("Statement"),
    summary: n("Summary")
  }[t] ?? t;
}
function Mn(t) {
  const s = [
    { label: n("Basic"), types: ["statement", "short_text", "long_text", "email", "phone", "number", "date"] },
    { label: n("Choices"), types: ["single_choice", "multi_choice", "yes_no", "consent"] },
    { label: n("Ratings"), types: ["rating", "scale", "nps", "slider"] },
    { label: n("Advanced"), types: ["address", "media", "file_upload", "calculated", "hidden", "summary"] }
  ], o = new Set(s.flatMap((i) => i.types));
  return [
    ...s.map((i) => ({ ...i, types: i.types.filter((r) => t.includes(r)) })),
    { label: n("Other"), types: t.filter((i) => !o.has(i)) }
  ].filter((i) => i.types.length > 0);
}
function Gt(t) {
  return !["statement", "summary", "media", "hidden", "calculated"].includes(t);
}
const se = ["short_text", "long_text", "email", "phone"];
function Pn() {
  return [
    { path: "helpText", label: n("Help text"), kind: "textarea", section: "content", types: "all" },
    { path: "placeholder", label: n("Placeholder"), kind: "text", section: "content", types: "input" },
    {
      path: "settings.layout",
      label: n("Choice layout"),
      kind: "select",
      section: "content",
      types: ["single_choice", "multi_choice"],
      fallback: "chips",
      options: () => [{ value: "chips", label: n("Chips") }, { value: "cards", label: n("Cards") }, { value: "dropdown", label: n("Dropdown") }]
    },
    { path: "settings.expression", label: n("Formula"), kind: "text", section: "content", types: ["calculated"], help: () => n("For example answer.price * answer.quantity + variable.score") },
    { path: "settings.country", label: n("Default country (ISO code)"), kind: "text", section: "content", types: ["phone"], fallback: "ID", upper: !0 },
    {
      path: "settings.addressFields",
      label: n("Address parts"),
      kind: "checklist",
      section: "content",
      types: ["address"],
      fallback: ["street", "city", "postcode", "country"],
      options: () => [{ value: "street", label: n("Street") }, { value: "city", label: n("City") }, { value: "postcode", label: n("Postcode") }, { value: "country", label: n("Country") }]
    },
    {
      path: "settings.media.type",
      label: n("Media type"),
      kind: "select",
      section: "content",
      types: ["media"],
      fallback: "image",
      options: () => [{ value: "image", label: n("Image") }, { value: "video", label: n("Video") }, { value: "gif", label: n("GIF") }]
    },
    { path: "settings.media.url", label: n("HTTPS media URL"), kind: "text", section: "content", types: ["media"] },
    { path: "settings.media.alt", label: n("Alternative text"), kind: "text", section: "content", types: ["media"] },
    { path: "settings.buttonLabel", label: n("Continue / submit button"), kind: "text", section: "content", types: ["statement", "summary"] },
    { path: "settings.autoContinue", label: n("Wait for the visitor to press a button"), kind: "toggle", section: "content", types: ["statement"], fallback: !0, invert: !0 },
    { path: "settings.consentText", label: n("Consent text"), kind: "textarea", section: "content", types: ["consent"] },
    { path: "settings.privacyUrl", label: n("Privacy policy URL"), kind: "text", section: "content", types: ["consent"] },
    {
      path: "settings.source",
      label: n("Where the value comes from"),
      kind: "select",
      section: "content",
      types: ["hidden"],
      fallback: "default",
      options: () => [
        { value: "default", label: n("Default value") },
        { value: "url", label: n("URL parameter") },
        { value: "cookie", label: n("Cookie") },
        { value: "meta", label: n("Page metadata") },
        { value: "merge", label: n("Merge tag") }
      ],
      help: () => n("Cookies are limited to utm_source, utm_medium, utm_campaign, utm_term, utm_content, campaign, tracking, cff_locale and cff_theme.")
    },
    { path: "settings.sourceKey", label: n("Parameter or cookie name (blank = field key)"), kind: "text", section: "content", types: ["hidden"] },
    { path: "defaultValue", label: n("Default value"), kind: "text", section: "content", types: ["hidden"] },
    { path: "validation.minLength", label: n("Minimum length"), kind: "number", section: "validation", types: se },
    { path: "validation.maxLength", label: n("Maximum length"), kind: "number", section: "validation", types: se },
    {
      path: "validation.format",
      label: n("Format"),
      kind: "select",
      section: "validation",
      types: se,
      fallback: "text",
      options: () => [{ value: "text", label: n("Any text") }, { value: "url", label: n("URL") }, { value: "email", label: n("Email address") }]
    },
    { path: "validation.pattern", label: n("Custom pattern (regular expression)"), kind: "text", section: "validation", types: se },
    { path: "validation.min", label: n("Minimum"), kind: "number", section: "validation", types: ["number", "slider"] },
    { path: "validation.max", label: n("Maximum"), kind: "number", section: "validation", types: ["number", "slider"] },
    { path: "validation.step", label: n("Increment"), kind: "number", section: "validation", types: ["number", "slider"] },
    { path: "settings.unit", label: n("Unit suffix"), kind: "text", section: "validation", types: ["number", "slider"] },
    { path: "validation.min", label: n("Earliest date"), kind: "date", section: "validation", types: ["date"] },
    { path: "validation.max", label: n("Latest date"), kind: "date", section: "validation", types: ["date"] },
    { path: "validation.minAge", label: n("Minimum age (years)"), kind: "number", section: "validation", types: ["date"] },
    { path: "validation.minSelections", label: n("Minimum selections"), kind: "number", section: "validation", types: ["multi_choice"] },
    { path: "validation.maxSelections", label: n("Maximum selections"), kind: "number", section: "validation", types: ["multi_choice"] },
    { path: "validation.maxBytes", label: n("Maximum bytes per file (blank = 10 MiB)"), kind: "number", section: "validation", types: ["file_upload"] },
    { path: "validation.mimeTypes", label: n("Allowed file types (comma separated)"), kind: "list", section: "validation", types: ["file_upload"] },
    { path: "hiddenByDefault", label: n("Hidden until a rule shows it"), kind: "toggle", section: "advanced", types: "all", fallback: !1 },
    { path: "settings.autocomplete", label: n("Autocomplete"), kind: "text", section: "advanced", types: "input", help: () => n("A browser autocomplete token, such as name, email or tel.") },
    {
      path: "settings.inputMode",
      label: n("Keyboard hint"),
      kind: "select",
      section: "advanced",
      types: "input",
      fallback: "text",
      options: () => [
        { value: "text", label: n("Standard keyboard") },
        { value: "numeric", label: n("Numbers") },
        { value: "tel", label: n("Telephone keypad") },
        { value: "decimal", label: n("Decimal numbers") },
        { value: "email", label: n("Email keyboard") },
        { value: "url", label: n("URL keyboard") },
        { value: "search", label: n("Search keyboard") },
        { value: "none", label: n("No on-screen keyboard") }
      ]
    }
  ];
}
function pe(t, s) {
  return Pn().filter((o) => o.section === s && (o.types === "all" || (o.types === "input" ? Gt(t) : o.types.includes(t))));
}
function Rn(t, s) {
  return s.split(".").reduce((o, i) => o && typeof o == "object" ? o[i] : void 0, t);
}
function Ln(t, s, o) {
  const i = s.split("."), r = (a, c) => {
    const u = { ...a ?? {} }, d = i[c];
    if (c === i.length - 1)
      o === void 0 || o === "" ? delete u[d] : u[d] = o;
    else {
      const f = r(u[d], c + 1);
      f && Object.keys(f).length ? u[d] = f : delete u[d];
    }
    return u;
  };
  return r(t, 0);
}
const Y = "__inherit";
function oe({ target: t, setting: s, onChange: o }) {
  const i = P.useId(), r = Rn(t, s.path), a = r ?? s.fallback, c = (h) => o(Ln(t, s.path, h)), u = s.help?.(), d = s.inherited?.(), f = d === void 0 ? "" : typeof d == "boolean" ? d ? n("On") : n("Off") : String(d), g = R(n("Site default (%s)"), f || n("empty"));
  if (s.kind === "toggle" && s.inherited)
    return /* @__PURE__ */ e.jsx(ot, { id: i, label: s.label, help: u, children: /* @__PURE__ */ e.jsxs(l.Select, { value: r === void 0 ? Y : r ? "on" : "off", onValueChange: (h) => c(h === Y ? void 0 : h === "on"), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { id: i, children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: Y, children: g }),
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "on", children: n("On") }),
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "off", children: n("Off") })
      ] })
    ] }) });
  if (s.kind === "toggle") {
    const h = s.invert ? a === !1 : !!a;
    return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-start cf:justify-between cf:gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1", children: [
        /* @__PURE__ */ e.jsx(l.Label, { htmlFor: i, children: s.label }),
        u && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: u })
      ] }),
      /* @__PURE__ */ e.jsx(l.Switch, { id: i, checked: h, onCheckedChange: (w) => c(s.invert ? !w : w) })
    ] });
  }
  if (s.kind === "checklist") {
    const h = Array.isArray(a) ? a : [];
    return /* @__PURE__ */ e.jsxs("fieldset", { className: "cf:flex cf:flex-col cf:gap-2", children: [
      /* @__PURE__ */ e.jsx("legend", { className: "cf:mb-1 cf:text-sm cf:font-medium", children: s.label }),
      s.options?.().map((w) => /* @__PURE__ */ e.jsxs("label", { className: "cf:flex cf:items-center cf:gap-2 cf:text-sm", children: [
        /* @__PURE__ */ e.jsx(
          l.Checkbox,
          {
            checked: h.includes(w.value),
            onCheckedChange: (k) => c(k ? [...h.filter((y) => y !== w.value), w.value] : h.filter((y) => y !== w.value))
          }
        ),
        w.label
      ] }, w.value))
    ] });
  }
  const m = s.inherited ? g : s.fallback !== void 0 && typeof s.fallback != "object" ? String(s.fallback) : void 0;
  return /* @__PURE__ */ e.jsx(ot, { id: i, label: s.label, help: u, children: s.kind === "select" ? /* @__PURE__ */ e.jsxs(l.Select, { value: r === void 0 && s.inherited ? Y : String(a ?? ""), onValueChange: (h) => c(h === Y ? void 0 : h), children: [
    /* @__PURE__ */ e.jsx(l.SelectTrigger, { id: i, children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
    /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
      s.inherited && /* @__PURE__ */ e.jsx(l.SelectItem, { value: Y, children: g }),
      s.options?.().map((h) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: h.value, children: h.label }, h.value))
    ] })
  ] }) : s.kind === "textarea" ? /* @__PURE__ */ e.jsx(l.Textarea, { id: i, rows: 3, value: String(r ?? ""), placeholder: m, onChange: (h) => c(h.target.value) }) : s.kind === "number" ? /* @__PURE__ */ e.jsx(Dn, { id: i, value: typeof r == "number" ? r : void 0, placeholder: m, min: s.min, max: s.max, onChange: c }) : s.kind === "list" ? /* @__PURE__ */ e.jsx(
    l.Input,
    {
      id: i,
      value: Array.isArray(r) ? r.join(", ") : "",
      onChange: (h) => c(h.target.value.split(",").map((w) => w.trim()).filter(Boolean))
    }
  ) : s.kind === "color" ? /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-2", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "color",
        "aria-label": R(n("%s colour picker"), s.label),
        className: "cf:h-9 cf:w-12 cf:shrink-0 cf:cursor-pointer cf:rounded-md cf:border cf:bg-transparent",
        style: /^#[0-9a-f]{6}$/i.test(String(r ?? "")) ? void 0 : { opacity: 0.35 },
        value: /^#[0-9a-f]{6}$/i.test(String(r ?? "")) ? String(r) : "#ffffff",
        onChange: (h) => c(h.target.value)
      }
    ),
    /* @__PURE__ */ e.jsx(l.Input, { id: i, value: String(r ?? ""), placeholder: m ?? n("Default"), onChange: (h) => c(h.target.value) })
  ] }) : /* @__PURE__ */ e.jsx(
    l.Input,
    {
      id: i,
      type: s.kind === "date" ? "date" : "text",
      value: String(r ?? ""),
      placeholder: m,
      onChange: (h) => c(s.upper ? h.target.value.toUpperCase() : h.target.value)
    }
  ) });
}
function ot({ id: t, label: s, help: o, children: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(l.Label, { htmlFor: t, children: s }),
    i,
    o && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: o })
  ] });
}
function Dn({ id: t, value: s, placeholder: o, min: i, max: r, onChange: a }) {
  const [c, u] = P.useState(s === void 0 ? "" : String(s));
  return P.useEffect(() => u(s === void 0 ? "" : String(s)), [s]), /* @__PURE__ */ e.jsx(
    l.Input,
    {
      id: t,
      type: "number",
      inputMode: "decimal",
      value: c,
      placeholder: o,
      min: i,
      max: r,
      onChange: (d) => {
        u(d.target.value), d.target.value === "" ? a(void 0) : Number.isFinite(Number(d.target.value)) && a(Number(d.target.value));
      }
    }
  );
}
const $n = /^[a-z][a-z0-9_]{0,63}$/, be = 200;
function qn({ step: t, schema: s, reservedValues: o, onChange: i, onRenameKey: r, onRenameOption: a, actions: c }) {
  const u = Gt(t.type), d = pe(t.type, "validation");
  return /* @__PURE__ */ e.jsxs(l.Card, { className: "cf:gap-4", children: [
    /* @__PURE__ */ e.jsxs(l.CardHeader, { className: "cf:flex cf:flex-row cf:items-start cf:justify-between cf:gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:min-w-0", children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { className: "cf:truncate", children: t.label || t.key }),
        /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: Ze(t.type) })
      ] }),
      c
    ] }),
    /* @__PURE__ */ e.jsx(l.CardContent, { children: /* @__PURE__ */ e.jsxs(l.Tabs, { defaultValue: "content", children: [
      /* @__PURE__ */ e.jsxs(l.TabsList, { children: [
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "content", children: n("Content") }),
        d.length > 0 && /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "validation", children: n("Validation") }),
        /* @__PURE__ */ e.jsxs(l.TabsTrigger, { value: "logic", children: [
          n("Rules"),
          t.logic?.length ? ` · ${t.logic.length}` : ""
        ] }),
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "advanced", children: n("Advanced") })
      ] }),
      /* @__PURE__ */ e.jsxs(l.TabsContent, { value: "logic", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-3", children: [
        /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("Rules run after this question is answered, in order. A choice can also lead somewhere on its own (Content → option → More).") }),
        /* @__PURE__ */ e.jsx(In, { schema: s, rules: t.logic ?? [], after: t.id, onChange: (f) => i({ ...t, logic: f }) })
      ] }),
      /* @__PURE__ */ e.jsxs(l.TabsContent, { value: "content", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsx(Fn, { step: t, onChange: i }),
        u && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-required-${t.id}`, children: n("Required") }),
          /* @__PURE__ */ e.jsx(
            l.Switch,
            {
              id: `cf-required-${t.id}`,
              checked: t.required || t.type === "consent",
              disabled: t.type === "consent",
              onCheckedChange: (f) => i({ ...t, required: f })
            }
          )
        ] }),
        pe(t.type, "content").map((f) => /* @__PURE__ */ e.jsx(oe, { target: t, setting: f, onChange: i }, f.path)),
        (t.type === "single_choice" || t.type === "multi_choice") && /* @__PURE__ */ e.jsx(Un, { step: t, schema: s, reservedValues: o, onChange: i, onRenameOption: a }),
        ["rating", "scale", "nps"].includes(t.type) && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("Rating: 1–5, scale: 1–10, NPS: 0–10. Answers are stored as numbers.") })
      ] }),
      d.length > 0 && /* @__PURE__ */ e.jsx(l.TabsContent, { value: "validation", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: d.map((f) => /* @__PURE__ */ e.jsx(oe, { target: t, setting: f, onChange: i }, `${f.path}-${f.label}`)) }),
      /* @__PURE__ */ e.jsxs(l.TabsContent, { value: "advanced", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-label-${t.id}`, children: n("Label") }),
          /* @__PURE__ */ e.jsx(l.Input, { id: `cf-label-${t.id}`, value: t.label, onChange: (f) => i({ ...t, label: f.target.value }) }),
          /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("How the question is named in the inbox, exports and emails. Follows the first message until you change it.") })
        ] }),
        /* @__PURE__ */ e.jsx(
          Xe,
          {
            label: n("Field key"),
            value: t.key,
            onCommit: r,
            validate: (f) => $n.test(f) ? s.steps.some((g) => g.id !== t.id && g.key === f) ? n("Another field already uses this key.") : "" : n("Start with a lowercase letter; use only lowercase letters, numbers and underscores (64 max)."),
            help: n("Applied when you leave the field. Rules, merge tags, formulas and notifications that use the old key are updated.")
          }
        ),
        pe(t.type, "advanced").map((f) => /* @__PURE__ */ e.jsx(oe, { target: t, setting: f, onChange: i }, f.path))
      ] })
    ] }, t.id) })
  ] });
}
function Fn({ step: t, onChange: s }) {
  const o = (i) => s(ln(t, i));
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
    t.messages.map((i, r) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
        /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-message-${t.id}-${r}`, children: t.messages.length > 1 ? R(n("Message %d"), r + 1) : n("Bot message") }),
        t.messages.length > 1 && /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "sm", className: "cf:h-7 cf:text-destructive", onClick: () => o(t.messages.filter((a, c) => c !== r)), children: n("Remove") })
      ] }),
      /* @__PURE__ */ e.jsx(
        l.Textarea,
        {
          id: `cf-message-${t.id}-${r}`,
          rows: 2,
          value: i,
          onChange: (a) => o(t.messages.map((c, u) => u === r ? a.target.value : c))
        }
      )
    ] }, r)),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between cf:gap-2", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("Use {{field_key}} to repeat an earlier answer.") }),
      /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", size: "sm", disabled: t.messages.length >= 20, onClick: () => o([...t.messages, ""]), children: [
        /* @__PURE__ */ e.jsx($, {}),
        " ",
        n("Add message")
      ] })
    ] })
  ] });
}
function Un({ step: t, schema: s, reservedValues: o, onChange: i, onRenameOption: r }) {
  const a = t.options ?? [], [c, u] = P.useState(""), d = (h) => i({ ...t, options: h }), f = () => [...o, ...a.map((h) => h.value)], g = () => {
    const h = R(n("Option %d"), a.length + 1);
    d([...a, st(it(h, f()), h)]);
  }, m = () => {
    const h = f(), w = c.split(`
`).map((k) => k.trim()).filter(Boolean).slice(0, be - a.length).map((k) => {
      const y = it(k, h);
      return h.push(y), st(y, k);
    });
    d([...a, ...w]), u("");
  };
  return /* @__PURE__ */ e.jsxs("fieldset", { className: "cf:flex cf:flex-col cf:gap-3", children: [
    /* @__PURE__ */ e.jsx("legend", { className: "cf:mb-1 cf:text-sm cf:font-medium", children: n("Options") }),
    /* @__PURE__ */ e.jsx(l.SortableList, { items: a, getId: (h) => h.id, getLabel: (h) => h.label, onReorder: (h) => d(h), children: (h, { handle: w }) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2 cf:rounded-md cf:border cf:p-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(l.SortableHandle, { ...w, label: R(n("Move %s"), h.label) }),
        /* @__PURE__ */ e.jsx(
          l.Input,
          {
            "aria-label": n("Option label"),
            value: h.label,
            onChange: (k) => d(a.map((y) => y.id === h.id ? { ...y, label: k.target.value } : y))
          }
        ),
        /* @__PURE__ */ e.jsx(
          l.Button,
          {
            variant: "ghost",
            size: "icon",
            className: "cf:size-8 cf:shrink-0",
            "aria-label": R(n("Remove %s"), h.label),
            disabled: a.length <= 1,
            onClick: () => d(a.filter((k) => k.id !== h.id)),
            children: /* @__PURE__ */ e.jsx(V, {})
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("details", { className: "cf:text-sm", children: [
        /* @__PURE__ */ e.jsx("summary", { className: "cf:cursor-pointer cf:text-muted-foreground", children: n("More") }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:mt-2 cf:flex cf:flex-col cf:gap-3", children: [
          /* @__PURE__ */ e.jsx(
            Xe,
            {
              label: n("Stored value"),
              value: h.value,
              onCommit: (k) => r(h.id, k),
              validate: (k) => k.trim() ? k.length > 255 ? n("Use 255 characters or fewer.") : a.some((y) => y.id !== h.id && y.value === k) || o.includes(k) ? n("Another option already uses this value.") : "" : n("Enter a stored value."),
              help: n("What exports and rules see. Rules that compare against it are updated.")
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:grid-cols-2 cf:gap-2", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
              /* @__PURE__ */ e.jsx(l.Label, { children: n("Emoji") }),
              /* @__PURE__ */ e.jsx(l.Input, { value: h.emoji ?? "", onChange: (k) => d(a.map((y) => y.id === h.id ? { ...y, emoji: k.target.value } : y)) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
              /* @__PURE__ */ e.jsx(l.Label, { children: n("Reaction text") }),
              /* @__PURE__ */ e.jsx(l.Input, { value: h.reaction ?? "", onChange: (k) => d(a.map((y) => y.id === h.id ? { ...y, reaction: k.target.value } : y)) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("label", { className: "cf:flex cf:items-center cf:gap-2", children: [
            /* @__PURE__ */ e.jsx(l.Checkbox, { checked: !!h.isExclusive, onCheckedChange: (k) => d(a.map((y) => y.id === h.id ? { ...y, isExclusive: k } : y)) }),
            n("Exclusive (none of the above)")
          ] }),
          /* @__PURE__ */ e.jsx(
            Vn,
            {
              option: h,
              step: t,
              schema: s,
              onChange: (k) => d(a.map((y) => y.id === h.id ? { ...y, logic: k } : y))
            }
          ),
          t.type === "single_choice" && /* @__PURE__ */ e.jsxs("label", { className: "cf:flex cf:items-center cf:gap-2", children: [
            /* @__PURE__ */ e.jsx(l.Checkbox, { checked: !!h.isOther, onCheckedChange: (k) => d(a.map((y) => y.id === h.id ? { ...y, isOther: k } : y)) }),
            n("“Other”: lets the visitor type an answer")
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: a.length >= be, onClick: g, children: [
      /* @__PURE__ */ e.jsx($, {}),
      " ",
      n("Add option")
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-bulk-${t.id}`, children: n("Add several (one per line)") }),
      /* @__PURE__ */ e.jsx(l.Textarea, { id: `cf-bulk-${t.id}`, rows: 3, value: c, onChange: (h) => u(h.target.value) }),
      /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: !c.trim() || a.length >= be, onClick: m, children: n("Add these options") })
    ] })
  ] });
}
function Vn({ option: t, step: s, schema: o, onChange: i }) {
  const r = t.logic ?? [], a = r.length === 1 ? r[0] : null, c = a && "all" in a.if && a.if.all.length === 0 && a.then.action === "jump" ? a.then.to : "";
  if (r.length && !c)
    return /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: R(n("This choice has %d rules of its own."), r.length) });
  const u = o.steps.slice(o.steps.findIndex((d) => d.id === s.id) + 1);
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(l.Label, { children: n("When chosen, continue to") }),
    /* @__PURE__ */ e.jsxs(l.Select, { value: c || "next", onValueChange: (d) => i(d === "next" ? [] : [{ if: { all: [] }, then: { action: "jump", to: d } }]), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("When chosen, continue to"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "next", children: n("The next question") }),
        u.map((d) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: d.id, children: d.label || d.key }, d.id))
      ] })
    ] })
  ] });
}
function On(t) {
  return t.runtimeUrl || `${t.pluginUrl}build/runtime/runtime.js`;
}
function zn(t, s) {
  const o = t.settings.sessions ?? {};
  return {
    form: {
      id: t.id || 1,
      title: t.title,
      slug: t.slug,
      version: t.version,
      schema: t.schema,
      appearance: t.settings.appearance ?? s.defaults?.appearance ?? {},
      phrases: t.settings.phrases ?? {},
      session: {
        savePartial: o.savePartial ?? !0,
        resumeEnabled: o.resumeEnabled ?? !0,
        resumePrompt: o.resumePrompt ?? !0,
        resumeDays: o.resumeDays ?? 30,
        storageNotice: o.storageNotice ?? !1
      },
      completion: { review: t.settings.completion?.review ?? "off" },
      language: t.settings.language ?? "site"
    },
    features: { ...s.features, engagement: !1 }
  };
}
function Hn(t) {
  typeof t == "function" ? t() : t?.unmount ? t.unmount() : t?.destroy?.();
}
function ct({ form: t, config: s, height: o = 560 }) {
  const i = P.useRef(null), [r, a] = P.useState(""), [c, u] = P.useState(0), { flowPositions: d, ...f } = t.schema, g = JSON.stringify({ title: t.title, schema: f, settings: t.settings });
  return P.useEffect(() => {
    let m, h = !0;
    const w = window.setTimeout(async () => {
      try {
        const k = await import(
          /* @vite-ignore */
          On(s)
        );
        if (!h || !i.current) return;
        i.current.replaceChildren(), m = k.mountRuntime(i.current, {
          form: zn(t, s),
          preview: !0,
          locale: s.locale,
          context: { now: (/* @__PURE__ */ new Date()).toISOString(), ...t.settings.completion?.defaultEndingId ? { defaultEndingId: t.settings.completion.defaultEndingId } : {} }
        }), a("");
      } catch (k) {
        h && a(W(k));
      }
    }, 500);
    return () => {
      h = !1, window.clearTimeout(w), Hn(m);
    };
  }, [g, c, s]), /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("Preview: answers are not sent or saved.") }),
      /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => u((m) => m + 1), children: [
        /* @__PURE__ */ e.jsx(bn, {}),
        " ",
        n("Start over")
      ] })
    ] }),
    r && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", role: "alert", children: r }),
    /* @__PURE__ */ e.jsx("div", { ref: i, "data-testid": "chat-preview", className: "cf:overflow-auto cf:rounded-lg cf:border cf:bg-background", style: { height: o } })
  ] });
}
const Qe = 1e12;
function xe(t) {
  if (!Number.isFinite(t) || Math.abs(t) > Qe) throw new Error("Invalid calculation.");
  return t;
}
function Kn(t, s = {}, o = {}, i = !1) {
  if (!t.length || t.length > 512 || /[^\t\n\r\f\v -~]/.test(t)) throw new Error("Invalid calculation.");
  const r = t.match(/(?:answer|variable)\.[a-z][a-z0-9_]{0,63}|[0-9]+(?:\.[0-9]+)?|[()+*/-]|[^\t\n\r\f\v ]/g) ?? [];
  if (r.length > 128) throw new Error("Invalid calculation.");
  let a = 0;
  const c = (d = 0, f = 0) => {
    if (f > 16) throw new Error("Invalid calculation.");
    const g = r[a++];
    let m;
    if (g === "+" || g === "-") m = (g === "-" ? -1 : 1) * c(3, f + 1);
    else if (g === "(") {
      if (m = c(0, f + 1), r[a++] !== ")") throw new Error("Invalid calculation.");
    } else if (g && /^(answer|variable)\.[a-z][a-z0-9_]{0,63}$/.test(g)) {
      const [h, w] = g.split("."), k = (h === "answer" ? s : o)[w];
      if (k != null && typeof k != "number") throw new Error("Invalid calculation.");
      m = k ?? 0;
    } else if (g && /^[0-9]+(?:\.[0-9]+)?$/.test(g)) m = Number(g);
    else throw new Error("Invalid calculation.");
    for (xe(m); a < r.length; ) {
      const h = r[a], w = h === "+" || h === "-" ? 1 : h === "*" || h === "/" ? 2 : 0;
      if (!w || w < d) break;
      a++;
      const k = c(w + 1, f + 1);
      m = i ? 1 : xe(h === "+" ? m + k : h === "-" ? m - k : h === "*" ? m * k : m / k);
    }
    return xe(m);
  }, u = c();
  if (a !== r.length) throw new Error("Invalid calculation.");
  return Math.floor(u * 1e6 + 0.5) / 1e6 || 0;
}
function Jn(t) {
  const s = [...t.matchAll(/(answer|variable)\.([a-z][a-z0-9_]{0,63})/g)].map((r) => ({ source: r[1], key: r[2] })), o = {}, i = {};
  for (const r of s) (r.source === "answer" ? o : i)[r.key] = 1;
  return Kn(t, o, i, !0), s;
}
function Yn(t, s) {
  const o = JSON.parse(JSON.stringify(t));
  delete o.experiments;
  for (const i of s.copy ?? []) {
    const r = o.steps.find((a) => a.id === i.stepId);
    if (!r) throw new Error("Invalid variant.");
    r.messages = [...i.messages];
  }
  if (s.stepOrder) {
    if (s.stepOrder.length !== o.steps.length || new Set(s.stepOrder).size !== o.steps.length) throw new Error("Invalid variant.");
    o.steps = s.stepOrder.map((i) => {
      const r = o.steps.find((a) => a.id === i);
      if (!r) throw new Error("Invalid variant.");
      return r;
    });
  }
  return o;
}
function Gn(t) {
  const s = [], o = new Map(t.steps.map((f, g) => [f.key, { step: f, index: g }])), i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set([...t.steps.map((f) => f.id), ...t.endings.map((f) => f.id)]), a = new Map((t.variables ?? []).map((f) => [f.key, f.type])), c = (f, g) => s.push(Ut(f, "invalid_power", g));
  for (const [f, g] of (t.flowPositions ?? []).entries())
    (!r.has(g.id) || i.has(g.id)) && c(`/flowPositions/${f}`, "Graph positions must reference unique existing nodes."), i.add(g.id);
  for (const [f, g] of (t.variables ?? []).entries()) typeof g.default == "number" && Math.abs(g.default) > Qe && c(`/variables/${f}`, "Numeric variables are limited to +/- 1e12.");
  t.steps.forEach((f, g) => {
    for (const m of [...f.logic ?? [], ...(f.options ?? []).flatMap((h) => h.logic ?? [])]) m.then.action === "set_variable" && typeof m.then.value == "number" && Math.abs(m.then.value) > Qe && c(`/steps/${g}/logic`, "Numeric variables are limited to +/- 1e12.");
    if (f.type === "calculated")
      try {
        for (const m of Jn(f.settings?.expression ?? ""))
          if (m.source === "variable")
            a.get(m.key) !== "number" && c(`/steps/${g}/settings/expression`, "Calculations reference numeric variables only.");
          else {
            const h = o.get(m.key);
            (!h || h.index >= g || !["number", "rating", "scale", "nps", "slider", "calculated"].includes(h.step.type)) && c(`/steps/${g}/settings/expression`, "Calculations reference earlier numeric answers only.");
          }
      } catch {
        c(`/steps/${g}/settings/expression`, "Use bounded arithmetic with answer.key or variable.key.");
      }
  });
  const u = (f, g, m = 0) => {
    if (m > 16) {
      c(g, "Outcome conditions may nest at most 16 levels.");
      return;
    }
    if ("all" in f || "any" in f)
      for (const h of "all" in f ? f.all : f.any) u(h, g, m + 1);
    else ((f.source ?? "answer") === "answer" ? !o.has(f.field) : f.source === "variable" && !a.has(f.field)) && c(g, "Outcome references a missing answer or variable.");
  };
  (t.outcomes ?? []).forEach((f, g) => {
    t.endings.some((m) => m.id === f.endingId) || c(`/outcomes/${g}`, "Outcome references a missing ending."), u(f.if, `/outcomes/${g}/if`);
  });
  const d = /* @__PURE__ */ new Set();
  return (t.experiments ?? []).forEach((f, g) => {
    d.has(f.id) && c(`/experiments/${g}`, "Experiment IDs must be unique."), d.add(f.id);
    const m = /* @__PURE__ */ new Set();
    f.variants.forEach((h, w) => {
      const k = `/experiments/${g}/variants/${w}`;
      `${f.id}:${h.id}`.length > 64 && c(k, "Combined experiment and variant identifier must fit 64 ASCII characters."), m.has(h.id) && c(k, "Variant IDs must be unique."), m.add(h.id);
      const y = /* @__PURE__ */ new Set();
      for (const M of h.copy ?? [])
        (!t.steps.some((p) => p.id === M.stepId) || y.has(M.stepId)) && c(k, "Copy references must be unique existing steps."), y.add(M.stepId);
      if (h.stepOrder) {
        const M = /* @__PURE__ */ new Set(["hidden", "summary", "calculated"]), p = new Set(t.steps.flatMap((C) => [...C.logic ?? [], ...(C.options ?? []).flatMap((v) => v.logic ?? [])].filter((v) => v.then.action === "jump").map((v) => "to" in v.then ? v.then.to : "")));
        t.steps.forEach((C, v) => {
          if (C.logic?.length || C.options?.some((b) => b.logic?.length) || C.hiddenByDefault || M.has(C.type) || p.has(C.id)) {
            h.stepOrder[v] !== C.id && c(k, "Order variants must keep branching, hidden, summary and calculated steps fixed.");
            const b = new Set(t.steps.slice(0, v).map((B) => B.id));
            h.stepOrder.slice(0, v).some((B) => !b.has(B)) && c(k, "Order variants cannot cross a dependency boundary.");
          }
        });
        try {
          Yn(t, h);
        } catch {
          c(k, "Step order must be an exact permutation of all steps.");
        }
      }
    });
  }), s;
}
const Wn = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "campaign", "tracking", "cff_locale", "cff_theme"], Qn = "Cookie sources are restricted to supported attribution/preference cookies.";
function Xn(t) {
  return Wn.some((s) => s === t);
}
function Zn(t) {
  const s = [], o = (p, C, v) => {
    s.push(Ut(p, C, v));
  };
  if (!Array.isArray(t.steps) || !t.steps.length || t.steps.length > 500 || !Array.isArray(t.endings) || !t.endings.length)
    return o("", "invalid_schema", "The schema needs 1–500 steps and an ending."), s;
  const i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), c = new Map((t.variables ?? []).map((p) => [p.key, p.type])), u = /* @__PURE__ */ new Set();
  (t.variables ?? []).forEach((p, C) => {
    u.has(p.key) && o(`/variables/${C}/key`, "duplicate_key", "Variable keys must be unique."), u.add(p.key), (p.type === "number" ? !Q(p.default) : typeof p.default !== p.type) && o(`/variables/${C}/default`, "invalid_variable", "The variable default has an invalid type.");
  });
  const d = new Set(t.endings.map((p) => p.id)), f = (p, C) => {
    i.has(p) && o(C, "duplicate_id", "IDs must be globally unique."), i.add(p);
  };
  t.steps.forEach((p, C) => {
    p.type === "hidden" && p.settings?.source === "cookie" && !Xn(p.settings.sourceKey ?? p.key) && o(`/steps/${C}/settings/sourceKey`, "restricted_cookie", Qn), r.has(p.key) && o(`/steps/${C}/key`, "duplicate_key", "Field keys must be unique."), r.set(p.key, C), a.set(p.id, C), f(p.id, `/steps/${C}/id`);
    const v = /* @__PURE__ */ new Set();
    (p.options ?? []).forEach((b, B) => {
      f(b.id, `/steps/${C}/options/${B}/id`), v.has(b.value) && o(`/steps/${C}/options/${B}/value`, "duplicate_value", "Option values must be unique."), v.add(b.value);
    });
  }), t.endings.forEach((p, C) => {
    f(p.id, `/endings/${C}/id`), (p.buttons ?? []).forEach((v, b) => f(v.id, `/endings/${C}/buttons/${b}/id`));
  }), (t.groups ?? []).forEach((p, C) => {
    f(p.id, `/groups/${C}/id`), p.stepIds.forEach((v, b) => {
      a.has(v) || o(`/groups/${C}/stepIds/${b}`, "missing_reference", "The referenced step does not exist.");
    });
  });
  const g = (p, C, v, b = 0) => {
    if (b > 64) {
      o(C, "condition_depth", "Conditions may nest at most 64 levels.");
      return;
    }
    if ("all" in p || "any" in p) {
      const j = "all" in p ? "all" : "any";
      ("all" in p ? p.all : p.any).forEach((N, T) => g(N, `${C}/${j}/${T}`, v, b + 1));
      return;
    }
    const B = p.source ?? "answer";
    B === "answer" ? r.has(p.field) ? r.get(p.field) > v && o(C + "/field", "later_reference", "This condition references a later answer.") : o(C + "/field", "missing_reference", "The referenced answer does not exist.") : B === "variable" && !c.has(p.field) && o(C + "/field", "missing_reference", "The referenced variable does not exist."), p.op === "matches" && !rt(p.value) && o(C + "/value", "invalid_pattern", "The validation pattern is not supported.");
  }, m = (p, C) => {
    if (p.action === "set_variable") {
      const v = c.get(p.key);
      v ? (p.value !== null && typeof p.value !== v || p.operation !== "set" && (v !== "number" || typeof p.value != "number")) && o(C, "invalid_variable", "The variable action has an invalid type.") : o(C + "/key", "missing_reference", "The referenced variable does not exist.");
    } else (p.action === "end" ? d : a).has(p.to) || o(C + "/to", "missing_reference", "The navigation or visibility target does not exist.");
  }, h = /* @__PURE__ */ new Map(), w = t.steps.flatMap((p) => [...p.logic ?? [], ...(p.options ?? []).flatMap((C) => C.logic ?? [])]), k = /* @__PURE__ */ new Set([...t.steps.filter((p) => p.hiddenByDefault).map((p) => p.id), ...w.filter((p) => p.then.action === "hide").map((p) => p.then.to)]);
  t.steps.forEach((p, C) => {
    const v = `/steps/${C}`;
    an(p.type) || o(v + "/type", "unsupported_type", "This field type is not supported."), p.validation?.pattern !== void 0 && !rt(p.validation.pattern) && o(v + "/validation/pattern", "invalid_pattern", "The validation pattern is not supported."), p.validation?.mxCheck && o(v + "/validation/mxCheck", "unsupported_validation", "MX checking is not enabled."), ["single_choice", "multi_choice"].includes(p.type) && !p.options?.length && o(v + "/options", "missing_options", "Choice fields need at least one option."), [...p.logic ?? [], ...(p.options ?? []).flatMap((S) => S.logic ?? [])].forEach((S) => {
      if (S.then.action === "jump") {
        const N = h.get(p.id) ?? /* @__PURE__ */ new Set();
        N.add(S.then.to), h.set(p.id, N);
      }
    });
    const B = (S, N) => {
      S.length > 100 && o(N, "invalid_schema", "A field may have at most 100 rules."), S.forEach((T, A) => {
        g(T.if, `${N}/${A}/if`, C), m(T.then, `${N}/${A}/then`);
      });
    };
    B(p.logic ?? [], v + "/logic"), (p.options ?? []).forEach((S, N) => B(S.logic ?? [], `${v}/options/${N}/logic`)), p.options && p.options.length > 200 && o(v + "/options", "invalid_schema", "A field may have at most 200 options.");
    const j = p.validation ?? {};
    if (["rating", "scale", "nps"].includes(p.type) && (j.min !== void 0 || j.max !== void 0 || j.step !== void 0) && o(v + "/validation", "unsupported_validation", "Score fields use a fixed numeric range."), p.type === "slider") {
      const S = j.min ?? 0, N = j.max ?? 100, T = j.step ?? 1;
      (!Q(S) || !Q(N) || !Q(T) || Math.abs(Number(S)) > 1e4 || Math.abs(Number(N)) > 1e4 || Number(S) >= Number(N) || Number(T) <= 0 || Number(T) > Number(N) - Number(S)) && o(v + "/validation", "invalid_range", "Slider bounds and increment must form a valid finite range.");
    }
    for (const [S, N] of [[j.minLength, j.maxLength], [j.minSelections, j.maxSelections], [j.min, j.max]])
      S !== void 0 && N !== void 0 && typeof S == typeof N && S > N && o(v + "/validation", "invalid_range", "Minimum must not exceed maximum.");
    if (j.step !== void 0 && (!Q(j.step) || j.step <= 0) && o(v + "/validation/step", "invalid_range", "The numeric increment must be positive."), p.type !== "single_choice" && p.options?.some((S) => S.isOther) && o(v + "/options", "unsupported_other", "Other free text is only supported for single-choice fields."), t.steps[C + 1] && (k.has(p.id) || !p.logic?.some((S) => ["jump", "end"].includes(S.then.action) && "all" in S.if && !S.if.all.length))) {
      const S = h.get(p.id) ?? /* @__PURE__ */ new Set();
      S.add(t.steps[C + 1].id), h.set(p.id, S);
    }
  }), t.steps.forEach((p, C) => {
    if (s.some((B) => B.code === "duplicate_id")) return;
    const v = [...h.get(p.id) ?? []], b = /* @__PURE__ */ new Set();
    for (; v.length; ) {
      const B = v.shift();
      if (B === p.id) {
        o(`/steps/${C}/logic`, "potential_loop", "Navigation rules may revisit this step.");
        break;
      }
      b.has(B) || (b.add(B), v.push(...h.get(B) ?? []));
    }
  });
  const y = /* @__PURE__ */ new Set(), M = [0];
  for (; M.length; ) {
    const p = M.shift();
    if (y.has(p) || !t.steps[p]) continue;
    y.add(p);
    const C = t.steps[p];
    let v = !0;
    for (const b of C.logic ?? []) {
      if (b.then.action === "jump") {
        const B = a.get(b.then.to);
        B !== void 0 && M.push(B);
      }
      if ((b.then.action === "jump" || b.then.action === "end") && "all" in b.if && !b.if.all.length) {
        v = !1;
        break;
      }
    }
    for (const b of C.options ?? []) for (const B of b.logic ?? []) if (B.then.action === "jump") {
      const j = a.get(B.then.to);
      j !== void 0 && M.push(j);
    }
    (v || k.has(C.id)) && M.push(p + 1);
  }
  return t.steps.forEach((p, C) => {
    y.has(C) || o(`/steps/${C}`, "unreachable_step", "No possible navigation path reaches this step.");
  }), [...s, ...Gn(t)];
}
function ea({ form: t, onChange: s, onOpenStep: o }) {
  const { schema: i } = t, r = P.useMemo(() => Zn(i), [i]), a = (f) => s({ ...t, schema: { ...i, ...f } }), c = i.variables ?? [], u = i.outcomes ?? [], d = i.steps.flatMap((f) => [
    ...(f.logic ?? []).map((g) => ({ step: f, rule: g, option: "" })),
    ...(f.options ?? []).flatMap((g) => (g.logic ?? []).map((m) => ({ step: f, rule: m, option: g.label })))
  ]);
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
    r.length > 0 && /* @__PURE__ */ e.jsxs(l.Card, { className: "cf:border-amber-500/50", children: [
      /* @__PURE__ */ e.jsx(l.CardHeader, { children: /* @__PURE__ */ e.jsx(l.CardTitle, { children: R(n("%d problems to check"), r.length) }) }),
      /* @__PURE__ */ e.jsx(l.CardContent, { children: /* @__PURE__ */ e.jsx("ul", { className: "cf:flex cf:flex-col cf:gap-1 cf:text-sm", children: r.slice(0, 20).map((f, g) => {
        const m = /^\/steps\/(\d+)/.exec(f.path ?? ""), h = m ? i.steps[Number(m[1])] : void 0;
        return /* @__PURE__ */ e.jsxs("li", { children: [
          h ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "cf:underline cf:underline-offset-4", onClick: () => o(h.id), children: h.label || h.key }) : null,
          h ? ": " : "",
          f.message
        ] }, g);
      }) }) })
    ] }),
    /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Rules") }),
        /* @__PURE__ */ e.jsx(l.CardDescription, { children: n("Each question’s rules run after it is answered. Edit them on the question, under Rules.") })
      ] }),
      /* @__PURE__ */ e.jsx(l.CardContent, { children: d.length ? /* @__PURE__ */ e.jsx("ul", { className: "cf:flex cf:flex-col cf:gap-2 cf:text-sm", children: d.map(({ step: f, rule: g, option: m }, h) => /* @__PURE__ */ e.jsxs("li", { className: "cf:flex cf:flex-wrap cf:items-baseline cf:gap-x-2", children: [
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "cf:font-medium cf:underline-offset-4 cf:hover:underline", onClick: () => o(f.id), children: f.label || f.key }),
        m && /* @__PURE__ */ e.jsx(l.Badge, { variant: "outline", children: m }),
        /* @__PURE__ */ e.jsxs("span", { className: "cf:text-muted-foreground", children: [
          n("if"),
          " ",
          Ge(g.if, i),
          ": ",
          En(g.then, i)
        ] })
      ] }, h)) }) : /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: n("No rules yet: every visitor gets the questions in order.") }) })
    ] }),
    /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Variables") }),
        /* @__PURE__ */ e.jsx(l.CardDescription, { children: n("Values rules can set and add to (a score, a tag), usable in conditions, formulas and messages as {{variable.key}}.") })
      ] }),
      /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:flex-col cf:gap-3", children: [
        c.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:items-end cf:gap-2 cf:sm:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)_auto]", children: [
          /* @__PURE__ */ e.jsx(
            Xe,
            {
              label: n("Key"),
              value: f.key,
              validate: (g) => /^[a-z][a-z0-9_]{0,63}$/.test(g) ? c.some((m) => m !== f && m.key === g) ? n("Already used.") : "" : n("Lowercase letters, numbers and underscores."),
              onCommit: (g) => s(on(t, f.key, g))
            }
          ),
          /* @__PURE__ */ e.jsxs(l.Select, { value: f.type, onValueChange: (g) => a({ variables: c.map((m) => m === f ? { ...m, type: g, default: g === "number" ? 0 : g === "boolean" ? !1 : "" } : m) }), children: [
            /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Type"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(l.SelectItem, { value: "number", children: n("Number") }),
              /* @__PURE__ */ e.jsx(l.SelectItem, { value: "string", children: n("Text") }),
              /* @__PURE__ */ e.jsx(l.SelectItem, { value: "boolean", children: n("Yes / No") })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx(
            l.Input,
            {
              "aria-label": n("Starting value"),
              value: String(f.default ?? ""),
              onChange: (g) => a({
                variables: c.map((m) => m === f ? {
                  ...m,
                  default: f.type === "number" ? Number(g.target.value) || 0 : f.type === "boolean" ? g.target.value === "true" : g.target.value
                } : m)
              })
            }
          ),
          /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", "aria-label": R(n("Remove %s"), f.key), onClick: () => s(cn(t, f.key)), children: /* @__PURE__ */ e.jsx(V, {}) })
        ] }, f.key)),
        /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: c.length >= 50, onClick: () => {
          let f = c.length + 1;
          for (; c.some((g) => g.key === `score_${f}`); ) f++;
          a({ variables: [...c, { key: c.length ? `score_${f}` : "score", type: "number", default: 0 }] });
        }, children: [
          /* @__PURE__ */ e.jsx($, {}),
          " ",
          n("Add variable")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Outcomes") }),
        /* @__PURE__ */ e.jsx(l.CardDescription, { children: n("Choose the ending by the answers: the first outcome whose conditions match wins; otherwise the default ending is used.") })
      ] }),
      /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:flex-col cf:gap-3", children: [
        u.map((f, g) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2 cf:rounded-md cf:border cf:p-3", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between cf:gap-2", children: [
            /* @__PURE__ */ e.jsx("span", { className: "cf:text-sm cf:font-medium", children: n("End with") }),
            /* @__PURE__ */ e.jsxs(l.Select, { value: f.endingId, onValueChange: (m) => a({ outcomes: u.map((h, w) => w === g ? { ...h, endingId: m } : h) }), children: [
              /* @__PURE__ */ e.jsx(l.SelectTrigger, { className: "cf:max-w-xs", "aria-label": n("Ending"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
              /* @__PURE__ */ e.jsx(l.SelectContent, { children: i.endings.map((m, h) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: m.id, children: de(m, h) }, m.id)) })
            ] }),
            /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", "aria-label": n("Remove outcome"), onClick: () => a({ outcomes: u.filter((m, h) => h !== g) }), children: /* @__PURE__ */ e.jsx(V, {}) })
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "cf:text-sm cf:font-medium", children: n("when") }),
          /* @__PURE__ */ e.jsx(ue, { schema: i, value: f.if, onChange: (m) => a({ outcomes: u.map((h, w) => w === g ? { ...h, if: m } : h) }) })
        ] }, g)),
        /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: u.length >= 50, onClick: () => a({
          outcomes: [...u, { if: { all: [ee(i)] }, endingId: i.endings[0].id }]
        }), children: [
          /* @__PURE__ */ e.jsx($, {}),
          " ",
          n("Add outcome")
        ] })
      ] })
    ] })
  ] });
}
const ta = 20, ve = (t) => t.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 15);
function na({ api: t, form: s, onChange: o, save: i }) {
  const r = s.settings.notifications ?? {}, a = (y) => o({ ...s, settings: { ...s.settings, notifications: y } }), c = (y, M) => a({ ...r, [y]: M }), u = s.schema.steps.filter((y) => y.type === "email"), [d, f] = P.useState(null), [g, m] = P.useState(null), h = (y) => c(y, [...r[y] ?? [], y === "admin" ? { id: ze("mail"), enabled: !0, to: [], subject: n("New submission"), body: "{{all_answers}}" } : { id: ze("reply"), enabled: !0, emailField: u[0]?.key, subject: n("Thank you for your submission"), body: "{{all_answers}}" }]), w = async (y) => {
    try {
      const M = await i();
      f(await t.request("admin/notifications/preview", "POST", { formId: M.id, notificationId: y.id, answers: {} }));
    } catch (M) {
      l.toast.error(W(M));
    }
  }, k = (y, M, p) => {
    const C = r[y] ?? [], v = (b) => c(y, C.map((B) => B.id === b.id ? b : B));
    return /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { children: M }),
        /* @__PURE__ */ e.jsx(l.CardDescription, { children: p })
      ] }),
      /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
        C.map((b, B) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3 cf:rounded-md cf:border cf:p-4", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between cf:gap-2", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:gap-2", children: [
              /* @__PURE__ */ e.jsx(l.Switch, { checked: b.enabled, "aria-label": n("Enabled"), onCheckedChange: (j) => v({ ...b, enabled: j }) }),
              /* @__PURE__ */ e.jsx("span", { className: "cf:font-medium", children: b.subject || R(n("Email %d"), B + 1) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-1", children: [
              /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => {
                w(b);
              }, children: [
                /* @__PURE__ */ e.jsx(yn, {}),
                " ",
                n("Preview")
              ] }),
              /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => m(b), children: [
                /* @__PURE__ */ e.jsx(wn, {}),
                " ",
                n("Send a test")
              ] }),
              /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", className: "cf:size-8", "aria-label": n("Remove email"), onClick: () => c(y, C.filter((j) => j.id !== b.id)), children: /* @__PURE__ */ e.jsx(V, {}) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-3 cf:sm:grid-cols-3", children: [
            y === "admin" ? /* @__PURE__ */ e.jsx(z, { label: n("To"), value: (b.to ?? []).join(", "), placeholder: "team@example.com", onChange: (j) => v({ ...b, to: ve(j) }) }) : /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
              /* @__PURE__ */ e.jsx(l.Label, { children: n("Send to the address in") }),
              /* @__PURE__ */ e.jsxs(l.Select, { value: b.emailField ?? "", onValueChange: (j) => v({ ...b, emailField: j }), children: [
                /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Email question"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Choose an email question") }) }),
                /* @__PURE__ */ e.jsx(l.SelectContent, { children: u.map((j) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: j.key, children: j.label || j.key }, j.id)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(z, { label: n("Cc"), value: (b.cc ?? []).join(", "), onChange: (j) => v({ ...b, cc: ve(j) }) }),
            /* @__PURE__ */ e.jsx(z, { label: n("Bcc"), value: (b.bcc ?? []).join(", "), onChange: (j) => v({ ...b, bcc: ve(j) }) })
          ] }),
          /* @__PURE__ */ e.jsx(z, { label: n("Subject"), value: b.subject, onChange: (j) => v({ ...b, subject: j }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
            /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-body-${b.id}`, children: n("Message") }),
            /* @__PURE__ */ e.jsx(l.Textarea, { id: `cf-body-${b.id}`, rows: 6, value: b.body, onChange: (j) => v({ ...b, body: j.target.value }) }),
            /* @__PURE__ */ e.jsxs("p", { className: "cf:text-xs cf:text-muted-foreground", children: [
              n("Merge tags: {{all_answers}}, {{field_key}}, {{form_title}}, {{submission_id}}, {{site_name}}, {{date}}"),
              y === "admin" ? ", {{admin_link}}, {{meta_table}}" : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-3 cf:sm:grid-cols-3", children: [
            /* @__PURE__ */ e.jsx(z, { label: n("Reply-to"), value: b.replyTo ?? "", onChange: (j) => v({ ...b, replyTo: j }) }),
            /* @__PURE__ */ e.jsx(z, { label: n("From name"), value: b.fromName ?? "", placeholder: n("Site default"), onChange: (j) => v({ ...b, fromName: j }) }),
            /* @__PURE__ */ e.jsx(
              z,
              {
                label: n("Delay (seconds)"),
                value: b.delaySeconds ? String(b.delaySeconds) : "",
                placeholder: "0",
                onChange: (j) => v({ ...b, delaySeconds: Math.max(0, Math.min(86400, Number(j) || 0)) })
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
            /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-conditions-${b.id}`, children: n("Only when the answers match") }),
            /* @__PURE__ */ e.jsx(
              l.Switch,
              {
                id: `cf-conditions-${b.id}`,
                checked: !!b.conditions,
                onCheckedChange: (j) => v(j ? { ...b, conditions: { all: [ee(s.schema)] } } : (({ conditions: S, ...N }) => N)(b))
              }
            )
          ] }),
          b.conditions && /* @__PURE__ */ e.jsx(ue, { schema: s.schema, value: b.conditions, onChange: (j) => v({ ...b, conditions: j }) })
        ] }, b.id)),
        /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: C.length >= ta, onClick: () => h(y), children: [
          /* @__PURE__ */ e.jsx($, {}),
          " ",
          y === "admin" ? n("Add admin email") : n("Add autoresponder")
        ] })
      ] })
    ] });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
    k("admin", n("Admin notifications"), n("Sent to you or your team when someone submits.")),
    /* @__PURE__ */ e.jsx(l.Card, { children: /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:items-center cf:justify-between cf:gap-4 cf:pt-6", children: [
      /* @__PURE__ */ e.jsx(l.Label, { htmlFor: "cf-notify-abandoned", children: n("Also notify when a visitor leaves contact details but does not finish") }),
      /* @__PURE__ */ e.jsx(l.Switch, { id: "cf-notify-abandoned", checked: !!r.notifyAbandoned, onCheckedChange: (y) => a({ ...r, notifyAbandoned: y }) })
    ] }) }),
    k("autoresponders", n("Autoresponders"), n("Sent to the visitor, at the email address they typed.")),
    /* @__PURE__ */ e.jsx(l.Card, { children: /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:items-center cf:justify-between cf:gap-4 cf:pt-6", children: [
      /* @__PURE__ */ e.jsx(l.Label, { htmlFor: "cf-first-match", children: n("Send only the first autoresponder that matches") }),
      /* @__PURE__ */ e.jsx(l.Switch, { id: "cf-first-match", checked: !!r.firstMatchOnly, onCheckedChange: (y) => a({ ...r, firstMatchOnly: y }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(l.Dialog, { open: d !== null, onOpenChange: (y) => !y && f(null), children: /* @__PURE__ */ e.jsxs(l.DialogContent, { className: "cf:max-w-3xl", children: [
      /* @__PURE__ */ e.jsxs(l.DialogHeader, { children: [
        /* @__PURE__ */ e.jsx(l.DialogTitle, { children: d?.subject }),
        /* @__PURE__ */ e.jsx(l.DialogDescription, { children: n("With sample answers. Links and buttons are not clickable here.") })
      ] }),
      /* @__PURE__ */ e.jsx("iframe", { title: n("Email preview"), sandbox: "", srcDoc: d?.html ?? "", className: "cf:h-[60vh] cf:w-full cf:rounded-md cf:border cf:bg-white" }),
      /* @__PURE__ */ e.jsx(l.DialogFooter, { children: /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", onClick: () => f(null), children: n("Close") }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(aa, { api: t, form: s, notification: g, onClose: () => m(null) })
  ] });
}
function z({ label: t, value: s, placeholder: o, onChange: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(l.Label, { children: t }),
    /* @__PURE__ */ e.jsx(l.Input, { "aria-label": t, value: s, placeholder: o, onChange: (r) => i(r.target.value) })
  ] });
}
function aa({ api: t, form: s, notification: o, onClose: i }) {
  const [r, a] = P.useState(""), [c, u] = P.useState(!1), d = async () => {
    u(!0);
    try {
      await t.request("admin/notifications/test", "POST", { formId: s.id, notificationId: o.id, to: r }), l.toast.success(R(n("Test email queued to %s."), r)), i();
    } catch (f) {
      l.toast.error(W(f));
    } finally {
      u(!1);
    }
  };
  return /* @__PURE__ */ e.jsx(l.Dialog, { open: o !== null, onOpenChange: (f) => !f && i(), children: /* @__PURE__ */ e.jsxs(l.DialogContent, { children: [
    /* @__PURE__ */ e.jsxs(l.DialogHeader, { children: [
      /* @__PURE__ */ e.jsx(l.DialogTitle, { children: n("Send a test email") }),
      /* @__PURE__ */ e.jsx(l.DialogDescription, { children: n("Uses the published version of this email, with sample answers. Publish first to test your latest changes.") })
    ] }),
    /* @__PURE__ */ e.jsx(l.Input, { type: "email", "aria-label": n("Send the test to"), placeholder: "you@example.com", value: r, onChange: (f) => a(f.target.value) }),
    /* @__PURE__ */ e.jsxs(l.DialogFooter, { children: [
      /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", onClick: i, children: n("Cancel") }),
      /* @__PURE__ */ e.jsx(l.Button, { disabled: c || !r.includes("@") || s.version < 1, onClick: () => {
        d();
      }, children: n("Send test") })
    ] })
  ] }) });
}
const X = (t) => typeof t == "boolean" ? t : void 0;
function sa(t = {}) {
  const s = n("Look"), o = n("Colours"), i = n("Text"), r = n("Bot"), a = n("Extras"), c = n("Where it shows"), u = n("Sessions and resume"), d = n("Limits"), f = n("Privacy and retention"), g = n("Spam protection"), m = (k, y) => ({ path: `settings.appearance.${k}`, label: y, kind: "color", group: "design", heading: o }), h = t.privacy ?? {}, w = t.spam ?? {};
  return [
    {
      path: "settings.appearance.style",
      label: n("Style"),
      kind: "select",
      group: "design",
      heading: s,
      fallback: "classic",
      options: () => [{ value: "classic", label: n("Classic: plain bubbles that blend into the page") }, { value: "messaging", label: n("Messaging: wallpaper, bubble tails, keyboard-style answers") }]
    },
    {
      path: "settings.appearance.theme",
      label: n("Light or dark"),
      kind: "select",
      group: "design",
      heading: s,
      inherited: () => t.appearance?.theme,
      options: () => [{ value: "light", label: n("Light") }, { value: "dark", label: n("Dark") }, { value: "auto", label: n("Follow the visitor’s device") }]
    },
    { path: "settings.appearance.radius", label: n("Corner radius (px)"), kind: "number", group: "design", heading: s, min: 0, max: 32, fallback: 12 },
    { path: "settings.appearance.width", label: n("Chat width (px)"), kind: "number", group: "design", heading: s, min: 320, max: 1200, fallback: 720 },
    {
      path: "settings.appearance.wallpaper",
      label: n("Wallpaper (messaging style)"),
      kind: "select",
      group: "design",
      heading: s,
      fallback: "none",
      options: () => [{ value: "none", label: n("None") }, { value: "doodle", label: n("Doodle") }, { value: "dots", label: n("Dots") }, { value: "gradient", label: n("Gradient") }]
    },
    {
      path: "settings.appearance.choiceStyle",
      label: n("Answer buttons"),
      kind: "select",
      group: "design",
      heading: s,
      fallback: "chips",
      options: () => [{ value: "chips", label: n("Chips") }, { value: "keyboard", label: n("Keyboard") }]
    },
    { path: "settings.appearance.bubbleTails", label: n("Bubble tails"), kind: "toggle", group: "design", heading: s, fallback: !0 },
    m("primary", n("Accent (buttons, links)")),
    m("botBubbleBackground", n("Bot bubble")),
    m("textColor", n("Bot text")),
    m("userBubbleBackground", n("Visitor bubble")),
    m("userTextColor", n("Visitor text")),
    m("headerBackground", n("Header")),
    m("headerText", n("Header text")),
    m("chatBackground", n("Chat background")),
    {
      path: "settings.appearance.googleFont",
      label: n("Font"),
      kind: "select",
      group: "design",
      heading: i,
      fallback: "system",
      options: () => [{ value: "system", label: n("Device default (no external requests)") }, { value: "Inter", label: "Inter" }, { value: "Roboto", label: "Roboto" }, { value: "Open Sans", label: "Open Sans" }],
      help: () => n("Inter, Roboto and Open Sans load from Google Fonts in the visitor’s browser.")
    },
    { path: "settings.appearance.inheritFont", label: n("Use the page’s font instead"), kind: "toggle", group: "design", heading: i, fallback: !1 },
    { path: "settings.appearance.font", label: n("Custom font stack (CSS font-family)"), kind: "text", group: "design", heading: i },
    { path: "schema.bot.name", label: n("Bot name"), kind: "text", group: "design", heading: r },
    {
      path: "schema.bot.typingSpeed",
      label: n("Typing speed"),
      kind: "select",
      group: "design",
      heading: r,
      fallback: "normal",
      options: () => [{ value: "off", label: n("Off (instant)") }, { value: "fast", label: n("Fast") }, { value: "normal", label: n("Normal") }, { value: "slow", label: n("Slow") }]
    },
    { path: "settings.appearance.confetti", label: n("Confetti when the form is completed"), kind: "toggle", group: "design", heading: a, fallback: !1 },
    { path: "settings.appearance.customCss", label: n("Custom CSS (only inside this form)"), kind: "textarea", group: "design", heading: a },
    {
      path: "settings.display.mode",
      label: n("Display mode"),
      kind: "select",
      group: "general",
      heading: c,
      fallback: "inline",
      options: () => [
        { value: "inline", label: n("Inside the page content") },
        { value: "fullpage", label: n("Its own full page") },
        { value: "launcher", label: n("Floating chat button") },
        { value: "popup", label: n("Pop-up") }
      ],
      help: () => n("How the embed code shows the form. The share link always opens it on its own page.")
    },
    {
      path: "settings.display.launcher.position",
      label: n("Button position"),
      kind: "select",
      group: "general",
      heading: c,
      fallback: "right",
      options: () => [{ value: "right", label: n("Bottom right") }, { value: "left", label: n("Bottom left") }]
    },
    { path: "settings.display.launcher.autoOpenSeconds", label: n("Open by itself after (seconds)"), kind: "number", group: "general", heading: c, min: 0, max: 3600 },
    { path: "settings.display.launcher.scrollPercent", label: n("…or after scrolling (% of the page)"), kind: "number", group: "general", heading: c, min: 0, max: 100 },
    {
      path: "settings.language",
      label: n("Language of built-in texts"),
      kind: "select",
      group: "general",
      heading: c,
      fallback: "site",
      options: () => [{ value: "site", label: n("The site’s language") }, { value: "en", label: "English" }, { value: "id", label: "Bahasa Indonesia" }]
    },
    { path: "settings.sessions.savePartial", label: n("Save answers before the form is finished"), kind: "toggle", group: "general", heading: u, fallback: !0 },
    { path: "settings.sessions.resumeEnabled", label: n("Let visitors continue where they left off"), kind: "toggle", group: "general", heading: u, fallback: !0 },
    { path: "settings.sessions.resumePrompt", label: n("Ask before continuing"), kind: "toggle", group: "general", heading: u, fallback: !0 },
    { path: "settings.sessions.resumeDays", label: n("Keep a conversation resumable for (days)"), kind: "number", group: "general", heading: u, min: 1, max: 365, fallback: 30 },
    { path: "settings.sessions.abandonDays", label: n("Mark unfinished as abandoned after (days)"), kind: "number", group: "general", heading: u, min: 1, max: 365, fallback: 30 },
    { path: "settings.sessions.deletePartialOnRestart", label: n("Delete the unfinished answers when a visitor starts over"), kind: "toggle", group: "general", heading: u, fallback: !1 },
    { path: "settings.sessions.storageNotice", label: n("Tell visitors their answers are kept on their device"), kind: "toggle", group: "general", heading: u, fallback: !1 },
    { path: "settings.limits.total", label: n("Close after this many submissions"), kind: "number", group: "general", heading: d, min: 1 },
    { path: "settings.limits.closesAt", label: n("Close on"), kind: "date", group: "general", heading: d },
    { path: "settings.privacy.storeMeta", label: n("Store tracking details (page, referrer, UTM)"), kind: "toggle", group: "privacy", heading: f, inherited: () => X(h.storeMeta) },
    {
      path: "settings.privacy.ipMode",
      label: n("IP addresses"),
      kind: "select",
      group: "privacy",
      heading: f,
      inherited: () => h.ipMode,
      options: () => [{ value: "full", label: n("Store in full") }, { value: "anonymized", label: n("Store anonymized") }, { value: "none", label: n("Do not store") }]
    },
    { path: "settings.privacy.storeUserAgent", label: n("Store browser and device"), kind: "toggle", group: "privacy", heading: f, inherited: () => X(h.storeUserAgent) },
    { path: "settings.privacy.respectDnt", label: n("Respect Do Not Track"), kind: "toggle", group: "privacy", heading: f, inherited: () => X(h.respectDnt) },
    { path: "settings.privacy.retentionEnabled", label: n("Delete old submissions automatically"), kind: "toggle", group: "privacy", heading: f, inherited: () => X(h.retentionEnabled) },
    { path: "settings.privacy.retentionDays", label: n("Keep submissions for (days)"), kind: "number", group: "privacy", heading: f, min: 1, max: 36500, inherited: () => h.retentionDays },
    { path: "settings.privacy.partialRetentionDays", label: n("Keep partial and abandoned ones for (days)"), kind: "number", group: "privacy", heading: f, min: 1, max: 36500, inherited: () => h.partialRetentionDays ?? void 0 },
    { path: "settings.spam.honeypotEnabled", label: n("Hidden honeypot field"), kind: "toggle", group: "spam", heading: g, inherited: () => X(w.honeypotEnabled) },
    { path: "settings.spam.minSeconds", label: n("Minimum seconds to answer"), kind: "number", group: "spam", heading: g, min: 0, max: 3600, inherited: () => w.minSeconds },
    { path: "settings.spam.rateLimit", label: n("Submissions per visitor IP per window"), kind: "number", group: "spam", heading: g, min: 1, max: 1e4, inherited: () => w.rateLimit },
    { path: "settings.spam.rateWindowSeconds", label: n("Rate window (seconds)"), kind: "number", group: "spam", heading: g, min: 1, max: 86400, inherited: () => w.rateWindowSeconds }
  ];
}
function ia(t, s) {
  const o = /* @__PURE__ */ new Map();
  for (const { group: i, heading: r, ...a } of sa(s))
    i === t && o.set(r, [...o.get(r) ?? [], { ...a, section: "content", types: "all" }]);
  return [...o].map(([i, r]) => ({ heading: i, settings: r }));
}
function dt({ form: t, group: s, defaults: o, onChange: i }) {
  return /* @__PURE__ */ e.jsx("div", { className: "cf:flex cf:flex-col cf:gap-4", children: ia(s, o).map(({ heading: r, settings: a }) => /* @__PURE__ */ e.jsxs(l.Card, { children: [
    /* @__PURE__ */ e.jsx(l.CardHeader, { children: /* @__PURE__ */ e.jsx(l.CardTitle, { children: r }) }),
    /* @__PURE__ */ e.jsx(l.CardContent, { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2", children: a.map((c) => /* @__PURE__ */ e.jsx(oe, { target: t, setting: c, onChange: i }, c.path)) })
  ] }, r)) });
}
var G = {}, ye, ut;
function ra() {
  return ut || (ut = 1, ye = function() {
    return typeof Promise == "function" && Promise.prototype && Promise.prototype.then;
  }), ye;
}
var je = {}, U = {}, ft;
function H() {
  if (ft) return U;
  ft = 1;
  let t;
  const s = [
    0,
    // Not used
    26,
    44,
    70,
    100,
    134,
    172,
    196,
    242,
    292,
    346,
    404,
    466,
    532,
    581,
    655,
    733,
    815,
    901,
    991,
    1085,
    1156,
    1258,
    1364,
    1474,
    1588,
    1706,
    1828,
    1921,
    2051,
    2185,
    2323,
    2465,
    2611,
    2761,
    2876,
    3034,
    3196,
    3362,
    3532,
    3706
  ];
  return U.getSymbolSize = function(i) {
    if (!i) throw new Error('"version" cannot be null or undefined');
    if (i < 1 || i > 40) throw new Error('"version" should be in range from 1 to 40');
    return i * 4 + 17;
  }, U.getSymbolTotalCodewords = function(i) {
    return s[i];
  }, U.getBCHDigit = function(o) {
    let i = 0;
    for (; o !== 0; )
      i++, o >>>= 1;
    return i;
  }, U.setToSJISFunction = function(i) {
    if (typeof i != "function")
      throw new Error('"toSJISFunc" is not a valid function.');
    t = i;
  }, U.isKanjiModeEnabled = function() {
    return typeof t < "u";
  }, U.toSJIS = function(i) {
    return t(i);
  }, U;
}
var we = {}, ht;
function et() {
  return ht || (ht = 1, (function(t) {
    t.L = { bit: 1 }, t.M = { bit: 0 }, t.Q = { bit: 3 }, t.H = { bit: 2 };
    function s(o) {
      if (typeof o != "string")
        throw new Error("Param is not a string");
      switch (o.toLowerCase()) {
        case "l":
        case "low":
          return t.L;
        case "m":
        case "medium":
          return t.M;
        case "q":
        case "quartile":
          return t.Q;
        case "h":
        case "high":
          return t.H;
        default:
          throw new Error("Unknown EC Level: " + o);
      }
    }
    t.isValid = function(i) {
      return i && typeof i.bit < "u" && i.bit >= 0 && i.bit < 4;
    }, t.from = function(i, r) {
      if (t.isValid(i))
        return i;
      try {
        return s(i);
      } catch {
        return r;
      }
    };
  })(we)), we;
}
var ke, gt;
function la() {
  if (gt) return ke;
  gt = 1;
  function t() {
    this.buffer = [], this.length = 0;
  }
  return t.prototype = {
    get: function(s) {
      const o = Math.floor(s / 8);
      return (this.buffer[o] >>> 7 - s % 8 & 1) === 1;
    },
    put: function(s, o) {
      for (let i = 0; i < o; i++)
        this.putBit((s >>> o - i - 1 & 1) === 1);
    },
    getLengthInBits: function() {
      return this.length;
    },
    putBit: function(s) {
      const o = Math.floor(this.length / 8);
      this.buffer.length <= o && this.buffer.push(0), s && (this.buffer[o] |= 128 >>> this.length % 8), this.length++;
    }
  }, ke = t, ke;
}
var Ce, mt;
function oa() {
  if (mt) return Ce;
  mt = 1;
  function t(s) {
    if (!s || s < 1)
      throw new Error("BitMatrix size must be defined and greater than 0");
    this.size = s, this.data = new Uint8Array(s * s), this.reservedBit = new Uint8Array(s * s);
  }
  return t.prototype.set = function(s, o, i, r) {
    const a = s * this.size + o;
    this.data[a] = i, r && (this.reservedBit[a] = !0);
  }, t.prototype.get = function(s, o) {
    return this.data[s * this.size + o];
  }, t.prototype.xor = function(s, o, i) {
    this.data[s * this.size + o] ^= i;
  }, t.prototype.isReserved = function(s, o) {
    return this.reservedBit[s * this.size + o];
  }, Ce = t, Ce;
}
var Se = {}, pt;
function ca() {
  return pt || (pt = 1, (function(t) {
    const s = H().getSymbolSize;
    t.getRowColCoords = function(i) {
      if (i === 1) return [];
      const r = Math.floor(i / 7) + 2, a = s(i), c = a === 145 ? 26 : Math.ceil((a - 13) / (2 * r - 2)) * 2, u = [a - 7];
      for (let d = 1; d < r - 1; d++)
        u[d] = u[d - 1] - c;
      return u.push(6), u.reverse();
    }, t.getPositions = function(i) {
      const r = [], a = t.getRowColCoords(i), c = a.length;
      for (let u = 0; u < c; u++)
        for (let d = 0; d < c; d++)
          u === 0 && d === 0 || // top-left
          u === 0 && d === c - 1 || // bottom-left
          u === c - 1 && d === 0 || r.push([a[u], a[d]]);
      return r;
    };
  })(Se)), Se;
}
var Ne = {}, bt;
function da() {
  if (bt) return Ne;
  bt = 1;
  const t = H().getSymbolSize, s = 7;
  return Ne.getPositions = function(i) {
    const r = t(i);
    return [
      // top-left
      [0, 0],
      // top-right
      [r - s, 0],
      // bottom-left
      [0, r - s]
    ];
  }, Ne;
}
var Te = {}, xt;
function ua() {
  return xt || (xt = 1, (function(t) {
    t.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    const s = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    t.isValid = function(r) {
      return r != null && r !== "" && !isNaN(r) && r >= 0 && r <= 7;
    }, t.from = function(r) {
      return t.isValid(r) ? parseInt(r, 10) : void 0;
    }, t.getPenaltyN1 = function(r) {
      const a = r.size;
      let c = 0, u = 0, d = 0, f = null, g = null;
      for (let m = 0; m < a; m++) {
        u = d = 0, f = g = null;
        for (let h = 0; h < a; h++) {
          let w = r.get(m, h);
          w === f ? u++ : (u >= 5 && (c += s.N1 + (u - 5)), f = w, u = 1), w = r.get(h, m), w === g ? d++ : (d >= 5 && (c += s.N1 + (d - 5)), g = w, d = 1);
        }
        u >= 5 && (c += s.N1 + (u - 5)), d >= 5 && (c += s.N1 + (d - 5));
      }
      return c;
    }, t.getPenaltyN2 = function(r) {
      const a = r.size;
      let c = 0;
      for (let u = 0; u < a - 1; u++)
        for (let d = 0; d < a - 1; d++) {
          const f = r.get(u, d) + r.get(u, d + 1) + r.get(u + 1, d) + r.get(u + 1, d + 1);
          (f === 4 || f === 0) && c++;
        }
      return c * s.N2;
    }, t.getPenaltyN3 = function(r) {
      const a = r.size;
      let c = 0, u = 0, d = 0;
      for (let f = 0; f < a; f++) {
        u = d = 0;
        for (let g = 0; g < a; g++)
          u = u << 1 & 2047 | r.get(f, g), g >= 10 && (u === 1488 || u === 93) && c++, d = d << 1 & 2047 | r.get(g, f), g >= 10 && (d === 1488 || d === 93) && c++;
      }
      return c * s.N3;
    }, t.getPenaltyN4 = function(r) {
      let a = 0;
      const c = r.data.length;
      for (let d = 0; d < c; d++) a += r.data[d];
      return Math.abs(Math.ceil(a * 100 / c / 5) - 10) * s.N4;
    };
    function o(i, r, a) {
      switch (i) {
        case t.Patterns.PATTERN000:
          return (r + a) % 2 === 0;
        case t.Patterns.PATTERN001:
          return r % 2 === 0;
        case t.Patterns.PATTERN010:
          return a % 3 === 0;
        case t.Patterns.PATTERN011:
          return (r + a) % 3 === 0;
        case t.Patterns.PATTERN100:
          return (Math.floor(r / 2) + Math.floor(a / 3)) % 2 === 0;
        case t.Patterns.PATTERN101:
          return r * a % 2 + r * a % 3 === 0;
        case t.Patterns.PATTERN110:
          return (r * a % 2 + r * a % 3) % 2 === 0;
        case t.Patterns.PATTERN111:
          return (r * a % 3 + (r + a) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + i);
      }
    }
    t.applyMask = function(r, a) {
      const c = a.size;
      for (let u = 0; u < c; u++)
        for (let d = 0; d < c; d++)
          a.isReserved(d, u) || a.xor(d, u, o(r, d, u));
    }, t.getBestMask = function(r, a) {
      const c = Object.keys(t.Patterns).length;
      let u = 0, d = 1 / 0;
      for (let f = 0; f < c; f++) {
        a(f), t.applyMask(f, r);
        const g = t.getPenaltyN1(r) + t.getPenaltyN2(r) + t.getPenaltyN3(r) + t.getPenaltyN4(r);
        t.applyMask(f, r), g < d && (d = g, u = f);
      }
      return u;
    };
  })(Te)), Te;
}
var ie = {}, vt;
function Wt() {
  if (vt) return ie;
  vt = 1;
  const t = et(), s = [
    // L  M  Q  H
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    1,
    2,
    2,
    4,
    1,
    2,
    4,
    4,
    2,
    4,
    4,
    4,
    2,
    4,
    6,
    5,
    2,
    4,
    6,
    6,
    2,
    5,
    8,
    8,
    4,
    5,
    8,
    8,
    4,
    5,
    8,
    11,
    4,
    8,
    10,
    11,
    4,
    9,
    12,
    16,
    4,
    9,
    16,
    16,
    6,
    10,
    12,
    18,
    6,
    10,
    17,
    16,
    6,
    11,
    16,
    19,
    6,
    13,
    18,
    21,
    7,
    14,
    21,
    25,
    8,
    16,
    20,
    25,
    8,
    17,
    23,
    25,
    9,
    17,
    23,
    34,
    9,
    18,
    25,
    30,
    10,
    20,
    27,
    32,
    12,
    21,
    29,
    35,
    12,
    23,
    34,
    37,
    12,
    25,
    34,
    40,
    13,
    26,
    35,
    42,
    14,
    28,
    38,
    45,
    15,
    29,
    40,
    48,
    16,
    31,
    43,
    51,
    17,
    33,
    45,
    54,
    18,
    35,
    48,
    57,
    19,
    37,
    51,
    60,
    19,
    38,
    53,
    63,
    20,
    40,
    56,
    66,
    21,
    43,
    59,
    70,
    22,
    45,
    62,
    74,
    24,
    47,
    65,
    77,
    25,
    49,
    68,
    81
  ], o = [
    // L  M  Q  H
    7,
    10,
    13,
    17,
    10,
    16,
    22,
    28,
    15,
    26,
    36,
    44,
    20,
    36,
    52,
    64,
    26,
    48,
    72,
    88,
    36,
    64,
    96,
    112,
    40,
    72,
    108,
    130,
    48,
    88,
    132,
    156,
    60,
    110,
    160,
    192,
    72,
    130,
    192,
    224,
    80,
    150,
    224,
    264,
    96,
    176,
    260,
    308,
    104,
    198,
    288,
    352,
    120,
    216,
    320,
    384,
    132,
    240,
    360,
    432,
    144,
    280,
    408,
    480,
    168,
    308,
    448,
    532,
    180,
    338,
    504,
    588,
    196,
    364,
    546,
    650,
    224,
    416,
    600,
    700,
    224,
    442,
    644,
    750,
    252,
    476,
    690,
    816,
    270,
    504,
    750,
    900,
    300,
    560,
    810,
    960,
    312,
    588,
    870,
    1050,
    336,
    644,
    952,
    1110,
    360,
    700,
    1020,
    1200,
    390,
    728,
    1050,
    1260,
    420,
    784,
    1140,
    1350,
    450,
    812,
    1200,
    1440,
    480,
    868,
    1290,
    1530,
    510,
    924,
    1350,
    1620,
    540,
    980,
    1440,
    1710,
    570,
    1036,
    1530,
    1800,
    570,
    1064,
    1590,
    1890,
    600,
    1120,
    1680,
    1980,
    630,
    1204,
    1770,
    2100,
    660,
    1260,
    1860,
    2220,
    720,
    1316,
    1950,
    2310,
    750,
    1372,
    2040,
    2430
  ];
  return ie.getBlocksCount = function(r, a) {
    switch (a) {
      case t.L:
        return s[(r - 1) * 4 + 0];
      case t.M:
        return s[(r - 1) * 4 + 1];
      case t.Q:
        return s[(r - 1) * 4 + 2];
      case t.H:
        return s[(r - 1) * 4 + 3];
      default:
        return;
    }
  }, ie.getTotalCodewordsCount = function(r, a) {
    switch (a) {
      case t.L:
        return o[(r - 1) * 4 + 0];
      case t.M:
        return o[(r - 1) * 4 + 1];
      case t.Q:
        return o[(r - 1) * 4 + 2];
      case t.H:
        return o[(r - 1) * 4 + 3];
      default:
        return;
    }
  }, ie;
}
var Ee = {}, Z = {}, yt;
function fa() {
  if (yt) return Z;
  yt = 1;
  const t = new Uint8Array(512), s = new Uint8Array(256);
  return (function() {
    let i = 1;
    for (let r = 0; r < 255; r++)
      t[r] = i, s[i] = r, i <<= 1, i & 256 && (i ^= 285);
    for (let r = 255; r < 512; r++)
      t[r] = t[r - 255];
  })(), Z.log = function(i) {
    if (i < 1) throw new Error("log(" + i + ")");
    return s[i];
  }, Z.exp = function(i) {
    return t[i];
  }, Z.mul = function(i, r) {
    return i === 0 || r === 0 ? 0 : t[s[i] + s[r]];
  }, Z;
}
var jt;
function ha() {
  return jt || (jt = 1, (function(t) {
    const s = fa();
    t.mul = function(i, r) {
      const a = new Uint8Array(i.length + r.length - 1);
      for (let c = 0; c < i.length; c++)
        for (let u = 0; u < r.length; u++)
          a[c + u] ^= s.mul(i[c], r[u]);
      return a;
    }, t.mod = function(i, r) {
      let a = new Uint8Array(i);
      for (; a.length - r.length >= 0; ) {
        const c = a[0];
        for (let d = 0; d < r.length; d++)
          a[d] ^= s.mul(r[d], c);
        let u = 0;
        for (; u < a.length && a[u] === 0; ) u++;
        a = a.slice(u);
      }
      return a;
    }, t.generateECPolynomial = function(i) {
      let r = new Uint8Array([1]);
      for (let a = 0; a < i; a++)
        r = t.mul(r, new Uint8Array([1, s.exp(a)]));
      return r;
    };
  })(Ee)), Ee;
}
var Be, wt;
function ga() {
  if (wt) return Be;
  wt = 1;
  const t = ha();
  function s(o) {
    this.genPoly = void 0, this.degree = o, this.degree && this.initialize(this.degree);
  }
  return s.prototype.initialize = function(i) {
    this.degree = i, this.genPoly = t.generateECPolynomial(this.degree);
  }, s.prototype.encode = function(i) {
    if (!this.genPoly)
      throw new Error("Encoder not initialized");
    const r = new Uint8Array(i.length + this.degree);
    r.set(i);
    const a = t.mod(r, this.genPoly), c = this.degree - a.length;
    if (c > 0) {
      const u = new Uint8Array(this.degree);
      return u.set(a, c), u;
    }
    return a;
  }, Be = s, Be;
}
var Ie = {}, Ae = {}, _e = {}, kt;
function Qt() {
  return kt || (kt = 1, _e.isValid = function(s) {
    return !isNaN(s) && s >= 1 && s <= 40;
  }), _e;
}
var D = {}, Ct;
function Xt() {
  if (Ct) return D;
  Ct = 1;
  const t = "[0-9]+", s = "[A-Z $%*+\\-./:]+";
  let o = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  o = o.replace(/u/g, "\\u");
  const i = "(?:(?![A-Z0-9 $%*+\\-./:]|" + o + `)(?:.|[\r
]))+`;
  D.KANJI = new RegExp(o, "g"), D.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g"), D.BYTE = new RegExp(i, "g"), D.NUMERIC = new RegExp(t, "g"), D.ALPHANUMERIC = new RegExp(s, "g");
  const r = new RegExp("^" + o + "$"), a = new RegExp("^" + t + "$"), c = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  return D.testKanji = function(d) {
    return r.test(d);
  }, D.testNumeric = function(d) {
    return a.test(d);
  }, D.testAlphanumeric = function(d) {
    return c.test(d);
  }, D;
}
var St;
function K() {
  return St || (St = 1, (function(t) {
    const s = Qt(), o = Xt();
    t.NUMERIC = {
      id: "Numeric",
      bit: 1,
      ccBits: [10, 12, 14]
    }, t.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 2,
      ccBits: [9, 11, 13]
    }, t.BYTE = {
      id: "Byte",
      bit: 4,
      ccBits: [8, 16, 16]
    }, t.KANJI = {
      id: "Kanji",
      bit: 8,
      ccBits: [8, 10, 12]
    }, t.MIXED = {
      bit: -1
    }, t.getCharCountIndicator = function(a, c) {
      if (!a.ccBits) throw new Error("Invalid mode: " + a);
      if (!s.isValid(c))
        throw new Error("Invalid version: " + c);
      return c >= 1 && c < 10 ? a.ccBits[0] : c < 27 ? a.ccBits[1] : a.ccBits[2];
    }, t.getBestModeForData = function(a) {
      return o.testNumeric(a) ? t.NUMERIC : o.testAlphanumeric(a) ? t.ALPHANUMERIC : o.testKanji(a) ? t.KANJI : t.BYTE;
    }, t.toString = function(a) {
      if (a && a.id) return a.id;
      throw new Error("Invalid mode");
    }, t.isValid = function(a) {
      return a && a.bit && a.ccBits;
    };
    function i(r) {
      if (typeof r != "string")
        throw new Error("Param is not a string");
      switch (r.toLowerCase()) {
        case "numeric":
          return t.NUMERIC;
        case "alphanumeric":
          return t.ALPHANUMERIC;
        case "kanji":
          return t.KANJI;
        case "byte":
          return t.BYTE;
        default:
          throw new Error("Unknown mode: " + r);
      }
    }
    t.from = function(a, c) {
      if (t.isValid(a))
        return a;
      try {
        return i(a);
      } catch {
        return c;
      }
    };
  })(Ae)), Ae;
}
var Nt;
function ma() {
  return Nt || (Nt = 1, (function(t) {
    const s = H(), o = Wt(), i = et(), r = K(), a = Qt(), c = 7973, u = s.getBCHDigit(c);
    function d(h, w, k) {
      for (let y = 1; y <= 40; y++)
        if (w <= t.getCapacity(y, k, h))
          return y;
    }
    function f(h, w) {
      return r.getCharCountIndicator(h, w) + 4;
    }
    function g(h, w) {
      let k = 0;
      return h.forEach(function(y) {
        const M = f(y.mode, w);
        k += M + y.getBitsLength();
      }), k;
    }
    function m(h, w) {
      for (let k = 1; k <= 40; k++)
        if (g(h, k) <= t.getCapacity(k, w, r.MIXED))
          return k;
    }
    t.from = function(w, k) {
      return a.isValid(w) ? parseInt(w, 10) : k;
    }, t.getCapacity = function(w, k, y) {
      if (!a.isValid(w))
        throw new Error("Invalid QR Code version");
      typeof y > "u" && (y = r.BYTE);
      const M = s.getSymbolTotalCodewords(w), p = o.getTotalCodewordsCount(w, k), C = (M - p) * 8;
      if (y === r.MIXED) return C;
      const v = C - f(y, w);
      switch (y) {
        case r.NUMERIC:
          return Math.floor(v / 10 * 3);
        case r.ALPHANUMERIC:
          return Math.floor(v / 11 * 2);
        case r.KANJI:
          return Math.floor(v / 13);
        case r.BYTE:
        default:
          return Math.floor(v / 8);
      }
    }, t.getBestVersionForData = function(w, k) {
      let y;
      const M = i.from(k, i.M);
      if (Array.isArray(w)) {
        if (w.length > 1)
          return m(w, M);
        if (w.length === 0)
          return 1;
        y = w[0];
      } else
        y = w;
      return d(y.mode, y.getLength(), M);
    }, t.getEncodedBits = function(w) {
      if (!a.isValid(w) || w < 7)
        throw new Error("Invalid QR Code version");
      let k = w << 12;
      for (; s.getBCHDigit(k) - u >= 0; )
        k ^= c << s.getBCHDigit(k) - u;
      return w << 12 | k;
    };
  })(Ie)), Ie;
}
var Me = {}, Tt;
function pa() {
  if (Tt) return Me;
  Tt = 1;
  const t = H(), s = 1335, o = 21522, i = t.getBCHDigit(s);
  return Me.getEncodedBits = function(a, c) {
    const u = a.bit << 3 | c;
    let d = u << 10;
    for (; t.getBCHDigit(d) - i >= 0; )
      d ^= s << t.getBCHDigit(d) - i;
    return (u << 10 | d) ^ o;
  }, Me;
}
var Pe = {}, Re, Et;
function ba() {
  if (Et) return Re;
  Et = 1;
  const t = K();
  function s(o) {
    this.mode = t.NUMERIC, this.data = o.toString();
  }
  return s.getBitsLength = function(i) {
    return 10 * Math.floor(i / 3) + (i % 3 ? i % 3 * 3 + 1 : 0);
  }, s.prototype.getLength = function() {
    return this.data.length;
  }, s.prototype.getBitsLength = function() {
    return s.getBitsLength(this.data.length);
  }, s.prototype.write = function(i) {
    let r, a, c;
    for (r = 0; r + 3 <= this.data.length; r += 3)
      a = this.data.substr(r, 3), c = parseInt(a, 10), i.put(c, 10);
    const u = this.data.length - r;
    u > 0 && (a = this.data.substr(r), c = parseInt(a, 10), i.put(c, u * 3 + 1));
  }, Re = s, Re;
}
var Le, Bt;
function xa() {
  if (Bt) return Le;
  Bt = 1;
  const t = K(), s = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    " ",
    "$",
    "%",
    "*",
    "+",
    "-",
    ".",
    "/",
    ":"
  ];
  function o(i) {
    this.mode = t.ALPHANUMERIC, this.data = i;
  }
  return o.getBitsLength = function(r) {
    return 11 * Math.floor(r / 2) + 6 * (r % 2);
  }, o.prototype.getLength = function() {
    return this.data.length;
  }, o.prototype.getBitsLength = function() {
    return o.getBitsLength(this.data.length);
  }, o.prototype.write = function(r) {
    let a;
    for (a = 0; a + 2 <= this.data.length; a += 2) {
      let c = s.indexOf(this.data[a]) * 45;
      c += s.indexOf(this.data[a + 1]), r.put(c, 11);
    }
    this.data.length % 2 && r.put(s.indexOf(this.data[a]), 6);
  }, Le = o, Le;
}
var De, It;
function va() {
  if (It) return De;
  It = 1;
  const t = K();
  function s(o) {
    this.mode = t.BYTE, typeof o == "string" ? this.data = new TextEncoder().encode(o) : this.data = new Uint8Array(o);
  }
  return s.getBitsLength = function(i) {
    return i * 8;
  }, s.prototype.getLength = function() {
    return this.data.length;
  }, s.prototype.getBitsLength = function() {
    return s.getBitsLength(this.data.length);
  }, s.prototype.write = function(o) {
    for (let i = 0, r = this.data.length; i < r; i++)
      o.put(this.data[i], 8);
  }, De = s, De;
}
var $e, At;
function ya() {
  if (At) return $e;
  At = 1;
  const t = K(), s = H();
  function o(i) {
    this.mode = t.KANJI, this.data = i;
  }
  return o.getBitsLength = function(r) {
    return r * 13;
  }, o.prototype.getLength = function() {
    return this.data.length;
  }, o.prototype.getBitsLength = function() {
    return o.getBitsLength(this.data.length);
  }, o.prototype.write = function(i) {
    let r;
    for (r = 0; r < this.data.length; r++) {
      let a = s.toSJIS(this.data[r]);
      if (a >= 33088 && a <= 40956)
        a -= 33088;
      else if (a >= 57408 && a <= 60351)
        a -= 49472;
      else
        throw new Error(
          "Invalid SJIS character: " + this.data[r] + `
Make sure your charset is UTF-8`
        );
      a = (a >>> 8 & 255) * 192 + (a & 255), i.put(a, 13);
    }
  }, $e = o, $e;
}
var qe = { exports: {} }, _t;
function ja() {
  return _t || (_t = 1, (function(t) {
    var s = {
      single_source_shortest_paths: function(o, i, r) {
        var a = {}, c = {};
        c[i] = 0;
        var u = s.PriorityQueue.make();
        u.push(i, 0);
        for (var d, f, g, m, h, w, k, y, M; !u.empty(); ) {
          d = u.pop(), f = d.value, m = d.cost, h = o[f] || {};
          for (g in h)
            h.hasOwnProperty(g) && (w = h[g], k = m + w, y = c[g], M = typeof c[g] > "u", (M || y > k) && (c[g] = k, u.push(g, k), a[g] = f));
        }
        if (typeof r < "u" && typeof c[r] > "u") {
          var p = ["Could not find a path from ", i, " to ", r, "."].join("");
          throw new Error(p);
        }
        return a;
      },
      extract_shortest_path_from_predecessor_list: function(o, i) {
        for (var r = [], a = i; a; )
          r.push(a), o[a], a = o[a];
        return r.reverse(), r;
      },
      find_path: function(o, i, r) {
        var a = s.single_source_shortest_paths(o, i, r);
        return s.extract_shortest_path_from_predecessor_list(
          a,
          r
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(o) {
          var i = s.PriorityQueue, r = {}, a;
          o = o || {};
          for (a in i)
            i.hasOwnProperty(a) && (r[a] = i[a]);
          return r.queue = [], r.sorter = o.sorter || i.default_sorter, r;
        },
        default_sorter: function(o, i) {
          return o.cost - i.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(o, i) {
          var r = { value: o, cost: i };
          this.queue.push(r), this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    t.exports = s;
  })(qe)), qe.exports;
}
var Mt;
function wa() {
  return Mt || (Mt = 1, (function(t) {
    const s = K(), o = ba(), i = xa(), r = va(), a = ya(), c = Xt(), u = H(), d = ja();
    function f(p) {
      return unescape(encodeURIComponent(p)).length;
    }
    function g(p, C, v) {
      const b = [];
      let B;
      for (; (B = p.exec(v)) !== null; )
        b.push({
          data: B[0],
          index: B.index,
          mode: C,
          length: B[0].length
        });
      return b;
    }
    function m(p) {
      const C = g(c.NUMERIC, s.NUMERIC, p), v = g(c.ALPHANUMERIC, s.ALPHANUMERIC, p);
      let b, B;
      return u.isKanjiModeEnabled() ? (b = g(c.BYTE, s.BYTE, p), B = g(c.KANJI, s.KANJI, p)) : (b = g(c.BYTE_KANJI, s.BYTE, p), B = []), C.concat(v, b, B).sort(function(S, N) {
        return S.index - N.index;
      }).map(function(S) {
        return {
          data: S.data,
          mode: S.mode,
          length: S.length
        };
      });
    }
    function h(p, C) {
      switch (C) {
        case s.NUMERIC:
          return o.getBitsLength(p);
        case s.ALPHANUMERIC:
          return i.getBitsLength(p);
        case s.KANJI:
          return a.getBitsLength(p);
        case s.BYTE:
          return r.getBitsLength(p);
      }
    }
    function w(p) {
      return p.reduce(function(C, v) {
        const b = C.length - 1 >= 0 ? C[C.length - 1] : null;
        return b && b.mode === v.mode ? (C[C.length - 1].data += v.data, C) : (C.push(v), C);
      }, []);
    }
    function k(p) {
      const C = [];
      for (let v = 0; v < p.length; v++) {
        const b = p[v];
        switch (b.mode) {
          case s.NUMERIC:
            C.push([
              b,
              { data: b.data, mode: s.ALPHANUMERIC, length: b.length },
              { data: b.data, mode: s.BYTE, length: b.length }
            ]);
            break;
          case s.ALPHANUMERIC:
            C.push([
              b,
              { data: b.data, mode: s.BYTE, length: b.length }
            ]);
            break;
          case s.KANJI:
            C.push([
              b,
              { data: b.data, mode: s.BYTE, length: f(b.data) }
            ]);
            break;
          case s.BYTE:
            C.push([
              { data: b.data, mode: s.BYTE, length: f(b.data) }
            ]);
        }
      }
      return C;
    }
    function y(p, C) {
      const v = {}, b = { start: {} };
      let B = ["start"];
      for (let j = 0; j < p.length; j++) {
        const S = p[j], N = [];
        for (let T = 0; T < S.length; T++) {
          const A = S[T], I = "" + j + T;
          N.push(I), v[I] = { node: A, lastCount: 0 }, b[I] = {};
          for (let _ = 0; _ < B.length; _++) {
            const x = B[_];
            v[x] && v[x].node.mode === A.mode ? (b[x][I] = h(v[x].lastCount + A.length, A.mode) - h(v[x].lastCount, A.mode), v[x].lastCount += A.length) : (v[x] && (v[x].lastCount = A.length), b[x][I] = h(A.length, A.mode) + 4 + s.getCharCountIndicator(A.mode, C));
          }
        }
        B = N;
      }
      for (let j = 0; j < B.length; j++)
        b[B[j]].end = 0;
      return { map: b, table: v };
    }
    function M(p, C) {
      let v;
      const b = s.getBestModeForData(p);
      if (v = s.from(C, b), v !== s.BYTE && v.bit < b.bit)
        throw new Error('"' + p + '" cannot be encoded with mode ' + s.toString(v) + `.
 Suggested mode is: ` + s.toString(b));
      switch (v === s.KANJI && !u.isKanjiModeEnabled() && (v = s.BYTE), v) {
        case s.NUMERIC:
          return new o(p);
        case s.ALPHANUMERIC:
          return new i(p);
        case s.KANJI:
          return new a(p);
        case s.BYTE:
          return new r(p);
      }
    }
    t.fromArray = function(C) {
      return C.reduce(function(v, b) {
        return typeof b == "string" ? v.push(M(b, null)) : b.data && v.push(M(b.data, b.mode)), v;
      }, []);
    }, t.fromString = function(C, v) {
      const b = m(C, u.isKanjiModeEnabled()), B = k(b), j = y(B, v), S = d.find_path(j.map, "start", "end"), N = [];
      for (let T = 1; T < S.length - 1; T++)
        N.push(j.table[S[T]].node);
      return t.fromArray(w(N));
    }, t.rawSplit = function(C) {
      return t.fromArray(
        m(C, u.isKanjiModeEnabled())
      );
    };
  })(Pe)), Pe;
}
var Pt;
function ka() {
  if (Pt) return je;
  Pt = 1;
  const t = H(), s = et(), o = la(), i = oa(), r = ca(), a = da(), c = ua(), u = Wt(), d = ga(), f = ma(), g = pa(), m = K(), h = wa();
  function w(j, S) {
    const N = j.size, T = a.getPositions(S);
    for (let A = 0; A < T.length; A++) {
      const I = T[A][0], _ = T[A][1];
      for (let x = -1; x <= 7; x++)
        if (!(I + x <= -1 || N <= I + x))
          for (let E = -1; E <= 7; E++)
            _ + E <= -1 || N <= _ + E || (x >= 0 && x <= 6 && (E === 0 || E === 6) || E >= 0 && E <= 6 && (x === 0 || x === 6) || x >= 2 && x <= 4 && E >= 2 && E <= 4 ? j.set(I + x, _ + E, !0, !0) : j.set(I + x, _ + E, !1, !0));
    }
  }
  function k(j) {
    const S = j.size;
    for (let N = 8; N < S - 8; N++) {
      const T = N % 2 === 0;
      j.set(N, 6, T, !0), j.set(6, N, T, !0);
    }
  }
  function y(j, S) {
    const N = r.getPositions(S);
    for (let T = 0; T < N.length; T++) {
      const A = N[T][0], I = N[T][1];
      for (let _ = -2; _ <= 2; _++)
        for (let x = -2; x <= 2; x++)
          _ === -2 || _ === 2 || x === -2 || x === 2 || _ === 0 && x === 0 ? j.set(A + _, I + x, !0, !0) : j.set(A + _, I + x, !1, !0);
    }
  }
  function M(j, S) {
    const N = j.size, T = f.getEncodedBits(S);
    let A, I, _;
    for (let x = 0; x < 18; x++)
      A = Math.floor(x / 3), I = x % 3 + N - 8 - 3, _ = (T >> x & 1) === 1, j.set(A, I, _, !0), j.set(I, A, _, !0);
  }
  function p(j, S, N) {
    const T = j.size, A = g.getEncodedBits(S, N);
    let I, _;
    for (I = 0; I < 15; I++)
      _ = (A >> I & 1) === 1, I < 6 ? j.set(I, 8, _, !0) : I < 8 ? j.set(I + 1, 8, _, !0) : j.set(T - 15 + I, 8, _, !0), I < 8 ? j.set(8, T - I - 1, _, !0) : I < 9 ? j.set(8, 15 - I - 1 + 1, _, !0) : j.set(8, 15 - I - 1, _, !0);
    j.set(T - 8, 8, 1, !0);
  }
  function C(j, S) {
    const N = j.size;
    let T = -1, A = N - 1, I = 7, _ = 0;
    for (let x = N - 1; x > 0; x -= 2)
      for (x === 6 && x--; ; ) {
        for (let E = 0; E < 2; E++)
          if (!j.isReserved(A, x - E)) {
            let L = !1;
            _ < S.length && (L = (S[_] >>> I & 1) === 1), j.set(A, x - E, L), I--, I === -1 && (_++, I = 7);
          }
        if (A += T, A < 0 || N <= A) {
          A -= T, T = -T;
          break;
        }
      }
  }
  function v(j, S, N) {
    const T = new o();
    N.forEach(function(E) {
      T.put(E.mode.bit, 4), T.put(E.getLength(), m.getCharCountIndicator(E.mode, j)), E.write(T);
    });
    const A = t.getSymbolTotalCodewords(j), I = u.getTotalCodewordsCount(j, S), _ = (A - I) * 8;
    for (T.getLengthInBits() + 4 <= _ && T.put(0, 4); T.getLengthInBits() % 8 !== 0; )
      T.putBit(0);
    const x = (_ - T.getLengthInBits()) / 8;
    for (let E = 0; E < x; E++)
      T.put(E % 2 ? 17 : 236, 8);
    return b(T, j, S);
  }
  function b(j, S, N) {
    const T = t.getSymbolTotalCodewords(S), A = u.getTotalCodewordsCount(S, N), I = T - A, _ = u.getBlocksCount(S, N), x = T % _, E = _ - x, L = Math.floor(T / _), O = Math.floor(I / _), en = O + 1, tt = L - O, tn = new d(tt);
    let fe = 0;
    const ne = new Array(_), nt = new Array(_);
    let he = 0;
    const nn = new Uint8Array(j.buffer);
    for (let J = 0; J < _; J++) {
      const me = J < E ? O : en;
      ne[J] = nn.slice(fe, fe + me), nt[J] = tn.encode(ne[J]), fe += me, he = Math.max(he, me);
    }
    const ge = new Uint8Array(T);
    let at = 0, q, F;
    for (q = 0; q < he; q++)
      for (F = 0; F < _; F++)
        q < ne[F].length && (ge[at++] = ne[F][q]);
    for (q = 0; q < tt; q++)
      for (F = 0; F < _; F++)
        ge[at++] = nt[F][q];
    return ge;
  }
  function B(j, S, N, T) {
    let A;
    if (Array.isArray(j))
      A = h.fromArray(j);
    else if (typeof j == "string") {
      let L = S;
      if (!L) {
        const O = h.rawSplit(j);
        L = f.getBestVersionForData(O, N);
      }
      A = h.fromString(j, L || 40);
    } else
      throw new Error("Invalid data");
    const I = f.getBestVersionForData(A, N);
    if (!I)
      throw new Error("The amount of data is too big to be stored in a QR Code");
    if (!S)
      S = I;
    else if (S < I)
      throw new Error(
        `
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + I + `.
`
      );
    const _ = v(S, N, A), x = t.getSymbolSize(S), E = new i(x);
    return w(E, S), k(E), y(E, S), p(E, N, 0), S >= 7 && M(E, S), C(E, _), isNaN(T) && (T = c.getBestMask(
      E,
      p.bind(null, E, N)
    )), c.applyMask(T, E), p(E, N, T), {
      modules: E,
      version: S,
      errorCorrectionLevel: N,
      maskPattern: T,
      segments: A
    };
  }
  return je.create = function(S, N) {
    if (typeof S > "u" || S === "")
      throw new Error("No input text");
    let T = s.M, A, I;
    return typeof N < "u" && (T = s.from(N.errorCorrectionLevel, s.M), A = f.from(N.version), I = c.from(N.maskPattern), N.toSJISFunc && t.setToSJISFunction(N.toSJISFunc)), B(S, A, T, I);
  }, je;
}
var Fe = {}, Ue = {}, Rt;
function Zt() {
  return Rt || (Rt = 1, (function(t) {
    function s(o) {
      if (typeof o == "number" && (o = o.toString()), typeof o != "string")
        throw new Error("Color should be defined as hex string");
      let i = o.slice().replace("#", "").split("");
      if (i.length < 3 || i.length === 5 || i.length > 8)
        throw new Error("Invalid hex color: " + o);
      (i.length === 3 || i.length === 4) && (i = Array.prototype.concat.apply([], i.map(function(a) {
        return [a, a];
      }))), i.length === 6 && i.push("F", "F");
      const r = parseInt(i.join(""), 16);
      return {
        r: r >> 24 & 255,
        g: r >> 16 & 255,
        b: r >> 8 & 255,
        a: r & 255,
        hex: "#" + i.slice(0, 6).join("")
      };
    }
    t.getOptions = function(i) {
      i || (i = {}), i.color || (i.color = {});
      const r = typeof i.margin > "u" || i.margin === null || i.margin < 0 ? 4 : i.margin, a = i.width && i.width >= 21 ? i.width : void 0, c = i.scale || 4;
      return {
        width: a,
        scale: a ? 4 : c,
        margin: r,
        color: {
          dark: s(i.color.dark || "#000000ff"),
          light: s(i.color.light || "#ffffffff")
        },
        type: i.type,
        rendererOpts: i.rendererOpts || {}
      };
    }, t.getScale = function(i, r) {
      return r.width && r.width >= i + r.margin * 2 ? r.width / (i + r.margin * 2) : r.scale;
    }, t.getImageWidth = function(i, r) {
      const a = t.getScale(i, r);
      return Math.floor((i + r.margin * 2) * a);
    }, t.qrToImageData = function(i, r, a) {
      const c = r.modules.size, u = r.modules.data, d = t.getScale(c, a), f = Math.floor((c + a.margin * 2) * d), g = a.margin * d, m = [a.color.light, a.color.dark];
      for (let h = 0; h < f; h++)
        for (let w = 0; w < f; w++) {
          let k = (h * f + w) * 4, y = a.color.light;
          if (h >= g && w >= g && h < f - g && w < f - g) {
            const M = Math.floor((h - g) / d), p = Math.floor((w - g) / d);
            y = m[u[M * c + p] ? 1 : 0];
          }
          i[k++] = y.r, i[k++] = y.g, i[k++] = y.b, i[k] = y.a;
        }
    };
  })(Ue)), Ue;
}
var Lt;
function Ca() {
  return Lt || (Lt = 1, (function(t) {
    const s = Zt();
    function o(r, a, c) {
      r.clearRect(0, 0, a.width, a.height), a.style || (a.style = {}), a.height = c, a.width = c, a.style.height = c + "px", a.style.width = c + "px";
    }
    function i() {
      try {
        return document.createElement("canvas");
      } catch {
        throw new Error("You need to specify a canvas element");
      }
    }
    t.render = function(a, c, u) {
      let d = u, f = c;
      typeof d > "u" && (!c || !c.getContext) && (d = c, c = void 0), c || (f = i()), d = s.getOptions(d);
      const g = s.getImageWidth(a.modules.size, d), m = f.getContext("2d"), h = m.createImageData(g, g);
      return s.qrToImageData(h.data, a, d), o(m, f, g), m.putImageData(h, 0, 0), f;
    }, t.renderToDataURL = function(a, c, u) {
      let d = u;
      typeof d > "u" && (!c || !c.getContext) && (d = c, c = void 0), d || (d = {});
      const f = t.render(a, c, d), g = d.type || "image/png", m = d.rendererOpts || {};
      return f.toDataURL(g, m.quality);
    };
  })(Fe)), Fe;
}
var Ve = {}, Dt;
function Sa() {
  if (Dt) return Ve;
  Dt = 1;
  const t = Zt();
  function s(r, a) {
    const c = r.a / 255, u = a + '="' + r.hex + '"';
    return c < 1 ? u + " " + a + '-opacity="' + c.toFixed(2).slice(1) + '"' : u;
  }
  function o(r, a, c) {
    let u = r + a;
    return typeof c < "u" && (u += " " + c), u;
  }
  function i(r, a, c) {
    let u = "", d = 0, f = !1, g = 0;
    for (let m = 0; m < r.length; m++) {
      const h = Math.floor(m % a), w = Math.floor(m / a);
      !h && !f && (f = !0), r[m] ? (g++, m > 0 && h > 0 && r[m - 1] || (u += f ? o("M", h + c, 0.5 + w + c) : o("m", d, 0), d = 0, f = !1), h + 1 < a && r[m + 1] || (u += o("h", g), g = 0)) : d++;
    }
    return u;
  }
  return Ve.render = function(a, c, u) {
    const d = t.getOptions(c), f = a.modules.size, g = a.modules.data, m = f + d.margin * 2, h = d.color.light.a ? "<path " + s(d.color.light, "fill") + ' d="M0 0h' + m + "v" + m + 'H0z"/>' : "", w = "<path " + s(d.color.dark, "stroke") + ' d="' + i(g, f, d.margin) + '"/>', k = 'viewBox="0 0 ' + m + " " + m + '"', M = '<svg xmlns="http://www.w3.org/2000/svg" ' + (d.width ? 'width="' + d.width + '" height="' + d.width + '" ' : "") + k + ' shape-rendering="crispEdges">' + h + w + `</svg>
`;
    return typeof u == "function" && u(null, M), M;
  }, Ve;
}
var $t;
function Na() {
  if ($t) return G;
  $t = 1;
  const t = ra(), s = ka(), o = Ca(), i = Sa();
  function r(a, c, u, d, f) {
    const g = [].slice.call(arguments, 1), m = g.length, h = typeof g[m - 1] == "function";
    if (!h && !t())
      throw new Error("Callback required as last argument");
    if (h) {
      if (m < 2)
        throw new Error("Too few arguments provided");
      m === 2 ? (f = u, u = c, c = d = void 0) : m === 3 && (c.getContext && typeof f > "u" ? (f = d, d = void 0) : (f = d, d = u, u = c, c = void 0));
    } else {
      if (m < 1)
        throw new Error("Too few arguments provided");
      return m === 1 ? (u = c, c = d = void 0) : m === 2 && !c.getContext && (d = u, u = c, c = void 0), new Promise(function(w, k) {
        try {
          const y = s.create(u, d);
          w(a(y, c, d));
        } catch (y) {
          k(y);
        }
      });
    }
    try {
      const w = s.create(u, d);
      f(null, a(w, c, d));
    } catch (w) {
      f(w);
    }
  }
  return G.create = s.create, G.toCanvas = r.bind(null, o.render), G.toDataURL = r.bind(null, o.renderToDataURL), G.toString = r.bind(null, function(a, c, u) {
    return i.render(a, u);
  }), G;
}
var Ta = Na();
function Ea(t) {
  const s = t.settings.display ?? {}, o = s.mode ?? "inline", i = (o === "launcher" || o === "popup") && s.launcher?.position === "left" ? ' position="left"' : "";
  return `<x-chatflow::form :id="${t.id}" mode="${o}"${i} />`;
}
function Ba(t, s) {
  return !t.id || t.version < 1 || !t.slug ? null : `${(s.siteUrl ?? location.origin).replace(/\/+$/, "")}/${(s.fullpageBase ?? "chat").replace(/^\/+|\/+$/g, "")}/${encodeURIComponent(t.slug)}/`;
}
function Ia(t, s, o) {
  const i = new URL(t);
  if (!["https:", "http:"].includes(i.protocol) || i.username || i.password) throw new TypeError("Invalid share URL");
  for (const r of o.steps) {
    const a = s[r.key];
    !["hidden", "calculated", "file_upload", "consent", "statement", "summary", "media"].includes(r.type) && a && a.length <= 2e3 && i.searchParams.set(`cff_prefill[${r.key}]`, a);
  }
  return i.href;
}
const Aa = ["hidden", "calculated", "file_upload", "consent", "statement", "summary", "media", "address"];
function _a({ form: t, config: s }) {
  const o = Ba(t, s), [i, r] = P.useState({}), [a, c] = P.useState(""), u = P.useMemo(() => o ? Ia(o, i, t.schema) : "", [o, i, t.schema]);
  P.useEffect(() => {
    let g = !0;
    return c(""), u && Ta.toDataURL(u, { width: 240, margin: 2, errorCorrectionLevel: "M" }).then((m) => g && c(m)).catch(() => {
    }), () => {
      g = !1;
    };
  }, [u]);
  const d = async (g, m) => {
    try {
      await navigator.clipboard.writeText(g), l.toast.success(m);
    } catch {
      l.toast.error(n("Could not copy. Select the text and copy it instead."));
    }
  }, f = Ea(t);
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
    /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Link") }),
        /* @__PURE__ */ e.jsx(l.CardDescription, { children: o ? n("The form on its own page.") : n("Publish the form to get its link and QR code.") })
      ] }),
      o && /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-2", children: [
          /* @__PURE__ */ e.jsx(l.Input, { readOnly: !0, value: u, "aria-label": n("Form link"), onFocus: (g) => g.target.select() }),
          /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", onClick: () => {
            d(u, n("Link copied."));
          }, children: [
            /* @__PURE__ */ e.jsx(He, {}),
            " ",
            n("Copy")
          ] }),
          /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", asChild: !0, children: /* @__PURE__ */ e.jsxs("a", { href: u, target: "_blank", rel: "noopener noreferrer", children: [
            /* @__PURE__ */ e.jsx(Ot, {}),
            " ",
            n("Open")
          ] }) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-start cf:gap-6", children: [
          a && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:items-start cf:gap-2", children: [
            /* @__PURE__ */ e.jsx("img", { src: a, width: 160, height: 160, alt: n("QR code for the form link"), className: "cf:rounded-md cf:border cf:bg-white" }),
            /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e.jsxs("a", { href: a, download: "chatflow-qr.png", children: [
              /* @__PURE__ */ e.jsx(xn, {}),
              " ",
              n("Download QR code")
            ] }) })
          ] }),
          /* @__PURE__ */ e.jsxs("details", { className: "cf:min-w-64 cf:flex-1 cf:text-sm", children: [
            /* @__PURE__ */ e.jsx("summary", { className: "cf:cursor-pointer cf:font-medium", children: n("Prefill answers in the link") }),
            /* @__PURE__ */ e.jsx("p", { className: "cf:my-2 cf:text-xs cf:text-muted-foreground", children: n("Visitors see these as suggested answers they can change. Links end up in browser history and logs: never put personal or secret data in them.") }),
            /* @__PURE__ */ e.jsx("div", { className: "cf:grid cf:gap-3 cf:sm:grid-cols-2", children: t.schema.steps.filter((g) => !Aa.includes(g.type)).map((g) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
              /* @__PURE__ */ e.jsx(l.Label, { children: g.label || g.key }),
              /* @__PURE__ */ e.jsx(l.Input, { value: i[g.key] ?? "", onChange: (m) => r({ ...i, [g.key]: m.target.value }) })
            ] }, g.id)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Embed in a page") }),
        /* @__PURE__ */ e.jsx(l.CardDescription, { children: n("Paste this Blade component into any view of your Laravel app. The display mode (inline, button, pop-up) is under Settings → General.") })
      ] }),
      /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(l.Input, { readOnly: !0, value: f, className: "cf:font-mono cf:text-xs", "aria-label": n("Embed code"), onFocus: (g) => g.target.select() }),
        /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", onClick: () => {
          d(f, n("Embed code copied."));
        }, children: [
          /* @__PURE__ */ e.jsx(He, {}),
          " ",
          n("Copy")
        ] })
      ] })
    ] })
  ] });
}
const re = {
  previewRedirect: "Preview destination (no redirect)",
  invalidEmail: "Enter a valid email address.",
  openChat: "Open chat",
  closeChat: "Close chat",
  formDialog: "Chat form",
  loading: "Loading chat…",
  continue: "Continue",
  submit: "Submit",
  back: "Back",
  edit: "Edit",
  skip: "Skip",
  yes: "Yes",
  no: "No",
  startOver: "Start over",
  confirmRestart: "Start from the beginning? Your saved answers will be cleared.",
  cancel: "Cancel",
  welcomeBack: "Welcome back. Continue where you left off?",
  newerVersion: "A new version is available. Continue your saved version or start over with the latest version.",
  continueOld: "Continue saved version",
  offline: "You are offline. Answers stay on this device; reconnect to save or submit.",
  unsaved: "Answers on this device have not yet been saved to the server.",
  saved: "Answers saved",
  storageUnavailable: "Browser storage is unavailable. Keep this page open until you finish.",
  error: "We could not save your progress. Please try again.",
  retry: "Try again",
  invalid: "Please check your answer.",
  required: "Please answer this question.",
  consentRequired: "Please agree before continuing.",
  progress: "Progress",
  summary: "Review your answers",
  empty: "Skipped",
  online: "Online",
  typing: "Typing…",
  country: "Country code",
  privacy: "Privacy policy",
  phone: "Phone number",
  longTextHint: "Enter to continue, Shift+Enter for a new line",
  other: "Please specify",
  conflict: "Your session changed in another tab. Choose which answers to keep.",
  useServer: "Use saved answers",
  useLocal: "Keep this tab’s answers",
  expired: "Your session expired. Start over to continue.",
  versionConflict: "Your saved version is unavailable. Your partial is intact; start over to use the latest form.",
  complete: "Thank you. Your response was submitted.",
  redirecting: "Taking you there…",
  close: "Close",
  review: "Review and submit",
  insecure: "This connection is not secure. Use HTTPS before entering personal information.",
  unsupported: "This field is not available in this form.",
  offlineNoSave: "You are offline. This form cannot store answers on this device; reconnect to continue.",
  sessionStorage: "To resume, your answers (including personal information) are stored on this device until completion, restart or expiry.",
  submissionPending: "Submission may already have arrived. Retry to confirm; do not start a duplicate response.",
  honeypot: "Leave this field empty",
  characters: "characters",
  preview: "Preview — answers are not sent or saved",
  imageUnavailable: "Option image",
  botAvatar: "Assistant",
  magicEmailConfirm: "Send a one-time resume link to the email already provided in this form?",
  magicEmailAccepted: "If an eligible email was provided, a resume link will be sent.",
  magicEmailError: "Unable to request a resume link right now.",
  magicEmail: "Email me a resume link",
  magicShareConfirm: "Create a single-use link to share yourself? Anyone with the link can resume your form.",
  magicShareError: "Unable to create a link right now.",
  magicCopied: "Link copied. Paste it into WhatsApp yourself.",
  magicCancelled: "Share cancelled or unavailable. Request a new link to retry.",
  magicShare: "Share resume link (choose WhatsApp)",
  address_street: "Street address",
  address_city: "City",
  address_postcode: "Postal code",
  address_country: "Country",
  uploading: "Uploading…",
  uploadFailed: "Upload failed. Check file type and size, then try again.",
  uploadSaved: "Uploaded file",
  uploadLimit: "Maximum file size:",
  whatsapp: "Chat on WhatsApp",
  contactUs: "Contact us",
  opensNewTab: "opens in a new tab",
  select: "Select…",
  captchaFailed: "The spam check did not complete. Try again to submit."
}, Ma = {
  previewRedirect: "Tujuan pratinjau (tanpa pengalihan)",
  invalidEmail: "Masukkan alamat email yang valid.",
  openChat: "Buka chat",
  closeChat: "Tutup chat",
  formDialog: "Formulir chat",
  loading: "Memuat percakapan…",
  continue: "Lanjut",
  submit: "Kirim",
  back: "Kembali",
  edit: "Ubah",
  skip: "Lewati",
  yes: "Ya",
  no: "Tidak",
  startOver: "Mulai ulang",
  confirmRestart: "Mulai dari awal? Jawaban tersimpan Anda akan dihapus.",
  cancel: "Batal",
  welcomeBack: "Selamat datang kembali. Lanjutkan dari jawaban terakhir?",
  newerVersion: "Versi baru tersedia. Lanjutkan versi tersimpan atau mulai ulang dengan versi terbaru.",
  continueOld: "Lanjutkan versi tersimpan",
  offline: "Anda sedang offline. Jawaban tersimpan di perangkat ini; sambungkan kembali untuk menyimpan atau mengirim.",
  unsaved: "Jawaban di perangkat ini belum tersimpan di server.",
  saved: "Jawaban tersimpan",
  storageUnavailable: "Penyimpanan browser tidak tersedia. Biarkan halaman terbuka sampai selesai.",
  error: "Progres belum dapat disimpan. Silakan coba lagi.",
  retry: "Coba lagi",
  invalid: "Mohon periksa jawaban Anda.",
  required: "Mohon jawab pertanyaan ini.",
  consentRequired: "Mohon setujui sebelum melanjutkan.",
  progress: "Progres",
  summary: "Periksa jawaban Anda",
  empty: "Dilewati",
  online: "Online",
  typing: "Sedang mengetik…",
  country: "Kode negara",
  privacy: "Kebijakan privasi",
  phone: "Nomor telepon",
  longTextHint: "Enter untuk lanjut, Shift+Enter untuk baris baru",
  other: "Mohon jelaskan",
  conflict: "Sesi berubah di tab lain. Pilih jawaban yang ingin dipertahankan.",
  useServer: "Gunakan jawaban tersimpan",
  useLocal: "Pertahankan jawaban tab ini",
  expired: "Sesi Anda kedaluwarsa. Mulai ulang untuk melanjutkan.",
  versionConflict: "Versi tersimpan tidak tersedia. Jawaban parsial tetap tersimpan; mulai ulang untuk versi terbaru.",
  complete: "Terima kasih. Jawaban Anda sudah terkirim.",
  redirecting: "Mengalihkan halaman…",
  close: "Tutup",
  review: "Periksa dan kirim",
  insecure: "Koneksi ini tidak aman. Gunakan HTTPS sebelum memasukkan data pribadi.",
  unsupported: "Kolom ini tidak tersedia dalam formulir.",
  offlineNoSave: "Anda sedang offline. Formulir ini tidak dapat menyimpan jawaban di perangkat ini; sambungkan kembali untuk melanjutkan.",
  sessionStorage: "Untuk melanjutkan nanti, jawaban (termasuk data pribadi) disimpan di perangkat ini hingga selesai, mulai ulang, atau kedaluwarsa.",
  submissionPending: "Jawaban mungkin sudah diterima. Coba lagi untuk memastikan; jangan buat jawaban duplikat.",
  honeypot: "Biarkan kolom ini kosong",
  characters: "karakter",
  preview: "Pratinjau — jawaban tidak dikirim atau disimpan",
  imageUnavailable: "Gambar pilihan",
  botAvatar: "Asisten",
  magicEmailConfirm: "Kirim tautan sekali pakai untuk melanjutkan ke email yang sudah Anda isi?",
  magicEmailAccepted: "Jika email yang memenuhi syarat sudah diisi, tautan untuk melanjutkan akan dikirim.",
  magicEmailError: "Belum dapat meminta tautan untuk melanjutkan.",
  magicEmail: "Kirim tautan untuk melanjutkan via email",
  magicShareConfirm: "Buat tautan sekali pakai untuk Anda bagikan? Siapa pun yang memiliki tautan dapat melanjutkan formulir Anda.",
  magicShareError: "Belum dapat membuat tautan.",
  magicCopied: "Tautan disalin. Tempelkan ke WhatsApp sendiri.",
  magicCancelled: "Berbagi dibatalkan atau tidak tersedia. Minta tautan baru untuk mencoba lagi.",
  magicShare: "Bagikan tautan untuk melanjutkan (pilih WhatsApp)",
  address_street: "Alamat jalan",
  address_city: "Kota",
  address_postcode: "Kode pos",
  address_country: "Negara",
  uploading: "Mengunggah…",
  uploadFailed: "Unggah gagal. Periksa jenis dan ukuran berkas, lalu coba lagi.",
  uploadSaved: "Berkas terunggah",
  uploadLimit: "Ukuran berkas maksimum:",
  whatsapp: "Chat lewat WhatsApp",
  contactUs: "Hubungi kami",
  opensNewTab: "terbuka di tab baru",
  select: "Pilih…",
  captchaFailed: "Pemeriksaan spam belum selesai. Coba lagi untuk mengirim."
};
function Pa({ form: t, locale: s, onChange: o }) {
  const [i, r] = P.useState(""), a = t.settings.language ?? "site", c = a === "id" || a === "site" && /^id(?:[-_]|$)/i.test(s) ? Ma : re, u = t.settings.phrases ?? {}, d = i.trim().toLowerCase(), f = Object.keys(re).filter((m) => !d || [c[m], re[m], u[m]].some((h) => h?.toLowerCase().includes(d))).sort((m, h) => +(h in u) - +(m in u)), g = (m, h) => {
    const w = { ...u };
    h.trim() ? w[m] = h : delete w[m], o({ ...t, settings: { ...t.settings, phrases: w } });
  };
  return /* @__PURE__ */ e.jsxs(l.Card, { children: [
    /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
      /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Chat texts") }),
      /* @__PURE__ */ e.jsx(l.CardDescription, { children: R(n("%d changed. Empty fields use the built-in text, shown in grey."), Object.keys(u).length) })
    ] }),
    /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
      /* @__PURE__ */ e.jsx(l.Input, { "aria-label": n("Search texts"), placeholder: n("Search texts…"), value: i, onChange: (m) => r(m.target.value), className: "cf:max-w-sm" }),
      /* @__PURE__ */ e.jsx("div", { className: "cf:grid cf:gap-3 cf:sm:grid-cols-2", children: f.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
        /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-phrase-${m}`, className: "cf:font-normal cf:text-muted-foreground", children: re[m] }),
        /* @__PURE__ */ e.jsx(l.Input, { id: `cf-phrase-${m}`, value: u[m] ?? "", placeholder: c[m], onChange: (h) => g(m, h.target.value) })
      ] }, m)) }),
      Object.keys(u).length > 0 && /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", onClick: () => o({ ...t, settings: { ...t.settings, phrases: {} } }), children: n("Reset all texts") })
    ] })
  ] });
}
const Ra = 3e3, La = 6e4;
function Da(t, s) {
  const o = P.useMemo(() => new dn(t, s), [t, s]), i = P.useSyncExternalStore(o.subscribe, o.snapshot), [r, a] = P.useState(""), [c, u] = P.useState(null), d = o.dirty();
  P.useEffect(() => {
    let h = !0;
    const w = () => t.request(`admin/forms/${s.id}/lock`, "POST", {}).then(() => h && a("")).catch((y) => h && a(W(y)));
    w();
    const k = window.setInterval(() => {
      w();
    }, La);
    return () => {
      h = !1, window.clearInterval(k);
    };
  }, [t, s.id]);
  const f = P.useCallback(() => {
    !r && !o.state.conflict && !o.state.saving && o.save().catch(() => {
    });
  }, [o, r]);
  P.useEffect(() => {
    const h = window.setInterval(() => {
      const w = o.state;
      !r && !w.conflict && !w.error && !w.saving && o.dirty() && o.save().catch(() => {
      });
    }, Ra);
    return () => window.clearInterval(h);
  }, [o, r]);
  const g = P.useRef(!1);
  P.useEffect(() => {
    g.current && !i.saving && !i.error && u(/* @__PURE__ */ new Date()), g.current = i.saving;
  }, [i.saving, i.error]), l.useUnsavedChanges(d, f);
  const m = P.useCallback((h) => o.edit(h), [o]);
  return { controller: o, state: i, form: i.form, dirty: d, savedAt: c, lockError: r, edit: m, saveNow: f };
}
const qt = 500;
function Ya({ formId: t, title: s, config: o }) {
  const i = sn(o), [r, a] = P.useState(null), [c, u] = P.useState("");
  return l.useBreadcrumbs([{ label: n("Forms"), href: ce.forms() }, { label: r?.title ?? s }]), P.useEffect(() => {
    i.request(`admin/forms/${t}`).then(a).catch((d) => u(W(d)));
  }, [i, t]), r ? /* @__PURE__ */ e.jsx($a, { api: i, initial: r }) : /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(Ft.Head, { title: s }),
    /* @__PURE__ */ e.jsx(l.PageHeader, { title: s, back: { href: ce.forms(), label: n("Forms") } }),
    /* @__PURE__ */ e.jsx("p", { className: c ? "cf:text-sm cf:text-destructive" : "cf:text-sm cf:text-muted-foreground", role: c ? "alert" : "status", children: c || n("Loading…") })
  ] });
}
function $a({ api: t, initial: s }) {
  const o = Da(t, s), { controller: i, state: r, form: a, dirty: c, edit: u } = o, d = a.schema, [f, g] = vn(), [m, h] = P.useState(d.steps[0]?.id ?? ""), [w, k] = P.useState(!1), [y, M] = P.useState("build"), [p, C] = P.useState(null), v = d.steps.find((x) => x.id === m);
  P.useEffect(() => {
    !v && d.steps[0] && h(d.steps[0].id);
  }, [v, d.steps]), P.useEffect(() => {
    if (!a.version) return;
    let x = !0;
    return t.request(`admin/forms/${a.id}/published`).then((E) => x && C(E)).catch(() => x && C(null)), () => {
      x = !1;
    };
  }, [t, a.id, a.version]);
  const b = P.useMemo(() => un(p, a), [p, a]), B = a.version > 0 && p !== null && b.length > 0, j = (x) => u((E) => ({ ...E, schema: x })), S = (x) => j({ ...d, steps: d.steps.map((E) => E.id === x.id ? x : E) }), N = (x) => {
    const E = d.steps.findIndex((O) => O.id === m), L = E >= 0 ? [...d.steps.slice(0, E + 1), x, ...d.steps.slice(E + 1)] : [...d.steps, x];
    j({ ...d, steps: L }), h(x.id);
  }, T = (x) => N(mn(x, d.steps, i.reservedKeys())), A = async (x) => {
    d.steps.length <= 1 || await f({
      title: R(n("Delete “%s”?"), x.label || x.key),
      description: n("Rules that use it are removed, and notifications that depend on it are switched off. You can undo this."),
      confirmLabel: n("Delete field"),
      destructive: !0
    }) && u((E) => pn(E, x.id));
  }, I = async () => {
    try {
      await i.publish(), k(!1), l.toast.success(n("Published. Visitors now get this version."));
    } catch (x) {
      l.toast.error(W(x));
    }
  }, _ = r.saving ? n("Saving…") : r.error ? n("Not saved") : c ? n("Unsaved changes") : o.savedAt ? R(n("Saved %s"), o.savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) : n("Saved");
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(Ft.Head, { title: a.title }),
    g,
    /* @__PURE__ */ e.jsxs(
      l.PageHeader,
      {
        title: a.title || n("Untitled form"),
        back: { href: ce.forms(), label: n("Forms") },
        menu: [
          ...a.slug && a.version > 0 && t.config.fullpageBase ? [{ label: n("Open live form"), icon: /* @__PURE__ */ e.jsx(Ot, {}), href: `${t.config.siteUrl ?? "/"}${t.config.fullpageBase}/${a.slug}/`, external: !0 }] : [],
          { label: n("Submissions"), href: ce.submissions({ formId: a.id }) }
        ],
        actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", "aria-label": n("Undo"), disabled: !r.history.length || r.saving, onClick: () => i.undo(), children: /* @__PURE__ */ e.jsx(kn, {}) }),
          /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", "aria-label": n("Redo"), disabled: !r.future.length || r.saving, onClick: () => i.redo(), children: /* @__PURE__ */ e.jsx(jn, {}) })
        ] }),
        primary: /* @__PURE__ */ e.jsx(l.Button, { onClick: () => k(!0), disabled: !!r.conflict || !!o.lockError, children: n("Publish") }),
        children: [
          /* @__PURE__ */ e.jsx(l.Badge, { variant: "outline", role: "status", children: _ }),
          a.version > 0 ? /* @__PURE__ */ e.jsx(l.Badge, { children: R(n("Live · v%d"), a.version) }) : /* @__PURE__ */ e.jsx(l.Badge, { variant: "secondary", children: n("Not published") }),
          B && /* @__PURE__ */ e.jsx(l.Badge, { variant: "secondary", children: n("Unpublished changes") })
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(Fa, { draft: o }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:max-w-xl cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsx(l.Label, { htmlFor: "cf-form-title", children: n("Form name") }),
      /* @__PURE__ */ e.jsx(l.Input, { id: "cf-form-title", value: a.title, maxLength: 500, onChange: (x) => u((E) => ({ ...E, title: x.target.value })) })
    ] }),
    /* @__PURE__ */ e.jsxs(l.Tabs, { value: y, onValueChange: M, children: [
      /* @__PURE__ */ e.jsxs(l.TabsList, { children: [
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "build", children: n("Questions") }),
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "endings", children: n("Endings") }),
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "logic", children: n("Logic") }),
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "design", children: n("Design") }),
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "settings", children: n("Settings") }),
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "emails", children: n("Emails") }),
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "share", children: n("Share") }),
        /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "preview", children: n("Preview") })
      ] }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "build", className: "cf:mt-4", children: /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-6 cf:lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "cf:text-sm cf:font-medium", children: R(n("Conversation · %d fields"), d.steps.length) }),
            /* @__PURE__ */ e.jsx(qa, { available: t.config.features.fieldTypes, disabled: d.steps.length >= qt, onAdd: T })
          ] }),
          /* @__PURE__ */ e.jsx(
            l.SortableList,
            {
              items: d.steps,
              getId: (x) => x.id,
              getLabel: (x) => x.label || x.key,
              onReorder: (x) => j({ ...d, steps: x }),
              children: (x, { handle: E, index: L }) => /* @__PURE__ */ e.jsxs("div", { className: `cf:flex cf:items-center cf:gap-2 cf:rounded-md cf:border cf:bg-card cf:p-2 ${x.id === m ? "cf:border-primary cf:ring-1 cf:ring-primary" : ""}`, children: [
                /* @__PURE__ */ e.jsx(l.SortableHandle, { ...E, label: R(n("Move %s"), x.label || x.key) }),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-step-id": x.id,
                    "aria-pressed": x.id === m,
                    onClick: () => h(x.id),
                    className: "cf:flex cf:min-w-0 cf:flex-1 cf:flex-col cf:items-start cf:text-left",
                    children: [
                      /* @__PURE__ */ e.jsxs("span", { className: "cf:flex cf:w-full cf:items-center cf:gap-2", children: [
                        /* @__PURE__ */ e.jsx("span", { className: "cf:text-xs cf:text-muted-foreground cf:tabular-nums", children: String(L + 1).padStart(2, "0") }),
                        /* @__PURE__ */ e.jsx("span", { className: "cf:truncate cf:font-medium", children: x.label || x.key })
                      ] }),
                      /* @__PURE__ */ e.jsxs("span", { className: "cf:text-xs cf:text-muted-foreground", children: [
                        Ze(x.type),
                        x.required ? ` · ${n("Required")}` : "",
                        x.hiddenByDefault ? ` · ${n("Hidden")}` : ""
                      ] })
                    ]
                  }
                )
              ] })
            }
          )
        ] }),
        v ? /* @__PURE__ */ e.jsx(
          qn,
          {
            step: v,
            schema: d,
            reservedValues: i.reservedOptionValues(v.id),
            onChange: S,
            onRenameKey: (x) => u((E) => gn(E, v.id, x)),
            onRenameOption: (x, E) => u((L) => hn(L, v.id, x, E)),
            actions: /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-1", children: [
              /* @__PURE__ */ e.jsx(
                l.Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "cf:size-8",
                  "aria-label": n("Duplicate field"),
                  disabled: d.steps.length >= qt,
                  onClick: () => N(fn(v, d.steps, i.reservedKeys())),
                  children: /* @__PURE__ */ e.jsx(He, {})
                }
              ),
              /* @__PURE__ */ e.jsx(
                l.Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "cf:size-8 cf:text-destructive",
                  "aria-label": n("Delete field"),
                  disabled: d.steps.length <= 1,
                  onClick: () => {
                    A(v);
                  },
                  children: /* @__PURE__ */ e.jsx(V, {})
                }
              )
            ] })
          },
          v.id
        ) : /* @__PURE__ */ e.jsx(l.Card, { children: /* @__PURE__ */ e.jsx(l.CardContent, { className: "cf:text-muted-foreground", children: n("Add a field to start.") }) })
      ] }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "endings", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(Cn, { form: a, onChange: (x) => u(() => x) }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "design", className: "cf:mt-4", children: /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-6 cf:xl:grid-cols-[minmax(0,1fr)_26rem]", children: [
        /* @__PURE__ */ e.jsx(dt, { form: a, group: "design", defaults: t.config.defaults, onChange: (x) => u(() => x) }),
        /* @__PURE__ */ e.jsx("div", { className: "cf:xl:sticky cf:xl:top-4 cf:xl:self-start", children: /* @__PURE__ */ e.jsx(ct, { form: a, config: t.config }) })
      ] }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "settings", className: "cf:mt-4", children: /* @__PURE__ */ e.jsxs(l.Tabs, { defaultValue: "general", children: [
        /* @__PURE__ */ e.jsxs(l.TabsList, { children: [
          /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "general", children: n("General") }),
          /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "privacy", children: n("Privacy") }),
          /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "spam", children: n("Spam") }),
          /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "wording", children: n("Texts") })
        ] }),
        ["general", "privacy", "spam"].map((x) => /* @__PURE__ */ e.jsx(l.TabsContent, { value: x, className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(dt, { form: a, group: x, defaults: t.config.defaults, onChange: (E) => u(() => E) }) }, x)),
        /* @__PURE__ */ e.jsx(l.TabsContent, { value: "wording", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(Pa, { form: a, locale: t.config.locale, onChange: (x) => u(() => x) }) })
      ] }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "emails", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(na, { api: t, form: a, onChange: (x) => u(() => x), save: () => i.save() }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "share", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(_a, { form: a, config: t.config }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "preview", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx("div", { className: "cf:mx-auto cf:w-full cf:max-w-3xl", children: /* @__PURE__ */ e.jsx(ct, { form: a, config: t.config, height: 680 }) }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "logic", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(ea, { form: a, onChange: (x) => u(() => x), onOpenStep: (x) => {
        h(x), M("build");
      } }) })
    ] }),
    /* @__PURE__ */ e.jsx(l.Dialog, { open: w, onOpenChange: k, children: /* @__PURE__ */ e.jsxs(l.DialogContent, { children: [
      /* @__PURE__ */ e.jsxs(l.DialogHeader, { children: [
        /* @__PURE__ */ e.jsx(l.DialogTitle, { children: a.version > 0 ? n("Publish a new version?") : n("Publish this form?") }),
        /* @__PURE__ */ e.jsx(l.DialogDescription, { children: a.version > 0 ? n("Visitors who start the form from now on get the new version. Conversations in progress keep the one they started with.") : n("The form becomes available to visitors. Later edits stay in the draft until you publish again.") })
      ] }),
      a.version > 0 && (b.length ? /* @__PURE__ */ e.jsx("ul", { className: "cf:list-disc cf:pl-5 cf:text-sm", children: b.map((x) => /* @__PURE__ */ e.jsx("li", { children: x }, x)) }) : /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: n("Nothing changed since the live version.") })),
      /* @__PURE__ */ e.jsxs(l.DialogFooter, { children: [
        /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", onClick: () => k(!1), children: n("Cancel") }),
        /* @__PURE__ */ e.jsx(l.Button, { onClick: () => {
          I();
        }, disabled: r.saving, children: r.saving ? n("Publishing…") : a.version > 0 ? n("Publish new version") : n("Publish") })
      ] })
    ] }) })
  ] });
}
function qa({ available: t, disabled: s, onAdd: o }) {
  return /* @__PURE__ */ e.jsxs(l.DropdownMenu, { children: [
    /* @__PURE__ */ e.jsx(l.DropdownMenuTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsxs(l.Button, { size: "sm", disabled: s, children: [
      /* @__PURE__ */ e.jsx($, {}),
      " ",
      n("Add field")
    ] }) }),
    /* @__PURE__ */ e.jsx(l.DropdownMenuContent, { align: "end", className: "cf:max-h-96 cf:overflow-y-auto", children: Mn(t).map((i, r) => /* @__PURE__ */ e.jsxs("div", { children: [
      r > 0 && /* @__PURE__ */ e.jsx(l.DropdownMenuSeparator, {}),
      /* @__PURE__ */ e.jsx(l.DropdownMenuLabel, { children: i.label }),
      i.types.map((a) => /* @__PURE__ */ e.jsx(l.DropdownMenuItem, { onSelect: () => o(a), children: Ze(a) }, a))
    ] }, i.label)) })
  ] });
}
function Fa({ draft: t }) {
  const { controller: s, state: o } = t;
  return o.conflict ? /* @__PURE__ */ e.jsxs(
    Oe,
    {
      tone: "error",
      title: n("Someone else saved this form"),
      text: n("Your edits are kept here but not saved. Load their version (your edits are lost), or keep yours and save over it."),
      children: [
        /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", onClick: () => {
          s.reload();
        }, children: n("Load their version") }),
        /* @__PURE__ */ e.jsx(l.Button, { size: "sm", onClick: () => {
          s.rebaseLocal().then(() => t.saveNow());
        }, children: n("Keep mine") })
      ]
    }
  ) : t.lockError ? /* @__PURE__ */ e.jsx(Oe, { tone: "warning", title: n("Another admin is editing this form"), text: t.lockError }) : o.error ? /* @__PURE__ */ e.jsxs(Oe, { tone: "error", title: n("The draft was not saved"), text: o.error, children: [
    /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", onClick: () => t.saveNow(), children: n("Try again") }),
    o.issues.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "cf:mt-2 cf:w-full cf:list-disc cf:pl-5 cf:text-sm", children: o.issues.slice(0, 10).map((i, r) => /* @__PURE__ */ e.jsx("li", { children: i.message }, r)) })
  ] }) : null;
}
function Oe({ tone: t, title: s, text: o, children: i }) {
  return /* @__PURE__ */ e.jsxs("div", { role: "alert", className: `cf:flex cf:flex-wrap cf:items-center cf:gap-3 cf:rounded-lg cf:border cf:p-4 ${t === "error" ? "cf:border-destructive/50 cf:bg-destructive/5" : "cf:border-amber-500/50 cf:bg-amber-500/5"}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "cf:min-w-0 cf:flex-1", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:font-medium", children: s }),
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: o })
    ] }),
    i
  ] });
}
export {
  Ya as default
};
