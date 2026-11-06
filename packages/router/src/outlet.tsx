'use client';

import { createContext, use, useMemo } from 'react';
import type { FC } from 'react';

import type { RouteComponent } from './define-routes';

type StackValue = {
  stack: readonly RouteComponent[];
  index: number;
};

const StackContext = createContext<StackValue | null>(null);

export const RenderStack: FC<StackValue> = ({ stack, index }) => {
  const value = useMemo(() => ({ stack, index: index + 1 }), [stack, index]);
  const next = stack[index];
  if (next === undefined) return null;
  // This renderer passes nothing: a client app reads params from context and
  // renders the rest of the stack through `<Outlet />`.
  const Component = next as FC;
  return (
    <StackContext value={value}>
      <Component />
    </StackContext>
  );
};

/** Renders the next element of the matched stack — a layout's hole. */
export const Outlet: FC = () => {
  const ctx = use(StackContext);
  if (ctx === null) {
    throw new Error('Outlet must render inside <Router>');
  }
  return <RenderStack stack={ctx.stack} index={ctx.index} />;
};
