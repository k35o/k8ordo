import type { FC, PropsWithChildren } from 'react';

export const Accordion: FC<PropsWithChildren> = ({ children }) => (
  <div className="divide-border-mute vertical:flex vertical:h-full vertical:flex-col vertical:divide-y-0 vertical:[&>:not(:last-child)]:border-l vertical:[&>:not(:last-child)]:border-border-mute divide-y">
    {children}
  </div>
);
