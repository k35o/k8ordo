import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const CircleHelpIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="8" cy="8" r="6" />
    <path d="M6.2 6.25a1.8 1.8 0 1 1 2.96 1.38c-.7.45-1.16.9-1.16 1.62M8 11.4h.01" />
  </LineIcon>
);
