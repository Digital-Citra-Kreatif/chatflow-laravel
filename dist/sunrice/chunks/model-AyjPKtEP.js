import { _ as l, s as m, A as k } from "./urls-B0_osvz3.js";
function O(t) {
  let e = t.replace(/<[^>]*>/g, " ");
  if (typeof document < "u") {
    const s = document.createElement("textarea");
    s.innerHTML = e, e = s.value;
  }
  const i = [...e.replace(/\s+/g, " ").trim()];
  return i.length > 80 ? i.slice(0, 79).join("") + "…" : i.join("");
}
function j(t, e) {
  const i = !t.label.trim() || t.label === "New question" || t.label === l("New question") || t.label === O(t.messages[0] ?? "");
  return {
    ...t,
    messages: e,
    ...i ? { label: O(e[0] ?? "") || l("New question") } : {}
  };
}
function E(t, e) {
  const i = O(t.messages?.find((s) => s.trim()) ?? "") || (t.type === "redirect" ? l("Redirect to website") : l("Thank-you message"));
  return `${m(l("Ending %d"), e + 1)} · ${i}`;
}
function y(t) {
  const e = globalThis.crypto;
  if (e && typeof e.randomUUID == "function")
    return `${t}_${e.randomUUID().replace(/-/g, "")}`;
  const i = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return `${t}_${i}`;
}
function _(t, e, i = []) {
  const s = t.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^[_0-9]+/, "").slice(0, 55) || "field";
  let n = s, o = 2;
  for (; i.includes(n) || e.some((r) => r.key === n); ) n = `${s}_${o++}`;
  return n;
}
function x(t, e, i = []) {
  const s = l("New question"), n = {
    id: y("stp"),
    key: _(t, e, i),
    type: t,
    label: s,
    messages: [s],
    required: !1,
    logic: []
  };
  return ["single_choice", "multi_choice"].includes(t) && (n.options = [F("option_1", l("Option 1"))]), t === "phone" && (n.settings = { country: "ID" }), t === "slider" && (n.validation = { min: 0, max: 100, step: 1 }), t === "address" && (n.settings = { addressFields: ["street", "city", "postcode", "country"] }), t === "consent" && (n.required = !0, n.settings = { consentText: l("I agree to the privacy policy.") }), n;
}
function F(t, e = t) {
  return { id: y("opt"), value: t, label: e };
}
function D(t, e) {
  const i = t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9_]+/g, "_").replace(/^[^a-z]+/, "").replace(/_+$/, "").slice(0, 55) || "option";
  let s = i, n = 2;
  for (; e.includes(s); ) s = `${i}_${n++}`;
  return s;
}
function T(t = {}) {
  const e = y("end");
  return {
    id: 0,
    title: l("Untitled form"),
    slug: "",
    status: "draft",
    version: 0,
    draftRevision: 0,
    schema: {
      schemaVersion: 1,
      bot: { name: "ChatFlow", typingSpeed: "normal" },
      steps: [x("statement", [])],
      endings: [{ id: e, type: "message", messages: [l("Thank you!")] }]
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
function N(t, e, i = []) {
  const s = structuredClone(t);
  return s.id = y("stp"), s.key = _(t.key, e, i), s.options && (s.options = s.options.map((n) => ({ ...n, id: y("opt") }))), s.logic && (s.logic = s.logic.map((n) => ({
    ...n,
    then: "to" in n.then && n.then.to === t.id ? { ...n.then, to: s.id } : n.then
  }))), s;
}
function P(t, e) {
  if (!t) return [];
  const i = [], s = (h, a) => JSON.stringify(h) === JSON.stringify(a), n = (h) => h.label || h.key;
  t.title !== e.title && i.push(m(l("Form name: “%1$s” → “%2$s”"), t.title, e.title));
  const o = t.schema.steps, r = e.schema.steps;
  for (const h of r) {
    const a = o.find((u) => u.id === h.id);
    a ? s(a, h) || i.push(m(l("Edited field: %s"), n(h))) : i.push(m(l("Added field: %s"), n(h)));
  }
  for (const h of o)
    r.some((a) => a.id === h.id) || i.push(m(l("Removed field: %s"), n(h)));
  const f = (h, a) => h.filter((u) => a.some((w) => w.id === u.id)).map((u) => u.id);
  s(f(o, r), f(r, o)) || i.push(l("Changed the order of fields")), e.schema.endings.forEach((h, a) => {
    const u = t.schema.endings.find((w) => w.id === h.id);
    u ? s(u, h) || i.push(m(l("Edited ending: %s"), E(h, a))) : i.push(m(l("Added ending: %s"), E(h, a)));
  }), t.schema.endings.forEach((h, a) => {
    e.schema.endings.some((u) => u.id === h.id) || i.push(m(l("Removed ending: %s"), E(h, a)));
  });
  const d = [
    ["bot", l("Assistant name and avatar")],
    ["variables", l("Scoring variables")],
    ["outcomes", l("Outcome endings")],
    ["experiments", l("A/B test")]
  ];
  for (const [h, a] of d) s(t.schema[h], e.schema[h]) || i.push(m(l("Changed: %s"), a));
  const c = [
    ["display", l("Display")],
    ["appearance", l("Appearance")],
    ["phrases", l("Wording")],
    ["completion", l("Completion")],
    ["sessions", l("Saving and resume")],
    ["limits", l("Limits")],
    ["privacy", l("Privacy")],
    ["spam", l("Spam protection")],
    ["notifications", l("Notifications")],
    ["integrations", l("Integrations")]
  ];
  for (const [h, a] of c)
    s(t.settings[h], e.settings[h]) || i.push(m(l("Settings changed: %s"), a));
  return i;
}
function g(t) {
  return JSON.stringify({ title: t.title, schema: t.schema, settings: t.settings });
}
function b(t, e, i = "answer") {
  return !t || typeof t != "object" ? !1 : "all" in t ? t.all.some((s) => b(s, e, i)) : "any" in t ? t.any.some((s) => b(s, e, i)) : (t.source ?? "answer") === i && t.field === e;
}
function A(t, e, i) {
  return "to" in t.then && t.then.action !== "end" && t.then.to === e ? !1 : !b(t.if, i);
}
function R(t, e, i) {
  const s = {
    ...t,
    steps: t.steps.filter((n) => n.id !== e).map((n) => ({
      ...n,
      logic: n.logic?.filter((o) => A(o, e, i)),
      options: n.options?.map((o) => ({
        ...o,
        logic: o.logic?.filter((r) => A(r, e, i))
      }))
    })),
    groups: (t.groups ?? []).map((n) => ({ ...n, stepIds: n.stepIds.filter((o) => o !== e) }))
  };
  return t.outcomes && (s.outcomes = t.outcomes.filter((n) => !b(n.if, i))), t.flowPositions && (s.flowPositions = t.flowPositions.filter((n) => n.id !== e)), t.experiments && (s.experiments = t.experiments.map((n) => ({
    ...n,
    variants: n.variants.map((o) => {
      const r = { ...o };
      (!r.stepOrder || r.stepOrder.includes(e)) && delete r.stepOrder;
      const f = o.copy?.filter((d) => d.stepId !== e);
      return f && f.length ? r.copy = f : delete r.copy, r;
    })
  }))), s;
}
function z(t, e) {
  const i = t.schema.endings.filter((f) => f.id !== e), s = i[0]?.id, n = { ...t.settings };
  n.completion?.defaultEndingId === e && (s ? n.completion = { ...n.completion, defaultEndingId: s } : delete n.completion);
  const o = (f) => !(f.then.action === "end" && f.then.to === e), r = {
    ...t.schema,
    endings: i,
    steps: t.schema.steps.map((f) => ({
      ...f,
      logic: f.logic?.filter(o),
      options: f.options?.map((d) => ({ ...d, logic: d.logic?.filter(o) }))
    }))
  };
  return t.schema.outcomes && (r.outcomes = t.schema.outcomes.filter((f) => f.endingId !== e)), { ...t, schema: r, settings: n };
}
function p(t, e) {
  return "all" in t ? { all: t.all.map((i) => p(i, e)) } : "any" in t ? { any: t.any.map((i) => p(i, e)) } : e(t);
}
function S(t, e, i) {
  const s = (o) => o?.map(e).filter((r) => r !== null), n = {
    ...t,
    steps: t.steps.map((o) => ({
      ...o,
      logic: s(o.logic),
      options: o.options?.map((r) => ({ ...r, logic: s(r.logic) }))
    }))
  };
  return t.outcomes && (n.outcomes = t.outcomes.flatMap((o) => {
    const r = i(o.if);
    return r ? [{ ...o, if: r }] : [];
  })), n;
}
function $(t, e) {
  for (const i of ["admin", "autoresponders"]) {
    const s = t.notifications?.[i];
    s && (t.notifications[i] = s.map(e));
  }
}
function v(t, e, i) {
  return typeof t == "string" ? t.replace(/\{\{([ \t\r\n]*)(answer:)?([a-z][a-z0-9_]*)(?=[ \t\r\n]*(?:\|[^{}]*)?\}\})/g, (s, n, o = "", r) => r === e ? `{{${n}${o}${i}` : s) : Array.isArray(t) ? t.map((s) => v(s, e, i)) : t && typeof t == "object" ? Object.fromEntries(Object.entries(t).map(([s, n]) => [s, v(n, e, i)])) : t;
}
function C(t, e, i, s) {
  const n = new RegExp(`(?<![A-Za-z0-9_.])${e}\\.${i}(?![a-z0-9_])`, "g");
  return {
    ...t,
    steps: t.steps.map(
      (o) => o.type === "calculated" && o.settings?.expression ? { ...o, settings: { ...o.settings, expression: o.settings.expression.replace(n, `${e}.${s}`) } } : o
    )
  };
}
function L(t, e) {
  const i = t.schema.steps.find((f) => f.id === e)?.key ?? "", s = structuredClone(t.settings), n = s;
  $(n, (f) => {
    const d = { ...f };
    return b(d.conditions, i) && (delete d.conditions, d.enabled = !1), d.emailField === i && (delete d.emailField, d.enabled = !1), d;
  });
  const o = n.integrations?.connectors;
  o && (n.integrations.connectors = o.map((f) => {
    const d = { ...f };
    for (const c of ["emailField", "phoneField", "consentField"])
      d[c] === i && (delete d[c], d.enabled = !1);
    return d.fields && (d.fields = Object.fromEntries(Object.entries(d.fields).filter(([, c]) => c !== i))), d;
  }));
  const r = n.sessions?.magicLinks;
  return r?.emailField === i && (delete r.emailField, r.enabled = !1), { ...t, schema: R(t.schema, e, i), settings: s };
}
function M(t, e, i) {
  const s = t.schema.steps.find((c) => c.id === e)?.key;
  if (!s || s === i) return t;
  const n = (c) => (c.source ?? "answer") === "answer" && c.field === s ? { ...c, field: i } : c;
  let o = S(
    { ...t.schema, steps: t.schema.steps.map((c) => c.id === e ? { ...c, key: i } : c) },
    (c) => ({ ...c, if: p(c.if, n) }),
    (c) => p(c, n)
  );
  o = C(o, "answer", s, i);
  const r = structuredClone(t.settings), f = r;
  $(f, (c) => ({
    ...c,
    ...c.conditions ? { conditions: p(c.conditions, n) } : {},
    ...c.emailField === s ? { emailField: i } : {}
  }));
  for (const c of f.integrations?.connectors ?? []) {
    for (const h of ["emailField", "phoneField", "consentField"]) c[h] === s && (c[h] = i);
    c.fields && (c.fields = Object.fromEntries(Object.entries(c.fields).map(([h, a]) => [h, a === s ? i : a])));
  }
  const d = f.sessions?.magicLinks;
  return d?.emailField === s && (d.emailField = i), { ...t, schema: v(o, s, i), settings: v(r, s, i) };
}
function U(t, e, i, s) {
  const n = t.schema.steps.find((a) => a.id === e), o = n?.options?.find((a) => a.id === i)?.value;
  if (!n || o === void 0 || o === s) return t;
  const r = (a) => a === o ? s : Array.isArray(a) ? a.map(r) : a, f = (a) => (a.source ?? "answer") === "answer" && a.field === n.key && "value" in a ? { ...a, value: r(a.value) } : a, d = S(
    {
      ...t.schema,
      steps: t.schema.steps.map(
        (a) => a.id === e ? { ...a, options: a.options?.map((u) => u.id === i ? { ...u, value: s } : u) } : a
      )
    },
    (a) => ({ ...a, if: p(a.if, f) }),
    (a) => p(a, f)
  ), c = structuredClone(t.settings);
  return $(
    c,
    (a) => a.conditions ? { ...a, conditions: p(a.conditions, f) } : a
  ), { ...t, schema: d, settings: c };
}
class K {
  constructor(e, i) {
    this.api = e, this.listeners = /* @__PURE__ */ new Set(), this.inflight = null, this.generation = 0, this.seenKeys = /* @__PURE__ */ new Set(), this.seenOptions = /* @__PURE__ */ new Map(), this.publishing = null, this.lastEditAt = 0, this.subscribe = (s) => (this.listeners.add(s), () => {
      this.listeners.delete(s);
    }), this.snapshot = () => this.state, this.remember(i), this.state = {
      form: i,
      saved: i.id ? g(i) : "",
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
    return g(this.state.form) !== this.state.saved;
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
        saved: g(s),
        locked: !1,
        issues: []
      }), this.state.form;
    } catch (s) {
      throw this.fail(s, l("Save failed.")), s;
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
        saved: g(s),
        locked: !1,
        issues: []
      }), s;
    } catch (s) {
      throw this.fail(s, l("Publish failed.")), s;
    } finally {
      this.inflight = null, this.emit({ saving: !1 });
    }
  }
  /** Only a draft-revision conflict pauses saving; an edit lock is transient and retryable. */
  fail(e, i) {
    const s = e instanceof k ? e.code : "", n = s === "cff_form_locked", o = e instanceof k ? e.data.errors : void 0, r = Array.isArray(o) ? o.filter((f) => !!f && typeof f == "object" && typeof f.message == "string") : [];
    this.emit({
      conflict: e instanceof k && s === "cff_revision_conflict" ? e : null,
      locked: n,
      issues: r,
      error: n ? l(
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
      saved: g(e),
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
      saved: g(e),
      conflict: null,
      error: "",
      issues: []
    });
  }
}
export {
  K as D,
  D as a,
  T as b,
  U as c,
  N as d,
  E as e,
  M as f,
  x as g,
  L as h,
  F as m,
  P as p,
  z as r,
  y as u,
  j as w
};
