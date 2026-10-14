import type { Message } from '@k8ordo/i18n';
import { FlaskIcon } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import * as m from '../messages';
import { Rich } from './rich';

import styles from './playground.module.css';

export type PlaygroundProps = {
  /** The anchor, the same in every locale. */
  id: string;
  title: Message;
  description?: Message;
  /** What to try, in order: a few short steps the reader can follow. */
  steps?: readonly Message[];
  /** The live demo. */
  children: ReactNode;
};

/**
 * A live demo as a section of its own, drawn like the playgrounds on k8o's
 * blog: a "Playground" pill and the title above an inset panel holding the
 * demo. The explanation of how it works stays in the page's text, not here.
 */
export function Playground({
  id,
  title,
  description,
  steps,
  children,
}: PlaygroundProps) {
  return (
    <section aria-labelledby={id}>
      <div className={`writing-h ${styles.panel}`}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.pill}>
              <FlaskIcon size="sm" />
              Playground
            </span>
            <h2 className={styles.title} id={id}>
              <Rich>{title()}</Rich>
            </h2>
          </div>
          {description !== undefined && (
            <p className={styles.description}>
              <Rich>{description()}</Rich>
            </p>
          )}
        </header>
        <div className={styles.stage}>{children}</div>
        {steps !== undefined && steps.length > 0 && (
          <div className={styles.steps}>
            <p className={styles.stepsLabel}>{m.docPage.tryIt()}</p>
            <ol className={styles.stepList}>
              {steps.map((step) => (
                <li key={step()}>
                  <Rich>{step()}</Rich>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
