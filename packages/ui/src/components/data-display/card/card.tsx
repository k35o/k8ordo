import { clsx } from 'clsx';
import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { CardAction } from './card-action';

import focusRing from '../../_internal/focus-ring.module.css';
import highContrast from '../../_internal/high-contrast.module.css';
import styles from './card.module.css';

/**
 * What `renderAnchor` receives: everything the card would put on its own
 * `<a>`. The link has no text of its own; its name is the card's content,
 * through `aria-labelledby`.
 */
export type CardRenderAnchorProps<T extends string> = {
  href: NoInfer<T>;
  className: string;
  'aria-labelledby': string;
  target?: string;
  rel?: string;
};

type CardProps<T extends string> = {
  width?: 'full' | 'fit';
  variant?: 'shadow' | 'outline';
  /** The pressable look alone, for a card whose content is a link of your own. */
  interactive?: boolean;
  /** Makes the whole card a link. Links and buttons inside it stay pressable. */
  href?: T;
  openInNewTab?: boolean;
  renderAnchor?: (props: CardRenderAnchorProps<T>) => ReactNode;
  /**
   * Makes the whole card a button, when there is no `href`. While a returned
   * promise is pending the card is busy and ignores presses.
   */
  onAction?: () => void | Promise<void>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const VARIANT = {
  shadow: [styles.shadow, highContrast.edge],
  outline: styles.outline,
} as const;

const WIDTH = { full: styles.full, fit: styles.fit } as const;

const defaultRenderAnchor = (
  props: CardRenderAnchorProps<string>,
): ReactNode => (
  // oxlint-disable-next-line jsx-a11y/anchor-has-content -- 名前は aria-labelledby がカードの中の文字から付ける
  <a {...props} />
);

export const Card = <T extends string>({
  children,
  width = 'full',
  variant = 'shadow',
  interactive = false,
  href,
  openInNewTab = false,
  renderAnchor = defaultRenderAnchor,
  onAction,
  ...rest
}: CardProps<T>) => {
  const contentId = useId();
  const targetClassName = clsx(styles.target, focusRing.ringNoBorder);
  const target =
    href === undefined ? (
      onAction === undefined ? null : (
        <CardAction
          className={targetClassName}
          labelledBy={contentId}
          onAction={onAction}
        />
      )
    ) : (
      renderAnchor({
        href,
        className: targetClassName,
        'aria-labelledby': contentId,
        ...(openInNewTab
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {}),
      })
    );
  const className = clsx(
    styles.root,
    VARIANT[variant],
    WIDTH[width],
    (interactive || target !== null) && styles.interactive,
    target !== null && styles.pressable,
  );

  return target === null ? (
    <div {...rest} className={className}>
      {children}
    </div>
  ) : (
    <div {...rest} className={className}>
      <div className={styles.content} id={contentId}>
        {children}
      </div>
      {target}
    </div>
  );
};
