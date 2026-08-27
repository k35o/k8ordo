'use client';

import { createContext, use } from 'react';
import type { FC, PropsWithChildren, RefObject } from 'react';

const PortalRootContext = createContext<
  RefObject<HTMLElement | null> | undefined
>(undefined);

export const usePortalRoot = () => use(PortalRootContext);

export const PortalRootProvider: FC<
  PropsWithChildren<{
    value?: RefObject<HTMLElement | null> | undefined;
  }>
> = ({ value, children }) => (
  <PortalRootContext value={value}>{children}</PortalRootContext>
);
