import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const CalendarIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="10.75" rx="2.5" width="11.5" x="2.25" y="3" />
    <path d="M2.25 6.75h11.5M5.5 1.75V4M10.5 1.75V4" />
  </LineIcon>
);
