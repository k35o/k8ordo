import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const SunIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="8" cy="8" r="2.75" />
    <path d="M8 1.75V3M8 13v1.25M1.75 8H3M13 8h1.25M3.58 3.58l.89.89M11.53 11.53l.89.89M3.58 12.42l.89-.89M11.53 4.47l.89-.89" />
  </LineIcon>
);
