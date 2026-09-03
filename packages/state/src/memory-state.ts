import type { StateValues } from './schema/object';

/**
 * A typed shared box that lives for the JS runtime and resets on reload.
 * The one kind with no schema: its values never leave the runtime, so there
 * is no boundary to re-validate at — a typed `update` is the only writer.
 */
export type MemoryState<Values extends StateValues = StateValues> = {
  kind: 'memory';
  /** Identity of this state: the store registry slot. */
  key: string;
  /** The initial values; also what SSR renders. */
  initial: Readonly<Values>;
};

export const defineMemoryState = <Values extends StateValues>(
  key: string,
  initial: Values,
): MemoryState<Values> => ({ kind: 'memory', key, initial: { ...initial } });
