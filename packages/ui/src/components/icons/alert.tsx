import type { FC } from 'react';

import type { Status } from '../../types/variables';
import type { BaseIconProps } from './base';
import { CircleAlertIcon } from './circle-alert';
import { CircleCheckIcon } from './circle-check';
import { InfoIcon } from './info';
import { TriangleAlertIcon } from './triangle-alert';

const ALERT_BY_STATUS = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: CircleAlertIcon,
} as const satisfies Record<Status, FC<Partial<BaseIconProps>>>;

export const AlertIcon: FC<Partial<BaseIconProps> & { status: Status }> = ({
  status,
  size = 'md',
}) => {
  const Alert = ALERT_BY_STATUS[status];
  return <Alert size={size} />;
};
