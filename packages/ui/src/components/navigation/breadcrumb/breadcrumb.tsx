import { clsx } from 'clsx';
import type { FC, PropsWithChildren, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { ChevronIcon } from '../../icons';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './breadcrumb.module.css';

const SIZE = { sm: styles.sm, md: styles.md, lg: styles.lg } as const;

export const List: FC<
  PropsWithChildren<{
    size?: 'sm' | 'md' | 'lg';
  }>
> = ({ children, size = 'md' }) => {
  const messages = getMessages();

  return (
    <nav aria-label={messages.breadcrumb}>
      <ol className={clsx(styles.list, SIZE[size])}>{children}</ol>
    </nav>
  );
};

export const Item: FC<PropsWithChildren> = ({ children }) => (
  <li className={styles.item}>{children}</li>
);

export const Separator: FC = () => (
  <li aria-hidden="true" className={styles.separator}>
    <ChevronIcon direction="right" size="sm" />
  </li>
);

type RenderBreadcrumbAnchorProps<T extends string> = {
  href: NoInfer<T>;
  className: string;
  children: ReactNode;
};

const defaultRenderBreadcrumbAnchor = ({
  children,
  ...rest
}: RenderBreadcrumbAnchorProps<string>): ReactNode => (
  <a {...rest}>{children}</a>
);

export const Link = <T extends string>({
  href,
  current = false,
  children,
  renderAnchor = defaultRenderBreadcrumbAnchor,
}: PropsWithChildren<{
  href: T;
  current?: boolean;
  renderAnchor?: (props: RenderBreadcrumbAnchorProps<T>) => ReactNode;
}>) =>
  current ? (
    <span aria-current="page" className={styles.current}>
      {children}
    </span>
  ) : (
    renderAnchor({
      href,
      className: clsx(styles.link, focusRing.ringNoBorder),
      children,
    })
  );
