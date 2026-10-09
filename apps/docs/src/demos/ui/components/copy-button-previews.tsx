'use client';

import { CopyButton } from '@k8ordo/ui';

export function CopyButtonLazyValuePreview() {
  return <CopyButton label="Copy link" value={() => window.location.href} />;
}
