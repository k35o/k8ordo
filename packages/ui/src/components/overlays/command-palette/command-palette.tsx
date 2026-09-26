'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { FC, KeyboardEvent, Ref } from 'react';

import { cn } from '../../../helpers/cn';
import { mergeRefs } from '../../../helpers/merge-refs';
import { getMessages } from '../../../i18n/current';
import { Kbd } from '../../data-display/kbd';
import { Modal } from '../modal';

export type CommandPaletteItem = Readonly<{
  id: string;
  label: string;
  onSelect: () => void;
  /** 見出しの付いたまとまり。同じ `group` の項目は最初に現れた位置にまとめる */
  group?: string;
  /** 表示名のほかに、検索で当てる語 */
  keywords?: readonly string[];
  /** 添えて見せるキー。1 つずつ `Kbd` で描く */
  shortcut?: readonly string[];
}>;

type Props = {
  items: readonly CommandPaletteItem[];
  isOpen?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  placeholder?: string;
  'aria-label'?: string;
  ref?: Ref<HTMLDialogElement>;
};

type Section = {
  group: string | undefined;
  entries: Array<{ item: CommandPaletteItem; index: number }>;
};

const matches = (item: CommandPaletteItem, needle: string) =>
  [item.label, ...(item.keywords ?? [])].some((text) =>
    text.toLocaleLowerCase().includes(needle),
  );

// 一致した順を保ったまま、まとまりごとに集める。行の番号は一致した中での位置
const sectionsOf = (items: readonly CommandPaletteItem[]): Section[] => {
  const sections: Section[] = [];
  for (const [index, item] of items.entries()) {
    const section = sections.find((entry) => entry.group === item.group);
    if (section === undefined) {
      sections.push({ group: item.group, entries: [{ item, index }] });
    } else {
      section.entries.push({ item, index });
    }
  }
  return sections;
};

export const CommandPalette: FC<Props> = ({
  items,
  isOpen,
  defaultOpen,
  onClose,
  placeholder,
  'aria-label': ariaLabel,
  ref,
}) => {
  const messages = getMessages();
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mergedRef = useMemo(() => mergeRefs(dialogRef, ref), [ref]);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const needle = query.trim().toLocaleLowerCase();
  const matched =
    needle === '' ? items : items.filter((item) => matches(item, needle));
  const active =
    matched.length === 0
      ? undefined
      : Math.min(activeIndex, matched.length - 1);
  const optionId = (index: number) => `${baseId}-option-${String(index)}`;

  const scrollIntoView = useCallback((node: HTMLDivElement | null) => {
    node?.scrollIntoView({ block: 'nearest' });
  }, []);

  // 閉じるのは dialog 自身に任せる。onClose は閉じたときに Modal から届く
  const run = (item: CommandPaletteItem) => {
    dialogRef.current?.close();
    item.onSelect();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || active === undefined) {
      return;
    }
    const last = matched.length - 1;
    const next = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
    }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      setActiveIndex(next);
      return;
    }
    const item = matched[active];
    if (event.key === 'Enter' && item !== undefined) {
      event.preventDefault();
      run(item);
    }
  };

  const renderOption = ({
    item,
    index,
  }: {
    item: CommandPaletteItem;
    index: number;
  }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- フォーカスは検索欄に置いたまま、aria-activedescendant で項目を指す
    <div
      aria-selected={active === index}
      className={cn(
        'flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2 outline-border-base -outline-offset-2',
        active === index &&
          'bg-bg-subtle contrast-more:outline-2 forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
      )}
      id={optionId(index)}
      key={item.id}
      onClick={() => {
        run(item);
      }}
      // マウスを動かしたときだけ追う。キーで送った一覧が止まったポインタの下を
      // 流れても、選んでいる項目は動かさない
      onMouseMove={() => {
        setActiveIndex(index);
      }}
      ref={active === index ? scrollIntoView : undefined}
      role="option"
    >
      <span>{item.label}</span>
      {item.shortcut === undefined ? null : (
        <span className="flex shrink-0 gap-1">
          {item.shortcut.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </span>
      )}
    </div>
  );

  return (
    <Modal
      aria-label={ariaLabel ?? messages.commandPalette}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onClose={() => {
        // 次に開いたときは空の検索から始める
        setQuery('');
        setActiveIndex(0);
        onClose?.();
      }}
      ref={mergedRef}
    >
      <div className="flex max-h-[inherit] flex-col">
        <input
          aria-activedescendant={
            active === undefined ? undefined : optionId(active)
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded
          aria-label={messages.commandPaletteSearch}
          autoComplete="off"
          className="border-border-mute placeholder:text-fg-mute border-b bg-transparent px-4 py-3 focus-visible:outline-hidden"
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? messages.commandPaletteSearch}
          role="combobox"
          spellCheck={false}
          type="text"
          value={query}
        />
        <div className="min-h-0 overflow-y-auto p-2">
          {matched.length === 0 ? (
            <p
              className="text-fg-mute px-3 py-6 text-center text-sm"
              role="status"
            >
              {messages.commandPaletteEmpty}
            </p>
          ) : null}
          <div
            aria-label={ariaLabel ?? messages.commandPalette}
            // 項目の無い listbox は役割を満たさないので隠す。aria-controls の参照先は残す
            hidden={matched.length === 0}
            id={listboxId}
            role="listbox"
          >
            {sectionsOf(matched).map((section, sectionIndex) =>
              section.group === undefined ? (
                section.entries.map(renderOption)
              ) : (
                <div
                  aria-labelledby={`${baseId}-group-${String(sectionIndex)}`}
                  key={section.group}
                  role="group"
                >
                  <div
                    className="text-fg-mute px-3 pt-3 pb-1 text-xs font-bold"
                    id={`${baseId}-group-${String(sectionIndex)}`}
                    role="presentation"
                  >
                    {section.group}
                  </div>
                  {section.entries.map(renderOption)}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
