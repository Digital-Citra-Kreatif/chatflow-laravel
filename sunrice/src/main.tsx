import { definePlugin } from '@imajiner/admin-sdk';
import './admin.css';

// Each page is its own chunk, loaded the first time it opens.
definePlugin({
  lazyPages: {
    'ChatFlow/Forms/Index': () => import('./pages/Forms/Index'),
  },
});
