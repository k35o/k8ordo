import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ThumbsUpIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M5 7.25l2.4-4.3a1.6 1.6 0 0 1 2.85 1.35L9.5 6.75h2.9a1.6 1.6 0 0 1 1.55 2l-.95 3.6a1.9 1.9 0 0 1-1.85 1.4H3.5a1.25 1.25 0 0 1-1.25-1.25v-4A1.25 1.25 0 0 1 3.5 7.25H5v6.5" />
  </LineIcon>
);
