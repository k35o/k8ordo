import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const RedoIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="m10.5 3.5 2.75 2.75L10.5 9M13.25 6.25H6.5a3.25 3.25 0 0 0 0 6.5h3.25" />
  </LineIcon>
);
