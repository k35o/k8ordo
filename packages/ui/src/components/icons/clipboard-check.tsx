import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const ClipboardCheckIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <LineIcon size={size}>
    <rect height="2.5" rx="1" width="4.5" x="5.75" y="2" />
    <path d="M10.25 3.25h.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-5.5a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2h.5" />
    <path d="m6 9.25 1.5 1.5 2.5-3" />
  </LineIcon>
);
