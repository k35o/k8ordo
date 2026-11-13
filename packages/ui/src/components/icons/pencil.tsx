import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PencilIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="m2.5 13.5.8-3.2 7.45-7.45a1.7 1.7 0 0 1 2.4 2.4L5.7 12.7zM9.5 4.1l2.4 2.4" />
  </LineIcon>
);
