'use client';

import { useId, useState } from 'react';
import type {
  ComponentProps,
  FC,
  KeyboardEvent,
  KeyboardEventHandler,
  PropsWithChildren,
  ReactNode,
} from 'react';

import type { Placement } from '../../../types/variables';
import { Button } from '../../buttons/button';
import { IconButton } from '../../buttons/icon-button';
import { ChevronIcon } from '../../icons/chevron';
import { useListNavigation } from '../_internal';
import { PopoverBase, useOpenContext } from '../popover';
import { MenuContextProvider, useMenuContent, useMenuItem } from './hooks';
import { itemClass, panelClass } from './shared';

export const Root: FC<
  PropsWithChildren<{
    placement?: Placement;
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
  }>
> = ({
  children,
  placement = 'bottom-start',
  isOpen,
  defaultOpen,
  onChange,
}) => (
  <PopoverBase.Root
    defaultOpen={defaultOpen}
    isOpen={isOpen}
    onChange={onChange}
    placement={placement}
    role="menu"
  >
    <MenuProvider>{children}</MenuProvider>
  </PopoverBase.Root>
);

const MenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onClose } = useOpenContext();
  const [activeId, setActiveId] = useState<string | null>(null);

  const nav = useListNavigation({
    open: isOpen,
    activeId,
    setActiveId,
    loop: true,
  });

  return (
    <MenuContextProvider value={{ ...nav, closeRoot: onClose }}>
      {children}
    </MenuContextProvider>
  );
};

export const Content: FC<PropsWithChildren> = ({ children }) => {
  const { contentProps } = useMenuContent();

  return (
    <PopoverBase.Content
      renderItem={(props) => (
        <div {...props} {...contentProps} className={panelClass}>
          {children}
        </div>
      )}
    />
  );
};

type RenderItemAnchorProps<T extends string> = {
  href: NoInfer<T>;
  className: string;
  children: ReactNode;
  role: 'menuitem';
  onKeyDown: KeyboardEventHandler<HTMLAnchorElement>;
} & Omit<ReturnType<typeof useMenuItem>, 'role'>;

type ActionItemProps = {
  label: string;
  /** 選んだときに呼ぶ。呼んだあとメニューを閉じる。 */
  onAction: () => void;
  href?: never;
  renderAnchor?: never;
};

type LinkItemProps<T extends string> = {
  label: string;
  /** あれば `<a role="menuitem">` を描く。押すとメニューを閉じ、遷移はブラウザに任せる。 */
  href: T;
  /** `<a>` の代わりに描く要素。Next.js の `Link` などに受け取った props を展開する。 */
  renderAnchor?: (props: RenderItemAnchorProps<T>) => ReactNode;
  onAction?: never;
};

// 1 つのジェネリックな union にしないのは、TypeScript がそこから renderAnchor
// の引数の型を推論できないため。項目の形を最後に置くのは、ComponentProps が
// 最後のシグネチャを読むため。
type ItemComponent = {
  <T extends string>(props: LinkItemProps<T>): ReactNode;
  (props: ActionItemProps): ReactNode;
};

// Stable module-level reference so it is not re-created on every render
// (default prop function expressions break referential equality).
const defaultRenderAnchor = ({
  children,
  ...rest
}: RenderItemAnchorProps<string>): ReactNode => <a {...rest}>{children}</a>;

// <a> は Space で押せず、ページをスクロールする。ボタンの項目と同じく、
// Space で選べるようにする
const pressOnSpace = (event: KeyboardEvent<HTMLAnchorElement>) => {
  if (event.key !== ' ') {
    return;
  }
  event.preventDefault();
  event.currentTarget.click();
};

export const Item: ItemComponent = <T extends string>({
  label,
  onAction,
  href,
  renderAnchor = defaultRenderAnchor,
}: ActionItemProps | LinkItemProps<T>): ReactNode => {
  const id = useId();
  const props = useMenuItem({ onAction, id });

  if (href !== undefined) {
    return renderAnchor({
      ...props,
      href,
      className: itemClass,
      children: label,
      onKeyDown: pressOnSpace,
    });
  }

  return (
    <button className={itemClass} type="button" {...props}>
      {label}
    </button>
  );
};

export const Trigger: FC<{
  label: string;
  size?: ComponentProps<typeof Button>['size'];
  variant?: ComponentProps<typeof Button>['variant'];
  color?: ComponentProps<typeof Button>['color'];
}> = ({ label, size = 'md', variant = 'solid', color = 'base' }) => (
  <PopoverBase.Trigger
    renderItem={(props) => (
      <Button
        {...props}
        color={color}
        endIcon={<ChevronIcon direction="down" />}
        size={size}
        type="button"
        variant={variant}
      >
        {label}
      </Button>
    )}
  />
);

export const IconTrigger: FC<{
  icon: ReactNode;
  label: string;
  size?: ComponentProps<typeof IconButton>['size'];
  variant?: ComponentProps<typeof IconButton>['variant'];
  color?: ComponentProps<typeof IconButton>['color'];
}> = ({ icon, label, size = 'md', variant = 'solid', color = 'base' }) => (
  <PopoverBase.Trigger
    renderItem={(props) => (
      <IconButton
        {...props}
        color={color}
        label={label}
        size={size}
        tooltipDisabled
        variant={variant}
      >
        {icon}
      </IconButton>
    )}
  />
);
