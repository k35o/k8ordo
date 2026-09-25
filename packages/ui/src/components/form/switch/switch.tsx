'use client';

import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useId } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { FOCUS_RING_PEER_NO_BORDER } from '../../_internal/focus-ring';
import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';

type BaseProps = {
  invalid?: boolean;
  label: string;
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'role'
  | 'className'
  | 'style'
  | 'value'
  | 'onChange'
  | 'defaultChecked'
  | 'checked'
  | 'children'
>;

type ControlledProps = {
  checked: boolean;
  onChange: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  defaultChecked?: never;
};

type UncontrolledProps = {
  defaultChecked?: boolean;
  checked?: never;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

export const Switch: FC<Props> = ({
  checked,
  defaultChecked,
  id,
  disabled = false,
  invalid = false,
  required = false,
  label,
  onChange,
  ref,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { pending } = useFormStatus();
  const disabledResolved = disabled || pending;

  return (
    <label
      className={cn(
        'inline-flex w-fit items-center gap-3',
        disabledResolved ? 'cursor-not-allowed text-fg-mute' : 'cursor-pointer',
      )}
      htmlFor={inputId}
    >
      <span className="relative inline-flex shrink-0">
        <input
          {...rest}
          {...(checked === undefined ? { defaultChecked } : { checked })}
          aria-invalid={invalid}
          aria-required={required}
          className="peer sr-only"
          disabled={disabledResolved}
          id={inputId}
          onChange={(event) => {
            onChange?.(event.target.checked, event);
          }}
          ref={ref}
          required={required}
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- checkbox の input はネイティブの checked がそのまま switch の状態になる。aria-checked を別に持つと form の reset でずれる
          role="switch"
          type="checkbox"
        />
        <span
          aria-hidden
          className={cn(
            'inline-flex items-center rounded-full transition-colors',
            'h-7 w-12 vertical:h-12 vertical:w-7',
            invalid && 'ring-2 ring-border-error',
            // 非制御のとき、form の reset は change を飛ばさずに checked を戻すので、
            // 見た目は state ではなく input の :checked から引く
            disabledResolved
              ? 'bg-bg-subtle'
              : 'bg-bg-mute peer-checked:bg-primary-bg forced-colors:peer-checked:bg-[Highlight] forced-colors:peer-checked:*:bg-[HighlightText]',
            'peer-checked:*:translate-x-5 peer-checked:*:vertical:translate-x-0 peer-checked:*:vertical:translate-y-5',
            HIGH_CONTRAST_EDGE,
            FOCUS_RING_PEER_NO_BORDER,
            'peer-focus-visible:ring-offset-2',
          )}
        >
          <span
            className={cn(
              'ms-0.5 size-5 rounded-full bg-bg-base shadow-xs transition-transform forced-colors:bg-[CanvasText]',
              HIGH_CONTRAST_EDGE,
              disabledResolved && 'bg-bg-emphasize forced-colors:bg-[GrayText]',
            )}
          />
        </span>
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
};
