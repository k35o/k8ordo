'use client';

import { useMemo } from 'react';

import { createSafeContext } from '../../../helpers/create-safe-context';
import { useMessages } from '../../../i18n/context';
import type { Option } from '../../../types/variables';
import type { ListNavigation } from '../_internal/use-list-navigation';
import { useOpenContext } from '../popover/hooks';

type MenuContext = ListNavigation & {
  options: readonly Option[];
  selectedIndex: number;
  handleSelect: (index: number) => void;
};

const [MenuContextProvider, useMenuContext] = createSafeContext<MenuContext>(
  'useMenuContext must be used within a ListBox.Root',
);

export { MenuContextProvider };

export const useMenuContent = () => {
  const menu = useMenuContext();

  return useMemo(
    () => ({
      options: menu.options,
      selectedIndex: menu.selectedIndex,
      contentProps: menu.getContentProps(),
    }),
    [menu],
  );
};

export const useMenuItem = (index: number) => {
  const menu = useMenuContext();
  const { onClose } = useOpenContext();
  return useMemo(
    () => ({
      selected: menu.selectedIndex === index,
      props: {
        role: 'option' as const,
        'aria-selected': menu.selectedIndex === index,
        ...menu.getItemProps(index),
        onClick: () => {
          menu.handleSelect(index);
          onClose();
        },
      },
    }),
    [index, menu, onClose],
  );
};

export const useMenuTrigger = () => {
  const menu = useMenuContext();
  const defaultLabel = useMessages().listBoxPlaceholder;
  const valueLabel =
    menu.selectedIndex < 0
      ? defaultLabel
      : (menu.options[menu.selectedIndex]?.label ?? defaultLabel);
  return useMemo(() => ({ valueLabel }), [valueLabel]);
};
