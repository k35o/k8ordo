'use client';

import { BrowserPathname, NavigationGeneration } from '@k8ordo/router';
import { Component, createContext, Suspense, use } from 'react';
import type { ReactNode } from 'react';

import { saysNotFound } from './says-not-found';

/**
 * What shows a shell's not-found in place — `true` when it did — or null
 * where the payload carries none.
 */
export const ShowNotFound = createContext<(() => boolean) | null>(null);

type CatchProps = {
  readonly generation: number;
  readonly show: (() => boolean) | null;
  readonly children: ReactNode;
};

type CatchState = {
  readonly error: unknown;
  readonly caught: boolean;
  readonly generation: number;
};

/**
 * The class half of `FallbackBoundary`, exported for `reportCaught`, which
 * stays quiet about a `notFound()` this answers.
 */
export class FallbackCatch extends Component<CatchProps, CatchState> {
  override state: CatchState = {
    error: undefined,
    caught: false,
    generation: this.props.generation,
  };

  static getDerivedStateFromError(
    error: unknown,
  ): Pick<CatchState, 'error' | 'caught'> {
    return { error, caught: true };
  }

  // 同じ形の木（同じ殻の別の値）はこの実体のまま描き直されるので、
  // 捕まえたままだと次の値まで空になる。木を載せた遷移が替わったら放す
  static getDerivedStateFromProps(
    props: CatchProps,
    state: CatchState,
  ): CatchState | null {
    if (props.generation === state.generation) return null;
    return { error: undefined, caught: false, generation: props.generation };
  }

  override componentDidCatch(error: unknown): void {
    if (saysNotFound(error)) this.props.show?.();
  }

  override render(): ReactNode {
    if (!this.state.caught) {
      return (
        <Suspense fallback={null}>
          <BrowserPathname>{this.props.children}</BrowserPathname>
        </Suspense>
      );
    }
    if (saysNotFound(this.state.error) && this.props.show !== null) return null;
    throw this.state.error;
  }
}

/**
 * Around a fallback.tsx, closest to it. Its client code reads the params in
 * the browser and may find nothing there; a file cannot be asked for another
 * answer, so notFound() shows the not-found the shell's payload carries, in
 * place, under the status the file was served with.
 *
 * What it renders reads the URL only in the browser (`BrowserPathname`): the
 * server rendered the shell for a pathname no visitor is at. The `Suspense`
 * keeps that inside the fallback, so the layouts above stay HTML.
 */
export const FallbackBoundary = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => (
  <FallbackCatch
    generation={use(NavigationGeneration)}
    show={use(ShowNotFound)}
  >
    {children}
  </FallbackCatch>
);
