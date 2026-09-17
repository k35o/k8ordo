---
'@k8ordo/ui': major
---

要素の観測を、ref を受け渡す hook から、子を包むコンポーネントに置き換えました。

`useInView(ref)` のように外から ref を受け取る形は、ref を作って hook に渡し、同じ ref を要素にも付ける二度手間があり、要素が後からマウントされると `useEffect` の時点で `ref.current` が空のまま観測を張り損ねていました。React 19.3 の Fragment ref（`<Fragment ref>`）を使うと、ラッパー要素を足さずに子を観測でき、後からマウントされた子も張り直しなしで観測対象に入ります。

- `InView` を追加しました。子が画面、または `root` のスクロール領域に入っているかを `onChange(isInView)` で知らせます。観測を始めた時点の状態をまず 1 回知らせ、以後は値が変わったときだけ知らせます（`root` が変わって張り直しても、同じ値を重ねて知らせません）。子が複数あるときは、どれか 1 つでも交差していれば `true` で、後から増えたり外れたりした子にも追従します。観測する要素が無い間は `false` です。`once` を付けると最初に見えた時点で観測をやめます。`rootMargin` / `threshold` も受け取ります。
- `Resize` を追加しました。子の大きさが変わると `onChange()` を呼びます。ネイティブの `ResizeObserver` と同じく、観測を始めた時点でも 1 回呼びます。
- `useInView` / `useIntersectionObserver` / `useResize` を削除しました。`useInView(ref, options)` は `<InView onChange={setIsInView} {...options}>` で、`useResize(ref, callback)` は `<Resize onChange={callback}>` で子を包んでください。`useIntersectionObserver` で entry そのものを読んでいた場合は、`useEffect` で `IntersectionObserver` を直接張ってください。
- `ScrollLinked` の `container` を `RefObject<HTMLElement | null>` から `Element | null` に変えました。これまでは ref が埋まるまで 50ms ごとに再試行していましたが、state で持てば要素が決まった時点で追跡を始めます。`const [container, setContainer] = useState<HTMLElement | null>(null)` と `ref={setContainer}` の形にしてください。`null` の間はウィンドウで代用せず、何も追跡しません。

`Conversation` も内部でこの 2 つを使うようになりました。見た目と挙動は変わりません。
