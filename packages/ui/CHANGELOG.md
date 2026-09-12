# @k8ordo/ui

## 3.0.0

### Major Changes

- 生成 UI の peer 範囲に 0.x の上限を付けた。`@json-render/core` / `@json-render/react` は `>=0.20.0 <0.21.0`、`@openuidev/lang-core` は `>=0.2.10 <0.3.0`、`@openuidev/react-lang` は `>=0.2.9 <0.3.0`。0.x の minor は破壊的リリースなので、検証していないバージョンまで互換を約束するのをやめた。json-render は下限も 0.20 に上げている（0.19 は別の minor で、もう検証していない）。あわせて json-render の未知 prop 検出を `instanceof z.ZodObject` から `.shape` の有無に変え、利用者の zod が別コピーになっても検出が止まらないようにした。

  あわせて README と `docs/references/generative-ui.md` の install 手順を直した。`@openuidev/lang-core` は `@k8ordo/ui/openui/prompt` だけでなく `@k8ordo/ui/openui` 本体が直接 import しているので、`@openuidev/react-lang` と一緒に入れる必要がある（pnpm は依存の依存を解決してくれない）。

### Minor Changes

- `Button` / `IconButton` の `renderItem` が、既定の `<button>` に渡すのと同じ props を丸ごと受け取るようになりました。

  これまで `renderItem` に渡していたのは `className` と `children`（`IconButton` はさらに `aria-label` と `triggerProps`）だけで、`ref`・`disabled`・クリックハンドラ・保留中のスピナー・`aria-*` / `data-*` などの受け取った属性は捨てられていました。そのため `<Button renderItem={...} onClick={...} disabled>` は、`onClick` も `onAction` も発火せず無効にもならない要素を、警告なしに描画していました。`className` / `style` を全コンポーネントで受け取らない以上 `renderItem` が唯一の逃げ道なので、ここが欠けていると回避手段がありません。

  - `renderItem` と既定の要素に**同じオブジェクト**を渡すようにし、両者がずれない形にしました。
  - 束の中身は `className`（無効時のスタイルを含む）・`children`（保留中はスピナー入り）・`ref`・`type`・`disabled`・`aria-disabled`・`aria-busy`・`onClick`・その他の受け取った属性です。
  - `<a>` などにも展開できるよう、ハンドラと `ref` の要素型を `HTMLElement` にしました。`<button>` 専用の `disabled` / `type` だけ分割代入で外してから展開してください。無効状態は同梱の `aria-disabled` で表せ、`onClick` は無効なら `preventDefault()` して何もしないので、無効なリンクは遷移しません。
  - `IconButton` は tooltip の配線を引き続き `triggerProps` にまとめます。合成済みの `ref` と、利用者が渡した `onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur` もそこに連結されるようになりました（これまでは `renderItem` 経路で捨てられていました）。
  - 合成した `ref` は合成元が変わらない限り同じ関数を使い回します。毎レンダー作り直すと React が ref の付け外しを繰り返し、コールバック ref に副作用があると再実行されてしまうためです。
  - 型 `ButtonRenderItemProps` と `IconButtonRenderItemProps` を公開しました。

- `Textarea` の `autoResize` と `PromptInput.Textarea` の高さ追従を、JS の実測から CSS の `field-sizing: content` に置き換えました。

  `scrollHeight` を測って `style.height` を書いていたのは、中身に合わせて伸びるフォームコントロールを CSS が持っていなかった頃の代用です。Baseline に入った今はブラウザの仕事なので、`value` の変化を待つエフェクトも、内部 ref と利用者の ref の合成も要らなくなりました。

  **`autoResize` を付けたときだけ `rows` が効かなくなります。** `field-sizing: content` の下で `rows` は無視されるので、空の `<Textarea autoResize />` はこれまでの 2 行ではなく 1 行の高さから始まり、入力に応じて伸びます。`autoResize` を付けない `Textarea` の `rows` はこれまでどおりです。`PromptInput.Textarea` は元から `rows={1}` と `min-h` で高さを決めていたため見た目は変わりません。

  あわせて内部の作りを React Compiler の規則に合わせました。振る舞いは変わりませんが、`useControllableState` が返す更新関数だけは、値が変わったときに参照が変わるようになります（従来は常に同一参照でした）。依存配列に入れている場合はご注意ください。

### Patch Changes

- インソーステスト（import.meta.vitest ブロック）を dist から落とし、残っていないことを check:package で検査する

- jsdom / happy-dom でも描画できるようにする。ResizeObserver・IntersectionObserver・
  `matchMedia`・`dialog.showModal` / `close`・Popover API を support 判定ごしに呼び、
  欠けていれば SSR 相当のスナップショットか no-op に落とす。テスト環境の欠落は
  ブラウザの欠落ではないので polyfill は足さず、ブラウザでの挙動は変えていない。
  開閉状態まで検証したい利用者向けに、`docs/GUIDE.md` に "Testing in jsdom" として
  Vitest の `setupFiles` に貼れるスタブ一式を載せた。

## 2.0.0

### Major Changes

- @k8ordo/ui 2.0。

  - `useLocalStorage` / `useSessionStorage` / `useHash` を削除した。URL・履歴・
    localStorage・メモリなど「場所に住む状態」は `@k8ordo/state`
    （`defineLocalState` など）の仕事で、同じ状態を二つのパッケージが持つと
    アプリに二つの答えを与えてしまう。
  - 複合コンポーネント（Conversation / Dialog / DropdownMenu / FileField /
    ListBox / Message / Popover / PromptInput / Suggestion / Tabs / Tooltip）を
    `'use client'` モジュールの外（index.ts）で合成するようにした。Server
    Component から `Dialog.Root` のように参照しても undefined にならない。
  - `Checkbox` と `Radio` が他のフォーム部品と同じく `invalid` を受け取り、
    `aria-invalid` とエラー枠線に反映する。`FormControl` の `renderInput` に
    そのまま渡せる。
  - `docs/references/helpers.md` が存在しない関数（`between` / `commalize` /
    `uuidV4` など）を載せていたのを、実際の export（`chain` / `cn` /
    `createSafeContext` / `mergeProps` / `mergeRefs`）に合わせて書き直し、
    `check:props` で index.ts の export と見出しの一致を検証するようにした。
  - `Anchor` の hover を不透明度ではなく専用トークン（`text-fg-base`）にした。
  - `zod` の peer を `^4.4.3` にした。
