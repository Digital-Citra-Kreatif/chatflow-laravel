// Classic-script entry: exposes the builder on window.CFFAdmin without WordPress globals.
import '@wordpress/components/build-style/style.css';
import { mountBuilder } from '../builder/index';
import { mountFormsList } from '../builder/forms-list';

const w = window as unknown as { CFFAdmin?: Record<string, unknown> };
w.CFFAdmin = { ...(w.CFFAdmin ?? {}), builder: { mountBuilder, mountFormsList } };
