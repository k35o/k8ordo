import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const MessageCircleIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M8 2.25a5.75 5.75 0 1 1-2.9 10.72L2.5 13.5l.65-2.5A5.75 5.75 0 0 1 8 2.25z" />
  </LineIcon>
);
