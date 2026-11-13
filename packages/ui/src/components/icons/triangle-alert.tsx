import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const TriangleAlertIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M7.11 3.76Q8 2.25 8.89 3.76l4.72 7.98Q14.5 13.25 12.75 13.25h-9.5Q1.5 13.25 2.39 11.74z" />
    <path d="M8 6.25v3M8 11.25h.01" />
  </LineIcon>
);
