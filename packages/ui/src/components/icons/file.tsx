import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const FileIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M9.25 2.25H5.5a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V5.5z" />
    <path d="M9.25 2.5v2a1 1 0 0 0 1 1h2" />
  </LineIcon>
);
