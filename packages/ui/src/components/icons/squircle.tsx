import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const SquircleIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M8 2.25c4.5 0 5.75 1.25 5.75 5.75S12.5 13.75 8 13.75 2.25 12.5 2.25 8 3.5 2.25 8 2.25z" />
  </LineIcon>
);
