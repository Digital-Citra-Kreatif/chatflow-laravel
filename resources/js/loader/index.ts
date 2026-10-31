/**
 * Loads the chat runtime. A page with an inline or full-page form needs it at once; a page
 * whose forms are all launchers or pop-ups shows a server-rendered button meanwhile, so the
 * runtime (the larger download) waits until the browser is idle or the visitor reaches for
 * the button. A click made before it arrives opens the chat once it has.
 */
type Host = HTMLElement & { dataset: DOMStringMap };

const script = document.getElementById('cff-runtime-js');
const runtimeUrl = script?.dataset.runtime;
let started = false;
let opening: string | null = null;

function load(): void {
  if (started || !runtimeUrl) return;
  started = true;
  void import(/* @vite-ignore */ runtimeUrl).then(() => {
    if (opening) (window as unknown as { ChatFlow?: { open(id: string): boolean } }).ChatFlow?.open(opening);
  });
}

const hosts = [...document.querySelectorAll<Host>('cff-chat')];
const deferrable = hosts.length > 0 && hosts.every((host) => host.dataset.mode === 'launcher' || host.dataset.mode === 'popup');

if (!deferrable) {
  load();
} else {
  for (const host of hosts) {
    const button = host.querySelector<HTMLButtonElement>('[data-cff-placeholder]');
    if (!button) continue;
    button.addEventListener('pointerenter', load, { once: true });
    button.addEventListener('focus', load, { once: true });
    button.addEventListener('click', () => {
      opening = host.dataset.formId ?? null;
      button.setAttribute('aria-busy', 'true');
      load();
    }, { once: true });
  }
  // Auto-open timers and scroll triggers live in the runtime: load it once the page is idle.
  const idle = (window as unknown as { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number }).requestIdleCallback;
  if (idle) idle(load, { timeout: 4000 });
  else setTimeout(load, 2000);
}
