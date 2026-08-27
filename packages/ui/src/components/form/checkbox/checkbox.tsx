'use client';

import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { FOCUS_RING_PEER } from '../../_internal/focus-ring';
import { CheckIcon } from '../../icons';
import { useCheckboxGroupContext } from '../checkbox-group/checkbox-group';
import { cn } from './../../../helpers/cn';
import { useControllableState } from './../../../hooks/controllable-state';

type BaseProps = {
  itemValue?: string;
  label: string;
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
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

export const Checkbox: FC<Props> = ({
  name,
  itemValue,
  disabled = false,
  label,
  checked,
  defaultChecked,
  onChange,
  ref,
  ...rest
}) => {
  const groupContext = useCheckboxGroupContext();
  const { pending } = useFormStatus();
  const [internalChecked, setInternalChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked ?? false,
  });
  const groupItemValue = itemValue ?? '';

  if (groupContext && (itemValue === undefined || itemValue === '')) {
    throw new Error('Checkbox inside CheckboxGroup requires itemValue');
  }

  const isControlled = checked !== undefined;
  const disabledResolved =
    disabled || groupContext?.disabled === true || pending;
  const isChecked = groupContext
    ? groupContext.currentValue.includes(groupItemValue)
    : internalChecked;

  const setChecked = (
    nextChecked: boolean,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setInternalChecked(nextChecked);
    onChange?.(nextChecked, event);
  };

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 text-left',
        disabledResolved ? 'cursor-not-allowed text-fg-mute' : 'cursor-pointer',
      )}
    >
      <input
        {...rest}
        {...(groupContext || isControlled
          ? { checked: isChecked }
          : { defaultChecked })}
        className="peer sr-only"
        disabled={disabledResolved}
        name={groupContext?.name ?? name}
        onChange={(event) => {
          if (groupContext) {
            groupContext.toggleValue(groupItemValue);
            return;
          }

          setChecked(event.target.checked, event);
        }}
        ref={ref}
        type="checkbox"
        value={groupContext ? groupItemValue : undefined}
      />
      <span
        aria-hidden
        className={cn(
          'inline-flex size-5 items-center justify-center rounded-md border-2 transition-colors',
          FOCUS_RING_PEER,
          disabledResolved && 'border-border-mute bg-bg-mute',
          isChecked
            ? 'border-border-base bg-primary-bg text-fg-base'
            : 'border-border-mute bg-bg-base',
        )}
      >
        {isChecked ? <CheckIcon size="sm" /> : null}
      </span>
      <span className="text-lg">{label}</span>
    </label>
  );
};
