import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const RocketIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <g transform="rotate(45 8 8)">
      <path d="M8 1c1.65 1.35 2.5 3.2 2.5 5.25V10h-5V6.25C5.5 4.2 6.35 2.35 8 1z" />
      <circle cx="8" cy="5.75" r="1" />
      <path d="M5.5 7.25 3.75 9.25V11l1.75-.9M10.5 7.25l1.75 2V11l-1.75-.9M7 11.75c.2.6.5 1 1 1.4.5-.4.8-.8 1-1.4" />
    </g>
  </LineIcon>
);
