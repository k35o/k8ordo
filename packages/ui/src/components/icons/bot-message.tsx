import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const BotMessageIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2.25 14V7A2.25 2.25 0 0 1 4.5 4.75h7A2.25 2.25 0 0 1 13.75 7v2.5a2.25 2.25 0 0 1-2.25 2.25H5z" />
    <path d="M8 4.75V2.5M6.25 7.75v1M9.75 7.75v1" />
  </LineIcon>
);
