import * as m from '../messages';
import type { NavCategory } from './nav-types';

export const hookCategories: NavCategory[] = [
  {
    title: m.hooks.categoryDomInteraction,
    items: [
      {
        name: 'useClickAway',
        path: '/:locale/ui/hooks/use-click-away',
        description: m.hooks.clickAway.description,
      },
      {
        name: 'useHover',
        path: '/:locale/ui/hooks/use-hover',
        description: m.hooks.hover.description,
      },
      {
        name: 'useScrollDirection',
        path: '/:locale/ui/hooks/use-scroll-direction',
        description: m.hooks.scrollDirection.description,
      },
      {
        name: 'useScrollLock',
        path: '/:locale/ui/hooks/use-scroll-lock',
        description: m.hooks.scrollLock.description,
      },
      {
        name: 'useWindowResize',
        path: '/:locale/ui/hooks/use-window-resize',
        description: m.hooks.windowResize.description,
      },
      {
        name: 'useWritingMode',
        path: '/:locale/ui/hooks/use-writing-mode',
        description: m.hooks.writingMode.description,
      },
    ],
  },
  {
    title: m.hooks.categoryStateStorage,
    items: [
      {
        name: 'useClipboard',
        path: '/:locale/ui/hooks/use-clipboard',
        description: m.hooks.clipboard.description,
      },
      {
        name: 'useControllableState',
        path: '/:locale/ui/hooks/use-controllable-state',
        description: m.hooks.controllableState.description,
      },
    ],
  },
  {
    title: m.hooks.categoryTiming,
    items: [
      {
        name: 'useDebouncedTransition',
        path: '/:locale/ui/hooks/use-debounced-transition',
        description: m.hooks.debouncedTransition.description,
      },
      {
        name: 'useDeferredDebounce',
        path: '/:locale/ui/hooks/use-deferred-debounce',
        description: m.hooks.deferredDebounce.description,
      },
      {
        name: 'useInterval',
        path: '/:locale/ui/hooks/use-interval',
        description: m.hooks.interval.description,
      },
      {
        name: 'useTimeout',
        path: '/:locale/ui/hooks/use-timeout',
        description: m.hooks.timeout.description,
      },
    ],
  },
  {
    title: m.hooks.categoryUtility,
    items: [
      {
        name: 'useBreakpoint',
        path: '/:locale/ui/hooks/use-breakpoint',
        description: m.hooks.breakpoint.description,
      },
      {
        name: 'useDisclosure',
        path: '/:locale/ui/hooks/use-disclosure',
        description: m.hooks.disclosure.description,
      },
      {
        name: 'useStep',
        path: '/:locale/ui/hooks/use-step',
        description: m.hooks.step.description,
      },
      {
        name: 'useWindowSize',
        path: '/:locale/ui/hooks/use-window-size',
        description: m.hooks.windowSize.description,
      },
    ],
  },
];
