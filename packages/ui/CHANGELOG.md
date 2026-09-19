# @k8ordo/ui

## 3.0.0

### Major Changes

- React 19.3 を前提にしました（peer は `react` / `react-dom` / `@types/react` / `@types/react-dom` とも `>=19.3.0`）。

  - `useClient` を削除しました。ブラウザでしか描けないコンポーネントは React 自身の `use(browser())`（`react-dom` の `browser`）を `<Suspense>` の下で呼んでください。サーバーは fallback を残し、ブラウザが hydrate 後に描きます。「mounted フラグ」も `typeof window` も要りません。
  - `Tabs` の選択を transition にし、パネルの入れ替わりを `<ViewTransition>` でクロスフェードするようにしました。suspend するパネルは用意できるまで今のパネルが残ります。
  - `PortalRootProvider` を Context そのものにしました。`<PortalRootProvider value={ref}>` と書く点は同じですが、`value` は必須です。
  - `Form` が `ref` を受け取るようになり、`@k8ordo/form` の `form.props` をそのまま広げられます。
  - スタイルシートに、`prefers-reduced-motion` で View Transition のアニメーション（Tabs のパネル、ルーターのページ切替）を止める規則を足しました。

- 生成 UI の peer 範囲に 0.x の上限を付けた。`@json-render/core` / `@json-render/react` は `>=0.20.0 <0.21.0`、`@openuidev/lang-core` は `>=0.2.10 <0.3.0`、`@openuidev/react-lang` は `>=0.2.9 <0.3.0`。0.x の minor は破壊的リリースなので、検証していないバージョンまで互換を約束するのをやめた。json-render は下限も 0.20 に上げている（0.19 は別の minor で、もう検証していない）。あわせて json-render の未知 prop 検出を `instanceof z.ZodObject` から `.shape` の有無に変え、利用者の zod が別コピーになっても検出が止まらないようにした。

  あわせて README と `docs/references/generative-ui.md` の install 手順を直した。`@openuidev/lang-core` は `@k8ordo/ui/openui/prompt` だけでなく `@k8ordo/ui/openui` 本体が直接 import しているので、`@openuidev/react-lang` と一緒に入れる必要がある（pnpm は依存の依存を解決してくれない）。

- ルートのエントリから helpers（`cn` / `chain` / `mergeProps` / `mergeRefs` / `createSafeContext`）を公開しなくなりました。いずれも UI コンポーネントライブラリ固有の理由を持たない汎用ユーティリティで、コンポーネントの内部実装として残します。

  - `cn`：`clsx` と `tailwind-merge` を直接使ってください。ui のコンポーネントは `className` を受け取らないので、`cn` が要るのは自分の要素だけです。
  - `chain`：受け取ったハンドラを順に呼ぶ関数を、その場で書いてください。
  - `mergeProps` / `mergeRefs`：render prop で受け取る props は、そのまま要素に展開してください。自分の ref と合わせるなら、ref コールバックの中で両方に代入してください。
  - `createSafeContext`：`createContext` と、Provider が無いときに throw する `use` のラッパーを自分で書いてください。

  型のリファレンスは `docs/references/helpers.md` から `docs/references/types.md` に移しました。docs サイトの `/ui/helpers` はなくなりました。

- ルートのエントリから hooks を公開しなくなりました。残る hook は、Provider と対になる `useToast` / `usePortalRoot`（ルート）と `useMessages`（`@k8ordo/ui/i18n`）だけです。

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

- `NumberField` に空の状態ができました。`value` と `onChange` の型は `number | null` になり、`null` が空欄を表します。

  - 非制御で `defaultValue` を渡さなければ空欄で始まります。これまでは描画直後から `0` を表示し、何も入力していなくても `0` を送信していました。空の間は `''` を送信し、`aria-valuenow` を出しません。
  - 空欄のまま blur しても空のままです。これまでは `0` が入っていました。入力を消して blur すると `onChange` に `null` を渡します。
  - 空欄からの ArrowUp / ArrowDown と増減ボタンは `0` から始まります。`0` が範囲外なら `min` / `max` の近い方から始まります。
  - `required` を input 自体に付けるようにしました。必須の空欄はブラウザの検証で弾かれます。
  - 制御モードで親が `onChange` の値を `value` に採らなかったときは、表示が `value` に戻ります。

  移行: `value` を `number` で持っていた箇所は `number | null` にしてください。`0` から始めたい場合は、非制御なら `defaultValue={0}` を、制御なら `useState<number | null>(0)` を渡してください。json-render と openui のアダプタでも、`defaultValue` の無い NumberField は `0` ではなく空欄で始まります。

