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
