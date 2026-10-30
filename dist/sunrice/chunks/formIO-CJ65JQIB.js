import { _ as o } from "./urls-B0_osvz3.js";
function i(s) {
  const e = structuredClone(s.settings);
  return e.integrations?.webhooks && (e.integrations.webhooks = e.integrations.webhooks.map((t) => ({
    ...t,
    secret: "",
    headers: {},
    enabled: !1
  }))), {
    format: "chatflow/form",
    version: 1,
    title: s.title,
    schema: structuredClone(s.schema),
    settings: e
  };
}
function a(s) {
  if (new TextEncoder().encode(s).length > 1048576)
    throw new Error(o("Form file exceeds 1 MiB."));
  const e = JSON.parse(s);
  if (!e || typeof e != "object" || !("format" in e) || e.format !== "chatflow/form" || !("version" in e) || e.version !== 1 || !("title" in e) || typeof e.title != "string" || !("schema" in e) || !e.schema || typeof e.schema != "object" || !("schemaVersion" in e.schema) || e.schema.schemaVersion !== 1 || !("steps" in e.schema) || !Array.isArray(e.schema.steps) || !("endings" in e.schema) || !Array.isArray(e.schema.endings) || !("settings" in e) || !e.settings || typeof e.settings != "object" || Array.isArray(e.settings))
    throw new Error(o("Invalid ChatFlow form file."));
  const t = e, n = structuredClone(t.settings);
  return Array.isArray(n.integrations?.webhooks) && (n.integrations.webhooks = n.integrations.webhooks.map((r) => ({
    ...r,
    secret: "",
    enabled: !1,
    headers: {}
  }))), { ...t, settings: n };
}
async function m(s, e) {
  const t = a(s);
  return e.request("admin/forms", "POST", {
    title: t.title,
    schema: t.schema,
    settings: t.settings
  });
}
function l(s) {
  const e = URL.createObjectURL(
    new Blob([JSON.stringify(i(s), null, 2)], { type: "application/json" })
  ), t = document.createElement("a");
  t.href = e, t.download = `chatflow-form-${s.id}.json`, document.body.appendChild(t), t.click(), t.remove(), setTimeout(() => URL.revokeObjectURL(e), 1e3);
}
export {
  l as d,
  m as i
};
