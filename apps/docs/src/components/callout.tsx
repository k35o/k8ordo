import { Callout } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import * as m from '../messages';

type CalloutProps = { children: ReactNode };

/** Something worth knowing beside the main path. */
export function Note({ children }: CalloutProps) {
  return (
    <Callout label={m.docPage.note()} tone="info">
      {children}
    </Callout>
  );
}

/** A mistake that is easy to make, and what to do instead. */
export function Pitfall({ children }: CalloutProps) {
  return (
    <Callout label={m.docPage.pitfall()} tone="warning">
      {children}
    </Callout>
  );
}
