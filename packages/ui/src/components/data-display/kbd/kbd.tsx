import type { FC, HTMLAttributes } from 'react';

import srOnly from '../../_internal/sr-only.module.css';
import styles from './kbd.module.css';

type Props = {
  children: string;
  label?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>;

export const Kbd: FC<Props> = ({ children, label, ...rest }) => (
  <kbd {...rest} className={styles.root}>
    {label === undefined ? (
      children
    ) : (
      // 記号だけのキー（⌘ など）は読み上げで意味が通らないので、見た目は
      // 記号のまま、読み上げには label を渡す
      <>
        <span aria-hidden="true">{children}</span>
        <span className={srOnly.srOnly}>{label}</span>
      </>
    )}
  </kbd>
);
