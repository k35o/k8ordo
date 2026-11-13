import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const MapPinIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M8 14.25c-2.75-2.6-4.5-4.9-4.5-7.5a4.5 4.5 0 0 1 9 0c0 2.6-1.75 4.9-4.5 7.5z" />
    <circle cx="8" cy="6.75" r="1.75" />
  </LineIcon>
);
