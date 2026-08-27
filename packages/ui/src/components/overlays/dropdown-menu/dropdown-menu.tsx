'use client';

import { useState } from 'react';
import type { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';

import type { Placement } from '../../../types/variables';
import { Button } from '../../buttons/button';
import { IconButton } from '../../buttons/icon-button';
import { ChevronIcon } from '../../icons';
import { useListNavigation } from '../_internal';
import { Popover, useOpenContext } from '../popover';
import { MenuContextProvider, useMenuContent, useMenuItem } from './hooks';
import { cloneWithIndex, itemClass, panelClass } from './shared';
import { SubMenu } from './sub-menu';
import type { SubMenuProps } from './sub-menu';

const Root: FC<
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
  <Popover.Root
    defaultOpen={defaultOpen}
    isOpen={isOpen}
    onChange={onChange}
    placement={placement}
    role="menu"
  >
    <MenuProvider>{children}</MenuProvider>
  </Popover.Root>
);

const MenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onClose } = useOpenContext();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const nav = useListNavigation({
    open: isOpen,
    activeIndex,
    setActiveIndex,
    loop: true,
  });

  return (
    <MenuContextProvider value={{ ...nav, closeRoot: onClose }}>
      {children}
    </MenuContextProvider>
  );
};

const Content: FC<PropsWithChildren> = ({ children }) => {
  const { contentProps } = useMenuContent();

  return (
    <Popover.Content
      renderItem={(props) => (
        <div {...props} {...contentProps} className={panelClass}>
          {cloneWithIndex(children)}
        </div>
      )}
    />
  );
};

type ItemProps = {
  onAction: () => void;
  label: string;
};

const Item: FC<ItemProps & { index?: number }> = ({
  label,
  onAction,
  index = 0,
}) => {
  const props = useMenuItem({ onAction, index });

  return (
    <button className={itemClass} type="button" {...props}>
      {label}
    </button>
  );
};

const Trigger: FC<{
  label: string;
  size?: ComponentProps<typeof Button>['size'];
  variant?: ComponentProps<typeof Button>['variant'];
}> = ({ label, size = 'md', variant = 'solid' }) => (
  <Popover.Trigger
    renderItem={(props) => (
      <Button
        {...props}
        color="base"
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

const IconTrigger: FC<{
  icon: ReactNode;
  label: string;
}> = ({ icon, label }) => (
  <Popover.Trigger
    renderItem={(props) => (
      <IconButton color="base" label={label} tooltipDisabled {...props}>
        {icon}
      </IconButton>
    )}
  />
);

export const DropdownMenu = {
  Root,
  Content,
  // `index` は Content の cloneWithIndex が注入する内部 prop のため公開型から隠す
  Item: Item as FC<ItemProps>,
  SubMenu: SubMenu as FC<SubMenuProps>,
  Trigger,
  IconTrigger,
} as const;
