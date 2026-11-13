import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const MoonIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M13.5 8.75A5.75 5.75 0 1 1 7.25 2.5a4.5 4.5 0 0 0 6.25 6.25z" />
  </LineIcon>
);
