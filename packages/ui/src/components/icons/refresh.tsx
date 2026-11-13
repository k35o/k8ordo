import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const RefreshIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2.25 8a5.75 5.75 0 0 1 11-2.35M13.25 2.5v3.15H10.1" />
    <path d="M13.75 8a5.75 5.75 0 0 1-11 2.35M2.75 13.5v-3.15H5.9" />
  </LineIcon>
);
