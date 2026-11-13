import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ImageIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="10.5" rx="2.25" width="11.5" x="2.25" y="2.75" />
    <circle cx="5.75" cy="6" r="1" />
    <path d="M13.75 10.25 10.9 7.4a1.25 1.25 0 0 0-1.77 0L3.5 13" />
  </LineIcon>
);
