import { clsx } from 'clsx';
import { Fragment } from 'react';
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { findAllColors } from './find-all-colors';

import styles from './code.module.css';

type Props = {
  children: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>;

export const Code: FC<Props> = ({ children, ...rest }) => {
  const messages = getMessages();
  const colors = findAllColors(children);

  if (colors.length === 0) {
    return (
      <code {...rest} className={styles.root}>
        {children}
      </code>
    );
  }

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const [index, colorInfo] of colors.entries()) {
    if (colorInfo.start > lastIndex) {
      parts.push(children.slice(lastIndex, colorInfo.start));
    }

    parts.push(
      <Fragment key={`color-${String(index)}`}>
        <span
          aria-label={`${messages.color}: ${colorInfo.color}`}
          className={styles.swatch}
          role="img"
          style={{ backgroundColor: colorInfo.color }}
        />
        {children.slice(colorInfo.start, colorInfo.end)}
      </Fragment>,
    );

    lastIndex = colorInfo.end;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return (
    <code {...rest} className={clsx(styles.root, styles.withColors)}>
      {parts}
    </code>
  );
};
