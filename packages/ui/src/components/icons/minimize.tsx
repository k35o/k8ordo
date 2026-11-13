import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const MinimizeIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M6 2.75v2A1.25 1.25 0 0 1 4.75 6h-2M13.25 6h-2A1.25 1.25 0 0 1 10 4.75v-2M10 13.25v-2A1.25 1.25 0 0 1 11.25 10h2M2.75 10h2A1.25 1.25 0 0 1 6 11.25v2" />
  </LineIcon>
);
