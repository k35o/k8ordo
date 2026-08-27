'use client';

import { useSyncExternalStore } from 'react';

export const useClient = (): boolean =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
