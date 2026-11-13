import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const LightbulbIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M6 10.75c0-.75-.3-1.15-.83-1.67A4 4 0 1 1 10.83 9.08c-.53.52-.83.92-.83 1.67z" />
    <path d="M6.75 13.25h2.5" />
  </LineIcon>
);
