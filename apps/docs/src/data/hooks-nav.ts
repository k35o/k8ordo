import type { NavCategory } from './nav-types';

export const hookCategories: NavCategory[] = [
  {
    titleKey: 'hooks.categoryDomInteraction',
    items: [
      {
        name: 'useClickAway',
        path: '/ui/hooks/use-click-away',
        descKey: 'hooks.useClickAway.description',
      },
      {
        name: 'useHover',
        path: '/ui/hooks/use-hover',
        descKey: 'hooks.useHover.description',
      },
      {
        name: 'useResize',
        path: '/ui/hooks/use-resize',
        descKey: 'hooks.useResize.description',
      },
      {
        name: 'useScrollDirection',
        path: '/ui/hooks/use-scroll-direction',
        descKey: 'hooks.useScrollDirection.description',
      },
      {
        name: 'useScrollLock',
        path: '/ui/hooks/use-scroll-lock',
        descKey: 'hooks.useScrollLock.description',
      },
      {
        name: 'useWindowResize',
        path: '/ui/hooks/use-window-resize',
        descKey: 'hooks.useWindowResize.description',
      },
      {
        name: 'useWritingMode',
        path: '/ui/hooks/use-writing-mode',
        descKey: 'hooks.useWritingMode.description',
      },
    ],
  },
  {
    titleKey: 'hooks.categoryStateStorage',
    items: [
      {
        name: 'useClipboard',
        path: '/ui/hooks/use-clipboard',
        descKey: 'hooks.useClipboard.description',
      },
      {
        name: 'useControllableState',
        path: '/ui/hooks/use-controllable-state',
        descKey: 'hooks.useControllableState.description',
      },
      {
        name: 'useLocalStorage',
        path: '/ui/hooks/use-local-storage',
        descKey: 'hooks.useLocalStorage.description',
      },
      {
        name: 'useSessionStorage',
        path: '/ui/hooks/use-session-storage',
        descKey: 'hooks.useSessionStorage.description',
      },
      {
        name: 'useHash',
        path: '/ui/hooks/use-hash',
        descKey: 'hooks.useHash.description',
      },
    ],
  },
  {
    titleKey: 'hooks.categoryTiming',
    items: [
      {
        name: 'useDebouncedTransition',
        path: '/ui/hooks/use-debounced-transition',
        descKey: 'hooks.useDebouncedTransition.description',
      },
      {
        name: 'useDeferredDebounce',
        path: '/ui/hooks/use-deferred-debounce',
        descKey: 'hooks.useDeferredDebounce.description',
      },
      {
        name: 'useInterval',
        path: '/ui/hooks/use-interval',
        descKey: 'hooks.useInterval.description',
      },
      {
        name: 'useTimeout',
        path: '/ui/hooks/use-timeout',
        descKey: 'hooks.useTimeout.description',
      },
    ],
  },
  {
    titleKey: 'hooks.categoryUtility',
    items: [
      {
        name: 'useBreakpoint',
        path: '/ui/hooks/use-breakpoint',
        descKey: 'hooks.useBreakpoint.description',
      },
      {
        name: 'useClient',
        path: '/ui/hooks/use-client',
        descKey: 'hooks.useClient.description',
      },
      {
        name: 'useDisclosure',
        path: '/ui/hooks/use-disclosure',
        descKey: 'hooks.useDisclosure.description',
      },
      {
        name: 'useStep',
        path: '/ui/hooks/use-step',
        descKey: 'hooks.useStep.description',
      },
      {
        name: 'useWindowSize',
        path: '/ui/hooks/use-window-size',
        descKey: 'hooks.useWindowSize.description',
      },
    ],
  },
  {
    titleKey: 'hooks.categoryObserver',
    items: [
      {
        name: 'useIntersectionObserver',
        path: '/ui/hooks/use-intersection-observer',
        descKey: 'hooks.useIntersectionObserver.description',
      },
      {
        name: 'useInView',
        path: '/ui/hooks/use-in-view',
        descKey: 'hooks.useInView.description',
      },
    ],
  },
];
