import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const SendIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M13.5 2.5 9.5 13.5 7.25 8.75 2.5 6.5zM13.5 2.5 7.25 8.75" />
  </LineIcon>
);
