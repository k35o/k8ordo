import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const GitForkIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="4.5" cy="4" r="1.5" />
    <circle cx="11.5" cy="4" r="1.5" />
    <circle cx="8" cy="12" r="1.5" />
    <path d="M4.5 5.5v.75A1.75 1.75 0 0 0 6.25 8h3.5a1.75 1.75 0 0 0 1.75-1.75V5.5M8 8v2.5" />
  </LineIcon>
);
