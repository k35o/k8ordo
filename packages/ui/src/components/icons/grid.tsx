import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const GridIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="4.75" rx="1.5" width="4.75" x="2.25" y="2.25" />
    <rect height="4.75" rx="1.5" width="4.75" x="9" y="2.25" />
    <rect height="4.75" rx="1.5" width="4.75" x="2.25" y="9" />
    <rect height="4.75" rx="1.5" width="4.75" x="9" y="9" />
  </LineIcon>
);
