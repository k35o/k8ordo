import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const SettingsIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M6.84 3.65L7.15 1.96L8.85 1.96L9.16 3.65A4.5 4.5 0 0 1 11.18 4.82L12.81 4.24L13.66 5.71L12.35 6.84A4.5 4.5 0 0 1 12.35 9.16L13.66 10.29L12.81 11.76L11.18 11.18A4.5 4.5 0 0 1 9.16 12.35L8.85 14.04L7.15 14.04L6.84 12.35A4.5 4.5 0 0 1 4.82 11.18L3.19 11.76L2.34 10.29L3.65 9.16A4.5 4.5 0 0 1 3.65 6.84L2.34 5.71L3.19 4.24L4.82 4.82A4.5 4.5 0 0 1 6.84 3.65z" />
    <circle cx="8" cy="8" r="1.9" />
  </LineIcon>
);
