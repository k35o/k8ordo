'use client';

import {
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ChangeEvent,
  FC,
  InputHTMLAttributes,
  KeyboardEvent,
  Ref,
} from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { mergeRefs } from '../../../helpers/merge-refs';
import { getMessages } from '../../../i18n/current';
import { commitInputValue } from '../../../internal/commit-input-value';
import { hexToHsl, hslToHex, parseHex } from '../../../internal/hex-color';
import type { Hsl } from '../../../internal/hex-color';
import { FOCUS_RING, FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';
import { HIGH_CONTRAST_EDGE } from '../../_internal/high-contrast';
import { rangeInputClass } from '../slider/range-input-class';

export type ColorPickerSwatch = Readonly<{
  /** `#rrggbb` */
  value: string;
  /** 見本のボタンの名前（色の名前） */
  label: string;
}>;

type BaseProps = {
  invalid?: boolean;
  swatches?: readonly ColorPickerSwatch[];
  // @k8ordo/form の formFields は type を導くので受けて捨てる。値を運ぶ欄は
  // 常に 16 進のテキスト
  type?: string;
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'className'
  | 'style'
  | 'value'
  | 'onChange'
  | 'defaultValue'
  | 'children'
>;

type ControlledProps = {
  /** `#rrggbb`。空の欄は `''` */
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

// 色が無いあいだのつまみの位置。灰色なので、彩度を上げると色相が見える
const EMPTY: Hsl = { h: 0, s: 0, l: 50 };

const HUE_STOPS = [0, 60, 120, 180, 240, 300, 360]
  .map((hue) => `hsl(${String(hue)} 100% 50%)`)
  .join(', ');

const Channel: FC<{
  label: string;
  value: number;
  max: number;
  unit: string;
  stops: string;
  disabled: boolean;
  onChange: (value: number) => void;
}> = ({ label, value, max, unit, stops, disabled, onChange }) => {
  const id = useId();
  return (
    <>
      <label className="text-fg-mute text-sm" htmlFor={id}>
        {label}
      </label>
      <div
        className={cn(
          'relative flex items-center block-8 inline-full',
          disabled && 'opacity-50',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'rounded-full block-3 inline-full forced-color-adjust-none',
            '[--track-direction:to_right] rtl:[--track-direction:to_left]',
            HIGH_CONTRAST_EDGE,
            'forced-colors:outline-[CanvasText]',
          )}
          style={{
            backgroundImage: `linear-gradient(var(--track-direction), ${stops})`,
          }}
        />
        <input
          aria-valuetext={`${String(value)}${unit}`}
          className={rangeInputClass(false)}
          disabled={disabled}
          id={id}
          max={max}
          min={0}
          onChange={(event) => {
            onChange(Number(event.currentTarget.value));
          }}
          step={1}
          type="range"
          value={value}
        />
      </div>
    </>
  );
};

export const ColorPicker: FC<Props> = ({
  invalid = false,
  swatches,
  type: _type,
  value,
  defaultValue,
  onChange,
  disabled = false,
  readOnly = false,
  onBlur,
  onKeyDown,
  ref,
  ...rest
}) => {
  const messages = getMessages();
  const isControlled = value !== undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const initial = parseHex((isControlled ? value : defaultValue) ?? '', {
    shorthand: true,
  });
  // つまみの位置は 16 進から毎回導かずに持つ。灰色には色相が無く、導き直すと
  // 彩度を 0 にしたとたんに色相のつまみが端へ飛ぶ
  const [hsl, setHsl] = useState(() =>
    initial === null ? EMPTY : hexToHsl(initial),
  );
  // 描いている色。打ちかけの文字列のあいだは直前の色のまま
  const [shown, setShown] = useState(initial);
  // 打ちかけの文字列を React が持つのは制御モードだけ。非制御では DOM に持たせる。
  // React の制御下に置くと value 属性が現在の文字列に同期され続け、form の reset
  // が戻る先も、変更済みかどうかの基準も失われる
  const [draft, setDraft] = useState(value ?? '');
  const { pending } = useFormStatus();
  const locked = disabled || readOnly || pending;

  // 親が value を変えたとき、または onChange を採らずに据え置いたときに追いつく
  if (isControlled && parseHex(value, { shorthand: true }) !== shown) {
    const next = parseHex(value, { shorthand: true });
    setShown(next);
    setDraft(value);
    if (next !== null) {
      setHsl(hexToHsl(next, hsl.h));
    }
  }

  const handleRestored = useEffectEvent(() => {
    const input = inputRef.current;
    if (isControlled || input === null) {
      return;
    }
    const restored = parseHex(input.value, { shorthand: true });
    setShown(restored);
    setHsl(restored === null ? EMPTY : hexToHsl(restored, hsl.h));
  });

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) {
      return undefined;
    }
    // reset はブラウザが値を戻す前に飛ぶので、戻り切った値を読む
    const listener = () => {
      setTimeout(() => {
        handleRestored();
      }, 0);
    };
    form.addEventListener('reset', listener);
    return () => {
      form.removeEventListener('reset', listener);
    };
  }, []);

  const apply = (nextHsl: Hsl, hex = hslToHex(nextHsl)) => {
    setHsl(nextHsl);
    const input = inputRef.current;
    if (hex === shown || input === null) {
      return;
    }
    setShown(hex);
    if (isControlled) {
      setDraft(hex);
    }
    commitInputValue(input, hex);
    onChange?.(hex);
  };

  const handleType = (event: ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      setDraft(event.currentTarget.value);
    }
    const text = event.currentTarget.value.trim();
    const hex = parseHex(text);
    // 打ちかけのあいだは知らせない。空にしたことは知らせる
    if ((hex === null && text !== '') || hex === shown) {
      return;
    }
    setShown(hex);
    if (hex !== null) {
      setHsl(hexToHsl(hex, hsl.h));
    }
    onChange?.(hex ?? '');
  };

  // 打った `0D9488` や `#f80` は、離れるときに `#rrggbb` へそろえる。Enter の
  // 送信はそろえる前に値を読むので、そこでもそろえる
  const normalize = (input: HTMLInputElement) => {
    const hex = parseHex(input.value, { shorthand: true });
    if (hex === null || input.readOnly) {
      return;
    }
    if (isControlled) {
      setDraft(hex);
    }
    commitInputValue(input, hex);
    if (hex !== shown) {
      setShown(hex);
      setHsl(hexToHsl(hex, hsl.h));
      onChange?.(hex);
    }
  };

  return (
    <div className="writing-h flex flex-col gap-3 inline-full">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            'size-10 shrink-0 rounded-lg border border-border-base forced-color-adjust-none forced-colors:border-[CanvasText]',
            shown === null && 'border-dashed',
          )}
          style={shown === null ? undefined : { backgroundColor: shown }}
        />
        <input
          autoComplete="off"
          maxLength={7}
          pattern="#[0-9a-fA-F]{6}"
          spellCheck={false}
          {...rest}
          {...(isControlled
            ? { value: draft }
            : { defaultValue: defaultValue ?? '' })}
          aria-invalid={invalid}
          className={cn(
            'rounded-xl border border-border-base bg-bg-base px-3 py-2 inline-full',
            'aria-invalid:border-border-error',
            'disabled:cursor-not-allowed disabled:border-border-mute disabled:bg-bg-mute hover:disabled:bg-bg-mute',
            'read-only:cursor-not-allowed read-only:bg-bg-subtle',
            FOCUS_RING,
          )}
          disabled={disabled}
          onBlur={(event) => {
            normalize(event.currentTarget);
            onBlur?.(event);
          }}
          onChange={handleType}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
              normalize(event.currentTarget);
            }
            onKeyDown?.(event);
          }}
          readOnly={readOnly || pending}
          ref={mergedRef}
          type="text"
        />
      </div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3">
        <Channel
          disabled={locked}
          label={messages.colorPickerHue}
          max={359}
          onChange={(h) => {
            apply({ ...hsl, h });
          }}
          stops={HUE_STOPS}
          unit="°"
          value={hsl.h}
        />
        <Channel
          disabled={locked}
          label={messages.colorPickerSaturation}
          max={100}
          onChange={(s) => {
            apply({ ...hsl, s });
          }}
          stops={`hsl(${String(hsl.h)} 0% ${String(hsl.l)}%), hsl(${String(hsl.h)} 100% ${String(hsl.l)}%)`}
          unit="%"
          value={hsl.s}
        />
        <Channel
          disabled={locked}
          label={messages.colorPickerLightness}
          max={100}
          onChange={(l) => {
            apply({ ...hsl, l });
          }}
          stops={`hsl(${String(hsl.h)} ${String(hsl.s)}% 0%), hsl(${String(hsl.h)} ${String(hsl.s)}% 50%), hsl(${String(hsl.h)} ${String(hsl.s)}% 100%)`}
          unit="%"
          value={hsl.l}
        />
      </div>
      {swatches === undefined || swatches.length === 0 ? null : (
        <div
          aria-label={messages.colorPickerSwatches}
          className="flex flex-wrap gap-2"
          role="group"
        >
          {swatches.map((swatch) => {
            const hex = parseHex(swatch.value);
            return hex === null ? null : (
              <button
                aria-label={swatch.label}
                aria-pressed={hex === shown}
                className={cn(
                  'size-7 rounded-md border border-border-base forced-color-adjust-none forced-colors:border-[CanvasText]',
                  'aria-pressed:outline-2 aria-pressed:outline-offset-2 aria-pressed:outline-fg-base forced-colors:aria-pressed:outline-[CanvasText]',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  FOCUS_RING_NO_BORDER,
                )}
                disabled={locked}
                key={swatch.value}
                onClick={() => {
                  apply(hexToHsl(hex, hsl.h), hex);
                }}
                style={{ backgroundColor: hex }}
                type="button"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
