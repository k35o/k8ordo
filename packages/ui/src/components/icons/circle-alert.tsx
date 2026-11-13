import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const CircleAlertIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v3.5M8 10.75h.01" />
  </LineIcon>
);
