import { _ as s, u as a, a as u, j as e, r as h } from "./urls-CCkQR_q7.js";
import { c as x, u as v, _ as g, e as _ } from "./api-DaaYNAHm.js";
import { i as w } from "./formIO-BfHyQQ2E.js";
const j = {
  name: "file-plus-corner",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35",
        key: "17jvcc"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["path", { d: "M14 19h6", key: "bvotb8" }],
    ["path", { d: "M17 16v6", key: "18yu1i" }]
  ],
  aliases: ["file-plus-2"]
};
j.node;
const N = x(j);
const b = {
  name: "upload",
  size: 24,
  node: [
    ["path", { d: "M12 3v12", key: "1x0j5s" }],
    ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
  ]
};
b.node;
const S = x(b);
function p(t) {
  const n = globalThis.crypto;
  if (n && typeof n.randomUUID == "function")
    return `${t}_${n.randomUUID().replace(/-/g, "")}`;
  const c = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `${t}_${c}`;
}
function $(t, n, c = []) {
  const i = t.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^[_0-9]+/, "").slice(0, 55) || "field";
  let o = i, d = 2;
  for (; c.includes(o) || n.some((l) => l.key === o); ) o = `${i}_${d++}`;
  return o;
}
function T(t, n, c = []) {
  const i = s("New question"), o = {
    id: p("stp"),
    key: $(t, n, c),
    type: t,
    label: i,
    messages: [i],
    required: !1,
    logic: []
  };
  return ["single_choice", "multi_choice"].includes(t) && (o.options = [D("option_1", s("Option 1"))]), o;
}
function D(t, n = t) {
  return { id: p("opt"), value: t, label: n };
}
function F(t = {}) {
  const n = p("end");
  return {
    id: 0,
    title: s("Untitled form"),
    slug: "",
    status: "draft",
    version: 0,
    draftRevision: 0,
    schema: {
      schemaVersion: 1,
      bot: { name: "ChatFlow", typingSpeed: "normal" },
      steps: [T("statement", [])],
      endings: [{ id: n, type: "message", messages: [s("Thank you!")] }]
    },
    settings: {
      completion: { defaultEndingId: n },
      sessions: {
        savePartial: !0,
        resumeEnabled: !0,
        resumePrompt: !0,
        resumeDays: 30,
        abandonDays: 30
      },
      // Privacy, retention and spam values are inherited from global Settings at
      // runtime, so they are never copied in. The theme has no runtime fallback;
      // the global "default theme" seeds new forms only.
      // New forms start with the messaging look; existing forms keep their saved style.
      // Dark messaging uses fixed runtime colours; seed the accessible accent for light/auto.
      appearance: { ...t.appearance?.theme === "dark" ? {} : { primary: "#2271b1" }, ...t.appearance, style: "messaging" }
    }
  };
}
function U({ templates: t, config: n }) {
  a.useBreadcrumbs([{ label: s("Forms"), href: u.forms() }, { label: s("New form") }]);
  const c = v(n), [i, o] = g.useState(null), d = g.useRef(null), l = async (r, f) => {
    if (!i) {
      o(r);
      try {
        const m = await f();
        h.router.visit(u.form(m.id));
      } catch (m) {
        a.toast.error(_(m)), o(null);
      }
    }
  }, y = () => l("blank", () => {
    const r = F(n.defaults);
    return c.request("admin/forms", "POST", { title: r.title, schema: r.schema, settings: r.settings });
  }), C = (r) => l(r.id, () => c.request(`admin/templates/${r.id}`, "POST", {})), k = (r) => l("import", async () => w(await r.text(), c));
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(h.Head, { title: s("New form") }),
    /* @__PURE__ */ e.jsx(
      a.PageHeader,
      {
        title: s("New form"),
        description: s("Start blank, from a template, or from a form you exported. You can edit every question before publishing."),
        back: { href: u.forms(), label: s("Forms") }
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2", children: [
      /* @__PURE__ */ e.jsxs(a.Card, { children: [
        /* @__PURE__ */ e.jsxs(a.CardHeader, { children: [
          /* @__PURE__ */ e.jsx(a.CardTitle, { children: s("Blank form") }),
          /* @__PURE__ */ e.jsx(a.CardDescription, { children: s("A welcome message and an ending, ready for your questions.") })
        ] }),
        /* @__PURE__ */ e.jsx(a.CardContent, { children: /* @__PURE__ */ e.jsxs(a.Button, { onClick: () => {
          y();
        }, disabled: i !== null, children: [
          /* @__PURE__ */ e.jsx(N, {}),
          " ",
          i === "blank" ? s("Creating…") : s("Start blank")
        ] }) })
      ] }),
      /* @__PURE__ */ e.jsxs(a.Card, { children: [
        /* @__PURE__ */ e.jsxs(a.CardHeader, { children: [
          /* @__PURE__ */ e.jsx(a.CardTitle, { children: s("Import a form") }),
          /* @__PURE__ */ e.jsx(a.CardDescription, { children: s("A JSON file exported from ChatFlow. It becomes a new draft; webhooks come in turned off.") })
        ] }),
        /* @__PURE__ */ e.jsxs(a.CardContent, { children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              ref: d,
              type: "file",
              accept: ".json,application/json",
              className: "cf:sr-only",
              "aria-label": s("Form JSON file"),
              onChange: (r) => {
                const f = r.currentTarget.files?.[0];
                r.currentTarget.value = "", f && k(f);
              }
            }
          ),
          /* @__PURE__ */ e.jsxs(a.Button, { variant: "outline", onClick: () => d.current?.click(), disabled: i !== null, children: [
            /* @__PURE__ */ e.jsx(S, {}),
            " ",
            i === "import" ? s("Importing…") : s("Choose a file")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "cf:flex cf:flex-col cf:gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "cf:text-lg cf:font-semibold", children: s("Templates") }),
      /* @__PURE__ */ e.jsx("div", { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2 cf:xl:grid-cols-3", children: t.map((r) => /* @__PURE__ */ e.jsxs(a.Card, { className: "cf:flex cf:flex-col", children: [
        /* @__PURE__ */ e.jsxs(a.CardHeader, { children: [
          /* @__PURE__ */ e.jsx(a.CardTitle, { children: r.title }),
          /* @__PURE__ */ e.jsx(a.CardDescription, { children: r.description })
        ] }),
        /* @__PURE__ */ e.jsxs(a.CardContent, { className: "cf:mt-auto cf:flex cf:items-center cf:justify-between cf:gap-2", children: [
          /* @__PURE__ */ e.jsx(a.Badge, { variant: "outline", children: r.locale.replace("_", "-") }),
          /* @__PURE__ */ e.jsx(
            a.Button,
            {
              variant: "outline",
              onClick: () => {
                C(r);
              },
              disabled: i !== null,
              "aria-label": `${s("Use template")}: ${r.title}`,
              children: i === r.id ? s("Creating…") : s("Use template")
            }
          )
        ] })
      ] }, r.id)) })
    ] })
  ] });
}
export {
  U as default
};
