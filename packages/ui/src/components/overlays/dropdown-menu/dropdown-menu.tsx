'use client';

import { useId, useState } from 'react';
import type { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';

import type { Placement } from '../../../types/variables';
import { Button } from '../../buttons/button';
import { IconButton } from '../../buttons/icon-button';
import { ChevronIcon } from '../../icons';
import { useListNavigation } from '../_internal';
import { Popover, useOpenContext } from '../popover';
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
    <Popover.Content
      renderItem={(props) => (
        <div {...props} {...contentProps} className={panelClass}>
          {children}
        </div>
      )}
    />
  );
};

export type ItemProps = {
  onAction: () => void;
  label: string;
};

export const Item: FC<ItemProps> = ({ label, onAction }) => {
  const id = useId();
  const props = useMenuItem({ onAction, id });

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

export const IconTrigger: FC<{
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
