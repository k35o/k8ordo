'use client';

import { useId, useState } from 'react';
import type {
  ComponentProps,
  FC,
  PropsWithChildren,
  ReactElement,
} from 'react';

import { useControllableState } from '../../../hooks/controllable-state';
import type { Option, Placement } from '../../../types/variables';
import { Button } from '../../buttons/button';
import { IconButton } from '../../buttons/icon-button';
import { CheckIcon, ChevronIcon } from '../../icons';
import { useListNavigation } from '../_internal/use-list-navigation';
import { Popover, useOpenContext } from '../popover';
import { cn } from './../../../helpers/cn';
import {
  MenuContextProvider,
  useMenuContent,
  useMenuItem,
  useMenuTrigger,
} from './hooks';

const Root: FC<
  PropsWithChildren<{
    placement?: Placement;
    options: readonly Option[];
    value?: Option['value'];
    defaultValue?: Option['value'];
    onChange?: (value: Option['value']) => void;
  }>
> = ({
  children,
  placement = 'bottom',
  options,
  value,
  defaultValue,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useControllableState<
    Option['value'] | undefined
  >({
    value,
    defaultValue,
    // 未選択（undefined）は初期状態としてのみ存在し、選択操作からは必ず値が来る。
    // 利用者に undefined を通知しないよう内部状態の型とは分けている
    onChange: (next) => {
      if (next !== undefined) {
        onChange?.(next);
      }
    },
  });

  return (
    <Popover.Root flipDisabled placement={placement} role="listbox">
      <MenuProvider
        onChange={setSelectedValue}
        options={options}
        value={selectedValue}
      >
        {children}
      </MenuProvider>
    </Popover.Root>
  );
};

const MenuProvider: FC<
  PropsWithChildren<{
    options: readonly Option[];
    value: Option['value'] | undefined;
    onChange: (value: Option['value']) => void;
  }>
> = ({ children, options, onChange, value }) => {
  const { isOpen } = useOpenContext();
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const nav = useListNavigation({
    open: isOpen,
    activeIndex,
    setActiveIndex,
    selectedIndex,
    loop: true,
  });

  const handleSelect = (index: number) => {
    const next = options[index]?.value;
    if (next !== undefined && next !== '') {
      onChange(next);
    }
  };

  return (
    <MenuContextProvider
      value={{ ...nav, options, selectedIndex, handleSelect }}
    >
      {children}
    </MenuContextProvider>
  );
};

const Content: FC<{
  helpContent?: ReactElement;
}> = ({ helpContent }) => {
  const { options, contentProps } = useMenuContent();
  const helpId = useId();

  return (
    <Popover.Content
      // helpContent は role="listbox" の直下に置くと aria-required-children 違反に
      // なるため listbox の外へ出す。ref（外側クリック判定）は最外周に置く。
      renderItem={({ ref, ...listProps }) => (
        <div
          className="bg-bg-raised border-border-subtle vertical:max-h-none vertical:min-w-0 vertical:max-w-48 vertical:min-h-40 flex max-h-48 min-w-40 flex-col rounded-lg border py-2 shadow-md"
          ref={ref}
        >
          {helpContent === undefined ? null : (
            <div id={helpId}>{helpContent}</div>
          )}
          <div
            {...listProps}
            {...contentProps}
            // listbox の外に出した helpContent を読み上げに繋ぎ直す。
            // トリガー側から参照すると閉じている間は空参照になるため listbox に付ける
            aria-describedby={helpContent === undefined ? undefined : helpId}
            className="vertical:overflow-x-auto vertical:overflow-y-visible flex min-h-0 min-w-0 flex-col overflow-y-auto"
          >
            {options.map(({ value, label }, idx) => (
              <Item index={idx} key={value} label={label} />
            ))}
          </div>
        </div>
      )}
    />
  );
};

const Item: FC<{
  label: Option['label'];
  index: number;
}> = ({ label, index }) => {
  const { props, selected } = useMenuItem(index);

  return (
    <button
      className={cn(
        'flex w-full items-center justify-between px-3 py-2 text-left transition-colors',
        'hover:bg-bg-subtle',
        'focus-visible:border-transparent focus-visible:bg-bg-subtle focus-visible:outline-hidden',
      )}
      type="button"
      {...props}
    >
      {label}
      {selected && (
        <span className="text-fg-success">
          <CheckIcon />
        </span>
      )}
    </button>
  );
};

// role="combobox" は「内容から名前を取る」ことができないため、現在値は
// 参照用の要素に包んで aria-labelledby で明示的に名前へ組み込む。
// label があれば「ラベル + 現在値」、無ければ従来どおり現在値だけが名前になる。
const useTriggerLabels = (label: string | undefined) => {
  const { valueLabel } = useMenuTrigger();
  const labelId = useId();
  const valueId = useId();

  return {
    valueLabel,
    labelId,
    valueId,
    labelledBy: label === undefined ? valueId : `${labelId} ${valueId}`,
  };
};

const Trigger: FC<{
  size?: ComponentProps<typeof Button>['size'];
  label?: string;
}> = ({ size = 'md', label }) => {
  const { valueLabel, labelId, valueId, labelledBy } = useTriggerLabels(label);

  return (
    <Popover.Trigger
      renderItem={(props) => (
        <>
          {label !== undefined && (
            <span className="sr-only" id={labelId}>
              {label}
            </span>
          )}
          <Button
            {...props}
            aria-labelledby={labelledBy}
            color="base"
            endIcon={<ChevronIcon direction="down" />}
            fullWidth
            size={size}
            type="button"
            variant="solid"
          >
            <span id={valueId}>{valueLabel}</span>
          </Button>
        </>
      )}
    />
  );
};

const IconTrigger: FC<{
  size?: ComponentProps<typeof Button>['size'];
  icon: ReactElement;
  label?: string;
}> = ({ size = 'md', icon, label }) => {
  const { valueLabel, labelId, valueId, labelledBy } = useTriggerLabels(label);

  return (
    <Popover.Trigger
      renderItem={(props) => (
        <>
          {label !== undefined && (
            <span className="sr-only" id={labelId}>
              {label}
            </span>
          )}
          <IconButton
            aria-labelledby={labelledBy}
            label={label ?? valueLabel}
            size={size}
            tooltipDisabled
            {...props}
          >
            {icon}
            {/* アイコンには可視テキストが無いので、現在値は読み上げ専用テキストで持つ */}
            <span className="sr-only" id={valueId}>
              {valueLabel}
            </span>
          </IconButton>
        </>
      )}
    />
  );
};

export const ListBox = {
  Root,
  Content,
  Trigger,
  IconTrigger,
} as const;
