import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const SquareIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="9.5" rx="1.5" width="9.5" x="3.25" y="3.25" />
  </LineIcon>
);
