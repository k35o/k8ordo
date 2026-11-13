import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const EyeClosedIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2 5c1.4 2.5 3.5 3.75 6 3.75S12.6 7.5 14 5" />
    <path d="M8 8.75V11M4.5 7.8 3.4 9.55M11.5 7.8l1.1 1.75" />
  </LineIcon>
);
