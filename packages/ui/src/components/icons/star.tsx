import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const StarIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M8 2.25 9.62 6.28l4.32.29-3.32 2.78 1.05 4.21L8 11.25l-3.67 2.31 1.05-4.21-3.32-2.78 4.32-.29z" />
  </LineIcon>
);
