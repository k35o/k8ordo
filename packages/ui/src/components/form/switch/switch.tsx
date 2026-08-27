'use client';

import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useId } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { useControllableState } from '../../../hooks/controllable-state';
import { FOCUS_RING_PEER_NO_BORDER } from '../../_internal/focus-ring';

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
  const [isSelected, setSelected] = useControllableState({
    value: checked,
    defaultValue: defaultChecked ?? false,
  });
  const { pending } = useFormStatus();

  const isControlled = checked !== undefined;
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
          aria-checked={isSelected}
          aria-invalid={invalid}
          aria-required={required}
          {...(isControlled ? { checked: isSelected } : { defaultChecked })}
          className="peer sr-only"
          disabled={disabledResolved}
          id={inputId}
          onChange={(event) => {
            setSelected(event.target.checked);
            onChange?.(event.target.checked, event);
          }}
          ref={ref}
          required={required}
          role="switch"
          type="checkbox"
        />
        <span
          aria-hidden
          className={cn(
            'inline-flex items-center rounded-full transition-colors',
            'h-7 w-12 vertical:h-12 vertical:w-7',
            invalid && 'ring-2 ring-border-error',
            isSelected ? 'bg-primary-bg' : 'bg-bg-mute',
            disabledResolved && 'bg-bg-subtle',
            FOCUS_RING_PEER_NO_BORDER,
            'peer-focus-visible:ring-offset-2',
          )}
        >
          <span
            className={cn(
              'ms-0.5 size-5 rounded-full bg-bg-base shadow-xs transition-transform',
              isSelected &&
                'translate-x-5 vertical:translate-x-0 vertical:translate-y-5',
              disabledResolved && 'bg-bg-emphasize',
            )}
          />
        </span>
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
};
