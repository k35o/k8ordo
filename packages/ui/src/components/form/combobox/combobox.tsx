'use client';

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import type {
  CSSProperties,
  FC,
  InputHTMLAttributes,
  KeyboardEvent,
  Ref,
} from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../../../helpers/cn';
import { mergeRefs } from '../../../helpers/merge-refs';
import { useControllableState, useWritingMode } from '../../../hooks';
import { getMessages } from '../../../i18n/current';
import type { Option } from '../../../types/variables';
import { FOCUS_RING_WITHIN } from '../../_internal/focus-ring';
import { FormValue } from '../../_internal/form-value';
import { ChevronIcon } from '../../icons';

export type ComboboxSearch = (
  query: string,
  options: { signal: AbortSignal },
) => Promise<readonly Option[]>;

type BaseProps = {
  invalid?: boolean;
  /**
   * 選べる候補。`search` が無ければ、打った文字で表示名を絞り込む。`search`
   * があれば、打つ前に見せる候補と、いまの値の表示名を引く先になる。
   */
  options?: readonly Option[];
  /** 打った文字で候補を探す。打ち直すと前の問い合わせは `signal` で打ち切る。 */
  search?: ComboboxSearch;
  // @k8ordo/form の formFields は type を導くので受けて捨てる
  type?: string;
  // フォームライブラリの register が入力値を読めるよう、ref は combobox の input に向ける
  ref?: Ref<HTMLInputElement>;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'role'
  | 'className'
  | 'style'
  | 'value'
  | 'onChange'
  | 'defaultValue'
  | 'children'
  | 'autoComplete'
  | 'aria-autocomplete'
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-activedescendant'
>;

type ControlledProps = {
  /** 選んだ候補の `value`。未選択は `''` */
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

const NO_OPTIONS: readonly Option[] = [];

const matches = (option: Option, text: string) =>
  option.label.toLocaleLowerCase().includes(text.trim().toLocaleLowerCase());

export const Combobox: FC<Props> = ({
  invalid = false,
  options: optionsProp,
  search,
  type: _type,
  value,
  defaultValue,
  onChange,
  name,
  id,
  disabled = false,
  required = false,
  placeholder,
  onBlur,
  onKeyDown,
  ref,
  ...rest
}) => {
  const messages = getMessages();
  const options = optionsProp ?? NO_OPTIONS;
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const isControlled = value !== undefined;
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange,
  });
  // 打っている途中の文字。打っていないあいだは null で、欄は選んだ候補の表示名を見せる
  const [text, setText] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>();
  // search で見つけた候補。まだ探していなければ null
  const [found, setFound] = useState<readonly Option[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [isSearching, startSearch] = useTransition();
  const searchRef = useRef<AbortController>(null);
  // search の結果から選んだ候補は、次の検索で一覧から消えても表示名が要る
  const [picked, setPicked] = useState<Option | null>(null);
  const { pending } = useFormStatus();
  const disabledResolved = disabled || pending;

  const candidates =
    search === undefined
      ? text === null
        ? options
        : options.filter((option) => matches(option, text))
      : text === null || text.trim() === ''
        ? options
        : (found ?? NO_OPTIONS);
  // 一覧が縮んでも実在する行を指すよう、描画のたびに収める
  const active =
    activeIndex === undefined || candidates.length === 0
      ? undefined
      : Math.min(activeIndex, candidates.length - 1);
  const currentLabel =
    current === ''
      ? ''
      : ([
          ...options,
          ...(found ?? []),
          ...(picked === null ? [] : [picked]),
        ].find((option) => option.value === current)?.label ?? current);

  // 一覧は CSS Anchor Positioning で欄に追従させ、幅は欄の inline 寸法に合わせる。
  // 縦書きでは inline 軸が物理の高さになるので、anchor-size の物理キーワードを切り替える
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const writingMode = useWritingMode(anchor);
  const anchorName = `--ao-combobox-${baseId.replaceAll(/[^a-zA-Z0-9_-]/gu, '')}`;
  const anchorRef = useCallback(
    (node: HTMLDivElement | null) => {
      setAnchor(node);
      node?.style.setProperty('anchor-name', anchorName);
    },
    [anchorName],
  );
  const listStyle: CSSProperties & {
    positionAnchor?: string;
    positionArea?: string;
    positionTryFallbacks?: string;
  } = {
    position: 'fixed',
    inset: 'auto',
    margin: 0,
    marginTop: '4px',
    positionAnchor: anchorName,
    positionArea: 'bottom span-right',
    positionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
    inlineSize: `anchor-size(${writingMode === 'vertical' ? 'height' : 'width'})`,
  };

  const runSearch = (query: string) => {
    if (search === undefined) {
      return;
    }
    searchRef.current?.abort();
    if (query.trim() === '') {
      setFound(null);
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    searchRef.current = controller;
    startSearch(async () => {
      try {
        const results = await search(query, { signal: controller.signal });
        if (!controller.signal.aborted) {
          startSearch(() => {
            setFound(results);
            setFailed(false);
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          startSearch(() => {
            setFound(NO_OPTIONS);
            setFailed(true);
          });
        }
      }
    });
  };

  const open = (index?: number) => {
    setIsOpen(true);
    setActiveIndex(index);
  };

  const close = () => {
    setIsOpen(false);
    setActiveIndex(undefined);
  };

  const choose = (option: Option) => {
    setPicked(option);
    setCurrent(option.value);
    setText(null);
    close();
  };

  const scrollIntoView = useCallback((node: HTMLLIElement | null) => {
    node?.scrollIntoView({ block: 'nearest' });
  }, []);

  const selectedIndex = candidates.findIndex(
    (option) => option.value === current,
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    // IME の変換を確定する Enter や、変換候補を選ぶ矢印キーは欄のもの
    if (event.defaultPrevented || event.nativeEvent.isComposing) {
      return;
    }
    const last = candidates.length - 1;
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!isOpen) {
          open(
            event.altKey ? undefined : selectedIndex === -1 ? 0 : selectedIndex,
          );
          return;
        }
        setActiveIndex(active === undefined ? 0 : Math.min(active + 1, last));
        return;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (event.altKey) {
          close();
          return;
        }
        if (!isOpen) {
          open(selectedIndex === -1 ? last : selectedIndex);
          return;
        }
        setActiveIndex(active === undefined ? last : Math.max(active - 1, 0));
        return;
      }
      case 'Enter': {
        const option = active === undefined ? undefined : candidates[active];
        if (!isOpen || option === undefined) {
          return;
        }
        // 開いた一覧から選ぶ Enter で、フォームを送らない
        event.preventDefault();
        choose(option);
        return;
      }
      case 'Escape': {
        if (isOpen) {
          event.preventDefault();
          close();
          return;
        }
        if (text !== null) {
          event.preventDefault();
          setText(null);
        }
        break;
      }
      default:
    }
  };

  const status = isSearching
    ? messages.loading
    : failed
      ? messages.comboboxFailed
      : candidates.length === 0
        ? messages.comboboxEmpty
        : null;

  return (
    <div
      className={cn(
        'relative flex items-center rounded-xl border border-border-base bg-bg-base inline-full',
        FOCUS_RING_WITHIN,
        'has-aria-invalid:border-border-error',
        'has-disabled:cursor-not-allowed has-disabled:border-border-mute has-disabled:bg-bg-mute',
      )}
      ref={anchorRef}
    >
      <FormValue
        defaultValues={
          isControlled
            ? undefined
            : defaultValue === undefined || defaultValue === ''
              ? []
              : [defaultValue]
        }
        disabled={disabled}
        focusTarget={inputRef}
        multiple={false}
        name={name}
        onReset={() => {
          setText(null);
          close();
          if (!isControlled) {
            setCurrent(defaultValue ?? '');
          }
        }}
        required={required}
        values={current === '' ? [] : [current]}
      />
      <input
        {...rest}
        aria-activedescendant={
          isOpen && active !== undefined
            ? `${baseId}-option-${String(active)}`
            : undefined
        }
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-invalid={invalid}
        aria-required={required}
        autoComplete="off"
        className={cn(
          'min-w-0 grow bg-transparent py-2 ps-3 focus-visible:outline-hidden',
          'disabled:cursor-not-allowed',
        )}
        disabled={disabledResolved}
        id={id}
        onBlur={(event) => {
          // 打ちかけで離れたら選んだ候補の表示名に戻す。空にして離れたら選択を外す
          if (text !== null && text.trim() === '') {
            setCurrent('');
            setPicked(null);
          }
          setText(null);
          close();
          onBlur?.(event);
        }}
        onChange={(event) => {
          setText(event.currentTarget.value);
          open();
          runSearch(event.currentTarget.value);
        }}
        onClick={() => {
          if (!isOpen) {
            open(selectedIndex === -1 ? undefined : selectedIndex);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={mergedRef}
        role="combobox"
        type="text"
        value={text ?? currentLabel}
      />
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-label={messages.comboboxToggle}
        className="text-fg-mute me-2 grid size-8 shrink-0 place-items-center rounded-md disabled:cursor-not-allowed"
        disabled={disabledResolved}
        onClick={() => {
          inputRef.current?.focus();
          if (isOpen) {
            close();
            return;
          }
          open(selectedIndex === -1 ? undefined : selectedIndex);
        }}
        // 押しても欄からフォーカスを移さない
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        tabIndex={-1}
        type="button"
      >
        <ChevronIcon direction={isOpen ? 'up' : 'down'} size="sm" />
      </button>
      <span className="sr-only" role="status">
        {isOpen ? status : null}
      </span>
      <div
        className={cn(
          'bg-bg-raised border-border-subtle z-10 rounded-xl border shadow-md',
          !isOpen && 'hidden',
        )}
        // 候補を押しても欄からフォーカスを移さない。離れた扱いになると選ぶ前に閉じる
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        role="presentation"
        style={listStyle}
      >
        {status === null ? null : (
          <p className="text-fg-mute px-3 py-2">{status}</p>
        )}
        <ul
          aria-busy={isSearching || undefined}
          className={cn(
            'max-h-80 overflow-y-auto py-2 transition-opacity vertical:max-h-none vertical:max-w-80 vertical:overflow-x-auto vertical:overflow-y-visible',
            isSearching && 'opacity-60',
          )}
          // 候補の無い listbox は役割を満たさないので隠す。aria-controls の参照先は残す
          hidden={candidates.length === 0}
          id={listboxId}
          role="listbox"
        >
          {candidates.map((option, index) => {
            const selected = option.value === current;
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- キーボードでは combobox の欄が aria-activedescendant で候補を選ぶ
              <li
                aria-selected={selected}
                className={cn(
                  'cursor-pointer px-3 py-2 transition-colors outline-border-base -outline-offset-2',
                  selected &&
                    'bg-primary-bg-subtle text-primary-fg forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
                  active === index &&
                    'contrast-more:outline-2 forced-colors:outline-2',
                  active === index && !selected && 'bg-bg-subtle',
                  active === index && selected && 'bg-primary-bg-mute',
                )}
                id={`${baseId}-option-${String(index)}`}
                key={option.value}
                onClick={() => {
                  choose(option);
                }}
                onMouseEnter={() => {
                  setActiveIndex(index);
                }}
                ref={active === index ? scrollIntoView : undefined}
                role="option"
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
