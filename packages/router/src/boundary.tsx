'use client';

import { Component, createElement, Suspense, use } from 'react';
import type { ComponentType, ReactNode } from 'react';

import { NavigationGeneration } from './navigation';

/**
 * What a route table's `error` component receives: what was thrown, and a
 * way to try the subtree again in place.
 */
export type ErrorProps = {
  readonly error: unknown;
  readonly reset: () => void;
};

export type ErrorComponent = ComponentType<ErrorProps>;

type BoundaryProps = {
  readonly fallback: ErrorComponent;
  readonly children?: ReactNode;
};

type CatchProps = BoundaryProps & { readonly generation: number };

type CatchState = {
  readonly error: unknown;
  readonly failed: boolean;
  readonly generation: number;
};

class Catch extends Component<CatchProps, CatchState> {
  override state: CatchState = {
    error: undefined,
    failed: false,
    generation: this.props.generation,
  };

  static getDerivedStateFromError(
    error: unknown,
  ): Pick<CatchState, 'error' | 'failed'> {
    return { error, failed: true };
  }

  static getDerivedStateFromProps(
    props: CatchProps,
    state: CatchState,
  ): CatchState | null {
    if (props.generation === state.generation) return null;
    return { error: undefined, failed: false, generation: props.generation };
  }

  private readonly reset = (): void => {
    this.setState({ error: undefined, failed: false });
  };

  override render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return createElement(this.props.fallback, {
      error: this.state.error,
      reset: this.reset,
    });
  }
}

/**
 * The boundary a table's `error` component renders inside. The navigation
 * that puts the next tree on screen clears the failure, so leaving the page
 * that failed leaves it behind — and not the pathname, which commits before
 * the tree arrives and would clear it onto the old tree.
 *
 * Cleared, not keyed: a key would remount everything below the boundary on
 * every page change, failed or not, and a root boundary would take the whole
 * application's layouts with it.
 */
export const RouteErrorBoundary = ({
  fallback,
  children,
}: BoundaryProps): ReactNode => {
  const generation = use(NavigationGeneration);
  // Under a Suspense boundary because a server render has no error
  // boundaries: what it has is the rule that a subtree which throws inside
  // Suspense is left for the browser to render. The browser then throws at
  // the same place and the boundary here catches it — so the error component
  // shows after hydration, with the frame around it already on screen.
  return createElement(
    Suspense,
    { fallback: null },
    createElement(Catch, { generation, fallback }, children),
  );
};
