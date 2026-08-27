'use client';

import { Fragment } from 'react';
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { useMessages } from '../../../i18n/context';
import { findAllColors } from './find-all-colors';

type Props = {
  children: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>;

export const Code: FC<Props> = ({ children, ...rest }) => {
  const messages = useMessages();
  const colors = findAllColors(children);

  if (colors.length === 0) {
    return (
      <code {...rest} className="bg-bg-mute m-0.5 rounded-md px-1.5 sm:py-0.5">
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
          className="border-border-base inline-block size-3 shrink-0 rounded-sm border"
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
    <code
      {...rest}
      className="bg-bg-mute vertical:inline vertical:gap-0 m-0.5 inline-flex items-center gap-1 rounded-md px-1.5 sm:py-0.5"
    >
      {parts}
    </code>
  );
};
