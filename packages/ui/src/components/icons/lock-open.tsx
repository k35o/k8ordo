import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const LockOpenIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="6.75" rx="2.25" width="10" x="3" y="7" />
    <path d="M5.25 7V4.75a2.75 2.75 0 0 1 5.35-.9" />
  </LineIcon>
);
