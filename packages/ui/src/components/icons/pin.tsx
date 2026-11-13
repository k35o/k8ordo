import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PinIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path
      d="M5.5 3.5h5M6.25 3.5v3.6L4.6 9.6a.75.75 0 0 0 .63 1.15h5.54a.75.75 0 0 0 .63-1.15L9.75 7.1V3.5M8 10.75V15"
      transform="rotate(45 8 8)"
    />
  </LineIcon>
);
