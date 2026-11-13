import type { FC } from 'react';

import type { Direction } from '../../types/variables';
import type { BaseIconProps } from './base';
import { ChevronDownIcon } from './chevron-down';
import { ChevronLeftIcon } from './chevron-left';
import { ChevronRightIcon } from './chevron-right';
import { ChevronUpIcon } from './chevron-up';

const CHEVRON_BY_DIRECTION = {
  up: ChevronUpIcon,
  down: ChevronDownIcon,
  left: ChevronLeftIcon,
  right: ChevronRightIcon,
} as const satisfies Record<Direction, FC<Partial<BaseIconProps>>>;

export const ChevronIcon: FC<
  Partial<BaseIconProps> & { direction: Direction }
> = ({ direction, size = 'md' }) => {
  const Chevron = CHEVRON_BY_DIRECTION[direction];
  return <Chevron size={size} />;
};
