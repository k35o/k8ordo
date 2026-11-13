import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const BellIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M3.25 11.5c.9-.9 1.25-2 1.25-3.5V6.25a3.5 3.5 0 0 1 7 0V8c0 1.5.35 2.6 1.25 3.5z" />
    <path d="M6.75 13.5a1.4 1.4 0 0 0 2.5 0" />
  </LineIcon>
);
