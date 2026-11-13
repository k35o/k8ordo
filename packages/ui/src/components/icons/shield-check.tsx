import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ShieldCheckIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M8 2 12.75 3.75V7.5c0 3.05-1.75 5.2-4.75 6.5-3-1.3-4.75-3.45-4.75-6.5V3.75z" />
    <path d="m5.75 8 1.6 1.6 2.9-3.1" />
  </LineIcon>
);
