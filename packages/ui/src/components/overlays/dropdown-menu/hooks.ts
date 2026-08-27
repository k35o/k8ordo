'use client';

import { useMemo } from 'react';

import { createSafeContext } from '../../../helpers';
import type { ListNavigation } from '../_internal';

type MenuContext = ListNavigation & {
  // サブメニューの項目から選択したときも、ネスト元をたどってメニュー全体を
  // 閉じられるよう、直近の popover ではなくルートの close を配る。
  closeRoot: () => void;
};

export const [MenuContextProvider, useMenuContext] =
  createSafeContext<MenuContext>(
    'useMenuContext must be used within a DropdownMenu.Root',
  );

export const useMenuContent = () => {
  const menu = useMenuContext();

  return useMemo(
    () => ({
      contentProps: menu.getContentProps(),
    }),
    [menu],
  );
};

export const useMenuItem = ({
  onAction,
  index,
}: {
  onAction: () => void;
  index: number;
}) => {
  const menu = useMenuContext();
  return useMemo(
    () => ({
      role: 'menuitem' as const,
      ...menu.getItemProps(index),
      onClick: () => {
        onAction();
        menu.closeRoot();
      },
    }),
    [index, menu, onAction],
  );
};
