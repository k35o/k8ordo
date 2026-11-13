import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ListIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M6 4.25h7.25M6 8h7.25M6 11.75h7.25" />
    <path d="M2.75 4.25h.01M2.75 8h.01M2.75 11.75h.01" />
  </LineIcon>
);
