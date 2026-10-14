import type { FC, HTMLAttributes } from 'react';

import styles from './prose.module.css';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export const Prose: FC<Props> = ({ children, ...rest }) => (
  <div {...rest} className={styles.root}>
    {children}
  </div>
);
