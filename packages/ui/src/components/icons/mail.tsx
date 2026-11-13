import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const MailIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="9.5" rx="2.25" width="12" x="2" y="3.25" />
    <path d="M2.75 5.5 7 8.5q1 .7 2 0l4.25-3" />
  </LineIcon>
);
