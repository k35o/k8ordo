'use client';

import { clsx } from 'clsx';
import type {
  ComponentPropsWithRef,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { useTransition } from 'react';
import { useFormStatus } from 'react-dom';

import { Spinner } from '../../feedback/spinner/spinner';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './button.module.css';

type AnchorAttributes = Omit<
  ComponentPropsWithRef<'a'>,
  'aria-disabled' | 'children' | 'className' | 'href' | 'style' | 'type'
>;

type RenderAnchorProps<T extends string> = {
  href: NoInfer<T>;
  className: string;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLAnchorElement> | undefined;
  'aria-disabled': true | undefined;
} & Omit<AnchorAttributes, 'onClick'>;

type Look = {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'base';
  variant?: 'solid' | 'outline' | 'skeleton';
  fullWidth?: boolean;
  isActive?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
};

type ButtonProps = Look & {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  /**
   * 押したときに transition の中で走らせる処理。返した Promise が解決するまで
   * スピナーを出し、`aria-busy` と `aria-disabled` を立て、押されても何もしない。
   * ボタンはフォーカスを持ったままでいる。続けて押す同期の更新や、イベントが
   * 要る処理は `onClick` に書く。両方あれば `onClick` → `action` の順に呼び、
   * `onClick` が `preventDefault` したら `action` は呼ばない。
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
type ButtonComponent = {
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

const VARIANT = {
  solid: {
    primary: styles.solidPrimary,
    secondary: styles.solidSecondary,
    base: styles.solidBase,
  },
  outline: {
    primary: styles.outlinePrimary,
    secondary: styles.outlineSecondary,
    base: styles.outlineBase,
  },
} as const;

const SIZE = { sm: styles.sm, md: styles.md, lg: styles.lg } as const;

// Stable module-level reference so it is not re-created on every render
// (default prop function expressions break referential equality).
const defaultRenderAnchor = ({
  children: anchorChildren,
  ...rest
}: RenderAnchorProps<string>): ReactNode => <a {...rest}>{anchorChildren}</a>;

export const Button: ButtonComponent = <T extends string>({
  size = 'md',
  color = 'primary',
  variant = 'solid',
  fullWidth = false,
  isActive = false,
  disabled = false,
  startIcon,
  endIcon,
  children,
  type = 'button',
  action,
  ...rest
}: ButtonProps | LinkProps<T>): ReactNode => {
  const [transitionPending, startTransition] = useTransition();
  const { pending: formPending } = useFormStatus();
  const isPending = transitionPending || (type === 'submit' && formPending);
  const isDisabled = disabled || isPending;

  const spinnerSize = size === 'lg' ? 'md' : 'sm';
  const resolvedStartIcon = isPending ? (
    <Spinner size={spinnerSize} />
  ) : (
    startIcon
  );
  const hasStartIcon = resolvedStartIcon !== undefined;
  const hasEndIcon = endIcon !== undefined;

  const className = clsx(
    styles.root,
    variant === 'skeleton' ? styles.skeleton : VARIANT[variant][color],
    focusRing.ring,
    SIZE[size],
    fullWidth && styles.fullWidth,
    (hasStartIcon || hasEndIcon) && styles.withIcons,
    hasStartIcon && !hasEndIcon && variant !== 'skeleton'
      ? styles.iconsCentered
      : hasEndIcon && styles.iconsApart,
    isActive && styles.active,
    isDisabled && styles.disabled,
  );
  const content = (
    <>
      {resolvedStartIcon}
      {children}
      {endIcon}
    </>
  );

  if (isLink(rest)) {
    const {
      href,
      onClick,
      renderAnchor = defaultRenderAnchor,
      ...anchorRest
    } = rest;
    return renderAnchor({
      ...anchorRest,
      href,
      className,
      children: content,
      'aria-disabled': disabled || undefined,
      // <a> には disabled が無いので、無効なあいだはクリックで遷移させない。
      onClick: disabled
        ? (event: MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
          }
        : onClick,
    });
  }

  const { href: _href, onClick, ...buttonRest } = rest;
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

  return (
    <button
      {...buttonRest}
      aria-busy={isPending || undefined}
      aria-disabled={isDisabled || undefined}
      className={className}
      // 保留中にネイティブの disabled を付けないのは、押されてフォーカスを持つ要素が
      // disabled になると、Chromium が描画の更新でフォーカスを body へ落とすため。
      // 二重の実行は handleClick が止める。入力欄の Enter による暗黙の送信も、既定の
      // ボタンへの click を経るので同じく止まる。
      disabled={disabled}
      onClick={handleClick}
      // lint の button-has-type は変数の type を読めないので、値ごとにリテラルで書く。
      type={
        type === 'submit' ? 'submit' : type === 'reset' ? 'reset' : 'button'
      }
    >
      {content}
    </button>
  );
};
