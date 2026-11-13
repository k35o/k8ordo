import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ArrowLeftIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M13.25 8H2.75M7 3.75 2.75 8 7 12.25" />
  </LineIcon>
);
