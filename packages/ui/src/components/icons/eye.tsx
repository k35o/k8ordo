import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const EyeIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M1.75 8C3.1 5.1 5.3 3.5 8 3.5s4.9 1.6 6.25 4.5c-1.35 2.9-3.55 4.5-6.25 4.5S3.1 10.9 1.75 8z" />
    <circle cx="8" cy="8" r="2" />
  </LineIcon>
);
