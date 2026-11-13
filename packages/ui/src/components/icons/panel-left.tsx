import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PanelLeftIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="10.5" rx="2.25" width="11.5" x="2.25" y="2.75" />
    <path d="M6.25 2.75v10.5" />
  </LineIcon>
);
