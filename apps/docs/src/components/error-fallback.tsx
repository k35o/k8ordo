'use client';

import { AlertIcon, Button, Heading } from '@k8ordo/ui';
import type { FC } from 'react';

import * as m from '../messages';

type ErrorFallbackProps = {
  resetErrorBoundary: () => void;
  fullScreen?: boolean;
};

/**
 * ルートの error.tsx からも描かれる。文言は URL からロケールを読むので、
 * Provider の内外を問わず同じに使える。
 */
export const ErrorFallback: FC<ErrorFallbackProps> = ({
  resetErrorBoundary,
  fullScreen = false,
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-6 p-8 ${fullScreen ? 'h-dvh' : 'h-full'}`}
  >
    <div className="text-fg-error">
      <AlertIcon size="lg" status="error" />
    </div>
    <div className="flex flex-col items-center gap-2">
      <Heading level="h2">{m.error.title()}</Heading>
      <p className="text-fg-mute text-sm">{m.error.description()}</p>
    </div>
    <Button onClick={resetErrorBoundary} variant="outline">
      {m.error.retry()}
    </Button>
  </div>
);
