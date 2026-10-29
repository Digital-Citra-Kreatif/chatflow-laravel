// Classic-script entry: exposes the inbox on window.CFFAdmin without WordPress globals.
import { mountSubmissions } from '../submissions/index';

const w = window as unknown as { CFFAdmin?: Record<string, unknown> };
w.CFFAdmin = { ...(w.CFFAdmin ?? {}), submissions: { mountSubmissions } };
