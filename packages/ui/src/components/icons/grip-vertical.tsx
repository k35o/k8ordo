import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const GripVerticalIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <circle cx="5.75" cy="3.5" fill="currentColor" r=".75" />
    <circle cx="5.75" cy="8" fill="currentColor" r=".75" />
    <circle cx="5.75" cy="12.5" fill="currentColor" r=".75" />
    <circle cx="10.25" cy="3.5" fill="currentColor" r=".75" />
    <circle cx="10.25" cy="8" fill="currentColor" r=".75" />
    <circle cx="10.25" cy="12.5" fill="currentColor" r=".75" />
  </LineIcon>
);
