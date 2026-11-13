import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const LogInIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M9.5 2.5h2.25a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9.5" />
    <path d="M2.5 8h7.25M6.75 5l3 3-3 3" />
  </LineIcon>
);
