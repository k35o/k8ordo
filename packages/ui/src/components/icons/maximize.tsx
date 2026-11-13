import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const MaximizeIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2.75 6V4.5A1.75 1.75 0 0 1 4.5 2.75H6M10 2.75h1.5a1.75 1.75 0 0 1 1.75 1.75V6M13.25 10v1.5a1.75 1.75 0 0 1-1.75 1.75H10M6 13.25H4.5a1.75 1.75 0 0 1-1.75-1.75V10" />
  </LineIcon>
);
