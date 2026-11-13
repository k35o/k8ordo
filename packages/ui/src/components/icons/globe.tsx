import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const GlobeIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="8" cy="8" r="6" />
    <path d="M2 8h12M8 2c1.75 1.9 2.6 3.9 2.6 6s-.85 4.1-2.6 6c-1.75-1.9-2.6-3.9-2.6-6S6.25 3.9 8 2z" />
  </LineIcon>
);
