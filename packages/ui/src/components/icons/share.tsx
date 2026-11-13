import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ShareIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="4.25" cy="8" r="1.6" />
    <circle cx="11.75" cy="4" r="1.6" />
    <circle cx="11.75" cy="12" r="1.6" />
    <path d="M5.66 7.25 10.34 4.75M5.66 8.75l4.68 2.5" />
  </LineIcon>
);
