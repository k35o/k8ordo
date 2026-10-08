'use client';

import { CloseIcon, IconButton } from '@k8ordo/ui';

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
      <CloseIcon size="sm" />
    </IconButton>
  );
}
