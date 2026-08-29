# Hooks

The custom hooks `@k8ordo/ui` provides.

```tsx
import { useDisclosure, useDeferredDebounce } from '@k8ordo/ui';
```

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

### useHash

Reads the URL hash (read-only).

```tsx
const hash = useHash(); // string | null
```

## Storage

### useLocalStorage

State kept in sync with LocalStorage. `remove` deletes the entry.

```tsx
const [value, setValue, remove] = useLocalStorage<string>('key', 'default');
```

### useSessionStorage

State kept in sync with SessionStorage. `remove` deletes the entry.

```tsx
const [value, setValue, remove] = useSessionStorage<string>('key', 'default');
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

### useResize

Observes an element's size (ResizeObserver). Takes a ref.

```tsx
const ref = useRef<HTMLDivElement>(null);

useResize(
  ref,
  (entry) => {
    console.log(entry.contentRect);
  },
  { enabled: true },
);
```

Arguments:

- `ref`: `RefObject<T | null>`
- `callback`: `(entry: ResizeObserverEntry) => void`
- `options`: `{ enabled?: boolean }`

### useIntersectionObserver

An intersection observer. Takes a ref.

```tsx
const ref = useRef<HTMLDivElement>(null);

useIntersectionObserver(
  ref,
  (entry) => {
    console.log(entry.isIntersecting);
  },
  { threshold: 0.5 },
);
```

Arguments:

- `ref`: `RefObject<T | null>`
- `callback`: `(entry: IntersectionObserverEntry) => void`
- `options`: IntersectionObserver options

### useInView

Whether an element is in view. Takes a ref and returns a boolean.

```tsx
const ref = useRef<HTMLDivElement>(null);
const isInView = useInView(ref, { threshold: 0.1 });
```

Arguments:

- `ref`: `RefObject<T | null>`
- `options`: IntersectionObserver options

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

### useClient

Whether we are on the client.

```tsx
const isClient = useClient();
```

### useClipboard

Reads from and writes to the clipboard.

```tsx
const { writeClipboard, readClipboard } = useClipboard();

await writeClipboard('the text to copy');
const text = await readClipboard();
```
