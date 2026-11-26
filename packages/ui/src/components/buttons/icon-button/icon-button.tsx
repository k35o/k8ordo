'use client';

import { clsx } from 'clsx';
import type {
  ComponentPropsWithRef,
  FC,
  FocusEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  Ref,
  RefCallback,
} from 'react';
import { useMemo, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

import type { Placement } from '../../../types/variables';
import { Tooltip } from '../../overlays/tooltip';
import type { TooltipTriggerProps } from '../../overlays/tooltip';
import { chain } from './../../../helpers/chain';
import { mergeRefs } from './../../../helpers/merge-refs';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './icon-button.module.css';

type AnchorAttributes = Omit<
  ComponentPropsWithRef<'a'>,
  'aria-disabled' | 'children' | 'className' | 'href' | 'style' | 'type'
>;

type RenderAnchorProps<T extends string> = {
  href: NoInfer<T>;
  className: string;
  children: ReactNode;
  ref: RefCallback<HTMLAnchorElement>;
  onClick: MouseEventHandler<HTMLAnchorElement> | undefined;
  'aria-label': string;
  'aria-disabled': true | undefined;
} & Omit<AnchorAttributes, 'aria-label' | 'onClick' | 'ref'>;

const SOLID = {
  base: styles.base,
  primary: styles.primary,
  secondary: styles.secondary,
} as const;

const SIZE = { sm: styles.sm, md: styles.md, lg: styles.lg } as const;

type Look = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'skeleton';
  color?: 'primary' | 'secondary' | 'base';
  label: string;
  tooltipPlacement?: Placement;
  tooltipDisabled?: boolean;
  children?: ReactNode;
  disabled?: boolean;
};

type ButtonProps = Look & {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  /**
   * 押したときに transition の中で走らせる処理。返した Promise が解決するまで
   * `aria-busy` と `aria-disabled` を立て、押されても何もしない。ボタンは
   * フォーカスを持ったままでいる。続けて押す同期の更新や、イベントが要る処理は
   * `onClick` に書く。両方あれば `onClick` → `action` の順に呼び、`onClick` が
   * `preventDefault` したら `action` は呼ばない。
   */
  action?: () => void | Promise<void>;
  renderAnchor?: never;
} & Omit<
    ComponentPropsWithRef<'button'>,
    'children' | 'className' | 'disabled' | 'style' | 'type'
  >;

type LinkProps<T extends string> = Look & {
  /** あれば `<button>` の代わりに `<a>` を描く。 */
  href: T;
  type?: never;
  action?: never;
  /** `<a>` の代わりに描く要素。Next.js の `Link` などに受け取った props を展開する。 */
  renderAnchor?: (props: RenderAnchorProps<T>) => ReactNode;
} & AnchorAttributes;

// 1 つのジェネリックな union にしないのは、TypeScript がそこから onClick などの
// 引数の型を推論できないため。ボタンの形を最後に置くのは、ComponentProps が
// 最後のシグネチャを読むため。
type IconButtonComponent = {
  <T extends string>(props: LinkProps<T>): ReactNode;
  (props: ButtonProps): ReactNode;
};

type ButtonRest = Omit<ButtonProps, keyof Look | 'type' | 'action'>;
type LinkRest<T extends string> = Omit<
  LinkProps<T>,
  keyof Look | 'type' | 'action'
>;

const isLink = <T extends string>(
  rest: ButtonRest | LinkRest<T>,
): rest is LinkRest<T> => rest.href !== undefined;

// Tooltip の aria-describedby は受け取らない。中身は label と同じ文で、名前は
// aria-label がすでに持つので、説明として繰り返し読ませないため。
type Wiring = Omit<Partial<TooltipTriggerProps>, 'aria-describedby'>;

// Stable module-level reference so it is not re-created on every render
// (default prop function expressions break referential equality).
const defaultRenderAnchor = ({
  children: anchorChildren,
  ...rest
}: RenderAnchorProps<string>): ReactNode => <a {...rest}>{anchorChildren}</a>;

/**
 * 描画する要素そのもの。IconButton から切り出しているのは合成 ref のため。
 * mergeRefs は呼ぶたび新しい関数を返し、React が毎レンダー ref を付け外しする。
 * 合成先の wiring は Tooltip.Trigger から引数で届くので IconButton 側では
 * useMemo に包めず、wiring を props として受け取るここでだけ包める。
 */
