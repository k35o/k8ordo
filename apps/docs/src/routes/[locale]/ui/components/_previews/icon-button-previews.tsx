'use client';

import { CloseIcon, IconButton } from '@k8ordo/ui';

export function IconButtonAsLinkPreview() {
  return (
    <IconButton
      label="Close"
      renderItem={({
        className,
        children,
        'aria-label': ariaLabel,
        triggerProps,
      }) => (
        <a
          aria-label={ariaLabel}
          className={className}
          href="https://example.com"
          {...triggerProps}
        >
          {children}
        </a>
      )}
    >
      <CloseIcon size="sm" />
    </IconButton>
  );
}
