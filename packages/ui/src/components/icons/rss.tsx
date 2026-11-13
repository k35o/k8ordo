import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const RssIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="3.5" cy="12.5" fill="currentColor" r=".75" />
    <path d="M2.75 7.25a6 6 0 0 1 6 6M2.75 2.75a10.5 10.5 0 0 1 10.5 10.5" />
  </LineIcon>
);
