import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const UsersIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="5.75" cy="5.25" r="2.25" />
    <path d="M2 13.5c0-2.2 1.65-3.6 3.75-3.6s3.75 1.4 3.75 3.6M10 3a2.25 2.25 0 0 1 0 4.5M11.5 10.1c1.4.5 2.5 1.7 2.5 3.4" />
  </LineIcon>
);
