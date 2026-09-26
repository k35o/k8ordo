import { cn } from '../../helpers/cn';

// SideNav と TableOfContents の項目。親の罫（border-s）に、今の項目の罫を
// -ms-px で重ねる（傍線の索引）
export const navLinkClassName = (isCurrent: boolean, depth = 0): string =>
  cn(
    '-ms-px block border-s-2 py-1.5 pe-3 text-sm transition-colors duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border-info focus-visible:ring-inset',
    depth === 0 && 'ps-4',
    depth === 1 && 'ps-8',
    depth >= 2 && 'ps-12',
    isCurrent
      ? 'border-primary-border bg-primary-bg-subtle font-medium text-fg-base'
      : 'border-transparent text-fg-mute hover:border-border-emphasize hover:text-fg-base',
  );

export const NAV_LIST_CLASS_NAME =
  'mt-1 ms-3 flex flex-col gap-0.5 border-s border-border-mute';

export const NAV_TITLE_CLASS_NAME =
  'px-3 text-xs font-bold tracking-normal text-fg-subtle';
