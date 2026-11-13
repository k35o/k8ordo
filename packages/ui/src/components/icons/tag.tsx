import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const TagIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2.25 4v3.4a1.75 1.75 0 0 0 .5 1.25l4.7 4.7a1.75 1.75 0 0 0 2.5 0l3.4-3.4a1.75 1.75 0 0 0 0-2.5l-4.7-4.7a1.75 1.75 0 0 0-1.25-.5H4A1.75 1.75 0 0 0 2.25 4z" />
    <path d="M5.25 5.25h.01" />
  </LineIcon>
);
