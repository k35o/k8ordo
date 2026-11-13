import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const FlaskIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M5.75 2.25h4.5M6.75 2.25v3.6L3.3 11.6a1.4 1.4 0 0 0 1.2 2.15h7a1.4 1.4 0 0 0 1.2-2.15L9.25 5.85v-3.6" />
    <path d="M4.3 10h7.4" />
  </LineIcon>
);
