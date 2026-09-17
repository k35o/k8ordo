# Hooks

The custom hooks `@k8ordo/ui` provides.

```tsx
import { useDisclosure, useDeferredDebounce } from '@k8ordo/ui';
```

These hooks cover UI mechanics: disclosure, timing, DOM observation, and the
like. To watch whether elements are in view or have changed size, wrap them in
the `InView` / `Resize` components instead (see `components.md`): they observe
their children without a ref passed in or handed back. State that lives in a place — the URL, a history entry, localStorage,
memory — is `@k8ordo/state`'s job (`defineLocalState` and friends). There is
deliberately no `useLocalStorage`, `useSessionStorage`, or `useHash` here: a
package that owned that state twice would give an app two answers.

## State

### useDisclosure

Toggles open/closed state.

```tsx
const { isOpen, open, close, toggle } = useDisclosure();
```

### useControllableState

Handles controlled and uncontrolled use transparently.

```tsx
const [value, setValue] = useControllableState({
  value: controlledValue,
  defaultValue: 'default',
  onChange: onControlledChange,
});
```

### useStep

A step counter with forward/back control.

```tsx
const { count, next, back, isDisabledBack, isDisabledNext } = useStep({
  initialCount: 0,
  maxCount: 5,
});
```

## Events

### useClickAway

Detects a click outside an element. Takes a ref and a callback.

```tsx
const ref = useRef<HTMLDivElement>(null);

useClickAway(ref, (e) => {
  console.log('clicked outside');
});
```

Arguments:

- `ref`: `RefObject<T | null>`
- `callback`: `(e: Event) => void`
- `enabled`: boolean (default: `true`)

### useHover

Detects the hover state. Spread `hoverProps` onto the element.

```tsx
const { isHovered, hoverProps } = useHover();

<div {...hoverProps}>{isHovered ? 'hovered' : 'idle'}</div>;
```

`hoverProps` contains `{ onPointerEnter, onPointerLeave }`.

## Timing

> `useDeferredDebounce` and `useDebouncedTransition` do different jobs.
>
> - **`useDeferredDebounce`**: **defers rendering**. The React scheduler simply postpones an expensive re-render; there is no guarantee about how long it waits. It cannot be used to throttle side effects (fetch, external APIs).
> - **`useDebouncedTransition`**: **rate-limits side effects**. It waits for the given `delay` before running the action, and aborts the previous `AbortSignal` when called again. Use it for work you do not want fired in rapid succession, such as fetch.

### useDeferredDebounce

Wraps `useDeferredValue` and returns the value plus a pending flag for when it
has not caught up. **For pure UI purposes only**, such as filtering a list as
the user types.

```tsx
const [deferredValue, isPending] = useDeferredDebounce(inputValue);
```

Returns:

- `[T, boolean]` — `[deferredValue, isPending]`

### useDebouncedTransition

Combines `startTransition(async)` with an `AbortController` and runs the action
once the delay has elapsed. On a repeat call it aborts the signal passed to the
previous action, so an `AbortError` thrown inside the action by, say,
`fetch({ signal })` does not become an unhandled rejection.

```tsx
const [isPending, run] = useDebouncedTransition(300);

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const q = e.target.value;
  setQuery(q);
  run(async (signal) => {
    const res = await fetch(`/api/search?q=${q}`, { signal });
    setResults(await res.json());
  });
};
```

Returns:

- `[boolean, (action: (signal: AbortSignal) => void | Promise<void>) => void]`

### useInterval

Runs something on an interval.

```tsx
useInterval(() => {
  fetchData();
}, 5000);
```

### useTimeout

Runs something after a delay.

```tsx
useTimeout(() => {
  hideMessage();
}, 3000);
```

## DOM and browser

There is no `useClient` and no "mounted" flag: a component that can only
render in a browser says so with React's own `use(browser())` — `browser`
from `react-dom` — under a `<Suspense>`, and the server leaves the fallback
for the browser to fill.

### useWindowSize

Reads the window size.

```tsx
const { width, height } = useWindowSize();
```

### useWindowResize

Listens for window resizes. The callback receives `{ width, height }`.

```tsx
useWindowResize(
  (size) => {
    recalculate(size.width, size.height);
  },
  { enabled: true },
);
```

Arguments:

- `callback`: `(size: { width: number; height: number }) => void`
- `options`: `{ enabled?: boolean }`

### useScrollDirection

Detects scroll direction, on both axes.

```tsx
const { x, y } = useScrollDirection();
// x: 'left' | 'right'
// y: 'up' | 'down'
```

### useScrollLock

Locks scrolling on the body. Returns lock and unlock functions.

```tsx
const { lock, unlock } = useScrollLock();

// when opening a modal
lock();

// when closing it
unlock();
```

### useWritingMode

Detects an element's `writing-mode` and returns `'horizontal'` or `'vertical'`.
Every `vertical-*` and `sideways-*` value normalizes to `'vertical'`. It
observes through a ResizeObserver, and returns `'horizontal'` during SSR.

```tsx
const ref = useRef<HTMLDivElement>(null);
const writingMode = useWritingMode(ref); // 'horizontal' | 'vertical'
```

Arguments:

- `ref`: `RefObject<Element | null>`

Returns:

- `'horizontal' | 'vertical'`

### useBreakpoint

Tests a Tailwind breakpoint.

```tsx
const isMd = useBreakpoint('md'); // whether the viewport is 768px or wider
```

## Utilities

### useClipboard

Reads from and writes to the clipboard.

```tsx
const { writeClipboard, readClipboard } = useClipboard();

await writeClipboard('the text to copy');
const text = await readClipboard();
```
