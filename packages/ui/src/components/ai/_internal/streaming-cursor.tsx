import type { FC } from 'react';

import styles from './streaming-cursor.module.css';

export const StreamingCursor: FC = () => (
  <span aria-hidden className={styles.root} />
);
