'use client';

import { createContext, use, useMemo } from 'react';
import type {
  ChangeEvent,
  FC,
  FieldsetHTMLAttributes,
  PropsWithChildren,
  Ref,
} from 'react';

import { cn } from '../../../helpers/cn';

type CheckboxGroupContextValue = {
  /** 制御モードの値。非制御では undefined で、各項目は defaultValue から始める */
  value: string[] | undefined;
  defaultValue: string[];
  disabled: boolean;
  name: string;
  notifyChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const CheckboxGroupContext = createContext<
  CheckboxGroupContextValue | undefined
>(undefined);

export const useCheckboxGroupContext = () => use(CheckboxGroupContext);

type RootBaseProps = PropsWithChildren<
  {
    'aria-labelledby': string;
    invalid?: boolean;
    name: string;
    ref?: Ref<HTMLFieldSetElement>;
  } & Omit<
    FieldsetHTMLAttributes<HTMLFieldSetElement>,
    | 'className'
    | 'style'
    | 'onChange'
    | 'defaultValue'
    | 'name'
    | 'aria-labelledby'
    | 'role'
  >
>;

type RootControlledProps = {
  value: string[];
  onChange: (value: string[]) => void;
  defaultValue?: never;
};

type RootUncontrolledProps = {
  defaultValue?: string[];
  value?: never;
  onChange?: (value: string[]) => void;
};

type RootProps = RootBaseProps & (RootControlledProps | RootUncontrolledProps);

const Root: FC<RootProps> = ({
  'aria-labelledby': labelledbyId,
  children,
  defaultValue,
  disabled = false,
  invalid = false,
  name,
  onChange,
  ref,
  value,
  ...rest
}) => {
  // 非制御のときは値を state に写さず DOM に持たせる。form の reset は change を
  // 飛ばさずに checked を戻すので、写した state は取り残される
  const contextValue = useMemo<CheckboxGroupContextValue>(
    () => ({
      value,
      defaultValue: defaultValue ?? [],
      disabled,
      name,
      notifyChange: (event) => {
        const inputs =
          event.currentTarget
            .closest('fieldset')
            ?.querySelectorAll<HTMLInputElement>(
              `input[type="checkbox"][name="${CSS.escape(name)}"]`,
            ) ?? [];
        onChange?.(
          [...inputs]
            .filter((input) => input.checked)
            .map((input) => input.value),
        );
      },
    }),
    [value, defaultValue, disabled, name, onChange],
  );

  return (
    <fieldset
      {...rest}
      aria-invalid={invalid}
      aria-labelledby={labelledbyId}
      className={cn('flex flex-col gap-2', disabled && 'cursor-not-allowed')}
      ref={ref}
    >
      <CheckboxGroupContext value={contextValue}>
        {children}
      </CheckboxGroupContext>
    </fieldset>
  );
};

export { Root as CheckboxGroupRoot };
