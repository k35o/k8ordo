'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type {
  ChangeEvent,
  CSSProperties,
  FC,
  HTMLAttributes,
  Ref,
} from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { useMessages } from '../../../i18n/context';
import { rangeInputClass } from '../slider/range-input-class';

type BaseProps = {
  min?: number;
  max?: number;
  step?: number;
  /** 下側・上側のつまみがそれぞれ送る名前。 */
  name?: readonly [string, string];
  invalid?: boolean;
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'children' | 'defaultValue' | 'onChange' | 'role'
>;

type ControlledProps = {
  value: readonly [number, number];
  onChange: (value: [number, number]) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: readonly [number, number];
  value?: never;
  onChange?: (value: [number, number]) => void;
};

type Props = BaseProps & (ControlledProps | UncontrolledProps);

const percentOf = (value: number, min: number, max: number): string => {
  const span = max > min ? max - min : 1;
  const ratio = Math.min(Math.max((value - min) / span, 0), 1);
  return `${String(ratio * 100)}%`;
};

export const RangeSlider: FC<Props> = ({
  min = 0,
  max = 100,
  step = 1,
  name,
  value,
  defaultValue,
  onChange,
  invalid = false,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ref,
  ...rest
}) => {
  const messages = useMessages();
  const id = useId();
  const { pending } = useFormStatus();
  const disabledResolved = disabled || pending;
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  // 非制御のつまみは defaultValue で描き、値は DOM に持たせる。こうすると
  // フォームの reset と変更の有無（value と defaultValue の比較）がネイティブの
  // まま効く。ここに持つのは塗りを描くための写しだけ
  const [shown, setShown] = useState<readonly [number, number]>(
    defaultValue ?? [min, max],
  );
  const [start, end] = value ?? shown;

  useEffect(() => {
    const form = startRef.current?.form;
    if (isControlled || form === null || form === undefined) {
      return undefined;
    }
    const handleReset = () => {
      // reset イベントの時点ではまだ値が戻っていない
      setTimeout(() => {
        const startInput = startRef.current;
        const endInput = endRef.current;
        if (startInput !== null && endInput !== null) {
          setShown([Number(startInput.value), Number(endInput.value)]);
        }
      }, 0);
    };
    form.addEventListener('reset', handleReset);
    return () => {
      form.removeEventListener('reset', handleReset);
    };
  }, [isControlled]);

  // つまみは互いを越えない。制御モードでは React が値を戻すので、DOM に
  // 書き戻すのは非制御のときだけ
  const commit =
    (edge: 'start' | 'end') => (event: ChangeEvent<HTMLInputElement>) => {
      const typed = Number(event.target.value);
      const next =
        edge === 'start' ? Math.min(typed, end) : Math.max(typed, start);
      if (!isControlled && next !== typed) {
        event.target.value = String(next);
      }
      const pair: [number, number] =
        edge === 'start' ? [next, end] : [start, next];
      if (!isControlled) {
        setShown(pair);
      }
      onChange?.(pair);
    };

  const groupNameId = `${id}-name`;
  const startNameId = `${id}-start`;
  const endNameId = `${id}-end`;
  const groupName =
    ariaLabelledBy ?? (ariaLabel === undefined ? undefined : groupNameId);
  const thumbName = (own: string) =>
    groupName === undefined ? own : `${groupName} ${own}`;
  // 両端が重なって上側の端にあるとき、上に重なった方が動けなくならないよう、
  // 中点より右にある下側のつまみを前に出す
  const startOnTop = start > min + (max - min) / 2;

  const thumbClass = (onTop: boolean) =>
    cn(
      rangeInputClass(invalid),
      'pointer-events-none [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto',
      onTop ? 'z-20' : 'z-10',
    );
  const thumbValue = (edge: 0 | 1) =>
    isControlled
      ? { value: edge === 0 ? start : end }
      : { defaultValue: (defaultValue ?? [min, max])[edge] };

  return (
    <div
      {...rest}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'relative flex items-center justify-center',
        'block-8 inline-full vertical:inline-48',
        disabledResolved && 'opacity-50',
      )}
      ref={ref}
      role="group"
      style={
        {
          '--range-start': percentOf(start, min, max),
          '--range-end': percentOf(end, min, max),
        } as CSSProperties
      }
    >
      {ariaLabel !== undefined && ariaLabelledBy === undefined ? (
        <span hidden id={groupNameId}>
          {ariaLabel}
        </span>
      ) : null}
      <span hidden id={startNameId}>
        {messages.rangeSliderStart}
      </span>
      <span hidden id={endNameId}>
        {messages.rangeSliderEnd}
      </span>
      <span
        aria-hidden
        className="bg-bg-mute relative rounded-full block-2 inline-full"
      >
        <span
          aria-hidden
          className={cn(
            'bg-primary-bg absolute inset-be-0 inset-s-(--range-start) block-full inline-[calc(var(--range-end)-var(--range-start))] rounded-full',
            invalid && 'bg-bg-error',
          )}
        />
      </span>
      <input
        {...thumbValue(0)}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid}
        aria-labelledby={thumbName(startNameId)}
        aria-valuemax={end}
        className={thumbClass(startOnTop)}
        disabled={disabledResolved}
        max={max}
        min={min}
        name={name?.[0]}
        onChange={commit('start')}
        ref={startRef}
        step={step}
        type="range"
      />
      <input
        {...thumbValue(1)}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid}
        aria-labelledby={thumbName(endNameId)}
        aria-valuemin={start}
        className={thumbClass(!startOnTop)}
        disabled={disabledResolved}
        max={max}
        min={min}
        name={name?.[1]}
        onChange={commit('end')}
        ref={endRef}
        step={step}
        type="range"
      />
    </div>
  );
};
