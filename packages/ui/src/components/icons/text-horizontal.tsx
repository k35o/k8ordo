import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const TextHorizontalIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M2.75 3.5h10.5M2.75 7h7M2.75 11.5h10.5M10.75 9l2.5 2.5-2.5 2.5" />
  </LineIcon>
);
