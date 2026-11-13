import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const SearchIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.25 10.25 13.5 13.5" />
  </LineIcon>
);
