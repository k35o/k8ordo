import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ChevronsUpDownIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M4.75 6 8 2.75 11.25 6M4.75 10 8 13.25 11.25 10" />
  </LineIcon>
);
