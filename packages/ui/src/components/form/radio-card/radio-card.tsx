'use client';

import type { FC, FieldsetHTMLAttributes, ReactNode, Ref } from 'react';
import { useId } from 'react';

import { cn } from '../../../helpers/cn';
import { useControllableState } from '../../../hooks/controllable-state';

export type RadioCardOption = Readonly<{
  value: string;
  label: string;
  description?: string;
  visual?: ReactNode;
  disabled?: boolean;
}>;

type BaseProps = {
  'aria-labelledby': string;
  invalid?: boolean;
  options: readonly RadioCardOption[];
  ref?: Ref<HTMLFieldSetElement>;
} & Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  | 'className'
  | 'style'
  | 'children'
  | 'onChange'
  | 'defaultValue'
  | 'aria-labelledby'
  | 'role'
>;

type ControlledProps = {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: string;
  value?: never;
  onChange?: (value: string) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

export const RadioCard: FC<Props> = ({
  'aria-labelledby': labelledbyId,
  name,
  disabled = false,
  invalid = false,
  options,
  value,
  defaultValue,
  onChange,
  ref,
  ...rest
}) => {
  const groupId = useId();
  const [currentValue, setCurrentValue] = useControllableState<
    string | undefined
  >({
    value,
    defaultValue,
  });

  const selectValue = (nextValue: string) => {
    setCurrentValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <fieldset
      {...rest}
      aria-labelledby={labelledbyId}
      className={cn(
        'm-0 min-w-0 border-0 p-0 inline-full',
        'grid gap-3',
        disabled && 'opacity-70',
      )}
      ref={ref}
      role="radiogroup"
    >
      {options.map((option) => {
        const checked = currentValue === option.value;
        const optionDisabled = disabled || option.disabled === true;
        const hasDescription =
          option.description !== undefined && option.description !== '';
        const hasVisual = option.visual !== undefined && option.visual !== null;
        const optionId = `${groupId}-${option.value}`;

        return (
          <label
            className={cn(
              'flex min-w-0 rounded-xl border bg-bg-base p-4 text-left transition-colors inline-full',
              'has-[input:focus-visible]:outline-hidden has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-border-info',
              checked &&
                'border-primary-border bg-primary-bg-subtle hover:bg-primary-bg-mute',
              invalid
                ? 'border-border-error'
                : !checked && 'border-border-mute hover:bg-bg-subtle',
              optionDisabled &&
                'cursor-not-allowed border-border-mute bg-bg-subtle text-fg-mute',
            )}
            id={optionId}
            key={option.value}
          >
            <input
              aria-describedby={
                hasDescription ? `${optionId}-description` : undefined
              }
              aria-labelledby={`${optionId}-label`}
              checked={checked}
              className="sr-only"
              disabled={optionDisabled}
              // 矢印キーのローミングと単一選択はブラウザが name 単位で束ねる。
              // name 未指定でも束ねるために一意な名前を割り当てる。
              name={name ?? groupId}
              onChange={() => {
                selectValue(option.value);
              }}
              type="radio"
              value={option.value}
            />
            {hasVisual ? (
              <span aria-hidden className="mr-4 shrink-0">
                {option.visual}
              </span>
            ) : null}
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span
                className="text-fg-base font-medium"
                id={`${optionId}-label`}
              >
                {option.label}
              </span>
              {hasDescription ? (
                <span
                  className="text-fg-mute text-sm"
                  id={`${optionId}-description`}
                >
                  {option.description}
                </span>
              ) : null}
            </span>
            <span
              aria-hidden
              className={cn(
                'mt-0.5 ml-4 inline-flex size-5 shrink-0 items-center justify-center rounded-full border',
                checked
                  ? 'border-border-base bg-primary-bg'
                  : 'border-border-mute bg-bg-base',
              )}
            >
              <span
                className={cn(
                  'size-2 rounded-full bg-primary-border transition-opacity',
                  checked ? 'opacity-100' : 'opacity-0',
                )}
              />
            </span>
          </label>
        );
      })}
    </fieldset>
  );
};
