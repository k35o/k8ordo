import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const SmileIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="8" cy="8" r="6" />
    <path d="M5.5 9.5a3 3 0 0 0 5 0M6 6.5h.01M10 6.5h.01" />
  </LineIcon>
);
