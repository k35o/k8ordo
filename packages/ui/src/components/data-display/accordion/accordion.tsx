import type { FC, PropsWithChildren } from 'react';

import styles from './accordion.module.css';

export const Accordion: FC<PropsWithChildren> = ({ children }) => (
  <div className={styles.root}>{children}</div>
);
