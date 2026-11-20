import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const GitPullRequestIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <circle cx="4.5" cy="4" r="1.5" />
    <circle cx="11.5" cy="12" r="1.5" />
    <path d="M4.5 5.5v8M8 4h1.75a1.75 1.75 0 0 1 1.75 1.75v4.75" />
  </LineIcon>
);
