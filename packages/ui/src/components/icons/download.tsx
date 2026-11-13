import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const DownloadIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M8 2.5v7.75M4.75 7 8 10.25 11.25 7" />
    <path d="M2.75 10.75v1a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2v-1" />
  </LineIcon>
);
