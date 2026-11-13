import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PackageIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M7.22 2.45Q8 2 8.78 2.45l3.69 2.1q.78.45.78 1.35v4.2q0 .9-.78 1.35l-3.69 2.1Q8 14 7.22 13.55l-3.69-2.1q-.78-.45-.78-1.35V5.9q0-.9.78-1.35z" />
    <path d="M3.1 5.2 8 8l4.9-2.8M8 8v5.75" />
  </LineIcon>
);
