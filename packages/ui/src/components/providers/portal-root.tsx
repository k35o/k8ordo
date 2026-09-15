'use client';

import { createContext, use } from 'react';
import type { RefObject } from 'react';

/**
 * Where floating UI portals to. The Context is the provider — React 19's
 * spelling, `<PortalRootProvider value={ref}>` — so there is no wrapper
 * component to keep in step with it.
 */
export const PortalRootProvider = createContext<
  RefObject<HTMLElement | null> | undefined
>(undefined);

export const usePortalRoot = () => use(PortalRootProvider);
