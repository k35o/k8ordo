'use client';

import { Badge, InView } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './in-view-previews.module.css';

export function InViewBasicPreview() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  return (
    <div className={styles.root}>
      <div>
        <Badge
          label={isInView ? 'In view' : 'Out of view'}
          tone={isInView ? 'success' : 'neutral'}
        />
      </div>
      <section
        aria-label="InView demo container"
        className={styles.scroller}
        ref={setContainer}
        // キーボードでもスクロールできるよう section にフォーカスを許可
        // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <p className={styles.intro}>Scroll down.</p>
        <InView onChange={setIsInView} root={container}>
          <p className={styles.target}>Target</p>
        </InView>
        <div className={styles.spacer} />
      </section>
    </div>
  );
}

export function InViewOncePreview() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  return (
    <div className={styles.root}>
      <div>
        <Badge
          label={hasBeenSeen ? 'Seen' : 'Not seen yet'}
          tone={hasBeenSeen ? 'success' : 'neutral'}
        />
      </div>
      <section
        aria-label="InView once demo container"
        className={styles.scroller}
        ref={setContainer}
        // キーボードでもスクロールできるよう section にフォーカスを許可
        // oxlint-disable-next-line eslint-plugin-jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <p className={styles.intro}>
          Scroll down, then back up. The badge stays.
        </p>
        <InView once onChange={setHasBeenSeen} root={container}>
          <p className={styles.target}>Target</p>
        </InView>
        <div className={styles.spacer} />
      </section>
    </div>
  );
}
