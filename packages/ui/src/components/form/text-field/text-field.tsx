'use client';

import { clsx } from 'clsx';
import type {
  FC,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  Ref,
} from 'react';
import { useFormStatus } from 'react-dom';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './text-field.module.css';

// 1 行の入力欄として描けるものを並べる。number は NumberField、password は
// PasswordInput、file は FileField が別途あり、checkbox / radio / color 等は
// 見た目が別物になる
export type TextInputType = Extract<
  HTMLInputTypeAttribute,
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
>;

type Props = {
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
  // ネイティブの type（React の HTMLInputTypeAttribute）と同じく任意の文字列を
  // 受ける。候補は 1 行の入力欄として描けるものに絞り、補完のために並べる
  type?: TextInputType | (string & Record<never, never>);
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'type'>;

export const TextField: FC<Props> = ({
  invalid = false,
  readOnly,
  ref,
  type = 'text',
  ...rest
}) => {
  const { pending } = useFormStatus();
  return (
    <input
      aria-invalid={invalid}
      className={clsx(styles.root, focusRing.ring)}
      readOnly={pending || readOnly}
      ref={ref}
      type={type}
      {...rest}
    />
  );
};
