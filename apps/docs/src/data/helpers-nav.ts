import type { NavCategory } from './nav-types';

export const helperCategories: NavCategory[] = [
  {
    titleKey: 'helpers.categoryStyling',
    items: [
      { name: 'cn', path: '/ui/helpers/cn', descKey: 'helpers.cn.description' },
    ],
  },
  {
    titleKey: 'helpers.categoryReact',
    items: [
      {
        name: 'mergeRefs',
        path: '/ui/helpers/merge-refs',
        descKey: 'helpers.mergeRefs.description',
      },
      {
        name: 'mergeProps',
        path: '/ui/helpers/merge-props',
        descKey: 'helpers.mergeProps.description',
      },
      {
        name: 'chain',
        path: '/ui/helpers/chain',
        descKey: 'helpers.chain.description',
      },
      {
        name: 'createSafeContext',
        path: '/ui/helpers/create-safe-context',
        descKey: 'helpers.createSafeContext.description',
      },
    ],
  },
];
