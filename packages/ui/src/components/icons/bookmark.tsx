import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const BookmarkIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M4.25 13.5V4.25a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2V13.5L8 10.75z" />
  </LineIcon>
);
