import { c as W, b as i, _ as t, j as e, u as s, s as w, e as Q, a as me, f as z, r as H, d as Z } from "./urls-BB4MaRFd.js";
import { e as he, s as ee, r as se, S as xe, d as pe, a as ge, o as je } from "./model-DfLCnZf1.js";
import { C as te, D as re } from "./download-BomVY03l.js";
import { u as ve } from "./useConfirm-BbCeRslr.js";
import { a as be, b as Se } from "./format-CfVrQZbp.js";
import { S as ye, C as we, a as Ce } from "./search-BSKIvx55.js";
const ne = {
  name: "chevrons-up-down",
  size: 24,
  node: [
    ["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
    ["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }]
  ]
};
ne.node;
const Ne = W(ne);
const le = {
  name: "list-filter",
  size: 24,
  node: [
    ["path", { d: "M2 5h20", key: "1fs1ex" }],
    ["path", { d: "M6 12h12", key: "8npq4p" }],
    ["path", { d: "M9 19h6", key: "456am0" }]
  ]
};
le.node;
const Te = W(le);
const oe = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]
};
oe.node;
const Ie = W(oe);
function ce({ api: l, value: c, label: o, onChange: d, allLabel: n, className: p }) {
  const [a, g] = i.useState(!1), [j, C] = i.useState(""), [x, v] = i.useState([]), [u, k] = i.useState(!1);
  i.useEffect(() => {
    if (!a) return;
    const h = new AbortController(), T = window.setTimeout(() => {
      k(!0), l.request(`admin/analytics/forms?page=1&search=${encodeURIComponent(j)}`, "GET", void 0, h.signal).then((E) => v(E.items)).catch(() => !h.signal.aborted && v([])).finally(() => !h.signal.aborted && k(!1));
    }, j ? 250 : 0);
    return () => {
      window.clearTimeout(T), h.abort();
    };
  }, [l, a, j]);
  const y = c ? x.find((h) => h.id === c)?.title ?? o ?? `#${c}` : n ?? t("Choose a form");
  return /* @__PURE__ */ e.jsxs(s.Popover, { open: a, onOpenChange: g, children: [
    /* @__PURE__ */ e.jsx(s.PopoverTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", role: "combobox", "aria-expanded": a, "aria-label": t("Form"), className: p ?? "cf:w-56 cf:justify-between", children: [
      /* @__PURE__ */ e.jsx("span", { className: "cf:truncate", children: y }),
      /* @__PURE__ */ e.jsx(Ne, { className: "cf:opacity-50" })
    ] }) }),
    /* @__PURE__ */ e.jsx(s.PopoverContent, { className: "cf:w-72 cf:p-0", align: "start", children: /* @__PURE__ */ e.jsxs(s.Command, { shouldFilter: !1, children: [
      /* @__PURE__ */ e.jsx(s.CommandInput, { placeholder: t("Search forms…"), value: j, onValueChange: C }),
      /* @__PURE__ */ e.jsxs(s.CommandList, { children: [
        /* @__PURE__ */ e.jsx(s.CommandEmpty, { children: u ? t("Loading…") : t("No forms found.") }),
        /* @__PURE__ */ e.jsxs(s.CommandGroup, { children: [
          n && !j && /* @__PURE__ */ e.jsxs(s.CommandItem, { value: "__all", onSelect: () => {
            d(void 0), g(!1);
          }, children: [
            /* @__PURE__ */ e.jsx(te, { className: c ? "cf:opacity-0" : void 0 }),
            " ",
            n
          ] }),
          x.map((h) => /* @__PURE__ */ e.jsxs(s.CommandItem, { value: String(h.id), onSelect: () => {
            d(h.id, h.title), g(!1);
          }, children: [
            /* @__PURE__ */ e.jsx(te, { className: c === h.id ? void 0 : "cf:opacity-0" }),
            /* @__PURE__ */ e.jsx("span", { className: "cf:truncate", children: h.title })
          ] }, h.id))
        ] })
      ] })
    ] }) })
  ] });
}
function De({ api: l, open: c, onOpenChange: o, filters: d, ids: n, formTitle: p }) {
  const [a, g] = i.useState(d.formId), [j, C] = i.useState(p), [x, v] = i.useState("labels"), [u, k] = i.useState(","), [y, h] = i.useState(null), [T, E] = i.useState(!1), [L, P] = i.useState("");
  i.useEffect(() => {
    c && (g(d.formId), C(p), h(null), P(""));
  }, [c, d.formId, p]);
  const $ = async () => {
    if (a) {
      E(!0), P("");
      try {
        h(await l.request("admin/submissions/export", "POST", he({ ...d, formId: a }, n, [], x, u)));
      } catch (N) {
        P(Q(N));
      } finally {
        E(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsx(s.Dialog, { open: c, onOpenChange: o, children: /* @__PURE__ */ e.jsxs(s.DialogContent, { children: [
    /* @__PURE__ */ e.jsxs(s.DialogHeader, { children: [
      /* @__PURE__ */ e.jsx(s.DialogTitle, { children: t("Export submissions") }),
      /* @__PURE__ */ e.jsx(s.DialogDescription, { children: n.length ? w(t("The %d selected submissions, as a CSV file."), n.length) : t("The submissions the inbox shows with its current filters, as a CSV file.") })
    ] }),
    y?.status === "ready" && y.downloadUrl ? /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm", children: w(t("%d rows are ready. The link works for you only and expires in 24 hours."), y.rowCount ?? 0) }),
      /* @__PURE__ */ e.jsx(s.Button, { asChild: !0, children: /* @__PURE__ */ e.jsxs("a", { href: y.downloadUrl, download: !0, children: [
        /* @__PURE__ */ e.jsx(re, {}),
        " ",
        t("Download CSV")
      ] }) })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(s.Label, { children: t("Form") }),
        /* @__PURE__ */ e.jsx(
          ce,
          {
            api: l,
            value: a,
            label: j,
            className: "cf:w-full cf:justify-between",
            onChange: (N, O) => {
              g(N), C(O);
            }
          }
        ),
        /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: t("One form per file, so the columns are its questions.") })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:gap-4 cf:sm:grid-cols-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2", children: [
          /* @__PURE__ */ e.jsx(s.Label, { htmlFor: "cf-export-headers", children: t("Column headers") }),
          /* @__PURE__ */ e.jsxs(s.Select, { value: x, onValueChange: (N) => v(N), children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { id: "cf-export-headers", children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(s.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "labels", children: t("Question labels") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "keys", children: t("Field keys") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2", children: [
          /* @__PURE__ */ e.jsx(s.Label, { htmlFor: "cf-export-delimiter", children: t("Separator") }),
          /* @__PURE__ */ e.jsxs(s.Select, { value: u, onValueChange: (N) => k(N), children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { id: "cf-export-delimiter", children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(s.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: ",", children: t("Comma") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: ";", children: t("Semicolon (Excel in many locales)") })
            ] })
          ] })
        ] })
      ] }),
      d.formId && a !== d.formId && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", children: t("The inbox is filtered to another form: choose that one, or clear the form filter first.") }),
      y && y.status !== "ready" && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", children: y.message ?? t("The export failed. Please try again.") }),
      L && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", role: "alert", children: L })
    ] }),
    /* @__PURE__ */ e.jsxs(s.DialogFooter, { children: [
      /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => o(!1), children: t("Close") }),
      y?.status !== "ready" && /* @__PURE__ */ e.jsx(s.Button, { onClick: () => {
        $();
      }, disabled: T || !a || !!(d.formId && a !== d.formId), children: T ? t("Exporting…") : t("Create export") })
    ] })
  ] }) });
}
const V = [20, 50, 100], ke = ["completed", "partial", "abandoned", "spam", "trash"], Ee = ["eq", "neq", "contains", "gt", "gte", "lt", "lte", "is_empty", "is_not_empty"], Pe = /^\d{4}-\d{2}-\d{2}$/;
function Re(l) {
  const c = new URLSearchParams(l), o = {}, d = c.get("status");
  o.status = ke.includes(d) ? d : "completed";
  const n = Number(c.get("formId"));
  Number.isSafeInteger(n) && n > 0 && (o.formId = n);
  for (const x of ["from", "to"]) {
    const v = c.get(x);
    v && Pe.test(v) && (o[x] = v);
  }
  const p = c.get("search");
  p && (o.search = p.slice(0, 255));
  for (const x of ["isRead", "isStarred"]) {
    const v = c.get(x);
    (v === "1" || v === "0") && (o[x] = v === "1");
  }
  const a = c.get("fieldKey"), g = c.get("operator");
  if (o.formId && a && /^[a-z][a-z0-9_]{0,63}$/.test(a) && g && Ee.includes(g)) {
    o.fieldKey = a, o.operator = g;
    const x = c.get("value");
    x !== null && !g.startsWith("is_") && (o.value = x.slice(0, 255));
  }
  const j = Number(c.get("page")), C = Number(c.get("perPage"));
  return {
    filters: o,
    page: Number.isSafeInteger(j) && j > 1 ? j : 1,
    perPage: V.includes(C) ? C : V[0]
  };
}
function q(l, c = !1) {
  const o = new URLSearchParams();
  for (const [d, n] of Object.entries(l.filters))
    n === void 0 || n === "" || !c && d === "status" && n === "completed" || o.set(d, typeof n == "boolean" ? n ? "1" : "0" : String(n));
  return (c || l.page > 1) && o.set("page", String(l.page)), (c || l.perPage !== V[0]) && o.set("perPage", String(l.perPage)), o.toString();
}
function ae(l) {
  return Object.entries(l).some(([c, o]) => c !== "status" && o !== void 0 && o !== "");
}
function Le(l, c) {
  if (l) return Object.keys(l).slice(0, 3);
  const o = /* @__PURE__ */ new Map();
  for (const d of c) for (const n of Object.keys(d.answers)) o.set(n, (o.get(n) ?? 0) + 1);
  return [...o].sort((d, n) => n[1] - d[1]).slice(0, 3).map(([d]) => d);
}
const Me = ["completed", "partial", "abandoned", "spam", "trash"];
function Ke({ config: l }) {
  s.useBreadcrumbs([{ label: t("Submissions") }]);
  const c = me(l), [o, d] = ve(), [n, p] = i.useState(() => Re(window.location.search)), [a, g] = i.useState(null), [j, C] = i.useState(!0), [x, v] = i.useState(""), [u, k] = i.useState([]), [y, h] = i.useState(0), [T, E] = i.useState(n.filters.search ?? ""), [L, P] = i.useState(), [$, N] = i.useState(!1), [O, F] = i.useState(!1), { filters: b } = n, G = z(l, "edit_submissions"), J = z(l, "delete_submissions"), A = i.useRef(n);
  A.current = n;
  const I = i.useCallback((r, f = {}) => {
    const S = A.current, m = { filters: { ...S.filters, ...r }, page: f.page ?? 1, perPage: f.perPage ?? S.perPage };
    for (const K of Object.keys(m.filters))
      (m.filters[K] === void 0 || m.filters[K] === "") && delete m.filters[K];
    const B = q(m);
    H.router.replace({ url: Z.submissions() + (B ? `?${B}` : ""), preserveState: !0, preserveScroll: !0 }), A.current = m, p(m);
  }, []);
  i.useEffect(() => {
    const r = new AbortController();
    return C(!0), v(""), c.request(`admin/submissions?${q(n, !0)}`, "GET", void 0, r.signal).then((f) => {
      if (!f.items.length && f.total > 0 && n.page > 1) {
        I({}, { page: Math.max(1, Math.ceil(f.total / n.perPage)) });
        return;
      }
      if (g(f), k([]), b.formId) {
        const S = Object.entries(f.forms).find(([m]) => m.startsWith(`${b.formId}:`));
        S && P((m) => m ?? S[1].title);
      }
    }).catch((f) => !r.signal.aborted && v(Q(f))).finally(() => !r.signal.aborted && C(!1)), () => r.abort();
  }, [c, n, y]), i.useEffect(() => {
    if (T === (b.search ?? "")) return;
    const r = window.setTimeout(() => I({ search: T }), 300);
    return () => window.clearTimeout(r);
  }, [T]);
  const M = i.useMemo(() => {
    if (!b.formId || !a) return;
    const r = Object.entries(a.forms).filter(([f]) => f.startsWith(`${b.formId}:`));
    return r.length ? Object.assign({}, ...r.map(([, f]) => f.labels)) : void 0;
  }, [b.formId, a]), _ = i.useMemo(() => Le(M, a?.items ?? []), [M, a]), ie = (r) => M?.[r] ?? Object.values(a?.forms ?? {}).find((f) => f.labels[r])?.labels[r] ?? r, D = async (r) => {
    try {
      await c.request("admin/submissions/bulk", "POST", r === "permanent" ? { ids: u, permanent: !0, confirmation: "DELETE" } : { ids: u, changes: r }), s.toast.success(w(t("%d submissions updated."), u.length));
    } catch (f) {
      s.toast.error(Q(f));
    } finally {
      h((f) => f + 1);
    }
  }, de = async () => {
    await o({ title: w(t("Move %d submissions to the trash?"), u.length), confirmLabel: t("Move to trash"), destructive: !0 }) && await D({ status: "trash" });
  }, fe = async () => {
    if (!await o({
      title: w(t("Resend emails for %d submissions?"), u.length),
      description: t("Every admin notification and autoresponder that matches each submission is sent again."),
      confirmLabel: t("Resend")
    })) return;
    const r = crypto.randomUUID(), S = (await Promise.allSettled(u.map((m) => c.request(`admin/submissions/${m}/resend`, "POST", { requestId: r })))).filter((m) => m.status === "rejected").length;
    S ? s.toast.error(w(t("Resent %1$d of %2$d submissions; %3$d failed."), u.length - S, u.length, S)) : s.toast.success(t("Emails queued."));
  }, R = a?.items ?? [], ue = R.length > 0 && u.length === R.length, X = a ? Math.max(1, Math.ceil(a.total / a.perPage)) : 1, Y = q(n), U = b.status === "trash";
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(H.Head, { title: t("Submissions") }),
    d,
    /* @__PURE__ */ e.jsx(
      s.PageHeader,
      {
        title: t("Submissions"),
        description: t("Read every response, follow up on partial conversations and export what you need."),
        primary: z(l, "export_submissions") && /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", onClick: () => N(!0), children: [
          /* @__PURE__ */ e.jsx(re, {}),
          " ",
          t("Export CSV")
        ] })
      }
    ),
    /* @__PURE__ */ e.jsx(s.Tabs, { value: b.status ?? "completed", onValueChange: (r) => I({ status: r }), children: /* @__PURE__ */ e.jsx(s.TabsList, { children: Me.map((r) => /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: r, children: ee(r) }, r)) }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-center cf:gap-2", children: [
      /* @__PURE__ */ e.jsx(
        ce,
        {
          api: c,
          value: b.formId,
          label: L,
          allLabel: t("All forms"),
          onChange: (r, f) => {
            P(f), I({ formId: r, fieldKey: void 0, operator: void 0, value: void 0 });
          }
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "cf:relative cf:w-full cf:max-w-xs", children: [
        /* @__PURE__ */ e.jsx(ye, { className: "cf:pointer-events-none cf:absolute cf:top-1/2 cf:left-2.5 cf:size-4 cf:-translate-y-1/2 cf:text-muted-foreground" }),
        /* @__PURE__ */ e.jsx(
          s.Input,
          {
            className: "cf:pl-9",
            placeholder: t("Search answers…"),
            "aria-label": t("Search answers"),
            value: T,
            onChange: (r) => E(r.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx(_e, { filters: b, labels: M, onChange: I }),
      ae(b) && /* @__PURE__ */ e.jsxs(s.Button, { variant: "ghost", onClick: () => {
        E(""), P(void 0), I({ formId: void 0, from: void 0, to: void 0, search: void 0, isRead: void 0, isStarred: void 0, fieldKey: void 0, operator: void 0, value: void 0 });
      }, children: [
        /* @__PURE__ */ e.jsx(Ie, {}),
        " ",
        t("Reset filters")
      ] })
    ] }),
    u.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-center cf:gap-2", role: "toolbar", "aria-label": t("Bulk actions"), children: [
      /* @__PURE__ */ e.jsx("span", { className: "cf:text-sm cf:text-muted-foreground", children: w(t("%d selected"), u.length) }),
      G && !U && /* @__PURE__ */ e.jsxs(s.DropdownMenu, { children: [
        /* @__PURE__ */ e.jsx(s.DropdownMenuTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", children: t("Mark as…") }) }),
        /* @__PURE__ */ e.jsxs(s.DropdownMenuContent, { align: "start", children: [
          /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            D({ isRead: !0 });
          }, children: t("Read") }),
          /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            D({ isRead: !1 });
          }, children: t("Unread") }),
          /* @__PURE__ */ e.jsx(s.DropdownMenuSeparator, {}),
          /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            D({ isStarred: !0 });
          }, children: t("Starred") }),
          /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            D({ isStarred: !1 });
          }, children: t("Not starred") }),
          /* @__PURE__ */ e.jsx(s.DropdownMenuSeparator, {}),
          b.status === "spam" ? /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            D({ status: "completed" });
          }, children: t("Not spam") }) : /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            D({ status: "spam" });
          }, children: t("Spam") })
        ] })
      ] }),
      G && b.status === "completed" && /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => {
        fe();
      }, children: t("Resend emails") }),
      J && !U && /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", className: "cf:text-destructive", onClick: () => {
        de();
      }, children: t("Move to trash") }),
      J && U && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => {
          D({ status: "restore" });
        }, children: t("Restore") }),
        /* @__PURE__ */ e.jsx(s.Button, { variant: "destructive", onClick: () => F(!0), children: t("Delete permanently") })
      ] })
    ] }),
    x && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", role: "alert", children: x }),
    /* @__PURE__ */ e.jsx(s.Card, { className: "cf:gap-0 cf:overflow-hidden cf:py-0", children: /* @__PURE__ */ e.jsxs(s.Table, { children: [
      /* @__PURE__ */ e.jsx(s.TableHeader, { className: "cf:bg-muted/60", children: /* @__PURE__ */ e.jsxs(s.TableRow, { className: "cf:hover:bg-transparent", children: [
        /* @__PURE__ */ e.jsx(s.TableHead, { className: "cf:w-8", children: /* @__PURE__ */ e.jsx(
          s.Checkbox,
          {
            "aria-label": t("Select all rows"),
            checked: ue,
            disabled: !R.length,
            onCheckedChange: (r) => k(r ? R.map((f) => f.id) : [])
          }
        ) }),
        /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Submission") }),
        /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Date") }),
        _.map((r) => /* @__PURE__ */ e.jsx(s.TableHead, { children: ie(r) }, r)),
        /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Progress") })
      ] }) }),
      /* @__PURE__ */ e.jsxs(s.TableBody, { children: [
        j && !a && Array.from({ length: 3 }, (r, f) => /* @__PURE__ */ e.jsx(s.TableRow, { "aria-hidden": "true", children: Array.from({ length: 4 + _.length }, (S, m) => /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx(s.Skeleton, { className: "cf:h-4 cf:w-24" }) }, m)) }, `skeleton-${f}`)),
        R.map((r) => {
          const f = a?.forms[`${r.formId}:${r.formVersion}`];
          return /* @__PURE__ */ e.jsxs(s.TableRow, { "data-state": u.includes(r.id) ? "selected" : void 0, className: j ? "cf:opacity-60" : void 0, children: [
            /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx(
              s.Checkbox,
              {
                "aria-label": w(t("Select %s"), se(r.id)),
                checked: u.includes(r.id),
                onCheckedChange: (S) => k((m) => S ? [...m, r.id] : m.filter((B) => B !== r.id))
              }
            ) }),
            /* @__PURE__ */ e.jsxs(s.TableCell, { children: [
              /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:gap-2", children: [
                !r.isRead && /* @__PURE__ */ e.jsx("span", { className: "cf:size-2 cf:shrink-0 cf:rounded-full cf:bg-primary", "aria-label": t("Unread") }),
                /* @__PURE__ */ e.jsx(
                  H.Link,
                  {
                    href: Z.submission(r.id) + (Y ? `?back=${encodeURIComponent(Y)}` : ""),
                    className: `cf:underline-offset-4 cf:hover:underline ${r.isRead ? "" : "cf:font-semibold"}`,
                    children: se(r.id)
                  }
                ),
                r.isStarred && /* @__PURE__ */ e.jsx(xe, { className: "cf:size-3.5 cf:fill-current cf:text-amber-500", "aria-label": t("Starred") })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "cf:text-xs cf:text-muted-foreground", children: f ? `${f.title} · v${r.formVersion}` : `#${r.formId}` })
            ] }),
            /* @__PURE__ */ e.jsx(s.TableCell, { className: "cf:whitespace-nowrap", children: be(r.createdAt) }),
            _.map((S) => /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx("div", { className: "cf:max-w-56 cf:truncate", children: Se(r.answers[S], pe) || "—" }) }, S)),
            /* @__PURE__ */ e.jsxs(s.TableCell, { className: "cf:whitespace-nowrap", children: [
              /* @__PURE__ */ e.jsx(s.Badge, { variant: r.status === "completed" ? "default" : "secondary", children: ee(r.status) }),
              /* @__PURE__ */ e.jsxs("span", { className: "cf:ml-2 cf:text-xs cf:text-muted-foreground cf:tabular-nums", children: [
                r.progress,
                "%"
              ] })
            ] })
          ] }, r.id);
        }),
        !j && a && !R.length && /* @__PURE__ */ e.jsx(s.TableRow, { children: /* @__PURE__ */ e.jsx(s.TableCell, { colSpan: 4 + _.length, className: "cf:h-24 cf:text-center cf:text-muted-foreground", children: ae(b) ? t("Nothing matches. Try another form, date range or search.") : t("No submissions here yet.") }) })
      ] })
    ] }) }),
    a && a.total > 0 && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-center cf:justify-end cf:gap-2 cf:text-sm cf:text-muted-foreground", children: [
      /* @__PURE__ */ e.jsx("span", { children: w(t("%d submissions"), a.total) }),
      /* @__PURE__ */ e.jsxs(s.Select, { value: String(n.perPage), onValueChange: (r) => I({}, { perPage: Number(r) }), children: [
        /* @__PURE__ */ e.jsx(s.SelectTrigger, { className: "cf:w-32", "aria-label": t("Rows per page"), children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
        /* @__PURE__ */ e.jsx(s.SelectContent, { children: V.map((r) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: String(r), children: w(t("%d per page"), r) }, r)) })
      ] }),
      /* @__PURE__ */ e.jsx("span", { children: w(t("Page %1$d of %2$d"), n.page, X) }),
      /* @__PURE__ */ e.jsx(
        s.Button,
        {
          variant: "outline",
          size: "icon",
          className: "cf:size-8",
          "aria-label": t("Previous page"),
          disabled: n.page <= 1,
          onClick: () => I({}, { page: n.page - 1 }),
          children: /* @__PURE__ */ e.jsx(we, {})
        }
      ),
      /* @__PURE__ */ e.jsx(
        s.Button,
        {
          variant: "outline",
          size: "icon",
          className: "cf:size-8",
          "aria-label": t("Next page"),
          disabled: n.page >= X,
          onClick: () => I({}, { page: n.page + 1 }),
          children: /* @__PURE__ */ e.jsx(Ce, {})
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(De, { api: c, open: $, onOpenChange: N, filters: b, ids: u, formTitle: L }),
    /* @__PURE__ */ e.jsx(Be, { open: O, count: u.length, onOpenChange: F, onConfirm: () => {
      F(!1), D("permanent");
    } })
  ] });
}
function _e({ filters: l, labels: c, onChange: o }) {
  const d = [l.from, l.to, l.isRead, l.isStarred, l.fieldKey].filter((a) => a !== void 0).length, n = (a) => a === void 0 ? "any" : a ? "yes" : "no", p = (a) => a === "any" ? void 0 : a === "yes";
  return /* @__PURE__ */ e.jsxs(s.Popover, { children: [
    /* @__PURE__ */ e.jsx(s.PopoverTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", children: [
      /* @__PURE__ */ e.jsx(Te, {}),
      " ",
      t("Filters"),
      d > 0 && /* @__PURE__ */ e.jsx(s.Badge, { variant: "secondary", className: "cf:ml-1", children: d })
    ] }) }),
    /* @__PURE__ */ e.jsxs(s.PopoverContent, { className: "cf:flex cf:w-80 cf:flex-col cf:gap-4", align: "start", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:grid-cols-2 cf:gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { children: t("From") }),
          /* @__PURE__ */ e.jsx(s.DatePicker, { value: l.from ?? null, onChange: (a) => o({ from: a ?? void 0 }) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { children: t("To") }),
          /* @__PURE__ */ e.jsx(s.DatePicker, { value: l.to ?? null, onChange: (a) => o({ to: a ?? void 0 }) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:grid-cols-2 cf:gap-2", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { children: t("Read") }),
          /* @__PURE__ */ e.jsxs(s.Select, { value: n(l.isRead), onValueChange: (a) => o({ isRead: p(a) }), children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(s.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "any", children: t("Any") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "no", children: t("Unread") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "yes", children: t("Read") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
          /* @__PURE__ */ e.jsx(s.Label, { children: t("Starred") }),
          /* @__PURE__ */ e.jsxs(s.Select, { value: n(l.isStarred), onValueChange: (a) => o({ isStarred: p(a) }), children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(s.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "any", children: t("Any") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "yes", children: t("Starred") }),
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "no", children: t("Not starred") })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-1.5", children: [
        /* @__PURE__ */ e.jsx(s.Label, { children: t("Answer") }),
        c ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs(s.Select, { value: l.fieldKey ?? "none", onValueChange: (a) => o(a === "none" ? { fieldKey: void 0, operator: void 0, value: void 0 } : { fieldKey: a, operator: l.operator ?? "eq" }), children: [
            /* @__PURE__ */ e.jsx(s.SelectTrigger, { "aria-label": t("Question"), children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
            /* @__PURE__ */ e.jsxs(s.SelectContent, { children: [
              /* @__PURE__ */ e.jsx(s.SelectItem, { value: "none", children: t("Any answer") }),
              Object.entries(c).map(([a, g]) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: a, children: g }, a))
            ] })
          ] }),
          l.fieldKey && /* @__PURE__ */ e.jsxs("div", { className: "cf:grid cf:grid-cols-2 cf:gap-2", children: [
            /* @__PURE__ */ e.jsxs(s.Select, { value: l.operator ?? "eq", onValueChange: (a) => o({ operator: a, value: a.startsWith("is_") ? void 0 : l.value }), children: [
              /* @__PURE__ */ e.jsx(s.SelectTrigger, { "aria-label": t("Condition"), children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
              /* @__PURE__ */ e.jsx(s.SelectContent, { children: ge.map((a) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: a, children: je(a) }, a)) })
            ] }),
            !l.operator?.startsWith("is_") && /* @__PURE__ */ e.jsx(
              s.Input,
              {
                "aria-label": t("Value"),
                defaultValue: l.value ?? "",
                onBlur: (a) => a.target.value !== (l.value ?? "") && o({ value: a.target.value }),
                onKeyDown: (a) => a.key === "Enter" && o({ value: a.currentTarget.value })
              }
            )
          ] })
        ] }) : /* @__PURE__ */ e.jsx("p", { className: "cf:text-xs cf:text-muted-foreground", children: t("Choose a form to filter by an answer.") })
      ] })
    ] })
  ] });
}
function Be({ open: l, count: c, onOpenChange: o, onConfirm: d }) {
  const [n, p] = i.useState("");
  return i.useEffect(() => p(""), [l]), /* @__PURE__ */ e.jsx(s.Dialog, { open: l, onOpenChange: o, children: /* @__PURE__ */ e.jsxs(s.DialogContent, { children: [
    /* @__PURE__ */ e.jsxs(s.DialogHeader, { children: [
      /* @__PURE__ */ e.jsx(s.DialogTitle, { children: w(t("Delete %d submissions permanently?"), c) }),
      /* @__PURE__ */ e.jsx(s.DialogDescription, { children: t("Their answers, notes and email history are erased. This cannot be undone. Type DELETE to confirm.") })
    ] }),
    /* @__PURE__ */ e.jsx(s.Input, { "aria-label": t("Type DELETE to confirm"), value: n, onChange: (a) => p(a.target.value) }),
    /* @__PURE__ */ e.jsxs(s.DialogFooter, { children: [
      /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => o(!1), children: t("Cancel") }),
      /* @__PURE__ */ e.jsx(s.Button, { variant: "destructive", disabled: n !== "DELETE", onClick: d, children: t("Delete permanently") })
    ] })
  ] }) });
}
export {
  Ke as default
};