- 要素の観測を、ref を受け渡す hook から、子を包むコンポーネントに置き換えました。

  `useInView(ref)` のように外から ref を受け取る形は、ref を作って hook に渡し、同じ ref を要素にも付ける二度手間があり、要素が後からマウントされると `useEffect` の時点で `ref.current` が空のまま観測を張り損ねていました。React 19.3 の Fragment ref（`<Fragment ref>`）を使うと、ラッパー要素を足さずに子を観測でき、後からマウントされた子も張り直しなしで観測対象に入ります。

  - `InView` を追加しました。子が画面、または `root` のスクロール領域に入っているかを `onChange(isInView)` で知らせます。観測を始めた時点の状態をまず 1 回知らせ、以後は値が変わったときだけ知らせます（`root` が変わって張り直しても、同じ値を重ねて知らせません）。子が複数あるときは、どれか 1 つでも交差していれば `true` で、後から増えたり外れたりした子にも追従します。観測する要素が無い間は `false` です。`once` を付けると最初に見えた時点で観測をやめます。`rootMargin` / `threshold` も受け取ります。
  - `Resize` を追加しました。子の大きさが変わると `onChange()` を呼びます。ネイティブの `ResizeObserver` と同じく、観測を始めた時点でも 1 回呼びます。
  - `useInView` / `useIntersectionObserver` / `useResize` を削除しました。`useInView(ref, options)` は `<InView onChange={setIsInView} {...options}>` で、`useResize(ref, callback)` は `<Resize onChange={callback}>` で子を包んでください。`useIntersectionObserver` で entry そのものを読んでいた場合は、`useEffect` で `IntersectionObserver` を直接張ってください。
  - `ScrollLinked` の `container` を `RefObject<HTMLElement | null>` から `Element | null` に変えました。これまでは ref が埋まるまで 50ms ごとに再試行していましたが、state で持てば要素が決まった時点で追跡を始めます。`const [container, setContainer] = useState<HTMLElement | null>(null)` と `ref={setContainer}` の形にしてください。`null` の間はウィンドウで代用せず、何も追跡しません。

  `Conversation` も内部でこの 2 つを使うようになりました。見た目と挙動は変わりません。

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

  あわせて内部の作りを React Compiler の規則に合わせました。振る舞いは変わりません。

- `@k8ordo/ui/i18n` から `dictionaries`（`{ ja, en }`）を export。ロケールで辞書を選ぶアプリは `messages={dictionaries[locale]}` と書ける。

- OpenUI のコンテナを、互いに自由に入れ子にできるようにしました。

  これまで `Stack` / `Grid` の子には `Stack` / `Grid` / `Card` を置けず、`Card` / `Form` / `Modal` / `Dialog` / `Drawer` / `Popover` は `Stack` / `Grid` を子に持てても、どのコンポーネントの子にも挙がっていませんでした。プロンプトは `root = Stack(...)` を求めるので、この 6 つは LLM から使う場所がありませんでした。しかも `Stack` の説明は「入れ子のレイアウトは Card の中に Stack / Grid を置く」と、置けない Card を使うよう指示しており、プロンプト自身と矛盾していました。

  - 8 つのコンテナ（`Stack` / `Grid` / `Card` / `Form` / `Modal` / `Dialog` / `Drawer` / `Popover`）の `children` に、葉のコンポーネントと 8 つのコンテナをすべて並べました。json-render と同じく、どの組み合わせでも入れ子にできます。
  - `prompt()` が生成するシグネチャが変わります。`Stack` / `Grid` の「直下に Stack/Grid/Card は置けない」という説明と、`Card` の「Stack や Grid も入れられる」という説明は消しました。
  - パーサは `children` に入るコンポーネントを検査しないので、描画の挙動は変わりません。

