import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ExternalLinkIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <path d="M9.25 2.75h4v4M13.25 2.75 7.5 8.5" />
    <path d="M6.5 3.75H5A2.75 2.75 0 0 0 2.25 6.5V11A2.75 2.75 0 0 0 5 13.75h4.5A2.75 2.75 0 0 0 12.25 11V9.5" />
  </LineIcon>
);
