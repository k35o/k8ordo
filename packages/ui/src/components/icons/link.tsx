import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const LinkIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path
      d="M6.75 10.75h-1.5a2.75 2.75 0 0 1 0-5.5h1.5M9.25 5.25h1.5a2.75 2.75 0 0 1 0 5.5h-1.5M5.75 8h4.5"
      transform="rotate(-45 8 8)"
    />
  </LineIcon>
);
