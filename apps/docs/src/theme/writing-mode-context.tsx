'use client';

import { useLocalStorage } from '@k8ordo/ui';
import { createContext, use, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

type WritingMode = 'horizontal' | 'vertical';

type WritingModeContextValue = {
  writingMode: WritingMode;
  toggleWritingMode: () => void;
};

const WritingModeContext = createContext<WritingModeContextValue | null>(null);

const STORAGE_KEY = 'k8ordo-writing-mode';

export function WritingModeProvider({ children }: { children: ReactNode }) {
  const [storedMode, setStoredMode] = useLocalStorage<WritingMode>(
    STORAGE_KEY,
    'horizontal',
  );

  const toggleWritingMode = useCallback(() => {
    setStoredMode(storedMode === 'horizontal' ? 'vertical' : 'horizontal');
  }, [setStoredMode, storedMode]);

  const value = useMemo(
    () => ({ writingMode: storedMode, toggleWritingMode }),
    [storedMode, toggleWritingMode],
  );

  return <WritingModeContext value={value}>{children}</WritingModeContext>;
}

export function useWritingMode(): WritingModeContextValue {
  const context = use(WritingModeContext);
  if (context === null) {
    throw new Error('useWritingMode must be used within a WritingModeProvider');
  }
  return context;
}
