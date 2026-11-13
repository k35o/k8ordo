import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const FolderIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M2.25 5v6.5a2 2 0 0 0 2 2h7.5a2 2 0 0 0 2-2V6.75a2 2 0 0 0-2-2H8.6a1 1 0 0 1-.8-.4l-.7-.95a1 1 0 0 0-.8-.4H4.25a2 2 0 0 0-2 2z" />
  </LineIcon>
);
