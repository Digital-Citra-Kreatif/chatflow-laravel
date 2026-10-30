import { a as Y, _ as t, u as s, j as e, r as M, s as R } from "./urls-CCkQR_q7.js";
import { c as _, u as Z, _ as d, a as H, e as g } from "./api-DaaYNAHm.js";
import { r as O, s as P, S as I, b as ee, d as q } from "./model-BR-L-RPD.js";
import { u as se, a as k, b as E } from "./format-CVuBg-UU.js";
import { T as te } from "./trash-CzeylCxw.js";
const L = {
  name: "copy",
  size: 24,
  node: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
  ]
};
L.node;
const ae = _(L);
const V = {
  name: "mail",
  size: 24,
  node: [
    ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
    ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
  ]
};
V.node;
const re = _(V);
const F = {
  name: "printer",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
        key: "143wyd"
      }
    ],
    ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
    ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
  ]
};
F.node;
const ce = _(F);
const J = {
  name: "refresh-cw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
    ["path", { d: "M8 16H3v5", key: "1cv678" }]
  ]
};
J.node;
const ne = _(J), ie = (c, i) => Object.prototype.hasOwnProperty.call(c, i), le = (c) => typeof c == "object" && c !== null && !Array.isArray(c) && Object.keys(c).sort().join(",") === "other,value" && typeof c.value == "string" && typeof c.other == "string";
function B(c) {
  return c == null ? "" : le(c) ? `${c.value}: ${c.other}` : Array.isArray(c) ? c.map(B).join(", ") : typeof c == "object" ? Object.keys(c).sort().map((i) => `${i}: ${B(c[i])}`).join(", ") : String(c);
}
function oe(c, i = {}, f = {}) {
  return c.replace(/\{\{([^{}]*)\}\}/g, (l, y) => {
    const r = /^[ \t\r\n]*(?:(answer|meta):)?([a-z][a-z0-9_]*)[ \t\r\n]*(?:\|([^{}]*))?$/.exec(y);
    if (!r) return "";
    const b = r[1] === "meta" ? f : i, u = r[2];
    return B(ie(b, u) ? b[u] : void 0) || r[3] || "";
  });
}
function pe({ submissionId: c, config: i }) {
  const f = Z(i), [l, y] = se(), [r, b] = d.useState(null), [u, w] = d.useState(""), [x, h] = d.useState(!1), [v, C] = d.useState(""), n = H(i, "edit_submissions"), j = new URLSearchParams(window.location.search).get("back") ?? "", m = Y.submissions() + (j ? `?${j}` : ""), N = r ? `${r.form?.title ?? t("Submission")} · ${O(r.id)}` : O(c);
  s.useBreadcrumbs([{ label: t("Submissions"), href: m }, { label: O(c) }]);
  const A = d.useCallback(() => f.request(`admin/submissions/${c}`).then((a) => {
    b(a), w("");
  }).catch((a) => w(g(a))), [f, c]);
  d.useEffect(() => {
    A();
  }, [A]);
  const S = async (a, o) => {
    h(!0);
    try {
      return await f.request(`admin/submissions/${c}`, "PATCH", a), await A(), o && s.toast.success(o), !0;
    } catch (p) {
      return s.toast.error(g(p)), !1;
    } finally {
      h(!1);
    }
  }, U = async (a) => {
    !r || a === r.status || await l({ title: R(t("Change this submission to “%s”?"), P(a)), confirmLabel: t("Change status") }) && await S({ status: a }, t("Status changed."));
  }, G = async () => {
    if (await l({ title: t("Resend this submission’s emails?"), description: t("Every admin notification and autoresponder that matches it is sent again."), confirmLabel: t("Resend") }))
      try {
        await f.request(`admin/submissions/${c}/resend`, "POST", { requestId: crypto.randomUUID() }), s.toast.success(t("Emails queued."));
      } catch (a) {
        s.toast.error(g(a));
      }
  }, K = async () => {
    if (await l({ title: t("Move this submission to the trash?"), confirmLabel: t("Move to trash"), destructive: !0 }))
      try {
        await f.request(`admin/submissions/${c}`, "DELETE"), s.toast.success(t("Moved to the trash.")), M.router.visit(m);
      } catch (a) {
        s.toast.error(g(a));
      }
  }, Q = async (a, o) => {
    try {
      await navigator.clipboard.writeText(a), s.toast.success(o);
    } catch {
      s.toast.error(t("Could not copy to the clipboard."));
    }
  };
  if (!r)
    return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
      /* @__PURE__ */ e.jsx(M.Head, { title: N }),
      /* @__PURE__ */ e.jsx(s.PageHeader, { title: N, back: { href: m, label: t("Submissions") } }),
      u ? /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", role: "alert", children: u }) : /* @__PURE__ */ e.jsx(s.Skeleton, { className: "cf:h-64 cf:w-full" })
    ] });
  const $ = r.form?.schema.steps ?? [], W = $.filter((a) => r.visited.includes(a.id) && Object.prototype.hasOwnProperty.call(r.answers, a.key)), D = r.notes.filter((a) => a.kind === "note");
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(M.Head, { title: N }),
    y,
    /* @__PURE__ */ e.jsx(
      s.PageHeader,
      {
        title: N,
        description: [k(r.createdAt), R(t("Form version %d"), r.formVersion), R(t("%ds"), Math.round(r.durationMs / 1e3)), `${r.progress}%`].join(" · "),
        back: { href: m, label: t("Submissions") },
        menu: [
          { label: t("Print"), icon: /* @__PURE__ */ e.jsx(ce, {}), onSelect: () => window.print() },
          { label: t("Copy response ID"), icon: /* @__PURE__ */ e.jsx(ae, {}), onSelect: () => {
            Q(r.uuid, t("Response ID copied."));
          } },
          ...n && r.status === "completed" ? [{ label: t("Resend emails"), icon: /* @__PURE__ */ e.jsx(re, {}), onSelect: () => {
            G();
          } }] : [],
          ...H(i, "delete_submissions") && r.status !== "trash" ? [{ label: t("Move to trash"), icon: /* @__PURE__ */ e.jsx(te, {}), destructive: !0, onSelect: () => {
            K();
          } }] : []
        ],
        actions: n && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", disabled: x, onClick: () => {
            S({ isRead: !r.isRead });
          }, children: r.isRead ? t("Mark unread") : t("Mark read") }),
          /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", disabled: x, "aria-pressed": r.isStarred, onClick: () => {
            S({ isStarred: !r.isStarred });
          }, children: [
            /* @__PURE__ */ e.jsx(I, { className: r.isStarred ? "cf:fill-current cf:text-amber-500" : void 0 }),
            " ",
            r.isStarred ? t("Starred") : t("Star")
          ] })
        ] }),
        children: /* @__PURE__ */ e.jsx(s.Badge, { variant: r.status === "completed" ? "default" : "secondary", children: P(r.status) })
      }
    ),
    !r.form && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: t("The form as it was when this was answered is no longer available; answers are shown by field key.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-6 cf:xl:grid-cols-[minmax(0,1fr)_20rem]", children: [
      /* @__PURE__ */ e.jsxs(s.Tabs, { defaultValue: "answers", className: "cf:min-w-0", children: [
        /* @__PURE__ */ e.jsxs(s.TabsList, { children: [
          /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "answers", children: t("Answers") }),
          /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "conversation", children: t("Conversation") }),
          /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "details", children: t("Details") }),
          /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "activity", children: t("Emails") })
        ] }),
        /* @__PURE__ */ e.jsx(s.TabsContent, { value: "answers", children: /* @__PURE__ */ e.jsx(s.Card, { children: /* @__PURE__ */ e.jsx(s.CardContent, { children: /* @__PURE__ */ e.jsxs("dl", { className: "cf:divide-y cf:divide-border", children: [
          (r.form ? W.map((a) => [a.id, a.label || a.key, r.answers[a.key]]) : Object.entries(r.answers).map(([a, o]) => [a, a, o])).map(([a, o, p]) => /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-1 cf:py-3 cf:sm:grid-cols-[minmax(0,14rem)_1fr] cf:sm:gap-4", children: [
            /* @__PURE__ */ e.jsx("dt", { className: "cf:text-sm cf:text-muted-foreground", children: o }),
            /* @__PURE__ */ e.jsx("dd", { className: "cf:whitespace-pre-wrap cf:break-words", children: E(p, q) || "—" })
          ] }, a)),
          !Object.keys(r.answers).length && /* @__PURE__ */ e.jsx("p", { className: "cf:py-3 cf:text-muted-foreground", children: t("No answers yet.") })
        ] }) }) }) }),
        /* @__PURE__ */ e.jsx(s.TabsContent, { value: "conversation", children: /* @__PURE__ */ e.jsx(s.Card, { children: /* @__PURE__ */ e.jsx(s.CardContent, { children: /* @__PURE__ */ e.jsx("ol", { className: "cf:flex cf:flex-col cf:gap-3", children: r.visited.map((a) => {
          const o = $.find((p) => p.id === a);
          return o ? /* @__PURE__ */ e.jsxs("li", { className: "cf:flex cf:flex-col cf:gap-2", children: [
            o.messages.map((p, X) => /* @__PURE__ */ e.jsx("p", { className: "cf:max-w-[80%] cf:self-start cf:rounded-lg cf:bg-muted cf:px-3 cf:py-2 cf:text-sm", children: oe(p, r.answers, r.meta) }, X)),
            Object.prototype.hasOwnProperty.call(r.answers, o.key) && /* @__PURE__ */ e.jsx("p", { className: "cf:max-w-[80%] cf:self-end cf:rounded-lg cf:bg-primary cf:px-3 cf:py-2 cf:text-sm cf:text-primary-foreground", children: E(r.answers[o.key], q) || t("Skipped") })
          ] }, a) : null;
        }) }) }) }) }),
        /* @__PURE__ */ e.jsx(s.TabsContent, { value: "details", children: /* @__PURE__ */ e.jsx(s.Card, { children: /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
          /* @__PURE__ */ e.jsx(T, { title: t("Response ID"), children: /* @__PURE__ */ e.jsx("code", { className: "cf:text-sm", children: r.uuid }) }),
          /* @__PURE__ */ e.jsx(T, { title: t("Field keys"), children: /* @__PURE__ */ e.jsx("dl", { className: "cf:grid cf:grid-cols-[auto_1fr] cf:gap-x-4 cf:gap-y-1 cf:text-sm", children: $.filter((a) => a.key).map((a) => /* @__PURE__ */ e.jsxs("div", { className: "cf:contents", children: [
            /* @__PURE__ */ e.jsx("dt", { className: "cf:text-muted-foreground", children: a.label || a.key }),
            /* @__PURE__ */ e.jsx("dd", { children: /* @__PURE__ */ e.jsx("code", { children: a.key }) })
          ] }, a.id)) }) }),
          /* @__PURE__ */ e.jsx(T, { title: t("Collected metadata"), children: /* @__PURE__ */ e.jsx(z, { value: r.meta }) }),
          /* @__PURE__ */ e.jsx(T, { title: t("Recorded consent text and version"), children: /* @__PURE__ */ e.jsx(z, { value: r.consent }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(s.TabsContent, { value: "activity", children: /* @__PURE__ */ e.jsx(fe, { api: f, id: c, canRetry: n }) })
      ] }),
      /* @__PURE__ */ e.jsxs("aside", { className: "cf:flex cf:flex-col cf:gap-6", children: [
        n && /* @__PURE__ */ e.jsxs(s.Card, { children: [
          /* @__PURE__ */ e.jsx(s.CardHeader, { children: /* @__PURE__ */ e.jsx(s.CardTitle, { children: t("Status") }) }),
          /* @__PURE__ */ e.jsx(s.CardContent, { children: /* @__PURE__ */ e.jsxs(s.Select, { value: r.status, onValueChange: (a) => {
            U(a);
          }, disabled: x, children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { "aria-label": t("Status"), children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsx(s.SelectContent, { children: ee.filter((a) => a !== "trash" || a === r.status || H(i, "delete_submissions")).map((a) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: a, children: P(a) }, a)) })
          ] }) })
        ] }),
        /* @__PURE__ */ e.jsxs(s.Card, { children: [
          /* @__PURE__ */ e.jsx(s.CardHeader, { children: /* @__PURE__ */ e.jsx(s.CardTitle, { children: t("Notes") }) }),
          /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:flex cf:flex-col cf:gap-3", children: [
            D.length ? /* @__PURE__ */ e.jsx("ul", { className: "cf:flex cf:flex-col cf:gap-3", children: D.map((a) => /* @__PURE__ */ e.jsxs("li", { className: "cf:text-sm", children: [
              /* @__PURE__ */ e.jsx("p", { className: "cf:whitespace-pre-wrap", children: a.message }),
              /* @__PURE__ */ e.jsx("time", { className: "cf:text-xs cf:text-muted-foreground", dateTime: a.createdAt, children: k(a.createdAt) })
            ] }, a.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: t("No notes yet.") }),
            n && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(
                s.Textarea,
                {
                  "aria-label": t("Add a private note"),
                  placeholder: t("Add a private note…"),
                  value: v,
                  rows: 3,
                  onChange: (a) => C(a.target.value)
                }
              ),
              /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", disabled: x || !v.trim(), onClick: async () => {
                await S({ note: v }, t("Note added.")) && C("");
              }, children: t("Add note") })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function T({ title: c, children: i }) {
  return /* @__PURE__ */ e.jsxs("section", { className: "cf:flex cf:flex-col cf:gap-2", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "cf:text-sm cf:font-medium", children: c }),
    i
  ] });
}
function z({ value: c }) {
  return /* @__PURE__ */ e.jsx("pre", { className: "cf:max-h-80 cf:overflow-auto cf:rounded-md cf:bg-muted cf:p-3 cf:text-xs", children: JSON.stringify(c, null, 2) });
}
function de(c) {
  try {
    const i = JSON.parse(c);
    if (i && typeof i == "object" && typeof i.code == "string") return i.code;
  } catch {
  }
  return c;
}
function fe({ api: c, id: i, canRetry: f }) {
  const [l, y] = d.useState(null), [r, b] = d.useState(1), [u, w] = d.useState(!1), x = d.useRef(0), h = d.useCallback((n) => {
    const j = ++x.current;
    return w(!0), c.request(`admin/submissions/${i}/activity?page=${n}&perPage=50`).then((m) => {
      j === x.current && (y(m), b(m.page));
    }).catch((m) => j === x.current && s.toast.error(g(m))).finally(() => j === x.current && w(!1));
  }, [c, i]);
  d.useEffect(() => {
    h(1);
  }, [h]);
  const v = async (n) => {
    try {
      await c.request(`admin/submissions/${i}/retry`, "POST", { deliveryId: n }), s.toast.success(t("Delivery queued again.")), await h(r);
    } catch (j) {
      s.toast.error(g(j));
    }
  }, C = !!(l && (l.items.length >= l.perPage || l.deliveries.length >= l.perPage));
  return /* @__PURE__ */ e.jsxs(s.Card, { children: [
    /* @__PURE__ */ e.jsxs(s.CardHeader, { className: "cf:flex cf:flex-row cf:items-center cf:justify-between", children: [
      /* @__PURE__ */ e.jsx(s.CardTitle, { children: t("Email deliveries") }),
      /* @__PURE__ */ e.jsxs(s.Button, { variant: "ghost", size: "sm", disabled: u, onClick: () => {
        h(r);
      }, children: [
        /* @__PURE__ */ e.jsx(ne, {}),
        " ",
        t("Refresh")
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
      l && !l.deliveries.length && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: t("No emails for this submission.") }),
      l && l.deliveries.length > 0 && /* @__PURE__ */ e.jsxs(s.Table, { children: [
        /* @__PURE__ */ e.jsx(s.TableHeader, { children: /* @__PURE__ */ e.jsxs(s.TableRow, { children: [
          /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Email") }),
          /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Status") }),
          /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Attempts") }),
          /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Created") }),
          f && /* @__PURE__ */ e.jsx(s.TableHead, { className: "cf:w-px", children: /* @__PURE__ */ e.jsx("span", { className: "cf:sr-only", children: t("Actions") }) })
        ] }) }),
        /* @__PURE__ */ e.jsx(s.TableBody, { children: l.deliveries.map((n) => /* @__PURE__ */ e.jsxs(s.TableRow, { children: [
          /* @__PURE__ */ e.jsxs(s.TableCell, { children: [
            n.channel,
            " · ",
            n.destination_id
          ] }),
          /* @__PURE__ */ e.jsxs(s.TableCell, { children: [
            /* @__PURE__ */ e.jsx(s.Badge, { variant: n.status === "failed" ? "destructive" : n.status === "sent" ? "default" : "secondary", children: n.status }),
            n.last_error && /* @__PURE__ */ e.jsx("p", { className: "cf:mt-1 cf:text-xs cf:text-destructive", children: n.last_error })
          ] }),
          /* @__PURE__ */ e.jsx(s.TableCell, { className: "cf:tabular-nums", children: n.attempts }),
          /* @__PURE__ */ e.jsx(s.TableCell, { className: "cf:whitespace-nowrap", children: k(n.created_at) }),
          f && /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", size: "sm", disabled: u || !["failed", "sent"].includes(n.status), onClick: () => {
            v(n.id);
          }, children: n.status === "sent" ? t("Send again") : t("Retry") }) })
        ] }, n.id)) })
      ] }),
      l && l.items.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "cf:flex cf:flex-col cf:gap-2 cf:text-sm", children: l.items.map((n) => /* @__PURE__ */ e.jsxs("li", { children: [
        /* @__PURE__ */ e.jsx("time", { className: "cf:text-muted-foreground", dateTime: n.created_at, children: k(n.created_at) }),
        " · ",
        de(n.body)
      ] }, n.id)) }),
      (r > 1 || C) && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", size: "sm", disabled: u || r <= 1, onClick: () => {
          h(r - 1);
        }, children: t("Newer") }),
        /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", size: "sm", disabled: u || !C, onClick: () => {
          h(r + 1);
        }, children: t("Older") })
      ] })
    ] })
  ] });
}
export {
  pe as default
};
