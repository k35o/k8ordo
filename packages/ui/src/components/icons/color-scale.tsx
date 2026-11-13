import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ColorScaleIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="3.85" rx="1.25" width="6.25" x="2.25" y="2.25" />
    <rect height="3.85" rx="1.25" width="6.25" x="4.9" y="6.1" />
    <rect
      fill="currentColor"
      height="3.8"
      rx="1.25"
      width="6.25"
      x="7.5"
      y="9.95"
    />
  </LineIcon>
);
