import { c as x, u as s, _ as t, a as H, b as p, j as e, r as d, d as l, s as u, e as R } from "./urls-BB4MaRFd.js";
import { d as F } from "./formIO-DneCsNb-.js";
import { u as E } from "./useConfirm-BbCeRslr.js";
import { f as P, r as $, a as q } from "./format-CfVrQZbp.js";
import { P as U, R as V } from "./rotate-ccw-DUMRnzt7.js";
import { S as J, C as O, a as G } from "./search-BSKIvx55.js";
import { T as g } from "./trash--O34YeeQ.js";
const w = {
  name: "arrow-down",
  size: 24,
  node: [
    ["path", { d: "M12 5v14", key: "s699le" }],
    ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
  ]
};
w.node;
const K = x(w);
const T = {
  name: "arrow-up-down",
  size: 24,
  node: [
    ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
    ["path", { d: "M17 20V4", key: "1ejh1v" }],
    ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
    ["path", { d: "M7 4v16", key: "1glfcx" }]
  ]
};
T.node;
const Q = x(T);
const N = {
  name: "arrow-up",
  size: 24,
  node: [
    ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
    ["path", { d: "M12 19V5", key: "x0mq9r" }]
  ]
};
N.node;
const W = x(N);
const y = {
  name: "ellipsis",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
    ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
    ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
  ],
  aliases: ["more-horizontal"]
};
y.node;
const X = x(y);
function ne({ forms: r, filters: c, counts: h, config: C }) {
  s.useBreadcrumbs([{ label: t("Forms") }]);
  const k = H(C), [v, D] = E(), [m, S] = p.useState(c.search), n = c.status === "trash", o = (a) => {
    const i = { ...c, page: 1, ...a };
    d.router.get(
      l.forms({
        status: i.status,
        search: i.search,
        sort: i.sort === "title" ? "title" : void 0,
        order: i.sort === "title" ? i.order : void 0,
        page: i.page > 1 ? i.page : void 0
      }),
      {},
      { preserveState: !0, preserveScroll: !0, replace: !0 }
    );
  }, b = p.useRef(!0);
  p.useEffect(() => {
    if (b.current) {
      b.current = !1;
      return;
    }
    const a = window.setTimeout(() => m !== c.search && o({ search: m }), 300);
    return () => window.clearTimeout(a);
  }, [m]);
  const z = () => o({ sort: "title", order: c.sort === "title" && c.order === "asc" ? "desc" : "asc" }), f = (a) => d.router.post(a, {}, { preserveScroll: !0 }), M = async (a) => {
    try {
      F(await k.request(`admin/forms/${a.id}`));
    } catch (i) {
      s.toast.error(R(i));
    }
  }, B = async (a) => {
    try {
      await navigator.clipboard.writeText(a.embed), s.toast.success(t("Embed code copied."));
    } catch {
      s.toast.error(t("The embed code could not be copied."));
    }
  }, A = async (a) => {
    a.status === "publish" && !await v({
      title: u(t("Move “%s” to the trash?"), a.name),
      description: t("It is live: new visitors cannot start it afterwards. Its submissions are kept, and you can restore it from the trash."),
      confirmLabel: t("Move to trash"),
      destructive: !0
    }) || f(l.formAction(a.id, "trash"));
  }, _ = async (a) => {
    await v({
      title: u(t("Delete “%s” permanently?"), a.name),
      description: t("This cannot be undone. Forms that still have submissions cannot be deleted."),
      confirmLabel: t("Delete permanently"),
      destructive: !0
    }) && d.router.delete(l.form(a.id), { preserveScroll: !0 });
  }, I = /* @__PURE__ */ new Date(), L = c.status === "trash" ? "" : c.status;
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(d.Head, { title: t("Forms") }),
    D,
    /* @__PURE__ */ e.jsx(
      s.PageHeader,
      {
        title: n ? /* @__PURE__ */ e.jsx(s.TrashTitle, { children: t("Forms") }) : t("Forms"),
        description: n ? void 0 : t("Conversational forms that feel like a chat. Draft here, publish when you are ready to share."),
        primary: !n && /* @__PURE__ */ e.jsx(s.Button, { asChild: !0, children: /* @__PURE__ */ e.jsxs(d.Link, { href: l.createForm(), children: [
          /* @__PURE__ */ e.jsx(U, {}),
          " ",
          t("New form")
        ] }) })
      }
    ),
    n && /* @__PURE__ */ e.jsx(s.TrashBanner, { items: t("forms"), onBack: () => o({ status: "" }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-center cf:gap-2", children: [
      !n && /* @__PURE__ */ e.jsx(s.Tabs, { value: L || "all", onValueChange: (a) => o({ status: a === "all" ? "" : a }), children: /* @__PURE__ */ e.jsxs(s.TabsList, { children: [
        /* @__PURE__ */ e.jsxs(s.TabsTrigger, { value: "all", children: [
          t("All"),
          " ",
          /* @__PURE__ */ e.jsx(j, { value: h.all })
        ] }),
        /* @__PURE__ */ e.jsxs(s.TabsTrigger, { value: "publish", children: [
          t("Live"),
          " ",
          /* @__PURE__ */ e.jsx(j, { value: h.publish })
        ] }),
        /* @__PURE__ */ e.jsxs(s.TabsTrigger, { value: "draft", children: [
          t("Draft"),
          " ",
          /* @__PURE__ */ e.jsx(j, { value: h.draft })
        ] })
      ] }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "cf:relative cf:w-full cf:max-w-xs", children: [
        /* @__PURE__ */ e.jsx(J, { className: "cf:pointer-events-none cf:absolute cf:top-1/2 cf:left-2.5 cf:size-4 cf:-translate-y-1/2 cf:text-muted-foreground" }),
        /* @__PURE__ */ e.jsx(
          s.Input,
          {
            className: "cf:pl-9",
            placeholder: t("Search forms…"),
            "aria-label": t("Search forms"),
            value: m,
            onChange: (a) => S(a.target.value)
          }
        )
      ] }),
      !n && h.trash > 0 && /* @__PURE__ */ e.jsxs(s.Button, { variant: "ghost", className: "cf:ml-auto", onClick: () => o({ status: "trash" }), children: [
        /* @__PURE__ */ e.jsx(g, {}),
        " ",
        t("Trash")
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(s.Card, { className: "cf:gap-0 cf:overflow-hidden cf:py-0", children: /* @__PURE__ */ e.jsxs(s.Table, { children: [
      /* @__PURE__ */ e.jsx(s.TableHeader, { className: "cf:bg-muted/60", children: /* @__PURE__ */ e.jsxs(s.TableRow, { className: "cf:hover:bg-transparent", children: [
        /* @__PURE__ */ e.jsx(s.TableHead, { children: /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: z,
            className: "cf:-ml-2 cf:inline-flex cf:h-8 cf:items-center cf:gap-1 cf:rounded-md cf:px-2 cf:hover:bg-accent cf:hover:text-accent-foreground",
            children: [
              t("Name"),
              c.sort !== "title" ? /* @__PURE__ */ e.jsx(Q, { className: "cf:size-3 cf:opacity-40" }) : c.order === "asc" ? /* @__PURE__ */ e.jsx(W, { className: "cf:size-3" }) : /* @__PURE__ */ e.jsx(K, { className: "cf:size-3" })
            ]
          }
        ) }),
        /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Status") }),
        /* @__PURE__ */ e.jsx(s.TableHead, { className: "cf:text-right", children: t("Submissions") }),
        /* @__PURE__ */ e.jsx(s.TableHead, { className: "cf:text-right", children: t("Completion") }),
        /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Last submission") }),
        /* @__PURE__ */ e.jsx(s.TableHead, { className: "cf:w-px", children: /* @__PURE__ */ e.jsx("span", { className: "cf:sr-only", children: t("Actions") }) })
      ] }) }),
      /* @__PURE__ */ e.jsxs(s.TableBody, { children: [
        r.data.map((a) => /* @__PURE__ */ e.jsxs(s.TableRow, { className: n ? "cf:text-muted-foreground" : void 0, children: [
          /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx("div", { className: "cf:max-w-80 cf:truncate", children: n ? /* @__PURE__ */ e.jsx("span", { className: "cf:font-medium", children: a.name }) : /* @__PURE__ */ e.jsx(d.Link, { href: l.form(a.id), className: "cf:font-medium cf:underline-offset-4 cf:hover:underline", children: a.name }) }) }),
          /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx(Y, { form: a }) }),
          /* @__PURE__ */ e.jsx(s.TableCell, { className: "cf:text-right cf:tabular-nums", children: a.completed > 0 && !n ? /* @__PURE__ */ e.jsx(d.Link, { href: l.submissions({ formId: a.id }), className: "cf:underline-offset-4 cf:hover:underline", children: a.completed }) : a.completed }),
          /* @__PURE__ */ e.jsx(s.TableCell, { className: "cf:text-right cf:tabular-nums", children: a.started > 0 ? P(a.completionRate) : "—" }),
          /* @__PURE__ */ e.jsx(s.TableCell, { className: "cf:whitespace-nowrap", title: a.lastSubmissionAt ? q(a.lastSubmissionAt) : void 0, children: $(a.lastSubmissionAt, I) || "—" }),
          /* @__PURE__ */ e.jsx(s.TableCell, { className: "cf:w-px cf:text-right", children: n ? /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:justify-end cf:gap-2", children: [
            /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", size: "sm", onClick: () => f(l.formAction(a.id, "restore")), children: [
              /* @__PURE__ */ e.jsx(V, {}),
              " ",
              t("Restore")
            ] }),
            /* @__PURE__ */ e.jsxs(s.Button, { variant: "ghost", size: "sm", className: "cf:text-destructive cf:hover:text-destructive", onClick: () => {
              _(a);
            }, children: [
              /* @__PURE__ */ e.jsx(g, {}),
              " ",
              t("Delete permanently")
            ] })
          ] }) : /* @__PURE__ */ e.jsxs(s.DropdownMenu, { children: [
            /* @__PURE__ */ e.jsx(s.DropdownMenuTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsx(s.Button, { variant: "ghost", size: "icon", className: "cf:size-8", "aria-label": u(t("Actions for %s"), a.name), children: /* @__PURE__ */ e.jsx(X, {}) }) }),
            /* @__PURE__ */ e.jsxs(s.DropdownMenuContent, { align: "end", children: [
              /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { asChild: !0, children: /* @__PURE__ */ e.jsx(d.Link, { href: l.form(a.id), children: t("Edit") }) }),
              a.shareUrl && /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { asChild: !0, children: /* @__PURE__ */ e.jsx("a", { href: a.shareUrl, target: "_blank", rel: "noopener noreferrer", children: t("Open live form") }) }),
              /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
                B(a);
              }, children: t("Copy embed code") }),
              /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => f(l.formAction(a.id, "duplicate")), children: t("Duplicate") }),
              /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
                M(a);
              }, children: t("Export JSON") }),
              /* @__PURE__ */ e.jsx(s.DropdownMenuSeparator, {}),
              /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { variant: "destructive", onSelect: () => {
                A(a);
              }, children: t("Move to trash") })
            ] })
          ] }) })
        ] }, a.id)),
        r.data.length === 0 && /* @__PURE__ */ e.jsx(s.TableRow, { children: /* @__PURE__ */ e.jsx(s.TableCell, { colSpan: 6, className: "cf:h-24 cf:text-center cf:text-muted-foreground", children: /* @__PURE__ */ e.jsxs("span", { className: "cf:flex cf:flex-col cf:items-center cf:gap-1", children: [
          c.search || c.status === "draft" || c.status === "publish" ? t("Nothing matches.") : n ? t("The trash is empty.") : t("No forms yet. Create one from a template or start blank."),
          !n && /* @__PURE__ */ e.jsx(s.TrashHint, { count: h.trash, onShow: () => o({ status: "trash" }) })
        ] }) }) })
      ] })
    ] }) }),
    r.pages > 1 && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:justify-end cf:gap-2 cf:text-sm cf:text-muted-foreground", children: [
      /* @__PURE__ */ e.jsx("span", { children: u(t("Page %1$d of %2$d"), r.page, r.pages) }),
      /* @__PURE__ */ e.jsx(
        s.Button,
        {
          variant: "outline",
          size: "icon",
          className: "cf:size-8",
          "aria-label": t("Previous page"),
          disabled: r.page <= 1,
          onClick: () => o({ page: r.page - 1 }),
          children: /* @__PURE__ */ e.jsx(O, {})
        }
      ),
      /* @__PURE__ */ e.jsx(
        s.Button,
        {
          variant: "outline",
          size: "icon",
          className: "cf:size-8",
          "aria-label": t("Next page"),
          disabled: r.page >= r.pages,
          onClick: () => o({ page: r.page + 1 }),
          children: /* @__PURE__ */ e.jsx(G, {})
        }
      )
    ] })
  ] });
}
function j({ value: r }) {
  return /* @__PURE__ */ e.jsx("span", { className: "cf:ml-1 cf:text-xs cf:text-muted-foreground cf:tabular-nums", children: r });
}
function Y({ form: r }) {
  return r.status === "trash" ? /* @__PURE__ */ e.jsx(s.Badge, { variant: "outline", children: t("Trash") }) : r.status === "publish" ? /* @__PURE__ */ e.jsx(s.Badge, { children: u(t("Live · v%d"), r.version) }) : /* @__PURE__ */ e.jsx(s.Badge, { variant: "secondary", children: t("Draft") });
}
export {
  ne as default
};
