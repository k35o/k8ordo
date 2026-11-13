import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ThumbsDownIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M11 8.75l-2.4 4.3a1.6 1.6 0 0 1-2.85-1.35L6.5 9.25H3.6a1.6 1.6 0 0 1-1.55-2l.95-3.6a1.9 1.9 0 0 1 1.85-1.4h7.65a1.25 1.25 0 0 1 1.25 1.25v4a1.25 1.25 0 0 1-1.25 1.25H11v-6.5" />
  </LineIcon>
);
