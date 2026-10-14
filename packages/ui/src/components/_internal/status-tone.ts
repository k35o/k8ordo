import type { Messages } from '../../i18n/messages';
import type { Status } from '../../types/variables';

import styles from './status-tone.module.css';

export const STATUS_MESSAGE_KEY = {
  success: 'alertSuccess',
  info: 'alertInfo',
  warning: 'alertWarning',
  error: 'alertError',
} as const satisfies Record<Status, keyof Messages>;

export const STATUS_SURFACE = {
  success: styles.surfaceSuccess,
  info: styles.surfaceInfo,
  warning: styles.surfaceWarning,
  error: styles.surfaceError,
} as const satisfies Record<Status, string>;

export const STATUS_ICON = {
  success: styles.iconSuccess,
  info: styles.iconInfo,
  warning: styles.iconWarning,
  error: styles.iconError,
} as const satisfies Record<Status, string>;
