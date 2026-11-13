import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const UndoIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M5.5 3.5 2.75 6.25 5.5 9M2.75 6.25H9.5a3.25 3.25 0 0 1 0 6.5H6.25" />
  </LineIcon>
);
