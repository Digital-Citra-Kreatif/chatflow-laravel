import { useEffect, useRef, useState } from 'react';
import { Button } from '@imajiner/admin-sdk/ui';
import { RotateCcw } from 'lucide-react';
import { previewRuntimeUrl, publicDraft } from '@chatflow/builder/previewEnvelope';
import type { AdminConfig, FormDTO } from '@/lib/api';
import { errorMessage } from '@/lib/api';
import { __ } from '@/lib/i18n';

type Handle = { unmount?: () => void; destroy?: () => void } | (() => void) | void;
interface Runtime {
  mountRuntime: (host: HTMLElement, options: Record<string, unknown>) => Handle;
}

function cleanup(handle: Handle) {
  if (typeof handle === 'function') handle();
  else if (handle?.unmount) handle.unmount();
  else handle?.destroy?.();
}

/**
 * The draft in the real visitor chat (ChatFlow's runtime module, in preview mode: nothing
 * is sent or saved). It starts over a moment after each edit; "Start over" restarts it.
 */
export function ChatPreview({ form, config, height = 560 }: { form: FormDTO; config: AdminConfig; height?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [restart, setRestart] = useState(0);
  const { flowPositions: _layout, ...schema } = form.schema;
  void _layout;
  const key = JSON.stringify({ title: form.title, schema, settings: form.settings });

  useEffect(() => {
    let handle: Handle;
    let current = true;
    const timer = window.setTimeout(async () => {
      try {
        const runtime = (await import(/* @vite-ignore */ previewRuntimeUrl(config))) as Runtime;
        if (!current || !host.current) return;
        host.current.replaceChildren();
        handle = runtime.mountRuntime(host.current, {
          form: publicDraft(form, config),
          preview: true,
          locale: config.locale,
          context: { now: new Date().toISOString(), ...(form.settings.completion?.defaultEndingId ? { defaultEndingId: form.settings.completion.defaultEndingId } : {}) },
        });
        setError('');
      } catch (failure) {
        if (current) setError(errorMessage(failure));
      }
    }, 500);
    return () => {
      current = false;
      window.clearTimeout(timer);
      cleanup(handle);
    };
  }, [key, restart, config]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="cf:flex cf:flex-col cf:gap-2">
      <div className="cf:flex cf:items-center cf:justify-between">
        <p className="cf:text-xs cf:text-muted-foreground">{__('Preview: answers are not sent or saved.')}</p>
        <Button variant="ghost" size="sm" onClick={() => setRestart((value) => value + 1)}><RotateCcw /> {__('Start over')}</Button>
      </div>
      {error && <p className="cf:text-sm cf:text-destructive" role="alert">{error}</p>}
      <div ref={host} data-testid="chat-preview" className="cf:overflow-auto cf:rounded-lg cf:border cf:bg-background" style={{ height }} />
    </div>
  );
}
