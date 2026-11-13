import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ContrastIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" />
  </LineIcon>
);
