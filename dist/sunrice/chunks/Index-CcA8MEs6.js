import { j as e, u as t, _ as s, r as x, a as h, s as g } from "./urls-2n-KvCIk.js";
import { c as o, _ as j, u as U, d as V, e as O } from "./api-DZKLC0QC.js";
const N = {
  name: "arrow-down",
  size: 24,
  node: [
    ["path", { d: "M12 5v14", key: "s699le" }],
    ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
  ]
};
N.node;
const J = o(N);
const k = {
  name: "arrow-up-down",
  size: 24,
  node: [
    ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
    ["path", { d: "M17 20V4", key: "1ejh1v" }],
    ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
    ["path", { d: "M7 4v16", key: "1glfcx" }]
  ]
};
k.node;
const Z = o(k);
const D = {
  name: "arrow-up",
  size: 24,
  node: [
    ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
    ["path", { d: "M12 19V5", key: "x0mq9r" }]
  ]
};
D.node;
const G = o(D);
const C = {
  name: "chevron-left",
  size: 24,
  node: [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]]
};
C.node;
const K = o(C);
const M = {
  name: "chevron-right",
  size: 24,
  node: [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]
};
M.node;
const Q = o(M);
const S = {
  name: "ellipsis",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
    ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
    ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
  ],
  aliases: ["more-horizontal"]
};
S.node;
const W = o(S);
const _ = {
  name: "plus",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ]
};
_.node;
const X = o(_);
const z = {
  name: "rotate-ccw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
  ]
};
z.node;
const Y = o(z);
const B = {
  name: "search",
  size: 24,
  node: [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
  ]
};
B.node;
const ee = o(B);
const I = {
  name: "trash",
  size: 24,
  node: [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
  ],
  aliases: ["trash-2"]
};
I.node;
const T = o(I);
function te() {
  const [n, r] = j.useState(null), c = j.useRef(null), m = j.useCallback((l) => {
    c.current?.(l), c.current = null, r(null);
  }, []), v = j.useCallback((l) => (c.current?.(!1), r(l), new Promise((d) => {
    c.current = d;
  })), []), p = /* @__PURE__ */ e.jsx(t.Dialog, { open: n !== null, onOpenChange: (l) => !l && m(!1), children: /* @__PURE__ */ e.jsxs(t.DialogContent, { children: [
    /* @__PURE__ */ e.jsxs(t.DialogHeader, { children: [
      /* @__PURE__ */ e.jsx(t.DialogTitle, { children: n?.title }),
      n?.description && /* @__PURE__ */ e.jsx(t.DialogDescription, { children: n.description })
    ] }),
    /* @__PURE__ */ e.jsxs(t.DialogFooter, { children: [
      /* @__PURE__ */ e.jsx(t.Button, { variant: "outline", onClick: () => m(!1), children: s("Cancel") }),
      /* @__PURE__ */ e.jsx(t.Button, { variant: n?.destructive ? "destructive" : "default", onClick: () => m(!0), children: n?.confirmLabel ?? s("Confirm") })
    ] })
  ] }) });
  return [v, p];
}
function $(n) {
  if (!n) return null;
  const r = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(n) ? n : `${n.replace(" ", "T")}Z`);
  return Number.isNaN(r.getTime()) ? null : r;
}
function se(n) {
  const r = $(n);
  return r ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(r) : "—";
}
function ae(n, r = /* @__PURE__ */ new Date()) {
  const c = $(n);
  if (!c) return "";
  const m = Math.round((c.getTime() - r.getTime()) / 1e3), v = [["year", 31536e3], ["month", 2592e3], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]], p = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
  for (const [l, d] of v)
    if (Math.abs(m) >= d) return p.format(Math.round(m / d), l);
  return p.format(0, "minute");
}
function ne(n) {
  return `${new Intl.NumberFormat(void 0, { maximumFractionDigits: 1 }).format(n)}%`;
}
function oe({ forms: n, filters: r, counts: c, config: m }) {
  t.useBreadcrumbs([{ label: s("Forms") }]);
  const v = U(m), [p, l] = te(), [d, A] = j.useState(r.search), i = r.status === "trash", f = (a) => {
    const u = { ...r, page: 1, ...a };
    x.router.get(
      h.forms({
        status: u.status,
        search: u.search,
        sort: u.sort === "title" ? "title" : void 0,
        order: u.sort === "title" ? u.order : void 0,
        page: u.page > 1 ? u.page : void 0
      }),
      {},
      { preserveState: !0, preserveScroll: !0, replace: !0 }
    );
  }, y = j.useRef(!0);
  j.useEffect(() => {
    if (y.current) {
      y.current = !1;
      return;
    }
    const a = window.setTimeout(() => d !== r.search && f({ search: d }), 300);
    return () => window.clearTimeout(a);
  }, [d]);
  const F = () => f({ sort: "title", order: r.sort === "title" && r.order === "asc" ? "desc" : "asc" }), b = (a) => x.router.post(a, {}, { preserveScroll: !0 }), L = async (a) => {
    try {
      V(await v.request(`admin/forms/${a.id}`));
    } catch (u) {
      t.toast.error(O(u));
    }
  }, H = async (a) => {
    try {
      await navigator.clipboard.writeText(a.embed), t.toast.success(s("Embed code copied."));
    } catch {
      t.toast.error(s("The embed code could not be copied."));
    }
  }, R = async (a) => {
    a.status === "publish" && !await p({
      title: g(s("Move “%s” to the trash?"), a.name),
      description: s("It is live: new visitors cannot start it afterwards. Its submissions are kept, and you can restore it from the trash."),
      confirmLabel: s("Move to trash"),
      destructive: !0
    }) || b(h.formAction(a.id, "trash"));
  }, q = async (a) => {
    await p({
      title: g(s("Delete “%s” permanently?"), a.name),
      description: s("This cannot be undone. Forms that still have submissions cannot be deleted."),
      confirmLabel: s("Delete permanently"),
      destructive: !0
    }) && x.router.delete(h.form(a.id), { preserveScroll: !0 });
  }, E = /* @__PURE__ */ new Date(), P = r.status === "trash" ? "" : r.status;
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(x.Head, { title: s("Forms") }),
    l,
    /* @__PURE__ */ e.jsx(
      t.PageHeader,
      {
        title: i ? /* @__PURE__ */ e.jsx(t.TrashTitle, { children: s("Forms") }) : s("Forms"),
        description: i ? void 0 : s("Conversational forms that feel like a chat. Draft here, publish when you are ready to share."),
        primary: !i && /* @__PURE__ */ e.jsx(t.Button, { asChild: !0, children: /* @__PURE__ */ e.jsxs(x.Link, { href: h.createForm(), children: [
          /* @__PURE__ */ e.jsx(X, {}),
          " ",
          s("New form")
        ] }) })
      }
    ),
    i && /* @__PURE__ */ e.jsx(t.TrashBanner, { items: s("forms"), onBack: () => f({ status: "" }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-center cf:gap-2", children: [
      !i && /* @__PURE__ */ e.jsx(t.Tabs, { value: P || "all", onValueChange: (a) => f({ status: a === "all" ? "" : a }), children: /* @__PURE__ */ e.jsxs(t.TabsList, { children: [
        /* @__PURE__ */ e.jsxs(t.TabsTrigger, { value: "all", children: [
          s("All"),
          " ",
          /* @__PURE__ */ e.jsx(w, { value: c.all })
        ] }),
        /* @__PURE__ */ e.jsxs(t.TabsTrigger, { value: "publish", children: [
          s("Live"),
          " ",
          /* @__PURE__ */ e.jsx(w, { value: c.publish })
        ] }),
        /* @__PURE__ */ e.jsxs(t.TabsTrigger, { value: "draft", children: [
          s("Draft"),
          " ",
          /* @__PURE__ */ e.jsx(w, { value: c.draft })
        ] })
      ] }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "cf:relative cf:w-full cf:max-w-xs", children: [
        /* @__PURE__ */ e.jsx(ee, { className: "cf:pointer-events-none cf:absolute cf:top-1/2 cf:left-2.5 cf:size-4 cf:-translate-y-1/2 cf:text-muted-foreground" }),
        /* @__PURE__ */ e.jsx(
          t.Input,
          {
            className: "cf:pl-9",
            placeholder: s("Search forms…"),
            "aria-label": s("Search forms"),
            value: d,
            onChange: (a) => A(a.target.value)
          }
        )
      ] }),
      !i && c.trash > 0 && /* @__PURE__ */ e.jsxs(t.Button, { variant: "ghost", className: "cf:ml-auto", onClick: () => f({ status: "trash" }), children: [
        /* @__PURE__ */ e.jsx(T, {}),
        " ",
        s("Trash")
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(t.Card, { className: "cf:gap-0 cf:overflow-hidden cf:py-0", children: /* @__PURE__ */ e.jsxs(t.Table, { children: [
      /* @__PURE__ */ e.jsx(t.TableHeader, { className: "cf:bg-muted/60", children: /* @__PURE__ */ e.jsxs(t.TableRow, { className: "cf:hover:bg-transparent", children: [
        /* @__PURE__ */ e.jsx(t.TableHead, { children: /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: F,
            className: "cf:-ml-2 cf:inline-flex cf:h-8 cf:items-center cf:gap-1 cf:rounded-md cf:px-2 cf:hover:bg-accent cf:hover:text-accent-foreground",
            children: [
              s("Name"),
              r.sort !== "title" ? /* @__PURE__ */ e.jsx(Z, { className: "cf:size-3 cf:opacity-40" }) : r.order === "asc" ? /* @__PURE__ */ e.jsx(G, { className: "cf:size-3" }) : /* @__PURE__ */ e.jsx(J, { className: "cf:size-3" })
            ]
          }
        ) }),
        /* @__PURE__ */ e.jsx(t.TableHead, { children: s("Status") }),
        /* @__PURE__ */ e.jsx(t.TableHead, { className: "cf:text-right", children: s("Submissions") }),
        /* @__PURE__ */ e.jsx(t.TableHead, { className: "cf:text-right", children: s("Completion") }),
        /* @__PURE__ */ e.jsx(t.TableHead, { children: s("Last submission") }),
        /* @__PURE__ */ e.jsx(t.TableHead, { className: "cf:w-px", children: /* @__PURE__ */ e.jsx("span", { className: "cf:sr-only", children: s("Actions") }) })
      ] }) }),
      /* @__PURE__ */ e.jsxs(t.TableBody, { children: [
        n.data.map((a) => /* @__PURE__ */ e.jsxs(t.TableRow, { className: i ? "cf:text-muted-foreground" : void 0, children: [
          /* @__PURE__ */ e.jsx(t.TableCell, { children: /* @__PURE__ */ e.jsx("div", { className: "cf:max-w-80 cf:truncate", children: i ? /* @__PURE__ */ e.jsx("span", { className: "cf:font-medium", children: a.name }) : /* @__PURE__ */ e.jsx(x.Link, { href: h.form(a.id), className: "cf:font-medium cf:underline-offset-4 cf:hover:underline", children: a.name }) }) }),
          /* @__PURE__ */ e.jsx(t.TableCell, { children: /* @__PURE__ */ e.jsx(re, { form: a }) }),
          /* @__PURE__ */ e.jsx(t.TableCell, { className: "cf:text-right cf:tabular-nums", children: a.completed > 0 && !i ? /* @__PURE__ */ e.jsx(x.Link, { href: h.submissions({ formId: a.id }), className: "cf:underline-offset-4 cf:hover:underline", children: a.completed }) : a.completed }),
          /* @__PURE__ */ e.jsx(t.TableCell, { className: "cf:text-right cf:tabular-nums", children: a.started > 0 ? ne(a.completionRate) : "—" }),
          /* @__PURE__ */ e.jsx(t.TableCell, { className: "cf:whitespace-nowrap", title: a.lastSubmissionAt ? se(a.lastSubmissionAt) : void 0, children: ae(a.lastSubmissionAt, E) || "—" }),
          /* @__PURE__ */ e.jsx(t.TableCell, { className: "cf:w-px cf:text-right", children: i ? /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:justify-end cf:gap-2", children: [
            /* @__PURE__ */ e.jsxs(t.Button, { variant: "outline", size: "sm", onClick: () => b(h.formAction(a.id, "restore")), children: [
              /* @__PURE__ */ e.jsx(Y, {}),
              " ",
              s("Restore")
            ] }),
            /* @__PURE__ */ e.jsxs(t.Button, { variant: "ghost", size: "sm", className: "cf:text-destructive cf:hover:text-destructive", onClick: () => {
              q(a);
            }, children: [
              /* @__PURE__ */ e.jsx(T, {}),
              " ",
              s("Delete permanently")
            ] })
          ] }) : /* @__PURE__ */ e.jsxs(t.DropdownMenu, { children: [
            /* @__PURE__ */ e.jsx(t.DropdownMenuTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsx(t.Button, { variant: "ghost", size: "icon", className: "cf:size-8", "aria-label": g(s("Actions for %s"), a.name), children: /* @__PURE__ */ e.jsx(W, {}) }) }),
            /* @__PURE__ */ e.jsxs(t.DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ e.jsx(t.DropdownMenuItem, { asChild: !0, children: /* @__PURE__ */ e.jsx(x.Link, { href: h.form(a.id), children: s("Edit") }) }),
              a.shareUrl && /* @__PURE__ */ e.jsx(t.DropdownMenuItem, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: a.shareUrl, target: "_blank", rel: "noopener noreferrer", children: s("Open live form") }) }),
              /* @__PURE__ */ e.jsx(t.DropdownMenuItem, { onSelect: () => {
                H(a);
              }, children: s("Copy embed code") }),
              /* @__PURE__ */ e.jsx(t.DropdownMenuItem, { onSelect: () => b(h.formAction(a.id, "duplicate")), children: s("Duplicate") }),
              /* @__PURE__ */ e.jsx(t.DropdownMenuItem, { onSelect: () => {
                L(a);
              }, children: s("Export JSON") }),
              /* @__PURE__ */ e.jsx(t.DropdownMenuSeparator, {}),
              /* @__PURE__ */ e.jsx(t.DropdownMenuItem, { variant: "destructive", onSelect: () => {
                R(a);
              }, children: s("Move to trash") })
            ] })
          ] }) })
        ] }, a.id)),
        n.data.length === 0 && /* @__PURE__ */ e.jsx(t.TableRow, { children: /* @__PURE__ */ e.jsx(t.TableCell, { colSpan: 6, className: "cf:h-24 cf:text-center cf:text-muted-foreground", children: /* @__PURE__ */ e.jsxs("span", { className: "cf:flex cf:flex-col cf:items-center cf:gap-1", children: [
          r.search || r.status === "draft" || r.status === "publish" ? s("Nothing matches.") : i ? s("The trash is empty.") : s("No forms yet. Create one from a template or start blank."),
          !i && /* @__PURE__ */ e.jsx(t.TrashHint, { count: c.trash, onShow: () => f({ status: "trash" }) })
        ] }) }) })
      ] })
    ] }) }),
    n.pages > 1 && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-end cf:gap-2 cf:text-sm cf:text-muted-foreground", children: [
      /* @__PURE__ */ e.jsx("span", { children: g(s("Page %1$d of %2$d"), n.page, n.pages) }),
      /* @__PURE__ */ e.jsx(
        t.Button,
        {
          variant: "outline",
          size: "icon",
          className: "cf:size-8",
          "aria-label": s("Previous page"),
          disabled: n.page <= 1,
          onClick: () => f({ page: n.page - 1 }),
          children: /* @__PURE__ */ e.jsx(K, {})
        }
      ),
      /* @__PURE__ */ e.jsx(
        t.Button,
        {
          variant: "outline",
          size: "icon",
          className: "cf:size-8",
          "aria-label": s("Next page"),
          disabled: n.page >= n.pages,
          onClick: () => f({ page: n.page + 1 }),
          children: /* @__PURE__ */ e.jsx(Q, {})
        }
      )
    ] })
  ] });
}
function w({ value: n }) {
  return /* @__PURE__ */ e.jsx("span", { className: "cf:ml-1 cf:text-xs cf:text-muted-foreground cf:tabular-nums", children: n });
}
function re({ form: n }) {
  return n.status === "trash" ? /* @__PURE__ */ e.jsx(t.Badge, { variant: "outline", children: s("Trash") }) : n.status === "publish" ? /* @__PURE__ */ e.jsx(t.Badge, { children: g(s("Live · v%d"), n.version) }) : /* @__PURE__ */ e.jsx(t.Badge, { variant: "secondary", children: s("Draft") });
}
export {
  oe as default
};
