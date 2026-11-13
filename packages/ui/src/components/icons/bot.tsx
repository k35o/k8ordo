import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const BotIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <rect height="7.5" rx="2.25" width="8.5" x="3.75" y="5.75" />
    <path d="M8 5.75V3M1.75 9v1.5M14.25 9v1.5M6.5 8.75V10M9.5 8.75V10" />
  </LineIcon>
);
