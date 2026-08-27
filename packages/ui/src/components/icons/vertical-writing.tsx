import type { FC } from 'react';

import { BaseIcon } from './base';
import type { BaseIconProps, IconRenderProps } from './base';

const VerticalWriting: FC<IconRenderProps> = ({ className, ...rest }) => (
  <svg
    className={className}
    {...rest}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 7v14" />
    <path d="M17 8v4" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    <path d="M7 8v4" />
  </svg>
);

export const VerticalWritingIcon: FC<Partial<BaseIconProps>> = ({
  size = 'md',
}) => (
  <BaseIcon
    renderItem={(props) => <VerticalWriting {...props} />}
    size={size}
  />
);
