import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ArrowDownIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M8 2.75v10.5M3.75 9 8 13.25 12.25 9" />
  </LineIcon>
);
