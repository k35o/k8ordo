import { clsx } from 'clsx';

import styles from './nav-link.module.css';

export const navLinkClassName = (isCurrent: boolean, depth = 0): string =>
  clsx(
    styles.link,
    depth === 0 && styles.depth0,
    depth === 1 && styles.depth1,
    depth >= 2 && styles.depth2,
    isCurrent ? styles.current : styles.idle,
  );

export const NAV_LIST_CLASS_NAME = styles.list;

export const NAV_TITLE_CLASS_NAME = styles.title;
