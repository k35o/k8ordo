import type { Message } from '@k8ordo/i18n';
import { FlaskIcon } from '@k8ordo/ui';
import type { ReactNode } from 'react';

import * as m from '../messages';
import { Rich } from './rich';

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
      <div className="writing-h bg-bg-surface dark:bg-bg-subtle rounded-xl p-2">
        <header className="flex flex-col gap-1.5 px-3 pt-2 pb-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-primary-fg bg-primary-bg-subtle inline-flex items-center gap-1 rounded-full py-1 ps-2 pe-2.5 text-xs font-bold">
              <FlaskIcon size="sm" />
              Playground
            </span>
            <h2 className="text-fg-base text-md font-bold sm:text-lg" id={id}>
              <Rich>{title()}</Rich>
            </h2>
          </div>
          {description !== undefined && (
            <p className="text-fg-mute text-sm leading-relaxed">
              <Rich>{description()}</Rich>
            </p>
          )}
        </header>
        <div className="bg-bg-base min-w-0 rounded-lg p-6 sm:p-8">
          {children}
        </div>
        {steps !== undefined && steps.length > 0 && (
          <div className="flex flex-col gap-2 px-3 pt-4 pb-2">
            <p className="text-fg-base text-sm font-bold">
              {m.docPage.tryIt()}
            </p>
            <ol className="text-fg-mute flex list-decimal flex-col gap-1 ps-5 text-sm leading-relaxed">
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
