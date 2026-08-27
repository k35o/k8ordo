'use client';

import type { FC, PropsWithChildren, ReactNode } from 'react';

import { useMessages } from '../../../i18n/context';
import { ChevronIcon } from '../../icons';
import { cn } from './../../../helpers/cn';

export const List: FC<
  PropsWithChildren<{
    size?: 'sm' | 'md' | 'lg';
  }>
> = ({ children, size = 'md' }) => {
  const messages = useMessages();

  return (
    <nav aria-label={messages.breadcrumb}>
      <ol
        className={cn(
          'flex list-none items-center gap-1 text-fg-mute',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-xs md:text-md',
          size === 'lg' && 'text-xl md:text-2xl',
        )}
      >
        {children}
      </ol>
    </nav>
  );
};

export const Item: FC<PropsWithChildren> = ({ children }) => (
  <li className="inline-flex items-center">{children}</li>
);

export const Separator: FC = () => (
  <li aria-hidden="true" className="text-fg-mute vertical:rotate-90">
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
    <span aria-current="page" className="text-fg-base">
      {children}
    </span>
  ) : (
    renderAnchor({
      href,
      className:
        'hover:text-fg-base focus-visible:ring-border-info underline transition-colors focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-hidden',
      children,
    })
  );