- `Radio` が `required` を受け取るようになりました。各 `<input type="radio">` に渡るので、どれも選ばれていないあいだはグループが `valueMissing` になり、フォームは送信されません。

  これまでは props の型に `required` がなく、無理に渡しても `role="radiogroup"` の `div` に乗るだけで、未選択でも `form.checkValidity()` が `true` を返していました。`@k8ordo/form` の `form.field(path).input`（`{ name, required, defaultValue }`）をそのまま広げられます。

- `useToast()` の `open` が、開いたトーストの id を返すようになりました。

  これまで `open` は何も返さなかったので、`close(id)` に渡す id を呼び出し側が得る手段がなく、`close` は公開されていても使えませんでした。`duration: Number.POSITIVE_INFINITY` で出したトーストをコードから閉じるには `closeAll()` しかなく、関係のない他のトーストまで閉じていました。

  ```tsx
  const { open, close } = useToast();

  const syncingId = open('info', '同期しています', {
    duration: Number.POSITIVE_INFINITY,
  });
  // 同期が終わったら、そのトーストだけを閉じる
  close(syncingId);
  ```

  戻り値を使わない既存の呼び出しはそのまま動きます。

### Patch Changes

- 同梱ドキュメントを実装に追従させました。

  - `references/color.md` のトークン表（fg / bg / border / primary / secondary）を `tokens.css` の値に合わせ、載っていなかった `bg-raised` / `bg-surface` / `group-*` / `back-drop` などを足しました。`typography.md` / `spatial-design.md` / `interaction-design.md` / `GUIDE.md` の、存在しない `font-normal` や食い違っていた既定値も直しています。
  - 改名前の prop 名（Card の `appearance`、Heading の `type` など）を今の名前にしました。
  - `@k8ordo/ui/i18n` の `dictionaries` / `useMessages`、`@k8ordo/ui/tokens` / `@k8ordo/ui/props.json`、アイコン一覧を docs に載せました。
  - `extract-props` が controlled / uncontrolled の union の片側しか読まず、`defaultValue` などを `never` と出していたのを直しました。`components.md` の Props は、残りの属性をどの要素へ転送するかも書くようになりました。
  - README の peer 表を `package.json`（React / React DOM とその型は `>=19.3.0`）に合わせ、`ToolInvocation` の state を 7 値に、生成 UI の対応コンポーネント数を 48 にしました。

- `NumberField` で負の小数（`-1.5` など）を入れると、blur で値が正規化された後も入力要素が無効（`patternMismatch`）のままになり、`novalidate` の無いフォームから送信できなかったのを直しました。

  入力要素に付いていた `pattern="[0-9]*(.[0-9]+)?"` を外しました。`.` がエスケープされておらず、たまたま `-5` や `1,000`、`1a5` は通す一方で、`-1.5` や `1.` は弾いていました。blur 後の値は常にコンポーネント自身が書き戻す数値の文字列なので、正しい正規表現に直しても検証するものが残りません。数字キーボードは引き続き `inputMode="decimal"` で出ます。

  `@k8ordo/form` のフォームに置いた場合、この `pattern` はスキーマから導かれたものではないので対応する文言が無く、`error` は空のまま、ブラウザ既定の文言で送信が止まっていました。

- `NumberField` が `readOnly` を無視していたのと、フォームの送信中も矢印キーで値が変わっていたのを直しました。

  - `readOnly` を渡しても、入力要素には送信中かどうかだけで決まる `readOnly` が上書きで付いていたため、送信中でなければ文字の入力も増減ボタンも矢印キーも効いていました。`readOnly` のあいだは入力要素が読み取り専用になり、増減ボタンは無効になり、矢印キーでも値が変わりません。
  - フォームの送信中（`useFormStatus` の `pending`）に止まっていたのは増減ボタンだけで、ArrowUp / ArrowDown では値が変わっていました。送信中はキー操作でも値が変わりません。

