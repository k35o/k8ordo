'use client';

import { Alert, Anchor, Button } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './alert-previews.module.css';

export function AlertActionLinkPreview() {
  return (
    <Alert
      action={
        <Anchor href="https://example.com" openInNewTab>
          Learn more
        </Anchor>
      }
      message="A new version is available."
      tone="info"
    />
  );
}

export function AlertActionButtonPreview() {
  return (
    <Alert
      action={
        <button className={styles.infoAction} onClick={() => {}} type="button">
          Open settings
        </button>
      }
      message="Your profile setup is incomplete."
      tone="warning"
    />
  );
}

export function AlertDismissiblePreview() {
  const [isVisible, setIsVisible] = useState(true);
  return isVisible ? (
    <Alert
      message="Some features may not work correctly in your browser. We recommend updating to the latest version."
      onClose={() => {
        setIsVisible(false);
      }}
      tone="warning"
    />
  ) : (
    <Button
      onClick={() => {
        setIsVisible(true);
      }}
      variant="outline"
    >
      Reset
    </Button>
  );
}

export function AlertWithActionPreview() {
  const [isVisible, setIsVisible] = useState(true);
  return isVisible ? (
    <Alert
      action={
        <button
          className={styles.primaryAction}
          onClick={() => {}}
          type="button"
        >
          Learn more
        </button>
      }
      message="Some features may not work correctly in your browser. We recommend updating to the latest version."
      onClose={() => {
        setIsVisible(false);
      }}
      tone="warning"
    />
  ) : (
    <Button
      onClick={() => {
        setIsVisible(true);
      }}
      variant="outline"
    >
      Reset
    </Button>
  );
}
