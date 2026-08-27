'use client';

import { Anchor } from '@k8ordo/ui';
import type { FC, MouseEventHandler, PropsWithChildren } from 'react';

import { localizeHref, useLocale } from '../i18n';

type LocaleAnchorProps = PropsWithChildren<{
  path: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  unstyled?: boolean;
}>;

export const LocaleAnchor: FC<LocaleAnchorProps> = ({
  path,
  className,
  onClick,
  children,
  unstyled = false,
}) => {
  const locale = useLocale();
  const href = localizeHref(path, locale);

  if (unstyled) {
    return (
      <a className={className} href={href} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Anchor
      href={href}
      renderAnchor={
        onClick !== undefined || className !== undefined
          ? (props) => (
              <a
                className={className ?? props.className}
                href={props.href}
                onClick={onClick}
              >
                {props.children}
              </a>
            )
          : undefined
      }
    >
      {children}
    </Anchor>
  );
};
