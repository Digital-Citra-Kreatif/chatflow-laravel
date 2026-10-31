/**
 * Loads the chat runtime. A page with an inline or full-page form needs it at once. A page
 * whose forms are all launchers or pop-ups shows a server-rendered button meanwhile, and the
 * runtime (the larger download) loads only when something needs it: the visitor reaches for
 * the button or a same-page "open chat" control, or a form's auto-open time or scroll
 * trigger comes due. A click made before it arrives opens the chat once it has.
 */
type Host = HTMLElement & { dataset: DOMStringMap };
type Runtime = { ChatFlow?: { open(id: string): boolean } };

const script = document.getElementById('cff-runtime-js');
const runtimeUrl = script?.dataset.runtime;
let started = false;
let opening: string | null = null;

function load(): void {
  if (started || !runtimeUrl) return;
  started = true;
  void import(/* @vite-ignore */ runtimeUrl).then(() => {
    if (opening) (window as unknown as Runtime).ChatFlow?.open(opening);
  });
}

function open(id: string | undefined): void {
  opening = id ?? null;
  load();
}

const hosts = [...document.querySelectorAll<Host>('cff-chat')];
const deferrable = hosts.length > 0 && hosts.every((host) => host.dataset.mode === 'launcher' || host.dataset.mode === 'popup');

if (!deferrable) {
  load();
} else {
  for (const host of hosts) {
    const button = host.querySelector<HTMLButtonElement>('[data-cff-placeholder]');
    if (button) {
      // Hover, focus or a touch starts the download early; the click opens the chat.
      for (const event of ['pointerenter', 'focus', 'touchstart'] as const) button.addEventListener(event, load, { once: true, passive: true });
      button.addEventListener('click', () => { button.setAttribute('aria-busy', 'true'); open(host.dataset.formId); }, { once: true });
    }
    // The form's own triggers: load a little before the auto-open time, or on the first scroll.
    const seconds = Number(host.dataset.autoOpen);
    if (host.dataset.autoOpen && Number.isFinite(seconds)) setTimeout(load, Math.max(0, seconds * 1000 - 1500));
    if (host.dataset.scrollPercent) window.addEventListener('scroll', load, { once: true, passive: true });
  }
  // Same-page controls such as <button data-cff-open="123"> (the runtime handles them once loaded).
  document.addEventListener('click', (event) => {
    if (started) return;
    const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cff-open]') : null;
    if (!trigger || !hosts.some((host) => host.dataset.formId === trigger.dataset.cffOpen)) return;
    event.preventDefault();
    open(trigger.dataset.cffOpen);
  });
}
