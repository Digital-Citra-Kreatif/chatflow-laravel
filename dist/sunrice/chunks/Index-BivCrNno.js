import { c as E, j as e, u as s, _ as t, b as v, s as k, e as D, a as ae, d as w, r as V } from "./urls-B0_osvz3.js";
import { e as z, r as le, u as ne, w as ie, m as O, a as U, D as ce, p as re, d as oe, c as de, f as fe, g as ue, h as he } from "./model-AyjPKtEP.js";
import { T as $ } from "./trash-Chbq1SlF.js";
import { P as T } from "./plus-DO9FeptJ.js";
import { u as me } from "./useConfirm-DmdBg5Y3.js";
import { C as xe } from "./copy-DX_h8M81.js";
const q = {
  name: "external-link",
  size: 24,
  node: [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
  ]
};
q.node;
const pe = E(q);
const K = {
  name: "redo-2",
  size: 24,
  node: [
    ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
    ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
  ]
};
K.node;
const ve = E(K);
const W = {
  name: "undo-2",
  size: 24,
  node: [
    ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
    ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
  ]
};
W.node;
const ge = E(W);
function be({ form: l, onChange: n }) {
  const { schema: i } = l, c = l.settings.completion, r = c?.defaultEndingId ?? i.endings[0]?.id ?? "", o = (a) => n({
    ...l,
    schema: { ...i, endings: i.endings.map((u) => u.id === a.id ? a : u) }
  }), m = (a) => n({
    ...l,
    settings: { ...l.settings, completion: { ...c, defaultEndingId: r, ...a } }
  }), h = () => n({
    ...l,
    schema: { ...i, endings: [...i.endings, { id: ne("end"), type: "message", messages: [t("Thank you!")] }] }
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
    /* @__PURE__ */ e.jsxs(s.Card, { children: [
      /* @__PURE__ */ e.jsx(s.CardHeader, { children: /* @__PURE__ */ e.jsx(s.CardTitle, { children: t("Finishing") }) }),
      /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { htmlFor: "cf-default-ending", children: t("Default ending") }),
          /* @__PURE__ */ e.jsxs(s.Select, { value: r, onValueChange: (a) => m({ defaultEndingId: a }), children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { id: "cf-default-ending", children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsx(s.SelectContent, { children: i.endings.map((a, u) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: a.id, children: z(a, u) }, a.id)) })
          ] }),
          /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: t("Used unless a rule chooses another ending.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { htmlFor: "cf-review", children: t("After the last question") }),
          /* @__PURE__ */ e.jsxs(s.Select, { value: c?.review ?? "off", onValueChange: (a) => m({ review: a }), children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { id: "cf-review", children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(s.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "off", children: t("Submit automatically") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "button", children: t("Show a Submit button") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "show", children: t("Show the answers for review, then Submit") })
            ] })
          ] })
        ] })
      ] })
    ] }),
    i.endings.map((a, u) => /* @__PURE__ */ e.jsxs(s.Card, { children: [
      /* @__PURE__ */ e.jsxs(s.CardHeader, { className: "cf:flex cf:flex-row cf:items-center cf:justify-between cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(s.CardTitle, { className: "cf:truncate", children: z(a, u) }),
        /* @__PURE__ */ e.jsx(
          s.Button,
          {
            variant: "ghost",
            size: "icon",
            className: "cf:size-8",
            "aria-label": t("Remove ending"),
            disabled: i.endings.length <= 1,
            onClick: () => n(le(l, a.id)),
            children: /* @__PURE__ */ e.jsx($, {})
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-ending-type-${a.id}`, children: t("Ending type") }),
          /* @__PURE__ */ e.jsxs(s.Select, { value: a.type, onValueChange: (g) => o({ ...a, type: g }), children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { id: `cf-ending-type-${a.id}`, children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(s.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "message", children: t("Show a thank-you message") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "redirect", children: t("Go to a page or WhatsApp") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-ending-messages-${a.id}`, children: t("Messages (one per line)") }),
          /* @__PURE__ */ e.jsx(
            s.Textarea,
            {
              id: `cf-ending-messages-${a.id}`,
              rows: 3,
              value: a.messages?.join(`
`) ?? "",
              onChange: (g) => o({ ...a, messages: g.target.value.split(`
`).slice(0, 50) })
            }
          )
        ] }),
        a.type === "redirect" && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
            /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-ending-url-${a.id}`, children: t("Redirect URL") }),
            /* @__PURE__ */ e.jsx(
              s.Input,
              {
                id: `cf-ending-url-${a.id}`,
                type: "url",
                value: a.url ?? "",
                placeholder: "https://",
                onChange: (g) => o({ ...a, url: g.target.value })
              }
            ),
            /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: t("The submission is saved before the visitor leaves. A wa.me link opens WhatsApp with a message the visitor still sends.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
            /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-ending-append-${a.id}`, children: t("Add answers to the link") }),
            /* @__PURE__ */ e.jsx(s.Switch, { id: `cf-ending-append-${a.id}`, checked: !!a.appendQuery, onCheckedChange: (g) => o({ ...a, appendQuery: g }) })
          ] }),
          a.appendQuery && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
            /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-ending-keys-${a.id}`, children: t("Answers to add (field keys, comma separated)") }),
            /* @__PURE__ */ e.jsx(
              s.Input,
              {
                id: `cf-ending-keys-${a.id}`,
                value: a.queryKeys?.join(", ") ?? "",
                onChange: (g) => o({ ...a, queryKeys: g.target.value.split(",").map((d) => d.trim()).filter(Boolean).slice(0, 100) })
              }
            )
          ] })
        ] })
      ] })
    ] }, a.id)),
    /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", className: "cf:self-start", disabled: i.endings.length >= 20, onClick: h, children: [
      /* @__PURE__ */ e.jsx(T, {}),
      " ",
      t("Add ending")
    ] })
  ] });
}
function Y({ label: l, value: n, validate: i, onCommit: c, help: r }) {
  const o = v.useId(), [m, h] = v.useState(n), [a, u] = v.useState("");
  v.useEffect(() => {
    h(n), u("");
  }, [n]);
  const g = () => {
    if (m === n) return;
    const d = i(m);
    u(d), d || c(m);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(s.Label, { htmlFor: o, children: l }),
    /* @__PURE__ */ e.jsx(
      s.Input,
      {
        id: o,
        value: m,
        "aria-invalid": a ? !0 : void 0,
        "aria-describedby": `${o}-help`,
        onChange: (d) => h(d.target.value),
        onBlur: g,
        onKeyDown: (d) => {
          d.key === "Enter" && g(), d.key === "Escape" && (h(n), u(""));
        }
      }
    ),
    /* @__PURE__ */ e.jsx("p", { id: `${o}-help`, className: a ? "cf:text-xs cf:text-destructive" : "cf:text-xs cf:text-muted-foreground", children: a || r })
  ] });
}
function F(l) {
  return {
    short_text: t("Short text"),
    long_text: t("Long text"),
    email: t("Email"),
    phone: t("Phone"),
    number: t("Number"),
    rating: t("Rating (1–5)"),
    scale: t("Scale (1–10)"),
    nps: t("NPS (0–10)"),
    slider: t("Slider"),
    calculated: t("Calculated number"),
    file_upload: t("File upload"),
    address: t("Address"),
    media: t("Media"),
    date: t("Date"),
    single_choice: t("Single choice"),
    multi_choice: t("Multiple choice"),
    yes_no: t("Yes / No"),
    consent: t("Consent"),
    hidden: t("Hidden field"),
    statement: t("Statement"),
    summary: t("Summary")
  }[l] ?? l;
}
function je(l) {
  const n = [
    { label: t("Basic"), types: ["statement", "short_text", "long_text", "email", "phone", "number", "date"] },
    { label: t("Choices"), types: ["single_choice", "multi_choice", "yes_no", "consent"] },
    { label: t("Ratings"), types: ["rating", "scale", "nps", "slider"] },
    { label: t("Advanced"), types: ["address", "media", "file_upload", "calculated", "hidden", "summary"] }
  ], i = new Set(n.flatMap((c) => c.types));
  return [
    ...n.map((c) => ({ ...c, types: c.types.filter((r) => l.includes(r)) })),
    { label: t("Other"), types: l.filter((c) => !i.has(c)) }
  ].filter((c) => c.types.length > 0);
}
function G(l) {
  return !["statement", "summary", "media", "hidden", "calculated"].includes(l);
}
const S = ["short_text", "long_text", "email", "phone"];
function ye() {
  return [
    { path: "helpText", label: t("Help text"), kind: "textarea", section: "content", types: "all" },
    { path: "placeholder", label: t("Placeholder"), kind: "text", section: "content", types: "input" },
    {
      path: "settings.layout",
      label: t("Choice layout"),
      kind: "select",
      section: "content",
      types: ["single_choice", "multi_choice"],
      fallback: "chips",
      options: () => [{ value: "chips", label: t("Chips") }, { value: "cards", label: t("Cards") }, { value: "dropdown", label: t("Dropdown") }]
    },
    { path: "settings.expression", label: t("Formula"), kind: "text", section: "content", types: ["calculated"], help: () => t("For example answer.price * answer.quantity + variable.score") },
    { path: "settings.country", label: t("Default country (ISO code)"), kind: "text", section: "content", types: ["phone"], fallback: "ID", upper: !0 },
    {
      path: "settings.addressFields",
      label: t("Address parts"),
      kind: "checklist",
      section: "content",
      types: ["address"],
      fallback: ["street", "city", "postcode", "country"],
      options: () => [{ value: "street", label: t("Street") }, { value: "city", label: t("City") }, { value: "postcode", label: t("Postcode") }, { value: "country", label: t("Country") }]
    },
    {
      path: "settings.media.type",
      label: t("Media type"),
      kind: "select",
      section: "content",
      types: ["media"],
      fallback: "image",
      options: () => [{ value: "image", label: t("Image") }, { value: "video", label: t("Video") }, { value: "gif", label: t("GIF") }]
    },
    { path: "settings.media.url", label: t("HTTPS media URL"), kind: "text", section: "content", types: ["media"] },
    { path: "settings.media.alt", label: t("Alternative text"), kind: "text", section: "content", types: ["media"] },
    { path: "settings.buttonLabel", label: t("Continue / submit button"), kind: "text", section: "content", types: ["statement", "summary"] },
    { path: "settings.autoContinue", label: t("Wait for the visitor to press a button"), kind: "toggle", section: "content", types: ["statement"], fallback: !0, invert: !0 },
    { path: "settings.consentText", label: t("Consent text"), kind: "textarea", section: "content", types: ["consent"] },
    { path: "settings.privacyUrl", label: t("Privacy policy URL"), kind: "text", section: "content", types: ["consent"] },
    {
      path: "settings.source",
      label: t("Where the value comes from"),
      kind: "select",
      section: "content",
      types: ["hidden"],
      fallback: "default",
      options: () => [
        { value: "default", label: t("Default value") },
        { value: "url", label: t("URL parameter") },
        { value: "cookie", label: t("Cookie") },
        { value: "meta", label: t("Page metadata") },
        { value: "merge", label: t("Merge tag") }
      ],
      help: () => t("Cookies are limited to utm_source, utm_medium, utm_campaign, utm_term, utm_content, campaign, tracking, cff_locale and cff_theme.")
    },
    { path: "settings.sourceKey", label: t("Parameter or cookie name (blank = field key)"), kind: "text", section: "content", types: ["hidden"] },
    { path: "defaultValue", label: t("Default value"), kind: "text", section: "content", types: ["hidden"] },
    { path: "validation.minLength", label: t("Minimum length"), kind: "number", section: "validation", types: S },
    { path: "validation.maxLength", label: t("Maximum length"), kind: "number", section: "validation", types: S },
    {
      path: "validation.format",
      label: t("Format"),
      kind: "select",
      section: "validation",
      types: S,
      fallback: "text",
      options: () => [{ value: "text", label: t("Any text") }, { value: "url", label: t("URL") }, { value: "email", label: t("Email address") }]
    },
    { path: "validation.pattern", label: t("Custom pattern (regular expression)"), kind: "text", section: "validation", types: S },
    { path: "validation.min", label: t("Minimum"), kind: "number", section: "validation", types: ["number", "slider"] },
    { path: "validation.max", label: t("Maximum"), kind: "number", section: "validation", types: ["number", "slider"] },
    { path: "validation.step", label: t("Increment"), kind: "number", section: "validation", types: ["number", "slider"] },
    { path: "settings.unit", label: t("Unit suffix"), kind: "text", section: "validation", types: ["number", "slider"] },
    { path: "validation.min", label: t("Earliest date"), kind: "date", section: "validation", types: ["date"] },
    { path: "validation.max", label: t("Latest date"), kind: "date", section: "validation", types: ["date"] },
    { path: "validation.minAge", label: t("Minimum age (years)"), kind: "number", section: "validation", types: ["date"] },
    { path: "validation.minSelections", label: t("Minimum selections"), kind: "number", section: "validation", types: ["multi_choice"] },
    { path: "validation.maxSelections", label: t("Maximum selections"), kind: "number", section: "validation", types: ["multi_choice"] },
    { path: "validation.maxBytes", label: t("Maximum bytes per file (blank = 10 MiB)"), kind: "number", section: "validation", types: ["file_upload"] },
    { path: "validation.mimeTypes", label: t("Allowed file types (comma separated)"), kind: "list", section: "validation", types: ["file_upload"] },
    { path: "hiddenByDefault", label: t("Hidden until a rule shows it"), kind: "toggle", section: "advanced", types: "all", fallback: !1 },
    { path: "settings.autocomplete", label: t("Autocomplete"), kind: "text", section: "advanced", types: "input", help: () => t("A browser autocomplete token, such as name, email or tel.") },
    {
      path: "settings.inputMode",
      label: t("Keyboard hint"),
      kind: "select",
      section: "advanced",
      types: "input",
      fallback: "text",
      options: () => [
        { value: "text", label: t("Standard keyboard") },
        { value: "numeric", label: t("Numbers") },
        { value: "tel", label: t("Telephone keypad") },
        { value: "decimal", label: t("Decimal numbers") },
        { value: "email", label: t("Email keyboard") },
        { value: "url", label: t("URL keyboard") },
        { value: "search", label: t("Search keyboard") },
        { value: "none", label: t("No on-screen keyboard") }
      ]
    }
  ];
}
function A(l, n) {
  return ye().filter((i) => i.section === n && (i.types === "all" || (i.types === "input" ? G(l) : i.types.includes(l))));
}
function ke(l, n) {
  return n.split(".").reduce((i, c) => i && typeof i == "object" ? i[c] : void 0, l);
}
function Ce(l, n, i) {
  const c = n.split("."), r = (o, m) => {
    const h = { ...o ?? {} }, a = c[m];
    if (m === c.length - 1)
      i === void 0 || i === "" ? delete h[a] : h[a] = i;
    else {
      const u = r(h[a], m + 1);
      u && Object.keys(u).length ? h[a] = u : delete h[a];
    }
    return h;
  };
  return r(l, 0);
}
function B({ step: l, setting: n, onChange: i }) {
  const c = v.useId(), r = ke(l, n.path), o = r ?? n.fallback, m = (a) => i(Ce(l, n.path, a)), h = n.help?.();
  if (n.kind === "toggle") {
    const a = n.invert ? o === !1 : !!o;
    return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-start cf:justify-between cf:gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1", children: [
        /* @__PURE__ */ e.jsx(s.Label, { htmlFor: c, children: n.label }),
        h && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: h })
      ] }),
      /* @__PURE__ */ e.jsx(s.Switch, { id: c, checked: a, onCheckedChange: (u) => m(n.invert ? !u : u) })
    ] });
  }
  if (n.kind === "checklist") {
    const a = Array.isArray(o) ? o : [];
    return /* @__PURE__ */ e.jsxs("fieldset", { className: "cf:flex cf:flex-col cf:gap-2", children: [
      /* @__PURE__ */ e.jsx("legend", { className: "cf:mb-1 cf:text-sm cf:font-medium", children: n.label }),
      n.options?.().map((u) => /* @__PURE__ */ e.jsxs("label", { className: "cf:flex cf:items-center cf:gap-2 cf:text-sm", children: [
        /* @__PURE__ */ e.jsx(
          s.Checkbox,
          {
            checked: a.includes(u.value),
            onCheckedChange: (g) => m(g ? [...a.filter((d) => d !== u.value), u.value] : a.filter((d) => d !== u.value))
          }
        ),
        u.label
      ] }, u.value))
    ] });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
    /* @__PURE__ */ e.jsx(s.Label, { htmlFor: c, children: n.label }),
    n.kind === "select" ? /* @__PURE__ */ e.jsxs(s.Select, { value: String(o ?? ""), onValueChange: (a) => m(a), children: [
      /* @__PURE__ */ e.jsx(s.SelectTrigger, { id: c, children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
      /* @__PURE__ */ e.jsx(s.SelectContent, { children: n.options?.().map((a) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: a.value, children: a.label }, a.value)) })
    ] }) : n.kind === "textarea" ? /* @__PURE__ */ e.jsx(s.Textarea, { id: c, rows: 3, value: String(r ?? ""), onChange: (a) => m(a.target.value) }) : n.kind === "number" ? /* @__PURE__ */ e.jsx(Ne, { id: c, value: typeof r == "number" ? r : void 0, onChange: m }) : n.kind === "list" ? /* @__PURE__ */ e.jsx(
      s.Input,
      {
        id: c,
        value: Array.isArray(r) ? r.join(", ") : "",
        onChange: (a) => m(a.target.value.split(",").map((u) => u.trim()).filter(Boolean))
      }
    ) : /* @__PURE__ */ e.jsx(
      s.Input,
      {
        id: c,
        type: n.kind === "date" ? "date" : "text",
        value: String(r ?? ""),
        placeholder: n.fallback !== void 0 && typeof n.fallback != "object" ? String(n.fallback) : void 0,
        onChange: (a) => m(n.upper ? a.target.value.toUpperCase() : a.target.value)
      }
    ),
    h && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: h })
  ] });
}
function Ne({ id: l, value: n, onChange: i }) {
  const [c, r] = v.useState(n === void 0 ? "" : String(n));
  return v.useEffect(() => r(n === void 0 ? "" : String(n)), [n]), /* @__PURE__ */ e.jsx(
    s.Input,
    {
      id: l,
      type: "number",
      inputMode: "decimal",
      value: c,
      onChange: (o) => {
        r(o.target.value), o.target.value === "" ? i(void 0) : Number.isFinite(Number(o.target.value)) && i(Number(o.target.value));
      }
    }
  );
}
const Se = /^[a-z][a-z0-9_]{0,63}$/, I = 200;
function we({ step: l, schema: n, reservedValues: i, onChange: c, onRenameKey: r, onRenameOption: o, actions: m }) {
  const h = G(l.type), a = A(l.type, "validation");
  return /* @__PURE__ */ e.jsxs(s.Card, { className: "cf:gap-4", children: [
    /* @__PURE__ */ e.jsxs(s.CardHeader, { className: "cf:flex cf:flex-row cf:items-start cf:justify-between cf:gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:min-w-0", children: [
        /* @__PURE__ */ e.jsx(s.CardTitle, { className: "cf:truncate", children: l.label || l.key }),
        /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: F(l.type) })
      ] }),
      m
    ] }),
    /* @__PURE__ */ e.jsx(s.CardContent, { children: /* @__PURE__ */ e.jsxs(s.Tabs, { defaultValue: "content", children: [
      /* @__PURE__ */ e.jsxs(s.TabsList, { children: [
        /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "content", children: t("Content") }),
        a.length > 0 && /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "validation", children: t("Validation") }),
        /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "advanced", children: t("Advanced") })
      ] }),
      /* @__PURE__ */ e.jsxs(s.TabsContent, { value: "content", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsx(Te, { step: l, onChange: c }),
        h && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
          /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-required-${l.id}`, children: t("Required") }),
          /* @__PURE__ */ e.jsx(
            s.Switch,
            {
              id: `cf-required-${l.id}`,
              checked: l.required || l.type === "consent",
              disabled: l.type === "consent",
              onCheckedChange: (u) => c({ ...l, required: u })
            }
          )
        ] }),
        A(l.type, "content").map((u) => /* @__PURE__ */ e.jsx(B, { step: l, setting: u, onChange: c }, u.path)),
        (l.type === "single_choice" || l.type === "multi_choice") && /* @__PURE__ */ e.jsx(Le, { step: l, reservedValues: i, onChange: c, onRenameOption: o }),
        ["rating", "scale", "nps"].includes(l.type) && /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: t("Rating: 1–5, scale: 1–10, NPS: 0–10. Answers are stored as numbers.") })
      ] }),
      a.length > 0 && /* @__PURE__ */ e.jsx(s.TabsContent, { value: "validation", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: a.map((u) => /* @__PURE__ */ e.jsx(B, { step: l, setting: u, onChange: c }, `${u.path}-${u.label}`)) }),
      /* @__PURE__ */ e.jsxs(s.TabsContent, { value: "advanced", className: "cf:mt-4 cf:flex cf:flex-col cf:gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-label-${l.id}`, children: t("Label") }),
          /* @__PURE__ */ e.jsx(s.Input, { id: `cf-label-${l.id}`, value: l.label, onChange: (u) => c({ ...l, label: u.target.value }) }),
          /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: t("How the question is named in the inbox, exports and emails. Follows the first message until you change it.") })
        ] }),
        /* @__PURE__ */ e.jsx(
          Y,
          {
            label: t("Field key"),
            value: l.key,
            onCommit: r,
            validate: (u) => Se.test(u) ? n.steps.some((g) => g.id !== l.id && g.key === u) ? t("Another field already uses this key.") : "" : t("Start with a lowercase letter; use only lowercase letters, numbers and underscores (64 max)."),
            help: t("Applied when you leave the field. Rules, merge tags, formulas and notifications that use the old key are updated.")
          }
        ),
        A(l.type, "advanced").map((u) => /* @__PURE__ */ e.jsx(B, { step: l, setting: u, onChange: c }, u.path))
      ] })
    ] }, l.id) })
  ] });
}
function Te({ step: l, onChange: n }) {
  const i = (c) => n(ie(l, c));
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
    l.messages.map((c, r) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
        /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-message-${l.id}-${r}`, children: l.messages.length > 1 ? k(t("Message %d"), r + 1) : t("Bot message") }),
        l.messages.length > 1 && /* @__PURE__ */ e.jsx(s.Button, { variant: "ghost", size: "sm", className: "cf:h-7 cf:text-destructive", onClick: () => i(l.messages.filter((o, m) => m !== r)), children: t("Remove") })
      ] }),
      /* @__PURE__ */ e.jsx(
        s.Textarea,
        {
          id: `cf-message-${l.id}-${r}`,
          rows: 2,
          value: c,
          onChange: (o) => i(l.messages.map((m, h) => h === r ? o.target.value : m))
        }
      )
    ] }, r)),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between cf:gap-2", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: t("Use {{field_key}} to repeat an earlier answer.") }),
      /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", size: "sm", disabled: l.messages.length >= 20, onClick: () => i([...l.messages, ""]), children: [
        /* @__PURE__ */ e.jsx(T, {}),
        " ",
        t("Add message")
      ] })
    ] })
  ] });
}
function Le({ step: l, reservedValues: n, onChange: i, onRenameOption: c }) {
  const r = l.options ?? [], [o, m] = v.useState(""), h = (d) => i({ ...l, options: d }), a = () => [...n, ...r.map((d) => d.value)], u = () => {
    const d = k(t("Option %d"), r.length + 1);
    h([...r, O(U(d, a()), d)]);
  }, g = () => {
    const d = a(), j = o.split(`
`).map((x) => x.trim()).filter(Boolean).slice(0, I - r.length).map((x) => {
      const p = U(x, d);
      return d.push(p), O(p, x);
    });
    h([...r, ...j]), m("");
  };
  return /* @__PURE__ */ e.jsxs("fieldset", { className: "cf:flex cf:flex-col cf:gap-3", children: [
    /* @__PURE__ */ e.jsx("legend", { className: "cf:mb-1 cf:text-sm cf:font-medium", children: t("Options") }),
    /* @__PURE__ */ e.jsx(s.SortableList, { items: r, getId: (d) => d.id, getLabel: (d) => d.label, onReorder: (d) => h(d), children: (d, { handle: j }) => /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2 cf:rounded-md cf:border cf:p-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(s.SortableHandle, { ...j, label: k(t("Move %s"), d.label) }),
        /* @__PURE__ */ e.jsx(
          s.Input,
          {
            "aria-label": t("Option label"),
            value: d.label,
            onChange: (x) => h(r.map((p) => p.id === d.id ? { ...p, label: x.target.value } : p))
          }
        ),
        /* @__PURE__ */ e.jsx(
          s.Button,
          {
            variant: "ghost",
            size: "icon",
            className: "cf:size-8 cf:shrink-0",
            "aria-label": k(t("Remove %s"), d.label),
            disabled: r.length <= 1,
            onClick: () => h(r.filter((x) => x.id !== d.id)),
            children: /* @__PURE__ */ e.jsx($, {})
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("details", { className: "cf:text-sm", children: [
        /* @__PURE__ */ e.jsx("summary", { className: "cf:cursor-pointer cf:text-muted-foreground", children: t("More") }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:mt-2 cf:flex cf:flex-col cf:gap-3", children: [
          /* @__PURE__ */ e.jsx(
            Y,
            {
              label: t("Stored value"),
              value: d.value,
              onCommit: (x) => c(d.id, x),
              validate: (x) => x.trim() ? x.length > 255 ? t("Use 255 characters or fewer.") : r.some((p) => p.id !== d.id && p.value === x) || n.includes(x) ? t("Another option already uses this value.") : "" : t("Enter a stored value."),
              help: t("What exports and rules see. Rules that compare against it are updated.")
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:grid-cols-2 cf:gap-2", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
              /* @__PURE__ */ e.jsx(s.Label, { children: t("Emoji") }),
              /* @__PURE__ */ e.jsx(s.Input, { value: d.emoji ?? "", onChange: (x) => h(r.map((p) => p.id === d.id ? { ...p, emoji: x.target.value } : p)) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
              /* @__PURE__ */ e.jsx(s.Label, { children: t("Reaction text") }),
              /* @__PURE__ */ e.jsx(s.Input, { value: d.reaction ?? "", onChange: (x) => h(r.map((p) => p.id === d.id ? { ...p, reaction: x.target.value } : p)) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("label", { className: "cf:flex cf:items-center cf:gap-2", children: [
            /* @__PURE__ */ e.jsx(s.Checkbox, { checked: !!d.isExclusive, onCheckedChange: (x) => h(r.map((p) => p.id === d.id ? { ...p, isExclusive: x } : p)) }),
            t("Exclusive (none of the above)")
          ] }),
          l.type === "single_choice" && /* @__PURE__ */ e.jsxs("label", { className: "cf:flex cf:items-center cf:gap-2", children: [
            /* @__PURE__ */ e.jsx(s.Checkbox, { checked: !!d.isOther, onCheckedChange: (x) => h(r.map((p) => p.id === d.id ? { ...p, isOther: x } : p)) }),
            t("“Other”: lets the visitor type an answer")
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: r.length >= I, onClick: u, children: [
      /* @__PURE__ */ e.jsx(T, {}),
      " ",
      t("Add option")
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsx(s.Label, { htmlFor: `cf-bulk-${l.id}`, children: t("Add several (one per line)") }),
      /* @__PURE__ */ e.jsx(s.Textarea, { id: `cf-bulk-${l.id}`, rows: 3, value: o, onChange: (d) => m(d.target.value) }),
      /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", size: "sm", className: "cf:self-start", disabled: !o.trim() || r.length >= I, onClick: g, children: t("Add these options") })
    ] })
  ] });
}
const _e = 3e3, Ae = 6e4;
function Be(l, n) {
  const i = v.useMemo(() => new ce(l, n), [l, n]), c = v.useSyncExternalStore(i.subscribe, i.snapshot), [r, o] = v.useState(""), [m, h] = v.useState(null), a = i.dirty();
  v.useEffect(() => {
    let j = !0;
    const x = () => l.request(`admin/forms/${n.id}/lock`, "POST", {}).then(() => j && o("")).catch((C) => j && o(D(C)));
    x();
    const p = window.setInterval(() => {
      x();
    }, Ae);
    return () => {
      j = !1, window.clearInterval(p);
    };
  }, [l, n.id]);
  const u = v.useCallback(() => {
    !r && !i.state.conflict && !i.state.saving && i.save().catch(() => {
    });
  }, [i, r]);
  v.useEffect(() => {
    const j = window.setInterval(() => {
      const x = i.state;
      !r && !x.conflict && !x.error && !x.saving && i.dirty() && i.save().catch(() => {
      });
    }, _e);
    return () => window.clearInterval(j);
  }, [i, r]);
  const g = v.useRef(!1);
  v.useEffect(() => {
    g.current && !c.saving && !c.error && h(/* @__PURE__ */ new Date()), g.current = c.saving;
  }, [c.saving, c.error]), s.useUnsavedChanges(a, u);
  const d = v.useCallback((j) => i.edit(j), [i]);
  return { controller: i, state: c, form: c.form, dirty: a, savedAt: m, lockError: r, edit: d, saveNow: u };
}
const H = 500;
function Oe({ formId: l, title: n, config: i }) {
  const c = ae(i), [r, o] = v.useState(null), [m, h] = v.useState("");
  return s.useBreadcrumbs([{ label: t("Forms"), href: w.forms() }, { label: r?.title ?? n }]), v.useEffect(() => {
    c.request(`admin/forms/${l}`).then(o).catch((a) => h(D(a)));
  }, [c, l]), r ? /* @__PURE__ */ e.jsx(Ie, { api: c, initial: r }) : /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(V.Head, { title: n }),
    /* @__PURE__ */ e.jsx(s.PageHeader, { title: n, back: { href: w.forms(), label: t("Forms") } }),
    /* @__PURE__ */ e.jsx("p", { className: m ? "cf:text-sm cf:text-destructive" : "cf:text-sm cf:text-muted-foreground", role: m ? "alert" : "status", children: m || t("Loading…") })
  ] });
}
function Ie({ api: l, initial: n }) {
  const i = Be(l, n), { controller: c, state: r, form: o, dirty: m, edit: h } = i, a = o.schema, [u, g] = me(), [d, j] = v.useState(a.steps[0]?.id ?? ""), [x, p] = v.useState(!1), [C, P] = v.useState(null), y = a.steps.find((f) => f.id === d);
  v.useEffect(() => {
    !y && a.steps[0] && j(a.steps[0].id);
  }, [y, a.steps]), v.useEffect(() => {
    if (!o.version) return;
    let f = !0;
    return l.request(`admin/forms/${o.id}/published`).then((b) => f && P(b)).catch(() => f && P(null)), () => {
      f = !1;
    };
  }, [l, o.id, o.version]);
  const L = v.useMemo(() => re(C, o), [C, o]), Q = o.version > 0 && C !== null && L.length > 0, _ = (f) => h((b) => ({ ...b, schema: f })), X = (f) => _({ ...a, steps: a.steps.map((b) => b.id === f.id ? f : b) }), R = (f) => {
    const b = a.steps.findIndex((se) => se.id === d), N = b >= 0 ? [...a.steps.slice(0, b + 1), f, ...a.steps.slice(b + 1)] : [...a.steps, f];
    _({ ...a, steps: N }), j(f.id);
  }, J = (f) => R(ue(f, a.steps, c.reservedKeys())), Z = async (f) => {
    a.steps.length <= 1 || await u({
      title: k(t("Delete “%s”?"), f.label || f.key),
      description: t("Rules that use it are removed, and notifications that depend on it are switched off. You can undo this."),
      confirmLabel: t("Delete field"),
      destructive: !0
    }) && h((b) => he(b, f.id));
  }, ee = async () => {
    try {
      await c.publish(), p(!1), s.toast.success(t("Published. Visitors now get this version."));
    } catch (f) {
      s.toast.error(D(f));
    }
  }, te = r.saving ? t("Saving…") : r.error ? t("Not saved") : m ? t("Unsaved changes") : i.savedAt ? k(t("Saved %s"), i.savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) : t("Saved");
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(V.Head, { title: o.title }),
    g,
    /* @__PURE__ */ e.jsxs(
      s.PageHeader,
      {
        title: o.title || t("Untitled form"),
        back: { href: w.forms(), label: t("Forms") },
        menu: [
          ...o.slug && o.version > 0 && l.config.fullpageBase ? [{ label: t("Open live form"), icon: /* @__PURE__ */ e.jsx(pe, {}), href: `${l.config.siteUrl ?? "/"}${l.config.fullpageBase}/${o.slug}/`, external: !0 }] : [],
          { label: t("Submissions"), href: w.submissions({ formId: o.id }) }
        ],
        actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(s.Button, { variant: "ghost", size: "icon", "aria-label": t("Undo"), disabled: !r.history.length || r.saving, onClick: () => c.undo(), children: /* @__PURE__ */ e.jsx(ge, {}) }),
          /* @__PURE__ */ e.jsx(s.Button, { variant: "ghost", size: "icon", "aria-label": t("Redo"), disabled: !r.future.length || r.saving, onClick: () => c.redo(), children: /* @__PURE__ */ e.jsx(ve, {}) })
        ] }),
        primary: /* @__PURE__ */ e.jsx(s.Button, { onClick: () => p(!0), disabled: !!r.conflict || !!i.lockError, children: t("Publish") }),
        children: [
          /* @__PURE__ */ e.jsx(s.Badge, { variant: "outline", role: "status", children: te }),
          o.version > 0 ? /* @__PURE__ */ e.jsx(s.Badge, { children: k(t("Live · v%d"), o.version) }) : /* @__PURE__ */ e.jsx(s.Badge, { variant: "secondary", children: t("Not published") }),
          Q && /* @__PURE__ */ e.jsx(s.Badge, { variant: "secondary", children: t("Unpublished changes") })
        ]
      }
    ),
    /* @__PURE__ */ e.jsx(Ee, { draft: i }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:max-w-xl cf:flex-col cf:gap-1.5", children: [
      /* @__PURE__ */ e.jsx(s.Label, { htmlFor: "cf-form-title", children: t("Form name") }),
      /* @__PURE__ */ e.jsx(s.Input, { id: "cf-form-title", value: o.title, maxLength: 500, onChange: (f) => h((b) => ({ ...b, title: f.target.value })) })
    ] }),
    /* @__PURE__ */ e.jsxs(s.Tabs, { defaultValue: "build", children: [
      /* @__PURE__ */ e.jsxs(s.TabsList, { children: [
        /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "build", children: t("Questions") }),
        /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "endings", children: t("Endings") })
      ] }),
      /* @__PURE__ */ e.jsx(s.TabsContent, { value: "build", className: "cf:mt-4", children: /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-6 cf:lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-between", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "cf:text-sm cf:font-medium", children: k(t("Conversation · %d fields"), a.steps.length) }),
            /* @__PURE__ */ e.jsx(Me, { available: l.config.features.fieldTypes, disabled: a.steps.length >= H, onAdd: J })
          ] }),
          /* @__PURE__ */ e.jsx(
            s.SortableList,
            {
              items: a.steps,
              getId: (f) => f.id,
              getLabel: (f) => f.label || f.key,
              onReorder: (f) => _({ ...a, steps: f }),
              children: (f, { handle: b, index: N }) => /* @__PURE__ */ e.jsxs("div", { className: `cf:flex cf:items-center cf:gap-2 cf:rounded-md cf:border cf:bg-card cf:p-2 ${f.id === d ? "cf:border-primary cf:ring-1 cf:ring-primary" : ""}`, children: [
                /* @__PURE__ */ e.jsx(s.SortableHandle, { ...b, label: k(t("Move %s"), f.label || f.key) }),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-step-id": f.id,
                    "aria-pressed": f.id === d,
                    onClick: () => j(f.id),
                    className: "cf:flex cf:min-w-0 cf:flex-1 cf:flex-col cf:items-start cf:text-left",
                    children: [
                      /* @__PURE__ */ e.jsxs("span", { className: "cf:flex cf:w-full cf:items-center cf:gap-2", children: [
                        /* @__PURE__ */ e.jsx("span", { className: "cf:text-xs cf:text-muted-foreground cf:tabular-nums", children: String(N + 1).padStart(2, "0") }),
                        /* @__PURE__ */ e.jsx("span", { className: "cf:truncate cf:font-medium", children: f.label || f.key })
                      ] }),
                      /* @__PURE__ */ e.jsxs("span", { className: "cf:text-xs cf:text-muted-foreground", children: [
                        F(f.type),
                        f.required ? ` · ${t("Required")}` : "",
                        f.hiddenByDefault ? ` · ${t("Hidden")}` : ""
                      ] })
                    ]
                  }
                )
              ] })
            }
          )
        ] }),
        y ? /* @__PURE__ */ e.jsx(
          we,
          {
            step: y,
            schema: a,
            reservedValues: c.reservedOptionValues(y.id),
            onChange: X,
            onRenameKey: (f) => h((b) => fe(b, y.id, f)),
            onRenameOption: (f, b) => h((N) => de(N, y.id, f, b)),
            actions: /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-1", children: [
              /* @__PURE__ */ e.jsx(
                s.Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "cf:size-8",
                  "aria-label": t("Duplicate field"),
                  disabled: a.steps.length >= H,
                  onClick: () => R(oe(y, a.steps, c.reservedKeys())),
                  children: /* @__PURE__ */ e.jsx(xe, {})
                }
              ),
              /* @__PURE__ */ e.jsx(
                s.Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "cf:size-8 cf:text-destructive",
                  "aria-label": t("Delete field"),
                  disabled: a.steps.length <= 1,
                  onClick: () => {
                    Z(y);
                  },
                  children: /* @__PURE__ */ e.jsx($, {})
                }
              )
            ] })
          },
          y.id
        ) : /* @__PURE__ */ e.jsx(s.Card, { children: /* @__PURE__ */ e.jsx(s.CardContent, { className: "cf:text-muted-foreground", children: t("Add a field to start.") }) })
      ] }) }),
      /* @__PURE__ */ e.jsx(s.TabsContent, { value: "endings", className: "cf:mt-4", children: /* @__PURE__ */ e.jsx(be, { form: o, onChange: (f) => h(() => f) }) })
    ] }),
    /* @__PURE__ */ e.jsx(s.Dialog, { open: x, onOpenChange: p, children: /* @__PURE__ */ e.jsxs(s.DialogContent, { children: [
      /* @__PURE__ */ e.jsxs(s.DialogHeader, { children: [
        /* @__PURE__ */ e.jsx(s.DialogTitle, { children: o.version > 0 ? t("Publish a new version?") : t("Publish this form?") }),
        /* @__PURE__ */ e.jsx(s.DialogDescription, { children: o.version > 0 ? t("Visitors who start the form from now on get the new version. Conversations in progress keep the one they started with.") : t("The form becomes available to visitors. Later edits stay in the draft until you publish again.") })
      ] }),
      o.version > 0 && (L.length ? /* @__PURE__ */ e.jsx("ul", { className: "cf:list-disc cf:pl-5 cf:text-sm", children: L.map((f) => /* @__PURE__ */ e.jsx("li", { children: f }, f)) }) : /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: t("Nothing changed since the live version.") })),
      /* @__PURE__ */ e.jsxs(s.DialogFooter, { children: [
        /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => p(!1), children: t("Cancel") }),
        /* @__PURE__ */ e.jsx(s.Button, { onClick: () => {
          ee();
        }, disabled: r.saving, children: r.saving ? t("Publishing…") : o.version > 0 ? t("Publish new version") : t("Publish") })
      ] })
    ] }) })
  ] });
}
function Me({ available: l, disabled: n, onAdd: i }) {
  return /* @__PURE__ */ e.jsxs(s.DropdownMenu, { children: [
    /* @__PURE__ */ e.jsx(s.DropdownMenuTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsxs(s.Button, { size: "sm", disabled: n, children: [
      /* @__PURE__ */ e.jsx(T, {}),
      " ",
      t("Add field")
    ] }) }),
    /* @__PURE__ */ e.jsx(s.DropdownMenuContent, { align: "end", className: "cf:max-h-96 cf:overflow-y-auto", children: je(l).map((c, r) => /* @__PURE__ */ e.jsxs("div", { children: [
      r > 0 && /* @__PURE__ */ e.jsx(s.DropdownMenuSeparator, {}),
      /* @__PURE__ */ e.jsx(s.DropdownMenuLabel, { children: c.label }),
      c.types.map((o) => /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => i(o), children: F(o) }, o))
    ] }, c.label)) })
  ] });
}
function Ee({ draft: l }) {
  const { controller: n, state: i } = l;
  return i.conflict ? /* @__PURE__ */ e.jsxs(
    M,
    {
      tone: "error",
      title: t("Someone else saved this form"),
      text: t("Your edits are kept here but not saved. Load their version (your edits are lost), or keep yours and save over it."),
      children: [
        /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", size: "sm", onClick: () => {
          n.reload();
        }, children: t("Load their version") }),
        /* @__PURE__ */ e.jsx(s.Button, { size: "sm", onClick: () => {
          n.rebaseLocal().then(() => l.saveNow());
        }, children: t("Keep mine") })
      ]
    }
  ) : l.lockError ? /* @__PURE__ */ e.jsx(M, { tone: "warning", title: t("Another admin is editing this form"), text: l.lockError }) : i.error ? /* @__PURE__ */ e.jsxs(M, { tone: "error", title: t("The draft was not saved"), text: i.error, children: [
    /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", size: "sm", onClick: () => l.saveNow(), children: t("Try again") }),
    i.issues.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "cf:mt-2 cf:w-full cf:list-disc cf:pl-5 cf:text-sm", children: i.issues.slice(0, 10).map((c, r) => /* @__PURE__ */ e.jsx("li", { children: c.message }, r)) })
  ] }) : null;
}
function M({ tone: l, title: n, text: i, children: c }) {
  return /* @__PURE__ */ e.jsxs("div", { role: "alert", className: `cf:flex cf:flex-wrap cf:items-center cf:gap-3 cf:rounded-lg cf:border cf:p-4 ${l === "error" ? "cf:border-destructive/50 cf:bg-destructive/5" : "cf:border-amber-500/50 cf:bg-amber-500/5"}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "cf:min-w-0 cf:flex-1", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:font-medium", children: n }),
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: i })
    ] }),
    c
  ] });
}
export {
  Oe as default
};
