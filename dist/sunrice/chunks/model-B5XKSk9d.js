import { _ as c, s as g, A as O } from "./urls-Dom6XwDc.js";
function _(e) {
  let t = e.replace(/<[^>]*>/g, " ");
  if (typeof document < "u") {
    const s = document.createElement("textarea");
    s.innerHTML = t, t = s.value;
  }
  const i = [...t.replace(/\s+/g, " ").trim()];
  return i.length > 80 ? i.slice(0, 79).join("") + "…" : i.join("");
}
function j(e, t) {
  const i = !e.label.trim() || e.label === "New question" || e.label === c("New question") || e.label === _(e.messages[0] ?? "");
  return {
    ...e,
    messages: t,
    ...i ? { label: _(t[0] ?? "") || c("New question") } : {}
  };
}
function $(e, t) {
  const i = _(e.messages?.find((s) => s.trim()) ?? "") || (e.type === "redirect" ? c("Redirect to website") : c("Thank-you message"));
  return `${g(c("Ending %d"), t + 1)} · ${i}`;
}
function b(e) {
  const t = globalThis.crypto;
  if (t && typeof t.randomUUID == "function")
    return `${e}_${t.randomUUID().replace(/-/g, "")}`;
  const i = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `${e}_${i}`;
}
function S(e, t, i = []) {
  const s = e.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^[_0-9]+/, "").slice(0, 55) || "field";
  let n = s, a = 2;
  for (; i.includes(n) || t.some((l) => l.key === n); ) n = `${s}_${a++}`;
  return n;
}
function F(e, t, i = []) {
  const s = c("New question"), n = {
    id: b("stp"),
    key: S(e, t, i),
    type: e,
    label: s,
    messages: [s],
    required: !1,
    logic: []
  };
  return ["single_choice", "multi_choice"].includes(e) && (n.options = [R("option_1", c("Option 1"))]), e === "phone" && (n.settings = { country: "ID" }), e === "slider" && (n.validation = { min: 0, max: 100, step: 1 }), e === "address" && (n.settings = { addressFields: ["street", "city", "postcode", "country"] }), e === "consent" && (n.required = !0, n.settings = { consentText: c("I agree to the privacy policy.") }), n;
}
function R(e, t = e) {
  return { id: b("opt"), value: e, label: t };
}
function D(e, t) {
  const i = e.toLowerCase().normalize("NFKD").replace(/[^a-z0-9_]+/g, "_").replace(/^[^a-z]+/, "").replace(/_+$/, "").slice(0, 55) || "option";
  let s = i, n = 2;
  for (; t.includes(s); ) s = `${i}_${n++}`;
  return s;
}
function T(e = {}) {
  const t = b("end");
  return {
    id: 0,
    title: c("Untitled form"),
    slug: "",
    status: "draft",
    version: 0,
    draftRevision: 0,
    schema: {
      schemaVersion: 1,
      bot: { name: "ChatFlow", typingSpeed: "normal" },
      steps: [F("statement", [])],
      endings: [{ id: t, type: "message", messages: [c("Thank you!")] }]
    },
    settings: {
      completion: { defaultEndingId: t },
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
      appearance: { ...e.appearance?.theme === "dark" ? {} : { primary: "#2271b1" }, ...e.appearance, style: "messaging" }
    }
  };
}
function N(e, t, i = []) {
  const s = structuredClone(e);
  return s.id = b("stp"), s.key = S(e.key, t, i), s.options && (s.options = s.options.map((n) => ({ ...n, id: b("opt") }))), s.logic && (s.logic = s.logic.map((n) => ({
    ...n,
    then: "to" in n.then && n.then.to === e.id ? { ...n.then, to: s.id } : n.then
  }))), s;
}
function P(e, t) {
  if (!e) return [];
  const i = [], s = (h, r) => JSON.stringify(h) === JSON.stringify(r), n = (h) => h.label || h.key;
  e.title !== t.title && i.push(g(c("Form name: “%1$s” → “%2$s”"), e.title, t.title));
  const a = e.schema.steps, l = t.schema.steps;
  for (const h of l) {
    const r = a.find((u) => u.id === h.id);
    r ? s(r, h) || i.push(g(c("Edited field: %s"), n(h))) : i.push(g(c("Added field: %s"), n(h)));
  }
  for (const h of a)
    l.some((r) => r.id === h.id) || i.push(g(c("Removed field: %s"), n(h)));
  const o = (h, r) => h.filter((u) => r.some((E) => E.id === u.id)).map((u) => u.id);
  s(o(a, l), o(l, a)) || i.push(c("Changed the order of fields")), t.schema.endings.forEach((h, r) => {
    const u = e.schema.endings.find((E) => E.id === h.id);
    u ? s(u, h) || i.push(g(c("Edited ending: %s"), $(h, r))) : i.push(g(c("Added ending: %s"), $(h, r)));
  }), e.schema.endings.forEach((h, r) => {
    t.schema.endings.some((u) => u.id === h.id) || i.push(g(c("Removed ending: %s"), $(h, r)));
  });
  const d = [
    ["bot", c("Assistant name and avatar")],
    ["variables", c("Scoring variables")],
    ["outcomes", c("Outcome endings")],
    ["experiments", c("A/B test")]
  ];
  for (const [h, r] of d) s(e.schema[h], t.schema[h]) || i.push(g(c("Changed: %s"), r));
  const f = [
    ["display", c("Display")],
    ["appearance", c("Appearance")],
    ["phrases", c("Wording")],
    ["completion", c("Completion")],
    ["sessions", c("Saving and resume")],
    ["limits", c("Limits")],
    ["privacy", c("Privacy")],
    ["spam", c("Spam protection")],
    ["notifications", c("Notifications")],
    ["integrations", c("Integrations")]
  ];
  for (const [h, r] of f)
    s(e.settings[h], t.settings[h]) || i.push(g(c("Settings changed: %s"), r));
  return i;
}
function y(e) {
  return JSON.stringify({ title: e.title, schema: e.schema, settings: e.settings });
}
function p(e, t, i = "answer") {
  return !e || typeof e != "object" ? !1 : "all" in e ? e.all.some((s) => p(s, t, i)) : "any" in e ? e.any.some((s) => p(s, t, i)) : (e.source ?? "answer") === i && e.field === t;
}
function A(e, t, i) {
  return "to" in e.then && e.then.action !== "end" && e.then.to === t ? !1 : !p(e.if, i);
}
function C(e, t, i) {
  const s = {
    ...e,
    steps: e.steps.filter((n) => n.id !== t).map((n) => ({
      ...n,
      logic: n.logic?.filter((a) => A(a, t, i)),
      options: n.options?.map((a) => ({
        ...a,
        logic: a.logic?.filter((l) => A(l, t, i))
      }))
    })),
    groups: (e.groups ?? []).map((n) => ({ ...n, stepIds: n.stepIds.filter((a) => a !== t) }))
  };
  return e.outcomes && (s.outcomes = e.outcomes.filter((n) => !p(n.if, i))), e.flowPositions && (s.flowPositions = e.flowPositions.filter((n) => n.id !== t)), e.experiments && (s.experiments = e.experiments.map((n) => ({
    ...n,
    variants: n.variants.map((a) => {
      const l = { ...a };
      (!l.stepOrder || l.stepOrder.includes(t)) && delete l.stepOrder;
      const o = a.copy?.filter((d) => d.stepId !== t);
      return o && o.length ? l.copy = o : delete l.copy, l;
    })
  }))), s;
}
function z(e, t) {
  const i = e.schema.endings.filter((o) => o.id !== t), s = i[0]?.id, n = { ...e.settings };
  n.completion?.defaultEndingId === t && (s ? n.completion = { ...n.completion, defaultEndingId: s } : delete n.completion);
  const a = (o) => !(o.then.action === "end" && o.then.to === t), l = {
    ...e.schema,
    endings: i,
    steps: e.schema.steps.map((o) => ({
      ...o,
      logic: o.logic?.filter(a),
      options: o.options?.map((d) => ({ ...d, logic: d.logic?.filter(a) }))
    }))
  };
  return e.schema.outcomes && (l.outcomes = e.schema.outcomes.filter((o) => o.endingId !== t)), { ...e, schema: l, settings: n };
}
function m(e, t) {
  return "all" in e ? { all: e.all.map((i) => m(i, t)) } : "any" in e ? { any: e.any.map((i) => m(i, t)) } : t(e);
}
function k(e, t, i) {
  const s = (a) => a?.map(t).filter((l) => l !== null), n = {
    ...e,
    steps: e.steps.map((a) => ({
      ...a,
      logic: s(a.logic),
      options: a.options?.map((l) => ({ ...l, logic: s(l.logic) }))
    }))
  };
  return e.outcomes && (n.outcomes = e.outcomes.flatMap((a) => {
    const l = i(a.if);
    return l ? [{ ...a, if: l }] : [];
  })), n;
}
function v(e, t) {
  for (const i of ["admin", "autoresponders"]) {
    const s = e.notifications?.[i];
    s && (e.notifications[i] = s.map(t));
  }
}
function w(e, t, i) {
  return typeof e == "string" ? e.replace(/\{\{([ \t\r\n]*)(answer:)?([a-z][a-z0-9_]*)(?=[ \t\r\n]*(?:\|[^{}]*)?\}\})/g, (s, n, a = "", l) => l === t ? `{{${n}${a}${i}` : s) : Array.isArray(e) ? e.map((s) => w(s, t, i)) : e && typeof e == "object" ? Object.fromEntries(Object.entries(e).map(([s, n]) => [s, w(n, t, i)])) : e;
}
function x(e, t, i, s) {
  const n = new RegExp(`(?<![A-Za-z0-9_.])${t}\\.${i}(?![a-z0-9_])`, "g");
  return {
    ...e,
    steps: e.steps.map(
      (a) => a.type === "calculated" && a.settings?.expression ? { ...a, settings: { ...a.settings, expression: a.settings.expression.replace(n, `${t}.${s}`) } } : a
    )
  };
}
function L(e, t) {
  const i = e.schema.steps.find((o) => o.id === t)?.key ?? "", s = structuredClone(e.settings), n = s;
  v(n, (o) => {
    const d = { ...o };
    return p(d.conditions, i) && (delete d.conditions, d.enabled = !1), d.emailField === i && (delete d.emailField, d.enabled = !1), d;
  });
  const a = n.integrations?.connectors;
  a && (n.integrations.connectors = a.map((o) => {
    const d = { ...o };
    for (const f of ["emailField", "phoneField", "consentField"])
      d[f] === i && (delete d[f], d.enabled = !1);
    return d.fields && (d.fields = Object.fromEntries(Object.entries(d.fields).filter(([, f]) => f !== i))), d;
  }));
  const l = n.sessions?.magicLinks;
  return l?.emailField === i && (delete l.emailField, l.enabled = !1), { ...e, schema: C(e.schema, t, i), settings: s };
}
function M(e, t, i) {
  const s = e.schema.steps.find((f) => f.id === t)?.key;
  if (!s || s === i) return e;
  const n = (f) => (f.source ?? "answer") === "answer" && f.field === s ? { ...f, field: i } : f;
  let a = k(
    { ...e.schema, steps: e.schema.steps.map((f) => f.id === t ? { ...f, key: i } : f) },
    (f) => ({ ...f, if: m(f.if, n) }),
    (f) => m(f, n)
  );
  a = x(a, "answer", s, i);
  const l = structuredClone(e.settings), o = l;
  v(o, (f) => ({
    ...f,
    ...f.conditions ? { conditions: m(f.conditions, n) } : {},
    ...f.emailField === s ? { emailField: i } : {}
  }));
  for (const f of o.integrations?.connectors ?? []) {
    for (const h of ["emailField", "phoneField", "consentField"]) f[h] === s && (f[h] = i);
    f.fields && (f.fields = Object.fromEntries(Object.entries(f.fields).map(([h, r]) => [h, r === s ? i : r])));
  }
  const d = o.sessions?.magicLinks;
  return d?.emailField === s && (d.emailField = i), { ...e, schema: w(a, s, i), settings: w(l, s, i) };
}
function U(e, t, i, s) {
  const n = e.schema.steps.find((r) => r.id === t), a = n?.options?.find((r) => r.id === i)?.value;
  if (!n || a === void 0 || a === s) return e;
  const l = (r) => r === a ? s : Array.isArray(r) ? r.map(l) : r, o = (r) => (r.source ?? "answer") === "answer" && r.field === n.key && "value" in r ? { ...r, value: l(r.value) } : r, d = k(
    {
      ...e.schema,
      steps: e.schema.steps.map(
        (r) => r.id === t ? { ...r, options: r.options?.map((u) => u.id === i ? { ...u, value: s } : u) } : r
      )
    },
    (r) => ({ ...r, if: m(r.if, o) }),
    (r) => m(r, o)
  ), f = structuredClone(e.settings);
  return v(
    f,
    (r) => r.conditions ? { ...r, conditions: m(r.conditions, o) } : r
  ), { ...e, schema: d, settings: f };
}
function V(e, t, i) {
  if (t === i) return e;
  const s = (o) => o.source === "variable" && o.field === t ? { ...o, field: i } : o;
  let n = k(
    { ...e.schema, variables: e.schema.variables?.map((o) => o.key === t ? { ...o, key: i } : o) },
    (o) => ({
      ...o,
      if: m(o.if, s),
      then: o.then.action === "set_variable" && o.then.key === t ? { ...o.then, key: i } : o.then
    }),
    (o) => m(o, s)
  );
  n = x(n, "variable", t, i);
  const a = structuredClone(e.settings);
  return v(
    a,
    (o) => o.conditions ? { ...o, conditions: m(o.conditions, s) } : o
  ), { ...e, schema: n, settings: a };
}
function K(e, t) {
  const i = k(
    { ...e.schema, variables: (e.schema.variables ?? []).filter((a) => a.key !== t) },
    (a) => p(a.if, t, "variable") || a.then.action === "set_variable" && a.then.key === t ? null : a,
    (a) => p(a, t, "variable") ? null : a
  ), s = structuredClone(e.settings);
  return v(s, (a) => {
    if (!p(a.conditions, t, "variable")) return a;
    const l = { ...a, enabled: !1 };
    return delete l.conditions, l;
  }), { ...e, schema: i, settings: s };
}
class J {
  constructor(t, i) {
    this.api = t, this.listeners = /* @__PURE__ */ new Set(), this.inflight = null, this.generation = 0, this.seenKeys = /* @__PURE__ */ new Set(), this.seenOptions = /* @__PURE__ */ new Map(), this.publishing = null, this.lastEditAt = 0, this.subscribe = (s) => (this.listeners.add(s), () => {
      this.listeners.delete(s);
    }), this.snapshot = () => this.state, this.remember(i), this.state = {
      form: i,
      saved: i.id ? y(i) : "",
      saving: !1,
      conflict: null,
      locked: !1,
      error: "",
      issues: [],
      history: [],
      future: []
    };
  }
  emit(t) {
    this.state = { ...this.state, ...t };
    for (const i of this.listeners) i();
  }
  edit(t) {
    const i = Date.now(), s = this.lastEditAt > 0 && i - this.lastEditAt < 700;
    this.lastEditAt = i, this.generation++;
    const n = t(structuredClone(this.state.form));
    this.remember(n), this.emit({
      form: n,
      // Coalesce a burst of keystrokes into one undo step, so Undo reverts the
      // field edit rather than the last character typed.
      history: s ? this.state.history : [...this.state.history.slice(-49), this.state.form],
      future: [],
      error: "",
      issues: []
    });
  }
  reservedKeys() {
    return [...this.seenKeys];
  }
  reservedOptionValues(t) {
    return [...this.seenOptions.get(t) ?? []];
  }
  remember(t) {
    t.schema.steps.forEach((i) => {
      this.seenKeys.add(i.key);
      const s = this.seenOptions.get(i.id) ?? /* @__PURE__ */ new Set();
      i.options?.forEach((n) => s.add(n.value)), this.seenOptions.set(i.id, s);
    });
  }
  undo() {
    const t = this.state.history.at(-1);
    t && (this.generation++, this.lastEditAt = 0, this.emit({
      form: {
        ...this.state.form,
        title: t.title,
        schema: t.schema,
        settings: t.settings
      },
      history: this.state.history.slice(0, -1),
      future: [this.state.form, ...this.state.future],
      error: "",
      issues: []
    }));
  }
  redo() {
    const t = this.state.future[0];
    t && (this.generation++, this.lastEditAt = 0, this.emit({
      form: { ...this.state.form, title: t.title, schema: t.schema, settings: t.settings },
      history: [...this.state.history, this.state.form],
      future: this.state.future.slice(1),
      error: "",
      issues: []
    }));
  }
  dirty() {
    return y(this.state.form) !== this.state.saved;
  }
  async save() {
    if (this.inflight)
      return await this.inflight, this.dirty() ? this.save() : this.state.form;
    if (this.state.conflict) throw this.state.conflict;
    if (!this.dirty()) return this.state.form;
    const t = structuredClone(this.state.form), i = this.generation;
    this.emit({ saving: !0, error: "" }), this.inflight = this.api.request(
      t.id ? `admin/forms/${t.id}` : "admin/forms",
      t.id ? "PUT" : "POST",
      {
        title: t.title,
        schema: t.schema,
        settings: t.settings,
        ...t.id ? { draftRevision: t.draftRevision } : {}
      }
    );
    try {
      const s = await this.inflight;
      return this.emit({
        form: i === this.generation ? s : {
          ...this.state.form,
          id: s.id,
          slug: s.slug,
          version: s.version,
          draftRevision: s.draftRevision,
          status: s.status
        },
        saved: y(s),
        locked: !1,
        issues: []
      }), this.state.form;
    } catch (s) {
      throw this.fail(s, c("Save failed.")), s;
    } finally {
      this.inflight = null, this.emit({ saving: !1 });
    }
  }
  async publish() {
    if (this.publishing) return this.publishing;
    this.publishing = this.publishOnce();
    try {
      return await this.publishing;
    } finally {
      this.publishing = null;
    }
  }
  async publishOnce() {
    await this.save(), this.dirty() && await this.save();
    const t = this.state.form, i = this.generation;
    this.emit({ saving: !0, error: "" });
    try {
      this.inflight = this.api.request(`admin/forms/${t.id}/publish`, "POST", {
        draftRevision: t.draftRevision
      });
      const s = await this.inflight;
      return this.emit({
        form: i === this.generation ? s : {
          ...this.state.form,
          slug: s.slug,
          version: s.version,
          status: s.status,
          draftRevision: s.draftRevision
        },
        saved: y(s),
        locked: !1,
        issues: []
      }), s;
    } catch (s) {
      throw this.fail(s, c("Publish failed.")), s;
    } finally {
      this.inflight = null, this.emit({ saving: !1 });
    }
  }
  /** Only a draft-revision conflict pauses saving; an edit lock is transient and retryable. */
  fail(t, i) {
    const s = t instanceof O ? t.code : "", n = s === "cff_form_locked", a = t instanceof O ? t.data.errors : void 0, l = Array.isArray(a) ? a.filter((o) => !!o && typeof o == "object" && typeof o.message == "string") : [];
    this.emit({
      conflict: t instanceof O && s === "cff_revision_conflict" ? t : null,
      locked: n,
      issues: l,
      error: n ? c(
        "This form is locked by another admin who is editing it. Your local edits are kept; saving resumes once their editing lock clears."
      ) : t instanceof Error ? t.message : i
    });
  }
  async reload() {
    this.inflight && await this.inflight.catch(() => {
    });
    const t = await this.api.request(`admin/forms/${this.state.form.id}`);
    this.generation++, this.lastEditAt = 0, this.emit({
      form: t,
      saved: y(t),
      conflict: null,
      locked: !1,
      error: "",
      issues: [],
      history: [],
      future: []
    });
  }
  async rebaseLocal() {
    this.inflight && await this.inflight.catch(() => {
    });
    const t = await this.api.request(`admin/forms/${this.state.form.id}`);
    this.generation++, this.lastEditAt = 0, this.emit({
      form: {
        ...this.state.form,
        draftRevision: t.draftRevision,
        version: t.version,
        status: t.status
      },
      saved: y(t),
      conflict: null,
      error: "",
      issues: []
    });
  }
}
export {
  J as D,
  D as a,
  T as b,
  V as c,
  K as d,
  $ as e,
  N as f,
  U as g,
  M as h,
  F as i,
  L as j,
  R as m,
  P as p,
  z as r,
  b as u,
  j as w
};
