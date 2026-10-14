import type { FC, HTMLAttributes, ReactNode } from 'react';

import styles from './empty-state.module.css';

type Props = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | 'title'
>;

export const EmptyState: FC<Props> = ({
  title,
  description,
  icon,
  action,
  ...rest
}) => (
  <div {...rest} className={styles.root}>
    {icon === undefined ? null : <div className={styles.icon}>{icon}</div>}
    <p className={styles.title}>{title}</p>
    {description === undefined ? null : (
      <div className={styles.description}>{description}</div>
    )}
    {action === undefined ? null : (
      <div className={styles.action}>{action}</div>
    )}
  </div>
);
