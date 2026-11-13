import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PaintBucketIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M12 8.5 5.75 2.25M6.75 3.25l-4 4a1.5 1.5 0 0 0 0 2.1l3.15 3.15a1.5 1.5 0 0 0 2.1 0l4-4" />
    <path d="M2.5 8.5H12M13 10.75c.6.85 1 1.4 1 1.9a1 1 0 0 1-2 0c0-.5.4-1.05 1-1.9z" />
  </LineIcon>
);