- `NumberField` が、フォーカスを外したときに入力を `precision` の桁数に丸めた値を `onChange` と `aria-valuenow` に渡すようになりました。

  これまでは表示だけが丸められ、値には入力した小数の桁がそのまま残っていました。たとえば `precision` が `0`（既定）のときに `2.5` と入力すると、表示は `3` なのに `onChange` には `2.5` が届き、`aria-valuenow` も `2.5` でした。表示・`aria-valuenow`・`onChange` の値が一致するようになります。

- インソーステスト（import.meta.vitest ブロック）を dist から落とし、残っていないことを check:package で検査する

- 非制御の `Switch` で、フォームを reset したあとも reset 前の見た目と `aria-checked` が残る不具合を直しました。

  reset はブラウザが `checked` を初期値へ戻すだけで `change` を飛ばさないため、`input` はオフに戻っているのに、トラックの色・つまみの位置・`aria-checked="true"` がオンのまま残り、支援技術にもオンと伝わっていました。見た目を React の state ではなく `input` の `:checked` から引き、`aria-checked` は付けないようにしました（`role="switch"` を持つ checkbox の `input` は、ネイティブの `checked` がそのまま状態として公開されます）。reset ボタン、`form.reset()`、`@k8ordo/form` の `useForm`、React が action の成功後に行う自動リセットのどれでも、戻った `checked` がそのまま表示されます。

- `InView` で、見えていた子を外しても `onChange(false)` が呼ばれず、`true` のまま残ることがあったのを直しました。

  React は Fragment の子が外れると、その子の `IntersectionObserver` の `unobserve` をペイント後まで遅らせ、「交差していない」という最後の通知が届くのを待ちます。ただ、ブラウザが混んでいるとそれより先に `unobserve` が走り、通知ごと失われることがあります。`InView` はその通知で外れた子を「交差中」から外していたため、外れた子が交差中のまま残り、ほかの子がどれも見えていなくても `true` のままでした。

  子が外れたことを React の `unobserve` の呼び出しから直接知るようにしたので、通知が届かなくても `false` に戻ります。

- 非制御の `Checkbox` と `Radio` で、フォームを reset したあとも reset 前の見た目が残る不具合を直しました。

  reset はブラウザが `checked` を初期値へ戻すだけで `change` を飛ばさないため、`input` は未チェックなのにチェックマークや選択の点・枠線が残っていました。見た目を React の state ではなく `input` の `:checked` から引くようにしたので、reset ボタン、`form.reset()`、`@k8ordo/form` の `useForm`、React が action の成功後に行う自動リセットのどれでも、戻った `checked` がそのまま表示されます。

  あわせて `Radio` の点は、選択が外れるときもフェードして消えるようになりました（これまでは即座に消えていました）。

- 非制御の `NumberField` が、フォームの reset（`form.reset()`、reset ボタン、action の成功後に React が行う reset）で `defaultValue`（無ければ空欄）に戻るようになりました。これまでは input が常に React の制御下にあり、`value` 属性が入力した値に同期され続けていたため、reset しても表示も送信値も変わりませんでした。reset で戻った値は `onChange` にも渡します。

  制御モードの `NumberField` は reset で `value` を変えません。値の持ち主は親なので、reset に合わせて戻すならフォームの `onReset` で自分の state を戻してください。

- コンポーネントのテストは実ブラウザ（Vitest の browser mode か Playwright）で書く前提であることを `docs/GUIDE.md` に明記した。`ResizeObserver` / `IntersectionObserver` / `matchMedia` / `dialog.showModal` / `close` / Popover API は support 判定を挟まず直接呼んでいるので、jsdom や happy-dom で `Modal` / `Drawer` / `Popover` / `Tooltip` / `DropdownMenu` / `Tabs` / `Autocomplete` / `InView` / `Resize` / `Conversation` を mount すると落ちる。jsdom にはレイアウトエンジンが無く、スタブで塞いでも focus や配置や可視性のアサーションはほとんど意味を持たないため、塞ぐ方向には進まない。

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
