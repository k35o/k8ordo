'use client';

import type {
  ButtonHTMLAttributes,
  ComponentPropsWithRef,
  FC,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  RefCallback,
} from 'react';
import { useMemo, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

import { FOCUS_RING } from '../../_internal/focus-ring';
import { Spinner } from '../../feedback/spinner/spinner';
import { cn } from './../../../helpers/cn';
import { mergeRefs } from './../../../helpers/merge-refs';

/**
 * `renderItem` が受け取る props。既定の `<button>` に渡すものと同じ
 * オブジェクトで、`<button>` にはそのまま展開できる。`<a>` など別の要素を
 * 描画するときは `<button>` 専用の `disabled` / `type` を分割代入で外してから
 * 残りを展開する。無効状態は同梱の `aria-disabled` で表現でき、
 * `onClick` は無効なら何もしないので `<a>` でも遷移しない。
 *
 * ハンドラの要素型を `HTMLButtonElement` ではなく `HTMLElement` にしているのは、
 * `ClipboardEventHandler<HTMLButtonElement>` のような兄弟型が `<a>` の同名 props
 * に代入できず、束ごと展開できなくなるため。
 */
export type ButtonRenderItemProps = Omit<
  ButtonHTMLAttributes<HTMLElement>,
  | 'aria-busy'
  | 'aria-disabled'
  | 'children'
  | 'className'
  | 'disabled'
  | 'onClick'
  | 'style'
  | 'type'
> & {
  // ref を要素固有の Ref<HTMLButtonElement> ではなくコールバックで渡すのは、
  // RefObject が不変で <a> などの ref に代入できないため。
  ref: RefCallback<HTMLElement> | undefined;
  className: string;
  children: ReactNode;
  type: 'button' | 'submit';
  disabled: boolean;
  'aria-busy': true | undefined;
  'aria-disabled': true | undefined;
  onClick: MouseEventHandler<HTMLElement> | undefined;
};

type Props = {
  type?: 'button' | 'submit';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'base';
  variant?: 'solid' | 'outline' | 'skeleton';
  fullWidth?: boolean;
  isActive?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /**
   * クリック時の処理。`onAction` は非同期処理を `useTransition` で包み、保留中は
   * 自動でスピナーを表示する糖衣。素のクリックイベント（`event` が必要、
   * `preventDefault` したい等）は `onClick` を使う。両者は併用可能で、
   * `onClick` → `onAction` の順に実行される（`onClick` が `preventDefault`
   * した場合は `onAction` をスキップ）。
   */
  onAction?: () => void | Promise<void>;
  renderItem?: (props: ButtonRenderItemProps) => ReactNode;
} & Omit<ComponentPropsWithRef<'button'>, 'type' | 'className' | 'style'>;

export const Button: FC<Props> = ({
  ref,
  children,
  type = 'button',
  size = 'md',
  color = 'primary',
  variant = 'solid',
  disabled = false,
  fullWidth = false,
  isActive = false,
  onAction,
  onClick,
  startIcon,
  endIcon,
  renderItem,
  ...rest
}) => {
  // ref を毎レンダー作り直すと React が付け外しを繰り返すので、合成結果を保持する。
  // react(refs) を止めているのは、renderItem に ref を渡す設計そのものを
  // このルールが許さないため。ref という名前で受けた値は、関数に渡してもクロージャに
  // 閉じ込めても違反になり、renderItem(itemProps) 側へ位置が移るだけになる。
  // mergeRefs が返すのはコールバック ref で、.current をレンダー中に読む経路はない。
  // oxlint-disable-next-line react/refs
  const mergedRef = useMemo(() => (ref ? mergeRefs(ref) : undefined), [ref]);
  const [transitionPending, startTransition] = useTransition();
  const { pending: formPending } = useFormStatus();
  const isPending = transitionPending || (type === 'submit' && formPending);
  const isDisabled = disabled || isPending;

  // 無効なときもハンドラを付けるのは、renderItem が <a> などを描画したときに
  // ネイティブの disabled が効かず、そのまま遷移してしまうため。
  const handleClick =
    onClick || onAction || isDisabled
      ? (event: MouseEvent<HTMLButtonElement>) => {
          if (isDisabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (onAction) {
            startTransition(async () => {
              await onAction();
            });
          }
        }
      : undefined;

  const spinnerSize = size === 'lg' ? 'md' : 'sm';
  const resolvedStartIcon = isPending ? (
    <Spinner size={spinnerSize} />
  ) : (
    startIcon
  );
  const hasStartIcon = resolvedStartIcon !== undefined;
  const hasEndIcon = endIcon !== undefined;

  const className = cn(
    'cursor-pointer rounded-full border-2 text-center font-bold transition-colors',
    {
      'border-transparent bg-primary-bg text-primary-fg hover:bg-primary-bg-emphasize active:bg-primary-bg-emphasize':
        variant === 'solid' && color === 'primary',
      'border-transparent bg-secondary-bg text-secondary-fg hover:bg-secondary-bg-emphasize active:bg-secondary-bg-emphasize':
        variant === 'solid' && color === 'secondary',
      'border-transparent bg-bg-subtle text-fg-base hover:bg-bg-mute active:bg-bg-emphasize':
        variant === 'solid' && color === 'base',
      'border-primary-border bg-bg-base text-primary-fg hover:bg-bg-subtle active:bg-bg-mute':
        variant === 'outline' && color === 'primary',
      'border-secondary-border bg-bg-base text-secondary-fg hover:bg-bg-subtle active:bg-bg-mute':
        variant === 'outline' && color === 'secondary',
      'border-border-base bg-bg-base text-fg-base hover:bg-bg-subtle active:bg-bg-mute':
        variant === 'outline' && color === 'base',
      'border-transparent bg-transparent text-fg-mute hover:bg-bg-subtle hover:text-fg-base active:bg-bg-mute active:text-fg-base':
        variant === 'skeleton',
    },
    FOCUS_RING,
    size === 'sm' && 'px-3 py-1 text-sm',
    size === 'md' && 'px-4 py-2 text-md',
    size === 'lg' && 'px-6 py-3 text-lg',
    fullWidth && 'w-full vertical:w-auto',
    (hasStartIcon || hasEndIcon) && 'flex items-center gap-2',
    hasStartIcon && hasEndIcon
      ? 'justify-between'
      : hasStartIcon && variant !== 'skeleton'
        ? 'justify-center'
        : hasEndIcon && 'justify-between',
    isActive && 'text-fg-info',
    {
      'cursor-not-allowed opacity-35 hover:bg-primary-bg active:bg-primary-bg':
        isDisabled && variant === 'solid' && color === 'primary',
      'cursor-not-allowed opacity-35 hover:bg-secondary-bg active:bg-secondary-bg':
        isDisabled && variant === 'solid' && color === 'secondary',
      'cursor-not-allowed opacity-35 hover:bg-bg-subtle active:bg-bg-subtle':
        isDisabled && variant === 'solid' && color === 'base',
      'cursor-not-allowed bg-bg-base opacity-35':
        isDisabled && variant === 'outline',
      'cursor-not-allowed bg-transparent text-fg-mute opacity-35':
        isDisabled && variant === 'skeleton',
    },
  );

  const itemProps: ButtonRenderItemProps = {
    ...rest,
    'aria-busy': isPending || undefined,
    'aria-disabled': isDisabled || undefined,
    className,
    disabled: isDisabled,
    onClick: handleClick,
    ref: mergedRef,
    type,
    children: (
      <>
        {resolvedStartIcon}
        {children}
        {endIcon}
      </>
    ),
  };

  // type を展開のあとにリテラルで書き直しているのは、lint の button-has-type が
  // スプレッド越しの type も変数の type も読めないため（値は itemProps.type と同じ）。
  return renderItem ? (
    renderItem(itemProps)
  ) : (
    <button {...itemProps} type={type === 'submit' ? 'submit' : 'button'} />
  );
};
