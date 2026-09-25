'use client';

import type { FC, ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { useMessages } from '../../../i18n/context';
import { FOCUS_RING } from '../../_internal/focus-ring';
import { ExternalLinkIcon } from '../../icons';
import { FileIcon } from '../_internal/icons';

type ListProps = {
  label?: string;
  children: ReactNode;
};

export const List: FC<ListProps> = ({ label, children }) => {
  const messages = useMessages();

  return (
    <ul aria-label={label ?? messages.sources} className="flex flex-wrap gap-2">
      {children}
    </ul>
  );
};

// 出典の URL はモデルが返したもの。`javascript:` などをリンクにしないよう、
// http(s) のときだけ `<a>` にする
const webUrl = (href: string | undefined): URL | undefined => {
  const url = href === undefined ? null : URL.parse(href);
  return url?.protocol === 'https:' || url?.protocol === 'http:'
    ? url
    : undefined;
};

const CHIP =
  'inline-flex max-w-64 items-center gap-1.5 rounded-full border border-border-mute bg-bg-subtle px-2.5 py-1 text-xs text-fg-mute';

type ItemProps = {
  href?: string;
  title?: string;
};

export const Item: FC<ItemProps> = ({ href, title }) => {
  const url = webUrl(href);
  const label = title ?? url?.hostname ?? href;

  return (
    <li className="min-w-0">
      {url === undefined ? (
        <span className={CHIP}>
          <span className="shrink-0">
            <FileIcon size="xs" />
          </span>
          <span className="truncate">{label}</span>
        </span>
      ) : (
        <a
          className={cn(
            CHIP,
            'transition-colors duration-150 ease-out hover:bg-bg-mute hover:text-fg-base',
            FOCUS_RING,
          )}
          href={url.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="truncate">{label}</span>
          <span className="shrink-0">
            <ExternalLinkIcon size="xs" />
          </span>
        </a>
      )}
    </li>
  );
};
