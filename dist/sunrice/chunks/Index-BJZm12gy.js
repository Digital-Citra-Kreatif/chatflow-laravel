import { c as _, b as i, _ as t, j as e, u as s, s as w, e as W, a as xe, f as K, r as q, d as Z } from "./urls-B0_osvz3.js";
import { e as pe, s as ee, r as se, S as ge, d as je, a as ve, o as be } from "./model-COPtwvtm.js";
import { u as Se } from "./useConfirm-DmdBg5Y3.js";
import { a as ye, b as we } from "./format-CJT6lmVo.js";
import { S as Ce, C as Ne, a as Te } from "./search-BXFaXqsK.js";
const ne = {
  name: "check",
  size: 24,
  node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
};
ne.node;
const te = _(ne);
const re = {
  name: "chevrons-up-down",
  size: 24,
  node: [
    ["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
    ["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }]
  ]
};
re.node;
const Ie = _(re);
const le = {
  name: "download",
  size: 24,
  node: [
    ["path", { d: "M12 15V3", key: "m9g1x1" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
  ]
};
le.node;
const oe = _(le);
const ce = {
  name: "list-filter",
  size: 24,
  node: [
    ["path", { d: "M2 5h20", key: "1fs1ex" }],
    ["path", { d: "M6 12h12", key: "8npq4p" }],
    ["path", { d: "M9 19h6", key: "456am0" }]
  ]
};
ce.node;
const ke = _(ce);
const ie = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]
};
ie.node;
const De = _(ie);
function de({ api: l, value: c, label: o, onChange: d, allLabel: r, className: p }) {
  const [a, g] = i.useState(!1), [j, C] = i.useState(""), [x, v] = i.useState([]), [u, D] = i.useState(!1);
  i.useEffect(() => {
    if (!a) return;
    const m = new AbortController(), T = window.setTimeout(() => {
      D(!0), l.request(`admin/analytics/forms?page=1&search=${encodeURIComponent(j)}`, "GET", void 0, m.signal).then((E) => v(E.items)).catch(() => !m.signal.aborted && v([])).finally(() => !m.signal.aborted && D(!1));
    }, j ? 250 : 0);
    return () => {
      window.clearTimeout(T), m.abort();
    };
  }, [l, a, j]);
  const y = c ? x.find((m) => m.id === c)?.title ?? o ?? `#${c}` : r ?? t("Choose a form");
  return /* @__PURE__ */ e.jsxs(s.Popover, { open: a, onOpenChange: g, children: [
    /* @__PURE__ */ e.jsx(s.PopoverTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", role: "combobox", "aria-expanded": a, "aria-label": t("Form"), className: p ?? "cf:w-56 cf:justify-between", children: [
      /* @__PURE__ */ e.jsx("span", { className: "cf:truncate", children: y }),
      /* @__PURE__ */ e.jsx(Ie, { className: "cf:opacity-50" })
    ] }) }),
    /* @__PURE__ */ e.jsx(s.PopoverContent, { className: "cf:w-72 cf:p-0", align: "start", children: /* @__PURE__ */ e.jsxs(s.Command, { shouldFilter: !1, children: [
      /* @__PURE__ */ e.jsx(s.CommandInput, { placeholder: t("Search forms…"), value: j, onValueChange: C }),
      /* @__PURE__ */ e.jsxs(s.CommandList, { children: [
        /* @__PURE__ */ e.jsx(s.CommandEmpty, { children: u ? t("Loading…") : t("No forms found.") }),
        /* @__PURE__ */ e.jsxs(s.CommandGroup, { children: [
          r && !j && /* @__PURE__ */ e.jsxs(s.CommandItem, { value: "__all", onSelect: () => {
            d(void 0), g(!1);
          }, children: [
            /* @__PURE__ */ e.jsx(te, { className: c ? "cf:opacity-0" : void 0 }),
            " ",
            r
          ] }),
          x.map((m) => /* @__PURE__ */ e.jsxs(s.CommandItem, { value: String(m.id), onSelect: () => {
            d(m.id, m.title), g(!1);
          }, children: [
            /* @__PURE__ */ e.jsx(te, { className: c === m.id ? void 0 : "cf:opacity-0" }),
            /* @__PURE__ */ e.jsx("span", { className: "cf:truncate", children: m.title })
          ] }, m.id))
        ] })
      ] })
    ] }) })
  ] });
}
function Ee({ api: l, open: c, onOpenChange: o, filters: d, ids: r, formTitle: p }) {
  const [a, g] = i.useState(d.formId), [j, C] = i.useState(p), [x, v] = i.useState("labels"), [u, D] = i.useState(","), [y, m] = i.useState(null), [T, E] = i.useState(!1), [M, P] = i.useState("");
  i.useEffect(() => {
    c && (g(d.formId), C(p), m(null), P(""));
  }, [c, d.formId, p]);
  const O = async () => {
    if (a) {
      E(!0), P("");
      try {
        m(await l.request("admin/submissions/export", "POST", pe({ ...d, formId: a }, r, [], x, u)));
      } catch (N) {
        P(W(N));
      } finally {
        E(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsx(s.Dialog, { open: c, onOpenChange: o, children: /* @__PURE__ */ e.jsxs(s.DialogContent, { children: [
    /* @__PURE__ */ e.jsxs(s.DialogHeader, { children: [
      /* @__PURE__ */ e.jsx(s.DialogTitle, { children: t("Export submissions") }),
      /* @__PURE__ */ e.jsx(s.DialogDescription, { children: r.length ? w(t("The %d selected submissions, as a CSV file."), r.length) : t("The submissions the inbox shows with its current filters, as a CSV file.") })
    ] }),
    y?.status === "ready" && y.downloadUrl ? /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-3", children: [
      /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm", children: w(t("%d rows are ready. The link works for you only and expires in 24 hours."), y.rowCount ?? 0) }),
      /* @__PURE__ */ e.jsx(s.Button, { asChild: !0, children: /* @__PURE__ */ e.jsxs("a", { href: y.downloadUrl, download: !0, children: [
        /* @__PURE__ */ e.jsx(oe, {}),
        " ",
        t("Download CSV")
      ] }) })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-2", children: [
        /* @__PURE__ */ e.jsx(s.Label, { children: t("Form") }),
        /* @__PURE__ */ e.jsx(
          de,
          {
            api: l,
            value: a,
            label: j,
            className: "cf:w-full cf:justify-between",
            onChange: (N, F) => {
              g(N), C(F);
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
          /* @__PURE__ */ e.jsxs(s.Select, { value: u, onValueChange: (N) => D(N), children: [
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
      M && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", role: "alert", children: M })
    ] }),
    /* @__PURE__ */ e.jsxs(s.DialogFooter, { children: [
      /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => o(!1), children: t("Close") }),
      y?.status !== "ready" && /* @__PURE__ */ e.jsx(s.Button, { onClick: () => {
        O();
      }, disabled: T || !a || !!(d.formId && a !== d.formId), children: T ? t("Exporting…") : t("Create export") })
    ] })
  ] }) });
}
const B = [20, 50, 100], Pe = ["completed", "partial", "abandoned", "spam", "trash"], Re = ["eq", "neq", "contains", "gt", "gte", "lt", "lte", "is_empty", "is_not_empty"], Me = /^\d{4}-\d{2}-\d{2}$/;
function _e(l) {
  const c = new URLSearchParams(l), o = {}, d = c.get("status");
  o.status = Pe.includes(d) ? d : "completed";
  const r = Number(c.get("formId"));
  Number.isSafeInteger(r) && r > 0 && (o.formId = r);
  for (const x of ["from", "to"]) {
    const v = c.get(x);
    v && Me.test(v) && (o[x] = v);
  }
  const p = c.get("search");
  p && (o.search = p.slice(0, 255));
  for (const x of ["isRead", "isStarred"]) {
    const v = c.get(x);
    (v === "1" || v === "0") && (o[x] = v === "1");
  }
  const a = c.get("fieldKey"), g = c.get("operator");
  if (o.formId && a && /^[a-z][a-z0-9_]{0,63}$/.test(a) && g && Re.includes(g)) {
    o.fieldKey = a, o.operator = g;
    const x = c.get("value");
    x !== null && !g.startsWith("is_") && (o.value = x.slice(0, 255));
  }
  const j = Number(c.get("page")), C = Number(c.get("perPage"));
  return {
    filters: o,
    page: Number.isSafeInteger(j) && j > 1 ? j : 1,
    perPage: B.includes(C) ? C : B[0]
  };
}
function Q(l, c = !1) {
  const o = new URLSearchParams();
  for (const [d, r] of Object.entries(l.filters))
    r === void 0 || r === "" || !c && d === "status" && r === "completed" || o.set(d, typeof r == "boolean" ? r ? "1" : "0" : String(r));
  return (c || l.page > 1) && o.set("page", String(l.page)), (c || l.perPage !== B[0]) && o.set("perPage", String(l.perPage)), o.toString();
}
function ae(l) {
  return Object.entries(l).some(([c, o]) => c !== "status" && o !== void 0 && o !== "");
}
function Le(l, c) {
  if (l) return Object.keys(l).slice(0, 3);
  const o = /* @__PURE__ */ new Map();
  for (const d of c) for (const r of Object.keys(d.answers)) o.set(r, (o.get(r) ?? 0) + 1);
  return [...o].sort((d, r) => r[1] - d[1]).slice(0, 3).map(([d]) => d);
}
const Ve = ["completed", "partial", "abandoned", "spam", "trash"];
function He({ config: l }) {
  s.useBreadcrumbs([{ label: t("Submissions") }]);
  const c = xe(l), [o, d] = Se(), [r, p] = i.useState(() => _e(window.location.search)), [a, g] = i.useState(null), [j, C] = i.useState(!0), [x, v] = i.useState(""), [u, D] = i.useState([]), [y, m] = i.useState(0), [T, E] = i.useState(r.filters.search ?? ""), [M, P] = i.useState(), [O, N] = i.useState(!1), [F, A] = i.useState(!1), { filters: b } = r, G = K(l, "edit_submissions"), J = K(l, "delete_submissions"), z = i.useRef(r);
  z.current = r;
  const I = i.useCallback((n, f = {}) => {
    const S = z.current, h = { filters: { ...S.filters, ...n }, page: f.page ?? 1, perPage: f.perPage ?? S.perPage };
    for (const H of Object.keys(h.filters))
      (h.filters[H] === void 0 || h.filters[H] === "") && delete h.filters[H];
    const $ = Q(h);
    q.router.replace({ url: Z.submissions() + ($ ? `?${$}` : ""), preserveState: !0, preserveScroll: !0 }), z.current = h, p(h);
  }, []);
  i.useEffect(() => {
    const n = new AbortController();
    return C(!0), v(""), c.request(`admin/submissions?${Q(r, !0)}`, "GET", void 0, n.signal).then((f) => {
      if (!f.items.length && f.total > 0 && r.page > 1) {
        I({}, { page: Math.max(1, Math.ceil(f.total / r.perPage)) });
        return;
      }
      if (g(f), D([]), b.formId) {
        const S = Object.entries(f.forms).find(([h]) => h.startsWith(`${b.formId}:`));
        S && P((h) => h ?? S[1].title);
      }
    }).catch((f) => !n.signal.aborted && v(W(f))).finally(() => !n.signal.aborted && C(!1)), () => n.abort();
  }, [c, r, y]), i.useEffect(() => {
    if (T === (b.search ?? "")) return;
    const n = window.setTimeout(() => I({ search: T }), 300);
    return () => window.clearTimeout(n);
  }, [T]);
  const L = i.useMemo(() => {
    if (!b.formId || !a) return;
    const n = Object.entries(a.forms).filter(([f]) => f.startsWith(`${b.formId}:`));
    return n.length ? Object.assign({}, ...n.map(([, f]) => f.labels)) : void 0;
  }, [b.formId, a]), V = i.useMemo(() => Le(L, a?.items ?? []), [L, a]), fe = (n) => L?.[n] ?? Object.values(a?.forms ?? {}).find((f) => f.labels[n])?.labels[n] ?? n, k = async (n) => {
    try {
      await c.request("admin/submissions/bulk", "POST", n === "permanent" ? { ids: u, permanent: !0, confirmation: "DELETE" } : { ids: u, changes: n }), s.toast.success(w(t("%d submissions updated."), u.length));
    } catch (f) {
      s.toast.error(W(f));
    } finally {
      m((f) => f + 1);
    }
  }, ue = async () => {
    await o({ title: w(t("Move %d submissions to the trash?"), u.length), confirmLabel: t("Move to trash"), destructive: !0 }) && await k({ status: "trash" });
  }, he = async () => {
    if (!await o({
      title: w(t("Resend emails for %d submissions?"), u.length),
      description: t("Every admin notification and autoresponder that matches each submission is sent again."),
      confirmLabel: t("Resend")
    })) return;
    const n = crypto.randomUUID(), S = (await Promise.allSettled(u.map((h) => c.request(`admin/submissions/${h}/resend`, "POST", { requestId: n })))).filter((h) => h.status === "rejected").length;
    S ? s.toast.error(w(t("Resent %1$d of %2$d submissions; %3$d failed."), u.length - S, u.length, S)) : s.toast.success(t("Emails queued."));
  }, R = a?.items ?? [], me = R.length > 0 && u.length === R.length, X = a ? Math.max(1, Math.ceil(a.total / a.perPage)) : 1, Y = Q(r), U = b.status === "trash";
  return /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-col cf:gap-6", children: [
    /* @__PURE__ */ e.jsx(q.Head, { title: t("Submissions") }),
    d,
    /* @__PURE__ */ e.jsx(
      s.PageHeader,
      {
        title: t("Submissions"),
        description: t("Read every response, follow up on partial conversations and export what you need."),
        primary: K(l, "export_submissions") && /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", onClick: () => N(!0), children: [
          /* @__PURE__ */ e.jsx(oe, {}),
          " ",
          t("Export CSV")
        ] })
      }
    ),
    /* @__PURE__ */ e.jsx(s.Tabs, { value: b.status ?? "completed", onValueChange: (n) => I({ status: n }), children: /* @__PURE__ */ e.jsx(s.TabsList, { children: Ve.map((n) => /* @__PURE__ */ e.jsx(s.TabsTrigger, { value: n, children: ee(n) }, n)) }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-center cf:gap-2", children: [
      /* @__PURE__ */ e.jsx(
        de,
        {
          api: c,
          value: b.formId,
          label: M,
          allLabel: t("All forms"),
          onChange: (n, f) => {
            P(f), I({ formId: n, fieldKey: void 0, operator: void 0, value: void 0 });
          }
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "cf:relative cf:w-full cf:max-w-xs", children: [
        /* @__PURE__ */ e.jsx(Ce, { className: "cf:pointer-events-none cf:absolute cf:top-1/2 cf:left-2.5 cf:size-4 cf:-translate-y-1/2 cf:text-muted-foreground" }),
        /* @__PURE__ */ e.jsx(
          s.Input,
          {
            className: "cf:pl-9",
            placeholder: t("Search answers…"),
            "aria-label": t("Search answers"),
            value: T,
            onChange: (n) => E(n.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx($e, { filters: b, labels: L, onChange: I }),
      ae(b) && /* @__PURE__ */ e.jsxs(s.Button, { variant: "ghost", onClick: () => {
        E(""), P(void 0), I({ formId: void 0, from: void 0, to: void 0, search: void 0, isRead: void 0, isStarred: void 0, fieldKey: void 0, operator: void 0, value: void 0 });
      }, children: [
        /* @__PURE__ */ e.jsx(De, {}),
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
            k({ isRead: !0 });
          }, children: t("Read") }),
          /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            k({ isRead: !1 });
          }, children: t("Unread") }),
          /* @__PURE__ */ e.jsx(s.DropdownMenuSeparator, {}),
          /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            k({ isStarred: !0 });
          }, children: t("Starred") }),
          /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            k({ isStarred: !1 });
          }, children: t("Not starred") }),
          /* @__PURE__ */ e.jsx(s.DropdownMenuSeparator, {}),
          b.status === "spam" ? /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            k({ status: "completed" });
          }, children: t("Not spam") }) : /* @__PURE__ */ e.jsx(s.DropdownMenuItem, { onSelect: () => {
            k({ status: "spam" });
          }, children: t("Spam") })
        ] })
      ] }),
      G && b.status === "completed" && /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => {
        he();
      }, children: t("Resend emails") }),
      J && !U && /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", className: "cf:text-destructive", onClick: () => {
        ue();
      }, children: t("Move to trash") }),
      J && U && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => {
          k({ status: "restore" });
        }, children: t("Restore") }),
        /* @__PURE__ */ e.jsx(s.Button, { variant: "destructive", onClick: () => A(!0), children: t("Delete permanently") })
      ] })
    ] }),
    x && /* @__PURE__ */ e.jsx("p", { className: "cf:text-sm cf:text-destructive", role: "alert", children: x }),
    /* @__PURE__ */ e.jsx(s.Card, { className: "cf:gap-0 cf:overflow-hidden cf:py-0", children: /* @__PURE__ */ e.jsxs(s.Table, { children: [
      /* @__PURE__ */ e.jsx(s.TableHeader, { className: "cf:bg-muted/60", children: /* @__PURE__ */ e.jsxs(s.TableRow, { className: "cf:hover:bg-transparent", children: [
        /* @__PURE__ */ e.jsx(s.TableHead, { className: "cf:w-8", children: /* @__PURE__ */ e.jsx(
          s.Checkbox,
          {
            "aria-label": t("Select all rows"),
            checked: me,
            disabled: !R.length,
            onCheckedChange: (n) => D(n ? R.map((f) => f.id) : [])
          }
        ) }),
        /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Submission") }),
        /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Date") }),
        V.map((n) => /* @__PURE__ */ e.jsx(s.TableHead, { children: fe(n) }, n)),
        /* @__PURE__ */ e.jsx(s.TableHead, { children: t("Progress") })
      ] }) }),
      /* @__PURE__ */ e.jsxs(s.TableBody, { children: [
        j && !a && Array.from({ length: 3 }, (n, f) => /* @__PURE__ */ e.jsx(s.TableRow, { "aria-hidden": "true", children: Array.from({ length: 4 + V.length }, (S, h) => /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx(s.Skeleton, { className: "cf:h-4 cf:w-24" }) }, h)) }, `skeleton-${f}`)),
        R.map((n) => {
          const f = a?.forms[`${n.formId}:${n.formVersion}`];
          return /* @__PURE__ */ e.jsxs(s.TableRow, { "data-state": u.includes(n.id) ? "selected" : void 0, className: j ? "cf:opacity-60" : void 0, children: [
            /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx(
              s.Checkbox,
              {
                "aria-label": w(t("Select %s"), se(n.id)),
                checked: u.includes(n.id),
                onCheckedChange: (S) => D((h) => S ? [...h, n.id] : h.filter(($) => $ !== n.id))
              }
            ) }),
            /* @__PURE__ */ e.jsxs(s.TableCell, { children: [
              /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:items-center cf:gap-2", children: [
                !n.isRead && /* @__PURE__ */ e.jsx("span", { className: "cf:size-2 cf:shrink-0 cf:rounded-full cf:bg-primary", "aria-label": t("Unread") }),
                /* @__PURE__ */ e.jsx(
                  q.Link,
                  {
                    href: Z.submission(n.id) + (Y ? `?back=${encodeURIComponent(Y)}` : ""),
                    className: `cf:underline-offset-4 cf:hover:underline ${n.isRead ? "" : "cf:font-semibold"}`,
                    children: se(n.id)
                  }
                ),
                n.isStarred && /* @__PURE__ */ e.jsx(ge, { className: "cf:size-3.5 cf:fill-current cf:text-amber-500", "aria-label": t("Starred") })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "cf:text-xs cf:text-muted-foreground", children: f ? `${f.title} · v${n.formVersion}` : `#${n.formId}` })
            ] }),
            /* @__PURE__ */ e.jsx(s.TableCell, { className: "cf:whitespace-nowrap", children: ye(n.createdAt) }),
            V.map((S) => /* @__PURE__ */ e.jsx(s.TableCell, { children: /* @__PURE__ */ e.jsx("div", { className: "cf:max-w-56 cf:truncate", children: we(n.answers[S], je) || "—" }) }, S)),
            /* @__PURE__ */ e.jsxs(s.TableCell, { className: "cf:whitespace-nowrap", children: [
              /* @__PURE__ */ e.jsx(s.Badge, { variant: n.status === "completed" ? "default" : "secondary", children: ee(n.status) }),
              /* @__PURE__ */ e.jsxs("span", { className: "cf:ml-2 cf:text-xs cf:text-muted-foreground cf:tabular-nums", children: [
                n.progress,
                "%"
              ] })
            ] })
          ] }, n.id);
        }),
        !j && a && !R.length && /* @__PURE__ */ e.jsx(s.TableRow, { children: /* @__PURE__ */ e.jsx(s.TableCell, { colSpan: 4 + V.length, className: "cf:h-24 cf:text-center cf:text-muted-foreground", children: ae(b) ? t("Nothing matches. Try another form, date range or search.") : t("No submissions here yet.") }) })
      ] })
    ] }) }),
    a && a.total > 0 && /* @__PURE__ */ e.jsxs("div", { className: "cf:flex cf:flex-wrap cf:items-center cf:justify-end cf:gap-2 cf:text-sm cf:text-muted-foreground", children: [
      /* @__PURE__ */ e.jsx("span", { children: w(t("%d submissions"), a.total) }),
      /* @__PURE__ */ e.jsxs(s.Select, { value: String(r.perPage), onValueChange: (n) => I({}, { perPage: Number(n) }), children: [
        /* @__PURE__ */ e.jsx(s.SelectTrigger, { className: "cf:w-32", "aria-label": t("Rows per page"), children: /* @__PURE__ */ e.jsx(s.SelectValue, {}) }),
        /* @__PURE__ */ e.jsx(s.SelectContent, { children: B.map((n) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: String(n), children: w(t("%d per page"), n) }, n)) })
      ] }),
      /* @__PURE__ */ e.jsx("span", { children: w(t("Page %1$d of %2$d"), r.page, X) }),
      /* @__PURE__ */ e.jsx(
        s.Button,
        {
          variant: "outline",
          size: "icon",
          className: "cf:size-8",
          "aria-label": t("Previous page"),
          disabled: r.page <= 1,
          onClick: () => I({}, { page: r.page - 1 }),
          children: /* @__PURE__ */ e.jsx(Ne, {})
        }
      ),
      /* @__PURE__ */ e.jsx(
        s.Button,
        {
          variant: "outline",
          size: "icon",
          className: "cf:size-8",
          "aria-label": t("Next page"),
          disabled: r.page >= X,
          onClick: () => I({}, { page: r.page + 1 }),
          children: /* @__PURE__ */ e.jsx(Te, {})
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(Ee, { api: c, open: O, onOpenChange: N, filters: b, ids: u, formTitle: M }),
    /* @__PURE__ */ e.jsx(Be, { open: F, count: u.length, onOpenChange: A, onConfirm: () => {
      A(!1), k("permanent");
    } })
  ] });
}
function $e({ filters: l, labels: c, onChange: o }) {
  const d = [l.from, l.to, l.isRead, l.isStarred, l.fieldKey].filter((a) => a !== void 0).length, r = (a) => a === void 0 ? "any" : a ? "yes" : "no", p = (a) => a === "any" ? void 0 : a === "yes";
  return /* @__PURE__ */ e.jsxs(s.Popover, { children: [
    /* @__PURE__ */ e.jsx(s.PopoverTrigger, { asChild: !0, children: /* @__PURE__ */ e.jsxs(s.Button, { variant: "outline", children: [
      /* @__PURE__ */ e.jsx(ke, {}),
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
          /* @__PURE__ */ e.jsxs(s.Select, { value: r(l.isRead), onValueChange: (a) => o({ isRead: p(a) }), children: [
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
          /* @__PURE__ */ e.jsxs(s.Select, { value: r(l.isStarred), onValueChange: (a) => o({ isStarred: p(a) }), children: [
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
              /* @__PURE__ */ e.jsx(s.SelectContent, { children: ve.map((a) => /* @__PURE__ */ e.jsx(s.SelectItem, { value: a, children: be(a) }, a)) })
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
  const [r, p] = i.useState("");
  return i.useEffect(() => p(""), [l]), /* @__PURE__ */ e.jsx(s.Dialog, { open: l, onOpenChange: o, children: /* @__PURE__ */ e.jsxs(s.DialogContent, { children: [
    /* @__PURE__ */ e.jsxs(s.DialogHeader, { children: [
      /* @__PURE__ */ e.jsx(s.DialogTitle, { children: w(t("Delete %d submissions permanently?"), c) }),
      /* @__PURE__ */ e.jsx(s.DialogDescription, { children: t("Their answers, notes and email history are erased. This cannot be undone. Type DELETE to confirm.") })
    ] }),
    /* @__PURE__ */ e.jsx(s.Input, { "aria-label": t("Type DELETE to confirm"), value: r, onChange: (a) => p(a.target.value) }),
    /* @__PURE__ */ e.jsxs(s.DialogFooter, { children: [
      /* @__PURE__ */ e.jsx(s.Button, { variant: "outline", onClick: () => o(!1), children: t("Cancel") }),
      /* @__PURE__ */ e.jsx(s.Button, { variant: "destructive", disabled: r !== "DELETE", onClick: d, children: t("Delete permanently") })
    ] })
  ] }) });
}
export {
  He as default
};
