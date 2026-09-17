---
'@k8ordo/ui': major
---

ルートのエントリから hooks を公開しなくなりました。残る hook は、Provider と対になる `useToast` / `usePortalRoot`（ルート）と `useMessages`（`@k8ordo/ui/i18n`）だけです。

公開していた hooks は、いずれも「なぜ UI コンポーネントライブラリにあるのか」を説明できないか、標準 API や `useState` を包んだだけでした。要素の観測（`useInView` / `useIntersectionObserver` / `useResize`）は `InView` / `Resize` コンポーネントに置き換えています（別の changeset を参照）。

- `useDeferredDebounce`：`useDeferredValue(value)` と `!Object.is(deferred, value)` をそのまま書いてください。
- `useDebouncedTransition`：`startTransition` と `AbortController` を直接組み合わせてください。
- `useClipboard`：`navigator.clipboard.writeText` / `readText` を直接呼んでください。
- `useTimeout` / `useInterval`：`useEffect` で `setTimeout` / `setInterval` を張り、最新のコールバックは `useEffectEvent` で読んでください。
- `useDisclosure`：`useState` の真偽値で書いてください。
- `useStep`：`useState` と `Math.min` / `Math.max` で書いてください。なお `useStep` は `window` に `keydown` を張り、フォーカス位置を見ずに矢印キーを拾っていたため、テキスト入力中にカーソルを左右へ動かすとステップまで動いていました。キーボード操作が要る場合は、対象の要素に自分でハンドラを張ってください。
- `useWindowSize` / `useWindowResize`：`useSyncExternalStore` で `resize` を購読してください。
- `useBreakpoint`：`matchMedia` に `@k8ordo/ui/tokens` の `tokens.theme.breakpoint` の値を渡してください。CSS だけで済むなら Tailwind の `md:` などを使ってください。
- `useScrollDirection` / `useScrollLock`：スクロール位置と `overflow` を直接扱ってください。
- `useHover`：`onPointerEnter` / `onPointerLeave` を直接使ってください。
- `useClickAway` / `useControllableState`：コンポーネントの内部実装になりました。外側のクリックを拾うなら、`document` の `pointerdown` で `element.contains(event.target)` を確かめてください。controlled / uncontrolled の切り替えは `value !== undefined` で分けてください。
- `useWritingMode`：公開をやめました。縦書きへの対応は CSS の `writing-v` / `writing-h` ユーティリティと `vertical:` バリアントで行います。JS で書字方向を分岐させたい場合は、使う瞬間に `getComputedStyle(element).writingMode` を読んでください。この hook は ResizeObserver で切り替えを検出していましたが、ボタンのように中身に合わせて縮む要素は縦横が入れ替わっても論理サイズが変わらないため、実行中の切り替えを見逃していました。
- 型 `DebouncedAction` / `WritingMode` も公開をやめました。

`Tabs` / `Popover` / `Autocomplete` / `PasswordInput` の内部実装もあわせて変えましたが、見た目と挙動は変わりません。
