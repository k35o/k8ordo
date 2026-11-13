import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const CircleCheckIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <circle cx="8" cy="8" r="6" />
    <path d="m5.5 8.25 1.75 1.75 3.25-3.5" />
  </LineIcon>
);
