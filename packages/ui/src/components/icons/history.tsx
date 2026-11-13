import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const HistoryIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2.75 5.65A5.75 5.75 0 1 1 2.34 9" />
    <path d="M2.75 2.5v3.15H5.9M8 5v3l2 1.25" />
  </LineIcon>
);
