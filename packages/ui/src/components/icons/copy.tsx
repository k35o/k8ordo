import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const CopyIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="8" rx="2.25" width="8" x="5.75" y="5.75" />
    <path d="M3.75 10.25a1.5 1.5 0 0 1-1.5-1.5V4.5A2.25 2.25 0 0 1 4.5 2.25h4.25a1.5 1.5 0 0 1 1.5 1.5" />
  </LineIcon>
);
