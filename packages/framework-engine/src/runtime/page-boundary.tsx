'use client';

import { isNotFound } from '@k8ordo/router';
import { Component } from 'react';
import type { ReactNode } from 'react';

import { NOT_FOUND_DIGEST } from './payload';
import { isNavigated } from './recover';
import { reloadDocument } from './reload';

const saysNotFound = (error: unknown): boolean =>
  isNotFound(error) ||
  (typeof error === 'object' &&
    error !== null &&
    (error as { digest?: unknown }).digest === NOT_FOUND_DIGEST);

/** Whether the boundary answers `error` with a document load. */
const sendsBack = (error: unknown): boolean =>
  saysNotFound(error) && isNavigated();

/**
 * What the root reports of an error a boundary caught: what React would —
 * the error, and under `vite dev` where in the tree — except a navigation's
 * `notFound()`, which is no failure: the document load this boundary asks
 * for answers it, under a 404.
 */
export const reportCaught = (
  error: unknown,
  info: { readonly componentStack?: string | undefined },
): void => {
  if (sendsBack(error)) return;
  if (import.meta.env.DEV) console.error(error, info.componentStack);
  else console.error(error);
};

type State = { readonly error: unknown; readonly caught: boolean };

/**
 * Around every page, closest to it. A document waits for its page before it
 * answers, so a `notFound()` there is answered by the server — the nearest
 * `not-found.tsx`, under a 404. A client navigation does not wait: the
 * payload streams, and a page that says `notFound()` only once it has
 * started arrives here. A document load of the same URL is what the server
 * answers properly, so that is what this asks for — before any `error.tsx`
 * above can mistake the answer for a failure.
 *
 * Anything else, and a `notFound()` in the document the server rendered,
 * goes on to the nearest `error.tsx`: loading the document again would only
 * bring the same page back.
 */
export class PageBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { error: undefined, caught: false };

  static getDerivedStateFromError(error: unknown): State {
    return { error, caught: true };
  }

  override componentDidCatch(error: unknown): void {
    if (sendsBack(error)) reloadDocument();
  }

  override render(): ReactNode {
    if (!this.state.caught) return this.props.children;
    if (sendsBack(this.state.error)) return null;
    throw this.state.error;
  }
}
