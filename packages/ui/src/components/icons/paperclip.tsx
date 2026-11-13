import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PaperclipIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path
      d="M11.25 5.25v5.25a3.25 3.25 0 0 1-6.5 0V4.5a2.25 2.25 0 0 1 4.5 0v5.75a1 1 0 0 1-2 0V5.5"
      transform="rotate(45 8 8)"
    />
  </LineIcon>
);
