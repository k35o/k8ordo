import * as m from '../messages';
import type { NavCategory } from './nav-types';

export const helperCategories: NavCategory[] = [
  {
    title: m.helpers.categoryStyling,
    items: [
      {
        name: 'cn',
        path: '/:locale/ui/helpers/cn',
        description: m.helpers.cn.description,
      },
    ],
  },
  {
    title: m.helpers.categoryReact,
    items: [
      {
        name: 'mergeRefs',
        path: '/:locale/ui/helpers/merge-refs',
        description: m.helpers.mergeRefs.description,
      },
      {
        name: 'mergeProps',
        path: '/:locale/ui/helpers/merge-props',
        description: m.helpers.mergeProps.description,
      },
      {
        name: 'chain',
        path: '/:locale/ui/helpers/chain',
        description: m.helpers.chain.description,
      },
      {
        name: 'createSafeContext',
        path: '/:locale/ui/helpers/create-safe-context',
        description: m.helpers.createSafeContext.description,
      },
    ],
  },
];
