import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PauseIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="10" rx="1.25" width="3" x="3.75" y="3" />
    <rect height="10" rx="1.25" width="3" x="9.25" y="3" />
  </LineIcon>
);
