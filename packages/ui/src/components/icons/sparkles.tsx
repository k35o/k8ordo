import type { FC } from 'react';

import type { BaseIconProps } from './base';
import { LineIcon } from './line-icon';

export const SparklesIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <LineIcon size={size}>
    <path d="M7 2.5Q8.5 6.5 12.5 8 8.5 9.5 7 13.5 5.5 9.5 1.5 8 5.5 6.5 7 2.5z" />
    <path d="M12.5 1.75v3M11 3.25h3" />
  </LineIcon>
);
