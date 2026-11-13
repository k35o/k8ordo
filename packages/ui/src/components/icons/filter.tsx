import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const FilterIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2.5 3.25h11l-4.25 5.1v4.4l-2.5-1.25V8.35z" />
  </LineIcon>
);
