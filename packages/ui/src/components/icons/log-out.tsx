import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const LogOutIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M6.5 2.5H4.25a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2H6.5" />
    <path d="M6.25 8h7.25M10.5 5l3 3-3 3" />
  </LineIcon>
);
