'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  CSSProperties,
  FC,
  HTMLAttributes,
  KeyboardEvent,
  PointerEvent,
  Ref,
} from 'react';

import { cn } from '../../../helpers/cn';
import { createSafeContext } from '../../../helpers/create-safe-context';
import { mergeRefs } from '../../../helpers/merge-refs';
import { useControllableState } from '../../../hooks/controllable-state';
import { useWritingMode } from '../../../hooks/writing-mode';
import { getMessages } from '../../../i18n/current';
import { FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';

type Orientation = 'horizontal' | 'vertical';

type PanelsContext = {
  size: number;
  resize: (next: number) => void;
  min: number;
  max: number;
  step: number;
  /** 1 枚目と 2 枚目が見た目で左右に並ぶか。縦書きでは向きが入れ替わる */
  visualOrientation: Orientation;
  primaryId: string;
  root: HTMLDivElement | null;
};

const [PanelsProvider, usePanels] = createSafeContext<PanelsContext>(
  'usePanels must be used within a ResizablePanels.Root',
);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * 1 枚目が根のどちらの端に付いているかを、描かれた箱から読む。
 * 書字方向（縦書き、右から左）ごとに分けて考えるより確か。
 */
const measure = (root: HTMLElement, axis: 'x' | 'y') => {
  const box = root.getBoundingClientRect();
  const first = root.firstElementChild?.getBoundingClientRect() ?? box;
  return axis === 'x'
    ? {
        length: box.width,
        fromEnd: first.left - box.left > box.right - first.right,
        start: box.left,
        end: box.right,
      }
    : {
        length: box.height,
        fromEnd: first.top - box.top > box.bottom - first.bottom,
        start: box.top,
        end: box.bottom,
      };
};

export const Root: FC<
  {
    /** 2 枚を並べる向き。`horizontal` は書字方向の行に沿って並べる。 */
    orientation?: Orientation;
    /** 1 枚目が占める割合（%）。 */
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    /** 矢印キー 1 回で動く割合（%）。 */
    step?: number;
    ref?: Ref<HTMLDivElement>;
  } & Omit<
    HTMLAttributes<HTMLDivElement>,
    'className' | 'style' | 'defaultValue' | 'onChange'
  >
> = ({
  orientation = 'horizontal',
  value,
  defaultValue = 50,
  onChange,
  min = 10,
  max = 90,
  step = 5,
  children,
  ref,
  ...rest
}) => {
  const generatedId = useId();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const mergedRef = useMemo(() => mergeRefs(setRoot, ref), [ref]);
  const [size, setSize] = useControllableState({
    value,
    defaultValue,
    onChange,
  });
  const writingMode = useWritingMode(root);
  const visualOrientation: Orientation =
    writingMode === 'vertical'
      ? orientation === 'horizontal'
        ? 'vertical'
        : 'horizontal'
      : orientation;

  // 仕切りの aria-controls が指す 1 枚目に id が要る
  const [first, ...others] = Children.toArray(children);
  const primaryId = isValidElement<{ id?: string }>(first)
    ? (first.props.id ?? generatedId)
    : generatedId;
  const primary = isValidElement<{ id?: string }>(first)
    ? cloneElement(first, { id: primaryId })
    : first;
  const clamped = clamp(size, min, max);

  return (
    <PanelsProvider
      value={{
        size: clamped,
        resize: (next) => {
          setSize(clamp(next, min, max));
        },
        min,
        max,
        step,
        visualOrientation,
        primaryId,
        root,
      }}
    >
      <div
        {...rest}
        className={cn(
          'grid block-full inline-full',
          orientation === 'horizontal'
            ? 'grid-cols-[var(--panels-size)_auto_minmax(0,1fr)]'
            : 'grid-rows-[var(--panels-size)_auto_minmax(0,1fr)]',
        )}
        ref={mergedRef}
        style={{ '--panels-size': `${String(clamped)}%` } as CSSProperties}
      >
        {primary}
        {others}
      </div>
    </PanelsProvider>
  );
};

export const Panel: FC<
  { ref?: Ref<HTMLDivElement> } & Omit<
    HTMLAttributes<HTMLDivElement>,
    'className' | 'style'
  >
> = ({ ref, ...rest }) => (
  <div {...rest} className="overflow-auto min-block-0 min-inline-0" ref={ref} />
);

export const Handle: FC<
  Omit<
    HTMLAttributes<HTMLDivElement>,
    | 'className'
    | 'style'
    | 'role'
    | 'children'
    | 'tabIndex'
    | 'aria-orientation'
    | 'aria-valuenow'
    | 'aria-valuemin'
    | 'aria-valuemax'
    | 'aria-controls'
  >
> = ({
  'aria-label': ariaLabel,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...rest
}) => {
  const { size, resize, min, max, step, visualOrientation, primaryId, root } =
    usePanels();
  const grabRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const axis = visualOrientation === 'horizontal' ? 'x' : 'y';
  const release = () => {
    grabRef.current = null;
    setDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || root === null) {
      return;
    }
    // 矢印は仕切りを見た目のその向きへ動かす。1 枚目が右（下）にあれば逆に増える
    const sign = measure(root, axis).fromEnd ? -1 : 1;
    const [decrease, increase] =
      axis === 'x' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    const next = {
      [decrease]: size - step * sign,
      [increase]: size + step * sign,
      Home: min,
      End: max,
    }[event.key];
    if (next === undefined) {
      return;
    }
    event.preventDefault();
    resize(next);
  };

  const distance = (event: PointerEvent<HTMLDivElement>) => {
    if (root === null) {
      return null;
    }
    const layout = measure(root, axis);
    const point = axis === 'x' ? event.clientX : event.clientY;
    return {
      ...layout,
      reach: layout.fromEnd ? layout.end - point : point - layout.start,
    };
  };

  return (
    <div
      {...rest}
      aria-controls={primaryId}
      aria-label={
        ariaLabel ??
        (rest['aria-labelledby'] === undefined
          ? getMessages().resizablePanelsHandle
          : undefined)
      }
      aria-orientation={axis === 'x' ? 'vertical' : 'horizontal'}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={Math.round(size)}
      className={cn(
        'group flex touch-none items-center justify-center rounded-full',
        // 軸は見た目の向きなので、つかむ幅も物理の幅・高さで取る（px / py は論理）
        axis === 'x' ? 'cursor-col-resize w-3' : 'cursor-row-resize h-3',
        FOCUS_RING_NO_BORDER,
      )}
      data-dragging={dragging ? '' : undefined}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.button !== 0) {
          return;
        }
        const current = distance(event);
        if (current === null) {
          return;
        }
        // 押した点の位置へ跳ばないよう、仕切りの端からのずれを覚えておく
        grabRef.current = current.reach - (size / 100) * current.length;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const grab = grabRef.current;
        const current = grab === null ? null : distance(event);
        if (grab === null || current === null) {
          return;
        }
        resize(((current.reach - grab) / current.length) * 100);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        release();
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        release();
      }}
      role="separator"
      tabIndex={0}
    >
      <span
        aria-hidden
        className={cn(
          'bg-border-base rounded-full transition-colors forced-colors:bg-[CanvasText]',
          'group-hover:bg-border-emphasize group-data-dragging:bg-primary-border',
          axis === 'x' ? 'h-full w-px' : 'h-px w-full',
        )}
      />
    </div>
  );
};
