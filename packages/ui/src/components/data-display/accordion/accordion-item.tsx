'use client';

import { useId } from 'react';
import type { FC, PropsWithChildren } from 'react';

import { AccordionItemProvider } from './context';

import styles from './accordion-item.module.css';

export const AccordionItem: FC<
  PropsWithChildren<{
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
  }>
> = ({ children, isOpen, defaultOpen = false, onChange }) => {
  const id = useId();
  return (
    <AccordionItemProvider
      defaultOpen={defaultOpen}
      id={id}
      isOpen={isOpen}
      onChange={onChange}
    >
      <div className={styles.root}>{children}</div>
    </AccordionItemProvider>
  );
};
