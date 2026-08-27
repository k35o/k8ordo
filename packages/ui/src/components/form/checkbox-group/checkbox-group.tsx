'use client';

import { createContext, use, useCallback, useMemo } from 'react';
import type { FC, FieldsetHTMLAttributes, PropsWithChildren, Ref } from 'react';

import { cn } from '../../../helpers/cn';
import { useControllableState } from '../../../hooks/controllable-state';

type CheckboxGroupContextValue = {
  currentValue: string[];
  disabled: boolean;
  name: string;
  toggleValue: (value: string) => void;
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
  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });

  const toggleValue = useCallback(
    (targetValue: string) => {
      const nextValue = currentValue.includes(targetValue)
        ? currentValue.filter((item) => item !== targetValue)
        : [...currentValue, targetValue];

      setCurrentValue(nextValue);
    },
    [currentValue, setCurrentValue],
  );

  const contextValue = useMemo<CheckboxGroupContextValue>(
    () => ({
      currentValue,
      disabled,
      name,
      toggleValue,
    }),
    [currentValue, disabled, name, toggleValue],
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
