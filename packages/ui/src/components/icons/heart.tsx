import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const HeartIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M8 13.5C5 11.2 2.25 8.9 2.25 6.1A3.35 3.35 0 0 1 8 4.1a3.35 3.35 0 0 1 5.75 2c0 2.8-2.75 5.1-5.75 7.4z" />
  </LineIcon>
);
