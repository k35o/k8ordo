'use client';

import { Alert, Anchor, Button } from '@k8ordo/ui';
import { useState } from 'react';

export function AlertActionLinkPreview() {
  return (
    <Alert
      action={{
        label: 'Learn more',
        renderItem: ({ children }) => (
          <Anchor href="https://example.com" openInNewTab>
            {children}
          </Anchor>
        ),
      }}
      message="A new version is available."
      tone="info"
    />
  );
}

export function AlertActionButtonPreview() {
  return (
    <Alert
      action={{
        label: 'Open settings',
        renderItem: ({ children }) => (
          <button
            className="text-fg-info underline"
            onClick={() => {}}
            type="button"
          >
            {children}
          </button>
        ),
      }}
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
      action={{
        label: 'Learn more',
        renderItem: ({ children }) => (
          <button
            className="text-primary-fg cursor-pointer underline underline-offset-2"
            onClick={() => {}}
            type="button"
          >
            {children}
          </button>
        ),
      }}
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
