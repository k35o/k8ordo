import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const CodeIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M5.25 5.25 2.5 8l2.75 2.75M10.75 5.25 13.5 8l-2.75 2.75M9.25 3.5l-2.5 9" />
  </LineIcon>
);
