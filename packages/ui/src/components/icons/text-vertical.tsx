import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const TextVerticalIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M12.5 2.75v10.5M9 2.75v7M4.5 2.75v10.5M7 10.75l-2.5 2.5-2.5-2.5" />
  </LineIcon>
);
