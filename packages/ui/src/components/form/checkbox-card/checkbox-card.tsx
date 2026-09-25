'use client';

import type {
  ChangeEvent,
  FC,
  FieldsetHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';
import { useId } from 'react';

import { cn } from '../../../helpers/cn';
import { CheckIcon } from '../../icons';

export type CheckboxCardOption = Readonly<{
  value: string;
  label: string;
  description?: string;
  visual?: ReactNode;
  disabled?: boolean;
}>;

type BaseProps = {
  'aria-labelledby': string;
  invalid?: boolean;
  options: readonly CheckboxCardOption[];
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
  value: string[];
  onChange: (value: string[]) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: string[];
  value?: never;
  onChange?: (value: string[]) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

export const CheckboxCard: FC<Props> = ({
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
  const isControlled = value !== undefined;

  // 非制御のときは値を state に写さず DOM に持たせる。form の reset は change を
  // 飛ばさずに checked を戻すので、写した state は取り残される。通知する値も、
  // 変更を受けた時点の各 input の checked から読む
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputs =
      event.currentTarget
        .closest('fieldset')
        ?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ?? [];
    onChange?.(
      [...inputs].filter((input) => input.checked).map((input) => input.value),
    );
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
      role="group"
    >
      {options.map((option) => {
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
              // 非制御のとき、form の reset は change を飛ばさずに checked を戻すので、
              // 見た目は state ではなく input の :checked から引く
              'has-checked:border-primary-border has-checked:bg-primary-bg-subtle hover:has-checked:bg-primary-bg-mute',
              invalid
                ? 'border-border-error has-checked:border-border-error'
                : 'border-border-mute hover:bg-bg-subtle',
              optionDisabled &&
                'cursor-not-allowed border-border-mute bg-bg-subtle text-fg-mute has-checked:border-border-mute has-checked:bg-bg-subtle',
            )}
            id={optionId}
            key={option.value}
          >
            <input
              aria-describedby={
                hasDescription ? `${optionId}-description` : undefined
              }
              aria-labelledby={`${optionId}-label`}
              {...(isControlled
                ? { checked: value.includes(option.value) }
                : { defaultChecked: defaultValue?.includes(option.value) })}
              className="peer sr-only"
              disabled={optionDisabled}
              name={name}
              onChange={handleChange}
              type="checkbox"
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
              className="border-border-mute bg-bg-base peer-checked:border-border-base peer-checked:bg-primary-bg peer-checked:text-fg-base mt-0.5 ml-4 inline-flex size-5 shrink-0 items-center justify-center rounded-md border *:invisible peer-checked:*:visible"
            >
              <CheckIcon size="sm" />
            </span>
          </label>
        );
      })}
    </fieldset>
  );
};
