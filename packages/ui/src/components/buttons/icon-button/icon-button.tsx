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

import type { Placement } from '../../../types/variables';
import { FOCUS_RING } from '../../_internal/focus-ring';
import { Tooltip } from '../../overlays/tooltip';
import type { TooltipTriggerProps } from '../../overlays/tooltip';
import { chain } from './../../../helpers/chain';
import { cn } from './../../../helpers/cn';
import { mergeRefs } from './../../../helpers/merge-refs';

export type IconButtonTriggerProps = Partial<TooltipTriggerProps>;

/**
 * `renderItem` が受け取る props。既定の `<button>` に渡すものと同じ
 * オブジェクトで、`<button>` には `triggerProps` ともども展開できる。
 * `<a>` など別の要素を描画するときは `<button>` 専用の `disabled` /
 * `type` を分割代入で外してから残りを展開する。無効状態は同梱の
 * `aria-disabled` で表現できる。`ref` は tooltip の配線と合成済みのものが
 * `triggerProps` に入っているので、平置きでは渡さない。
 *
 * ハンドラの要素型を `HTMLButtonElement` ではなく `HTMLElement` にしているのは、
 * `ClipboardEventHandler<HTMLButtonElement>` のような兄弟型が `<a>` の同名 props
 * に代入できず、束ごと展開できなくなるため。
 */
export type IconButtonRenderItemProps = Omit<
  ButtonHTMLAttributes<HTMLElement>,
  | 'aria-busy'
  | 'aria-describedby'
  | 'aria-disabled'
  | 'aria-label'
  | 'children'
  | 'className'
  | 'disabled'
  | 'onBlur'
  | 'onClick'
  | 'onFocus'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'style'
  | 'type'
> & {
  className: string;
  children: ReactNode;
  type: 'button';
  disabled: boolean;
  'aria-label': string;
  'aria-busy': true | undefined;
  'aria-disabled': true | undefined;
  // 要素を選ばない MouseEventHandler にしておくのは、renderItem が <a> などを
  // 描画したときにもそのまま渡せるようにするため。
  onClick: MouseEventHandler<HTMLElement> | undefined;
  /**
   * tooltip の配線（ref・hover/focus ハンドラ・`aria-describedby`）。
   * 利用者が渡した同名のハンドラも連結済みなので、描画する要素へ展開する。
   */
  triggerProps: IconButtonTriggerProps;
};

type Props = {
  size?: 'sm' | 'md' | 'lg';
  color?: 'transparent' | 'base' | 'primary' | 'secondary';
  label: string;
  tooltipPlacement?: Placement;
  tooltipDisabled?: boolean;
  /**
   * クリック時の処理。`onAction` は非同期処理を `useTransition` で包み、保留中は
   * `aria-busy` を立てる糖衣。素のクリックイベントが必要なら `onClick` を使う。
   * 両者は併用可能で `onClick` → `onAction` の順に実行される（`onClick` が
   * `preventDefault` した場合は `onAction` をスキップ）。
   */
  onAction?: () => void | Promise<void>;
  renderItem?: (props: IconButtonRenderItemProps) => ReactNode;
} & Omit<ComponentPropsWithRef<'button'>, 'type' | 'className' | 'style'>;

const joinIds = (
  ...ids: ReadonlyArray<string | undefined>
): string | undefined => {
  const filtered = ids.filter(Boolean);
  return filtered.length === 0 ? undefined : filtered.join(' ');
};

/**
 * 描画する要素そのもの。IconButton から切り出しているのは合成 ref のため。
 * mergeRefs は呼ぶたび新しい関数を返し、React が毎レンダー ref を付け外しする。
 * 合成先の triggerProps は Tooltip.Trigger から引数で届くので IconButton 側では
 * useMemo に包めず、triggerProps を props として受け取るここでだけ包める。
 *
 * ref を `buttonRef` という名前で受けているのは、`ref` で受けると react(refs) が
 * レンダー中に一切触れない値として扱い、renderItem へ渡す設計が成り立たなくなるため。
 */
