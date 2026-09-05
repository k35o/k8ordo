'use client';

import { Component } from 'react';
import type { ReactNode } from 'react';

import { reloadDocument } from './reload';

/**
 * Whether a client navigation has put a tree on screen yet. Until one has,
 * the tree being rendered is the one the server sent as HTML. A fact about
 * the document, not about a component, which is why it is not a prop.
 */
let navigated = false;

export const markNavigated = (): void => {
  navigated = true;
};

/**
 * The document is being replaced; a value returned now would render into a
 * page that is on its way out.
 */
export const reloadInstead = <T,>(): Promise<T> => {
  reloadDocument();
  return new Promise<T>(() => {
    /* never settles */
  });
};

/**
 * Where a page that fails to render goes. A document load of the same URL
 * shows the server's own answer — its 500, its error page — so a failed
 * client navigation falls back to exactly that, the way a URL that turns out
 * not to be a page already does. Left alone, React would unmount the root and
 * leave a blank document under the new URL, with nothing settling `finished`.
 *
 * Hydration is left to fail: a page whose HTML the server already rendered
 * cannot be made better by asking for it again, and reloading it would loop.
 */
export class Recover extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(error: unknown): void {
    if (!navigated) throw error;
    reloadDocument();
  }

  override render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}
