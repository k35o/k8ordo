import { clsx } from 'clsx';
import type { FC } from 'react';

import styles from './field-message.module.css';

type Props = {
  id: string;
  errorText: string | undefined;
  helpText: string | undefined;
};

const filled = (text: string | undefined): text is string =>
  text !== undefined && text !== '';

export const hasErrorText = (errorText: string | undefined): boolean =>
  filled(errorText);

const messageIdOf = ({ id, errorText, helpText }: Props): string | undefined =>
  filled(errorText)
    ? `${id}-feedback`
    : filled(helpText)
      ? `${id}-helptext`
      : undefined;

export const describedByWith = (
  own: string | undefined,
  message: Props,
): string | undefined => {
  const ids = [own, messageIdOf(message)].filter(filled);
  return ids.length === 0 ? undefined : ids.join(' ');
};

// p や div は文の中（p や label の中）に置けない。Checkbox と Switch は文の中
// にも置けるよう、文も外枠も span にする
export const FieldMessage: FC<Props> = ({ id, errorText, helpText }) =>
  filled(errorText) ? (
    <span
      aria-live="polite"
      className={clsx(styles.message, styles.error)}
      id={`${id}-feedback`}
    >
      {errorText}
    </span>
  ) : filled(helpText) ? (
    <span className={clsx(styles.message, styles.help)} id={`${id}-helptext`}>
      {helpText}
    </span>
  ) : null;
