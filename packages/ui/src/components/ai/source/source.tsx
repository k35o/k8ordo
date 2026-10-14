import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { ExternalLinkIcon } from '../../icons';
import { FileIcon } from '../_internal/icons';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './source.module.css';

type ListProps = {
  label?: string;
  children: ReactNode;
};

export const List: FC<ListProps> = ({ label, children }) => {
  const messages = getMessages();

  return (
    <ul aria-label={label ?? messages.sources} className={styles.list}>
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

type ItemProps = {
  href?: string;
  title?: string;
};

export const Item: FC<ItemProps> = ({ href, title }) => {
  const url = webUrl(href);
  const label = title ?? url?.hostname ?? href;

  return (
    <li className={styles.item}>
      {url === undefined ? (
        <span className={styles.chip}>
          <span className={styles.icon}>
            <FileIcon size="xs" />
          </span>
          <span className={styles.label}>{label}</span>
        </span>
      ) : (
        <a
          className={clsx(styles.chip, styles.link, focusRing.ring)}
          href={url.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className={styles.label}>{label}</span>
          <span className={styles.icon}>
            <ExternalLinkIcon size="xs" />
          </span>
        </a>
      )}
    </li>
  );
};
