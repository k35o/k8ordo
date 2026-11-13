import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const EllipsisVerticalIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <circle cx="8" cy="3" fill="currentColor" r=".75" />
    <circle cx="8" cy="8" fill="currentColor" r=".75" />
    <circle cx="8" cy="13" fill="currentColor" r=".75" />
  </LineIcon>
);
