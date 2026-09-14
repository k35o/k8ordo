import * as m from '../messages';
import type { NavCategory } from './nav-types';

export const hookCategories: NavCategory[] = [
  {
    title: m.hooks.categoryDomInteraction,
    items: [
      {
        name: 'useClickAway',
        path: '/ui/hooks/use-click-away',
        description: m.hooks.clickAway.description,
      },
      {
        name: 'useHover',
        path: '/ui/hooks/use-hover',
        description: m.hooks.hover.description,
      },
      {
        name: 'useResize',
        path: '/ui/hooks/use-resize',
        description: m.hooks.resize.description,
      },
      {
        name: 'useScrollDirection',
        path: '/ui/hooks/use-scroll-direction',
        description: m.hooks.scrollDirection.description,
      },
      {
        name: 'useScrollLock',
        path: '/ui/hooks/use-scroll-lock',
        description: m.hooks.scrollLock.description,
      },
      {
        name: 'useWindowResize',
        path: '/ui/hooks/use-window-resize',
        description: m.hooks.windowResize.description,
      },
      {
        name: 'useWritingMode',
        path: '/ui/hooks/use-writing-mode',
        description: m.hooks.writingMode.description,
      },
    ],
  },
  {
    title: m.hooks.categoryStateStorage,
    items: [
      {
        name: 'useClipboard',
        path: '/ui/hooks/use-clipboard',
        description: m.hooks.clipboard.description,
      },
      {
        name: 'useControllableState',
        path: '/ui/hooks/use-controllable-state',
        description: m.hooks.controllableState.description,
      },
    ],
  },
  {
    title: m.hooks.categoryTiming,
    items: [
      {
        name: 'useDebouncedTransition',
        path: '/ui/hooks/use-debounced-transition',
        description: m.hooks.debouncedTransition.description,
      },
      {
        name: 'useDeferredDebounce',
        path: '/ui/hooks/use-deferred-debounce',
        description: m.hooks.deferredDebounce.description,
      },
      {
        name: 'useInterval',
        path: '/ui/hooks/use-interval',
        description: m.hooks.interval.description,
      },
      {
        name: 'useTimeout',
        path: '/ui/hooks/use-timeout',
        description: m.hooks.timeout.description,
      },
    ],
  },
  {
    title: m.hooks.categoryUtility,
    items: [
      {
        name: 'useBreakpoint',
        path: '/ui/hooks/use-breakpoint',
        description: m.hooks.breakpoint.description,
      },
      {
        name: 'useClient',
        path: '/ui/hooks/use-client',
        description: m.hooks.client.description,
      },
      {
        name: 'useDisclosure',
        path: '/ui/hooks/use-disclosure',
        description: m.hooks.disclosure.description,
      },
      {
        name: 'useStep',
        path: '/ui/hooks/use-step',
        description: m.hooks.step.description,
      },
      {
        name: 'useWindowSize',
        path: '/ui/hooks/use-window-size',
        description: m.hooks.windowSize.description,
      },
    ],
  },
  {
    title: m.hooks.categoryObserver,
    items: [
      {
        name: 'useIntersectionObserver',
        path: '/ui/hooks/use-intersection-observer',
        description: m.hooks.intersectionObserver.description,
      },
      {
        name: 'useInView',
        path: '/ui/hooks/use-in-view',
        description: m.hooks.inView.description,
      },
    ],
  },
];
