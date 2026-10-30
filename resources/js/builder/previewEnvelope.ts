import type { AdminConfig, FormDTO } from './api';
import type { PublicSchemaEnvelope } from '../shared/contracts';

/** The visitor runtime's module URL, for previews. */
export function previewRuntimeUrl(config: Pick<AdminConfig, 'pluginUrl' | 'runtimeUrl'>): string {
  return config.runtimeUrl || `${config.pluginUrl}build/runtime/runtime.js`;
}

export function publicDraft(form: FormDTO, config: AdminConfig): PublicSchemaEnvelope {
  const session = form.settings.sessions ?? {};
  return {
    form: {
      id: form.id || 1,
      title: form.title,
      slug: form.slug,
      version: form.version,
      schema: form.schema,
      appearance: form.settings.appearance ?? config.defaults?.appearance ?? {},
      phrases: form.settings.phrases ?? {},
      session: {
        savePartial: session.savePartial ?? true,
        resumeEnabled: session.resumeEnabled ?? true,
        resumePrompt: session.resumePrompt ?? true,
        resumeDays: session.resumeDays ?? 30,
        storageNotice: session.storageNotice ?? false,
      },
      completion: { review: form.settings.completion?.review ?? 'off' },
      language: form.settings.language ?? 'site',
    },
    features: { ...config.features, engagement: false },
  };
}
