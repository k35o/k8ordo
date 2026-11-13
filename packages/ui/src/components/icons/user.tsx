import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const UserIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="8" cy="5" r="2.5" />
    <path d="M3 13.75c0-2.35 2.25-4 5-4s5 1.65 5 4" />
  </LineIcon>
);
