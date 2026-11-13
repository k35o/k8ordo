import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const UploadIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M8 10.25V2.5M4.75 5.75 8 2.5l3.25 3.25" />
    <path d="M2.75 10.75v1a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2v-1" />
  </LineIcon>
);
