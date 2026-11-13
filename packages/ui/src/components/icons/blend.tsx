import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const BlendIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <circle cx="6.25" cy="6.25" r="4" />
    <circle cx="9.75" cy="9.75" r="4" />
  </LineIcon>
);
