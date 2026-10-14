'use client';

import type { FC, PropsWithChildren } from 'react';

import { useItemId, useOpen } from './context';

import styles from './accordion-panel.module.css';

export const AccordionPanel: FC<PropsWithChildren> = ({ children }) => {
  const id = useItemId();
  const open = useOpen();
  return (
    <section
      aria-labelledby={`${id}-button`}
      className={styles.root}
      hidden={!open}
      id={`${id}-panel`}
    >
      {children}
    </section>
  );
};
