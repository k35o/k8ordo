'use client';

import { useCallback, useMemo } from 'react';
import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { useFormStatus } from 'react-dom';

import { mergeRefs } from '../../../helpers/merge-refs';
import { FOCUS_RING_PEER } from '../../_internal/focus-ring';
import { CheckIcon, MinusIcon } from '../../icons';
import { useCheckboxGroupContext } from '../checkbox-group/checkbox-group';
import { cn } from './../../../helpers/cn';

type BaseProps = {
  indeterminate?: boolean;
  invalid?: boolean;
  itemValue?: string;
  label: string;
  labelHidden?: boolean;
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
  indeterminate = false,
  invalid = false,
  label,
  labelHidden = false,
  checked,
  defaultChecked,
  onChange,
  ref,
  ...rest
}) => {
  const groupContext = useCheckboxGroupContext();
  const { pending } = useFormStatus();
  const groupItemValue = itemValue ?? '';

  if (groupContext && (itemValue === undefined || itemValue === '')) {
    throw new Error('Checkbox inside CheckboxGroup requires itemValue');
  }

  // indeterminate は属性ではなく DOM のプロパティにしか無い
  const indeterminateRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (input !== null) input.indeterminate = indeterminate;
    },
    [indeterminate],
  );
  const mergedRef = useMemo(
    () => mergeRefs(ref, indeterminateRef),
    [ref, indeterminateRef],
  );

  const disabledResolved =
    disabled || groupContext?.disabled === true || pending;
  const isChecked = groupContext
    ? groupContext.currentValue.includes(groupItemValue)
    : checked;

  return (
    <label
      className={cn(
        'inline-flex items-center text-left',
        !labelHidden && 'gap-2',
        disabledResolved ? 'cursor-not-allowed text-fg-mute' : 'cursor-pointer',
      )}
    >
      <input
        {...rest}
        {...(isChecked === undefined
          ? { defaultChecked }
          : { checked: isChecked })}
        aria-invalid={invalid}
        className="peer sr-only"
        disabled={disabledResolved}
        name={groupContext?.name ?? name}
        onChange={(event) => {
          if (groupContext) {
            groupContext.toggleValue(groupItemValue);
            return;
          }

          onChange?.(event.target.checked, event);
        }}
        ref={mergedRef}
        type="checkbox"
        value={itemValue}
      />
      <span
        aria-hidden
        className={cn(
          'inline-flex size-5 items-center justify-center rounded-md border-2 transition-colors',
          FOCUS_RING_PEER,
          disabledResolved && 'border-border-mute bg-bg-mute',
          // 非制御のとき、form の reset は change を飛ばさずに checked を戻すので、
          // 見た目は state ではなく input の :checked から引く
          'border-border-mute bg-bg-base *:invisible',
          'peer-checked:border-border-base peer-checked:bg-primary-bg peer-checked:text-fg-base peer-checked:*:visible',
          'peer-indeterminate:border-border-base peer-indeterminate:bg-primary-bg peer-indeterminate:text-fg-base peer-indeterminate:*:visible',
          invalid && 'border-border-error peer-checked:border-border-error',
        )}
      >
        {indeterminate ? <MinusIcon size="sm" /> : <CheckIcon size="sm" />}
      </span>
      <span className={labelHidden ? 'sr-only' : 'text-lg'}>{label}</span>
    </label>
  );
};
