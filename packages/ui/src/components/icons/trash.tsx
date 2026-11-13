import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const TrashIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2.75 4.25h10.5M6 4.25V3.5a1.25 1.25 0 0 1 1.25-1.25h1.5A1.25 1.25 0 0 1 10 3.5v.75" />
    <path d="m4 4.25.55 7.9a1.75 1.75 0 0 0 1.75 1.6h3.4a1.75 1.75 0 0 0 1.75-1.6l.55-7.9M6.75 7v4M9.25 7v4" />
  </LineIcon>
);
