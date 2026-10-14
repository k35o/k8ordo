'use client';

import type { FC, FormHTMLAttributes, ReactNode, Ref } from 'react';

import styles from './form.module.css';

type Props = {
  action?: ((formData: FormData) => void | Promise<void>) | string;
  children: ReactNode;
  ref?: Ref<HTMLFormElement>;
} & Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'action' | 'children' | 'className' | 'style'
>;

export const Form: FC<Props> = ({ action, children, ...rest }) => (
  <form action={action} className={styles.root} {...rest}>
    {children}
  </form>
);
