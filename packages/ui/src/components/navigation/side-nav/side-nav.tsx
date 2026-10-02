import { useId } from 'react';
import type {
  AnchorHTMLAttributes,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';

import {
  NAV_LIST_CLASS_NAME,
  NAV_TITLE_CLASS_NAME,
  navLinkClassName,
} from '../../_internal/nav-link';
import { ChevronIcon } from '../../icons';

type RestProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children' | 'className' | 'style' | 'aria-current'
>;

type RenderSideNavAnchorProps<T extends string> = {
  href: NoInfer<T>;
  className: string;
  children: ReactNode;
  'aria-current': 'page' | undefined;
} & RestProps;

// 描画ごとに作り直さないよう、モジュールに置く
const defaultRenderAnchor = ({
  children,
  ...rest
}: RenderSideNavAnchorProps<string>): ReactNode => <a {...rest}>{children}</a>;

export const Root: FC<
  PropsWithChildren<
    { label: string } & Omit<
      HTMLAttributes<HTMLElement>,
      'className' | 'style' | 'aria-label' | 'children'
    >
  >
> = ({ label, children, ...rest }) => (
  <nav {...rest} aria-label={label} className="flex flex-col gap-6">
    {children}
  </nav>
);

export const Group: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  const titleId = useId();
  return (
    <div className="flex flex-col gap-1">
      <span className={NAV_TITLE_CLASS_NAME} id={titleId}>
        {title}
      </span>
      <ul aria-labelledby={titleId} className={NAV_LIST_CLASS_NAME}>
        {children}
      </ul>
    </div>
  );
};

export const Link = <T extends string>({
  href,
  current = false,
  children,
  renderAnchor = defaultRenderAnchor,
  ...rest
}: {
  href: T;
  current?: boolean;
  children: ReactNode;
  renderAnchor?: (props: RenderSideNavAnchorProps<T>) => ReactNode;
} & RestProps) => (
  <li>
    {renderAnchor({
      ...rest,
      href,
      children,
      'aria-current': current ? 'page' : undefined,
      className: navLinkClassName(current),
    })}
  </li>
);

/**
 * A group inside a group that opens and closes — a level of the tree. It is a
 * `<details>`, so it works before hydration and without JavaScript; open the
 * one holding the current page with `defaultOpen`.
 */
export const Sub: FC<
  PropsWithChildren<{ title: string; defaultOpen?: boolean }>
> = ({ title, defaultOpen = false, children }) => (
  <li>
    <details className="group/sub" open={defaultOpen}>
      <summary className="text-fg-mute hover:border-border-emphasize hover:text-fg-base focus-visible:ring-border-info -ms-px flex cursor-pointer list-none items-center gap-1.5 border-s-2 border-transparent py-1.5 ps-4 pe-3 text-sm transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:outline-hidden focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        {/* 三角の印を消した代わりの向きの印。開くと下を向く */}
        <span className="flex transition-transform duration-150 ease-out group-open/sub:rotate-90 rtl:-scale-x-100 rtl:group-open/sub:rotate-90">
          <ChevronIcon direction="right" size="sm" />
        </span>
        {title}
      </summary>
      <ul className={NAV_LIST_CLASS_NAME}>{children}</ul>
    </details>
  </li>
);
