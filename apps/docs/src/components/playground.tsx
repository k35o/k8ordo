import type { Message } from '@k8ordo/i18n';
import { Separator } from '@k8ordo/ui';
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
 * A live demo as a section of its own: the title and what it shows sit inside
 * the card, above the demo. The explanation of how it works stays in the
 * page's text, not here.
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
      <div className="border-border-mute bg-bg-base flex flex-col gap-6 rounded-xl border p-7 sm:gap-8 sm:p-10">
        <header className="flex flex-col gap-2 sm:gap-3">
          <h2 className="text-fg-base text-md font-bold sm:text-lg" id={id}>
            <Rich>{title()}</Rich>
          </h2>
          {description !== undefined && (
            <p className="text-fg-mute text-sm leading-relaxed">
              <Rich>{description()}</Rich>
            </p>
          )}
          <Separator color="mute" />
        </header>
        <div className="min-w-0">{children}</div>
        {steps !== undefined && steps.length > 0 && (
          <div className="flex flex-col gap-2">
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
