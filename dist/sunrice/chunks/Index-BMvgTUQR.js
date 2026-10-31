import { c as ne, j as e, u as l, _ as n, b as P, s as R, e as Q, i as rn, a as ln, d as de, r as Vt } from "./urls-BB4MaRFd.js";
import { e as ue, r as on, u as He, w as cn, m as it, a as rt, c as dn, d as un, D as fn, p as hn, f as gn, g as mn, h as pn, i as bn, j as xn } from "./model-BTuNCoDr.js";
import { T as V } from "./trash--O34YeeQ.js";
import { P as $, R as vn } from "./rotate-ccw-DUMRnzt7.js";
import { i as Ot, n as X, r as lt, C as Ke } from "./value-BDnwcnnV.js";
import { C as yn, D as jn } from "./download-BomVY03l.js";
import { u as wn } from "./useConfirm-BbCeRslr.js";
const zt = {
  name: "external-link",
  size: 24,
  node: [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
  ]
};
zt.node;
const Ht = ne(zt);
const Kt = {
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
Kt.node;
const kn = ne(Kt);
const Yt = {
  name: "redo-2",
  size: 24,
  node: [
    ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
    ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
  ]
};
Yt.node;
const Cn = ne(Yt);
const Jt = {
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
Jt.node;
const Sn = ne(Jt);
const Gt = {
  name: "undo-2",
  size: 24,
  node: [
    ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
    ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
  ]
};
Gt.node;
const Nn = ne(Gt);
function Tn({ form: t, onChange: i }) {
  const { schema: o } = t, s = t.settings.completion, r = s?.defaultEndingId ?? o.endings[0]?.id ?? "", a = (d) => i({
    ...t,
    schema: { ...o, endings: o.endings.map((f) => f.id === d.id ? d : f) }
  }), c = (d) => i({
    ...t,
    settings: { ...t.settings, completion: { ...s, defaultEndingId: r, ...d } }
  }), u = () => i({
    ...t,
    schema: { ...o, endings: [...o.endings, { id: He("end"), type: "message", messages: [n("Thank you!")] }] }
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
    /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsx(l.CardHeader, { children: /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Finishing") }) }),
      /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: "cf-default-ending", children: n("Default ending") }),
          /* @__PURE__ */ e.jsxs(l.Select, { value: r, onValueChange: (d) => c({ defaultEndingId: d }), children: [
            /* @__PURE__ */ e.jsx(l.SelectTrigger, { id: "cf-default-ending", children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
            /* @__PURE__ */ e.jsx(l.SelectContent, { children: o.endings.map((d, f) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: d.id, children: ue(d, f) }, d.id)) })
          ] }),
          /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("Used unless a rule chooses another ending.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: "cf-review", children: n("After the last question") }),
          /* @__PURE__ */ e.jsxs(l.Select, { value: s?.review ?? "off", onValueChange: (d) => c({ review: d }), children: [
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
        /* @__PURE__ */ e.jsx(l.CardTitle, { className: "cf:truncate", children: ue(d, f) }),
        /* @__PURE__ */ e.jsx(
          l.Button,
          {
            variant: "ghost",
            size: "icon",
            className: "cf:size-8",
            "aria-label": n("Remove ending"),
            disabled: o.endings.length <= 1,
            onClick: () => i(on(t, d.id)),
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
function Ze({ label: t, value: i, validate: o, onCommit: s, help: r }) {
  const a = P.useId(), [c, u] = P.useState(i), [d, f] = P.useState("");
  P.useEffect(() => {
    u(i), f("");
  }, [i]);
  const g = () => {
    if (c === i) return;
    const m = o(c);
    f(m), m || s(c);
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
          m.key === "Enter" && g(), m.key === "Escape" && (u(i), f(""));
        }
      }
    ),
    /* @__PURE__ */ e.jsx("p", { id: `${a}-help`, className: d ? "cf:text-xs cf:text-destructive" : "cf:text-xs cf:text-muted-foreground", children: d || r })
  ] });
}
const En = [
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
function Ye(t) {
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
function Wt(t) {
  return { answer: n("Answer"), variable: n("Variable"), hidden: n("Hidden value"), url: n("URL parameter") }[t];
}
function oe(t) {
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
const Je = (t) => t === "is_empty" || t === "is_not_empty", se = (t) => t === "in" || t === "not_in", ot = (t) => t === "between";
function Ge(t) {
  return "field" in t;
}
function te(t) {
  return { field: t.steps[0]?.key ?? "field", source: "answer", op: "eq", value: "" };
}
function Bn(t, i) {
  const o = t.steps.findIndex((r) => r.id === i), s = t.steps[o + 1] ?? t.steps[0];
  return { if: { all: [te(t)] }, then: { action: "jump", to: s?.id ?? "" } };
}
function In(t) {
  return Array.isArray(t) ? t.map(String).join(", ") : t == null ? "" : String(t);
}
function We(t, i) {
  if ("all" in t || "any" in t) {
    const r = "all" in t ? t.all : t.any;
    return r.length ? r.map((c) => Ge(c) ? We(c, i) : `(${We(c, i)})`).join("all" in t ? ` ${n("and")} ` : ` ${n("or")} `) : n("always");
  }
  const o = t.source ?? "answer", s = o === "answer" ? i.steps.find((r) => r.key === t.field)?.label || t.field : `${Wt(o)} ${t.field}`;
  return Je(t.op) ? `${s} ${Ye(t.op)}` : `${s} ${Ye(t.op)} ${In(t.value)}`;
}
function An(t, i) {
  if (t.action === "set_variable") {
    const s = t.operation === "add" ? "+" : t.operation === "subtract" ? "−" : "=";
    return `${oe("set_variable")} ${t.key} ${s} ${String(t.value)}`;
  }
  if (t.action === "end") {
    const s = i.endings.findIndex((r) => r.id === t.to);
    return `${oe("end")} ${s >= 0 ? R(n("ending %d"), s + 1) : t.to}`;
  }
  const o = i.steps.find((s) => s.id === t.to);
  return `${oe(t.action)} ${o ? o.label || o.key : t.to}`;
}
const _n = 50;
function Mn({ schema: t, rules: i, onChange: o, after: s, actions: r = ["jump", "show", "hide", "require", "unrequire", "end", "set_variable"] }) {
  const a = (c, u) => o(i.map((d, f) => f === c ? u : d));
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
    i.map((c, u) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3 cf:rounded-md cf:border cf:p-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
        /* @__PURE__ */ e.jsx("span", { className: "cf:text-sm cf:font-medium", children: n("If") }),
        /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", className: "cf:size-8", "aria-label": n("Remove rule"), onClick: () => o(i.filter((d, f) => f !== u)), children: /* @__PURE__ */ e.jsx(V, {}) })
      ] }),
      /* @__PURE__ */ e.jsx(fe, { schema: t, value: c.if, onChange: (d) => a(u, { ...c, if: d }) }),
      /* @__PURE__ */ e.jsx("span", { className: "cf:text-sm cf:font-medium", children: n("Then") }),
      /* @__PURE__ */ e.jsx(Rn, { schema: t, value: c.then, actions: r, onChange: (d) => a(u, { ...c, then: d }) })
    ] }, u)),
    /* @__PURE__ */ e.jsxs(
      l.Button,
      {
        variant: "outline",
        size: "sm",
        className: "cf:self-start",
        disabled: i.length >= _n || !t.steps.length,
        onClick: () => o([...i, Bn(t, s)]),
        children: [
          /* @__PURE__ */ e.jsx($, {}),
          " ",
          n("Add rule")
        ]
      }
    )
  ] });
}
function fe({ schema: t, value: i, onChange: o, depth: s = 0 }) {
  const r = Ge(i) ? { all: [i] } : i, a = "any" in r ? "any" : "all", c = "any" in r ? r.any : r.all, u = (d) => o(a === "any" ? { any: d } : { all: d });
  return /* @__PURE__ */ e.jsxs("div", { className: `cf:flex cf:flex-col cf:gap-2 ${s ? "cf:rounded-md cf:border-l-2 cf:pl-3" : ""}`, children: [
    c.length > 1 && /* @__PURE__ */ e.jsxs(l.Select, { value: a, onValueChange: (d) => o(d === "any" ? { any: c } : { all: c }), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { className: "cf:w-48", "aria-label": n("Match"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "all", children: n("All of these are true") }),
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "any", children: n("Any of these is true") })
      ] })
    ] }),
    c.map((d, f) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-start cf:gap-2", children: [
      /* @__PURE__ */ e.jsx("div", { className: "cf:min-w-0 cf:flex-1", children: Ge(d) ? /* @__PURE__ */ e.jsx(Pn, { schema: t, value: d, onChange: (g) => u(c.map((m, h) => h === f ? g : m)) }) : /* @__PURE__ */ e.jsx(fe, { schema: t, value: d, depth: s + 1, onChange: (g) => u(c.map((m, h) => h === f ? g : m)) }) }),
      /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", className: "cf:size-8 cf:shrink-0", "aria-label": n("Remove condition"), onClick: () => u(c.filter((g, m) => m !== f)), children: /* @__PURE__ */ e.jsx(V, {}) })
    ] }, f)),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-2", children: [
      /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => u([...c, te(t)]), children: [
        /* @__PURE__ */ e.jsx($, {}),
        " ",
        n("Condition")
      ] }),
      s < 2 && /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => u([...c, { any: [te(t)] }]), children: [
        /* @__PURE__ */ e.jsx($, {}),
        " ",
        n("Group")
      ] })
    ] }),
    !c.length && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("No conditions: the rule always applies.") })
  ] });
}
function Pn({ schema: t, value: i, onChange: o }) {
  const s = i.source ?? "answer", r = s === "answer" ? t.steps.find((c) => c.key === i.field) : void 0, a = r?.options?.length ? r.options : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-2 cf:sm:grid-cols-[8rem_minmax(0,1fr)_10rem_minmax(0,1fr)]", children: [
    /* @__PURE__ */ e.jsxs(l.Select, { value: s, onValueChange: (c) => {
      const u = c, d = u === "answer" ? t.steps[0]?.key : u === "variable" ? t.variables?.[0]?.key : "";
      o({ ...i, source: u, field: d ?? "", value: "" });
    }, children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Compare"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: ["answer", "variable", "hidden", "url"].map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c, children: Wt(c) }, c)) })
    ] }),
    s === "answer" || s === "variable" ? /* @__PURE__ */ e.jsxs(l.Select, { value: i.field, onValueChange: (c) => o({ ...i, field: c, value: "" }), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": s === "answer" ? n("Question") : n("Variable"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Choose…") }) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: s === "answer" ? t.steps.map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c.key, children: c.label || c.key }, c.id)) : (t.variables ?? []).map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c.key, children: c.key }, c.key)) })
    ] }) : /* @__PURE__ */ e.jsx(
      l.Input,
      {
        "aria-label": n("Name"),
        value: i.field,
        placeholder: s === "url" ? "utm_source" : "field_key",
        onChange: (c) => o({ ...i, field: c.target.value })
      }
    ),
    /* @__PURE__ */ e.jsxs(l.Select, { value: i.op, onValueChange: (c) => {
      const u = c;
      o({ ...i, op: u, value: Je(u) ? void 0 : se(u) || ot(u) ? [] : "" });
    }, children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Operator"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: En.map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c, children: Ye(c) }, c)) })
    ] }),
    !Je(i.op) && (ot(i.op) ? /* @__PURE__ */ e.jsx("div", { className: "cf:grid cf:grid-cols-2 cf:gap-2", children: [0, 1].map((c) => /* @__PURE__ */ e.jsx(
      l.Input,
      {
        "aria-label": c ? n("To") : n("From"),
        value: String((Array.isArray(i.value) ? i.value : [])[c] ?? ""),
        onChange: (u) => {
          const d = [...Array.isArray(i.value) ? i.value : [], "", ""].slice(0, 2);
          d[c] = Qe(u.target.value), o({ ...i, value: d });
        }
      },
      c
    )) }) : a && !se(i.op) ? /* @__PURE__ */ e.jsxs(l.Select, { value: String(i.value ?? ""), onValueChange: (c) => o({ ...i, value: c }), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Value"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Choose…") }) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: a.map((c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: c.value, children: c.label }, c.id)) })
    ] }) : /* @__PURE__ */ e.jsx(
      l.Input,
      {
        "aria-label": n("Value"),
        value: Array.isArray(i.value) ? i.value.join(", ") : String(i.value ?? ""),
        placeholder: se(i.op) ? n("a, b, c") : "",
        onChange: (c) => o({
          ...i,
          value: se(i.op) ? c.target.value.split(",").map((u) => u.trim()).filter(Boolean) : Qe(c.target.value)
        })
      }
    ))
  ] });
}
function Qe(t) {
  return t.trim() !== "" && Number.isFinite(Number(t)) && !/^0\d/.test(t.trim()) ? Number(t) : t;
}
function Rn({ schema: t, value: i, actions: o, onChange: s }) {
  const r = (a) => {
    s(a === "set_variable" ? { action: a, key: t.variables?.[0]?.key ?? "", operation: "set", value: "" } : a === "end" ? { action: a, to: t.endings[0]?.id ?? "" } : { action: a, to: "to" in i && i.action !== "end" ? i.to : t.steps[0]?.id ?? "" });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-2 cf:sm:grid-cols-[10rem_minmax(0,1fr)]", children: [
    /* @__PURE__ */ e.jsxs(l.Select, { value: i.action, onValueChange: (a) => r(a), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Action"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: o.map((a) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: a, children: oe(a) }, a)) })
    ] }),
    i.action === "set_variable" ? /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:grid-cols-3 cf:gap-2", children: [
      /* @__PURE__ */ e.jsxs(l.Select, { value: i.key, onValueChange: (a) => s({ ...i, key: a }), children: [
        /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Variable"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Variable") }) }),
        /* @__PURE__ */ e.jsx(l.SelectContent, { children: (t.variables ?? []).map((a) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: a.key, children: a.key }, a.key)) })
      ] }),
      /* @__PURE__ */ e.jsxs(l.Select, { value: i.operation, onValueChange: (a) => s({ ...i, operation: a }), children: [
        /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Operation"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
        /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
          /* @__PURE__ */ e.jsx(l.SelectItem, { value: "set", children: n("to") }),
          /* @__PURE__ */ e.jsx(l.SelectItem, { value: "add", children: n("plus") }),
          /* @__PURE__ */ e.jsx(l.SelectItem, { value: "subtract", children: n("minus") })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(l.Input, { "aria-label": n("Value"), value: String(i.value ?? ""), onChange: (a) => s({ ...i, value: Qe(a.target.value) }) })
    ] }) : /* @__PURE__ */ e.jsxs(l.Select, { value: i.to, onValueChange: (a) => s({ ...i, to: a }), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Target"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Choose…") }) }),
      /* @__PURE__ */ e.jsx(l.SelectContent, { children: i.action === "end" ? t.endings.map((a, c) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: a.id, children: ue(a, c) }, a.id)) : t.steps.map((a) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: a.id, children: a.label || a.key }, a.id)) })
    ] })
  ] });
}
function et(t) {
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
function Ln(t) {
  const i = [
    { label: n("Basic"), types: ["statement", "short_text", "long_text", "email", "phone", "number", "date"] },
    { label: n("Choices"), types: ["single_choice", "multi_choice", "yes_no", "consent"] },
    { label: n("Ratings"), types: ["rating", "scale", "nps", "slider"] },
    { label: n("Advanced"), types: ["address", "media", "file_upload", "calculated", "hidden", "summary"] }
  ], o = new Set(i.flatMap((s) => s.types));
  return [
    ...i.map((s) => ({ ...s, types: s.types.filter((r) => t.includes(r)) })),
    { label: n("Other"), types: t.filter((s) => !o.has(s)) }
  ].filter((s) => s.types.length > 0);
}
function Qt(t) {
  return !["statement", "summary", "media", "hidden", "calculated"].includes(t);
}
const ie = ["short_text", "long_text", "email", "phone"];
function Dn() {
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
    { path: "validation.minLength", label: n("Minimum length"), kind: "number", section: "validation", types: ie },
    { path: "validation.maxLength", label: n("Maximum length"), kind: "number", section: "validation", types: ie },
    {
      path: "validation.format",
      label: n("Format"),
      kind: "select",
      section: "validation",
      types: ie,
      fallback: "text",
      options: () => [{ value: "text", label: n("Any text") }, { value: "url", label: n("URL") }, { value: "email", label: n("Email address") }]
    },
    { path: "validation.pattern", label: n("Custom pattern (regular expression)"), kind: "text", section: "validation", types: ie },
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
function be(t, i) {
  return Dn().filter((o) => o.section === i && (o.types === "all" || (o.types === "input" ? Qt(t) : o.types.includes(t))));
}
function $n(t, i) {
  return i.split(".").reduce((o, s) => o && typeof o == "object" ? o[s] : void 0, t);
}
function qn(t, i, o) {
  const s = i.split("."), r = (a, c) => {
    const u = { ...a ?? {} }, d = s[c];
    if (c === s.length - 1)
      o === void 0 || o === "" ? delete u[d] : u[d] = o;
    else {
      const f = r(u[d], c + 1);
      f && Object.keys(f).length ? u[d] = f : delete u[d];
    }
    return u;
  };
  return r(t, 0);
}
const J = "__inherit";
function ce({ target: t, setting: i, onChange: o }) {
  const s = P.useId(), r = $n(t, i.path), a = r ?? i.fallback, c = (h) => o(qn(t, i.path, h)), u = i.help?.(), d = i.inherited?.(), f = d === void 0 ? "" : typeof d == "boolean" ? d ? n("On") : n("Off") : String(d), g = R(n("Site default (%s)"), f || n("empty"));
  if (i.kind === "toggle" && i.inherited)
    return /* @__PURE__ */ e.jsx(ct, { id: s, label: i.label, help: u, children: /* @__PURE__ */ e.jsxs(l.Select, { value: r === void 0 ? J : r ? "on" : "off", onValueChange: (h) => c(h === J ? void 0 : h === "on"), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { id: s, children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: J, children: g }),
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "on", children: n("On") }),
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "off", children: n("Off") })
      ] })
    ] }) });
  if (i.kind === "toggle") {
    const h = i.invert ? a === !1 : !!a;
    return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-start cf:justify-between cf:gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1", children: [
        /* @__PURE__ */ e.jsx(l.Label, { htmlFor: s, children: i.label }),
        u && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: u })
      ] }),
      /* @__PURE__ */ e.jsx(l.Switch, { id: s, checked: h, onCheckedChange: (v) => c(i.invert ? !v : v) })
    ] });
  }
  if (i.kind === "checklist") {
    const h = Array.isArray(a) ? a : [];
    return /* @__PURE__ */ e.jsxs("fieldset", { className: "cf:flex cf:flex-col cf:gap-2", children: [
      /* @__PURE__ */ e.jsx("legend", { className: "cf:mb-1 cf:text-sm cf:font-medium", children: i.label }),
      i.options?.().map((v) => /* @__PURE__ */ e.jsxs("label", { className: "cf:flex cf:items-center cf:gap-2 cf:text-sm", children: [
        /* @__PURE__ */ e.jsx(
          l.Checkbox,
          {
            checked: h.includes(v.value),
            onCheckedChange: (k) => c(k ? [...h.filter((y) => y !== v.value), v.value] : h.filter((y) => y !== v.value))
          }
        ),
        v.label
      ] }, v.value))
    ] });
  }
  const m = i.inherited ? g : i.fallback !== void 0 && typeof i.fallback != "object" ? String(i.fallback) : void 0;
  return /* @__PURE__ */ e.jsx(ct, { id: s, label: i.label, help: u, children: i.kind === "select" ? /* @__PURE__ */ e.jsxs(l.Select, { value: r === void 0 && i.inherited ? J : String(a ?? ""), onValueChange: (h) => c(h === J ? void 0 : h), children: [
    /* @__PURE__ */ e.jsx(l.SelectTrigger, { id: s, children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
    /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
      i.inherited && /* @__PURE__ */ e.jsx(l.SelectItem, { value: J, children: g }),
      i.options?.().map((h) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: h.value, children: h.label }, h.value))
    ] })
  ] }) : i.kind === "textarea" ? /* @__PURE__ */ e.jsx(l.Textarea, { id: s, rows: 3, value: String(r ?? ""), placeholder: m, onChange: (h) => c(h.target.value) }) : i.kind === "number" ? /* @__PURE__ */ e.jsx(Fn, { id: s, value: typeof r == "number" ? r : void 0, placeholder: m, min: i.min, max: i.max, onChange: c }) : i.kind === "list" ? /* @__PURE__ */ e.jsx(
    l.Input,
    {
      id: s,
      value: Array.isArray(r) ? r.join(", ") : "",
      onChange: (h) => c(h.target.value.split(",").map((v) => v.trim()).filter(Boolean))
    }
  ) : i.kind === "color" ? /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-2", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "color",
        "aria-label": R(n("%s colour picker"), i.label),
        className: "cf:h-9 cf:w-12 cf:shrink-0 cf:cursor-pointer cf:rounded-md cf:border cf:bg-transparent",
        style: /^#[0-9a-f]{6}$/i.test(String(r ?? "")) ? void 0 : { opacity: 0.35 },
        value: /^#[0-9a-f]{6}$/i.test(String(r ?? "")) ? String(r) : "#ffffff",
        onChange: (h) => c(h.target.value)
      }
    ),
    /* @__PURE__ */ e.jsx(l.Input, { id: s, value: String(r ?? ""), placeholder: m ?? n("Default"), onChange: (h) => c(h.target.value) })
  ] }) : /* @__PURE__ */ e.jsx(
    l.Input,
    {
      id: s,
      type: i.kind === "date" ? "date" : "text",
      value: String(r ?? ""),
      placeholder: m,
      onChange: (h) => c(i.upper ? h.target.value.toUpperCase() : h.target.value)
    }
  ) });
}
function ct({ id: t, label: i, help: o, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(l.Label, { htmlFor: t, children: i }),
    s,
    o && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: o })
  ] });
}
function Fn({ id: t, value: i, placeholder: o, min: s, max: r, onChange: a }) {
  const [c, u] = P.useState(i === void 0 ? "" : String(i));
  return P.useEffect(() => u(i === void 0 ? "" : String(i)), [i]), /* @__PURE__ */ e.jsx(
    l.Input,
    {
      id: t,
      type: "number",
      inputMode: "decimal",
      value: c,
      placeholder: o,
      min: s,
      max: r,
      onChange: (d) => {
        u(d.target.value), d.target.value === "" ? a(void 0) : Number.isFinite(Number(d.target.value)) && a(Number(d.target.value));
      }
    }
  );
}
const Un = /^[a-z][a-z0-9_]{0,63}$/, xe = 200;
function Vn({ step: t, schema: i, reservedValues: o, onChange: s, onRenameKey: r, onRenameOption: a, actions: c }) {
  const u = Qt(t.type), d = be(t.type, "validation");
  return /* @__PURE__ */ e.jsxs(l.Card, { className: "cf:gap-4", children: [
    /* @__PURE__ */ e.jsxs(l.CardHeader, { className: "cf:flex cf:flex-row cf:items-start cf:justify-between cf:gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:min-w-0", children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { className: "cf:truncate", children: t.label || t.key }),
        /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: et(t.type) })
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
        /* @__PURE__ */ e.jsx(Mn, { schema: i, rules: t.logic ?? [], after: t.id, onChange: (f) => s({ ...t, logic: f }) })
      ] }),
      /* @__PURE__ */ e.jsxs(l.TabsContent, { value: "content", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsx(On, { step: t, onChange: s }),
        u && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-required-${t.id}`, children: n("Required") }),
          /* @__PURE__ */ e.jsx(
            l.Switch,
            {
              id: `cf-required-${t.id}`,
              checked: t.required || t.type === "consent",
              disabled: t.type === "consent",
              onCheckedChange: (f) => s({ ...t, required: f })
            }
          )
        ] }),
        be(t.type, "content").map((f) => /* @__PURE__ */ e.jsx(ce, { target: t, setting: f, onChange: s }, f.path)),
        (t.type === "single_choice" || t.type === "multi_choice") && /* @__PURE__ */ e.jsx(zn, { step: t, schema: i, reservedValues: o, onChange: s, onRenameOption: a }),
        ["rating", "scale", "nps"].includes(t.type) && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("Rating: 1–5, scale: 1–10, NPS: 0–10. Answers are stored as numbers.") })
      ] }),
      d.length > 0 && /* @__PURE__ */ e.jsx(l.TabsContent, { value: "validation", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: d.map((f) => /* @__PURE__ */ e.jsx(ce, { target: t, setting: f, onChange: s }, `${f.path}-${f.label}`)) }),
      /* @__PURE__ */ e.jsxs(l.TabsContent, { value: "advanced", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-label-${t.id}`, children: n("Label") }),
          /* @__PURE__ */ e.jsx(l.Input, { id: `cf-label-${t.id}`, value: t.label, onChange: (f) => s({ ...t, label: f.target.value }) }),
          /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("How the question is named in the inbox, exports and emails. Follows the first message until you change it.") })
        ] }),
        /* @__PURE__ */ e.jsx(
          Ze,
          {
            label: n("Field key"),
            value: t.key,
            onCommit: r,
            validate: (f) => Un.test(f) ? i.steps.some((g) => g.id !== t.id && g.key === f) ? n("Another field already uses this key.") : "" : n("Start with a lowercase letter; use only lowercase letters, numbers and underscores (64 max)."),
            help: n("Applied when you leave the field. Rules, merge tags, formulas and notifications that use the old key are updated.")
          }
        ),
        be(t.type, "advanced").map((f) => /* @__PURE__ */ e.jsx(ce, { target: t, setting: f, onChange: s }, f.path))
      ] })
    ] }, t.id) })
  ] });
}
function On({ step: t, onChange: i }) {
  const o = (s) => i(cn(t, s));
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
    t.messages.map((s, r) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
        /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-message-${t.id}-${r}`, children: t.messages.length > 1 ? R(n("Message %d"), r + 1) : n("Bot message") }),
        t.messages.length > 1 && /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "sm", className: "cf:h-7 cf:text-destructive", onClick: () => o(t.messages.filter((a, c) => c !== r)), children: n("Remove") })
      ] }),
      /* @__PURE__ */ e.jsx(
        l.Textarea,
        {
          id: `cf-message-${t.id}-${r}`,
          rows: 2,
          value: s,
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
function zn({ step: t, schema: i, reservedValues: o, onChange: s, onRenameOption: r }) {
  const a = t.options ?? [], [c, u] = P.useState(""), d = (h) => s({ ...t, options: h }), f = () => [...o, ...a.map((h) => h.value)], g = () => {
    const h = R(n("Option %d"), a.length + 1);
    d([...a, it(rt(h, f()), h)]);
  }, m = () => {
    const h = f(), v = c.split(`
`).map((k) => k.trim()).filter(Boolean).slice(0, xe - a.length).map((k) => {
      const y = rt(k, h);
      return h.push(y), it(y, k);
    });
    d([...a, ...v]), u("");
  };
  return /* @__PURE__ */ e.jsxs("fieldset", { className: "cf:flex cf:flex-col cf:gap-3", children: [
    /* @__PURE__ */ e.jsx("legend", { className: "cf:mb-1 cf:text-sm cf:font-medium", children: n("Options") }),
    /* @__PURE__ */ e.jsx(l.SortableList, { items: a, getId: (h) => h.id, getLabel: (h) => h.label, onReorder: (h) => d(h), children: (h, { handle: v }) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2 cf:rounded-md cf:border cf:p-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(l.SortableHandle, { ...v, label: R(n("Move %s"), h.label) }),
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
            Ze,
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
            Hn,
            {
              option: h,
              step: t,
              schema: i,
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
    /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: a.length >= xe, onClick: g, children: [
      /* @__PURE__ */ e.jsx($, {}),
      " ",
      n("Add option")
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-bulk-${t.id}`, children: n("Add several (one per line)") }),
      /* @__PURE__ */ e.jsx(l.Textarea, { id: `cf-bulk-${t.id}`, rows: 3, value: c, onChange: (h) => u(h.target.value) }),
      /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: !c.trim() || a.length >= xe, onClick: m, children: n("Add these options") })
    ] })
  ] });
}
function Hn({ option: t, step: i, schema: o, onChange: s }) {
  const r = t.logic ?? [], a = r.length === 1 ? r[0] : null, c = a && "all" in a.if && a.if.all.length === 0 && a.then.action === "jump" ? a.then.to : "";
  if (r.length && !c)
    return /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: R(n("This choice has %d rules of its own."), r.length) });
  const u = o.steps.slice(o.steps.findIndex((d) => d.id === i.id) + 1);
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(l.Label, { children: n("When chosen, continue to") }),
    /* @__PURE__ */ e.jsxs(l.Select, { value: c || "next", onValueChange: (d) => s(d === "next" ? [] : [{ if: { all: [] }, then: { action: "jump", to: d } }]), children: [
      /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("When chosen, continue to"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
      /* @__PURE__ */ e.jsxs(l.SelectContent, { children: [
        /* @__PURE__ */ e.jsx(l.SelectItem, { value: "next", children: n("The next question") }),
        u.map((d) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: d.id, children: d.label || d.key }, d.id))
      ] })
    ] })
  ] });
}
function Kn(t) {
  return t.runtimeUrl || `${t.pluginUrl}build/runtime/runtime.js`;
}
function Yn(t, i) {
  const o = t.settings.sessions ?? {};
  return {
    form: {
      id: t.id || 1,
      title: t.title,
      slug: t.slug,
      version: t.version,
      schema: t.schema,
      appearance: t.settings.appearance ?? i.defaults?.appearance ?? {},
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
    features: { ...i.features, engagement: !1 }
  };
}
function Jn(t) {
  typeof t == "function" ? t() : t?.unmount ? t.unmount() : t?.destroy?.();
}
function dt({ form: t, config: i, height: o = 560 }) {
  const s = P.useRef(null), [r, a] = P.useState(""), [c, u] = P.useState(0), { flowPositions: d, ...f } = t.schema, g = JSON.stringify({ title: t.title, schema: f, settings: t.settings });
  return P.useEffect(() => {
    let m, h = !0;
    const v = window.setTimeout(async () => {
      try {
        const k = await import(
          /* @vite-ignore */
          Kn(i)
        );
        if (!h || !s.current) return;
        s.current.replaceChildren(), m = k.mountRuntime(s.current, {
          form: Yn(t, i),
          preview: !0,
          locale: i.locale,
          context: { now: (/* @__PURE__ */ new Date()).toISOString(), ...t.settings.completion?.defaultEndingId ? { defaultEndingId: t.settings.completion.defaultEndingId } : {} }
        }), a("");
      } catch (k) {
        h && a(Q(k));
      }
    }, 500);
    return () => {
      h = !1, window.clearTimeout(v), Jn(m);
    };
  }, [g, c, i]), /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: n("Preview: answers are not sent or saved.") }),
      /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => u((m) => m + 1), children: [
        /* @__PURE__ */ e.jsx(vn, {}),
        " ",
        n("Start over")
      ] })
    ] }),
    r && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", role: "alert", children: r }),
    /* @__PURE__ */ e.jsx("div", { ref: s, "data-testid": "chat-preview", className: "cf:overflow-auto cf:rounded-lg cf:border cf:bg-background", style: { height: o } })
  ] });
}
const Xe = 1e12;
function ve(t) {
  if (!Number.isFinite(t) || Math.abs(t) > Xe) throw new Error("Invalid calculation.");
  return t;
}
function Gn(t, i = {}, o = {}, s = !1) {
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
      const [h, v] = g.split("."), k = (h === "answer" ? i : o)[v];
      if (k != null && typeof k != "number") throw new Error("Invalid calculation.");
      m = k ?? 0;
    } else if (g && /^[0-9]+(?:\.[0-9]+)?$/.test(g)) m = Number(g);
    else throw new Error("Invalid calculation.");
    for (ve(m); a < r.length; ) {
      const h = r[a], v = h === "+" || h === "-" ? 1 : h === "*" || h === "/" ? 2 : 0;
      if (!v || v < d) break;
      a++;
      const k = c(v + 1, f + 1);
      m = s ? 1 : ve(h === "+" ? m + k : h === "-" ? m - k : h === "*" ? m * k : m / k);
    }
    return ve(m);
  }, u = c();
  if (a !== r.length) throw new Error("Invalid calculation.");
  return Math.floor(u * 1e6 + 0.5) / 1e6 || 0;
}
function Wn(t) {
  const i = [...t.matchAll(/(answer|variable)\.([a-z][a-z0-9_]{0,63})/g)].map((r) => ({ source: r[1], key: r[2] })), o = {}, s = {};
  for (const r of i) (r.source === "answer" ? o : s)[r.key] = 1;
  return Gn(t, o, s, !0), i;
}
function Qn(t, i) {
  const o = JSON.parse(JSON.stringify(t));
  delete o.experiments;
  for (const s of i.copy ?? []) {
    const r = o.steps.find((a) => a.id === s.stepId);
    if (!r) throw new Error("Invalid variant.");
    r.messages = [...s.messages];
  }
  if (i.stepOrder) {
    if (i.stepOrder.length !== o.steps.length || new Set(i.stepOrder).size !== o.steps.length) throw new Error("Invalid variant.");
    o.steps = i.stepOrder.map((s) => {
      const r = o.steps.find((a) => a.id === s);
      if (!r) throw new Error("Invalid variant.");
      return r;
    });
  }
  return o;
}
function Xn(t) {
  const i = [], o = new Map(t.steps.map((f, g) => [f.key, { step: f, index: g }])), s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set([...t.steps.map((f) => f.id), ...t.endings.map((f) => f.id)]), a = new Map((t.variables ?? []).map((f) => [f.key, f.type])), c = (f, g) => i.push(Ot(f, "invalid_power", g));
  for (const [f, g] of (t.flowPositions ?? []).entries())
    (!r.has(g.id) || s.has(g.id)) && c(`/flowPositions/${f}`, "Graph positions must reference unique existing nodes."), s.add(g.id);
  for (const [f, g] of (t.variables ?? []).entries()) typeof g.default == "number" && Math.abs(g.default) > Xe && c(`/variables/${f}`, "Numeric variables are limited to +/- 1e12.");
  t.steps.forEach((f, g) => {
    for (const m of [...f.logic ?? [], ...(f.options ?? []).flatMap((h) => h.logic ?? [])]) m.then.action === "set_variable" && typeof m.then.value == "number" && Math.abs(m.then.value) > Xe && c(`/steps/${g}/logic`, "Numeric variables are limited to +/- 1e12.");
    if (f.type === "calculated")
      try {
        for (const m of Wn(f.settings?.expression ?? ""))
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
    f.variants.forEach((h, v) => {
      const k = `/experiments/${g}/variants/${v}`;
      `${f.id}:${h.id}`.length > 64 && c(k, "Combined experiment and variant identifier must fit 64 ASCII characters."), m.has(h.id) && c(k, "Variant IDs must be unique."), m.add(h.id);
      const y = /* @__PURE__ */ new Set();
      for (const M of h.copy ?? [])
        (!t.steps.some((p) => p.id === M.stepId) || y.has(M.stepId)) && c(k, "Copy references must be unique existing steps."), y.add(M.stepId);
      if (h.stepOrder) {
        const M = /* @__PURE__ */ new Set(["hidden", "summary", "calculated"]), p = new Set(t.steps.flatMap((C) => [...C.logic ?? [], ...(C.options ?? []).flatMap((j) => j.logic ?? [])].filter((j) => j.then.action === "jump").map((j) => "to" in j.then ? j.then.to : "")));
        t.steps.forEach((C, j) => {
          if (C.logic?.length || C.options?.some((x) => x.logic?.length) || C.hiddenByDefault || M.has(C.type) || p.has(C.id)) {
            h.stepOrder[j] !== C.id && c(k, "Order variants must keep branching, hidden, summary and calculated steps fixed.");
            const x = new Set(t.steps.slice(0, j).map((B) => B.id));
            h.stepOrder.slice(0, j).some((B) => !x.has(B)) && c(k, "Order variants cannot cross a dependency boundary.");
          }
        });
        try {
          Qn(t, h);
        } catch {
          c(k, "Step order must be an exact permutation of all steps.");
        }
      }
    });
  }), i;
}
const Zn = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "campaign", "tracking", "cff_locale", "cff_theme"], ea = "Cookie sources are restricted to supported attribution/preference cookies.";
function ta(t) {
  return Zn.some((i) => i === t);
}
function na(t) {
  const i = [], o = (p, C, j) => {
    i.push(Ot(p, C, j));
  };
  if (!Array.isArray(t.steps) || !t.steps.length || t.steps.length > 500 || !Array.isArray(t.endings) || !t.endings.length)
    return o("", "invalid_schema", "The schema needs 1–500 steps and an ending."), i;
  const s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), c = new Map((t.variables ?? []).map((p) => [p.key, p.type])), u = /* @__PURE__ */ new Set();
  (t.variables ?? []).forEach((p, C) => {
    u.has(p.key) && o(`/variables/${C}/key`, "duplicate_key", "Variable keys must be unique."), u.add(p.key), (p.type === "number" ? !X(p.default) : typeof p.default !== p.type) && o(`/variables/${C}/default`, "invalid_variable", "The variable default has an invalid type.");
  });
  const d = new Set(t.endings.map((p) => p.id)), f = (p, C) => {
    s.has(p) && o(C, "duplicate_id", "IDs must be globally unique."), s.add(p);
  };
  t.steps.forEach((p, C) => {
    p.type === "hidden" && p.settings?.source === "cookie" && !ta(p.settings.sourceKey ?? p.key) && o(`/steps/${C}/settings/sourceKey`, "restricted_cookie", ea), r.has(p.key) && o(`/steps/${C}/key`, "duplicate_key", "Field keys must be unique."), r.set(p.key, C), a.set(p.id, C), f(p.id, `/steps/${C}/id`);
    const j = /* @__PURE__ */ new Set();
    (p.options ?? []).forEach((x, B) => {
      f(x.id, `/steps/${C}/options/${B}/id`), j.has(x.value) && o(`/steps/${C}/options/${B}/value`, "duplicate_value", "Option values must be unique."), j.add(x.value);
    });
  }), t.endings.forEach((p, C) => {
    f(p.id, `/endings/${C}/id`), (p.buttons ?? []).forEach((j, x) => f(j.id, `/endings/${C}/buttons/${x}/id`));
  }), (t.groups ?? []).forEach((p, C) => {
    f(p.id, `/groups/${C}/id`), p.stepIds.forEach((j, x) => {
      a.has(j) || o(`/groups/${C}/stepIds/${x}`, "missing_reference", "The referenced step does not exist.");
    });
  });
  const g = (p, C, j, x = 0) => {
    if (x > 64) {
      o(C, "condition_depth", "Conditions may nest at most 64 levels.");
      return;
    }
    if ("all" in p || "any" in p) {
      const w = "all" in p ? "all" : "any";
      ("all" in p ? p.all : p.any).forEach((N, T) => g(N, `${C}/${w}/${T}`, j, x + 1));
      return;
    }
    const B = p.source ?? "answer";
    B === "answer" ? r.has(p.field) ? r.get(p.field) > j && o(C + "/field", "later_reference", "This condition references a later answer.") : o(C + "/field", "missing_reference", "The referenced answer does not exist.") : B === "variable" && !c.has(p.field) && o(C + "/field", "missing_reference", "The referenced variable does not exist."), p.op === "matches" && !lt(p.value) && o(C + "/value", "invalid_pattern", "The validation pattern is not supported.");
  }, m = (p, C) => {
    if (p.action === "set_variable") {
      const j = c.get(p.key);
      j ? (p.value !== null && typeof p.value !== j || p.operation !== "set" && (j !== "number" || typeof p.value != "number")) && o(C, "invalid_variable", "The variable action has an invalid type.") : o(C + "/key", "missing_reference", "The referenced variable does not exist.");
    } else (p.action === "end" ? d : a).has(p.to) || o(C + "/to", "missing_reference", "The navigation or visibility target does not exist.");
  }, h = /* @__PURE__ */ new Map(), v = t.steps.flatMap((p) => [...p.logic ?? [], ...(p.options ?? []).flatMap((C) => C.logic ?? [])]), k = /* @__PURE__ */ new Set([...t.steps.filter((p) => p.hiddenByDefault).map((p) => p.id), ...v.filter((p) => p.then.action === "hide").map((p) => p.then.to)]);
  t.steps.forEach((p, C) => {
    const j = `/steps/${C}`;
    rn(p.type) || o(j + "/type", "unsupported_type", "This field type is not supported."), p.validation?.pattern !== void 0 && !lt(p.validation.pattern) && o(j + "/validation/pattern", "invalid_pattern", "The validation pattern is not supported."), p.validation?.mxCheck && o(j + "/validation/mxCheck", "unsupported_validation", "MX checking is not enabled."), ["single_choice", "multi_choice"].includes(p.type) && !p.options?.length && o(j + "/options", "missing_options", "Choice fields need at least one option."), [...p.logic ?? [], ...(p.options ?? []).flatMap((S) => S.logic ?? [])].forEach((S) => {
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
    B(p.logic ?? [], j + "/logic"), (p.options ?? []).forEach((S, N) => B(S.logic ?? [], `${j}/options/${N}/logic`)), p.options && p.options.length > 200 && o(j + "/options", "invalid_schema", "A field may have at most 200 options.");
    const w = p.validation ?? {};
    if (["rating", "scale", "nps"].includes(p.type) && (w.min !== void 0 || w.max !== void 0 || w.step !== void 0) && o(j + "/validation", "unsupported_validation", "Score fields use a fixed numeric range."), p.type === "slider") {
      const S = w.min ?? 0, N = w.max ?? 100, T = w.step ?? 1;
      (!X(S) || !X(N) || !X(T) || Math.abs(Number(S)) > 1e4 || Math.abs(Number(N)) > 1e4 || Number(S) >= Number(N) || Number(T) <= 0 || Number(T) > Number(N) - Number(S)) && o(j + "/validation", "invalid_range", "Slider bounds and increment must form a valid finite range.");
    }
    for (const [S, N] of [[w.minLength, w.maxLength], [w.minSelections, w.maxSelections], [w.min, w.max]])
      S !== void 0 && N !== void 0 && typeof S == typeof N && S > N && o(j + "/validation", "invalid_range", "Minimum must not exceed maximum.");
    if (w.step !== void 0 && (!X(w.step) || w.step <= 0) && o(j + "/validation/step", "invalid_range", "The numeric increment must be positive."), p.type !== "single_choice" && p.options?.some((S) => S.isOther) && o(j + "/options", "unsupported_other", "Other free text is only supported for single-choice fields."), t.steps[C + 1] && (k.has(p.id) || !p.logic?.some((S) => ["jump", "end"].includes(S.then.action) && "all" in S.if && !S.if.all.length))) {
      const S = h.get(p.id) ?? /* @__PURE__ */ new Set();
      S.add(t.steps[C + 1].id), h.set(p.id, S);
    }
  }), t.steps.forEach((p, C) => {
    if (i.some((B) => B.code === "duplicate_id")) return;
    const j = [...h.get(p.id) ?? []], x = /* @__PURE__ */ new Set();
    for (; j.length; ) {
      const B = j.shift();
      if (B === p.id) {
        o(`/steps/${C}/logic`, "potential_loop", "Navigation rules may revisit this step.");
        break;
      }
      x.has(B) || (x.add(B), j.push(...h.get(B) ?? []));
    }
  });
  const y = /* @__PURE__ */ new Set(), M = [0];
  for (; M.length; ) {
    const p = M.shift();
    if (y.has(p) || !t.steps[p]) continue;
    y.add(p);
    const C = t.steps[p];
    let j = !0;
    for (const x of C.logic ?? []) {
      if (x.then.action === "jump") {
        const B = a.get(x.then.to);
        B !== void 0 && M.push(B);
      }
      if ((x.then.action === "jump" || x.then.action === "end") && "all" in x.if && !x.if.all.length) {
        j = !1;
        break;
      }
    }
    for (const x of C.options ?? []) for (const B of x.logic ?? []) if (B.then.action === "jump") {
      const w = a.get(B.then.to);
      w !== void 0 && M.push(w);
    }
    (j || k.has(C.id)) && M.push(p + 1);
  }
  return t.steps.forEach((p, C) => {
    y.has(C) || o(`/steps/${C}`, "unreachable_step", "No possible navigation path reaches this step.");
  }), [...i, ...Xn(t)];
}
function aa({ form: t, onChange: i, onOpenStep: o }) {
  const { schema: s } = t, r = P.useMemo(() => na(s), [s]), a = (f) => i({ ...t, schema: { ...s, ...f } }), c = s.variables ?? [], u = s.outcomes ?? [], d = s.steps.flatMap((f) => [
    ...(f.logic ?? []).map((g) => ({ step: f, rule: g, option: "" })),
    ...(f.options ?? []).flatMap((g) => (g.logic ?? []).map((m) => ({ step: f, rule: m, option: g.label })))
  ]);
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
    r.length > 0 && /* @__PURE__ */ e.jsxs(l.Card, { className: "cf:border-amber-500/50", children: [
      /* @__PURE__ */ e.jsx(l.CardHeader, { children: /* @__PURE__ */ e.jsx(l.CardTitle, { children: R(n("%d problems to check"), r.length) }) }),
      /* @__PURE__ */ e.jsx(l.CardContent, { children: /* @__PURE__ */ e.jsx("ul", { className: "cf:flex cf:flex-col cf:gap-1 cf:text-sm", children: r.slice(0, 20).map((f, g) => {
        const m = /^\/steps\/(\d+)/.exec(f.path ?? ""), h = m ? s.steps[Number(m[1])] : void 0;
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
          We(g.if, s),
          ": ",
          An(g.then, s)
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
            Ze,
            {
              label: n("Key"),
              value: f.key,
              validate: (g) => /^[a-z][a-z0-9_]{0,63}$/.test(g) ? c.some((m) => m !== f && m.key === g) ? n("Already used.") : "" : n("Lowercase letters, numbers and underscores."),
              onCommit: (g) => i(dn(t, f.key, g))
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
          /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", "aria-label": R(n("Remove %s"), f.key), onClick: () => i(un(t, f.key)), children: /* @__PURE__ */ e.jsx(V, {}) })
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
            /* @__PURE__ */ e.jsxs(l.Select, { value: f.endingId, onValueChange: (m) => a({ outcomes: u.map((h, v) => v === g ? { ...h, endingId: m } : h) }), children: [
              /* @__PURE__ */ e.jsx(l.SelectTrigger, { className: "cf:max-w-xs", "aria-label": n("Ending"), children: /* @__PURE__ */ e.jsx(l.SelectValue, {}) }),
              /* @__PURE__ */ e.jsx(l.SelectContent, { children: s.endings.map((m, h) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: m.id, children: ue(m, h) }, m.id)) })
            ] }),
            /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", "aria-label": n("Remove outcome"), onClick: () => a({ outcomes: u.filter((m, h) => h !== g) }), children: /* @__PURE__ */ e.jsx(V, {}) })
          ] }),
          /* @__PURE__ */ e.jsx("span", { className: "cf:text-sm cf:font-medium", children: n("when") }),
          /* @__PURE__ */ e.jsx(fe, { schema: s, value: f.if, onChange: (m) => a({ outcomes: u.map((h, v) => v === g ? { ...h, if: m } : h) }) })
        ] }, g)),
        /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: u.length >= 50, onClick: () => a({
          outcomes: [...u, { if: { all: [te(s)] }, endingId: s.endings[0].id }]
        }), children: [
          /* @__PURE__ */ e.jsx($, {}),
          " ",
          n("Add outcome")
        ] })
      ] })
    ] })
  ] });
}
const sa = 20, ye = (t) => t.split(",").map((i) => i.trim()).filter(Boolean).slice(0, 15);
function ia({ api: t, form: i, onChange: o, save: s }) {
  const r = i.settings.notifications ?? {}, a = (y) => o({ ...i, settings: { ...i.settings, notifications: y } }), c = (y, M) => a({ ...r, [y]: M }), u = i.schema.steps.filter((y) => y.type === "email"), [d, f] = P.useState(null), [g, m] = P.useState(null), h = (y) => c(y, [...r[y] ?? [], y === "admin" ? { id: He("mail"), enabled: !0, to: [], subject: n("New submission"), body: "{{all_answers}}" } : { id: He("reply"), enabled: !0, emailField: u[0]?.key, subject: n("Thank you for your submission"), body: "{{all_answers}}" }]), v = async (y) => {
    try {
      const M = await s();
      f(await t.request("admin/notifications/preview", "POST", { formId: M.id, notificationId: y.id, answers: {} }));
    } catch (M) {
      l.toast.error(Q(M));
    }
  }, k = (y, M, p) => {
    const C = r[y] ?? [], j = (x) => c(y, C.map((B) => B.id === x.id ? x : B));
    return /* @__PURE__ */ e.jsxs(l.Card, { children: [
      /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
        /* @__PURE__ */ e.jsx(l.CardTitle, { children: M }),
        /* @__PURE__ */ e.jsx(l.CardDescription, { children: p })
      ] }),
      /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
        C.map((x, B) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3 cf:rounded-md cf:border cf:p-4", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between cf:gap-2", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:gap-2", children: [
              /* @__PURE__ */ e.jsx(l.Switch, { checked: x.enabled, "aria-label": n("Enabled"), onCheckedChange: (w) => j({ ...x, enabled: w }) }),
              /* @__PURE__ */ e.jsx("span", { className: "cf:font-medium", children: x.subject || R(n("Email %d"), B + 1) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-1", children: [
              /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => {
                v(x);
              }, children: [
                /* @__PURE__ */ e.jsx(kn, {}),
                " ",
                n("Preview")
              ] }),
              /* @__PURE__ */ e.jsxs(l.Button, { variant: "ghost", size: "sm", onClick: () => m(x), children: [
                /* @__PURE__ */ e.jsx(Sn, {}),
                " ",
                n("Send a test")
              ] }),
              /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", className: "cf:size-8", "aria-label": n("Remove email"), onClick: () => c(y, C.filter((w) => w.id !== x.id)), children: /* @__PURE__ */ e.jsx(V, {}) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-3 cf:sm:grid-cols-3", children: [
            y === "admin" ? /* @__PURE__ */ e.jsx(z, { label: n("To"), value: (x.to ?? []).join(", "), placeholder: "team@example.com", onChange: (w) => j({ ...x, to: ye(w) }) }) : /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
              /* @__PURE__ */ e.jsx(l.Label, { children: n("Send to the address in") }),
              /* @__PURE__ */ e.jsxs(l.Select, { value: x.emailField ?? "", onValueChange: (w) => j({ ...x, emailField: w }), children: [
                /* @__PURE__ */ e.jsx(l.SelectTrigger, { "aria-label": n("Email question"), children: /* @__PURE__ */ e.jsx(l.SelectValue, { placeholder: n("Choose an email question") }) }),
                /* @__PURE__ */ e.jsx(l.SelectContent, { children: u.map((w) => /* @__PURE__ */ e.jsx(l.SelectItem, { value: w.key, children: w.label || w.key }, w.id)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(z, { label: n("Cc"), value: (x.cc ?? []).join(", "), onChange: (w) => j({ ...x, cc: ye(w) }) }),
            /* @__PURE__ */ e.jsx(z, { label: n("Bcc"), value: (x.bcc ?? []).join(", "), onChange: (w) => j({ ...x, bcc: ye(w) }) })
          ] }),
          /* @__PURE__ */ e.jsx(z, { label: n("Subject"), value: x.subject, onChange: (w) => j({ ...x, subject: w }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
            /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-body-${x.id}`, children: n("Message") }),
            /* @__PURE__ */ e.jsx(l.Textarea, { id: `cf-body-${x.id}`, rows: 6, value: x.body, onChange: (w) => j({ ...x, body: w.target.value }) }),
            /* @__PURE__ */ e.jsxs("p", { className: "cf:text-xs cf:text-muted-foreground", children: [
              n("Merge tags: {{all_answers}}, {{field_key}}, {{form_title}}, {{submission_id}}, {{site_name}}, {{date}}"),
              y === "admin" ? ", {{admin_link}}, {{meta_table}}" : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-3 cf:sm:grid-cols-3", children: [
            /* @__PURE__ */ e.jsx(z, { label: n("Reply-to"), value: x.replyTo ?? "", onChange: (w) => j({ ...x, replyTo: w }) }),
            /* @__PURE__ */ e.jsx(z, { label: n("From name"), value: x.fromName ?? "", placeholder: n("Site default"), onChange: (w) => j({ ...x, fromName: w }) }),
            /* @__PURE__ */ e.jsx(
              z,
              {
                label: n("Delay (seconds)"),
                value: x.delaySeconds ? String(x.delaySeconds) : "",
                placeholder: "0",
                onChange: (w) => j({ ...x, delaySeconds: Math.max(0, Math.min(86400, Number(w) || 0)) })
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
            /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-conditions-${x.id}`, children: n("Only when the answers match") }),
            /* @__PURE__ */ e.jsx(
              l.Switch,
              {
                id: `cf-conditions-${x.id}`,
                checked: !!x.conditions,
                onCheckedChange: (w) => j(w ? { ...x, conditions: { all: [te(i.schema)] } } : (({ conditions: S, ...N }) => N)(x))
              }
            )
          ] }),
          x.conditions && /* @__PURE__ */ e.jsx(fe, { schema: i.schema, value: x.conditions, onChange: (w) => j({ ...x, conditions: w }) })
        ] }, x.id)),
        /* @__PURE__ */ e.jsxs(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: C.length >= sa, onClick: () => h(y), children: [
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
    /* @__PURE__ */ e.jsx(ra, { api: t, form: i, notification: g, onClose: () => m(null) })
  ] });
}
function z({ label: t, value: i, placeholder: o, onChange: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(l.Label, { children: t }),
    /* @__PURE__ */ e.jsx(l.Input, { "aria-label": t, value: i, placeholder: o, onChange: (r) => s(r.target.value) })
  ] });
}
function ra({ api: t, form: i, notification: o, onClose: s }) {
  const [r, a] = P.useState(""), [c, u] = P.useState(!1), d = async () => {
    u(!0);
    try {
      await t.request("admin/notifications/test", "POST", { formId: i.id, notificationId: o.id, to: r }), l.toast.success(R(n("Test email queued to %s."), r)), s();
    } catch (f) {
      l.toast.error(Q(f));
    } finally {
      u(!1);
    }
  };
  return /* @__PURE__ */ e.jsx(l.Dialog, { open: o !== null, onOpenChange: (f) => !f && s(), children: /* @__PURE__ */ e.jsxs(l.DialogContent, { children: [
    /* @__PURE__ */ e.jsxs(l.DialogHeader, { children: [
      /* @__PURE__ */ e.jsx(l.DialogTitle, { children: n("Send a test email") }),
      /* @__PURE__ */ e.jsx(l.DialogDescription, { children: n("Uses the published version of this email, with sample answers. Publish first to test your latest changes.") })
    ] }),
    /* @__PURE__ */ e.jsx(l.Input, { type: "email", "aria-label": n("Send the test to"), placeholder: "you@example.com", value: r, onChange: (f) => a(f.target.value) }),
    /* @__PURE__ */ e.jsxs(l.DialogFooter, { children: [
      /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", onClick: s, children: n("Cancel") }),
      /* @__PURE__ */ e.jsx(l.Button, { disabled: c || !r.includes("@") || i.version < 1, onClick: () => {
        d();
      }, children: n("Send test") })
    ] })
  ] }) });
}
const la = {
  primary: "#3390ec",
  headerBackground: "#ffffff",
  headerText: "#000000",
  chatBackground: "#dbe6ee",
  botBubbleBackground: "#ffffff",
  textColor: "#000000",
  userBubbleBackground: "#e1fec6",
  userTextColor: "#000000"
}, ut = () => [
  { id: "sky", label: n("Sky"), theme: "light", wallpaper: "doodle", colors: { ...la, primary: "#2271b1" } },
  { id: "meadow", label: n("Meadow"), theme: "light", wallpaper: "doodle", colors: { primary: "#008069", headerBackground: "#008069", headerText: "#ffffff", chatBackground: "#efe7de", botBubbleBackground: "#ffffff", textColor: "#111b21", userBubbleBackground: "#d9fdd3", userTextColor: "#111b21" } },
  { id: "lavender", label: n("Lavender"), theme: "light", wallpaper: "gradient", colors: { primary: "#6a46ff", headerBackground: "#ffffff", headerText: "#1e1b3a", chatBackground: "#ece8ff", botBubbleBackground: "#ffffff", textColor: "#1e1b3a", userBubbleBackground: "#6a46ff", userTextColor: "#ffffff" } },
  { id: "sunset", label: n("Sunset"), theme: "light", wallpaper: "dots", colors: { primary: "#c2410c", headerBackground: "#fff4ec", headerText: "#3a1d0e", chatBackground: "#fde6d5", botBubbleBackground: "#ffffff", textColor: "#3a1d0e", userBubbleBackground: "#c2410c", userTextColor: "#ffffff" } },
  { id: "graphite", label: n("Graphite"), theme: "light", wallpaper: "none", colors: { primary: "#18181b", headerBackground: "#ffffff", headerText: "#18181b", chatBackground: "#f4f4f5", botBubbleBackground: "#ffffff", textColor: "#18181b", userBubbleBackground: "#18181b", userTextColor: "#ffffff" } },
  { id: "night", label: n("Night"), theme: "dark", wallpaper: "doodle", colors: { primary: "#5eb5f7", headerBackground: "#17212b", headerText: "#f5f5f5", chatBackground: "#0e1621", botBubbleBackground: "#182533", textColor: "#f5f5f5", userBubbleBackground: "#2b5278", userTextColor: "#ffffff" } }
];
function oa(t, i) {
  return { ...t, ...i.colors, style: "messaging", theme: i.theme, wallpaper: i.wallpaper };
}
function ca({ form: t, onChange: i }) {
  const o = t.settings.appearance ?? {}, s = ut().find((r) => o.style === "messaging" && Object.entries(r.colors).every(([a, c]) => o[a] === c));
  return /* @__PURE__ */ e.jsxs(l.Card, { children: [
    /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
      /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Palettes") }),
      /* @__PURE__ */ e.jsx(l.CardDescription, { children: n("A ready-made Messaging look. You can still change any colour below.") })
    ] }),
    /* @__PURE__ */ e.jsx(l.CardContent, { className: "cf:grid cf:grid-cols-2 cf:gap-3 cf:sm:grid-cols-3", children: ut().map((r) => /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        "aria-pressed": s?.id === r.id,
        onClick: () => i({ ...t, settings: { ...t.settings, appearance: oa(o, r) } }),
        className: "cf:flex cf:flex-col cf:gap-2 cf:rounded-lg cf:border cf:p-3 cf:text-left cf:hover:bg-accent cf:aria-pressed:border-primary cf:aria-pressed:ring-1 cf:aria-pressed:ring-primary",
        children: [
          /* @__PURE__ */ e.jsxs("span", { className: "cf:flex cf:h-10 cf:overflow-hidden cf:rounded-md cf:border", "aria-hidden": "true", children: [
            /* @__PURE__ */ e.jsx("span", { className: "cf:flex-1", style: { background: r.colors.headerBackground } }),
            /* @__PURE__ */ e.jsx("span", { className: "cf:flex-1", style: { background: r.colors.chatBackground } }),
            /* @__PURE__ */ e.jsx("span", { className: "cf:flex-1", style: { background: r.colors.userBubbleBackground } }),
            /* @__PURE__ */ e.jsx("span", { className: "cf:flex-1", style: { background: r.colors.primary } })
          ] }),
          /* @__PURE__ */ e.jsxs("span", { className: "cf:flex cf:items-center cf:justify-between cf:text-sm cf:font-medium", children: [
            r.label,
            s?.id === r.id && /* @__PURE__ */ e.jsx(yn, { className: "cf:size-4", "aria-hidden": "true" })
          ] })
        ]
      },
      r.id
    )) })
  ] });
}
const G = {
  style: "classic",
  wallpaper: "doodle",
  choiceStyle: "keyboard",
  bubbleTails: !0,
  radius: 12,
  width: 720
};
function da(t, i, o) {
  const s = (() => {
    try {
      return new Intl.DisplayNames([i.replace("_", "-"), "en"], { type: "language" });
    } catch {
      return null;
    }
  })(), r = { en: "English", id: "Bahasa Indonesia" }, a = (u) => {
    try {
      return s?.of(u.replace("_", "-")) ?? u;
    } catch {
      return u;
    }
  }, c = (u) => r[u] ?? (a(u) === u ? u : `${a(u)} (${u})`);
  return [{ value: "site", label: o }, ...(t?.length ? t : ["en", "id"]).map((u) => ({ value: u, label: c(u) }))];
}
const Z = (t) => typeof t == "boolean" ? t : void 0;
function ua(t = {}, i, o = "en") {
  const s = n("Look"), r = n("Colours"), a = n("Text"), c = n("Bot"), u = n("Extras"), d = n("Where it shows"), f = n("Sessions and resume"), g = n("Limits"), m = n("Privacy and retention"), h = n("Spam protection"), v = (M, p) => ({ path: `settings.appearance.${M}`, label: p, kind: "color", group: "design", heading: r }), k = t.privacy ?? {}, y = t.spam ?? {};
  return [
    {
      path: "settings.appearance.style",
      label: n("Style"),
      kind: "select",
      group: "design",
      heading: s,
      fallback: G.style,
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
    { path: "settings.appearance.radius", label: n("Corner radius (px)"), kind: "number", group: "design", heading: s, min: 0, max: 32, fallback: G.radius },
    { path: "settings.appearance.width", label: n("Chat width (px)"), kind: "number", group: "design", heading: s, min: 320, max: 1200, fallback: G.width },
    {
      path: "settings.appearance.wallpaper",
      label: n("Wallpaper (messaging style)"),
      kind: "select",
      group: "design",
      heading: s,
      fallback: G.wallpaper,
      options: () => [{ value: "none", label: n("None") }, { value: "doodle", label: n("Doodle") }, { value: "dots", label: n("Dots") }, { value: "gradient", label: n("Gradient") }]
    },
    {
      path: "settings.appearance.choiceStyle",
      label: n("Answer buttons (messaging style)"),
      kind: "select",
      group: "design",
      heading: s,
      fallback: G.choiceStyle,
      options: () => [{ value: "chips", label: n("Chips") }, { value: "keyboard", label: n("Keyboard") }]
    },
    { path: "settings.appearance.bubbleTails", label: n("Bubble tails"), kind: "toggle", group: "design", heading: s, fallback: G.bubbleTails },
    v("primary", n("Accent (buttons, links)")),
    v("botBubbleBackground", n("Bot bubble")),
    v("textColor", n("Bot text")),
    v("userBubbleBackground", n("Visitor bubble")),
    v("userTextColor", n("Visitor text")),
    v("headerBackground", n("Header")),
    v("headerText", n("Header text")),
    v("chatBackground", n("Chat background")),
    {
      path: "settings.appearance.googleFont",
      label: n("Font"),
      kind: "select",
      group: "design",
      heading: a,
      fallback: "system",
      options: () => [{ value: "system", label: n("Device default (no external requests)") }, { value: "Inter", label: "Inter" }, { value: "Roboto", label: "Roboto" }, { value: "Open Sans", label: "Open Sans" }],
      help: () => n("Inter, Roboto and Open Sans load from Google Fonts in the visitor’s browser.")
    },
    { path: "settings.appearance.inheritFont", label: n("Use the page’s font instead"), kind: "toggle", group: "design", heading: a, fallback: !1 },
    { path: "settings.appearance.font", label: n("Custom font stack (CSS font-family)"), kind: "text", group: "design", heading: a },
    { path: "schema.bot.name", label: n("Bot name"), kind: "text", group: "design", heading: c },
    {
      path: "schema.bot.typingSpeed",
      label: n("Typing speed"),
      kind: "select",
      group: "design",
      heading: c,
      fallback: "normal",
      options: () => [{ value: "off", label: n("Off (instant)") }, { value: "fast", label: n("Fast") }, { value: "normal", label: n("Normal") }, { value: "slow", label: n("Slow") }]
    },
    { path: "settings.appearance.confetti", label: n("Confetti when the form is completed"), kind: "toggle", group: "design", heading: u, fallback: !1 },
    { path: "settings.appearance.customCss", label: n("Custom CSS (only inside this form)"), kind: "textarea", group: "design", heading: u },
    {
      path: "settings.display.mode",
      label: n("Display mode"),
      kind: "select",
      group: "general",
      heading: d,
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
      heading: d,
      fallback: "right",
      options: () => [{ value: "right", label: n("Bottom right") }, { value: "left", label: n("Bottom left") }]
    },
    { path: "settings.display.launcher.autoOpenSeconds", label: n("Open by itself after (seconds)"), kind: "number", group: "general", heading: d, min: 0, max: 3600 },
    { path: "settings.display.launcher.scrollPercent", label: n("…or after scrolling (% of the page)"), kind: "number", group: "general", heading: d, min: 0, max: 100 },
    { path: "settings.display.launcher.bottomOffset", label: n("Space below the button (px)"), kind: "number", group: "general", heading: d, min: 0, max: 400, fallback: 0, help: () => n("Raise the chat button above a cookie bar or another fixed bar.") },
    {
      path: "settings.language",
      label: n("Language of built-in texts"),
      kind: "select",
      group: "general",
      heading: d,
      fallback: "site",
      options: () => da(i, o, n("The site’s language"))
    },
    { path: "settings.sessions.savePartial", label: n("Save answers before the form is finished"), kind: "toggle", group: "general", heading: f, fallback: !0 },
    { path: "settings.sessions.resumeEnabled", label: n("Let visitors continue where they left off"), kind: "toggle", group: "general", heading: f, fallback: !0 },
    { path: "settings.sessions.resumePrompt", label: n("Ask before continuing"), kind: "toggle", group: "general", heading: f, fallback: !0 },
    { path: "settings.sessions.resumeDays", label: n("Keep a conversation resumable for (days)"), kind: "number", group: "general", heading: f, min: 1, max: 365, fallback: 30 },
    { path: "settings.sessions.abandonDays", label: n("Mark unfinished as abandoned after (days)"), kind: "number", group: "general", heading: f, min: 1, max: 365, fallback: 30 },
    { path: "settings.sessions.deletePartialOnRestart", label: n("Delete the unfinished answers when a visitor starts over"), kind: "toggle", group: "general", heading: f, fallback: !1 },
    { path: "settings.sessions.storageNotice", label: n("Tell visitors their answers are kept on their device"), kind: "toggle", group: "general", heading: f, fallback: !1 },
    { path: "settings.limits.total", label: n("Close after this many submissions"), kind: "number", group: "general", heading: g, min: 1 },
    { path: "settings.limits.closesAt", label: n("Close on"), kind: "date", group: "general", heading: g },
    { path: "settings.privacy.storeMeta", label: n("Store tracking details (page, referrer, UTM)"), kind: "toggle", group: "privacy", heading: m, inherited: () => Z(k.storeMeta) },
    {
      path: "settings.privacy.ipMode",
      label: n("IP addresses"),
      kind: "select",
      group: "privacy",
      heading: m,
      inherited: () => k.ipMode,
      options: () => [{ value: "full", label: n("Store in full") }, { value: "anonymized", label: n("Store anonymized") }, { value: "none", label: n("Do not store") }]
    },
    { path: "settings.privacy.storeUserAgent", label: n("Store browser and device"), kind: "toggle", group: "privacy", heading: m, inherited: () => Z(k.storeUserAgent) },
    { path: "settings.privacy.respectDnt", label: n("Respect Do Not Track"), kind: "toggle", group: "privacy", heading: m, inherited: () => Z(k.respectDnt) },
    { path: "settings.privacy.retentionEnabled", label: n("Delete old submissions automatically"), kind: "toggle", group: "privacy", heading: m, inherited: () => Z(k.retentionEnabled) },
    { path: "settings.privacy.retentionDays", label: n("Keep submissions for (days)"), kind: "number", group: "privacy", heading: m, min: 1, max: 36500, inherited: () => k.retentionDays },
    { path: "settings.privacy.partialRetentionDays", label: n("Keep partial and abandoned ones for (days)"), kind: "number", group: "privacy", heading: m, min: 1, max: 36500, inherited: () => k.partialRetentionDays ?? void 0 },
    { path: "settings.spam.honeypotEnabled", label: n("Hidden honeypot field"), kind: "toggle", group: "spam", heading: h, inherited: () => Z(y.honeypotEnabled) },
    { path: "settings.spam.minSeconds", label: n("Minimum seconds to answer"), kind: "number", group: "spam", heading: h, min: 0, max: 3600, inherited: () => y.minSeconds },
    { path: "settings.spam.rateLimit", label: n("Submissions per visitor IP per window"), kind: "number", group: "spam", heading: h, min: 1, max: 1e4, inherited: () => y.rateLimit },
    { path: "settings.spam.rateWindowSeconds", label: n("Rate window (seconds)"), kind: "number", group: "spam", heading: h, min: 1, max: 86400, inherited: () => y.rateWindowSeconds }
  ];
}
function fa(t, i, o, s) {
  const r = /* @__PURE__ */ new Map();
  for (const { group: a, heading: c, ...u } of ua(i, o, s))
    a === t && r.set(c, [...r.get(c) ?? [], { ...u, section: "content", types: "all" }]);
  return [...r].map(([a, c]) => ({ heading: a, settings: c }));
}
function ft({ form: t, group: i, defaults: o, languages: s, locale: r, onChange: a }) {
  return /* @__PURE__ */ e.jsx("div", { className: "cf:flex cf:flex-col cf:gap-4", children: fa(i, o, s, r).map(({ heading: c, settings: u }) => /* @__PURE__ */ e.jsxs(l.Card, { children: [
    /* @__PURE__ */ e.jsx(l.CardHeader, { children: /* @__PURE__ */ e.jsx(l.CardTitle, { children: c }) }),
    /* @__PURE__ */ e.jsx(l.CardContent, { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2", children: u.map((d) => /* @__PURE__ */ e.jsx(ce, { target: t, setting: d, onChange: a }, d.path)) })
  ] }, c)) });
}
var W = {}, je, ht;
function ha() {
  return ht || (ht = 1, je = function() {
    return typeof Promise == "function" && Promise.prototype && Promise.prototype.then;
  }), je;
}
var we = {}, U = {}, gt;
function H() {
  if (gt) return U;
  gt = 1;
  let t;
  const i = [
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
  return U.getSymbolSize = function(s) {
    if (!s) throw new Error('"version" cannot be null or undefined');
    if (s < 1 || s > 40) throw new Error('"version" should be in range from 1 to 40');
    return s * 4 + 17;
  }, U.getSymbolTotalCodewords = function(s) {
    return i[s];
  }, U.getBCHDigit = function(o) {
    let s = 0;
    for (; o !== 0; )
      s++, o >>>= 1;
    return s;
  }, U.setToSJISFunction = function(s) {
    if (typeof s != "function")
      throw new Error('"toSJISFunc" is not a valid function.');
    t = s;
  }, U.isKanjiModeEnabled = function() {
    return typeof t < "u";
  }, U.toSJIS = function(s) {
    return t(s);
  }, U;
}
var ke = {}, mt;
function tt() {
  return mt || (mt = 1, (function(t) {
    t.L = { bit: 1 }, t.M = { bit: 0 }, t.Q = { bit: 3 }, t.H = { bit: 2 };
    function i(o) {
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
    t.isValid = function(s) {
      return s && typeof s.bit < "u" && s.bit >= 0 && s.bit < 4;
    }, t.from = function(s, r) {
      if (t.isValid(s))
        return s;
      try {
        return i(s);
      } catch {
        return r;
      }
    };
  })(ke)), ke;
}
var Ce, pt;
function ga() {
  if (pt) return Ce;
  pt = 1;
  function t() {
    this.buffer = [], this.length = 0;
  }
  return t.prototype = {
    get: function(i) {
      const o = Math.floor(i / 8);
      return (this.buffer[o] >>> 7 - i % 8 & 1) === 1;
    },
    put: function(i, o) {
      for (let s = 0; s < o; s++)
        this.putBit((i >>> o - s - 1 & 1) === 1);
    },
    getLengthInBits: function() {
      return this.length;
    },
    putBit: function(i) {
      const o = Math.floor(this.length / 8);
      this.buffer.length <= o && this.buffer.push(0), i && (this.buffer[o] |= 128 >>> this.length % 8), this.length++;
    }
  }, Ce = t, Ce;
}
var Se, bt;
function ma() {
  if (bt) return Se;
  bt = 1;
  function t(i) {
    if (!i || i < 1)
      throw new Error("BitMatrix size must be defined and greater than 0");
    this.size = i, this.data = new Uint8Array(i * i), this.reservedBit = new Uint8Array(i * i);
  }
  return t.prototype.set = function(i, o, s, r) {
    const a = i * this.size + o;
    this.data[a] = s, r && (this.reservedBit[a] = !0);
  }, t.prototype.get = function(i, o) {
    return this.data[i * this.size + o];
  }, t.prototype.xor = function(i, o, s) {
    this.data[i * this.size + o] ^= s;
  }, t.prototype.isReserved = function(i, o) {
    return this.reservedBit[i * this.size + o];
  }, Se = t, Se;
}
var Ne = {}, xt;
function pa() {
  return xt || (xt = 1, (function(t) {
    const i = H().getSymbolSize;
    t.getRowColCoords = function(s) {
      if (s === 1) return [];
      const r = Math.floor(s / 7) + 2, a = i(s), c = a === 145 ? 26 : Math.ceil((a - 13) / (2 * r - 2)) * 2, u = [a - 7];
      for (let d = 1; d < r - 1; d++)
        u[d] = u[d - 1] - c;
      return u.push(6), u.reverse();
    }, t.getPositions = function(s) {
      const r = [], a = t.getRowColCoords(s), c = a.length;
      for (let u = 0; u < c; u++)
        for (let d = 0; d < c; d++)
          u === 0 && d === 0 || // top-left
          u === 0 && d === c - 1 || // bottom-left
          u === c - 1 && d === 0 || r.push([a[u], a[d]]);
      return r;
    };
  })(Ne)), Ne;
}
var Te = {}, vt;
function ba() {
  if (vt) return Te;
  vt = 1;
  const t = H().getSymbolSize, i = 7;
  return Te.getPositions = function(s) {
    const r = t(s);
    return [
      // top-left
      [0, 0],
      // top-right
      [r - i, 0],
      // bottom-left
      [0, r - i]
    ];
  }, Te;
}
var Ee = {}, yt;
function xa() {
  return yt || (yt = 1, (function(t) {
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
    const i = {
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
          let v = r.get(m, h);
          v === f ? u++ : (u >= 5 && (c += i.N1 + (u - 5)), f = v, u = 1), v = r.get(h, m), v === g ? d++ : (d >= 5 && (c += i.N1 + (d - 5)), g = v, d = 1);
        }
        u >= 5 && (c += i.N1 + (u - 5)), d >= 5 && (c += i.N1 + (d - 5));
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
      return c * i.N2;
    }, t.getPenaltyN3 = function(r) {
      const a = r.size;
      let c = 0, u = 0, d = 0;
      for (let f = 0; f < a; f++) {
        u = d = 0;
        for (let g = 0; g < a; g++)
          u = u << 1 & 2047 | r.get(f, g), g >= 10 && (u === 1488 || u === 93) && c++, d = d << 1 & 2047 | r.get(g, f), g >= 10 && (d === 1488 || d === 93) && c++;
      }
      return c * i.N3;
    }, t.getPenaltyN4 = function(r) {
      let a = 0;
      const c = r.data.length;
      for (let d = 0; d < c; d++) a += r.data[d];
      return Math.abs(Math.ceil(a * 100 / c / 5) - 10) * i.N4;
    };
    function o(s, r, a) {
      switch (s) {
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
          throw new Error("bad maskPattern:" + s);
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
  })(Ee)), Ee;
}
var re = {}, jt;
function Xt() {
  if (jt) return re;
  jt = 1;
  const t = tt(), i = [
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
  return re.getBlocksCount = function(r, a) {
    switch (a) {
      case t.L:
        return i[(r - 1) * 4 + 0];
      case t.M:
        return i[(r - 1) * 4 + 1];
      case t.Q:
        return i[(r - 1) * 4 + 2];
      case t.H:
        return i[(r - 1) * 4 + 3];
      default:
        return;
    }
  }, re.getTotalCodewordsCount = function(r, a) {
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
  }, re;
}
var Be = {}, ee = {}, wt;
function va() {
  if (wt) return ee;
  wt = 1;
  const t = new Uint8Array(512), i = new Uint8Array(256);
  return (function() {
    let s = 1;
    for (let r = 0; r < 255; r++)
      t[r] = s, i[s] = r, s <<= 1, s & 256 && (s ^= 285);
    for (let r = 255; r < 512; r++)
      t[r] = t[r - 255];
  })(), ee.log = function(s) {
    if (s < 1) throw new Error("log(" + s + ")");
    return i[s];
  }, ee.exp = function(s) {
    return t[s];
  }, ee.mul = function(s, r) {
    return s === 0 || r === 0 ? 0 : t[i[s] + i[r]];
  }, ee;
}
var kt;
function ya() {
  return kt || (kt = 1, (function(t) {
    const i = va();
    t.mul = function(s, r) {
      const a = new Uint8Array(s.length + r.length - 1);
      for (let c = 0; c < s.length; c++)
        for (let u = 0; u < r.length; u++)
          a[c + u] ^= i.mul(s[c], r[u]);
      return a;
    }, t.mod = function(s, r) {
      let a = new Uint8Array(s);
      for (; a.length - r.length >= 0; ) {
        const c = a[0];
        for (let d = 0; d < r.length; d++)
          a[d] ^= i.mul(r[d], c);
        let u = 0;
        for (; u < a.length && a[u] === 0; ) u++;
        a = a.slice(u);
      }
      return a;
    }, t.generateECPolynomial = function(s) {
      let r = new Uint8Array([1]);
      for (let a = 0; a < s; a++)
        r = t.mul(r, new Uint8Array([1, i.exp(a)]));
      return r;
    };
  })(Be)), Be;
}
var Ie, Ct;
function ja() {
  if (Ct) return Ie;
  Ct = 1;
  const t = ya();
  function i(o) {
    this.genPoly = void 0, this.degree = o, this.degree && this.initialize(this.degree);
  }
  return i.prototype.initialize = function(s) {
    this.degree = s, this.genPoly = t.generateECPolynomial(this.degree);
  }, i.prototype.encode = function(s) {
    if (!this.genPoly)
      throw new Error("Encoder not initialized");
    const r = new Uint8Array(s.length + this.degree);
    r.set(s);
    const a = t.mod(r, this.genPoly), c = this.degree - a.length;
    if (c > 0) {
      const u = new Uint8Array(this.degree);
      return u.set(a, c), u;
    }
    return a;
  }, Ie = i, Ie;
}
var Ae = {}, _e = {}, Me = {}, St;
function Zt() {
  return St || (St = 1, Me.isValid = function(i) {
    return !isNaN(i) && i >= 1 && i <= 40;
  }), Me;
}
var D = {}, Nt;
function en() {
  if (Nt) return D;
  Nt = 1;
  const t = "[0-9]+", i = "[A-Z $%*+\\-./:]+";
  let o = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  o = o.replace(/u/g, "\\u");
  const s = "(?:(?![A-Z0-9 $%*+\\-./:]|" + o + `)(?:.|[\r
]))+`;
  D.KANJI = new RegExp(o, "g"), D.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g"), D.BYTE = new RegExp(s, "g"), D.NUMERIC = new RegExp(t, "g"), D.ALPHANUMERIC = new RegExp(i, "g");
  const r = new RegExp("^" + o + "$"), a = new RegExp("^" + t + "$"), c = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  return D.testKanji = function(d) {
    return r.test(d);
  }, D.testNumeric = function(d) {
    return a.test(d);
  }, D.testAlphanumeric = function(d) {
    return c.test(d);
  }, D;
}
var Tt;
function K() {
  return Tt || (Tt = 1, (function(t) {
    const i = Zt(), o = en();
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
      if (!i.isValid(c))
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
    function s(r) {
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
        return s(a);
      } catch {
        return c;
      }
    };
  })(_e)), _e;
}
var Et;
function wa() {
  return Et || (Et = 1, (function(t) {
    const i = H(), o = Xt(), s = tt(), r = K(), a = Zt(), c = 7973, u = i.getBCHDigit(c);
    function d(h, v, k) {
      for (let y = 1; y <= 40; y++)
        if (v <= t.getCapacity(y, k, h))
          return y;
    }
    function f(h, v) {
      return r.getCharCountIndicator(h, v) + 4;
    }
    function g(h, v) {
      let k = 0;
      return h.forEach(function(y) {
        const M = f(y.mode, v);
        k += M + y.getBitsLength();
      }), k;
    }
    function m(h, v) {
      for (let k = 1; k <= 40; k++)
        if (g(h, k) <= t.getCapacity(k, v, r.MIXED))
          return k;
    }
    t.from = function(v, k) {
      return a.isValid(v) ? parseInt(v, 10) : k;
    }, t.getCapacity = function(v, k, y) {
      if (!a.isValid(v))
        throw new Error("Invalid QR Code version");
      typeof y > "u" && (y = r.BYTE);
      const M = i.getSymbolTotalCodewords(v), p = o.getTotalCodewordsCount(v, k), C = (M - p) * 8;
      if (y === r.MIXED) return C;
      const j = C - f(y, v);
      switch (y) {
        case r.NUMERIC:
          return Math.floor(j / 10 * 3);
        case r.ALPHANUMERIC:
          return Math.floor(j / 11 * 2);
        case r.KANJI:
          return Math.floor(j / 13);
        case r.BYTE:
        default:
          return Math.floor(j / 8);
      }
    }, t.getBestVersionForData = function(v, k) {
      let y;
      const M = s.from(k, s.M);
      if (Array.isArray(v)) {
        if (v.length > 1)
          return m(v, M);
        if (v.length === 0)
          return 1;
        y = v[0];
      } else
        y = v;
      return d(y.mode, y.getLength(), M);
    }, t.getEncodedBits = function(v) {
      if (!a.isValid(v) || v < 7)
        throw new Error("Invalid QR Code version");
      let k = v << 12;
      for (; i.getBCHDigit(k) - u >= 0; )
        k ^= c << i.getBCHDigit(k) - u;
      return v << 12 | k;
    };
  })(Ae)), Ae;
}
var Pe = {}, Bt;
function ka() {
  if (Bt) return Pe;
  Bt = 1;
  const t = H(), i = 1335, o = 21522, s = t.getBCHDigit(i);
  return Pe.getEncodedBits = function(a, c) {
    const u = a.bit << 3 | c;
    let d = u << 10;
    for (; t.getBCHDigit(d) - s >= 0; )
      d ^= i << t.getBCHDigit(d) - s;
    return (u << 10 | d) ^ o;
  }, Pe;
}
var Re = {}, Le, It;
function Ca() {
  if (It) return Le;
  It = 1;
  const t = K();
  function i(o) {
    this.mode = t.NUMERIC, this.data = o.toString();
  }
  return i.getBitsLength = function(s) {
    return 10 * Math.floor(s / 3) + (s % 3 ? s % 3 * 3 + 1 : 0);
  }, i.prototype.getLength = function() {
    return this.data.length;
  }, i.prototype.getBitsLength = function() {
    return i.getBitsLength(this.data.length);
  }, i.prototype.write = function(s) {
    let r, a, c;
    for (r = 0; r + 3 <= this.data.length; r += 3)
      a = this.data.substr(r, 3), c = parseInt(a, 10), s.put(c, 10);
    const u = this.data.length - r;
    u > 0 && (a = this.data.substr(r), c = parseInt(a, 10), s.put(c, u * 3 + 1));
  }, Le = i, Le;
}
var De, At;
function Sa() {
  if (At) return De;
  At = 1;
  const t = K(), i = [
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
  function o(s) {
    this.mode = t.ALPHANUMERIC, this.data = s;
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
      let c = i.indexOf(this.data[a]) * 45;
      c += i.indexOf(this.data[a + 1]), r.put(c, 11);
    }
    this.data.length % 2 && r.put(i.indexOf(this.data[a]), 6);
  }, De = o, De;
}
var $e, _t;
function Na() {
  if (_t) return $e;
  _t = 1;
  const t = K();
  function i(o) {
    this.mode = t.BYTE, typeof o == "string" ? this.data = new TextEncoder().encode(o) : this.data = new Uint8Array(o);
  }
  return i.getBitsLength = function(s) {
    return s * 8;
  }, i.prototype.getLength = function() {
    return this.data.length;
  }, i.prototype.getBitsLength = function() {
    return i.getBitsLength(this.data.length);
  }, i.prototype.write = function(o) {
    for (let s = 0, r = this.data.length; s < r; s++)
      o.put(this.data[s], 8);
  }, $e = i, $e;
}
var qe, Mt;
function Ta() {
  if (Mt) return qe;
  Mt = 1;
  const t = K(), i = H();
  function o(s) {
    this.mode = t.KANJI, this.data = s;
  }
  return o.getBitsLength = function(r) {
    return r * 13;
  }, o.prototype.getLength = function() {
    return this.data.length;
  }, o.prototype.getBitsLength = function() {
    return o.getBitsLength(this.data.length);
  }, o.prototype.write = function(s) {
    let r;
    for (r = 0; r < this.data.length; r++) {
      let a = i.toSJIS(this.data[r]);
      if (a >= 33088 && a <= 40956)
        a -= 33088;
      else if (a >= 57408 && a <= 60351)
        a -= 49472;
      else
        throw new Error(
          "Invalid SJIS character: " + this.data[r] + `
Make sure your charset is UTF-8`
        );
      a = (a >>> 8 & 255) * 192 + (a & 255), s.put(a, 13);
    }
  }, qe = o, qe;
}
var Fe = { exports: {} }, Pt;
function Ea() {
  return Pt || (Pt = 1, (function(t) {
    var i = {
      single_source_shortest_paths: function(o, s, r) {
        var a = {}, c = {};
        c[s] = 0;
        var u = i.PriorityQueue.make();
        u.push(s, 0);
        for (var d, f, g, m, h, v, k, y, M; !u.empty(); ) {
          d = u.pop(), f = d.value, m = d.cost, h = o[f] || {};
          for (g in h)
            h.hasOwnProperty(g) && (v = h[g], k = m + v, y = c[g], M = typeof c[g] > "u", (M || y > k) && (c[g] = k, u.push(g, k), a[g] = f));
        }
        if (typeof r < "u" && typeof c[r] > "u") {
          var p = ["Could not find a path from ", s, " to ", r, "."].join("");
          throw new Error(p);
        }
        return a;
      },
      extract_shortest_path_from_predecessor_list: function(o, s) {
        for (var r = [], a = s; a; )
          r.push(a), o[a], a = o[a];
        return r.reverse(), r;
      },
      find_path: function(o, s, r) {
        var a = i.single_source_shortest_paths(o, s, r);
        return i.extract_shortest_path_from_predecessor_list(
          a,
          r
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(o) {
          var s = i.PriorityQueue, r = {}, a;
          o = o || {};
          for (a in s)
            s.hasOwnProperty(a) && (r[a] = s[a]);
          return r.queue = [], r.sorter = o.sorter || s.default_sorter, r;
        },
        default_sorter: function(o, s) {
          return o.cost - s.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(o, s) {
          var r = { value: o, cost: s };
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
    t.exports = i;
  })(Fe)), Fe.exports;
}
var Rt;
function Ba() {
  return Rt || (Rt = 1, (function(t) {
    const i = K(), o = Ca(), s = Sa(), r = Na(), a = Ta(), c = en(), u = H(), d = Ea();
    function f(p) {
      return unescape(encodeURIComponent(p)).length;
    }
    function g(p, C, j) {
      const x = [];
      let B;
      for (; (B = p.exec(j)) !== null; )
        x.push({
          data: B[0],
          index: B.index,
          mode: C,
          length: B[0].length
        });
      return x;
    }
    function m(p) {
      const C = g(c.NUMERIC, i.NUMERIC, p), j = g(c.ALPHANUMERIC, i.ALPHANUMERIC, p);
      let x, B;
      return u.isKanjiModeEnabled() ? (x = g(c.BYTE, i.BYTE, p), B = g(c.KANJI, i.KANJI, p)) : (x = g(c.BYTE_KANJI, i.BYTE, p), B = []), C.concat(j, x, B).sort(function(S, N) {
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
        case i.NUMERIC:
          return o.getBitsLength(p);
        case i.ALPHANUMERIC:
          return s.getBitsLength(p);
        case i.KANJI:
          return a.getBitsLength(p);
        case i.BYTE:
          return r.getBitsLength(p);
      }
    }
    function v(p) {
      return p.reduce(function(C, j) {
        const x = C.length - 1 >= 0 ? C[C.length - 1] : null;
        return x && x.mode === j.mode ? (C[C.length - 1].data += j.data, C) : (C.push(j), C);
      }, []);
    }
    function k(p) {
      const C = [];
      for (let j = 0; j < p.length; j++) {
        const x = p[j];
        switch (x.mode) {
          case i.NUMERIC:
            C.push([
              x,
              { data: x.data, mode: i.ALPHANUMERIC, length: x.length },
              { data: x.data, mode: i.BYTE, length: x.length }
            ]);
            break;
          case i.ALPHANUMERIC:
            C.push([
              x,
              { data: x.data, mode: i.BYTE, length: x.length }
            ]);
            break;
          case i.KANJI:
            C.push([
              x,
              { data: x.data, mode: i.BYTE, length: f(x.data) }
            ]);
            break;
          case i.BYTE:
            C.push([
              { data: x.data, mode: i.BYTE, length: f(x.data) }
            ]);
        }
      }
      return C;
    }
    function y(p, C) {
      const j = {}, x = { start: {} };
      let B = ["start"];
      for (let w = 0; w < p.length; w++) {
        const S = p[w], N = [];
        for (let T = 0; T < S.length; T++) {
          const A = S[T], I = "" + w + T;
          N.push(I), j[I] = { node: A, lastCount: 0 }, x[I] = {};
          for (let _ = 0; _ < B.length; _++) {
            const b = B[_];
            j[b] && j[b].node.mode === A.mode ? (x[b][I] = h(j[b].lastCount + A.length, A.mode) - h(j[b].lastCount, A.mode), j[b].lastCount += A.length) : (j[b] && (j[b].lastCount = A.length), x[b][I] = h(A.length, A.mode) + 4 + i.getCharCountIndicator(A.mode, C));
          }
        }
        B = N;
      }
      for (let w = 0; w < B.length; w++)
        x[B[w]].end = 0;
      return { map: x, table: j };
    }
    function M(p, C) {
      let j;
      const x = i.getBestModeForData(p);
      if (j = i.from(C, x), j !== i.BYTE && j.bit < x.bit)
        throw new Error('"' + p + '" cannot be encoded with mode ' + i.toString(j) + `.
 Suggested mode is: ` + i.toString(x));
      switch (j === i.KANJI && !u.isKanjiModeEnabled() && (j = i.BYTE), j) {
        case i.NUMERIC:
          return new o(p);
        case i.ALPHANUMERIC:
          return new s(p);
        case i.KANJI:
          return new a(p);
        case i.BYTE:
          return new r(p);
      }
    }
    t.fromArray = function(C) {
      return C.reduce(function(j, x) {
        return typeof x == "string" ? j.push(M(x, null)) : x.data && j.push(M(x.data, x.mode)), j;
      }, []);
    }, t.fromString = function(C, j) {
      const x = m(C, u.isKanjiModeEnabled()), B = k(x), w = y(B, j), S = d.find_path(w.map, "start", "end"), N = [];
      for (let T = 1; T < S.length - 1; T++)
        N.push(w.table[S[T]].node);
      return t.fromArray(v(N));
    }, t.rawSplit = function(C) {
      return t.fromArray(
        m(C, u.isKanjiModeEnabled())
      );
    };
  })(Re)), Re;
}
var Lt;
function Ia() {
  if (Lt) return we;
  Lt = 1;
  const t = H(), i = tt(), o = ga(), s = ma(), r = pa(), a = ba(), c = xa(), u = Xt(), d = ja(), f = wa(), g = ka(), m = K(), h = Ba();
  function v(w, S) {
    const N = w.size, T = a.getPositions(S);
    for (let A = 0; A < T.length; A++) {
      const I = T[A][0], _ = T[A][1];
      for (let b = -1; b <= 7; b++)
        if (!(I + b <= -1 || N <= I + b))
          for (let E = -1; E <= 7; E++)
            _ + E <= -1 || N <= _ + E || (b >= 0 && b <= 6 && (E === 0 || E === 6) || E >= 0 && E <= 6 && (b === 0 || b === 6) || b >= 2 && b <= 4 && E >= 2 && E <= 4 ? w.set(I + b, _ + E, !0, !0) : w.set(I + b, _ + E, !1, !0));
    }
  }
  function k(w) {
    const S = w.size;
    for (let N = 8; N < S - 8; N++) {
      const T = N % 2 === 0;
      w.set(N, 6, T, !0), w.set(6, N, T, !0);
    }
  }
  function y(w, S) {
    const N = r.getPositions(S);
    for (let T = 0; T < N.length; T++) {
      const A = N[T][0], I = N[T][1];
      for (let _ = -2; _ <= 2; _++)
        for (let b = -2; b <= 2; b++)
          _ === -2 || _ === 2 || b === -2 || b === 2 || _ === 0 && b === 0 ? w.set(A + _, I + b, !0, !0) : w.set(A + _, I + b, !1, !0);
    }
  }
  function M(w, S) {
    const N = w.size, T = f.getEncodedBits(S);
    let A, I, _;
    for (let b = 0; b < 18; b++)
      A = Math.floor(b / 3), I = b % 3 + N - 8 - 3, _ = (T >> b & 1) === 1, w.set(A, I, _, !0), w.set(I, A, _, !0);
  }
  function p(w, S, N) {
    const T = w.size, A = g.getEncodedBits(S, N);
    let I, _;
    for (I = 0; I < 15; I++)
      _ = (A >> I & 1) === 1, I < 6 ? w.set(I, 8, _, !0) : I < 8 ? w.set(I + 1, 8, _, !0) : w.set(T - 15 + I, 8, _, !0), I < 8 ? w.set(8, T - I - 1, _, !0) : I < 9 ? w.set(8, 15 - I - 1 + 1, _, !0) : w.set(8, 15 - I - 1, _, !0);
    w.set(T - 8, 8, 1, !0);
  }
  function C(w, S) {
    const N = w.size;
    let T = -1, A = N - 1, I = 7, _ = 0;
    for (let b = N - 1; b > 0; b -= 2)
      for (b === 6 && b--; ; ) {
        for (let E = 0; E < 2; E++)
          if (!w.isReserved(A, b - E)) {
            let L = !1;
            _ < S.length && (L = (S[_] >>> I & 1) === 1), w.set(A, b - E, L), I--, I === -1 && (_++, I = 7);
          }
        if (A += T, A < 0 || N <= A) {
          A -= T, T = -T;
          break;
        }
      }
  }
  function j(w, S, N) {
    const T = new o();
    N.forEach(function(E) {
      T.put(E.mode.bit, 4), T.put(E.getLength(), m.getCharCountIndicator(E.mode, w)), E.write(T);
    });
    const A = t.getSymbolTotalCodewords(w), I = u.getTotalCodewordsCount(w, S), _ = (A - I) * 8;
    for (T.getLengthInBits() + 4 <= _ && T.put(0, 4); T.getLengthInBits() % 8 !== 0; )
      T.putBit(0);
    const b = (_ - T.getLengthInBits()) / 8;
    for (let E = 0; E < b; E++)
      T.put(E % 2 ? 17 : 236, 8);
    return x(T, w, S);
  }
  function x(w, S, N) {
    const T = t.getSymbolTotalCodewords(S), A = u.getTotalCodewordsCount(S, N), I = T - A, _ = u.getBlocksCount(S, N), b = T % _, E = _ - b, L = Math.floor(T / _), O = Math.floor(I / _), nn = O + 1, nt = L - O, an = new d(nt);
    let he = 0;
    const ae = new Array(_), at = new Array(_);
    let ge = 0;
    const sn = new Uint8Array(w.buffer);
    for (let Y = 0; Y < _; Y++) {
      const pe = Y < E ? O : nn;
      ae[Y] = sn.slice(he, he + pe), at[Y] = an.encode(ae[Y]), he += pe, ge = Math.max(ge, pe);
    }
    const me = new Uint8Array(T);
    let st = 0, q, F;
    for (q = 0; q < ge; q++)
      for (F = 0; F < _; F++)
        q < ae[F].length && (me[st++] = ae[F][q]);
    for (q = 0; q < nt; q++)
      for (F = 0; F < _; F++)
        me[st++] = at[F][q];
    return me;
  }
  function B(w, S, N, T) {
    let A;
    if (Array.isArray(w))
      A = h.fromArray(w);
    else if (typeof w == "string") {
      let L = S;
      if (!L) {
        const O = h.rawSplit(w);
        L = f.getBestVersionForData(O, N);
      }
      A = h.fromString(w, L || 40);
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
    const _ = j(S, N, A), b = t.getSymbolSize(S), E = new s(b);
    return v(E, S), k(E), y(E, S), p(E, N, 0), S >= 7 && M(E, S), C(E, _), isNaN(T) && (T = c.getBestMask(
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
  return we.create = function(S, N) {
    if (typeof S > "u" || S === "")
      throw new Error("No input text");
    let T = i.M, A, I;
    return typeof N < "u" && (T = i.from(N.errorCorrectionLevel, i.M), A = f.from(N.version), I = c.from(N.maskPattern), N.toSJISFunc && t.setToSJISFunction(N.toSJISFunc)), B(S, A, T, I);
  }, we;
}
var Ue = {}, Ve = {}, Dt;
function tn() {
  return Dt || (Dt = 1, (function(t) {
    function i(o) {
      if (typeof o == "number" && (o = o.toString()), typeof o != "string")
        throw new Error("Color should be defined as hex string");
      let s = o.slice().replace("#", "").split("");
      if (s.length < 3 || s.length === 5 || s.length > 8)
        throw new Error("Invalid hex color: " + o);
      (s.length === 3 || s.length === 4) && (s = Array.prototype.concat.apply([], s.map(function(a) {
        return [a, a];
      }))), s.length === 6 && s.push("F", "F");
      const r = parseInt(s.join(""), 16);
      return {
        r: r >> 24 & 255,
        g: r >> 16 & 255,
        b: r >> 8 & 255,
        a: r & 255,
        hex: "#" + s.slice(0, 6).join("")
      };
    }
    t.getOptions = function(s) {
      s || (s = {}), s.color || (s.color = {});
      const r = typeof s.margin > "u" || s.margin === null || s.margin < 0 ? 4 : s.margin, a = s.width && s.width >= 21 ? s.width : void 0, c = s.scale || 4;
      return {
        width: a,
        scale: a ? 4 : c,
        margin: r,
        color: {
          dark: i(s.color.dark || "#000000ff"),
          light: i(s.color.light || "#ffffffff")
        },
        type: s.type,
        rendererOpts: s.rendererOpts || {}
      };
    }, t.getScale = function(s, r) {
      return r.width && r.width >= s + r.margin * 2 ? r.width / (s + r.margin * 2) : r.scale;
    }, t.getImageWidth = function(s, r) {
      const a = t.getScale(s, r);
      return Math.floor((s + r.margin * 2) * a);
    }, t.qrToImageData = function(s, r, a) {
      const c = r.modules.size, u = r.modules.data, d = t.getScale(c, a), f = Math.floor((c + a.margin * 2) * d), g = a.margin * d, m = [a.color.light, a.color.dark];
      for (let h = 0; h < f; h++)
        for (let v = 0; v < f; v++) {
          let k = (h * f + v) * 4, y = a.color.light;
          if (h >= g && v >= g && h < f - g && v < f - g) {
            const M = Math.floor((h - g) / d), p = Math.floor((v - g) / d);
            y = m[u[M * c + p] ? 1 : 0];
          }
          s[k++] = y.r, s[k++] = y.g, s[k++] = y.b, s[k] = y.a;
        }
    };
  })(Ve)), Ve;
}
var $t;
function Aa() {
  return $t || ($t = 1, (function(t) {
    const i = tn();
    function o(r, a, c) {
      r.clearRect(0, 0, a.width, a.height), a.style || (a.style = {}), a.height = c, a.width = c, a.style.height = c + "px", a.style.width = c + "px";
    }
    function s() {
      try {
        return document.createElement("canvas");
      } catch {
        throw new Error("You need to specify a canvas element");
      }
    }
    t.render = function(a, c, u) {
      let d = u, f = c;
      typeof d > "u" && (!c || !c.getContext) && (d = c, c = void 0), c || (f = s()), d = i.getOptions(d);
      const g = i.getImageWidth(a.modules.size, d), m = f.getContext("2d"), h = m.createImageData(g, g);
      return i.qrToImageData(h.data, a, d), o(m, f, g), m.putImageData(h, 0, 0), f;
    }, t.renderToDataURL = function(a, c, u) {
      let d = u;
      typeof d > "u" && (!c || !c.getContext) && (d = c, c = void 0), d || (d = {});
      const f = t.render(a, c, d), g = d.type || "image/png", m = d.rendererOpts || {};
      return f.toDataURL(g, m.quality);
    };
  })(Ue)), Ue;
}
var Oe = {}, qt;
function _a() {
  if (qt) return Oe;
  qt = 1;
  const t = tn();
  function i(r, a) {
    const c = r.a / 255, u = a + '="' + r.hex + '"';
    return c < 1 ? u + " " + a + '-opacity="' + c.toFixed(2).slice(1) + '"' : u;
  }
  function o(r, a, c) {
    let u = r + a;
    return typeof c < "u" && (u += " " + c), u;
  }
  function s(r, a, c) {
    let u = "", d = 0, f = !1, g = 0;
    for (let m = 0; m < r.length; m++) {
      const h = Math.floor(m % a), v = Math.floor(m / a);
      !h && !f && (f = !0), r[m] ? (g++, m > 0 && h > 0 && r[m - 1] || (u += f ? o("M", h + c, 0.5 + v + c) : o("m", d, 0), d = 0, f = !1), h + 1 < a && r[m + 1] || (u += o("h", g), g = 0)) : d++;
    }
    return u;
  }
  return Oe.render = function(a, c, u) {
    const d = t.getOptions(c), f = a.modules.size, g = a.modules.data, m = f + d.margin * 2, h = d.color.light.a ? "<path " + i(d.color.light, "fill") + ' d="M0 0h' + m + "v" + m + 'H0z"/>' : "", v = "<path " + i(d.color.dark, "stroke") + ' d="' + s(g, f, d.margin) + '"/>', k = 'viewBox="0 0 ' + m + " " + m + '"', M = '<svg xmlns="http://www.w3.org/2000/svg" ' + (d.width ? 'width="' + d.width + '" height="' + d.width + '" ' : "") + k + ' shape-rendering="crispEdges">' + h + v + `</svg>
`;
    return typeof u == "function" && u(null, M), M;
  }, Oe;
}
var Ft;
function Ma() {
  if (Ft) return W;
  Ft = 1;
  const t = ha(), i = Ia(), o = Aa(), s = _a();
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
      return m === 1 ? (u = c, c = d = void 0) : m === 2 && !c.getContext && (d = u, u = c, c = void 0), new Promise(function(v, k) {
        try {
          const y = i.create(u, d);
          v(a(y, c, d));
        } catch (y) {
          k(y);
        }
      });
    }
    try {
      const v = i.create(u, d);
      f(null, a(v, c, d));
    } catch (v) {
      f(v);
    }
  }
  return W.create = i.create, W.toCanvas = r.bind(null, o.render), W.toDataURL = r.bind(null, o.renderToDataURL), W.toString = r.bind(null, function(a, c, u) {
    return s.render(a, u);
  }), W;
}
var Pa = Ma();
function Ra(t) {
  const i = t.settings.display ?? {}, o = i.mode ?? "inline", s = (o === "launcher" || o === "popup") && i.launcher?.position === "left" ? ' position="left"' : "";
  return `<x-chatflow::form :id="${t.id}" mode="${o}"${s} />`;
}
function La(t, i) {
  return !t.id || t.version < 1 || !t.slug ? null : `${(i.siteUrl ?? location.origin).replace(/\/+$/, "")}/${(i.fullpageBase ?? "chat").replace(/^\/+|\/+$/g, "")}/${encodeURIComponent(t.slug)}/`;
}
function Da(t, i, o) {
  const s = new URL(t);
  if (!["https:", "http:"].includes(s.protocol) || s.username || s.password) throw new TypeError("Invalid share URL");
  for (const r of o.steps) {
    const a = i[r.key];
    !["hidden", "calculated", "file_upload", "consent", "statement", "summary", "media"].includes(r.type) && a && a.length <= 2e3 && s.searchParams.set(`cff_prefill[${r.key}]`, a);
  }
  return s.href;
}
const $a = ["hidden", "calculated", "file_upload", "consent", "statement", "summary", "media", "address"];
function qa({ form: t, config: i }) {
  const o = La(t, i), [s, r] = P.useState({}), [a, c] = P.useState(""), u = P.useMemo(() => o ? Da(o, s, t.schema) : "", [o, s, t.schema]);
  P.useEffect(() => {
    let g = !0;
    return c(""), u && Pa.toDataURL(u, { width: 240, margin: 2, errorCorrectionLevel: "M" }).then((m) => g && c(m)).catch(() => {
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
  }, f = Ra(t);
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
            /* @__PURE__ */ e.jsx(Ke, {}),
            " ",
            n("Copy")
          ] }),
          /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", asChild: !0, children: /* @__PURE__ */ e.jsxs("a", { href: u, target: "_blank", rel: "noopener noreferrer", children: [
            /* @__PURE__ */ e.jsx(Ht, {}),
            " ",
            n("Open")
          ] }) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-start cf:gap-6", children: [
          a && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:items-start cf:gap-2", children: [
            /* @__PURE__ */ e.jsx("img", { src: a, width: 160, height: 160, alt: n("QR code for the form link"), className: "cf:rounded-md cf:border cf:bg-white" }),
            /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", asChild: !0, children: /* @__PURE__ */ e.jsxs("a", { href: a, download: "chatflow-qr.png", children: [
              /* @__PURE__ */ e.jsx(jn, {}),
              " ",
              n("Download QR code")
            ] }) })
          ] }),
          /* @__PURE__ */ e.jsxs("details", { className: "cf:min-w-64 cf:flex-1 cf:text-sm", children: [
            /* @__PURE__ */ e.jsx("summary", { className: "cf:cursor-pointer cf:font-medium", children: n("Prefill answers in the link") }),
            /* @__PURE__ */ e.jsx("p", { className: "cf:my-2 cf:text-xs cf:text-muted-foreground", children: n("Visitors see these as suggested answers they can change. Links end up in browser history and logs: never put personal or secret data in them.") }),
            /* @__PURE__ */ e.jsx("div", { className: "cf:grid cf:gap-3 cf:sm:grid-cols-2", children: t.schema.steps.filter((g) => !$a.includes(g.type)).map((g) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
              /* @__PURE__ */ e.jsx(l.Label, { children: g.label || g.key }),
              /* @__PURE__ */ e.jsx(l.Input, { value: s[g.key] ?? "", onChange: (m) => r({ ...s, [g.key]: m.target.value }) })
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
          /* @__PURE__ */ e.jsx(Ke, {}),
          " ",
          n("Copy")
        ] })
      ] })
    ] })
  ] });
}
const le = {
  previewRedirect: "Preview destination (no redirect)",
  invalidEmail: "Enter a valid email address.",
  plainText: "Please write your answer as plain text, without HTML code.",
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
  rateLimited: "Too many chats were started from your network. Please wait a few minutes, then try again.",
  submitRateLimited: "Too many submissions were sent from your network. Please wait a few minutes, then submit again.",
  retryInMinutes: "Try again in {n} min",
  retryInSeconds: "Try again in {n} s",
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
}, Fa = {
  previewRedirect: "Tujuan pratinjau (tanpa pengalihan)",
  invalidEmail: "Masukkan alamat email yang valid.",
  plainText: "Tulis jawaban Anda sebagai teks biasa, tanpa kode HTML.",
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
  rateLimited: "Terlalu banyak percakapan dimulai dari jaringan Anda. Tunggu beberapa menit, lalu coba lagi.",
  submitRateLimited: "Terlalu banyak kiriman dari jaringan Anda. Tunggu beberapa menit, lalu kirim lagi.",
  retryInMinutes: "Coba lagi dalam {n} menit",
  retryInSeconds: "Coba lagi dalam {n} detik",
  retry: "Coba lagi",
  invalid: "Mohon periksa jawaban Anda.",
  required: "Mohon jawab pertanyaan ini.",
  consentRequired: "Mohon setujui sebelum melanjutkan.",
  progress: "Progres",
  summary: "Periksa jawaban Anda",
  empty: "Dilewati",
  online: "Daring",
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
function Ua({ form: t, locale: i, onChange: o }) {
  const [s, r] = P.useState(""), a = t.settings.language ?? "site", c = a === "id" || a === "site" && /^id(?:[-_]|$)/i.test(i) ? Fa : le, u = t.settings.phrases ?? {}, d = s.trim().toLowerCase(), f = Object.keys(le).filter((m) => !d || [c[m], le[m], u[m]].some((h) => h?.toLowerCase().includes(d))).sort((m, h) => +(h in u) - +(m in u)), g = (m, h) => {
    const v = { ...u };
    h.trim() ? v[m] = h : delete v[m], o({ ...t, settings: { ...t.settings, phrases: v } });
  };
  return /* @__PURE__ */ e.jsxs(l.Card, { children: [
    /* @__PURE__ */ e.jsxs(l.CardHeader, { children: [
      /* @__PURE__ */ e.jsx(l.CardTitle, { children: n("Chat texts") }),
      /* @__PURE__ */ e.jsx(l.CardDescription, { children: R(n("%d changed. Empty fields use the built-in text, shown in grey."), Object.keys(u).length) })
    ] }),
    /* @__PURE__ */ e.jsxs(l.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
      /* @__PURE__ */ e.jsx(l.Input, { "aria-label": n("Search texts"), placeholder: n("Search texts…"), value: s, onChange: (m) => r(m.target.value), className: "cf:max-w-sm" }),
      /* @__PURE__ */ e.jsx("div", { className: "cf:grid cf:gap-3 cf:sm:grid-cols-2", children: f.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
        /* @__PURE__ */ e.jsx(l.Label, { htmlFor: `cf-phrase-${m}`, className: "cf:font-normal cf:text-muted-foreground", children: le[m] }),
        /* @__PURE__ */ e.jsx(l.Input, { id: `cf-phrase-${m}`, value: u[m] ?? "", placeholder: c[m], onChange: (h) => g(m, h.target.value) })
      ] }, m)) }),
      Object.keys(u).length > 0 && /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", className: "cf:self-start", onClick: () => o({ ...t, settings: { ...t.settings, phrases: {} } }), children: n("Reset all texts") })
    ] })
  ] });
}
const Va = 3e3, Oa = 6e4;
function za(t, i) {
  const o = P.useMemo(() => new fn(t, i), [t, i]), s = P.useSyncExternalStore(o.subscribe, o.snapshot), [r, a] = P.useState(""), [c, u] = P.useState(null), d = o.dirty();
  P.useEffect(() => {
    let h = !0;
    const v = () => t.request(`admin/forms/${i.id}/lock`, "POST", {}).then(() => h && a("")).catch((y) => h && a(Q(y)));
    v();
    const k = window.setInterval(() => {
      v();
    }, Oa);
    return () => {
      h = !1, window.clearInterval(k);
    };
  }, [t, i.id]);
  const f = P.useCallback(() => {
    !r && !o.state.conflict && !o.state.saving && o.save().catch(() => {
    });
  }, [o, r]);
  P.useEffect(() => {
    const h = window.setInterval(() => {
      const v = o.state;
      !r && !v.conflict && !v.error && !v.saving && o.dirty() && o.save().catch(() => {
      });
    }, Va);
    return () => window.clearInterval(h);
  }, [o, r]);
  const g = P.useRef(!1);
  P.useEffect(() => {
    g.current && !s.saving && !s.error && u(/* @__PURE__ */ new Date()), g.current = s.saving;
  }, [s.saving, s.error]), l.useUnsavedChanges(d, f);
  const m = P.useCallback((h) => o.edit(h), [o]);
  return { controller: o, state: s, form: s.form, dirty: d, savedAt: c, lockError: r, edit: m, saveNow: f };
}
const Ut = 500;
function ts({ formId: t, title: i, config: o }) {
  const s = ln(o), [r, a] = P.useState(null), [c, u] = P.useState("");
  return l.useBreadcrumbs([{ label: n("Forms"), href: de.forms() }, { label: r?.title ?? i }]), P.useEffect(() => {
    s.request(`admin/forms/${t}`).then(a).catch((d) => u(Q(d)));
  }, [s, t]), r ? /* @__PURE__ */ e.jsx(Ha, { api: s, initial: r }) : /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(Vt.Head, { title: i }),
    /* @__PURE__ */ e.jsx(l.PageHeader, { title: i, back: { href: de.forms(), label: n("Forms") } }),
    /* @__PURE__ */ e.jsx("p", { className: c ? "cf:text-sm cf:text-destructive" : "cf:text-sm cf:text-muted-foreground", role: c ? "alert" : "status", children: c || n("Loading…") })
  ] });
}
function Ha({ api: t, initial: i }) {
  const o = za(t, i), { controller: s, state: r, form: a, dirty: c, edit: u } = o, d = a.schema, [f, g] = wn(), [m, h] = P.useState(d.steps[0]?.id ?? ""), [v, k] = P.useState(!1), [y, M] = P.useState("build"), [p, C] = P.useState(null), j = d.steps.find((b) => b.id === m);
  P.useEffect(() => {
    !j && d.steps[0] && h(d.steps[0].id);
  }, [j, d.steps]), P.useEffect(() => {
    if (!a.version) return;
    let b = !0;
    return t.request(`admin/forms/${a.id}/published`).then((E) => b && C(E)).catch(() => b && C(null)), () => {
      b = !1;
    };
  }, [t, a.id, a.version]);
  const x = P.useMemo(() => hn(p, a), [p, a]), B = a.version > 0 && p !== null && x.length > 0, w = (b) => u((E) => ({ ...E, schema: b })), S = (b) => w({ ...d, steps: d.steps.map((E) => E.id === b.id ? b : E) }), N = (b) => {
    const E = d.steps.findIndex((O) => O.id === m), L = E >= 0 ? [...d.steps.slice(0, E + 1), b, ...d.steps.slice(E + 1)] : [...d.steps, b];
    w({ ...d, steps: L }), h(b.id);
  }, T = (b) => N(bn(b, d.steps, s.reservedKeys())), A = async (b) => {
    d.steps.length <= 1 || await f({
      title: R(n("Delete “%s”?"), b.label || b.key),
      description: n("Rules that use it are removed, and notifications that depend on it are switched off. You can undo this."),
      confirmLabel: n("Delete field"),
      destructive: !0
    }) && u((E) => xn(E, b.id));
  }, I = async () => {
    try {
      await s.publish(), k(!1), l.toast.success(n("Published. Visitors now get this version."));
    } catch (b) {
      l.toast.error(Q(b));
    }
  }, _ = r.saving ? n("Saving…") : r.error ? n("Not saved") : c ? n("Unsaved changes") : o.savedAt ? R(n("Saved %s"), o.savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) : n("Saved");
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(Vt.Head, { title: a.title }),
    g,
    /* @__PURE__ */ e.jsxs(
      l.PageHeader,
      {
        title: a.title || n("Untitled form"),
        back: { href: de.forms(), label: n("Forms") },
        menu: [
          ...a.slug && a.version > 0 && t.config.fullpageBase ? [{ label: n("Open live form"), icon: /* @__PURE__ */ e.jsx(Ht, {}), href: `${t.config.siteUrl ?? "/"}${t.config.fullpageBase}/${a.slug}/`, external: !0 }] : [],
          { label: n("Submissions"), href: de.submissions({ formId: a.id }) }
        ],
        actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", "aria-label": n("Undo"), disabled: !r.history.length || r.saving, onClick: () => s.undo(), children: /* @__PURE__ */ e.jsx(Nn, {}) }),
          /* @__PURE__ */ e.jsx(l.Button, { variant: "ghost", size: "icon", "aria-label": n("Redo"), disabled: !r.future.length || r.saving, onClick: () => s.redo(), children: /* @__PURE__ */ e.jsx(Cn, {}) })
        ] }),
        primary: /* @__PURE__ */ e.jsx(l.Button, { onClick: () => k(!0), disabled: !!r.conflict || !!o.lockError, children: n("Publish") }),
        children: [
          /* @__PURE__ */ e.jsx(l.Badge, { variant: "outline", role: "status", children: _ }),
          a.version > 0 ? /* @__PURE__ */ e.jsx(l.Badge, { children: R(n("Live · v%d"), a.version) }) : /* @__PURE__ */ e.jsx(l.Badge, { variant: "secondary", children: n("Not published") }),
          B && /* @__PURE__ */ e.jsx(l.Badge, { variant: "secondary", children: n("Unpublished changes") })
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(Ya, { draft: o }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:max-w-xl cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsx(l.Label, { htmlFor: "cf-form-title", children: n("Form name") }),
      /* @__PURE__ */ e.jsx(l.Input, { id: "cf-form-title", value: a.title, maxLength: 500, onChange: (b) => u((E) => ({ ...E, title: b.target.value })) })
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
            /* @__PURE__ */ e.jsx(Ka, { available: t.config.features.fieldTypes, disabled: d.steps.length >= Ut, onAdd: T })
          ] }),
          /* @__PURE__ */ e.jsx(
            l.SortableList,
            {
              items: d.steps,
              getId: (b) => b.id,
              getLabel: (b) => b.label || b.key,
              onReorder: (b) => w({ ...d, steps: b }),
              children: (b, { handle: E, index: L }) => /* @__PURE__ */ e.jsxs("div", { className: `cf:flex cf:items-center cf:gap-2 cf:rounded-md cf:border cf:bg-card cf:p-2 ${b.id === m ? "cf:border-primary cf:ring-1 cf:ring-primary" : ""}`, children: [
                /* @__PURE__ */ e.jsx(l.SortableHandle, { ...E, label: R(n("Move %s"), b.label || b.key) }),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-step-id": b.id,
                    "aria-pressed": b.id === m,
                    onClick: () => h(b.id),
                    className: "cf:flex cf:min-w-0 cf:flex-1 cf:flex-col cf:items-start cf:text-left",
                    children: [
                      /* @__PURE__ */ e.jsxs("span", { className: "cf:flex cf:w-full cf:items-center cf:gap-2", children: [
                        /* @__PURE__ */ e.jsx("span", { className: "cf:text-xs cf:text-muted-foreground cf:tabular-nums", children: String(L + 1).padStart(2, "0") }),
                        /* @__PURE__ */ e.jsx("span", { className: "cf:truncate cf:font-medium", children: b.label || b.key })
                      ] }),
                      /* @__PURE__ */ e.jsxs("span", { className: "cf:text-xs cf:text-muted-foreground", children: [
                        et(b.type),
                        b.required ? ` · ${n("Required")}` : "",
                        b.hiddenByDefault ? ` · ${n("Hidden")}` : ""
                      ] })
                    ]
                  }
                )
              ] })
            }
          )
        ] }),
        j ? /* @__PURE__ */ e.jsx(
          Vn,
          {
            step: j,
            schema: d,
            reservedValues: s.reservedOptionValues(j.id),
            onChange: S,
            onRenameKey: (b) => u((E) => pn(E, j.id, b)),
            onRenameOption: (b, E) => u((L) => mn(L, j.id, b, E)),
            actions: /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-1", children: [
              /* @__PURE__ */ e.jsx(
                l.Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "cf:size-8",
                  "aria-label": n("Duplicate field"),
                  disabled: d.steps.length >= Ut,
                  onClick: () => N(gn(j, d.steps, s.reservedKeys())),
                  children: /* @__PURE__ */ e.jsx(Ke, {})
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
                    A(j);
                  },
                  children: /* @__PURE__ */ e.jsx(V, {})
                }
              )
            ] })
          },
          j.id
        ) : /* @__PURE__ */ e.jsx(l.Card, { children: /* @__PURE__ */ e.jsx(l.CardContent, { className: "cf:text-muted-foreground", children: n("Add a field to start.") }) })
      ] }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "endings", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(Tn, { form: a, onChange: (b) => u(() => b) }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "design", className: "cf:mt-4", children: /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-6 cf:xl:grid-cols-[minmax(0,1fr)_26rem]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
          /* @__PURE__ */ e.jsx(ca, { form: a, onChange: (b) => u(() => b) }),
          /* @__PURE__ */ e.jsx(ft, { form: a, group: "design", defaults: t.config.defaults, languages: t.config.languages, locale: t.config.locale, onChange: (b) => u(() => b) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "cf:xl:sticky cf:xl:top-4 cf:xl:self-start", children: /* @__PURE__ */ e.jsx(dt, { form: a, config: t.config }) })
      ] }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "settings", className: "cf:mt-4", children: /* @__PURE__ */ e.jsxs(l.Tabs, { defaultValue: "general", children: [
        /* @__PURE__ */ e.jsxs(l.TabsList, { children: [
          /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "general", children: n("General") }),
          /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "privacy", children: n("Privacy") }),
          /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "spam", children: n("Spam") }),
          /* @__PURE__ */ e.jsx(l.TabsTrigger, { value: "wording", children: n("Texts") })
        ] }),
        ["general", "privacy", "spam"].map((b) => /* @__PURE__ */ e.jsx(l.TabsContent, { value: b, className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(ft, { form: a, group: b, defaults: t.config.defaults, languages: t.config.languages, locale: t.config.locale, onChange: (E) => u(() => E) }) }, b)),
        /* @__PURE__ */ e.jsx(l.TabsContent, { value: "wording", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(Ua, { form: a, locale: t.config.locale, onChange: (b) => u(() => b) }) })
      ] }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "emails", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(ia, { api: t, form: a, onChange: (b) => u(() => b), save: () => s.save() }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "share", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(qa, { form: a, config: t.config }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "preview", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx("div", { className: "cf:mx-auto cf:w-full cf:max-w-3xl", children: /* @__PURE__ */ e.jsx(dt, { form: a, config: t.config, height: 680 }) }) }),
      /* @__PURE__ */ e.jsx(l.TabsContent, { value: "logic", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(aa, { form: a, onChange: (b) => u(() => b), onOpenStep: (b) => {
        h(b), M("build");
      } }) })
    ] }),
    /* @__PURE__ */ e.jsx(l.Dialog, { open: v, onOpenChange: k, children: /* @__PURE__ */ e.jsxs(l.DialogContent, { children: [
      /* @__PURE__ */ e.jsxs(l.DialogHeader, { children: [
        /* @__PURE__ */ e.jsx(l.DialogTitle, { children: a.version > 0 ? n("Publish a new version?") : n("Publish this form?") }),
        /* @__PURE__ */ e.jsx(l.DialogDescription, { children: a.version > 0 ? n("Visitors who start the form from now on get the new version. Conversations in progress keep the one they started with.") : n("The form becomes available to visitors. Later edits stay in the draft until you publish again.") })
      ] }),
      a.version > 0 && (x.length ? /* @__PURE__ */ e.jsx("ul", { className: "cf:list-disc cf:pl-5 cf:text-sm", children: x.map((b) => /* @__PURE__ */ e.jsx("li", { children: b }, b)) }) : /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: n("Nothing changed since the live version.") })),
      /* @__PURE__ */ e.jsxs(l.DialogFooter, { children: [
        /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", onClick: () => k(!1), children: n("Cancel") }),
        /* @__PURE__ */ e.jsx(l.Button, { onClick: () => {
          I();
        }, disabled: r.saving, children: r.saving ? n("Publishing…") : a.version > 0 ? n("Publish new version") : n("Publish") })
      ] })
    ] }) })
  ] });
}
function Ka({ available: t, disabled: i, onAdd: o }) {
  return /* @__PURE__ */ e.jsxs(l.DropdownMenu, { children: [
    /* @__PURE__ */ e.jsx(l.DropdownMenuTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsxs(l.Button, { size: "sm", disabled: i, children: [
      /* @__PURE__ */ e.jsx($, {}),
      " ",
      n("Add field")
    ] }) }),
    /* @__PURE__ */ e.jsx(l.DropdownMenuContent, { align: "end", className: "cf:max-h-96 cf:overflow-y-auto", children: Ln(t).map((s, r) => /* @__PURE__ */ e.jsxs("div", { children: [
      r > 0 && /* @__PURE__ */ e.jsx(l.DropdownMenuSeparator, {}),
      /* @__PURE__ */ e.jsx(l.DropdownMenuLabel, { children: s.label }),
      s.types.map((a) => /* @__PURE__ */ e.jsx(l.DropdownMenuItem, { onSelect: () => o(a), children: et(a) }, a))
    ] }, s.label)) })
  ] });
}
function Ya({ draft: t }) {
  const { controller: i, state: o } = t;
  return o.conflict ? /* @__PURE__ */ e.jsxs(
    ze,
    {
      tone: "error",
      title: n("Someone else saved this form"),
      text: n("Your edits are kept here but not saved. Load their version (your edits are lost), or keep yours and save over it."),
      children: [
        /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", onClick: () => {
          i.reload();
        }, children: n("Load their version") }),
        /* @__PURE__ */ e.jsx(l.Button, { size: "sm", onClick: () => {
          i.rebaseLocal().then(() => t.saveNow());
        }, children: n("Keep mine") })
      ]
    }
  ) : t.lockError ? /* @__PURE__ */ e.jsx(ze, { tone: "warning", title: n("Another admin is editing this form"), text: t.lockError }) : o.error ? /* @__PURE__ */ e.jsxs(ze, { tone: "error", title: n("The draft was not saved"), text: o.error, children: [
    /* @__PURE__ */ e.jsx(l.Button, { variant: "outline", size: "sm", onClick: () => t.saveNow(), children: n("Try again") }),
    o.issues.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "cf:mt-2 cf:w-full cf:list-disc cf:pl-5 cf:text-sm", children: o.issues.slice(0, 10).map((s, r) => /* @__PURE__ */ e.jsx("li", { children: s.message }, r)) })
  ] }) : null;
}
function ze({ tone: t, title: i, text: o, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { role: "alert", className: `cf:flex cf:flex-wrap cf:items-center cf:gap-3 cf:rounded-lg cf:border cf:p-4 ${t === "error" ? "cf:border-destructive/50 cf:bg-destructive/5" : "cf:border-amber-500/50 cf:bg-amber-500/5"}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "cf:min-w-0 cf:flex-1", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:font-medium", children: i }),
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: o })
    ] }),
    s
  ] });
}
export {
  ts as default
};
