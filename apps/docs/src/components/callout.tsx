import { Prose } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import * as m from '../messages';
import { Rich } from './rich';

type CalloutProps = { children: ReactNode };

/** Something worth knowing beside the main path. */
export function Note({ children }: CalloutProps) {
  return (
    <aside className="border-border-info bg-border-info/10 rounded-lg border-s-4 px-5 py-4">
      <p className="text-fg-info mb-1 text-sm font-bold">{m.docPage.note()}</p>
      <Prose>{children}</Prose>
    </aside>
  );
}

/** A mistake that is easy to make, and what to do instead. */
export function Pitfall({ children }: CalloutProps) {
  return (
    <aside className="border-border-warning bg-border-warning/10 rounded-lg border-s-4 px-5 py-4">
      <p className="text-fg-warning mb-1 text-sm font-bold">
        {m.docPage.pitfall()}
      </p>
      <Prose>{children}</Prose>
    </aside>
  );
}

type DeepDiveProps = {
  /** A question the reader might ask — the summary they open it by. */
  title: string;
  children: ReactNode;
};

/** Why it works this way: folded, for the reader who wants it. */
export function DeepDive({ title, children }: DeepDiveProps) {
  return (
    <details className="border-border-mute group rounded-lg border px-5 py-4">
      <summary className="cursor-pointer list-none">
        <span className="text-fg-mute block text-sm font-bold">
          {m.docPage.deepDive()}
        </span>
        <span className="text-fg-base font-bold">
          <Rich>{title}</Rich>
        </span>
      </summary>
      <div className="mt-3">
        <Prose>{children}</Prose>
      </div>
    </details>
  );
}
