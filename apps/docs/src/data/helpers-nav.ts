import * as m from '../messages';
import type { NavCategory } from './nav-types';

export const helperCategories: NavCategory[] = [
  {
    title: m.helpers.categoryStyling,
    items: [
      {
        name: 'cn',
        path: '/ui/helpers/cn',
        description: m.helpers.cn.description,
      },
    ],
  },
  {
    title: m.helpers.categoryReact,
    items: [
      {
        name: 'mergeRefs',
        path: '/ui/helpers/merge-refs',
        description: m.helpers.mergeRefs.description,
      },
      {
        name: 'mergeProps',
        path: '/ui/helpers/merge-props',
        description: m.helpers.mergeProps.description,
      },
      {
        name: 'chain',
        path: '/ui/helpers/chain',
        description: m.helpers.chain.description,
      },
      {
        name: 'createSafeContext',
        path: '/ui/helpers/create-safe-context',
        description: m.helpers.createSafeContext.description,
      },
    ],
  },
];
