import { _ as c, s as g, A as $ } from "./urls-D9s6uq7k.js";
function _(t) {
  let e = t.replace(/\{\{[ \t\r\n]*(?:(?:answer|meta):)?([a-z][a-z0-9_]*)[^{}]*\}\}/g, "[$1]").replace(/\{\{[^{}]*\}\}/g, "");
  if (e = e.replace(/<[^>]*>/g, " "), typeof document < "u") {
    const s = document.createElement("textarea");
    s.innerHTML = e, e = s.value;
  }
  const i = [...e.replace(/\s+/g, " ").trim()];
  return i.length > 80 ? i.slice(0, 79).join("") + "…" : i.join("");
}
function j(t, e) {
  const i = !t.label.trim() || t.label === "New question" || t.label === c("New question") || t.label === _(t.messages[0] ?? "");
  return {
    ...t,
    messages: e,
    ...i ? { label: _(e[0] ?? "") || c("New question") } : {}
  };
}
function O(t, e) {
  const i = _(t.messages?.find((s) => s.trim()) ?? "") || (t.type === "redirect" ? c("Redirect to website") : c("Thank-you message"));
  return `${g(c("Ending %d"), e + 1)} · ${i}`;
}
function b(t) {
  const e = globalThis.crypto;
  if (e && typeof e.randomUUID == "function")
    return `${t}_${e.randomUUID().replace(/-/g, "")}`;
  const i = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `${t}_${i}`;
}
function S(t, e, i = []) {
  const s = t.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^[_0-9]+/, "").slice(0, 55) || "field";
  let n = s, a = 2;
  for (; i.includes(n) || e.some((l) => l.key === n); ) n = `${s}_${a++}`;
  return n;
}
function F(t, e, i = []) {
  const s = c("New question"), n = {
    id: b("stp"),
    key: S(t, e, i),
    type: t,
    label: s,
    messages: [s],
    required: !1,
    logic: []
  };
  return ["single_choice", "multi_choice"].includes(t) && (n.options = [R("option_1", c("Option 1"))]), t === "phone" && (n.settings = { country: "ID" }), t === "slider" && (n.validation = { min: 0, max: 100, step: 1 }), t === "address" && (n.settings = { addressFields: ["street", "city", "postcode", "country"] }), t === "consent" && (n.required = !0, n.settings = { consentText: c("I agree to the privacy policy.") }), n;
}
function R(t, e = t) {
  return { id: b("opt"), value: t, label: e };
}
function D(t, e) {
  const i = t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9_]+/g, "_").replace(/^[^a-z]+/, "").replace(/_+$/, "").slice(0, 55) || "option";
  let s = i, n = 2;
  for (; e.includes(s); ) s = `${i}_${n++}`;
  return s;
}
function T(t = {}) {
  const e = b("end");
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
      endings: [{ id: e, type: "message", messages: [c("Thank you!")] }]
    },
    settings: {
      completion: { defaultEndingId: e },
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
function z(t, e, i = []) {
  const s = structuredClone(t);
  return s.id = b("stp"), s.key = S(t.key, e, i), s.options && (s.options = s.options.map((n) => ({ ...n, id: b("opt") }))), s.logic && (s.logic = s.logic.map((n) => ({
    ...n,
    then: "to" in n.then && n.then.to === t.id ? { ...n.then, to: s.id } : n.then
  }))), s;
}
function N(t, e) {
  if (!t) return [];
  const i = [], s = (h, r) => JSON.stringify(h) === JSON.stringify(r), n = (h) => h.label || h.key;
  t.title !== e.title && i.push(g(c("Form name: “%1$s” → “%2$s”"), t.title, e.title));
  const a = t.schema.steps, l = e.schema.steps;
  for (const h of l) {
    const r = a.find((u) => u.id === h.id);
    r ? s(r, h) || i.push(g(c("Edited field: %s"), n(h))) : i.push(g(c("Added field: %s"), n(h)));
  }
  for (const h of a)
    l.some((r) => r.id === h.id) || i.push(g(c("Removed field: %s"), n(h)));
  const o = (h, r) => h.filter((u) => r.some((E) => E.id === u.id)).map((u) => u.id);
  s(o(a, l), o(l, a)) || i.push(c("Changed the order of fields")), e.schema.endings.forEach((h, r) => {
    const u = t.schema.endings.find((E) => E.id === h.id);
    u ? s(u, h) || i.push(g(c("Edited ending: %s"), O(h, r))) : i.push(g(c("Added ending: %s"), O(h, r)));
  }), t.schema.endings.forEach((h, r) => {
    e.schema.endings.some((u) => u.id === h.id) || i.push(g(c("Removed ending: %s"), O(h, r)));
  });
  const d = [
    ["bot", c("Assistant name and avatar")],
    ["variables", c("Scoring variables")],
    ["outcomes", c("Outcome endings")],
    ["experiments", c("A/B test")]
  ];
  for (const [h, r] of d) s(t.schema[h], e.schema[h]) || i.push(g(c("Changed: %s"), r));
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
    s(t.settings[h], e.settings[h]) || i.push(g(c("Settings changed: %s"), r));
  return i;
}
function y(t) {
  return JSON.stringify({ title: t.title, schema: t.schema, settings: t.settings });
}
function p(t, e, i = "answer") {
  return !t || typeof t != "object" ? !1 : "all" in t ? t.all.some((s) => p(s, e, i)) : "any" in t ? t.any.some((s) => p(s, e, i)) : (t.source ?? "answer") === i && t.field === e;
}
function A(t, e, i) {
  return "to" in t.then && t.then.action !== "end" && t.then.to === e ? !1 : !p(t.if, i);
}
function C(t, e, i) {
  const s = {
    ...t,
    steps: t.steps.filter((n) => n.id !== e).map((n) => ({
      ...n,
      logic: n.logic?.filter((a) => A(a, e, i)),
      options: n.options?.map((a) => ({
        ...a,
        logic: a.logic?.filter((l) => A(l, e, i))
      }))
    })),
    groups: (t.groups ?? []).map((n) => ({ ...n, stepIds: n.stepIds.filter((a) => a !== e) }))
  };
  return t.outcomes && (s.outcomes = t.outcomes.filter((n) => !p(n.if, i))), t.flowPositions && (s.flowPositions = t.flowPositions.filter((n) => n.id !== e)), t.experiments && (s.experiments = t.experiments.map((n) => ({
    ...n,
    variants: n.variants.map((a) => {
      const l = { ...a };
      (!l.stepOrder || l.stepOrder.includes(e)) && delete l.stepOrder;
      const o = a.copy?.filter((d) => d.stepId !== e);
      return o && o.length ? l.copy = o : delete l.copy, l;
    })
  }))), s;
}
function P(t, e) {
  const i = t.schema.endings.filter((o) => o.id !== e), s = i[0]?.id, n = { ...t.settings };
  n.completion?.defaultEndingId === e && (s ? n.completion = { ...n.completion, defaultEndingId: s } : delete n.completion);
  const a = (o) => !(o.then.action === "end" && o.then.to === e), l = {
    ...t.schema,
    endings: i,
    steps: t.schema.steps.map((o) => ({
      ...o,
      logic: o.logic?.filter(a),
      options: o.options?.map((d) => ({ ...d, logic: d.logic?.filter(a) }))
    }))
  };
  return t.schema.outcomes && (l.outcomes = t.schema.outcomes.filter((o) => o.endingId !== e)), { ...t, schema: l, settings: n };
}
function m(t, e) {
  return "all" in t ? { all: t.all.map((i) => m(i, e)) } : "any" in t ? { any: t.any.map((i) => m(i, e)) } : e(t);
}
function k(t, e, i) {
  const s = (a) => a?.map(e).filter((l) => l !== null), n = {
    ...t,
    steps: t.steps.map((a) => ({
      ...a,
      logic: s(a.logic),
      options: a.options?.map((l) => ({ ...l, logic: s(l.logic) }))
    }))
  };
  return t.outcomes && (n.outcomes = t.outcomes.flatMap((a) => {
    const l = i(a.if);
    return l ? [{ ...a, if: l }] : [];
  })), n;
}
function v(t, e) {
  for (const i of ["admin", "autoresponders"]) {
    const s = t.notifications?.[i];
    s && (t.notifications[i] = s.map(e));
  }
}
function w(t, e, i) {
  return typeof t == "string" ? t.replace(/\{\{([ \t\r\n]*)(answer:)?([a-z][a-z0-9_]*)(?=[ \t\r\n]*(?:\|[^{}]*)?\}\})/g, (s, n, a = "", l) => l === e ? `{{${n}${a}${i}` : s) : Array.isArray(t) ? t.map((s) => w(s, e, i)) : t && typeof t == "object" ? Object.fromEntries(Object.entries(t).map(([s, n]) => [s, w(n, e, i)])) : t;
}
function x(t, e, i, s) {
  const n = new RegExp(`(?<![A-Za-z0-9_.])${e}\\.${i}(?![a-z0-9_])`, "g");
  return {
    ...t,
    steps: t.steps.map(
      (a) => a.type === "calculated" && a.settings?.expression ? { ...a, settings: { ...a.settings, expression: a.settings.expression.replace(n, `${e}.${s}`) } } : a
    )
  };
}
function L(t, e) {
  const i = t.schema.steps.find((o) => o.id === e)?.key ?? "", s = structuredClone(t.settings), n = s;
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
  return l?.emailField === i && (delete l.emailField, l.enabled = !1), { ...t, schema: C(t.schema, e, i), settings: s };
}
function M(t, e, i) {
  const s = t.schema.steps.find((f) => f.id === e)?.key;
  if (!s || s === i) return t;
  const n = (f) => (f.source ?? "answer") === "answer" && f.field === s ? { ...f, field: i } : f;
  let a = k(
    { ...t.schema, steps: t.schema.steps.map((f) => f.id === e ? { ...f, key: i } : f) },
    (f) => ({ ...f, if: m(f.if, n) }),
    (f) => m(f, n)
  );
  a = x(a, "answer", s, i);
  const l = structuredClone(t.settings), o = l;
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
  return d?.emailField === s && (d.emailField = i), { ...t, schema: w(a, s, i), settings: w(l, s, i) };
}
function U(t, e, i, s) {
  const n = t.schema.steps.find((r) => r.id === e), a = n?.options?.find((r) => r.id === i)?.value;
  if (!n || a === void 0 || a === s) return t;
  const l = (r) => r === a ? s : Array.isArray(r) ? r.map(l) : r, o = (r) => (r.source ?? "answer") === "answer" && r.field === n.key && "value" in r ? { ...r, value: l(r.value) } : r, d = k(
    {
      ...t.schema,
      steps: t.schema.steps.map(
        (r) => r.id === e ? { ...r, options: r.options?.map((u) => u.id === i ? { ...u, value: s } : u) } : r
      )
    },
    (r) => ({ ...r, if: m(r.if, o) }),
    (r) => m(r, o)
  ), f = structuredClone(t.settings);
  return v(
    f,
    (r) => r.conditions ? { ...r, conditions: m(r.conditions, o) } : r
  ), { ...t, schema: d, settings: f };
}
function V(t, e, i) {
  if (e === i) return t;
  const s = (o) => o.source === "variable" && o.field === e ? { ...o, field: i } : o;
  let n = k(
    { ...t.schema, variables: t.schema.variables?.map((o) => o.key === e ? { ...o, key: i } : o) },
    (o) => ({
      ...o,
      if: m(o.if, s),
      then: o.then.action === "set_variable" && o.then.key === e ? { ...o.then, key: i } : o.then
    }),
    (o) => m(o, s)
  );
  n = x(n, "variable", e, i);
  const a = structuredClone(t.settings);
  return v(
    a,
    (o) => o.conditions ? { ...o, conditions: m(o.conditions, s) } : o
  ), { ...t, schema: n, settings: a };
}
function K(t, e) {
  const i = k(
    { ...t.schema, variables: (t.schema.variables ?? []).filter((a) => a.key !== e) },
    (a) => p(a.if, e, "variable") || a.then.action === "set_variable" && a.then.key === e ? null : a,
    (a) => p(a, e, "variable") ? null : a
  ), s = structuredClone(t.settings);
  return v(s, (a) => {
    if (!p(a.conditions, e, "variable")) return a;
    const l = { ...a, enabled: !1 };
    return delete l.conditions, l;
  }), { ...t, schema: i, settings: s };
}
class J {
  constructor(e, i) {
    this.api = e, this.listeners = /* @__PURE__ */ new Set(), this.inflight = null, this.generation = 0, this.seenKeys = /* @__PURE__ */ new Set(), this.seenOptions = /* @__PURE__ */ new Map(), this.publishing = null, this.lastEditAt = 0, this.subscribe = (s) => (this.listeners.add(s), () => {
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
  emit(e) {
    this.state = { ...this.state, ...e };
    for (const i of this.listeners) i();
  }
  edit(e) {
    const i = Date.now(), s = this.lastEditAt > 0 && i - this.lastEditAt < 700;
    this.lastEditAt = i, this.generation++;
    const n = e(structuredClone(this.state.form));
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
  reservedOptionValues(e) {
    return [...this.seenOptions.get(e) ?? []];
  }
  remember(e) {
    e.schema.steps.forEach((i) => {
      this.seenKeys.add(i.key);
      const s = this.seenOptions.get(i.id) ?? /* @__PURE__ */ new Set();
      i.options?.forEach((n) => s.add(n.value)), this.seenOptions.set(i.id, s);
    });
  }
  undo() {
    const e = this.state.history.at(-1);
    e && (this.generation++, this.lastEditAt = 0, this.emit({
      form: {
        ...this.state.form,
        title: e.title,
        schema: e.schema,
        settings: e.settings
      },
      history: this.state.history.slice(0, -1),
      future: [this.state.form, ...this.state.future],
      error: "",
      issues: []
    }));
  }
  redo() {
    const e = this.state.future[0];
    e && (this.generation++, this.lastEditAt = 0, this.emit({
      form: { ...this.state.form, title: e.title, schema: e.schema, settings: e.settings },
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
    const e = structuredClone(this.state.form), i = this.generation;
    this.emit({ saving: !0, error: "" }), this.inflight = this.api.request(
      e.id ? `admin/forms/${e.id}` : "admin/forms",
      e.id ? "PUT" : "POST",
      {
        title: e.title,
        schema: e.schema,
        settings: e.settings,
        ...e.id ? { draftRevision: e.draftRevision } : {}
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
    const e = this.state.form, i = this.generation;
    this.emit({ saving: !0, error: "" });
    try {
      this.inflight = this.api.request(`admin/forms/${e.id}/publish`, "POST", {
        draftRevision: e.draftRevision
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
  fail(e, i) {
    const s = e instanceof $ ? e.code : "", n = s === "cff_form_locked", a = e instanceof $ ? e.data.errors : void 0, l = Array.isArray(a) ? a.filter((o) => !!o && typeof o == "object" && typeof o.message == "string") : [];
    this.emit({
      conflict: e instanceof $ && s === "cff_revision_conflict" ? e : null,
      locked: n,
      issues: l,
      error: n ? c(
        "This form is locked by another admin who is editing it. Your local edits are kept; saving resumes once their editing lock clears."
      ) : e instanceof Error ? e.message : i
    });
  }
  async reload() {
    this.inflight && await this.inflight.catch(() => {
    });
    const e = await this.api.request(`admin/forms/${this.state.form.id}`);
    this.generation++, this.lastEditAt = 0, this.emit({
      form: e,
      saved: y(e),
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
    const e = await this.api.request(`admin/forms/${this.state.form.id}`);
    this.generation++, this.lastEditAt = 0, this.emit({
      form: {
        ...this.state.form,
        draftRevision: e.draftRevision,
        version: e.version,
        status: e.status
      },
      saved: y(e),
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
  O as e,
  z as f,
  U as g,
  M as h,
  F as i,
  L as j,
  R as m,
  N as p,
  P as r,
  b as u,
  j as w
};
