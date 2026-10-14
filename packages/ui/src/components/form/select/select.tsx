'use client';

import { clsx } from 'clsx';
import { useLayoutEffect, useMemo, useRef } from 'react';
import type { FC, Ref, SelectHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

import type { Option } from '../../../types/variables';
import { ignoreSelectKeys } from '../../_internal/ignore-changes';
import { ChevronIcon } from '../../icons';
import { chain } from './../../../helpers/chain';
import { mergeRefs } from './../../../helpers/merge-refs';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './select.module.css';

type Props = {
  invalid?: boolean;
  options: readonly Option[];
  ref?: Ref<HTMLSelectElement>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'style'>;

export const Select: FC<Props> = ({
  invalid = false,
  options,
  disabled = false,
  defaultValue,
  onKeyDown,
  ref,
  ...rest
}) => {
  const { pending } = useFormStatus();
  const selectRef = useRef<HTMLSelectElement>(null);
  const mergedRef = useMemo(() => mergeRefs(selectRef, ref), [ref]);
  const defaultKey =
    defaultValue === undefined ? undefined : JSON.stringify(defaultValue);

  // React は select の defaultValue をマウント時にしか反映しないので、あとから
  // 変わった既定値（送信に失敗した値のエコー）はここで defaultSelected に書く。
  // 送信後の自動リセットはこれより先に走るが、各 option の dirtiness を消すので、
  // 選択は新しい既定値に追従する。選び直したあとの選択は動かさない
  useLayoutEffect(() => {
    const select = selectRef.current;
    if (select === null || defaultKey === undefined) {
      return;
    }
    const defaults = new Set(
      [JSON.parse(defaultKey) as unknown].flat().map(String),
    );
    for (const option of select.options) {
      option.defaultSelected = defaults.has(option.value);
    }
  }, [defaultKey]);

  return (
    <div
      className={clsx(
        styles.root,
        invalid && styles.invalid,
        (disabled || pending) && styles.disabled,
        focusRing.ringWithin,
      )}
    >
      <select
        aria-disabled={pending || undefined}
        aria-invalid={invalid}
        className={clsx(styles.select, pending && styles.pending)}
        defaultValue={defaultValue}
        disabled={disabled}
        onKeyDown={chain(onKeyDown, pending ? ignoreSelectKeys : undefined)}
        ref={mergedRef}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span aria-hidden className={styles.chevron}>
        <ChevronIcon direction="down" size="sm" />
      </span>
    </div>
  );
};
