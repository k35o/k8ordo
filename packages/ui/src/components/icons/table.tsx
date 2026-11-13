import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const TableIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="10.5" rx="2.25" width="11.5" x="2.25" y="2.75" />
    <path d="M2.25 6.25h11.5M2.25 9.75h11.5M8 6.25v7" />
  </LineIcon>
);
