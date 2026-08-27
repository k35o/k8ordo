import type { FC, HTMLAttributes } from 'react';

import { cn } from './../../../helpers/cn';

type Props = {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6;
} & Omit<HTMLAttributes<HTMLHeadingElement>, 'className' | 'style'>;

const LINE_CLAMP_CLASS = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
} as const;

export const Heading: FC<Props> = ({ children, level, lineClamp, ...rest }) => {
  const lineClampClass =
    lineClamp === undefined ? undefined : LINE_CLAMP_CLASS[lineClamp];
  if (level === 'h1') {
    return (
      <h1
        {...rest}
        className={cn('font-bold text-2xl md:text-3xl', lineClampClass)}
      >
        {children}
      </h1>
    );
  }
  if (level === 'h2') {
    return (
      <h2
        {...rest}
        className={cn('font-bold text-xl md:text-2xl', lineClampClass)}
      >
        {children}
      </h2>
    );
  }
  if (level === 'h3') {
    return (
      <h3
        {...rest}
        className={cn('font-bold text-lg md:text-xl', lineClampClass)}
      >
        {children}
      </h3>
    );
  }
  if (level === 'h4') {
    return (
      <h4
        {...rest}
        className={cn('font-bold text-md md:text-lg', lineClampClass)}
      >
        {children}
      </h4>
    );
  }
  if (level === 'h5') {
    return (
      <h5
        {...rest}
        className={cn('font-bold text-sm md:text-md', lineClampClass)}
      >
        {children}
      </h5>
    );
  }
  return (
    <h6
      {...rest}
      className={cn('font-bold text-xs md:text-sm', lineClampClass)}
    >
      {children}
    </h6>
  );
};
