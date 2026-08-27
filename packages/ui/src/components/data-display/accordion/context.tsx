'use client';

import { createContext, use, useCallback } from 'react';
import type { FC, PropsWithChildren } from 'react';

import { createSafeContext } from '../../../helpers/create-safe-context';
import { useControllableState } from '../../../hooks/controllable-state';

const OpenContext = createContext(false);

type ToggleOpen = () => void;
const [ToggleOpenContext, useToggleOpen] = createSafeContext<ToggleOpen>(
  'useToggleOpen must be used within AccordionProvider',
);
const [ItemIdContext, useItemId] = createSafeContext<string>(
  'useItemId must be used within AccordionProvider',
);

export { useItemId, useToggleOpen };

export const useOpen = (): boolean => use(OpenContext);

export const AccordionItemProvider: FC<
  PropsWithChildren<{
    isOpen?: boolean;
    defaultOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
    id: string;
  }>
> = ({ isOpen, defaultOpen = false, onChange, id, children }) => {
  const [open, setOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultOpen,
    onChange,
  });
  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  return (
    <OpenContext value={open}>
      <ToggleOpenContext value={toggle}>
        <ItemIdContext value={id}>{children}</ItemIdContext>
      </ToggleOpenContext>
    </OpenContext>
  );
};