const Item: FC<{
  buttonRef: Props['ref'];
  triggerProps: IconButtonTriggerProps;
  build: (
    triggerProps: IconButtonTriggerProps,
    mergedRef: RefCallback<HTMLElement>,
  ) => IconButtonRenderItemProps;
  renderItem: ((props: IconButtonRenderItemProps) => ReactNode) | undefined;
}> = ({ buttonRef, triggerProps, build, renderItem }) => {
  const triggerRef = triggerProps.ref;
  const mergedRef = useMemo(
    () => mergeRefs<HTMLElement>(buttonRef, triggerRef),
    [buttonRef, triggerRef],
  );
  const itemProps = build(triggerProps, mergedRef);

  if (renderItem) {
    return <>{renderItem(itemProps)}</>;
  }
  const { triggerProps: resolvedTriggerProps, ...rest } = itemProps;
  // type を展開のあとに書き直しているのは、lint の button-has-type が
  // スプレッド越しの type を読めないため（値は itemProps.type と同じ）。
  return <button {...rest} {...resolvedTriggerProps} type="button" />;
};

export const IconButton: FC<Props> = ({
  ref,
  size = 'md',
  color = 'transparent',
  label,
  tooltipPlacement = 'top',
  tooltipDisabled = false,
  children,
  onAction,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  disabled,
  renderItem,
  'aria-describedby': describedBy,
  ...props
}) => {
  const [transitionPending, startTransition] = useTransition();
  const { pending: formPending } = useFormStatus();
  const isPending = transitionPending || formPending;
  const isDisabled = Boolean(disabled) || isPending;

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

  const className = cn(
    'inline-flex cursor-pointer rounded-full transition-colors',
    FOCUS_RING,
    (color === 'transparent' || color === 'base') &&
      'hover:bg-bg-subtle active:bg-bg-mute',
    color === 'base' && 'bg-bg-base',
    color === 'transparent' && 'bg-transparent',
    color === 'primary' &&
      'bg-primary-bg hover:bg-primary-bg-emphasize active:bg-primary-bg-emphasize',
    color === 'secondary' &&
      'bg-secondary-bg hover:bg-secondary-bg-emphasize active:bg-secondary-bg-emphasize',
    size === 'sm' && 'p-1',
    size === 'md' && 'p-2',
    size === 'lg' && 'p-3',
    isDisabled &&
      'cursor-not-allowed opacity-50 hover:bg-transparent active:bg-transparent',
  );

  const buildItemProps = (
    triggerProps: IconButtonTriggerProps,
    mergedRef: RefCallback<HTMLElement>,
  ): IconButtonRenderItemProps => ({
    ...props,
    'aria-busy': isPending || undefined,
    'aria-disabled': isDisabled || undefined,
    'aria-label': label,
    children,
    className,
    disabled: isDisabled,
    onClick: handleClick,
    type: 'button',
    triggerProps: {
      ...triggerProps,
      'aria-describedby': joinIds(
        describedBy,
        triggerProps['aria-describedby'],
      ),
      onBlur: chain(triggerProps.onBlur, onBlur),
      onFocus: chain(triggerProps.onFocus, onFocus),
      onMouseEnter: chain(triggerProps.onMouseEnter, onMouseEnter),
      onMouseLeave: chain(triggerProps.onMouseLeave, onMouseLeave),
      ref: mergedRef,
    },
  });

  const render = (triggerProps: IconButtonTriggerProps) => (
    <Item
      build={buildItemProps}
      buttonRef={ref}
      renderItem={renderItem}
      triggerProps={triggerProps}
    />
  );

  if (tooltipDisabled) {
    return render({});
  }

  return (
    <Tooltip.Root placement={tooltipPlacement}>
      <Tooltip.Trigger renderItem={render} />
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  );
};
