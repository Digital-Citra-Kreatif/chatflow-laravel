import { c as x, u as s, d as c, _ as a, a as y, b as u, j as e, r as h, e as v } from "./urls-BB4MaRFd.js";
import { i as N } from "./formIO-DneCsNb-.js";
import { b as w } from "./model-BTuNCoDr.js";
const p = {
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
p.node;
const _ = x(p);
const j = {
  name: "upload",
  size: 24,
  node: [
    ["path", { d: "M12 3v12", key: "1x0j5s" }],
    ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
  ]
};
j.node;
const F = x(j);
function H({ templates: C, config: d }) {
  s.useBreadcrumbs([{ label: a("Forms"), href: c.forms() }, { label: a("New form") }]);
  const n = y(d), [i, f] = u.useState(null), m = u.useRef(null), l = async (r, t) => {
    if (!i) {
      f(r);
      try {
        const o = await t();
        h.router.visit(c.form(o.id));
      } catch (o) {
        s.toast.error(v(o)), f(null);
      }
    }
  }, b = () => l("blank", () => {
    const r = w(d.defaults);
    return n.request("admin/forms", "POST", { title: r.title, schema: r.schema, settings: r.settings });
  }), g = (r) => l(r.id, () => n.request(`admin/templates/${r.id}`, "POST", {})), k = (r) => l("import", async () => N(await r.text(), n));
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(h.Head, { title: a("New form") }),
    /* @__PURE__ */ e.jsx(
      s.PageHeader,
      {
        title: a("New form"),
        description: a("Start blank, from a template, or from a form you exported. You can edit every question before publishing."),
        back: { href: c.forms(), label: a("Forms") }
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2", children: [
      /* @__PURE__ */ e.jsxs(s.Card, { children: [
        /* @__PURE__ */ e.jsxs(s.CardHeader, { children: [
          /* @__PURE__ */ e.jsx(s.CardTitle, { children: a("Blank form") }),
          /* @__PURE__ */ e.jsx(s.CardDescription, { children: a("A welcome message and an ending, ready for your questions.") })
        ] }),
        /* @__PURE__ */ e.jsx(s.CardContent, { children: /* @__PURE__ */ e.jsxs(s.Button, { onClick: () => {
          b();
        }, disabled: i !== null, children: [
          /* @__PURE__ */ e.jsx(_, {}),
          " ",
          i === "blank" ? a("Creating…") : a("Start blank")
        ] }) })
      ] }),
      /* @__PURE__ */ e.jsxs(s.Card, { children: [
        /* @__PURE__ */ e.jsxs(s.CardHeader, { children: [
          /* @__PURE__ */ e.jsx(s.CardTitle, { children: a("Import a form") }),
          /* @__PURE__ */ e.jsx(s.CardDescription, { children: a("A JSON file exported from ChatFlow. It becomes a new draft; webhooks come in turned off.") })
        ] }),
        /* @__PURE__ */ e.jsxs(s.CardContent, { children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              ref: m,
              type: "file",
              accept: ".json,application/json",
              className: "cf:sr-only",
              "aria-label": a("Form JSON file"),
              onChange: (r) => {
                const t = r.currentTarget.files?.[0];
                r.currentTarget.value = "", t && k(t);
              }
            }
          ),
          /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", onClick: () => m.current?.click(), disabled: i !== null, children: [
            /* @__PURE__ */ e.jsx(F, {}),
            " ",
            i === "import" ? a("Importing…") : a("Choose a file")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "cf:flex cf:flex-col cf:gap-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "cf:text-lg cf:font-semibold", children: a("Templates") }),
      /* @__PURE__ */ e.jsx("div", { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2 cf:xl:grid-cols-3", children: C.map((r) => /* @__PURE__ */ e.jsxs(s.Card, { className: "cf:flex cf:flex-col", children: [
        /* @__PURE__ */ e.jsxs(s.CardHeader, { children: [
          /* @__PURE__ */ e.jsx(s.CardTitle, { children: r.title }),
          /* @__PURE__ */ e.jsx(s.CardDescription, { children: r.description })
        ] }),
        /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:mt-auto cf:flex cf:items-center cf:justify-between cf:gap-2", children: [
          /* @__PURE__ */ e.jsx(s.Badge, { variant: "outline", children: r.locale.replace("_", "-") }),
          /* @__PURE__ */ e.jsx(
            s.Button,
            {
              variant: "outline",
              onClick: () => {
                g(r);
              },
              disabled: i !== null,
              "aria-label": `${a("Use template")}: ${r.title}`,
              children: i === r.id ? a("Creating…") : a("Use template")
            }
          )
        ] })
      ] }, r.id)) })
    ] })
  ] });
}
export {
  H as default
};
