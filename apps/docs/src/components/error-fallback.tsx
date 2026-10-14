'use client';

import { AlertIcon, Button, Heading } from '@k8ordo/ui';
import type { FC } from 'react';

import * as m from '../messages';

import styles from './error-fallback.module.css';

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
    className={`${styles.root} ${fullScreen ? styles.fullScreen : styles.fill}`}
  >
    <div className={styles.icon}>
      <AlertIcon size="lg" status="error" />
    </div>
    <div className={styles.message}>
      <Heading level="h2">{m.error.title()}</Heading>
      <p className={styles.description}>{m.error.description()}</p>
    </div>
    <Button onClick={resetErrorBoundary} variant="outline">
      {m.error.retry()}
    </Button>
  </div>
);
