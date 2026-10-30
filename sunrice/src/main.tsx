import { definePlugin } from '@imajiner/admin-sdk';
import './admin.css';

// Each page is its own chunk, loaded the first time it opens.
definePlugin({
  lazyPages: {
    'ChatFlow/Forms/Index': () => import('./pages/Forms/Index'),
    'ChatFlow/Forms/Create': () => import('./pages/Forms/Create'),
    'ChatFlow/Builder': () => import('./pages/Builder/Index'),
    'ChatFlow/Submissions/Index': () => import('./pages/Submissions/Index'),
    'ChatFlow/Submissions/Show': () => import('./pages/Submissions/Show'),
  },
});
