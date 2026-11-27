import { clsx } from 'clsx';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { ExternalLinkIcon } from '../../icons/external-link';

import focusRing from '../../_internal/focus-ring.module.css';
import srOnly from '../../_internal/sr-only.module.css';
import styles from './anchor.module.css';

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

// http(s): で始まるか、ブラウザが別のホストとして読む `//` と `/\` で始まる
// URL。`mailto:` などのスキームや `?…` だけの URL は内のリンクとして描く。
const EXTERNAL_URL = /^(?:https?:)?[/\\]{2}/iu;

// Stable module-level reference so it is not re-created on every render
// (default prop function expressions break referential equality).
const defaultRenderAnchor = ({
  kind: _kind,
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
  const kind =
    !EXTERNAL_URL.test(href) && !openInNewTab ? 'internal' : 'external';
  const className = clsx(styles.root, focusRing.ringNoBorder);
  const props =
    kind === 'internal'
      ? { className, children }
      : {
          className,
          target: '_blank',
          rel: 'noopener noreferrer',
          children: (
            <>
              {children}
              <span className={styles.icon}>
                <ExternalLinkIcon size="sm" />
              </span>
              <span className={srOnly.srOnly}>
                {getMessages().opensInNewTab}
              </span>
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
