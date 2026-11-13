import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const FolderOpenIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M12.25 7.25v-.5a2 2 0 0 0-2-2H8.6a1 1 0 0 1-.8-.4l-.7-.95a1 1 0 0 0-.8-.4H4.25a2 2 0 0 0-2 2v6.5a2 2 0 0 0 2 2h5.9a1.75 1.75 0 0 0 1.53-.91l1.91-3.49a1.25 1.25 0 0 0-1.1-1.85H6.43a1.75 1.75 0 0 0-1.53.91L2.52 12.5" />
  </LineIcon>
);
