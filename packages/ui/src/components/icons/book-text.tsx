import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const BookTextIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M12.5 10.25H5.25a1.75 1.75 0 0 0 0 3.5h6.5a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-.75-.75h-6.5A1.75 1.75 0 0 0 3.5 4v8" />
    <path d="M6.5 5.25H10M6.5 7.5h2" />
  </LineIcon>
);
