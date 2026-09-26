'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type {
  FC,
  FocusEventHandler,
  HTMLAttributes,
  KeyboardEvent,
  ReactElement,
  Ref,
  RefCallback,
} from 'react';

import { cn } from '../../../helpers/cn';
import { createSafeContext } from '../../../helpers/create-safe-context';
import { mergeRefs } from '../../../helpers/merge-refs';
import { readWritingMode, useWritingMode } from '../../../hooks/writing-mode';
import { Separator as BaseSeparator } from '../../layout/separator';

type Orientation = 'horizontal' | 'vertical';

type ToolbarContext = {
  register: (id: string, element: HTMLElement) => () => void;
  activeId: string | undefined;
  setActiveId: (id: string) => void;
  orientation: Orientation;
};

const [ToolbarProvider, useToolbar] = createSafeContext<ToolbarContext>(
  'useToolbar must be used within a Toolbar.Root',
);

const isEnabled = (element: HTMLElement) => !element.matches(':disabled');

export const Root: FC<
  {
    /** 項目の並ぶ向き。書字方向の行の向きが `horizontal`。 */
    orientation?: Orientation;
    ref?: Ref<HTMLDivElement>;
  } & Omit<
    HTMLAttributes<HTMLDivElement>,
    'className' | 'style' | 'role' | 'aria-orientation'
  >
> = ({ orientation = 'horizontal', children, onKeyDown, ref, ...rest }) => {
  const items = useRef(new Map<string, HTMLElement>());
  const [activeId, setActiveId] = useState<string>();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const mergedRef = useMemo(() => mergeRefs(setContainer, ref), [ref]);
  // 縦書きでは行の向きが縦になるので、読み上げに伝える向きも入れ替わる
  const writingMode = useWritingMode(container);
  const visualOrientation: Orientation =
    writingMode === 'vertical'
      ? orientation === 'horizontal'
        ? 'vertical'
        : 'horizontal'
      : orientation;

  const ordered = useCallback(
    () =>
      [...items.current.entries()]
        .filter(([, element]) => isEnabled(element))
        .toSorted(([, a], [, b]) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        ),
    [],
  );

  // Tab で入れるのは 1 つだけ（roving tabindex）。最初は先頭、以後は最後に
  // フォーカスした項目。その項目が消えたら先頭に戻す
  const register = useCallback(
    (id: string, element: HTMLElement) => {
      items.current.set(id, element);
      setActiveId((current) => current ?? ordered()[0]?.[0]);
      return () => {
        items.current.delete(id);
        setActiveId((current) =>
          current === id ? ordered()[0]?.[0] : current,
        );
      };
    },
    [ordered],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }
    const list = ordered();
    const index = list.findIndex(
      ([, element]) =>
        event.target instanceof Node && element.contains(event.target),
    );
    if (index === -1) {
      return;
    }
    const vertical =
      (orientation === 'vertical') !==
      (readWritingMode(event.currentTarget) === 'vertical');
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const [previousKey, nextKey] = vertical
      ? ['ArrowUp', 'ArrowDown']
      : rtl
        ? ['ArrowRight', 'ArrowLeft']
        : ['ArrowLeft', 'ArrowRight'];
    const target = {
      [nextKey]: (index + 1) % list.length,
      [previousKey]: (index - 1 + list.length) % list.length,
      Home: 0,
      End: list.length - 1,
    }[event.key];
    const entry = target === undefined ? undefined : list[target];
    if (entry === undefined) {
      return;
    }
    event.preventDefault();
    setActiveId(entry[0]);
    entry[1].focus();
  };

  const contextValue = useMemo(
    () => ({ register, activeId, setActiveId, orientation }),
    [register, activeId, orientation],
  );

  return (
    <ToolbarProvider value={contextValue}>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- WAI-ARIA の toolbar はフォーカスを項目へ直接渡す（roving tabindex）。コンテナにも止まると Tab が 1 回増える */}
      <div
        {...rest}
        aria-orientation={visualOrientation}
        className={cn(
          'flex items-center gap-1 rounded-xl bg-bg-subtle p-1',
          // 押した状態のトグル（aria-pressed）は地を濃くして見せる。IconButton や
          // Button 自身は押した状態の見た目を持たない
          '*:aria-pressed:bg-bg-emphasize',
          orientation === 'vertical' && 'flex-col',
        )}
        onKeyDown={handleKeyDown}
        ref={mergedRef}
        role="toolbar"
      >
        {children}
      </div>
    </ToolbarProvider>
  );
};

export type ToolbarItemProps = {
  ref: RefCallback<HTMLElement>;
  tabIndex: number;
  onFocus: FocusEventHandler<HTMLElement>;
};

export const Item: FC<{
  renderItem: (props: ToolbarItemProps) => ReactElement;
}> = ({ renderItem }) => {
  const id = useId();
  const { register, activeId, setActiveId } = useToolbar();
  const ref = useCallback(
    (element: HTMLElement | null) =>
      element === null ? undefined : register(id, element),
    [id, register],
  );

  return renderItem({
    ref,
    // 登録が済むまでは、どれも Tab で入れるようにしておく（JavaScript が
    // 動く前に辿り着けない項目を作らない）
    tabIndex: activeId === undefined || activeId === id ? 0 : -1,
    onFocus: () => {
      setActiveId(id);
    },
  });
};

export const Separator: FC = () => {
  const { orientation } = useToolbar();
  return (
    // 線は並びと直交する向きに伸ばす。項目の高さに合わせるため、包んで引き伸ばす
    <span className="m-1 flex self-stretch">
      <BaseSeparator
        color="base"
        orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      />
    </span>
  );
};
