import { c as D, a as Y, b as o, g as R, d as Z, _ as a, u as s, e as g, j as e, r as H, s as M } from "./urls-D9s6uq7k.js";
import { o as I, a as ee, C as se } from "./value-BfA2d9_6.js";
import { r as B, s as P, S as ae, d as L, b as te } from "./model-C-MOyDx9.js";
import { u as re } from "./useConfirm-CiydtHQ5.js";
import { a as k, o as O, b as z } from "./format-D8XrOzw5.js";
import { T as ce } from "./trash-DAQtAiiX.js";
const F = {
  name: "mail",
  size: 24,
  node: [
    ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
    ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
  ]
};
F.node;
const ne = D(F);
const J = {
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
J.node;
const ie = D(J);
const U = {
  name: "refresh-cw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
    ["path", { d: "M8 16H3v5", key: "1cv678" }]
  ]
};
U.node;
const le = D(U);
function q(c) {
  return c == null ? "" : ee(c) ? `${c.value}: ${c.other}` : Array.isArray(c) ? c.map(q).join(", ") : typeof c == "object" ? Object.keys(c).sort().map((i) => `${i}: ${q(c[i])}`).join(", ") : String(c);
}
function de(c, i = {}, f = {}) {
  return c.replace(/\{\{([^{}]*)\}\}/g, (l, y) => {
    const r = /^[ \t\r\n]*(?:(answer|meta):)?([a-z][a-z0-9_]*)[ \t\r\n]*(?:\|([^{}]*))?$/.exec(y);
    if (!r) return "";
    const b = r[1] === "meta" ? f : i, u = r[2];
    return q(I(b, u) ? b[u] : void 0) || r[3] || "";
  });
}
function be({ submissionId: c, config: i }) {
  const f = Y(i), [l, y] = re(), [r, b] = o.useState(null), [u, v] = o.useState(""), [x, m] = o.useState(!1), [w, C] = o.useState(""), n = R(i, "edit_submissions"), j = new URLSearchParams(window.location.search).get("back") ?? "", h = Z.submissions() + (j ? `?${j}` : ""), N = r ? `${r.form?.title ?? a("Submission")} · ${B(r.id)}` : B(c);
  s.useBreadcrumbs([{ label: a("Submissions"), href: h }, { label: B(c) }]);
  const _ = o.useCallback(() => f.request(`admin/submissions/${c}`).then((t) => {
    b(t), v("");
  }).catch((t) => v(g(t))), [f, c]);
  o.useEffect(() => {
    _();
  }, [_]);
  const S = async (t, d) => {
    m(!0);
    try {
      return await f.request(`admin/submissions/${c}`, "PATCH", t), await _(), d && s.toast.success(d), !0;
    } catch (p) {
      return s.toast.error(g(p)), !1;
    } finally {
      m(!1);
    }
  }, G = async (t) => {
    !r || t === r.status || await l({ title: M(a("Change this submission to “%s”?"), P(t)), confirmLabel: a("Change status") }) && await S({ status: t }, a("Status changed."));
  }, K = async () => {
    if (await l({ title: a("Resend this submission’s emails?"), description: a("Every admin notification and autoresponder that matches it is sent again."), confirmLabel: a("Resend") }))
      try {
        await f.request(`admin/submissions/${c}/resend`, "POST", { requestId: crypto.randomUUID() }), s.toast.success(a("Emails queued."));
      } catch (t) {
        s.toast.error(g(t));
      }
  }, Q = async () => {
    if (await l({ title: a("Move this submission to the trash?"), confirmLabel: a("Move to trash"), destructive: !0 }))
      try {
        await f.request(`admin/submissions/${c}`, "DELETE"), s.toast.success(a("Moved to the trash.")), H.router.visit(h);
      } catch (t) {
        s.toast.error(g(t));
      }
  }, W = async (t, d) => {
    try {
      await navigator.clipboard.writeText(t), s.toast.success(d);
    } catch {
      s.toast.error(a("Could not copy to the clipboard."));
    }
  };
  if (!r)
    return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
      /* @__PURE__ */ e.jsx(H.Head, { title: N }),
      /* @__PURE__ */ e.jsx(s.PageHeader, { title: N, back: { href: h, label: a("Submissions") } }),
      u ? /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", role: "alert", children: u }) : /* @__PURE__ */ e.jsx(s.Skeleton, { className: "cf:h-64 cf:w-full" })
    ] });
  const $ = r.form?.schema.steps ?? [], X = $.filter((t) => r.visited.includes(t.id) && Object.prototype.hasOwnProperty.call(r.answers, t.key)), E = r.notes.filter((t) => t.kind === "note");
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(H.Head, { title: N }),
    y,
    /* @__PURE__ */ e.jsx(
      s.PageHeader,
      {
        title: N,
        description: [k(r.createdAt), M(a("Form version %d"), r.formVersion), M(a("%ds"), Math.round(r.durationMs / 1e3)), `${r.progress}%`].join(" · "),
        back: { href: h, label: a("Submissions") },
        menu: [
          { label: a("Print"), icon: /* @__PURE__ */ e.jsx(ie, {}), onSelect: () => window.print() },
          { label: a("Copy response ID"), icon: /* @__PURE__ */ e.jsx(se, {}), onSelect: () => {
            W(r.uuid, a("Response ID copied."));
          } },
          ...n && r.status === "completed" ? [{ label: a("Resend emails"), icon: /* @__PURE__ */ e.jsx(ne, {}), onSelect: () => {
            K();
          } }] : [],
          ...R(i, "delete_submissions") && r.status !== "trash" ? [{ label: a("Move to trash"), icon: /* @__PURE__ */ e.jsx(ce, {}), destructive: !0, onSelect: () => {
            Q();
          } }] : []
        ],
        actions: n && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", disabled: x, onClick: () => {
            S({ isRead: !r.isRead });
          }, children: r.isRead ? a("Mark unread") : a("Mark read") }),
          /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", disabled: x, "aria-pressed": r.isStarred, onClick: () => {
            S({ isStarred: !r.isStarred });
          }, children: [
            /* @__PURE__ */ e.jsx(ae, { className: r.isStarred ? "cf:fill-current cf:text-amber-500" : void 0 }),
            " ",
            r.isStarred ? a("Starred") : a("Star")
          ] })
        ] }),
        children: /* @__PURE__ */ e.jsx(s.Badge, { variant: r.status === "completed" ? "default" : "secondary", children: P(r.status) })
      }
    ),
    !r.form && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: a("The form as it was when this was answered is no longer available; answers are shown by field key.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-6 cf:xl:grid-cols-[minmax(0,1fr)_20rem]", children: [
      /* @__PURE__ */ e.jsxs(s.Tabs, { defaultValue: "answers", className: "cf:min-w-0", children: [
        /* @__PURE__ */ e.jsxs(s.TabsList, { children: [
          /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "answers", children: a("Answers") }),
          /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "conversation", children: a("Conversation") }),
          /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "details", children: a("Details") }),
          /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: "activity", children: a("Emails") })
        ] }),
        /* @__PURE__ */ e.jsx(s.TabsContent, { value: "answers", children: /* @__PURE__ */ e.jsx(s.Card, { children: /* @__PURE__ */ e.jsx(s.CardContent, { children: /* @__PURE__ */ e.jsxs("dl", { className: "cf:divide-y cf:divide-border", children: [
          (r.form ? X.map((t) => [t.id, t.label || t.key, r.answers[t.key], O(t)]) : Object.entries(r.answers).map(([t, d]) => [t, t, d, void 0])).map(([t, d, p, A]) => /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-1 cf:py-3 cf:sm:grid-cols-[minmax(0,14rem)_1fr] cf:sm:gap-4", children: [
            /* @__PURE__ */ e.jsx("dt", { className: "cf:text-sm cf:text-muted-foreground", children: d }),
            /* @__PURE__ */ e.jsx("dd", { className: "cf:whitespace-pre-wrap cf:break-words", children: z(p, L, A) || "—" })
          ] }, t)),
          !Object.keys(r.answers).length && /* @__PURE__ */ e.jsx("p", { className: "cf:py-3 cf:text-muted-foreground", children: a("No answers yet.") })
        ] }) }) }) }),
        /* @__PURE__ */ e.jsx(s.TabsContent, { value: "conversation", children: /* @__PURE__ */ e.jsx(s.Card, { children: /* @__PURE__ */ e.jsx(s.CardContent, { children: /* @__PURE__ */ e.jsx("ol", { className: "cf:flex cf:flex-col cf:gap-3", children: r.visited.map((t) => {
          const d = $.find((p) => p.id === t);
          return d ? /* @__PURE__ */ e.jsxs("li", { className: "cf:flex cf:flex-col cf:gap-2", children: [
            d.messages.map((p, A) => /* @__PURE__ */ e.jsx("p", { className: "cf:max-w-[80%] cf:self-start cf:rounded-lg cf:bg-muted cf:px-3 cf:py-2 cf:text-sm", children: de(p, r.answers, r.meta) }, A)),
            Object.prototype.hasOwnProperty.call(r.answers, d.key) && /* @__PURE__ */ e.jsx("p", { className: "cf:max-w-[80%] cf:self-end cf:rounded-lg cf:bg-primary cf:px-3 cf:py-2 cf:text-sm cf:text-primary-foreground", children: z(r.answers[d.key], L, O(d)) || a("Skipped") })
          ] }, t) : null;
        }) }) }) }) }),
        /* @__PURE__ */ e.jsx(s.TabsContent, { value: "details", children: /* @__PURE__ */ e.jsx(s.Card, { children: /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
          /* @__PURE__ */ e.jsx(T, { title: a("Response ID"), children: /* @__PURE__ */ e.jsx("code", { className: "cf:text-sm", children: r.uuid }) }),
          /* @__PURE__ */ e.jsx(T, { title: a("Field keys"), children: /* @__PURE__ */ e.jsx("dl", { className: "cf:grid cf:grid-cols-[auto_1fr] cf:gap-x-4 cf:gap-y-1 cf:text-sm", children: $.filter((t) => t.key).map((t) => /* @__PURE__ */ e.jsxs("div", { className: "cf:contents", children: [
            /* @__PURE__ */ e.jsx("dt", { className: "cf:text-muted-foreground", children: t.label || t.key }),
            /* @__PURE__ */ e.jsx("dd", { children: /* @__PURE__ */ e.jsx("code", { children: t.key }) })
          ] }, t.id)) }) }),
          /* @__PURE__ */ e.jsx(T, { title: a("Collected metadata"), children: /* @__PURE__ */ e.jsx(V, { value: r.meta }) }),
          /* @__PURE__ */ e.jsx(T, { title: a("Recorded consent text and version"), children: /* @__PURE__ */ e.jsx(V, { value: r.consent }) })
        ] }) }) }),
        /* @__PURE__ */ e.jsx(s.TabsContent, { value: "activity", children: /* @__PURE__ */ e.jsx(fe, { api: f, id: c, canRetry: n }) })
      ] }),
      /* @__PURE__ */ e.jsxs("aside", { className: "cf:flex cf:flex-col cf:gap-6", children: [
        n && /* @__PURE__ */ e.jsxs(s.Card, { children: [
          /* @__PURE__ */ e.jsx(s.CardHeader, { children: /* @__PURE__ */ e.jsx(s.CardTitle, { children: a("Status") }) }),
          /* @__PURE__ */ e.jsx(s.CardContent, { children: /* @__PURE__ */ e.jsxs(s.Select, { value: r.status, onValueChange: (t) => {
            G(t);
          }, disabled: x, children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { "aria-label": a("Status"), children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsx(s.SelectContent, { children: te.filter((t) => t !== "trash" || t === r.status || R(i, "delete_submissions")).map((t) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: t, children: P(t) }, t)) })
          ] }) })
        ] }),
        /* @__PURE__ */ e.jsxs(s.Card, { children: [
          /* @__PURE__ */ e.jsx(s.CardHeader, { children: /* @__PURE__ */ e.jsx(s.CardTitle, { children: a("Notes") }) }),
          /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:flex cf:flex-col cf:gap-3", children: [
            E.length ? /* @__PURE__ */ e.jsx("ul", { className: "cf:flex cf:flex-col cf:gap-3", children: E.map((t) => /* @__PURE__ */ e.jsxs("li", { className: "cf:text-sm", children: [
              /* @__PURE__ */ e.jsx("p", { className: "cf:whitespace-pre-wrap", children: t.message }),
              /* @__PURE__ */ e.jsx("time", { className: "cf:text-xs cf:text-muted-foreground", dateTime: t.createdAt, children: k(t.createdAt) })
            ] }, t.id)) }) : /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: a("No notes yet.") }),
            n && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(
                s.Textarea,
                {
                  "aria-label": a("Add a private note"),
                  placeholder: a("Add a private note…"),
                  value: w,
                  rows: 3,
                  onChange: (t) => C(t.target.value)
                }
              ),
              /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", disabled: x || !w.trim(), onClick: async () => {
                await S({ note: w }, a("Note added.")) && C("");
              }, children: a("Add note") })
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
function V({ value: c }) {
  return /* @__PURE__ */ e.jsx("pre", { className: "cf:max-h-80 cf:overflow-auto cf:rounded-md cf:bg-muted cf:p-3 cf:text-xs", children: JSON.stringify(c, null, 2) });
}
function oe(c) {
  try {
    const i = JSON.parse(c);
    if (i && typeof i == "object" && typeof i.code == "string") return i.code;
  } catch {
  }
  return c;
}
function fe({ api: c, id: i, canRetry: f }) {
  const [l, y] = o.useState(null), [r, b] = o.useState(1), [u, v] = o.useState(!1), x = o.useRef(0), m = o.useCallback((n) => {
    const j = ++x.current;
    return v(!0), c.request(`admin/submissions/${i}/activity?page=${n}&perPage=50`).then((h) => {
      j === x.current && (y(h), b(h.page));
    }).catch((h) => j === x.current && s.toast.error(g(h))).finally(() => j === x.current && v(!1));
  }, [c, i]);
  o.useEffect(() => {
    m(1);
  }, [m]);
  const w = async (n) => {
    try {
      await c.request(`admin/submissions/${i}/retry`, "POST", { deliveryId: n }), s.toast.success(a("Delivery queued again.")), await m(r);
    } catch (j) {
      s.toast.error(g(j));
    }
  }, C = !!(l && (l.items.length >= l.perPage || l.deliveries.length >= l.perPage));
  return /* @__PURE__ */ e.jsxs(s.Card, { children: [
    /* @__PURE__ */ e.jsxs(s.CardHeader, { className: "cf:flex cf:flex-row cf:items-center cf:justify-between", children: [
      /* @__PURE__ */ e.jsx(s.CardTitle, { children: a("Email deliveries") }),
      /* @__PURE__ */ e.jsxs(s.Button, { variant: "ghost", size: "sm", disabled: u, onClick: () => {
        m(r);
      }, children: [
        /* @__PURE__ */ e.jsx(le, {}),
        " ",
        a("Refresh")
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs(s.CardContent, { className: "cf:flex cf:flex-col cf:gap-4", children: [
      l && !l.deliveries.length && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-muted-foreground", children: a("No emails for this submission.") }),
      l && l.deliveries.length > 0 && /* @__PURE__ */ e.jsxs(s.Table, { children: [
        /* @__PURE__ */ e.jsx(s.TableHeader, { children: /* @__PURE__ */ e.jsxs(s.TableRow, { children: [
          /* @__PURE__ */ e.jsx(s.TableHead, { children: a("Email") }),
          /* @__PURE__ */ e.jsx(s.TableHead, { children: a("Status") }),
          /* @__PURE__ */ e.jsx(s.TableHead, { children: a("Attempts") }),
          /* @__PURE__ */ e.jsx(s.TableHead, { children: a("Created") }),
          f && /* @__PURE__ */ e.jsx(s.TableHead, { className: "cf:w-px", children: /* @__PURE__ */ e.jsx("span", { className: "cf:sr-only", children: a("Actions") }) })
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
            w(n.id);
          }, children: n.status === "sent" ? a("Send again") : a("Retry") }) })
        ] }, n.id)) })
      ] }),
      l && l.items.length > 0 && /* @__PURE__ */ e.jsx("ul", { className: "cf:flex cf:flex-col cf:gap-2 cf:text-sm", children: l.items.map((n) => /* @__PURE__ */ e.jsxs("li", { children: [
        /* @__PURE__ */ e.jsx("time", { className: "cf:text-muted-foreground", dateTime: n.created_at, children: k(n.created_at) }),
        " · ",
        oe(n.body)
      ] }, n.id)) }),
      (r > 1 || C) && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", size: "sm", disabled: u || r <= 1, onClick: () => {
          m(r - 1);
        }, children: a("Newer") }),
        /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", size: "sm", disabled: u || !C, onClick: () => {
          m(r + 1);
        }, children: a("Older") })
      ] })
    ] })
  ] });
}
export {
  be as default
};
