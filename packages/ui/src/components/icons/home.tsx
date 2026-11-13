import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const HomeIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M3 6.9 7.15 3.1a1.3 1.3 0 0 1 1.7 0L13 6.9v5.35a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5z" />
    <path d="M6.5 13.75v-3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v3" />
  </LineIcon>
);
