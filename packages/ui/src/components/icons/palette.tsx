import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const PaletteIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M8 2.25a5.75 5.75 0 0 0 0 11.5h.5a1.5 1.5 0 0 0 1.1-2.5 1.5 1.5 0 0 1 1.1-2.5h1.05a2 2 0 0 0 2-2C13.75 4.2 11.2 2.25 8 2.25z" />
    <path d="M4.9 8.6h.01M6 5.6h.01M8.9 4.5h.01M11.4 6h.01" />
  </LineIcon>
);
