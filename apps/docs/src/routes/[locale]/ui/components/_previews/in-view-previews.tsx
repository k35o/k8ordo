'use client';

import { Badge, InView } from '@k8ordo/ui';
import { useState } from 'react';

export function InViewBasicPreview() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <Badge
          label={isInView ? 'In view' : 'Out of view'}
          tone={isInView ? 'success' : 'neutral'}
        />
      </div>
      <section
        aria-label="InView demo container"
        className="border-border-mute h-48 overflow-y-auto rounded-lg border"
        ref={setContainer}
        // キーボードでもスクロールできるよう section にフォーカスを許可
        // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <p className="text-fg-mute h-80 p-4">Scroll down.</p>
        <InView onChange={setIsInView} root={container}>
          <p className="bg-primary-bg-subtle rounded-lg p-4">Target</p>
        </InView>
        <div className="h-80" />
      </section>
    </div>
  );
}

export function InViewOncePreview() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <Badge
          label={hasBeenSeen ? 'Seen' : 'Not seen yet'}
          tone={hasBeenSeen ? 'success' : 'neutral'}
        />
      </div>
      <section
        aria-label="InView once demo container"
        className="border-border-mute h-48 overflow-y-auto rounded-lg border"
        ref={setContainer}
        // キーボードでもスクロールできるよう section にフォーカスを許可
        // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <p className="text-fg-mute h-80 p-4">
          Scroll down, then back up. The badge stays.
        </p>
        <InView once onChange={setHasBeenSeen} root={container}>
          <p className="bg-primary-bg-subtle rounded-lg p-4">Target</p>
        </InView>
        <div className="h-80" />
      </section>
    </div>
  );
}
