import type { FC, HTMLAttributes, ReactNode } from 'react';

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
  <div {...rest} className="flex flex-col items-center px-6 py-10 text-center">
    {icon === undefined ? null : (
      <div className="text-fg-subtle mb-4">{icon}</div>
    )}
    <p className="text-fg-base font-bold">{title}</p>
    {description === undefined ? null : (
      <div className="text-fg-mute mt-2 max-w-prose text-sm leading-relaxed">
        {description}
      </div>
    )}
    {action === undefined ? null : <div className="mt-6">{action}</div>}
  </div>
);
