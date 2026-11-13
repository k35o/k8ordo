import type { FC, PropsWithChildren } from 'react';

import { BaseIcon } from './base';
import type { BaseIconProps } from './base';

export const LineIcon: FC<PropsWithChildren<BaseIconProps>> = ({
  size,
  children,
}) => (
  <BaseIcon
    renderItem={(props) => (
      <svg
        {...props}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        viewBox="0 0 16 16"
      >
        {children}
      </svg>
    )}
    size={size}
  />
);
