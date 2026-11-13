import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PresentationIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M2 3h12M3.25 3v5.75A1.75 1.75 0 0 0 5 10.5h6a1.75 1.75 0 0 0 1.75-1.75V3" />
    <path d="M8 10.5v1.25M5.75 13.75 8 11.75l2.25 2" />
  </LineIcon>
);
