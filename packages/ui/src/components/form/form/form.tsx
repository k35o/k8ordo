'use client';

import type { FC, FormHTMLAttributes, ReactNode } from 'react';

type Props = {
  action?: ((formData: FormData) => void | Promise<void>) | string;
  children: ReactNode;
} & Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'action' | 'children' | 'className' | 'style'
>;

export const Form: FC<Props> = ({ action, children, ...rest }) => (
  <form action={action} className="flex flex-col gap-6" {...rest}>
    {children}
  </form>
);
