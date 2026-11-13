import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PlayIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M4.25 3.6v8.8a.9.9 0 0 0 1.36.77l7.1-4.4a.9.9 0 0 0 0-1.54l-7.1-4.4a.9.9 0 0 0-1.36.77z" />
  </LineIcon>
);
