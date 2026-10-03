import type { Messages } from '../../i18n/messages';
import type { Status } from '../../types/variables';

export const STATUS_MESSAGE_KEY = {
  success: 'alertSuccess',
  info: 'alertInfo',
  warning: 'alertWarning',
  error: 'alertError',
} as const satisfies Record<Status, keyof Messages>;

export const STATUS_SURFACE = {
  success: 'bg-bg-success',
  info: 'bg-bg-info',
  warning: 'bg-bg-warning',
  error: 'bg-bg-error',
} as const satisfies Record<Status, string>;

export const STATUS_ICON = {
  success: 'text-fg-success',
  info: 'text-fg-info',
  warning: 'text-fg-warning',
  error: 'text-fg-error',
} as const satisfies Record<Status, string>;
