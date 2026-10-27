/**
 * The shapes React shares between `React.lazy`, the Flight client and the
 * reconciler, and the only ones read here: an element's `$$typeof`, `type`
 * and `props`, and a lazy's `$$typeof`, `_payload` and `_init` — which
 * returns what it stands for, or throws a thenable while that is on its way.
 */
const ELEMENT = Symbol.for('react.transitional.element');
const LAZY = Symbol.for('react.lazy');
const SUSPENSE = Symbol.for('react.suspense');

type Lazy = {
  readonly _payload: unknown;
  readonly _init: (payload: unknown) => unknown;
};

type Element = {
  readonly type: unknown;
  readonly props: Readonly<Record<string, unknown>>;
};

const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

const isLazy = (value: unknown): value is Lazy =>
  isObject(value) && (value as { $$typeof?: unknown }).$$typeof === LAZY;

const isElement = (value: object): value is Element =>
  (value as { $$typeof?: unknown }).$$typeof === ELEMENT;

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  isObject(value) && typeof (value as { then?: unknown }).then === 'function';

const isPlain = (value: object): boolean => {
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const whenSettled = (thenable: PromiseLike<unknown>): Promise<void> =>
  new Promise((resolve) => {
    thenable.then(
      () => {
        resolve();
      },
      () => {
        resolve();
      },
    );
  });

export type ClientReadyOptions = {
  /**
   * What to do with a row still on its way inside a `<Suspense>`: `'wait'`
   * for it, or `'leave'` it to that boundary's fallback, as a transition
   * leaves it — a page streaming what it put under a boundary of its own.
   */
  readonly inSuspense: 'wait' | 'leave';
};

/**
 * Settles once the client components a payload's trees name have loaded.
 * The Flight client hands each one over as a lazy element type and starts
 * importing it as the payload is read; a render that meets one still loading
 * suspends there, and the nearest `<Suspense>` shows its fallback — in place
 * of the server's HTML on a first render, and in place of a page a
 * navigation has just put on screen.
 *
 * Walks every element's `type` and `props` (`children` and any other prop
 * holding elements), arrays and plain objects, each once, since a payload
 * shares and nests them. A row still on its way (a lazy node: what a page
 * sends once its data is in) is waited for and walked too, except as
 * `inSuspense` says. What fails — a row the server could not render, a
 * module that would not load — ends the wait there, for the render to meet
 * where an error boundary takes it.
 */
export const whenClientReady = async (
  trees: readonly unknown[],
  { inSuspense }: ClientReadyOptions,
): Promise<void> => {
  const seen = new WeakSet<object>();
  let waiting: Array<{
    readonly until: PromiseLike<unknown>;
    readonly again: () => void;
  }> = [];

  const read = (lazy: Lazy, inside: boolean, isType: boolean): void => {
    let value: unknown;
    try {
      value = lazy._init(lazy._payload);
    } catch (thrown) {
      if (isThenable(thrown) && (isType || !inside || inSuspense === 'wait')) {
        waiting.push({
          until: thrown,
          again: () => {
            read(lazy, inside, isType);
          },
        });
      }
      return;
    }
    if (!isType) visit(value, inside);
  };

  const visit = (value: unknown, inside: boolean): void => {
    if (!isObject(value)) return;
    if (isLazy(value)) {
      read(value, inside, false);
      return;
    }
    if (seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      for (const item of value) visit(item, inside);
      return;
    }
    if (isElement(value)) {
      if (isLazy(value.type)) read(value.type, inside, true);
      const below = inside || value.type === SUSPENSE;
      for (const [key, prop] of Object.entries(value.props)) {
        // A boundary's fallback shows outside it, while what it wraps waits.
        visit(prop, key === 'fallback' ? inside : below);
      }
      return;
    }
    if (isPlain(value)) {
      for (const prop of Object.values(value)) visit(prop, inside);
    }
  };

  for (const tree of trees) visit(tree, false);
  // What one round finds once its rows arrive is waited for together in
  // the next, rather than one by one.
  while (waiting.length > 0) {
    const round = waiting;
    waiting = [];
    await Promise.all(round.map(({ until }) => whenSettled(until)));
    for (const { again } of round) again();
  }
};