const Item: FC<{
  elementRef: Ref<HTMLButtonElement> | Ref<HTMLAnchorElement> | undefined;
  wiring: Wiring;
  draw: (wiring: Wiring, ref: RefCallback<HTMLElement>) => ReactNode;
}> = ({ elementRef, wiring, draw }) => {
  const wiringRef = wiring.ref;
  const mergedRef = useMemo(
    () => mergeRefs<HTMLElement>(elementRef, wiringRef),
    [elementRef, wiringRef],
  );
  return draw(wiring, mergedRef);
};

export const IconButton: IconButtonComponent = <T extends string>({
  size = 'md',
  variant = 'skeleton',
  color = 'primary',
  label,
  tooltipPlacement = 'top',
  tooltipDisabled = false,
  disabled = false,
  children,
  type = 'button',
  action,
  ...rest
}: ButtonProps | LinkProps<T>): ReactNode => {
  const [transitionPending, startTransition] = useTransition();
  const { pending: formPending } = useFormStatus();
  const isPending = transitionPending || (type === 'submit' && formPending);
  const isDisabled = disabled || isPending;

  const className = clsx(
    styles.root,
    focusRing.ring,
    variant === 'skeleton' ? styles.skeleton : SOLID[color],
    SIZE[size],
    isDisabled && styles.disabled,
  );

  let elementRef: Ref<HTMLButtonElement> | Ref<HTMLAnchorElement> | undefined;
  let draw: (wiring: Wiring, ref: RefCallback<HTMLElement>) => ReactNode;

  if (isLink(rest)) {
    const {
      href,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ref,
      renderAnchor = defaultRenderAnchor,
      ...anchorRest
    } = rest;
    elementRef = ref;
    draw = (wiring, mergedRef) =>
      renderAnchor({
        ...anchorRest,
        href,
        className,
        children,
        'aria-label': label,
        'aria-disabled': disabled || undefined,
        // <a> には disabled が無いので、無効なあいだはクリックで遷移させない。
        onClick: disabled
          ? (event: MouseEvent<HTMLAnchorElement>) => {
              event.preventDefault();
            }
          : onClick,
        onMouseEnter: chain<MouseEventHandler<HTMLAnchorElement>>(
          wiring.onMouseEnter,
          onMouseEnter,
        ),
        onMouseLeave: chain<MouseEventHandler<HTMLAnchorElement>>(
          wiring.onMouseLeave,
          onMouseLeave,
        ),
        onFocus: chain<FocusEventHandler<HTMLAnchorElement>>(
          wiring.onFocus,
          onFocus,
        ),
        onBlur: chain<FocusEventHandler<HTMLAnchorElement>>(
          wiring.onBlur,
          onBlur,
        ),
        ref: mergedRef,
      });
  } else {
    const {
      href: _href,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ref,
      ...buttonRest
    } = rest;
    elementRef = ref;
    // 無効なときもハンドラを付けるのは、保留中の <button> にはネイティブの
    // disabled が付かず、押せば click が届くため。
    const handleClick =
      onClick || action || isDisabled
        ? (event: MouseEvent<HTMLButtonElement>) => {
            if (isDisabled) {
              event.preventDefault();
              return;
            }
            onClick?.(event);
            if (event.defaultPrevented) return;
            if (action) {
              startTransition(async () => {
                await action();
              });
            }
          }
        : undefined;
    draw = (wiring, mergedRef) => (
      <button
        {...buttonRest}
        aria-busy={isPending || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label={label}
        className={className}
        // 保留中にネイティブの disabled を付けないのは、押されてフォーカスを持つ要素が
        // disabled になると、Chromium が描画の更新でフォーカスを body へ落とすため。
        // 二重の実行は handleClick が止める。
        disabled={disabled}
        onBlur={chain<FocusEventHandler<HTMLButtonElement>>(
          wiring.onBlur,
          onBlur,
        )}
        onClick={handleClick}
        onFocus={chain<FocusEventHandler<HTMLButtonElement>>(
          wiring.onFocus,
          onFocus,
        )}
        onMouseEnter={chain<MouseEventHandler<HTMLButtonElement>>(
          wiring.onMouseEnter,
          onMouseEnter,
        )}
        onMouseLeave={chain<MouseEventHandler<HTMLButtonElement>>(
          wiring.onMouseLeave,
          onMouseLeave,
        )}
        ref={mergedRef}
        // lint の button-has-type は変数の type を読めないので、値ごとにリテラルで書く。
        type={
          type === 'submit' ? 'submit' : type === 'reset' ? 'reset' : 'button'
        }
      >
        {children}
      </button>
    );
  }

  const render = (wiring: Wiring) => (
    <Item draw={draw} elementRef={elementRef} wiring={wiring} />
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
