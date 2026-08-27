import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { ExternalLinkIcon } from '../../icons';

type RestProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children' | 'target' | 'rel' | 'className' | 'style'
>;

type RenderAnchorProps<T extends string> = {
  kind: 'internal' | 'external';
  href: NoInfer<T>;
  className: string;
  target?: string;
  rel?: string;
  children: ReactNode;
} & RestProps;

type Props<T extends string> = {
  href: T;
  children: ReactNode;
  openInNewTab?: boolean;
  renderAnchor?: (props: RenderAnchorProps<T>) => ReactNode;
} & RestProps;

// Stable module-level reference so it is not re-created on every render
// (default prop function expressions break referential equality).
const defaultRenderAnchor = ({
  children: anchorChildren,
  ...rest
}: RenderAnchorProps<string>): ReactNode => <a {...rest}>{anchorChildren}</a>;

export const Anchor = <T extends string>({
  href,
  children,
  openInNewTab = false,
  renderAnchor = defaultRenderAnchor,
  ...rest
}: Props<T>) => {
  const isExternal = href.startsWith('http');
  const kind = !isExternal && !openInNewTab ? 'internal' : 'external';
  const baseClassName =
    'text-fg-info underline transition-colors hover:text-fg-info/80 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border-info focus-visible:rounded-sm';
  const props =
    kind === 'internal'
      ? {
          className: baseClassName,
          children,
        }
      : {
          className: `${baseClassName} inline-flex items-center gap-0.5`,
          target: '_blank',
          rel: 'noopener noreferrer',
          children: (
            <>
              {children}
              <ExternalLinkIcon size="sm" />
            </>
          ),
        };
  return renderAnchor({
    ...rest,
    kind,
    href,
    ...props,
  });
};
