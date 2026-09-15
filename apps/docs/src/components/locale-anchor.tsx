'use client';

import { Anchor } from '@k8ordo/ui';
import type { FC, MouseEventHandler, PropsWithChildren } from 'react';

import { href } from '../links';
import type { SitePath } from '../links';

type LocaleAnchorProps = PropsWithChildren<{
  path: SitePath;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  unstyled?: boolean;
}>;

/**
 * サイト内リンク。行き先は表のパターンで、ロケールは `links.ts` が束ねた
 * `href` が今のものを入れる。
 */
export const LocaleAnchor: FC<LocaleAnchorProps> = ({
  path,
  className,
  onClick,
  children,
  unstyled = false,
}) => {
  const target = href(path);

  if (unstyled) {
    return (
      <a className={className} href={target} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Anchor
      href={target}
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
