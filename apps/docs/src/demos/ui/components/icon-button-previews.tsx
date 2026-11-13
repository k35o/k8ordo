'use client';

import { IconButton } from '@k8ordo/ui';
import { XIcon } from '@k8ordo/ui/icons';

export function IconButtonAsLinkPreview() {
  return (
    <IconButton
      label="Close"
      renderItem={({
        children,
        disabled: _disabled,
        triggerProps,
        type: _type,
        ...props
      }) => (
        <a href="https://example.com" {...props} {...triggerProps}>
          {children}
        </a>
      )}
    >
      <XIcon size="sm" />
    </IconButton>
  );
}
