import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const MonitorIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="8.25" rx="2.25" width="11.5" x="2.25" y="2.5" />
    <path d="M5.75 13.5h4.5M8 10.75v2.75" />
  </LineIcon>
);
