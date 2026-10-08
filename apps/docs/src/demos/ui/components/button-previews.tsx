'use client';

import { Button } from '@k8ordo/ui';

export function ButtonAsLinkPreview() {
  return (
    <Button
      renderItem={({
        children,
        disabled: _disabled,
        type: _type,
        ...props
      }) => (
        <a href="https://example.com" {...props}>
          {children}
        </a>
      )}
    >
      Visit
    </Button>
  );
}
