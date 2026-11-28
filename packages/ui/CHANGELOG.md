# @k8ordo/ui

## 4.0.0

### Major Changes

- `Accordion.Button`に必須の`level`（`'h2'`から`'h6'`、`Heading`と同じ語）を足し、その見出しの要素の中にボタンを描くようにしました。WAI-ARIAのアコーディオンは見出しの中にボタンを置く形ですが、これまでは見出しを呼び出し側が書いていて、同梱のドキュメントの例や生成UIのカタログが作るアコーディオンには見出しがありませんでした。見出しで移動する支援技術の利用者は、その項目にたどり着けませんでした。

  ```tsx
  // これまで
  <h3>
    <Accordion.Button>配送について</Accordion.Button>
  </h3>
  // これから
  <Accordion.Button level="h3">配送について</Accordion.Button>
  ```

  移行するときは、`Accordion.Button`を包んでいた見出しを外し、その階層を`level`に渡します。包んだまま`level`を足すと、見出しの中に見出しができてしまいます。

- `Alert`の`action`と`useToast`の`open`に渡す`ToastOptions`の`action`を、`ReactNode`にしました。描くリンクやボタンをそのまま渡します。`AlertAction`と`ToastAction`の型はなくなりました。これまでは`{ label, renderItem }`の形で、`renderItem`は渡した`label`を`children`として受け取って返すだけでした。関数なので、毎回作るとlintの入れ子の部品の規則に触れ、`useCallback`で包む必要がありました。置き場所（1行の文なら文の後ろ、一覧なら一覧の下）は今までどおり`Alert`が決めます。

  ```tsx
  // これまで
  <Alert
    action={{ label: 'もう一度読み込む', renderItem: ({ children }) => <Button onClick={retry}>{children}</Button> }}
    message="読み込めませんでした"
    tone="error"
  />
  // これから
  <Alert action={<Button onClick={retry}>もう一度読み込む</Button>} message="読み込めませんでした" tone="error" />
  ```

  移行するときは、`renderItem`が返していた要素の`children`に`label`の文を入れ、その要素を`action`に渡します。`renderItem`を`useCallback`で包んでいたら、その処理も消せます。`AlertAction`、`ToastAction`の型をimportしていたら消してください。

- `Button`と`IconButton`の`onAction`を`action`に改めました。`Message.Action`と`Message.Regenerate`も同じです。transitionの中で呼び、終わるまで保留を表示する動きは変わりません。名前を`<form action>`と同じ「transitionで走る関数」にそろえ、項目を選んだときに素のまま呼ぶ`DropdownMenu.Item`などの`onAction`と分けました。この版で足す`Card`の、カード全体をボタンにするpropも、同じ動きなので`action`です。

  保留のあいだは押しても`action`が走らないので、続けて押す同期の更新（数を増やす、スライドを送るなど）は`onClick`に書いてください。

  移行するときは、`onAction`を`action`にします。押すたびに走る同期の処理は`onClick`にします。

- `Button`と`IconButton`に`href`を足し、`renderItem`をなくしました。`href`を渡すと、同じ見た目の`<a>`を描きます。`target`や`rel`、`download`、`data-*`などの属性は`<a>`に渡り、`type`と`action`は受け取りません。`disabled`のリンクは`aria-disabled`を付け、押しても遷移しません。Next.jsの`Link`のようなリンク部品は`renderAnchor`で描きます。受け取るpropsは`Anchor`の`renderAnchor`と同じ形で、`href`の型もそのまま渡るので、型付きのルートは型付きのまま使えます。これまではリンクにするたびに関数の`renderItem`を書いていて、Server Componentからは渡せませんでした。`ButtonRenderItemProps`、`IconButtonRenderItemProps`、`IconButtonTriggerProps`も公開をやめました。

  ```tsx
  // これまで
  <Button renderItem={({ disabled: _d, type: _t, ...props }) => <a href="/settings" {...props} />}>設定</Button>
  // これから
  <Button href="/settings">設定</Button>
  <Button href="/settings" renderAnchor={(props) => <Link {...props} />}>設定</Button>
  ```

  `Button`の`type`は、`'button'`と`'submit'`に加えて`'reset'`も受け取るようになりました。`renderItem`で描いていた`<button type="reset">`の代わりです。

  移行するときは、次のように書き換えます。

  - `renderItem`で`<a>`を描いていたところは`href`に、リンク部品を描いていたところは`href`と`renderAnchor`にする
  - `renderItem`で`type="reset"`の`<button>`を描いていたところは`<Button type="reset">`にする

- `Button`の`isActive`をなくしました。文字色を変えるだけで、支援技術には伝わっていませんでした。

  代わりに、`variant="skeleton"`の`Button`は、`aria-pressed`を渡したトグルと、`aria-current`を渡した今のページへのリンクを、infoの文字色で描きます。状態はARIAの属性にあるので、色で見えるものがスクリーンリーダーにも伝わります。

  `Toolbar`の中では、押した項目をツールバーが濃い地で示し、文字はその地と対になる`fg-base`で描きます。スケルトンの`Button`もinfoの文字色にはなりません。無効な項目は無効の見た目のままです。これまで、ツールバーの中で押したスケルトンのトグルは、ダークでは文字と地のコントラストが足りませんでした。

  文字色で状態を示すのはスケルトンだけです。`solid`と`outline`のトグルは、押した状態の見た目を持たないので、`variant`や`color`を状態で切り替えてください。

  移行するときは、`isActive={x}`を`aria-pressed={x}`か、リンクなら`aria-current={x ? 'page' : undefined}`にします。`solid`や`outline`の`Button`で`isActive`を使っていたところは、`variant`や`color`を状態で切り替えます。

- 生成UIのカタログの`Select`、`Radio`、`RadioCard`、`ListBox`、`CheckboxGroup`、`CheckboxCard`で、`options`の`value`に無い`defaultValue`を受け付けないようにしました。`catalogPropIssues`は、その値を`Select.defaultValue`や`CheckboxGroup.defaultValue.1`のように位置を付けて返し、選べる値も並べます。選択肢の`label`を`value`と取り違えた値も、これまではそのまま通り、どの選択肢にも当たらない値として描かれていました。`Table`の行と列の検査と同じく、`options`と`defaultValue`がそれぞれ正しければ、ほかのpropの誤りと一緒に返します。`options`か`defaultValue`を`unresolved`に挙げたときは確かめません。

  移行するときは、保存したspecやプロンプトの`defaultValue`を、`options`のどれかの`value`に書き換えます。`CheckboxGroup`と`CheckboxCard`では、配列のどの値もそうします。

  この6つの`props`も、`Table`と同じくこの検査を持つzodのスキーマになり、`.omit()`、`.pick()`、`.partial()`と、すでにあるキーを置き換える`.extend()`はエラーになります。つなぎでこれらのスキーマから別のスキーマを作っていたときは、`.safeExtend()`で作ります。この検査もJSON Schemaには出ません。

- 生成UIのカタログに、利用者の操作をアプリに伝える`events`を足しました。`Button`、`IconButton`、`Card`、`DropdownMenuItem`が`press`を持ちます。形式のつなぎは、各形式の操作の書き方（A2UIの`action`、json-renderの`on`、OpenUIのaction）を`press`に結び、結んだものを描画側に`on`として渡します。描画側は`on.press`をボタンやカードの`action`にします。結ばれていない`Card`は押せる形にならず、押せそうに見えて何も起きないカードは描かれません。型は`CatalogEventOf<N>`です。

  カタログのいくつかの部品の書き方が変わります。

  - `DropdownMenu`は`items`を持たず、子を並べる入れ物になりました。項目は新しい部品`DropdownMenuItem`（`label`）で、選ばれると`press`を出します。これまでの項目は選んでも何も起きませんでした。
  - `Card`は`interactive`を持たなくなり、`href`（安全なURLだけ）を持ちます。`href`があるとカード全体がリンクに、`press`が結ばれていると1つのボタンになり、押せる見た目もそこから決まります。OpenUI Langの位置引数では、`size`の次が`href`になります。
  - `Form`は`action`を持たなくなりました。生成したフォームは何も送信せず、入力欄でEnterを押してもページを読み直しません。送信は中の`Button`の`press`で伝えます。モデルが書いたフォームが、任意のURLへ送れなくなります。
  - `href`を持つ`Button`はリンクのままで、`press`を出しません。

- 生成UIのカタログの入力欄に、必須の`label`と任意の`helpText`を足しました。どの欄も`FormControl`の`renderInput`で描きます。

  これまで`TextField`、`Textarea`、`PasswordInput`、`NumberField`、`Slider`、`Select`、`Autocomplete`、`FileField`は`label`を持たず、モデルが置いたこれらの欄には名前がありませんでした。`label`を持つ欄も、見出しを`<span>`で描いて`aria-labelledby`で結んでいたので、見出しを押しても欄にフォーカスが移りませんでした。`RangeSlider`の`label`は、画面に出ない`aria-label`でした。

  `label`は欄を指す`<label for>`として描きます。`Radio`、`RadioCard`、`CheckboxGroup`、`CheckboxCard`、`RangeSlider`、`FileField`では、グループの名前になる見出しとして描きます（`labelAs="group"`）。`helpText`は欄の下に出て、欄の説明として読み上げられます。

  `label`を足した8つの項目は、OpenUI Langの位置引数の並びをここで一度だけ決め直しました。必須の`label`が加わると、これらの項目の保存済みの文字列はどれもそのままでは通らないためです。`label`は`name`の直後（`name`の無い`FileField`では先頭）に、`helpText`は末尾に置きます。末尾に`label`を置くと、モデルは前にある任意の引数をすべて`null`で埋めて書くことになります。今の並びは次のとおりです。

  - `TextField(name, label, placeholder, defaultValue, invalid, disabled, readOnly, type, helpText)`
  - `Textarea(name, label, placeholder, defaultValue, invalid, disabled, readOnly, rows, autoResize, helpText)`
  - `PasswordInput(name, label, placeholder, defaultValue, invalid, disabled, helpText)`
  - `NumberField(name, label, defaultValue, min, max, step, invalid, disabled, helpText)`
  - `Slider(name, label, defaultValue, min, max, step, invalid, disabled, helpText)`
  - `Select(name, label, options, defaultValue, invalid, disabled, helpText)`
  - `Autocomplete(name, label, options, defaultValue, invalid, disabled, helpText)`
  - `FileField(label, triggerLabel, multiple, maxFiles, clearable, dropzone, helpText)`

  もとから`label`を`name`の直後に持つ`DatePicker`、`RangeSlider`、`ColorPicker`、`Radio`、`RadioCard`、`Combobox`は並びを変えず、`helpText`を末尾に足しました。

  移行するときは、保存したspecやプロンプトの`TextField`、`Textarea`、`PasswordInput`、`NumberField`、`Slider`、`Select`、`Autocomplete`、`FileField`に`label`を書き足します。OpenUI Langでは、上の並びに合わせて引数を書き直します。2番目の引数は`label`として読まれるので、書き直さずに残した文字列は、ほかのpropの値が別のpropに入って描かれます。`TextField("email", "you@example.com", "k8o@example.com")`は、`TextField("email", "メールアドレス", "you@example.com", "k8o@example.com")`にします。

- 生成UIのカタログの`CheckboxGroup`と`CheckboxCard`で、`label`を`name`の直後に移しました。ほかの入力欄はどれも`label`を`name`の直後に持ち、この2つだけが末尾に置いていました。`label`を書く位置が項目ごとに違うと、OpenUI Langの位置引数でモデルが書き間違えます。

  OpenUI Langの位置引数は次の並びになります。名前で書く形式（json-render、A2UI）には影響しません。

  - `CheckboxGroup(name, label, options, defaultValue, helpText)`
  - `CheckboxCard(name, label, options, defaultValue, invalid, disabled, helpText)`

  移行するときは、保存したOpenUI Langの文字列やプロンプトで、この2つの`label`を2番目の引数に移します。`CheckboxGroup("topics", [...], ["css"], "話題")`は、`CheckboxGroup("topics", "話題", [...], ["css"])`にします。

- 生成UIのカタログで、`href`に`/`を2つ続けた値と`/\`で始まる値を受け付けないようにしました。`//evil.example`や`/\evil.example`はスキームを省いた別のサイトのURLですが、`/`で始まるのでパスとして通り、`Anchor`は内部のリンクとして描いていました。ブラウザはURLの途中のタブと改行を読み飛ばすので、`/<タブ>/evil.example`も`//evil.example`と同じURLになります。そのため、タブ、CR、LFを含む`href`は、どこに含んでいても受け付けません。`https://`で始まるURLも同じです。`Button`、`Card`、`Anchor`、`Breadcrumb`、`SideNav`の`href`が対象です。`catalogRules`の文も「a path starting with a single /」に直しました。`examples/ui-integrations`のつなぎは、こうした`href`を持つ要素を描きません。

  移行するときは、保存したspecやプロンプトの`href`のうち`//`や`/\`で始まるものを、`https://`から始まるURLに書き換えます。同じサイトのページなら、`/`を1つにしたパスにします。タブや改行を含む`href`は、それを取り除きます。

- 生成UIのカタログの`ListBox`で、`label`を必須にしました。`ListBox`はリストを開くボタンで、`label`はそのボタンの名前として、選んだ値の前に読み上げられます。これまでは任意だったので、`label`を省いたボタンは選んだ値だけが名前になり、何を選ぶボタンなのかが伝わりませんでした。ほかの入力欄の`label`も必須です。

  ほかの入力欄と同じく、`label`は`name`の直後に移しました。必須にした時点で`label`の無い保存済みの文字列は通らないので、OpenUI Langの位置引数の並びもここで決め直しました。今の並びは`ListBox(name, label, options, defaultValue)`です。

  移行するときは、保存したspecやプロンプトの`ListBox`に`label`を書き足します。OpenUI Langでは、`ListBox("sort", [{value: "new", label: "新しい順"}], "new", "並び順")`のように4番目に書いていた`label`も、`ListBox("sort", "並び順", [{value: "new", label: "新しい順"}], "new")`と2番目に移します。

- 生成UIのカタログで、propsの中に置くオブジェクトが知らないキーを受け付けないようにしました。これまではzodが入れ子の知らないキーを黙って取り除き、`catalogPropIssues`も最上位のキーしか見ていませんでした。`columns: [{ label: '料金', alig: 'right' }]`のような書き間違いは誤りにならず、意図しない見た目のまま描かれていました。対象は次のオブジェクトです。

  - `Table`と`DataTable`の`columns`
  - `Accordion`、`Breadcrumb`、`Tree`、`Toolbar`の`items`
  - `SideNav`の`groups`と、その`links`
  - `Stepper`の`steps`と`Tabs`の`tabs`
  - `ColorPicker`の`swatches`
  - `Select`や`RadioCard`のように選択肢を持つ入力欄の`options`

  `catalogPropIssues`は、そのキーを最上位の知らないpropと同じ文で、オブジェクトの位置を付けて返します（`Table.columns.1: Unknown prop "width". Allowed props: label, align.`）。propsそのものの知らないキーは、これまでどおり`catalogPropIssues`が報告し、zodのparseは取り除きます。

  項目の`props`でparseするつなぎは、入れ子に知らないキーがある要素を描かなくなります。`examples/ui-integrations`のつなぎも描きません。A2UIのつなぎが作るカタログ文書では入れ子のオブジェクトに`additionalProperties: false`が付き、A2UIの処理系もその部品を受け付けません。OpenUIのつなぎが作るJSON Schemaは、もとから入れ子を閉じていたので変わりません。

  移行するときは、保存したspecやプロンプトの例から、入れ子のオブジェクトに書いたスキーマに無いキーを消します。どのキーかは、`catalogPropIssues`が位置とともに挙げます。

- 生成UIのカタログから`ChevronIcon`と`StatusIcon`をなくしました。2つが描く絵は、どれも`Icon`の`name`で選べる絵と同じでした。同じ絵に2通りの書き方があり、モデルに渡す部品も2つ多くなっていました。

  移行するときは、保存したspecやプロンプトの2つを`Icon`に書き換えます。`size`はそのまま渡せます。

  - `ChevronIcon`は、`direction`の向きを付けた`name`の`Icon`にする（`direction: 'down'`なら`name: 'chevron-down'`）
  - `StatusIcon`は、`status`に合う`name`の`Icon`にする（`success`は`circle-check`、`info`は`info`、`warning`は`triangle-alert`、`error`は`circle-alert`）

- 生成UIのカタログから`DateField`をなくしました。`DateField`コンポーネントはなくなり、カタログの`DateField`は`TextField`を`type="date"`で描いていただけでした。日付の欄を書く項目が2つあり、カレンダーを開ける`DatePicker`と、propsも並びも同じでした。

  移行するときは、保存したspecやプロンプトの`DateField`を`DatePicker`に書き換えます。props（`name`、`label`、`defaultValue`、`min`、`max`、`invalid`、`disabled`、`required`）もOpenUI Langの位置引数の並びも同じなので、名前を替えるだけで移れます。カレンダーの要らない欄は、`TextField`に`type: 'date'`を書いても描けます。こちらは`min`、`max`、`required`を持ちません。

- 生成UIのカタログから`FormControl`をなくしました。カタログの入力欄はどれも自分の`label`と`helpText`を持ち、描くときに`FormControl`で包みます。`FormControl`の項目は、`fieldType`で`TextField`、`Textarea`、`PasswordInput`のどれかを描くだけで、同じ欄を2通りに書けていました。

  移行するときは、保存したspecやプロンプトの`FormControl`を、`fieldType`に合わせて`TextField`（`'text'`か省略）、`Textarea`（`'textarea'`）、`PasswordInput`（`'password'`）に書き換えます。`label`、`name`、`placeholder`、`defaultValue`、`helpText`はそのまま渡せます。`errorText`と`required`を書く先はないので外します。`errorText`を書いていた欄は`invalid: true`にします。OpenUI Langでは引数の並びが変わり、`FormControl("お名前", "text", "name", "山田 太郎")`は`TextField("name", "お名前", "山田 太郎")`になります。

- 生成UIのカタログから`Modal`をなくしました。`Modal`はもう公開のコンポーネントではなく、カタログの`Modal`は`side`で`Dialog`と`Drawer`を描き分けていただけでした。同じものを開く項目が3つあり、モデルがどれを選ぶかも定まりませんでした。

  移行するときは、保存したspecやプロンプトの`Modal`を次のように書き換えます。`triggerLabel`と`title`はそのまま渡せて、OpenUI Langの位置引数（`triggerLabel`、`title`、`side`、子）の並びも同じです。

  - `side`が無いか、`'center'`か`'bottom'`なら`Dialog`にする
  - `side`が`'left'`か`'right'`なら`Drawer`にする

- `@k8ordo/ui/catalog/render`の`renderers`が受けるpropsを、項目のスキーマに合う値（`null`を含まない）に決めました。モデルが省いたpropは、無いか`undefined`で渡します。これまでの描画は、OpenUI Langが省いた位置引数に書く`null`を、propごとに`undefined`として扱っていました。形式に依らない描画が1つの形式の書き方を抱えていて、`null`を許さない`CatalogProps`の型とも合っていませんでした。`Button`、`Card`、`Breadcrumb`の`href`に渡した`''`をリンクの無いものとして描く扱いもなくしました。`''`はスキーマに合わない値です。

  スキーマに合わせるのは形式のつなぎです。`examples/ui-integrations`のつなぎは、どれも`src/catalog-props.ts`の`parseCatalogProps`を通してから`renderers`を呼びます。`null`のキーを入れ子まで取り除き、残りを項目の`props`のスキーマで確かめ、確かめた値を渡します。確かめて通らない要素は描きません。形式の検証だけでは足りません。JSON Schemaにはzodの検査が出ず、OpenUIは`pattern`を確かめないので、`javascript:`で始まる`href`や`null`の入った配列もそのまま通ります。

  移行するときは、写したつなぎで`renderers`を呼ぶ前に、`src/catalog-props.ts`と同じことをします。`null`のキーを入れ子まで取り除き、`catalog[name].props.safeParse()`で確かめ、通った値を`props`に渡して、通らない要素は描きません。形式の状態に結んだ入力欄の値は、利用者が書いた値なので確かめる前に外します。

- 生成UIのカタログの`Table`と`DataTable`で、セルの数が列の数と違う行を受け付けないようにしました。`catalogPropIssues`は、その行を`Table.rows.1: Expected 2 cells (one per column), received 1`のように行の位置を付けて返します。`catalogRules`がモデルに最初に伝える約束事なのに、これまでは検査を素通りしていました。描くときも、短い行はセルが欠け、長い行は見出しの外にはみ出していました。`catalogRules`の文も、`DataTable`を含む形に直しました。

  行と列の検査は、`columns`と`rows`がそれぞれ正しければ、ほかのpropの誤りと一緒に返します。`caption`の型の誤りと短い行は、1度の検査でどちらも返ります。

  `catalogPropIssues`の`unresolved`に挙げたpropがあっても、propどうしの検査は残ります。日付や時刻の`TextField`の`defaultValue`の検査も同じです。行と列の検査は、`columns`と`rows`のどちらかを`unresolved`に挙げたときだけ飛ばします。

  移行するときは、保存したspecの`Table`と`DataTable`で、どの行にも列の数だけセルを置きます。空のセルは`''`で書きます。

  `catalog.Table.props`と`catalog.DataTable.props`は、この検査を持つzodのスキーマになりました。`.omit()`、`.pick()`、`.partial()`は`.partial() cannot be used on object schemas containing refinements`の形のエラーになり、すでにあるキーを置き換える`.extend()`もエラーになります。つなぎでこれらのスキーマから別のスキーマを作っていたときは、`.safeExtend()`で作ります。この検査はJSON Schemaには出ないので、zodで確かめるか`catalogPropIssues`を通したときだけ効きます。`examples/ui-integrations`のつなぎは、描く前にzodで確かめ、列の数と違う行のある表を描きません。

- `CheckboxGroup`を、`options`を受け取る1つのコンポーネントにしました。`CheckboxGroup.Root`と`CheckboxGroup.Item`はなくなり、`<CheckboxGroup aria-labelledby name options value defaultValue onChange invalid disabled />`と書きます。`options`は`Radio`と同じ`{ value, label }`の配列です。これまでは選択肢の部品のうち`CheckboxGroup`だけが子要素で選択肢を並べ、`Checkbox`はグループの中にいるかどうかで`checked`や`name`の扱いを変え、`itemValue`が無ければエラーになっていました。呼び出し側はどこも配列を`CheckboxGroup.Item`に写しているだけでした。

  ```tsx
  // これまで
  <CheckboxGroup.Root aria-labelledby={id} name="tags" onChange={setTags} value={tags}>
    {TAGS.map((tag) => (
      <CheckboxGroup.Item itemValue={tag.value} key={tag.value} label={tag.label} />
    ))}
  </CheckboxGroup.Root>
  // これから
  <CheckboxGroup aria-labelledby={id} name="tags" onChange={setTags} options={TAGS} value={tags} />
  ```

  `name`は省けるようになり、省いたときは何も補いません。`name`の無いボックスは送信されないので、画面を切り替えるだけのグループはフォームの中に置いても値を送りません。`DataTable`の列メニューは`name`を渡さなくなり、フォームの中に置いても列の`id`を送らなくなりました。`value`と`defaultValue`は`readonly string[]`も受け取り、`onChange`には選択肢の順に並べた新しい`string[]`を渡します。選択はこれまでどおり各ボックスの`checked`から読むので、フォームをリセットしても取り残されません。`CheckboxCard`も同じ読み方をします。

  移行するときは、次のように書き換えます。

  - `<CheckboxGroup.Root>`の中の`<CheckboxGroup.Item itemValue label />`や`<Checkbox itemValue label />`を、`options`の`{ value, label }`にする
  - `CheckboxGroup.Root`のpropsは、そのまま`CheckboxGroup`に渡す。送信するグループには、これまでどおり`name`を渡す
  - 項目ごとの`disabled`、`indeterminate`、`labelHidden`は渡せなくなった。グループ全体の`disabled`を使う
  - `ComponentProps<typeof CheckboxGroup.Root>`のような型は`ComponentProps<typeof CheckboxGroup>`にする

- `Checkbox`と`Switch`が`errorText`と`helpText`を受け取るようにしました。どちらも`FormControl`と同じ見た目の文をボックスの下に描き、`aria-describedby`で`<input>`に結びます。`errorText`があるときはエラーの文だけを描き、`aria-invalid`と不正な値の見た目にします。文を出さずに不正な値の見た目にするときは、これまでどおり`invalid`を使います。渡した`aria-describedby`は残り、文のidが後ろに足されます。

  `Checkbox`と`Switch`は自分でラベルを持つので`FormControl`で包みませんが、エラーの文を出す口がありませんでした。`z.literal(true)`の同意欄などのエラーは素の`<p>`で出すしかなく、入力欄に結ばれませんでした。送信に失敗すると`useForm`はその欄へフォーカスを移しますが、スクリーンリーダーは理由を読みませんでした。`@k8ordo/form`と使うときは、`<Checkbox {...agree.input} errorText={agree.error} label="規約に同意する" />`と書きます。

  `Checkbox`と`Switch`のいちばん外側の要素は`<label>`から`<span>`になり、`<label>`と文をその中に描きます。文が無いときも`<span>`を描くので、エラーが出たときに`<input>`が作り直されてフォーカスを失うことはありません。外側の要素を直接選んでいるCSSやテストは、中の`<label>`を選ぶように直してください。

- `Checkbox`の`itemValue`を、ネイティブと同じ名前の`value`にしました。`Switch`も`value`を受け取ります。どちらもチェックしたときに`name`で送る文字列で、省くとブラウザの既定の`on`を送ります。チェックの状態はこれまでどおり`checked`と`defaultChecked`で扱います。

  これまでは`Checkbox`が`value`を型から外し、`input`の後ろで`itemValue`を書いていたので、`@k8ordo/form`が`z.stringbool()`の欄に導く`input.value`を展開しても消えていました。チェックすると`on`が送られ、`truthy`を変えたスキーマでは読めず、`@k8ordo/state`がURLに書く`inStock=true`とも食い違っていました。`Switch`は実行時には`value`を通していましたが、型では受け取れませんでした。今は`z.stringbool()`の欄も、`{...field.input}`を展開するだけでスキーマの綴りを送ります。

  移行するときは、`<Checkbox itemValue="true" />`を`<Checkbox value="true" />`に書き換えます。`z.stringbool()`の欄を素の`<input {...field.input} />`で描いていたところは、`<Checkbox {...field.input} label="…" />`にできます。

- `Dialog`を1つのコンポーネントにし、`Modal`の公開をやめました。`Dialog`は`title`を受け取ると閉じるボタンの付いた`h2`の見出しを描き、その見出しがダイアログの名前になります。見出しを描かないときは`label`で名前を付けます。`side`は`'center'`（既定）と`'bottom'`、`role`は`'dialog'`と`'alertdialog'`で、`role`は`<dialog>`自身に付きます。これまでは`Modal`の中に`Dialog.Root`、`Dialog.Header`、`Dialog.Content`を重ね、同じ`onClose`を2回渡していました。名前は中の`Dialog.Root`がeffectで外の`Modal`に渡していたので、最初の描画では名前がなく、`role="alertdialog"`を渡すと外の`<dialog>`は名前を失っていました。`Dialog.Root`、`Dialog.Header`、`Dialog.Content`はなくなりました。

  ```tsx
  // これまで
  <Modal isOpen={isOpen} onClose={close}>
    <Dialog.Root>
      <Dialog.Header onClose={close} title="確認" />
      <Dialog.Content>…</Dialog.Content>
    </Dialog.Root>
  </Modal>
  // これから
  <Dialog isOpen={isOpen} onClose={close} title="確認">
    …
  </Dialog>
  ```

  `Dialog`と`Drawer`の説明は`description`だけになりました。`description`は子の上に描かれ、`aria-describedby`はこの文だけを指します。これまでは本文全体を説明に結んでいたので、フォームを入れたダイアログではフォームの中身が丸ごと説明として読み上げられていました。`Drawer`の見出しも`h3`から`h2`になりました。`Dialog`と`Drawer`は`ref`で`<dialog>`を渡します。

  `onClose`は、開いているはずのダイアログが閉じたときだけ呼ばれるようになりました。Escape、枠外のクリック、閉じるボタン、`<form method="dialog">`、`<Activity>`で隠れたときです。`isOpen`を`false`にして自分で閉じたときは呼ばれません。これまでは自分で閉じたときにも呼ばれていたので、`onClose`で前のページへ戻すダイアログはブラウザの戻るで閉じると2回戻っていました。開くeffectには後始末を足し、`<Activity>`で隠れたときにも`<dialog>`を閉じます。これまでは隠れても開いたまま残り、ページがinertのままになっていました。閉じている間も子は外さないので、外したいときは`isOpen`を条件にして描いてください。

  移行するときは、次のように書き換えます。

  - `<Modal><Dialog.Root><Dialog.Header title onClose /><Dialog.Content>…`は`<Dialog title isOpen onClose>…</Dialog>`にする。`Modal`の`side`が`'center'`か`'bottom'`なら`Dialog`の`side`に、`'left'`か`'right'`なら`Drawer`にする
  - `<Modal aria-label="…">`で中身を直接置いていたところは`<Dialog label="…">`にする
  - `<Dialog.Root role="alertdialog">`は`<Dialog role="alertdialog">`にする
  - `Modal`や`Drawer`に`aria-describedby`で説明の段落を渡していたところは、その文を`description`に渡す
  - `onClose`の中で、自分で閉じたときにも呼ばれることを前提にした処理があれば見直す
  - 型の`ModalSide`は`DialogSide`（`'center' | 'bottom'`）か`DrawerSide`にする

- `@k8ordo/form`のためだけに受けていたpropsをなくしました。`Textarea`、`Combobox`、`ColorPicker`は`type`を受けなくなり、`FileField.Root`の`defaultValue`は`File[]`だけになりました。これまでは`@k8ordo/form`の`formFields`がただの文字列の欄にも`type="text"`を導き、ファイルの欄にも文字列の`defaultValue`の型を付けていたので、展開しても型のエラーにならないよう受けて捨てていました。`@k8ordo/form`はネイティブの要素に合う属性だけを出すようになったので、各コンポーネントは描く要素の属性だけを受け取ります。

  移行するときは、`Textarea`、`Combobox`、`ColorPicker`に`type`を渡している箇所から`type`を消し、`FileField.Root`の`defaultValue`には`File`の配列だけを渡します。`@k8ordo/form`の`input`を展開しているだけなら、書き換えるところはありません。ただし`z.email()`や`z.url()`、`z.iso.*()`の欄を`Textarea`に展開していると、導かれた`type`が`<textarea>`に残ります。その欄は`TextField`で描きます。

- `FileField`の見えない`<input type="file">`がTabで止まらないようにし、欄の名前と説明を`FileField.Trigger`のボタンに渡すようにしました。これまでは見た目を消しただけの入力欄がTabの止まり先になり、フォーカスの印も出ませんでした。`FormControl`のラベルやエラーの文もこの見えない入力欄に結ばれ、実際に押すボタンには届いていませんでした。

  送信する入力欄は`aria-hidden`と`tabIndex={-1}`になり、フォーカスを受けるとボタンへ移します。フォームが送信に失敗した欄へフォーカスを移すときも、ボタンにフォーカスが移ります。`FileField.Trigger`の`renderItem`は、これまでの`onClick`と`disabled`に加えて、`id`、`aria-labelledby`（欄のラベルとボタン自身の文字）、`aria-describedby`、`ref`を受け取ります。`FileField.Dropzone`の組み込みのボタンにも同じものを付けます。

  `renderItem`は`invalid`を受け取らなくなりました。`Button`には不正な値の見た目が無いので、受け取ったものをそのまま`Button`に展開できる形にしました。不正な値は`FormControl`のエラーの文と`FileField.Dropzone`の枠が示します。

  ボタンに欄の名前を付けるには、受け取ったものを展開します。展開しないボタンの名前は、ボタン自身の文字だけになります。

  ```tsx
  // これまで
  <FileField.Trigger
    renderItem={({ disabled, onClick }) => (
      <Button disabled={disabled} onClick={onClick}>ファイルを選択</Button>
    )}
  />
  // これから
  <FileField.Trigger
    renderItem={(wiring) => <Button {...wiring}>ファイルを選択</Button>}
  />
  ```

  `FormControl`で包むときは`labelAs="group"`を付けます。ボタンは`required`を持てず、`required`の付いた見えない入力欄は読み上げられません。`'group'`では必須の印が見出しの名前に入り、ボタンはその見出しを名前として読むので、「添付ファイル 必須 ファイルを選択」のように必須が伝わります。

- `FormControl`から`invalid`をなくし、`errorText`が空でないかどうかで不正な値かを決めるようにしました。`errorText`があれば欄の下にエラーの文を描き、`aria-describedby`をその文に向け、`renderInput`に`invalid: true`を渡します。`renderInput`が受け取る`invalid`はこれまでどおりで、各部品の`aria-invalid`になります。

  これまでは`invalid`と`errorText`の両方がそろったときだけ文を出していました。`@k8ordo/form`の`invalid`は`error`があるかどうかなので、どの欄でも同じ真偽を2つのpropで渡すことになり、片方を忘れると赤いのに文が無いか、文が出ないままになっていました。

  移行するときは、`<FormControl invalid={field.invalid} errorText={field.error} …>`の`invalid`を消します。文を出さずに不正な値の見た目にしていたところは、`renderInput={(props) => <TextField {...props} invalid />}`のように、中の部品に`invalid`を渡します。

- `FormControl`の`labelAs`の値を`'label'`と`'group'`にし、`'legend'`をなくしました。`'group'`はラベルを`<span id>`の見出しとして描き、見た目と必須の印は`'label'`と同じです。`Radio`、`RadioCard`、`CheckboxGroup`、`CheckboxCard`、`RangeSlider`のように、自分がグループになる部品を包むときに使います。グループは`renderInput`で受け取る`aria-labelledby`で、この見出しを名前にします。外側の要素はいつも`<div>`になり、`ref`の型は`Ref<HTMLDivElement>`です。

  `'legend'`は`<fieldset>`と`<legend>`で包んでいましたが、中のグループの部品も`fieldset`や`radiogroup`で、同じ名前のグループが二重に読み上げられていました。`'label'`で包むと`<label for>`がグループの要素を指し、ラベルを付けられない要素を指すことになっていました。

  移行するときは、`labelAs="legend"`を`labelAs="group"`に書き換えます。`ColorPicker`、`DatePicker`、`Combobox`、`Autocomplete`は`id`を文字の入力欄に付けるので、`labelAs`を付けずに包みます。`FormControl`の`ref`に`HTMLFieldSetElement`や`HTMLElement`の型を渡していたところは、`HTMLDivElement`にします。

- `FormControl`の`required`で描く「必須」の印を、`labelAs="label"`（既定）のときは`aria-hidden`にしました。入力欄の名前はラベルの文字だけになり、たとえば「メールアドレス 必須」は「メールアドレス」になります。必須であることは、入力欄に付く`required`がスクリーンリーダーに伝えます。

  これまでは印が名前に入るうえ、`required`の状態も読み上げられるので、必須を二度言っていました。`labelAs="group"`のときは、これまでどおり印もグループの名前に入ります。`role="group"`は`aria-required`を持てないので、名前で伝えます。

  見た目は変わりません。`getByRole('textbox', { name: 'メールアドレス 必須' })`のように、印まで含めた名前で欄を引いていたテストは、ラベルの文字だけで引くように直してください。

- `IconButton`の`color="transparent"`をなくし、`variant`を足しました。`variant`は`'skeleton'`（既定）と`'solid'`で、`color`は`'primary'`、`'secondary'`、`'base'`から`solid`の地の色を選びます。これまでは地の有無を`color`で選んでいて、`Button`の`variant`と同じ見た目の指定が食い違っていました。既定の見た目は変わりません。`color="transparent"`は消し、`color="base"`などで塗っていたところは`variant="solid"`を足してください。

  生成UIのカタログの`IconButton`も、地を`variant`で選びます。`color`は`solid`のときだけ効き、`transparent`はなくなりました。

  `IconButton`の内蔵のツールチップを、`aria-describedby`で結ばないようにしました。中身は`label`と同じ文なので、スクリーンリーダーが名前の直後に同じ文を説明として読んでいました。利用者が渡した`aria-describedby`はそのまま付きます。

  アイコンの`<svg>`に`focusable="false"`を付けるのをやめ、`IconRenderProps`からも`focusable`を消しました。読んでいたのはIEと旧Edgeだけで、`tabindex`の無い`<svg>`はもともとフォーカスを受けません。`BaseIcon`の`renderItem`で`focusable`を読んでいたら消してください。

- `ListBox`を1つのコンポーネントにしました。`ListBox.Root`、`ListBox.Trigger`、`ListBox.IconTrigger`、`ListBox.Content`はなくなり、`<ListBox options value defaultValue onChange label size icon helpContent placement />`と書きます。`icon`を渡すと、今の値を文字で出すボタンの代わりにアイコンのボタンを描きます。これまでは`Content`が子を取らず、いつも同じ3つを並べて書くしかなかったので、compoundにしておく意味がありませんでした。

  ```tsx
  // これまで
  <ListBox.Root onChange={onChange} options={options} value={value}>
    <ListBox.Trigger label="件数" size="sm" />
    <ListBox.Content helpContent={help} />
  </ListBox.Root>
  // これから
  <ListBox helpContent={help} label="件数" onChange={onChange} options={options} size="sm" value={value} />
  ```

  移行するときは、`Root`のpropsはそのまま、`Trigger`か`IconTrigger`の`label`、`size`、`icon`と、`Content`の`helpContent`を`ListBox`に移します。

- `@k8ordo/ui/i18n`から`messageUsage`をなくしました。組み込みの文言のキーごとに、どの部品が描くかの表を実行時の値として公開していましたが、読んでいたのはドキュメントサイトの1ページだけでした。同じ表は、`@k8ordo/ui/props.json`の`messages`（`{ key, usedBy }`の配列）と、同梱の`docs/references/components.md`のキーの一覧にあります。`messageUsage`を読んでいたら、`@k8ordo/ui/props.json`の`messages`を読むように書き換えてください。

- 生成UIのアダプタ（`@k8ordo/ui/json-render`、`@k8ordo/ui/json-render/registry`、`@k8ordo/ui/openui`、`@k8ordo/ui/openui/prompt`、`@k8ordo/ui/ai-sdk`）をなくし、どの形式にも依らないカタログ`@k8ordo/ui/catalog`と、その描画の`@k8ordo/ui/catalog/render`に置き換えました。peerの`@json-render/core`、`@json-render/react`、`@openuidev/lang-core`、`@openuidev/react-lang`、`ai`は要らなくなりました。

  `catalog`は、コンポーネントの名前ごとに説明とpropsのzodスキーマを持ちます。子を並べるコンポーネントには`children`が、入力欄には値を持つpropを示す`value`が付きます。`renderers`は同じ名前で、コンポーネントの描き方を持ちます。形式とのつなぎは、この2つを回して作ります。これまでは部品を1つ足すたびに形式ごとの登録を手で直し、説明文も形式ごとに写していました。

  json-render、OpenUI、AI SDKのつなぎは、リポジトリの`examples/ui-integrations`にあります。移行するときは、使う形式のつなぎをアプリに写します。`validateGeneratedSpec`、`JsonRenderUI`、`UISpec`はjson-renderのつなぎに、`mapMessageParts`はAI SDKのつなぎにあります。propsの検査は`catalogPropIssues`に、`uiRules`は`catalogRules`になりました。

- `NumberField`が範囲の外の値に自分の文言を出すのをやめ、`Enter`でもフォーカスを外したときと同じく値を範囲に収めるようにしました。これまでは`type="text"`の欄にブラウザが`min`と`max`を確かめないので、範囲の外の値を`setCustomValidity`で`@k8ordo/ui`の辞書の文言にしていました。`@k8ordo/form`と組むと、入力中は`@k8ordo/ui`の文言、送信後はzodの文言になり、同じ検証で文言がずれていました。範囲の外の値はフォーカスを外すと範囲に収めるので、この文言が見えるのは入力中と、欄の中で`Enter`を押して送信したときだけでした。

  `Enter`を押すと、送信の前に値を範囲に収め、変わったときは`input`イベントを出します。IMEで変換している間の`Enter`では何もしません。範囲の外の値が送信に届くのはJavaScriptが無いときだけで、そのときはサーバーのスキーマの文言でエラーになります。

  あわせて、辞書の`numberFieldRangeUnderflow`と`numberFieldRangeOverflow`をなくしました。値を`{min}`や`{max}`で埋める文法を持つ項目はこの2つだけだったので、辞書の項目はどれもそのまま表示する文字列になりました。`registerMessages`に渡す自前の辞書や、`Messages`型の値にこの2つを書いている場合は消してください。`NumberField`の範囲の外の値の文言を確かめるテストは、フォーカスを外したときや`Enter`を押したときに範囲に収まることを確かめる形に書き換えます。

- `NumberField`と`Slider`の`min`と`max`を数だけにしました。これまでは`@k8ordo/form`の`formFields`が文字列の`min`と`max`を導くことがあったので、どちらも文字列を受けて数に読み直していました。`@k8ordo/form`は`min`と`max`を数で出すようになったので、文字列を受ける理由がなくなりました。数として読めない文字列を渡すと黙って既定の範囲に戻っていた扱いもなくなります。非制御の`defaultValue`は、送信に失敗した値が文字列で戻るので、これまでどおり文字列も受け取ります。

  移行するときは、`min="0"`や`max={'100'}`のように文字列で渡している箇所を`min={0}`、`max={100}`のように数で渡します。

- `InView`と`Resize`の公開をやめました。子要素を観測するだけで何も描かない部品で、ライブラリの中で使うのは`Conversation`だけでした。UIの部品としての理由を持たない汎用の道具なので、`cn`や`mergeRefs`の公開をやめたときと同じ基準で外しました。

  移行するときは、React 19のrefのコールバックと後始末で`IntersectionObserver`や`ResizeObserver`を自分で張るか、観測のためのライブラリを使ってください。

- 公開の`Popover`を、いつもダイアログとして開くパネルにしました。`Popover.Root`から`role`、`trapFocus`、`closeOnClickAway`をなくし、開くと中へフォーカスを移し、外側のクリックとEscapeと中からのTabで閉じます。これまでの`role`の既定は`'menu'`で、例のとおりに書くと文章の入った`role="menu"`になっていました。メニュー、リストボックス、ツールチップは、それぞれ`DropdownMenu`、`ListBox`、`Tooltip`を使います。

  `Popover.Content`は`renderItem`をやめ、`label`と`children`を受け取ります。`role="dialog"`の要素を描き、`label`がその名前になります。地（`--color-bg-raised`）と角丸と影、高コントラストのときの線は`Popover.Content`が描き、余白は持ちません。これまでは使う側が面の見た目を毎回書いていて、場所ごとに値が違っていました。`PopoverContentProps`の公開もやめました。

  ```tsx
  // これまで
  <Popover.Content renderItem={(props) => <div {...props} aria-label="絞り込み" className={styles.panel}>…</div>} />
  // これから
  <Popover.Content label="絞り込み">
    <Stack gap="sm" padding="md">…</Stack>
  </Popover.Content>
  ```

  移行するときは、`renderItem`で描いていた要素の中身を`children`に移し、名前を`label`に渡します。面の背景、角丸、影のCSSは消し、余白だけを中の要素に残します。`role`や`trapFocus`、`closeOnClickAway`を渡していたら消してください。

  `DataTable`の列の切り替えと`DatePicker`のカレンダーも、この`Popover.Content`の面で描くようになりました。`DatePicker`のパネルは角丸が少し小さくなり、枠線の代わりに影で縁取ります。

- 名前が語彙表から外れていたpropsを、ほかの部品と同じ名前にそろえました。

  - `CommandPalette`と`Pagination`の`aria-label`を`label`にしました。省くと、これまでどおり組み込みの文言が名前になります。名前を表すpropは、ほかの部品と同じく`label`です
  - `CommandPaletteItem`の`onSelect`を`onAction`にしました。`DropdownMenu.Item`と`ContextMenu.Item`の`onAction`と同じく、項目を選んだときに引数なしで呼びます
  - `Tree`の`onExpandedChange`を`onExpandedIdsChange`にし、渡す配列を`readonly string[]`から新しい`string[]`にしました。主の状態の知らせは`onChange`、ほかの状態は`expandedIds`なら`onExpandedIdsChange`のようにpropの名前から付けます。受け取る配列は`readonly`、知らせる配列は新しい`string[]`なので、`useState<string[]>`のsetterをそのまま渡せます

  移行するときは、`aria-label`を`label`に、`onSelect`を`onAction`に、`onExpandedChange`を`onExpandedIdsChange`に書き換えます。

- `DateField`をなくしました。`DateField`は`type="date"`に固定した`<input>`で、`TextField`に`type="date"`を渡したものと同じでした。違いは数字の幅をそろえる`font-variant-numeric: tabular-nums`だけだったので、`TextField`の日付と時刻の`type`（`date`、`time`、`datetime-local`、`month`、`week`）で数字の幅をそろえるようにしました。WebKitでフォーカスの輪を出す扱いも、これまでどおり`TextField`の日付と時刻の欄に効きます。

  移行するときは、`<DateField />`を`<TextField type="date" />`に書き換えます。`@k8ordo/form`の`z.iso.date()`から作った`input`は`type: 'date'`を持つので、`<TextField {...props} {...eventDate.input} />`と展開すればそのまま日付の入力欄になります。

- `UIProvider`をなくしました。中身は`ToastProvider`で包むだけで、ほかに何もしていませんでした。同じものに2つの名前があり、`UIProvider`という名前は何を持つかを表していませんでした。公開するproviderは`ToastProvider`だけです。`useToast`を使うアプリはルートを`ToastProvider`で1回だけ包み、トーストを出さないアプリにproviderは要りません。

  `PortalRootProvider`と`usePortalRoot`もなくしました。ライブラリのオーバーレイはどれもトップレイヤーで開き、この値を読んでいませんでした。自分で浮かせるUIは`popover`属性を付けてその場に描きます。`Dialog`や`Drawer`の中で`document.body`へポータルするライブラリには、`ref`で受け取った`<dialog>`をポータル先として渡し、奥の部品で要るときは子の中に自分のContextを置きます。

  移行するときは、`<UIProvider>`を`<ToastProvider>`に書き換えます。`UIProvider`と`ToastProvider`を重ねて包んでいたら、`ToastProvider`の1段だけにします。`usePortalRoot`でポータル先を受け取っていたところは、ダイアログの`ref`から受け取るように書き換えます。

- shikiを`dependencies`から任意の`peerDependencies`（`>=4.6.0`）に移しました。shikiを使うのは`@k8ordo/ui/code-block`の`CodeBlock`だけですが、これまでは`@k8ordo/ui`を入れたすべてのアプリにshikiとその依存が入っていました（入れた中身の大半を占めていました）。版も4.6.0に固定していたので、アプリが自分で入れるshikiとずれると2つ目が入っていました。`@k8ordo/ui/ai/response`の`streamdown`と同じ扱いです。

  移行するときは、`@k8ordo/ui/code-block`を使うアプリで`pnpm add shiki`を実行します。

  2026-09-25に決めた「shikiはpeerでなく`dependencies`に置く」を改めます。

- `Tabs.Root`から`ids`をなくしました。矢印キーと`Home`、`End`の行き先は、画面に並んだタブの順で決まります。これまでは同じidを`ids`、`Tabs.Tab`、`Tabs.Panel`の3か所に書き、`ids`に無いタブでは矢印キーが黙って別のタブへ移っていました。選択を制御しないときは`defaultSelectedId`が必須になり、`null`で先頭を選ぶ書き方はなくなりました。

  パネルは選択の遅延値（`useDeferredValue`）で入れ替わるようになりました。タブの印はすぐに切り替わり、パネルのクロスフェードとsuspend中に前のパネルを残す動きは、選択を`useState`で持っても`@k8ordo/state`のような同期で更新するストアで持っても効きます。これまでは選択を`startTransition`で包んでいたので、同期の更新で制御すると、どちらも効きませんでした。

  ```tsx
  // これまで
  <Tabs.Root ids={['overview', 'settings']}>…</Tabs.Root>
  // これから
  <Tabs.Root defaultSelectedId="overview">…</Tabs.Root>
  ```

  移行するときは、`ids`を消し、制御していなければ`defaultSelectedId`に最初に選ぶタブのidを渡します。`ids={list as [string, ...string[]]}`のような型の黙らせも要らなくなります。パネルを手で`useDeferredValue`に通していたら、その処理は消してください。1枚の`Tabs.Panel`の`id`を選択に合わせて付け替えていたところは、パネルが遅れて描かれる間に空になるので、タブごとの`Tabs.Panel`を並べる形にします。

- `ToastProvider`の公開のpropsを`children`だけにし、`portalRef`と`position`をなくしました。使っていたのは、自分の`<dialog>`の中にトーストを出す`Dialog`と`Drawer`の内部だけでした。`Dialog`と`Drawer`の中の`useToast`は、これまでどおりトーストをその`<dialog>`の中に出し、閉じると一緒に消えます。`portalRef`や`position`を渡していたら消してください。

- 色のトークンを`light-dark()`で書くようにしました。ダークの値は`.dark`の規則ではなく、`:root`の`--color-fg-base: light-dark(var(--gray-900), var(--gray-50));`のような1つの宣言に入ります。どちらの値になるかは、そのトークンを使う要素の`color-scheme`で決まります。`dark`クラスで切り替える既定は同じで、見た目も変わりません。

  CSSの変数の値は、配色によらず`light-dark()`の式のままです。JavaScriptで`getPropertyValue('--color-fg-base')`のように色を読んでいた場合は、`color`などのプロパティに使った値を`getComputedStyle()`で読んでください。`.dark`でトークンを上書きしているCSSは、そのまま動きます。

  OSの配色に従わせたいページは、自分のCSSで`:root`に`color-scheme: light dark`を書きます。

  `@k8ordo/ui/tokens`のmodifierの名前が変わりました。

  - `.dark`は`:root color-scheme: dark`になりました。
  - `@media (prefers-contrast: more) :root:where(:not(.dark))`は`@media (prefers-contrast: more) :root`に、`@media (prefers-contrast: more) .dark`は`@media (prefers-contrast: more) :root color-scheme: dark`になりました。
  - 印刷の2つのmodifierは無くなりました。印刷ではライトの値を使います。

  ダークの値を読むコードは、探す名前を`:root color-scheme: dark`に変えてください。ダークでコントラストを上げたときの値は、`:root color-scheme: dark`、`@media (prefers-contrast: more) :root`、`@media (prefers-contrast: more) :root color-scheme: dark`の3つをこの順に適用した値です。

### Minor Changes

- `Anchor`が新しいタブで開くリンクに、読み上げ専用の「新しいタブで開きます」（英語は「opens in a new tab」）を添えるようにしました。新しいタブで開くことはアイコンでしか示しておらず、アイコンは`aria-hidden`なので、スクリーンリーダーには伝わっていませんでした。文言は辞書の`opensInNewTab`で、`registerMessages`で差し替えられます。

  `openInNewTab`を渡した`Card`のリンクも、同じ文言を名前の終わりに含めて読み上げます。カードのリンクは中身を持たず、名前を`aria-labelledby`でカードの中の文字から取るので、画面に出さない文言の要素も`aria-labelledby`で指します。`renderAnchor`に渡す`aria-labelledby`にも、その要素のidが入ります。

  外部のリンクを`inline-flex`で描くのもやめ、本文の行の流れに乗せました。長い外部のリンクが1つの箱として折り返していました。アイコンは文字の高さの中ほどにそろえます。

  移行するときは、`registerMessages`で独自の言語の辞書を登録しているアプリが、その辞書に`opensInNewTab`を足します。

- `Breadcrumb.Link`が、`hrefLang`や`data-*`などの`<a>`の属性を受け取り、そのまま渡すようにしました。`renderAnchor`にも同じ属性が渡ります。`current`のときは`<span aria-current="page">`を描くので、これらの属性は付きません。`className`と`style`は受け取りません。

- `Card`に`href`と`action`を足しました。`href`を渡すとカード全体が1つのリンクに、`action`を渡すと1つのボタンになります。カードは中身の上に`<a>`か`<button>`を重ね、名前は`aria-labelledby`でカードの中の文字から取るので、キーボードでも押せて、読み上げでもリンクやボタンと伝わります。中のリンク、ボタン、入力欄はその上に出て、別に押せます。これまでの`interactive`は見た目だけで、カード全体を押せるようにするには中身を自分の`<a>`で包むしかなく、そうすると中に別のリンクを置けませんでした。

  `renderAnchor`でルーターのリンクの部品に差し替えられ、`openInNewTab`で新しいタブに開きます。`action`は`Button`の`action`と同じくtransitionの中で呼び、返したpromiseが終わるまでは、カードは`aria-busy`になり、押しても何もしません。`href`と`action`の両方を渡すと`href`を使います。どちらかを渡せば、`interactive`と同じ押せる見た目になります。`interactive`は、中身を自分のリンクで包む使い方のために残しています。

- 生成UIのカタログの`Checkbox`と`Switch`に、任意の`helpText`を足しました。`Checkbox`と`Switch`のコンポーネントが自分で欄の下に描き、入力の説明として読み上げられます。ほかの入力欄の`helpText`と同じ扱いです。どちらもスキーマの末尾に足したので、OpenUI Langの位置引数では、`Checkbox`は`disabled`の次、`Switch`は`required`の次が`helpText`です。

- 生成UIのカタログの`Dialog`に`side`を足しました。`'center'`（既定）か`'bottom'`で、`Dialog`コンポーネントの`side`と同じです。これまでカタログの`Dialog`はいつも中央に開き、下端から出すには`Modal`の`side`を使うしかありませんでした。OpenUI Langの位置引数では、`title`の次が`side`です。

  `Dialog`と`Drawer`の説明も、今のコンポーネントに合わせて書き直しました。`Dialog`は中央か下端に開くこと、`Drawer`は左右の端に開くこと、どちらも`title`の見出しと閉じるボタンを持つことを書いています。

- `@k8ordo/ui/catalog`に`isCatalogName`と`catalogNames`を足しました。`isCatalogName(name)`は、文字列が`catalog`の項目の名前かを確かめ、`CatalogName`として型を付けます。`catalogNames`は、すべての項目の名前を`catalog`の順に並べた配列です。

  形式のつなぎは、部品の名前を文字列で受け取ったり、`Object.keys(catalog)`から並べたりします。これまではそこで`name as CatalogName`や`Object.keys(catalog) as CatalogName[]`と書く必要がありました。`examples/ui-integrations`のA2UI、json-render、OpenUIのつなぎは、この2つを使ってキャストをなくしました。写したつなぎも、同じように書き換えられます。

- `catalogPropIssues`に、形式があとで解決するpropを渡す`unresolved`を足しました。json-renderのspecが`{ "$bindState": "/form/name" }`で状態に結んだpropは、検査のときにはまだ値ではないので、型が合わないと報告されていました。`unresolved`に挙げたpropは名前だけを確かめ、値は確かめません。必須のpropでも、欠けたとは報告しません。

- 生成UIのカタログの`TextField`に`type`を足しました。`TextField`コンポーネントが1行の欄として描く種類（`text`、`email`、`tel`、`url`、`search`、`date`、`time`、`datetime-local`、`month`、`week`）だけを受け取り、省くと`text`です。パスワードは`PasswordInput`、数は`NumberField`の項目が描くので、`password`と`number`は受け取りません。これまでカタログの`TextField`はいつも`type="text"`で、メールアドレスやURLの欄でも、その種類のキーボードや入力の補助が出ませんでした。OpenUI Langの位置引数では、`readOnly`の次が`type`です。

  日付や時刻の`type`では、`defaultValue`がその種類の入力欄の書式に合うかを確かめます。`date`は暦にある日の`YYYY-MM-DD`、`time`は`HH:MM`か`HH:MM:SS`、`datetime-local`は秒を省ける`YYYY-MM-DDTHH:MM`、`month`は`YYYY-MM`、`week`は`YYYY-Www`です。`catalogPropIssues`は、合わない値を`TextField.defaultValue: Expected YYYY-MM-DD for type "date", received "2026/11/27"`の形で、ほかのpropの誤りと一緒に返します。`DatePicker`と同じく、書式の違う日付は描く前に弾きます。

  `catalog.TextField.props`は、この検査を持つzodのスキーマになりました。`.omit()`、`.pick()`、`.partial()`と、すでにあるキーを置き換える`.extend()`はエラーになります。このスキーマから別のスキーマを作るときは、`.safeExtend()`で作ります。この検査はJSON Schemaには出ません。

- 生成UIのカタログに、形式のつなぎがキャストせずに使える型を足しました。つなぎは`catalog`を回すので、部品の名前を実行時にしか知りません。部品ごとの型はそこでは使えず、これまでのつなぎは`renderers[name] as AnyRenderer`のように、自分で型を消していました。

  - `@k8ordo/ui/catalog`の`AnyCatalogEntry`は、部品の型を消した項目です。`catalog`のどの項目も、`const entry: AnyCatalogEntry = catalog[name]`とそのまま代入できます。`value.initial`は、どの部品のpropsでも受け取ります。
  - `@k8ordo/ui/catalog/render`の`rendererOf(name)`は、その名前の描画の関数を、型を消した`AnyRenderer`として返します。`AnyRenderer`が受ける`AnyRenderArgs`では、propsは`Record<string, unknown>`、入力欄の値とsetterは`unknown`です。

  `RenderArgs`の`children`は省けるようになりました。子を持たない部品は`renderers.Button({ props: { label: 'OK' } })`と呼べます。`examples/ui-integrations`のA2UI、json-render、OpenUIのつなぎは、自前の`AnyRenderer`や`Entry`の型と、`catalog`や`renderers`へのキャストをなくし、この2つを使います。写したつなぎも、同じように書き換えられます。

- `DropdownMenu.Item`と`ContextMenu.Item`に、リンクの形を足しました。`onAction`の代わりに`href`を渡すと`<a role="menuitem">`を描き、選ぶとメニューを閉じて、遷移はブラウザに任せます。ルーターの横取りも、中クリックや新しいタブで開くことも、そのまま効きます。ボタンの項目と同じく、Spaceでも選べます。これまではリンクの項目を作れず、`onAction`の中で`navigation.navigate`を呼ぶしかありませんでした。Next.jsの`Link`のようなリンク部品は`renderAnchor`で描きます。

  ```tsx
  <DropdownMenu.Item href="/settings" label="設定" />
  ```

  `DropdownMenu.Trigger`は`Button`の`color`を、`DropdownMenu.IconTrigger`は`IconButton`の`size`と`variant`と`color`を受け取るようになりました。これまで`IconTrigger`は大きさを変えられず、小さいアイコンのメニューを作るには`Popover.Trigger`を流用するしかありませんでした。既定の見た目は変わりません。

- `FormControl`と`Form`から`'use client'`を外しました。どちらもServer Componentとして描け、`renderInput`は`FormControl`を描いたところで動きます。`useForm`を使わず、Server Actionに送る非制御の入力欄だけのフォームなら、Server Componentに書けます。

  これまでは`FormControl`がClient Componentだったので、Server Componentから`renderInput`を渡すと、関数はClient Componentに渡せないというエラーになっていました。`FormControl`が使うhookは`useId`だけで、`Form`はhookを使いません。呼び出し側で変えることはありません。

- `IconButton`が`type`（`'button'`、`'submit'`、`'reset'`）を受け取るようになりました。既定は`'button'`です。属するフォームの送信中に保留になるのは、`type="submit"`のときだけにしました。これまでの`IconButton`は、送信中のフォームの中にあると、送信ボタンでなくても`aria-busy`と`aria-disabled`が付き、押しても何もしませんでした。

- `@k8ordo/ui/icons`に`GitPullRequestIcon`（プルリクエスト）と`ClipboardCheckIcon`（チェックの付いたクリップボード）を足しました。generative UIのカタログでは`git-pull-request`と`clipboard-check`の名前で使えます。

- `Select`に`placeholder`を足しました。渡すと、値が空文字（`''`）の選択肢を先頭に置き、その表示名にします。空の選択肢が無い`<select>`はいつもどれかが選ばれているので、`required`を効かせるには、これまで`options`の先頭に`{ value: '', label: '…' }`を手で書く必要がありました。`Radio`や`RadioCard`には要らない、`Select`だけの書き方でした。この選択肢は選べるので、任意の欄は未選択に戻せます。`@k8ordo/form`の`parseForm`は`''`を未選択として読むので、必須のenumではエラーになり、任意のenumでは`undefined`になります。

  ```tsx
  // これまで
  <Select options={[{ value: '', label: '選んでください' }, ...plans]} required />
  // これから
  <Select options={plans} placeholder="選んでください" required />
  ```

- `@k8ordo/ui/tokens.css`を足しました。`styles.css`のうち、トークン（`:root`の変数と、`prefers-contrast: more`での上書き）と、`color-scheme`を決める3つの規則だけのスタイルシートです。リセットとページの既定は入っていないので、部品を使わないページがトークンだけを読めます。

  色のトークンは`light-dark()`で書いてあり、`color-scheme`が無いと暗い側になりません。そこで`color-scheme`の規則（`:root`は`light`、`.dark`は`dark`、印刷では`light`に戻す）も同じファイルに入れました。このファイルだけを読んだページでも、`dark`クラスで暗くなります。

  規則は`styles.css`と同じく`base`レイヤーの中にあります。OSの配色に従わせたいページは、レイヤーの外に`:root { color-scheme: light dark; }`を書きます。

  `styles.css`の働きは変わりません。`color-scheme`の規則が、`base`レイヤーの中で先頭に移りました。

### Patch Changes

- AIチャットの参照の「Combining with generative UI」を書き直しました。モデルがツールで画面を出し、チャットがそのツールのパートを描く書き方と、画面で押した操作を`data`のパートで次の発言として送り、サーバーで`convertDataPart`を使ってモデルが読む文に変える書き方です。あわせて、AI SDKとつなぐ例から、`data-ui`のパートでjson-renderの画面を描く部分を外しました。

- AIチャットの参照に、MCP Appsの節を足しました。MCPサーバーのツールが持つApp（`ui://`のHTML）を、AI SDKの`MCPAppRenderer`でチャットの中に描く書き方です。あわせて、`examples/ui-integrations`の`mapMessageParts`がツールのpartそのものを`part`で持つようになったので、`MappedPart`の形にそれを足しました。

- `Alert`の`message`に同じ文が2件以上並ぶと、React が重複キーの警告を出し、片方が正しく更新されないことがあったのを直しました。一覧の各項目のキーに位置を加えています。

- `Anchor`が外部のリンクかどうかを、URLの形で決めるようにしました。`http:`か`https:`で始まるURLと、`//`（ブラウザが同じに読む`/\`も）で始まるURLが外部です。これまでは`http`で始まるかどうかだけを見ていて、`//example.com`は内部のリンクとして新しいタブにならず、`http-guide`のような相対パスは外部として新しいタブで開いていました。

- `Anchor`が既定の`<a>`に`kind="internal"`や`kind="external"`という属性を出していたのを直しました。`kind`は`renderAnchor`に渡す値で、HTMLの属性ではありません。`renderAnchor`にはこれまでどおり渡ります。CSSやテストが`a[kind]`を読んでいた場合は、`renderAnchor`で自分の属性を付けてください。

- `RadioCard`と`CheckboxCard`が、フォームの送信中に選び直せないようにし、`invalid`のときに`aria-invalid`を付けるようにしました。これまでは2つとも`useFormStatus`を読まず、送信中でも選択を変えられました。`invalid`も枠の色だけで伝えていたので、不正な値であることが読み上げで分かりませんでした。`aria-invalid`は、`RadioCard`ではグループ（`role="radiogroup"`）に、`CheckboxCard`では各チェックボックスに付けます。`role="group"`は`aria-invalid`を持てないためです。送信中は`Radio`や`Checkbox`と同じく、各入力に`aria-disabled`を付けて押した操作を捨てます。`disabled`にはしないので、`Enter`で送信した人はフォーカスを失いません。

  `CheckboxGroup`も、`invalid`を`<fieldset>`の`aria-invalid`にせず、各チェックボックスに渡すようにしました。これまでは`role="group"`が持てない`aria-invalid`をグループに付けていました。各ボックスは`aria-invalid="false"`のままで、枠も赤くなりませんでした。`<FormControl labelAs="group">`の`errorText`でエラーの文が出ても、ボックスは正しい値として読み上げられていました。

- `@k8ordo/ui/catalog/render`の`DataTable`の並べ替えで、セルの文字をアプリの言語（`@k8ordo/i18n`の今のロケール）の規則で比べるようにしました。これまでは閲覧者の環境の言語で比べていたので、たとえばスウェーデン語のアプリを英語のブラウザで開くと、`ä`が`a`の隣に並んでいました。`Combobox`と`CommandPalette`の絞り込みと同じ扱いです。

- 生成UIのカタログの項目の一覧を、同梱の`docs/references/generative-ui.md`の「What the catalog covers」に、カタログから作って載せるようにしました。各項目は、それが描くコンポーネントの分類の下に並びます。`Icon`、`Toast`、`DropdownMenuItem`のように同じ名前のコンポーネントが無い項目は、「Catalog only」の下に並びます。READMEの手書きの一覧は、項目を足し引きするたびに手で書き直す必要があり、分け方もコンポーネントの分類とは別の手書きのものだったので消し、この節へのリンクにしました。

- `@k8ordo/ui/catalog/render`の`Toast`が、自分を`ToastProvider`で包むのをやめ、アプリの`ToastProvider`でトーストを出すようにしました。これまでは`Toast`を1つ置くたびにトーストの領域が1つ増え、アプリの領域と同じ位置に重なっていました。表示の上限（5件）とホバー中の一時停止も、領域ごとに別々に働いていました。

  生成UIは、アプリの`ToastProvider`の中で描きます。外で`Toast`を描くと、`useToast must be used within a ToastProvider`のエラーになります。

- `CheckboxCard`と`Autocomplete`の`value`と`defaultValue`が、`readonly string[]`も受け取るようにしました。`as const`で書いた既定値や、ほかの部品から受け取った読み取り専用の配列を、写さずにそのまま渡せます。`onChange`にはこれまでどおり新しい`string[]`を渡すので、`useState<string[]>`のsetterをそのまま渡せます。受け取る配列は`readonly`、知らせる配列は新しい`string[]`という、ほかの部品と同じ決まりにそろえました。

- `Combobox`の絞り込みで、大文字と小文字をアプリの言語（`@k8ordo/i18n`の今のロケール）の規則でそろえるようにしました。これまでは閲覧者の環境の言語で小文字にしていたので、たとえばトルコ語のアプリを英語のブラウザで開くと`İ`の扱いがアプリの言語に従いませんでした。`CommandPalette`と同じ扱いです。

- `CommandPalette`の絞り込みで、大文字と小文字をアプリの言語（`@k8ordo/i18n`の今のロケール）の規則でそろえるようにしました。これまでは閲覧者の環境の言語で小文字にしていたので、たとえばトルコ語のアプリを英語のブラウザで開くと`İ`の扱いがアプリの言語に従いませんでした。

- WebKit（Safari）で、`type`が`date`、`time`、`datetime-local`の`TextField`にフォーカスの輪が出なかったのを直しました。これらの欄ではフォーカスを持つのが欄の中のパーツ（年、月、日など）で、WebKitはそのあいだ`<input>`を`:focus`にはしますが、`:focus-visible`にはしません。日付や時刻の欄は`:focus`でも輪を出すようにしました。ChromiumとFirefoxでは、これらの欄はフォーカスがあれば必ず`:focus-visible`になるので、見た目は変わりません。

- 同梱のドキュメントを直しました。`docs/llms.txt`に、ほかのパッケージと同じく入口の一覧（Entry points）を足し、導入に要る`styles.css`、`tokens.css`、`tailwind.css`と各subpathを`/llms.txt`からたどれるようにしました。README、GUIDE、`llms.txt`の前置きは、ほかのパッケージと同じ「Baseline newly available」の文にそろえ、READMEのBrowser Supportの節は「Chrome (latest)」などの一覧をやめてGUIDEのCSSのtargetを指すようにしました。READMEから、なくなった生成UIのアダプタと0.xのpeerについての古い段落を消しました。

- 強制カラーのとき、色そのものを見せるために`forced-color-adjust: none`にしている部品の枠と輪が、デザイントークンの色のまま描かれていたのを直しました。`Code`の色見本の枠と、`ColorPicker`の色の段の溝の輪郭、見本のフォーカスの輪を、ほかの部品と同じ`CanvasText`で描きます。

  溝の輪郭は、`prefers-contrast: more`も効いているとき（Windowsのコントラストテーマ）に、トークンの色になっていました。見本のフォーカスは、ブラウザが塗らない透明の輪と、トークンの色の影で描いていました。

- `CheckboxGroup`と`CheckboxCard`、`Slider`、`RangeSlider`が`required`を受け取り、どの要素にも書かないようにしました。これまでは`FormControl`の`renderInput`で受け取ったpropsを展開すると、`CheckboxGroup`と`CheckboxCard`では`required`が残りの属性として`<fieldset required>`に描かれていました。`<fieldset>`は`required`を持たず、チェックボックスに付けるとそのボックスのチェックを求める意味になります。`Slider`と`RangeSlider`は`<input type="range">`に`required`を付けていましたが、HTMLはrangeに`required`を許しません。rangeは常に値を持つので、必須の検査にも掛かりませんでした。

  グループが必須であることは、`<FormControl labelAs="group" required>`の印がグループの名前に入って伝わります。`RangeSlider`の各つまみもこの名前を読むので、これまでは名前の印とつまみの`required`で必須を二度読み上げていました。いくつ選ぶかは、`@k8ordo/form`がスキーマの`.min()`から作るルールか、自分のルールで確かめます。呼び出し側で変えることはありません。

- ガイドに、CSSのtargetの設定を書きました。ViteとNext.jsの既定のtargetでは、Lightning CSSが`light-dark()`と`:dir()`と`@scope`の中の`&`を書き換えます。`light-dark()`はトークンを宣言した場所で解決される形になり、`<html>`より下に付けた`.dark`の中が暗くなりません。

  Viteでは、`build.cssTarget`をChrome 146、Edge 146、Firefox 151、Safari 26以上にします。`css.transformer`が`'lightningcss'`なら、`css.lightningcss.targets`も同じ版にします。Next.jsでは、`package.json`の`browserslist`に同じ版を書きます。`@k8ordo/framework`のアプリは、何も書かなくて構いません。

- `Calendar`と`DatePicker`が日付を計算するときに、`YYYY-MM-DD`の暦日でない値で投げる`RangeError`の文言を英語にしました。公開するパッケージが実行時に開発者へ出す文言は英語にそろえています。文言は`@k8ordo/ui: not a YYYY-MM-DD calendar date: "2023-02-30"`のように、パッケージ名と受け取った値を含みます。

- `exports`に`"./package.json"`を足しました。`@k8ordo/ui/package.json`を読むツールが`ERR_PACKAGE_PATH_NOT_EXPORTED`で失敗していました。ほかのk8ordoのパッケージは、すでに公開しています。

- `Popover`、`Tooltip`、`DropdownMenu`、`ContextMenu`、`ListBox`が、triggerの要素に`anchor-name`を書き込まなくなりました。中身は`showPopover({ source })`でtriggerを暗黙のアンカーにして開き、`position-anchor: auto`で並びます。これまでは同じ要素を2つのtriggerにすると、後から書いた`anchor-name`が先の名前を上書きしていました。`IconButton`を`Popover.Trigger`にすると、内蔵のツールチップの名前が残ってポップオーバーが正しい位置に出ず、`tooltipDisabled`で避けるしかありませんでした。triggerに自分で付けた`anchor-name`も、上書きされずに残ります。

- `Radio`で`name`を省いたときの名前を、`aria-labelledby`のidから`useId`で作る名前に変えました。これまでは見出しのidをそのまま`name`にしていたので、`FormControl`の`labelAs="group"`で包むと見出しのidが送信のキーになりました。同じ見出しを指す`Radio`が2つあると、ブラウザが2つを1つのグループとして扱い、別々のグループの選択が互いに外れていました。`RadioCard`はすでに`useId`で名前を作っていて、これにそろえました。フォームで値を送るときは、これまでどおり`name`を渡してください。

- `Select`の枠の右端にあるシェブロンと、その外側の余白を押しても、選択肢が開くようにしました。これまではシェブロンが`<select>`の隣に並んでいたので、そこは`<select>`の外になり、押しても何も起きませんでした。`<select>`を枠いっぱいに広げ、シェブロンをその上に重ねています。見た目は変わりません。

- `Toolbar`の中で押した項目が、ホバーと押下のあいだもツールバーの濃い地のままになるようにしました。これまでは押した`solid`の`Button`にポインタを載せたり押したりすると、ツールバーの地ではなく`Button`自身のホバーと押下の地が出ていました。

- Updated dependencies:
  - @k8ordo/i18n@4.0.0

## 3.0.0

### Major Changes

- トークンの`--color-logo-primary`と`--color-logo-secondary`を消しました。Tailwindの橋の`*-logo-primary`、`*-logo-secondary`と、`@k8ordo/ui/tokens`のDTCGの文書からも無くなります。ロゴを描く部品をuiが持たなくなったので、ロゴの色も使う側で持ちます。これまでの値は、ライトがteal-700とteal-600、ダークがteal-400とteal-500でした。

- アイコンを自作の線画に替え、入口を`@k8ordo/ui/icons`に分けました。`lucide-react`への依存は無くなります。アイコンは1つずつ別のモジュールになり、どれもServer Componentのまま描けます（lucideのアイコンはcontextを読むClient Componentでした）。

  - rootの入口（`@k8ordo/ui`）はアイコンをexportしなくなりました。`import { XIcon } from '@k8ordo/ui/icons'`と書きます。
  - 名前を用途から形に改めました。`CloseIcon`→`XIcon`、`ViewIcon`→`EyeIcon`、`ViewOffIcon`→`EyeClosedIcon`、`DarkModeIcon`→`MoonIcon`、`LightModeIcon`→`SunIcon`、`PublishDateIcon`→`CalendarIcon`、`UpdateDateIcon`→`ClockIcon`、`SubscribeIcon`→`BookmarkIcon`、`NewsIcon`→`BellIcon`、`PrepareIcon`→`RocketIcon`、`BlogIcon`→`BookTextIcon`、`SlideIcon`→`PresentationIcon`、`LocationIcon`→`MapPinIcon`、`CodeXmlIcon`→`CodeIcon`、`RSSIcon`→`RssIcon`、`HorizontalWritingIcon`→`TextHorizontalIcon`、`VerticalWritingIcon`→`TextVerticalIcon`、`GoodIcon`→`ThumbsUpIcon`、`BadIcon`→`ThumbsDownIcon`、`InterestingIcon`→`SmileIcon`、`InformativeIcon`→`LightbulbIcon`、`MixedColorIcon`→`BlendIcon`、`ColorInfoIcon`→`PaintBucketIcon`、`ColorContrastIcon`→`ContrastIcon`、`AIIcon`→`BotIcon`、`AssistantIcon`→`BotMessageIcon`、`NavigationMenuIcon`→`MenuIcon`、`ForkIcon`→`GitForkIcon`、`FullscreenIcon`→`MaximizeIcon`。意味から絵を選ぶのは`AlertIcon`（`status`）と`ChevronIcon`（`direction`）だけです。
  - `FormIcon`、`AccessibilityIcon`、`AtomIcon`、`BoringIcon`、`EasyIcon`、`DifficultIcon`、`ShallowIcon`を消しました。
  - ロゴ（`Logo`、`LogoIcon`、`GitHubIcon`、`TwitterIcon`、`QiitaIcon`、`ChromeIcon`、`EdgeIcon`、`FirefoxIcon`、`SafariIcon`）を外しました。ロゴは使う側で持ちます。`BaseIcon`を`@k8ordo/ui/icons`から出したので、自分の`<svg>`にほかのアイコンと同じ`size`の刻みを付けられます。
  - 検索、設定、人、家、鉛筆、ごみ箱、矢印、ダウンロードなど、どのアプリケーションでも使う形を足しました。全部で102個と、`AlertIcon`、`ChevronIcon`です。
  - 生成UIのカタログでは、`Icon`の`name`が`size`だけで描けるアイコンの全部になりました。名前はアイコンの名前をケバブケースにしたもので、`close`は`x`、`publish-date`は`calendar`、`view-off`は`eye-closed`です。`logo`、`github`、`twitter`、`qiita`と、消したアイコンの名前は使えません。

### Minor Changes

- `@json-render/core`と`@json-render/react`のpeerの範囲を、0.21系（`>=0.21.0 <0.22.0`）から0.22系（`>=0.22.0 <0.23.0`）に移しました。0.21系を使っている場合は、2つのパッケージを一緒に0.22系へ上げてください。json-render 0.22.0のリリースノートに挙がっている変更は`@json-render/chat`の追加だけで、`@k8ordo/ui/json-render`と`@k8ordo/ui/json-render/registry`の使い方は変わりません。

### Patch Changes

- docsのコンポーネントカタログに、制御された欄がhydrateの前の入力を`onChange`で受け取らないことを書きました。サーバーが描いたHTMLの欄はReactが付く前から打てますが、Reactは打たれた値を欄に残すだけで`onChange`を呼ばないので、`value`の元の状態は次のキー入力まで古いままです。`ref`で欄と状態を比べて拾う書き方を載せています。コンポーネントの動きは変えていません。Reactが同じ直し（hydrate時のchangeの送り直し）をexperimentalで持っていて、ここで別に直すと、それが入った版で`onChange`が2回呼ばれるためです。

- Updated dependencies:
  - @k8ordo/i18n@3.0.0

## 2.3.1

### Patch Changes

- `@k8ordo/*`のパッケージを、すべて同じバージョンで出すようにしました。これまで`@k8ordo/ui`だけは別にバージョンを上げていたので、ほかのパッケージは2.0.0から2.3.1へ飛びます。このリリースに中身の変更はありません。

## 2.3.0

### Minor Changes

- 印刷では、`.dark`が付いていても、色のトークンと`color-scheme`をライトの値に戻すようにしました。ブラウザは既定で背景を刷らないので、ダークのまま刷ると、白い紙に明るい文字が出ていました。

  - `@media print`のとき、`.dark`が上書きする色のトークンは`:root`の値になり、`color-scheme`は`light`になります。`prefers-contrast: more`のときは、ライトのハイコントラストの値になります。
  - `tailwind.css`の`dark:`と`light:`のバリアントも、印刷ではトークンと同じく切り替わります。
  - 背景ごと刷るスライドのように、画面の配色のまま刷りたいときは、`print-as-shown`クラスを付けた要素を置きます。この要素を含む`.dark`は、印刷でもダークの値のままです。背景を刷るには、`print-color-adjust: exact`も指定します。
  - `@k8ordo/ui/tokens`には、印刷の2つのモードが修飾子として加わります。

### Patch Changes

- 強制カラーで、`Prose`の本文のリンクにフォーカスがあっても、見た目が変わらなかったのを直しました。フォーカスリングを`box-shadow`だけで描いていたため、強制カラーでは影と一緒に消えていました。強制カラーのときは、リンクの周りにシステムカラーで2pxの線を引きます。

- 強制カラーで、`Slider`と`RangeSlider`と`ColorPicker`のつまみにフォーカスがあっても、見た目が変わらなかったのを直しました。フォーカスリングを`box-shadow`だけで描いていたため、強制カラーでは影と一緒に消えていました。強制カラーのときは、フォーカスのあるつまみの周りに、システムカラーで2pxの線を引きます。線はつまみの周りに引くので、`RangeSlider`ではどちらのつまみにフォーカスがあるかも分かります。

- `Select`・`PasswordInput`・`DatePicker`で、`invalid`の赤い枠線がフォーカス中に消えていたのを直しました。フォーカスの輪は、不正な値の欄（`aria-invalid="true"`の要素か、それを中に持つ枠）の枠線を消さなくなりました。

  `TextField`・`Textarea`・`DateField`・`ColorPicker`・`Autocomplete`・`Combobox`の見た目は変わりません。`NumberField`は、読み取り専用や送信中にフォーカスしたとき、ほかの欄と同じく輪の内側の枠線が消えるようになりました。これまでは無効のときの色の枠線が残っていました。

- `Dialog.Content`・`Dialog.Header`の閉じるボタン・`Drawer`の中身と閉じるボタンで、クリックの伝わりを止めないようにしました。中のクリックが祖先の`onClick`や`document`のリスナーに届きます。モーダルが閉じるのはこれまでどおり枠外（`<dialog>`自身）を押したときだけです。

- `Textarea`で、キー入力の伝わりを止めないようにしました。これまでは`keydown`をすべて止めていたので、`Popover`の中の`Textarea`ではEscapeで`Popover`が閉じませんでした（`TextField`なら閉じます）。祖先の`onKeyDown`や`window`のリスナーにもキー入力が届きます。

- 閉じた`Toast`を、畳むtransitionが終わったところでDOMから外すようにしました。これまでは`--duration-moderate`と手で合わせた200msのタイマーで外していたので、トークンを変えると演出の途中で消えたり、終わってから残ったりしました。動きを減らす設定ではtransitionが無いので、閉じるとすぐに外れます。

- Updated dependencies:
  - @k8ordo/i18n@2.0.0

## 2.2.0

### Minor Changes

- `@openuidev/lang-core`と`@openuidev/react-lang`のpeerの範囲を、0.3系から1系（`^1.0.0`）に移しました。OpenUI Lang 1.0は1つのアクションを`Action([...])`で包まずに書くなど、プロンプトと描画の両方が0.x系と食い違うので、2つのパッケージを一緒に1系へ上げ、プロンプトを生成するサーバー側もそろえてください。`@k8ordo/ui/openui`と`@k8ordo/ui/openui/prompt`の使い方は変わりません。

- `Tree`の項目を入れ子にせず、見えている項目を1つの平らな一覧で描くようにしました。階層は`aria-level`、兄弟の中の位置は`aria-posinset`と`aria-setsize`で伝えます。これまでは開いた親の`treeitem`が子の`group`まで含んでいたので、axe-core 4.14から既定で有効になった`label-content-name-mismatch`が、子の項目の文字も親のラベルに数えて違反にしていました。`role="group"`は描かなくなったので、テストで`group`を引いている場合は`aria-level`で確かめてください。

### Patch Changes

- peerの`zod`の下限を`^4.4.3`から`^4.6.6`に上げました。4.6.5以前の`zod`は、大きな配列を渡されると要素ごとの検証エラーをすべて積み上げ、メモリを使い果たすおそれがあります（[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)）。フォームの送信やURLのように外から来た値をスキーマで検証するので、修正の入った4.6.6を下限にしました。

## 2.1.0

### Minor Changes

- 色を選ぶ `ColorPicker` を追加しました。値は `#rrggbb` で、`name` を持つテキスト欄が値を運ぶので、ほかの欄と同じく送信・reset・変更の有無の判定に乗ります。色相・彩度・明度のつまみ（ネイティブの `<input type="range">`）と、名前付きの見本（`swatches`、`aria-pressed` のボタン）は欄に書き込み、打ち込んだときと同じく `input` イベントで知らせます。欄の横の色はネイティブの `<input type="color">` で、押すとブラウザの色選びが開き、選んだ色は同じように欄に書き込まれます（`name` を持たないので、送られるのは欄の値だけです）。打っている間は 6 桁そろって初めて色として知らせ、離れるときと Enter で小文字の `#rrggbb` にそろえます（3 桁の `#f80` はそこで広げます）。`@k8ordo/form` の `formFields` が導いた属性はそのまま広げられ、スキーマの `.regex()` は `pattern` として既定のものを置き換えます。つまみの名前に辞書の `colorPickerHue` / `colorPickerSaturation` / `colorPickerLightness`、見本のまとまりに `colorPickerSwatches`、欄の横の色に `colorPickerOpen` を足しました。json-render と OpenUI のカタログにも載せました。

- `Button` / `IconButton` の `renderItem` が、既定の `<button>` に渡すのと同じ props を丸ごと受け取るようになりました。

  これまで `renderItem` に渡していたのは `className` と `children`（`IconButton` はさらに `aria-label` と `triggerProps`）だけで、`ref`・`disabled`・クリックハンドラ・保留中のスピナー・`aria-*` / `data-*` などの受け取った属性は捨てられていました。そのため `<Button renderItem={...} onClick={...} disabled>` は、`onClick` も `onAction` も発火せず無効にもならない要素を、警告なしに描画していました。`className` / `style` を全コンポーネントで受け取らない以上 `renderItem` が唯一の逃げ道なので、ここが欠けていると回避手段がありません。

  - `renderItem` と既定の要素に**同じオブジェクト**を渡すようにし、両者がずれない形にしました。
  - 束の中身は `className`（無効時のスタイルを含む）・`children`（保留中はスピナー入り）・`ref`・`type`・`disabled`・`aria-disabled`・`aria-busy`・`onClick`・その他の受け取った属性です。
  - `<a>` などにも展開できるよう、ハンドラと `ref` の要素型を `HTMLElement` にしました。`<button>` 専用の `disabled` / `type` だけ分割代入で外してから展開してください。無効状態は同梱の `aria-disabled` で表せ、`onClick` は無効なら `preventDefault()` して何もしないので、無効なリンクは遷移しません。
  - `IconButton` は tooltip の配線を引き続き `triggerProps` にまとめます。合成済みの `ref` と、利用者が渡した `onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur` もそこに連結されるようになりました（これまでは `renderItem` 経路で捨てられていました）。
  - 合成した `ref` は合成元が変わらない限り同じ関数を使い回します。毎レンダー作り直すと React が ref の付け外しを繰り返し、コールバック ref に副作用があると再実行されてしまうためです。
  - 型 `ButtonRenderItemProps` と `IconButtonRenderItemProps` を公開しました。

- 範囲を選ぶ `RangeSlider` を追加しました。2 つのつまみはそれぞれ本物の `<input type="range">` で、`name` の組で 2 つの欄として送られ、互いを越えません（WAI-ARIA の multi-thumb slider）。非制御のときは値を DOM に持つので、フォームの reset と変更の有無の判定がそのまま効きます。`Progress` は `value` を省くと進み具合の分からない表示（帯が行き来する。動きを減らす設定では明滅だけ）になり、`max` は省略時 100 になりました。どちらも json-render と OpenUI のカタログに載っています。

- 組み込みの文言を `@k8ordo/i18n` の今のロケールから読むようにした（破壊的変更）。

  - `@k8ordo/i18n` を peer dependency にした。コンポーネントは `currentLocale()` を読み、アプリが `defineLocales` で集合を定義していれば文言と同じロケール（URL が名指すもの、無ければ集合の既定）で描く。集合が無いアプリでは **英語** で描く（これまでの既定は日本語）。URL が `/ja/…` で始まっていても変わらないので、サーバーとブラウザで食い違わない。
  - `ja` と `en` の辞書はライブラリが持つ。それ以外のロケールや差し替えは、`@k8ordo/ui/i18n` の `registerMessages(locale, messages)` で登録する。登録する辞書は `Messages` のキーをすべて持つ（`UIProvider` の `messages` と違い、足りないキーを組み込みの辞書で補わない）。登録した辞書は組み込みより優先され、`en-US` のような地域つきのタグは言語（`en`）の辞書を読む。登録も組み込みも無いロケールで描くと、登録を促すエラーを投げる。
  - `UIProvider` の `messages`、`@k8ordo/ui/i18n` の `useMessages`、ルートからの `Messages` 型の export を削除した。`Messages` 型は `@k8ordo/ui/i18n` から import する。`UIProvider` は Toast のために残る。`useMessages()` の代わりに、hook ではない `getMessages()` を `@k8ordo/ui/i18n` から使う。
  - 文言のためだけに Client Component だった `Spinner`・`Breadcrumb`・`Code`・`Alert`・`Reasoning`・`ToolInvocation` から `'use client'` を外し、Server Component から描けるようにした。

  移行: `UIProvider` から `messages` を外す。日本語で描いていたアプリは `@k8ordo/i18n` でロケール集合（日本語だけなら `ja` 1 つ）を定義し、そのモジュールをサーバーの描画とブラウザの両方で読み込まれる場所から import する。`messages` に渡していた辞書は `registerMessages` で登録する。一部のキーだけを渡していた場合は、組み込みの辞書に重ねて `registerMessages('ja', { ...ja, close: '閉じる（Esc）' })` のように登録する。`useMessages()` は `getMessages()` に置き換え、ルートから import していた `Messages` 型は `@k8ordo/ui/i18n` から import する。

- 生成 UI アダプタが LLM に渡す文言を、すべて英語にしました。json-render のカタログと OpenUI の定義にある部品の説明、`uiRules`、スキーマの説明（`.describe()`）、`validateGeneratedSpec` が修復プロンプトに載せる `href` / `action` の検証メッセージが対象です。モデルが読むだけで利用者の画面には出ない文言なので、アプリのロケールとは切り離しました。

  - `catalog.prompt()` と `prompt()`（`@k8ordo/ui/openui/prompt`）が返すシステムプロンプトの文面が変わります。登録している部品・props・スキーマの形は変わらず、描画にも影響しません。
  - 日本語の説明に引かれて、モデルが UI の文言を日本語で書いていた場合は、英語に寄る可能性があります。UI の言語を固定したいときは `catalog.prompt({ customRules: [...uiRules, 'Write all UI text in Japanese.'] })` や `prompt({ additionalRules: ['Write all UI text in Japanese.'] })` のように規則を足してください。
  - `validateGeneratedSpec` の `issues[].message` のうち、`href` / `action` の形式違反のメッセージも英語になりました。日本語の文言に一致させている処理があれば見直してください。

  あわせて `docs/references/generative-ui.md` に、カタログが扱う部品、意図的に外している export（`InView` / `Resize` / `UIProvider` / `PortalRootProvider` / `usePortalRoot` と `/ai` のチャット部品）とその理由、プロンプトの言語を固定する方法を書きました。

- `@k8ordo/ui/i18n` から `messageUsage` を export する。`Messages` のキーごとに、その文言を描く部品（またはパーツ。`Carousel.Slide` など）を並べた一覧で、辞書を足すときにキーがどこに出るかを確かめられる。

- `FileField.Dropzone` を追加しました。ドロップしたファイルは選んだときと同じく `multiple` / `maxFiles` に従って一覧と input に加わり（送信される）、`input` イベントでフォームに知らせます。中身を渡さないと組み込みの案内（`fileFieldDrop`）と「ファイルを選択」のボタンが入るので、キーボードでも選べます。フォルダーはドロップでは受けません。あわせて、`multiple` で選び直したときに前の回に選んだファイルが送信から漏れていたのを直しました。生成 UI の `FileField` は `dropzone` を受けます。

- 候補から 1 つを選ぶ `Combobox` を追加しました（WAI-ARIA の combobox、リストの自動補完と手動選択）。`value` / `onChange` は選んだ候補の `value` で、未選択は `''` です。`search` を渡すと、打った文字で候補を非同期に探します。打ち直すと前の問い合わせは `signal` で打ち切り、探している間は一覧を busy にし、失敗や 0 件は `comboboxFailed` / `comboboxEmpty` で知らせます。打ちかけで離れると選んだ候補の表示名に戻し、空にして離れると選択を外します。IME の変換中のキーは変換のものとして扱います。`name` があれば、`Autocomplete` と同じく見えない `<select>` で送るので、`required`・フォームのルール・reset・失敗後のフォーカスの移動がそのまま効きます。json-render と OpenUI のカタログにも、決まった候補を絞り込む形で載せました。あわせて `Autocomplete` は「決まった候補から複数を選ぶ」部品として docs の説明を書き分けました。

- 本文の中に置く注記の部品 `Callout` を追加する。`tone` と任意の `label`（本文の上の太字の 1 行）を取り、本文は `children` に書くので、段落・`Code`・リンクを入れられる。`Alert` と違ってライブリージョンではなく（`role="note"`）、ページの読み込みやクライアント側の遷移で差し込まれても、警告として読み上げられない。生成 UI のカタログ（json-render と OpenUI）にも、本文を `content` の文字列で受ける形で載せる。

- React 19.3 を前提にしました（peer は `react` / `react-dom` / `@types/react` / `@types/react-dom` とも `>=19.3.0`）。

  - `useClient` を削除しました。ブラウザでしか描けないコンポーネントは React 自身の `use(browser())`（`react-dom` の `browser`）を `<Suspense>` の下で呼んでください。サーバーは fallback を残し、ブラウザが hydrate 後に描きます。「mounted フラグ」も `typeof window` も要りません。
  - `Tabs` の選択を transition にし、パネルの入れ替わりを `<ViewTransition>` でクロスフェードするようにしました。suspend するパネルは用意できるまで今のパネルが残ります。
  - `PortalRootProvider` を Context そのものにしました。`<PortalRootProvider value={ref}>` と書く点は同じですが、`value` は必須です。
  - `Form` が `ref` を受け取るようになり、`@k8ordo/form` の `form.props` をそのまま広げられます。
  - スタイルシートに、`prefers-reduced-motion` で View Transition のアニメーション（Tabs のパネル、ルーターのページ切替）を止める規則を足しました。

- `Textarea` の `autoResize` と `PromptInput.Textarea` の高さ追従を、JS の実測から CSS の `field-sizing: content` に置き換えました。

  `scrollHeight` を測って `style.height` を書いていたのは、中身に合わせて伸びるフォームコントロールを CSS が持っていなかった頃の代用です。Baseline に入った今はブラウザの仕事なので、`value` の変化を待つエフェクトも、内部 ref と利用者の ref の合成も要らなくなりました。

  **`autoResize` を付けたときだけ `rows` が効かなくなります。** `field-sizing: content` の下で `rows` は無視されるので、空の `<Textarea autoResize />` はこれまでの 2 行ではなく 1 行の高さから始まり、入力に応じて伸びます。`autoResize` を付けない `Textarea` の `rows` はこれまでどおりです。`PromptInput.Textarea` は元から `rows={1}` と `min-h` で高さを決めていたため見た目は変わりません。

  あわせて内部の作りを React Compiler の規則に合わせました。振る舞いは変わりません。

- 日付の入力部品を追加しました。`DateField` はブラウザの `<input type="date">` をそのまま使う入力欄で、`@k8ordo/form` が `z.iso.date()` から導いた `input` を `type` を抜かずに spread できます。`Calendar` は月の表から 1 日を選ぶ WAI-ARIA の date picker grid で、月名・曜日名・週の始まりは組み込みの文言と同じく `@k8ordo/i18n` の今のロケールに従い、「今日」を閲覧者のタイムゾーンで決めるためブラウザでだけ描きます。`DatePicker` は `DateField` とポップオーバーの `Calendar` の組み合わせで、カレンダーで選んだ日付は入力欄に書き込んで `input` イベントで知らせるので、フォームには打ち込んだときと同じく伝わります。3 部品とも json-render と OpenUI のカタログに載せました。

- `ScrollLinked` を削除しました。

  スクロール進捗バーは CSS のスクロール駆動アニメーション（`animation-timeline: scroll()`）で描いていましたが、これは Baseline に入っておらず（Firefox が未対応）、未対応ブラウザ向けに scroll リスナーと `ResizeObserver` で同じ見た目を再現する分岐を持っていました。Baseline に入っていない機能を、対応ブラウザでだけ効く磨きとしても使わず、機能判定で分岐するコードも置かない、という方針に合わせて部品ごと外します。

  `ScrollLinked` の export、json-render のカタログと OpenUI のライブラリの `ScrollLinked` 項目、スタイルシートの `.ao-scroll-progress` を削除しました。生成 UI のシステムプロンプトからもこの部品が消えます。

- OS で選ぶ `prefers-contrast: more` と `forced-colors: active` に、トークンと部品が従うようにしました。どちらも OS の設定なので、アプリが切り替えたり保存したりするものはありません（`@k8ordo/color-scheme` は変わりません）。

  - **高コントラスト（`prefers-contrast: more`）**: 文字と線のトークンを、ライトでもダークでも地の色から一段遠ざけます。ページ・カード・各ステータスの地の上の文字は AAA に、線は 3:1 以上になります。ダークでは `bg-emphasize` と `primary-bg*` / `secondary-bg*` も一段暗くします。値の一覧は `docs/references/color.md` にあります。
  - **影だけで縁取っていた面に線**: `Card`（`shadow`）・`Modal` / `Drawer`・`Dialog`・`Alert` / `Toast`・ユーザーの `Message`、`Switch` の軌道とつまみ、`Slider` と `Progress` の軌道に、高コントラストと強制カラーのときだけ内側の線（`border-base`）を引きます。寸法は変わりません。
  - **強制カラーで崩れていた部品を直しました**: `Switch`・`Slider`・`Progress`・`Separator`・`Skeleton` は消え、`Tabs` の選択中の印、`Radio` / `RadioCard` の点、`Autocomplete` の選択中の候補は見えず、`Code` の色見本は空になっていました。選択状態は `Highlight` / `CanvasText` で描き、色見本は実際の色のまま残します。
  - **未選択の `CheckboxCard` が、強制カラーでは選択済みに見えていたのを直しました**: チェックを透明色で隠していたため、強制カラーで塗られていました。
  - `DropdownMenu` と `ListBox` の項目、`Autocomplete` のハイライト中の候補は、高コントラストでは地の色に加えて 2px の線でフォーカスを示します。

  トークンを上書きしている場合、高コントラストの値は `@media (prefers-contrast: more)` の中の `:root` と `.dark` で再定義してください。ライブラリの高コントラストの規則は `:root` と同じ詳細度なので、あとから読み込む `:root` の上書きがこれまでどおり勝ちます。

- AI チャットの部品に、ツールの承認・添付・出典・メッセージの操作を足しました。

  - `ToolInvocation` が `approval` と `onApprovalResponse` を受け、`approval-requested` のあいだ折りたたみの外に「拒否」「許可」を出します。答えは `{ id, approved }` で届くので、AI SDK の `addToolApprovalResponse` をそのまま渡せます。自動の承認（`isAutomatic`）にはボタンを出しません。
  - **破壊的変更**: `ToolInvocation` の `deniedReason` と、`mapMessageParts` が返す tool パートの `deniedReason` を消しました。拒否の理由は `approval.reason` から読みます。tool パートは `approval` をそのまま持つので、`approval={part.approval}` と渡してください。
  - `mapMessageParts` が file・source（`source-url` / `source-document`）・data パーツも返すようになりました。
  - `Attachment`（`List` / `Item`）と `Source`（`List` / `Item`）を足しました。`Source.Item` は http(s) の URL だけをリンクにします。
  - `PromptInput.Root` に `accept` を渡すと、`PromptInput.Attach` の選択・ドロップ・貼り付けで添付を受け付けます（`maxFiles` で上限）。待機中の添付は `PromptInput.Attachments` に並び、`onSubmit` の第 2 引数に `FileList` で届きます。本文が空でも添付があれば送れます。
  - **破壊的変更**: `Message.Root` が `avatar` を受け、子要素をアバターの隣に縦に積むようになりました。アバターを子として渡していた場合は `avatar` に移してください（子のままだと本文の上に積まれます）。
  - `Message.Actions` と、その中に置く `Message.Copy` / `Message.Regenerate` / `Message.Feedback` / `Message.Action` を足しました。`Message.Copy` はアイコンだけの `CopyButton` で、文言も `CopyButton` のもの（`copy` / `copied` / `copyFailed`）を使います。
  - 型 `ToolApproval` / `ToolApprovalResponse` / `MessageFeedback` を `@k8ordo/ui/ai` から export します（前の 2 つは `@k8ordo/ui/ai-sdk` からも）。
  - 辞書（`Messages`）に `attach` / `attachments` / `attachmentRemove` / `attachmentImage` / `sources` / `messageActions` / `regenerate` / `feedbackPositive` / `feedbackNegative` / `toolApprovalRequest` / `toolApprove` / `toolDeny` を足しました。
  - `ToolInvocation`（client なのは承認のバーだけ）・`Attachment`・`Source` は Server Component から描けます。

- `@k8ordo/form` の `formFields` が導いた属性を、すべてのフィールドがそのまま受けるようになりました。`<TextField {...props} {...field.input} />` のように広げるだけで、送信・検証・エラー表示・リセットまで動きます。

  - `TextField` の `type` が `date` / `time` / `datetime-local` / `month` / `week` と任意の文字列を受けます。
  - `NumberField` は `min` / `max` に文字列、`step` に `'any'`、非制御の `defaultValue` に文字列を受け、範囲外の値を `setCustomValidity` でブラウザの検証に載せます（文言は新しい `numberFieldRangeUnderflow` / `numberFieldRangeOverflow`）。`precision` の既定は `step` の小数の桁数になり、`step="any"` では丸めません。矢印キーなどでコードから変えた値は `input` イベントで知らせます。
  - `Slider` も同じ属性を受けます。非制御の値を DOM に持つようになったので、form の reset で既定値に戻ります。
  - `Autocomplete` は選択を隠した `<select multiple>` で送ります。何も選んでいなくても name を持つ要素が残るので、`required` とフォームのルールが効き、送信に失敗したあとのフォーカスは入力欄へ移ります。選択の変化は `input` イベントで知らせます。
  - `RadioCard` が `required` を受けて各ラジオに渡します。
  - `RadioCard` / `CheckboxCard` / `CheckboxGroup` の非制御の選択が、form の reset と、送信に失敗した値のエコーに追従します。`CheckboxCard` / `CheckboxGroup` の `onChange` は、チェックされた値を文書順で渡すようになりました。
  - `Select` が、マウント後に変わった `defaultValue` に reset で戻ります。
  - `PasswordInput` の表示切り替えが、広げた `type` に上書きされなくなりました。`Textarea` は `type` を受けて捨てます。
  - `FileField` は一覧から外したファイルを、`onChange` を渡していなくても入力から外します。文字列の `defaultValue` を型として受けます。

- コマンドパレット `CommandPalette` を追加しました。`Modal` の中に検索欄とコマンドの一覧を置き、打った文字で `label` と `keywords` を大文字小文字を区別せずに絞り込みます。`↓` / `↑` で移り（端で反対側へ回る）、`Enter` かクリックでパレットを閉じてから項目の `onSelect` を呼びます。フォーカスは検索欄に置いたまま `aria-activedescendant` で項目を指します。同じ `group` の項目は見出し付きの group にまとめ、`shortcut` のキーは `Kbd` で添えます。開くたびに空の検索から始まり、開閉は `Modal` と同じく `isOpen` / `defaultOpen` / `onClose` です（⌘K などのキーはアプリが配線します）。辞書に `commandPalette` / `commandPaletteSearch` / `commandPaletteEmpty` を足しました。項目が関数を持つため、生成 UI のカタログには載せていません。

- 手順の段を並べる `Stepper` を追加しました。`<ol>` で段を並べ、済んだ段はチェックと読み上げ専用の「完了」（`stepperComplete`）で、いまの段は `aria-current="step"` で示します。横に並べると 1 行目は段の印とその間の線だけになり、各段の文言は印の下に、段ごとに同じ幅で折り返して置くので、文言が長くても幅が狭くても線は潰れません。`interactive` を付けると済んだ段がボタンになり、押すとその位置が `onChange` に届きます（先の段へは飛べません）。json-render と OpenUI のカタログにも表示専用として載せました。

- `CopyButton` を追加しました。テキストをクリップボードにコピーし、コピーしたことを見た目と読み上げの両方で伝えるボタンです。削除した `useClipboard` で組み立てていたコピーのボタンは、これに置き換えられます。

  ```tsx
  <CopyButton value={css} label="CSS をコピー" size="sm" />
  <CopyButton value={code} label="コードをコピー" iconOnly size="sm" />
  <CopyButton
    label="Markdown をコピー"
    value={async () => (await fetch(`/blog/${slug}.md`)).text()}
  />
  ```

  - 既定は outline の `Button` に `label` を文字で出します。`iconOnly` を付けると透明な `IconButton` になり、`label` はツールチップとアクセシブルネームになります。`label` を省くと辞書の `copy`（「コピー」/「Copy」）です。
  - 押すとアイコンが 2 秒間チェックに変わり（失敗したらエラーのアイコン）、隣のライブリージョン（`role="status"`）が `copied` / `copyFailed` を読み上げます。ボタンの名前は変えません。結果を見せている間に押し直しても、読み上げ直します。
  - `value` には関数も渡せ、`Promise` を返してもかまいません。押したときに呼び、`Promise` はそのまま `ClipboardItem` に渡すので、中身が後から届いても書き込みはクリックの中で始まります（Safari は `await` の後に始めた書き込みを拒みます）。
  - 組み込みの文言に `copy` / `copied` / `copyFailed` を足しました。
  - json-render のカタログと OpenUI のライブラリにも `CopyButton` を載せました（`value` / `label` / `iconOnly` / `size`）。

- `Modal` と、その上に作られている `Drawer` の退場アニメーションをなくしました。閉じると、どのブラウザでもその場で消えます。開くときのフェード・拡大・スライドはこれまでどおりです。

  退場のアニメーションは、閉じた `<dialog>` を 0.2 秒 top layer に留める `overlay` の transition（`transition-behavior: allow-discrete`）に頼っていました。`overlay` は Chromium にしかなく、Safari と Firefox では `@supports not (overlay: auto)` で退場を即時に切り替えていました。Baseline に入っていない機能を、対応ブラウザでだけ効く磨きとしても使わず、機能判定で分岐するコードも置かない、という方針に合わせて外します。

  スタイルシートからは、`.ao-modal` の `display` と `overlay` の transition、`@supports not (overlay: auto)` の規則が消えます。`styles.css` の `.ao-modal` を上書きして退場を作っていた場合は、その上書きも見直してください。

- `@k8ordo/ui/props.json` の各部品に `category` を足す。部品を置いている `src/components/` の下のフォルダ名（`form`・`data-display` など）で、README と `docs/references/components.md` はこの分類で部品を並べる。

- `Toolbar` と `ContextMenu` を追加しました。`Toolbar` は WAI-ARIA の toolbar で、Tab で入れるのは 1 つだけ、中は矢印キー（縦書きでは見た目の向きに合わせた対）と `Home` / `End` で移り、無効な項目は飛ばします。各項目は `Toolbar.Item` の `renderItem` が渡す `ref` / `tabIndex` / `onFocus` を `Button` や `IconButton` に広げて作り、`aria-pressed` の項目は地を濃くして見せます。`ContextMenu` は右クリック（または Shift+F10・コンテキストメニューキー）した位置に開くメニューで、中身は `DropdownMenu` と同じ `Content` / `Item` / `SubMenu` を使います。閉じると開く前にいた要素へフォーカスを戻します。`Toolbar` は json-render と OpenUI のカタログに載せ、`ContextMenu` は右クリックという見えない操作で開くので理由付きで除外しました。

- 生成 UI の peer 範囲に 0.x の上限を付けた。`@json-render/core` / `@json-render/react` は `>=0.21.0 <0.22.0`、`@openuidev/lang-core` / `@openuidev/react-lang` は `>=0.3.0 <0.4.0`。0.x の minor は破壊的リリースなので、検証していないバージョンまで互換を約束するのをやめた。下限も検証している minor に上げている（json-render の 0.19・0.20 系と OpenUI の 0.2 系はもう検証していない）。json-render の 0.19・0.20 系を使っている場合は 0.21 系に、OpenUI の 0.2 系を使っている場合は両方を 0.3 系に上げる。あわせて json-render の未知 prop 検出を `instanceof z.ZodObject` から `.shape` の有無に変え、利用者の zod が別コピーになっても検出が止まらないようにした。

  あわせて README と `docs/references/generative-ui.md` の install 手順を直した。`@openuidev/lang-core` は `@k8ordo/ui/openui/prompt` だけでなく `@k8ordo/ui/openui` 本体が直接 import しているので、`@openuidev/react-lang` と一緒に入れる必要がある（pnpm は依存の依存を解決してくれない）。

- `Carousel.Root` / `Carousel.Slide` を追加しました。スクロールスナップで 1 枚ずつ止まるスライドと、前後のボタンです。

  - トラックはスクロール領域そのもので、ボタンのほかにトラックパッドやスワイプ、フォーカスしたトラックの矢印キーでも送れます。ボタンは押した回数だけ送り、端では無効になります。
  - `slideSize`（`full` / `lg` / `md` / `sm`）で 1 枚がトラックに占める幅を決めます。1 枚ずつ見せる `full` と `lg` では「2 / 4」のように位置を示します。
  - 領域とスライドは `aria-roledescription` でカルーセル・スライドと読み上げられます。スライドに題があれば `label` を渡します。
  - 書字方向に従い、縦書きでは縦に流れます。自動再生はありません。
  - 文言辞書に `carousel` / `carouselSlide` / `carouselPrevious` / `carouselNext` を加えました。

- 生成 UI のカタログ（json-render と OpenUI）に `Kbd`・`EmptyState`・`Carousel` を加えました。`Kbd` は `keys: string[]` でショートカットの組み合わせを 1 項目で置き、`Carousel` は子の 1 つずつが 1 枚のスライドになるコンテナです。

- `Checkbox` に `indeterminate`（一部だけ選ばれている途中の状態。input の `indeterminate` に写るので、読み上げでも一部選択になる）と `labelHidden`（`label` を読み上げだけに渡し、描かない）を、`Table.Row` に `selected`（選ばれている行を地の色で示す）を足しました。

- `CodeBlock` を `@k8ordo/ui/code-block` に追加しました。サーバーで shiki を使ってハイライトし、コピーボタンを添えて描く async の Server Component です。

  - `server-only` を import しているので、shiki はブラウザに届かず、Client Component から読み込むとビルドが止まります。コピーボタンだけがクライアントのモジュールです。
  - 見た目は k8o のブログのコードブロックと同じです。面は `bg-surface` の 1 枚で外枠の線は無く、言語名（`title` があればファイル名）を面の上に小さなラベルで出し、コピーボタンを右上に重ねます。構文の色はライトが shiki の `one-light`、ダークが `plastic` をそのまま使い、`light-dark()` で書くので `.dark` が切り替える `color-scheme` に追従します。コメントなど、面に対して 4.5:1 に届かない色もブログと同じです。
  - `lang` は shiki が同梱する言語名で、知らない名前は色を付けずに描きます（Markdown のフェンスの言語名をそのまま渡せます）。`title` を渡すとラベルに表示します（figure の figcaption）。
  - `marks` で行に `highlight` / `add`（`＋`）/ `remove`（`－`）の印（状態のトークンの帯と地）を、`callouts` で行の直後に注記（配列なら複数、その行の字下げに揃う）を付けます。注記はブログと同じく、指す行を上向きの三角で指す `fg-info` の吹き出しで、指された行には info の帯が付きます。コピーされるのは `code` そのものです。
  - `shiki` と `server-only` を `dependencies` に加えました（shiki のオブジェクトはパッケージの外に出ないので、peer にはしていません）。
  - 文言辞書に `codeBlockCopy` を加えました（コピーの結果の読み上げは `CopyButton` と同じ `copied` / `copyFailed`）。

- `DataTable` を追加しました。並べ替え・行の選択・列の表示切り替えができる表で、状態はすべて呼び出し側が持つ制御型です（`sort` / `onSortChange`、`selectedIds` / `onSelectedIdsChange`、`hiddenColumnIds` / `onHiddenColumnIdsChange`）。

  - 並べ替えの状態を受けても自分では並べ替えず、`rows` を渡された順に描きます。サーバーで並べ替えるときも同じ部品で済み、`@k8ordo/state` の url スロットに置けば並べ替えとページをリンクで共有できます。
  - 機能は、その変化を受け取る関数を渡したときだけ現れます。並べ替えられる列の見出しは 昇順 → 降順 → なし と巡り、`aria-sort` を持ちます。
  - 見出しのチェックボックスは表示中の行をまとめて選び、一部だけのときは途中の状態を示します。最初の列を行の見出しにし、各行のチェックボックスはその見出しで名前が付きます。
  - `rows` が空のときは `emptyState` を列をまたぐ行に描きます。
  - 生成 UI のカタログ（json-render と OpenUI）に、並べ替えと選択を中で持つ自己完結の `DataTable` を加えました。
  - 文言辞書に `dataTableColumns` / `dataTableSelectAll` / `dataTableSelectRow` を加えました。

- `EmptyState` を追加しました。リストや表、検索結果が空のときに、タイトルと、あれば説明・アイコン・次の操作（`action`）を示します。表の中では、既存の `Table.EmptyState` をこの部品の上に作り直し、列をまたぐ行に同じ内容を描きます（`children` を受け取らなくなった破壊的変更は別項を参照）。

- ルートのエントリから helpers（`cn` / `chain` / `mergeProps` / `mergeRefs` / `createSafeContext`）を公開しなくなりました。いずれも UI コンポーネントライブラリ固有の理由を持たない汎用ユーティリティで、コンポーネントの内部実装として残します。

  - `cn`：`clsx` と `tailwind-merge` を直接使ってください。ui のコンポーネントは `className` を受け取らないので、`cn` が要るのは自分の要素だけです。
  - `chain`：受け取ったハンドラを順に呼ぶ関数を、その場で書いてください。
  - `mergeProps` / `mergeRefs`：render prop で受け取る props は、そのまま要素に展開してください。自分の ref と合わせるなら、ref コールバックの中で両方に代入してください。
  - `createSafeContext`：`createContext` と、Provider が無いときに throw する `use` のラッパーを自分で書いてください。

  型のリファレンスは `docs/references/helpers.md` から `docs/references/types.md` に移しました。docs サイトの `/ui/helpers` はなくなりました。

- ルートのエントリから hooks を公開しなくなりました。残る hook は、Provider と対になる `useToast` / `usePortalRoot` だけです（`@k8ordo/ui/i18n` の `useMessages` は、hook ではない `getMessages()` に置き換えました。別の changeset を参照）。

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

- `Kbd` を追加しました。キーボードのキーを 1 つ、キーキャップとして示します。同時に押すキーは 1 キーずつ並べます。`⌘` や `⇧` のような記号のキーには `label` を渡すと、見た目は記号のまま、読み上げには `label` が使われます。

- 部品を Tailwind CSS でなく CSS Modules で書くようにし、利用側に Tailwind を求めないようにする（破壊的変更）。

  - **スタイルの届き方**: `styles.css` はレイヤーの順（`@layer properties, theme, base, components, utilities;`）、トークン、リセット（Tailwind 4 の preflight と同じ中身）、ページ全体の既定だけを持つ。部品の見た目は部品ごとの CSS が持ち、部品の JS がそれを import する。使った部品の CSS だけがアプリに入る。部品の CSS はすべて `components` レイヤーにあるので、レイヤー外の利用側の CSS と Tailwind のユーティリティが部品に勝つ。利用側のバンドラは、パッケージの JS からの CSS の import を扱える必要がある（Vite、Next.js、webpack、Rspack はそのまま扱える）。
  - **トークンの名前**: トークンを `@theme inline` から素の `:root` に移し、分類を接頭辞にした名前に変えた。古い名前の別名は無い。`--fg-*` / `--bg-*` / `--border-*` / `--primary-*` / `--secondary-*` / `--group-*` は `--color-fg-*` などに、`--back-drop` は `--color-back-drop` に、`--text-*` は `--font-size-*` に、`--text-*--line-height` と `--leading-*` は `--line-height-*` に、`--tracking-*` は `--letter-spacing-*` に、`--z-*` は `--z-index-*` に、`--inset-shadow-*` は `--shadow-inset-*` になった。利用側が定義するフォントの変数も `--font-noto-sans-jp` / `--font-m-plus-2` から `--font-family-noto-sans-jp` / `--font-family-m-plus-2` に変わる。新しく `--radius-full`、`--font-family-sans` / `--font-family-mono`、`--shadow-ring-*`（フォーカスの輪）、`--duration-*`、`--easing-*`（Tailwind の曲線）、`--z-index-raised`、em を基準にした `--spacing-em` などを足した。
  - **`tailwind.css`**: Tailwind 4 の利用者向けの橋として残す。これまでと同じユーティリティ名（`bg-bg-base`、`text-md`、`leading-loose`、`dark:`、`vertical:` など）が新しいトークンを読む。テーマは `reference` なので、変数を自分では宣言しない。`@source` で ui の部品を走査することはもう無い。橋は `@import 'tailwindcss'` を含まなくなり、利用側の Tailwind の後に読み込む。`tailwindcss` は peer から外した（`@k8ordo/ui` は Tailwind に依存しない）。
  - **`cn` と tailwind-merge**: 内部の `cn` をやめ、依存から tailwind-merge を外した。部品は今までどおり `className` を受け取らない。variant は要素自身の修飾クラスで表すので、`renderItem` / `renderAnchor` の束から `className` だけを受け取る使い方はそのまま同じ見た目になる。クラス名は CSS Modules のハッシュになり、`.ao-code-block` や `.ao-prose` などの決まった名前は無くなった。
  - **`@k8ordo/ui/tokens`**: `tokens` は DTCG の resolver 文書（Resolver Module 2025.10）になった。`:root` のトークンが set、`.dark` と `prefers-contrast: more` が modifier になる。`tokens.theme` / `tokens.vars` / `tokens.refs`、`meta`、キーの和集合の型は無くなった。
  - **縦書き**: `writing-v` / `writing-h` は `styles.css` のクラスとして残り、`writing-mode` と一緒にカスタムプロパティ `--writing`（`vertical` / `horizontal`）を設定する。自分の CSS では `@container style(--writing: vertical)` で縦書きに合わせる。`vertical:` の変種は `tailwind.css` にだけある。
  - **`Response`**: streamdown が要素に付ける `data-streamdown` で見た目を当てるので、Tailwind も `@source` も要らない。確認ダイアログと表の全画面は `Response` の中に出す（`portal` は部品が持つ）。`streamdown/styles.css` は streamdown の `animated` を使うときだけ要る。
  - CSS は `@scope`、style クエリ、`light-dark()`、`:dir()`、入れ子を使う。利用側のバンドラの CSS の target は新しく保つ。古い target では Lightning CSS が `:dir(rtl)` を `:lang()` の並びに書き換え、`dir` に従わなくなる。

  移行: `var(--fg-mute)` などトークンを直接読んでいる CSS は新しい名前に書き換える。Tailwind の利用者は `@import '@k8ordo/ui/tailwind.css';` の前に `@import 'tailwindcss';` を足す。フォントの変数を定義しているなら名前を変える。`@k8ordo/ui/tokens` を読んでいるなら DTCG の文書から値を取る。

  サイトは CSS Modules で書き直し、`better-css-modules check` を通す。トークンの名前の表示とテーマのページを新しい名前に合わせた。

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

  `Conversation` も内部でこの 2 つを使うようになりました。見た目と挙動は変わりません。

- OpenUI のコンテナを、互いに自由に入れ子にできるようにしました。

  これまで `Stack` / `Grid` の子には `Stack` / `Grid` / `Card` を置けず、`Card` / `Form` / `Modal` / `Dialog` / `Drawer` / `Popover` は `Stack` / `Grid` を子に持てても、どのコンポーネントの子にも挙がっていませんでした。プロンプトは `root = Stack(...)` を求めるので、この 6 つは LLM から使う場所がありませんでした。しかも `Stack` の説明は「入れ子のレイアウトは Card の中に Stack / Grid を置く」と、置けない Card を使うよう指示しており、プロンプト自身と矛盾していました。

  - コンテナ（`Stack` / `Grid` / `Card` / `Form` / `Modal` / `Dialog` / `Drawer` / `Popover`。今回加えた `Carousel` も同じ）の `children` に、葉のコンポーネントとすべてのコンテナを並べました。json-render と同じく、どの組み合わせでも入れ子にできます。
  - `prompt()` が生成するシグネチャが変わります。`Stack` / `Grid` の「直下に Stack/Grid/Card は置けない」という説明と、`Card` の「Stack や Grid も入れられる」という説明は消しました。
  - パーサは `children` に入るコンポーネントを検査しないので、描画の挙動は変わりません。

- `Prose` を追加しました。Markdown や MDX が描いた本文を包むと、ベースのスタイルがリセットした見出し・リスト・余白・強調の組版を、その中だけ戻します。

  - 日本語に合わせて、行間を広く（`leading-loose`）、見出しを詰め組み（`palt`）にし、日本語の `em` は傍点（それ以外の言語は斜体）にします。縦書きでは段落の頭を 1 字下げます。
  - 組版を効かせるのはクラスの無い素の要素だけです。部品（どれもクラスを持つ）は自分の見た目のまま、前後の間だけが本文と同じに空きます。remark-gfm が脚注とタスクリストに付けるクラスは本文の一部として扱います。

- `Radio` が `required` を受け取るようになりました。各 `<input type="radio">` に渡るので、どれも選ばれていないあいだはグループが `valueMissing` になり、フォームは送信されません。

  これまでは props の型に `required` がなく、無理に渡しても `role="radiogroup"` の `div` に乗るだけで、未選択でも `form.checkValidity()` が `true` を返していました。`@k8ordo/form` の `form.field(path).input`（`{ name, required, defaultValue }`）をそのまま広げられます。

- `SideNav.Sub` を足した。`SideNav.Group` の中に置く、開閉できる段で、サイドナビを木にできる。`<details>` なので JavaScript が無くても開閉し、今のページを含む段は `defaultOpen` で開いておく。

- `SideNav` と `TableOfContents` を追加しました。

  - `SideNav.Root` / `SideNav.Group` / `SideNav.Link`: 見出しごとにまとめたリンクで、今のページ（`current`）を傍線と `aria-current="page"` で示すサイドナビです。ルーターのリンクへは `renderAnchor` で要素ごと差し替えます（束には `href`・`className`・`children`・`aria-current` と渡した属性がすべて入ります）。Server Component から描けます。
  - `TableOfContents`: `{ id, label, children? }` の木で渡した見出しの目次で、今読んでいる見出しを `aria-current="location"` で示します。見出しの `scroll-margin-block-start` を読み取り位置にするので、目次から飛んだ見出しがそのまま今の見出しになり、文書の終わりでは最後の見出しになります。縦書きの文書では右から左へ読む向きで決めます。
  - 生成 UI のカタログ（json-render と OpenUI）に `SideNav` を加えました。`TableOfContents` は spec の見出しが id を持たないので載せていません。
  - 文言辞書に `tableOfContents` を加えました。

- `Table.EmptyState` を `EmptyState` の上に作り直しました。`children` を受け取らなくなり、`colSpan` に加えて `EmptyState` と同じ `title`（必須）・`description`・`icon`・`action` を受け取ります。空の表の見た目は `EmptyState` と同じになります。

  ```tsx
  // Before
  <Table.EmptyState colSpan={3}>まだ登録がありません</Table.EmptyState>
  // After
  <Table.EmptyState colSpan={3} title="まだ登録がありません" />
  ```

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

- `Tree` を追加しました。枝を開閉できる階層（ファイルとフォルダー、目次の木など）で、WAI-ARIA の tree のキーボード操作に従います。

  - 項目は `{ id, label, icon?, children? }` の木で渡します。開いている枝（`expandedIds` / `defaultExpandedIds` / `onExpandedChange`）と選択（`selectedId` / `defaultSelectedId` / `onChange`）は、制御でも非制御でも使えます。
  - 上下で見えている項目を移り、右で枝を開いて最初の子へ、左で枝を閉じて親へ戻ります。Home / End、Enter / Space での選択、先頭の文字での移動もできます。Tab で入るのは 1 つだけ（roving tabindex）です。
  - 縦書きでは項目が右から左へ並ぶので、左右で項目を移り、上下で開閉します。
  - 生成 UI のカタログ（json-render と OpenUI）に、平らな一覧（親は `parentId` で指す）で受ける `Tree` を加えました。

- 2 枚のパネルの大きさを仕切りで分ける `ResizablePanels`（`Root` / `Panel` / `Handle`）を追加しました。WAI-ARIA の window splitter にならい、仕切りはフォーカスできる `separator` で、値は 1 枚目の割合（%）、`aria-controls` は 1 枚目を指します。矢印キーは画面上の向きのとおりに仕切りを動かし（右から左の言語や縦書きでも同じ）、`Home` / `End` で `min` / `max` の端へ移ります。ドラッグはつかんだ点へ跳ばずに動かした分だけ広がります。仕切りの既定の名前に辞書の `resizablePanelsHandle` を足しました。高さの決まった親を分ける枠組みなので、生成 UI のカタログには載せていません。

### Patch Changes

- `Button` / `IconButton` の `onAction` が保留中のあいだ、押したボタンからフォーカスを外さないようにする。

  これまでは保留中にネイティブの `disabled` を付けていたので、フォーカスを持ったボタンが無効になり、Chromium は描画の更新でフォーカスを `body` へ落としていた。キーボードで押した人は、処理が 1 フレームでも描画をまたぐと居場所を見失っていた。`type="submit"` の `Button` がフォームのアクションを待つあいだも同じだった。

  - 保留中（`onAction` が返した Promise と、`type="submit"` のときのフォームのアクション）は `aria-busy` と `aria-disabled` を立て、押されてもクリックのハンドラが何もしない。ネイティブの `disabled` は付けないので、フォーカスはボタンに残る。入力欄の Enter による暗黙の送信も、既定のボタンへの click をハンドラが止めるので二重に送らない。
  - 利用者が渡した `disabled` は、これまでどおりネイティブの `disabled` にする。
  - `renderItem` の束（`ButtonRenderItemProps` / `IconButtonRenderItemProps`）の `disabled` は、利用者が渡した `disabled` だけを表すようになった。保留中も `false` のままで、保留は `aria-disabled` と `aria-busy` で表す。束を `<button>` にそのまま展開していれば同じ振る舞いになる。保留中の見た目を `disabled` から作っていたなら、`aria-disabled` を見るように変える。

- `Tabs` の選択インジケータから、anchor positioning 未対応ブラウザ向けのフォールバック（選択中のタブに描く静的な下線）を削除しました。anchor positioning は Chrome 125・Safari 26・Firefox 147 で出そろって Baseline newly available になったため、対応ブラウザでの見た目と挙動は変わりません。

- `Calendar`（`DatePicker`が開くものも）を開いたまま日付が変わったら、今日の印を次の日へ移すようにしました。これまでは描き直しのたびに時計を読んでいたので、日付が変わっても何か操作するまで前の日が今日のままでした。

- `light:` バリアントが `.light` クラスの下で効く定義になっており、`<html>` に `dark` しか付けない `@k8ordo/color-scheme` と組み合わせると一度も効かなかったのを直しました。`light:` は `.dark` の下ではないところで効きます。`.light` クラスはもう読みません。

- `CheckboxGroup` の外で使う `Checkbox` でも、`itemValue` を input の `value` 属性として出すようにしました。

  これまで単独の `Checkbox` は `itemValue` を受け取っても捨てており、`value` は型から外したうえで上書きしていたので、送る文字列を変える手段がありませんでした。チェックした箱は常にブラウザ既定の `on` を送るため、`z.stringbool({ truthy: ['yes'] })` のように特定の綴りを読むスキーマや、`@k8ordo/state` が URL に書く `inStock=true` と食い違っていました。

  - `<Checkbox itemValue="true" name="inStock" … />` はチェック時に `inStock=true` を送ります。
  - `itemValue` を渡さなければこれまでどおり `value` 属性は出さず、`on` を送ります。
  - `CheckboxGroup` の中での挙動は変わりません。

- 同梱ドキュメントを実装に追従させました。

  - `references/color.md` のトークン表（fg / bg / border / primary / secondary）を `tokens.css` の値に合わせ、載っていなかった `bg-raised` / `bg-surface` / `group-*` / `back-drop` などを足しました。`typography.md` / `spatial-design.md` / `interaction-design.md` / `GUIDE.md` の、存在しない `font-normal` や食い違っていた既定値も直しています。
  - 改名前の prop 名（Card の `appearance`、Heading の `type` など）を今の名前にしました。
  - `@k8ordo/ui/tokens` / `@k8ordo/ui/props.json`、アイコン一覧を docs に載せました。
  - `props.json` と `components.md` の Props が、controlled / uncontrolled の union の片側しか載せず、`defaultValue` などを `never` と出していたのを直しました。`components.md` の Props は、残りの属性をどの要素へ転送するかも書くようになりました。
  - README の `ToolInvocation` の state を 7 値にしました。

- 同梱ドキュメントの i18n の説明を、今の使い方だけにしました。`GUIDE.md` の「Migrating from 2.x」の節と、README・`llms.txt` からその節への案内を消しました。移行の手順は CHANGELOG にあります。あわせて、`references/types.md` のルートの型の表から、ルートが export していない `Messages` の行を消しました（`Messages` は `@k8ordo/ui/i18n` から import します）。

- ダークモードで、`primary-fg` / `secondary-fg` を `*-bg-emphasize` の上に置いたときのコントラストが 3.7:1 しかなく、大きい文字の AA しか満たしていなかったのを直しました。solid の `Button` と `IconButton`（primary / secondary）の hover と active がこの組み合わせです。

  ダークの `primary-bg` / `secondary-bg` を 900、`primary-bg-emphasize` / `secondary-bg-emphasize` を 800 にし、それぞれ 1 段暗くしました（`*-bg-mute` と `*-bg` は同じ 900 になります）。文字の色は変えていません。これで `docs/references/color.md` のコントラストの表にある組み合わせは、ライトでもダークでも通常の文字で AA 以上になります。ダークの primary / secondary の solid ボタンや、チェック済みの `Checkbox`・`Switch` の地は少し暗く見えます。

- `Tabs` のキー操作を WAI-ARIA の tabs パターンに合わせました。`dir="rtl"` の中では左右の矢印キーを入れ替え（これまでは向きが逆でした）、`Home` / `End` で最初と最後のタブへ移ります。扱ったキーの既定の動作（ページのスクロール）は止めます。

- `ToolInvocation` の承認で「許可」「拒否」を押したあと、答えを送っている間にフォーカスが `body` へ落ちることがあったのを直しました。答えている間のボタンは `disabled` ではなく `aria-disabled` になり、押したボタンはフォーカスを持ったまま、二度目の答えを受け付けません。問いが消えると、これまでどおりフォーカスはツールの見出しへ移ります。

- ベーススタイルから `text-spacing-trim` を外しました。`text-spacing-trim` は Chrome だけが実装していて Baseline に入っておらず、対応するブラウザでだけ効く仕上げとしても使わない方針に合わせています。

  Chrome では、行頭に来た始め括弧（「『（ など）が、段落の頭でも折り返した行の頭でも半角幅に詰まらず全角幅になります。`pre` の中では、隣り合う約物（`」「` など）の間の空きがブラウザ既定どおり詰まります。Firefox と Safari の見た目は変わりません。和欧間の空き（`text-autospace`）はそのまま効きます。

- `PromptInput` のドロップを `FileField.Dropzone` にそろえました。フォルダーを落としても添付しません（これまでは `accept` に当たると、読めないフォルダーが添付に入りました）。ドラッグの出入りの数え上げを 0 で止め、入った数より多い `dragleave` が届いたあとにハイライトが消えずに残ることがなくなりました。

- `DropdownMenu`と`ContextMenu`の矢印キーの移動を、描かれた項目の並びで決めるようにしました。これまでは`Content`が直下の子を数えて順番を注入していたので、項目を自前の部品にまとめたりFragmentで包んだりすると、その中の項目はどれも先頭と同じ扱いになり、矢印キーで移れませんでした。

- `Checkbox`・`Radio`・`Switch`・`Slider`・`RangeSlider`・`Select` は、フォームの送信中に `disabled` ではなく `aria-disabled` になります。Enter で送ると、Chromium と WebKit がフォーカスを body へ落としていました。送信中は値を変える操作（クリック、値を動かすキー、`Slider`・`RangeSlider`・`Select` ではポインタも）を受け付けません。

- `NumberField` で負の小数（`-1.5` など）を入れると、blur で値が正規化された後も入力要素が無効（`patternMismatch`）のままになり、`novalidate` の無いフォームから送信できなかったのを直しました。

  入力要素に付いていた `pattern="[0-9]*(.[0-9]+)?"` を外しました。`.` がエスケープされておらず、たまたま `-5` や `1,000`、`1a5` は通す一方で、`-1.5` や `1.` は弾いていました。blur 後の値は常にコンポーネント自身が書き戻す数値の文字列なので、正しい正規表現に直しても検証するものが残りません。数字キーボードは引き続き `inputMode="decimal"` で出ます。

  `@k8ordo/form` のフォームに置いた場合、この `pattern` はスキーマから導かれたものではないので対応する文言が無く、`error` は空のまま、ブラウザ既定の文言で送信が止まっていました。

- `NumberField` が `readOnly` を無視していたのと、フォームの送信中も矢印キーで値が変わっていたのを直しました。

  - `readOnly` を渡しても、入力要素には送信中かどうかだけで決まる `readOnly` が上書きで付いていたため、送信中でなければ文字の入力も増減ボタンも矢印キーも効いていました。`readOnly` のあいだは入力要素が読み取り専用になり、増減ボタンは無効になり、矢印キーでも値が変わりません。
  - フォームの送信中（`useFormStatus` の `pending`）に止まっていたのは増減ボタンだけで、ArrowUp / ArrowDown では値が変わっていました。送信中はキー操作でも値が変わりません。

- `NumberField` が、フォーカスを外したときに入力を `precision` の桁数に丸めた値を `onChange` と `aria-valuenow` に渡すようになりました。

  これまでは表示だけが丸められ、値には入力した小数の桁がそのまま残っていました。たとえば `precision` が `0`（既定）のときに `2.5` と入力すると、表示は `3` なのに `onChange` には `2.5` が届き、`aria-valuenow` も `2.5` でした。表示・`aria-valuenow`・`onChange` の値が一致するようになります。

- 色が移り変わる部品のイージングを、ガイドが推奨する `transition-colors duration-150 ease-out` にそろえる。

  これまでは AI チャットの部品と `SideNav`・`TableOfContents` だけが `ease-out`（`cubic-bezier(0, 0, 0.2, 1)`）で、`Button`・`IconButton`・`Checkbox`・`Radio`・`Switch`・`Tabs`・`Anchor`・`Breadcrumb`・`ListBox` などほかの 23 の部品は Tailwind の既定（`cubic-bezier(0.4, 0, 0.2, 1)`）で色を変えていた。長さは 150ms のままで、変わるのは加速の付き方だけ。

  `docs/` のコード例（`interaction-design.md`・`color.md`・`GUIDE.md`）も、素の `transition-colors` から表と同じ形に直した。

- インソーステスト（import.meta.vitest ブロック）を dist から落とし、残っていないことを check:package で検査する

- `FileField` の `File[]` の `defaultValue` が、一覧に出るだけで送信されていなかったのを直しました。form の reset では、一覧と入力の両方が `defaultValue` に戻ります。`multiple`（または `webkitDirectory`）で選び直したときに入力へ書き戻した一覧は `input` イベントで知らせるので、`@k8ordo/form` などのフォームにも送る列全体が届きます。`onChange` には、新しく選んだ分やドロップした分だけでなく、一覧に並ぶファイル全体を渡します。

- `ResizablePanels`の仕切りの`aria-controls`は、1枚目のパネルが描かれた後に付くようになりました。サーバーのHTMLには含まれませんが、仕切りはhydrateするまで動かないので操作には影響しません。

- 高コントラストと強制カラーのときに付ける縁取りの指定（outline の色と内側への位置）が、ふだんの表示にも残っていたのを直しました。フォーカスできる要素を持たない `Modal` / `Drawer` では `<dialog>` 自身がフォーカスを受けますが、そのブラウザのフォーカスリングが灰色の細い線に塗り替えられていました。縁取りの指定はすべて高コントラストと強制カラーの中に置き、面そのものがフォーカスを受けている間は外します。

- `Stepper` を縦書き（`writing-v`）の中で正しく描くようにしました。段の間の線を物理の幅・高さで引いていたので、`horizontal` では線が消え、`vertical` では線が段の並びと直交していました。線を論理プロパティで引き、段の番号も横倒しにしません。

- 非制御の `Switch` で、フォームを reset したあとも reset 前の見た目と `aria-checked` が残る不具合を直しました。

  reset はブラウザが `checked` を初期値へ戻すだけで `change` を飛ばさないため、`input` はオフに戻っているのに、トラックの色・つまみの位置・`aria-checked="true"` がオンのまま残り、支援技術にもオンと伝わっていました。見た目を React の state ではなく `input` の `:checked` から引き、`aria-checked` は付けないようにしました（`role="switch"` を持つ checkbox の `input` は、ネイティブの `checked` がそのまま状態として公開されます）。reset ボタン、`form.reset()`、`@k8ordo/form` の `useForm`、React が action の成功後に行う自動リセットのどれでも、戻った `checked` がそのまま表示されます。

- `FileField.Dropzone` にドロップしたファイルを `accept` で選り分ける。ブラウザが `accept` を当てるのはファイル選択ダイアログだけで、ドロップで届いたファイルは素通しになるため、`accept="image/*"` の欄に落とした PDF が一覧にも送信にも入っていた。`<input accept>` と同じ規則（MIME の完全一致・`type/*`・拡張子。大文字小文字は区別しない）で照らし、当たらないファイルは加えない。当たるものが 1 つも無いドロップは、選んであったファイルを置き換えず、`onChange` も `input` イベントも出さない。

  サイトの FileField の説明も合わせた。

- ダークモードで、スクロールバーやフォーム部品、`<dialog>` の既定の色といったブラウザ自身の描画が明るいまま残っていたのを直しました。ベースレイヤーで CSS の `color-scheme` プロパティを、トークンと同じく `dark` クラスに合わせて設定します（`:root` は `light`、`.dark` の下は `dark`）。`prefers-color-scheme` ではなくクラスに従うので、OS がダークでも `.dark` が無ければ明るいままです。`@layer base` の中にあるので、レイヤー外の `color-scheme` の指定で上書きできます。

- `Tabs` のキー操作で、フォーカスをキーを押したその場で移すようにしました。これまではパネルの入れ替わり（`<ViewTransition>` のクロスフェード）が終わるまでフォーカスが前のタブに残り、その間に続けて押したキーは前のタブから数えられて取りこぼされていました。

- `InView` で、見えていた子を外しても `onChange(false)` が呼ばれず、`true` のまま残ることがあったのを直しました。

  React は Fragment の子が外れると、その子の `IntersectionObserver` の `unobserve` をペイント後まで遅らせ、「交差していない」という最後の通知が届くのを待ちます。ただ、ブラウザが混んでいるとそれより先に `unobserve` が走り、通知ごと失われることがあります。`InView` はその通知で外れた子を「交差中」から外していたため、外れた子が交差中のまま残り、ほかの子がどれも見えていなくても `true` のままでした。

  子が外れたことを React の `unobserve` の呼び出しから直接知るようにしたので、通知が届かなくても `false` に戻ります。

- 任意の peer の `typescript` の下限を `>=7.0.2` から `>=7.0.0` にする。TypeScript 7 の正式版は 7.0.2 が最初なので、受け付ける版は変わらない。ドキュメントで「TypeScript 7以上」と書けるようにするため。

- 無効（`disabled` か送信中）の `Autocomplete` で、選んだ値のチップが枠と同じ `bg-mute` になり、枠の地に溶けていたのを直しました。無効のあいだ、チップは `bg-base` で描きます。

- 非制御の `Checkbox` と `Radio` で、フォームを reset したあとも reset 前の見た目が残る不具合を直しました。

  reset はブラウザが `checked` を初期値へ戻すだけで `change` を飛ばさないため、`input` は未チェックなのにチェックマークや選択の点・枠線が残っていました。見た目を React の state ではなく `input` の `:checked` から引くようにしたので、reset ボタン、`form.reset()`、`@k8ordo/form` の `useForm`、React が action の成功後に行う自動リセットのどれでも、戻った `checked` がそのまま表示されます。

  あわせて `Radio` の点は、選択が外れるときもフェードして消えるようになりました（これまでは即座に消えていました）。

- `CodeBlock` のフォーカスリングと行の印の線が、強制カラー（Windows のハイコントラストなど）で消えていたのを直しました。フォーカスは outline で、行の頭の線は border で描くので、システムの色で塗り直されて残ります。

- 同梱の docs（`docs/references/components.md`）の文言のキーの表に、`DataTable` の `dataTableColumns`・`dataTableSelectAll`・`dataTableSelectRow` と、`ResizablePanels` の `resizablePanelsHandle` を足しました。

- 非制御の `NumberField` が、フォームの reset（`form.reset()`、reset ボタン、action の成功後に React が行う reset）で `defaultValue`（無ければ空欄）に戻るようになりました。これまでは input が常に React の制御下にあり、`value` 属性が入力した値に同期され続けていたため、reset しても表示も送信値も変わりませんでした。reset で戻った値は `onChange` にも渡します。

  制御モードの `NumberField` は reset で `value` を変えません。値の持ち主は親なので、reset に合わせて戻すならフォームの `onReset` で自分の state を戻してください。

- コンポーネントのテストは実ブラウザ（Vitest の browser mode か Playwright）で書く前提であることを `docs/GUIDE.md` に明記した。`ResizeObserver` / `IntersectionObserver` / `matchMedia` / `dialog.showModal` / `close` / Popover API は support 判定を挟まず直接呼んでいるので、jsdom や happy-dom では `Tooltip` / `IconButton`（`tooltipDisabled` でないもの）/ `Tabs` / `Autocomplete` / `InView` / `Resize` / `Conversation` などは mount した時点で、`Modal` / `Drawer` / `Popover` / `DropdownMenu` / `ListBox` などは開いた時点で落ちる（一覧は GUIDE の Testing）。jsdom にはレイアウトエンジンが無く、スタブで塞いでも focus や配置や可視性のアサーションはほとんど意味を持たないため、塞ぐ方向には進まない。

- 部品の hover / active を、不透明度修飾子（`/80` など）ではなくセマンティックトークンで塗る。ビルド済みの `styles.css` から、Tailwind が不透明度修飾子のために出していた `@supports (color: color-mix(in lab, red, red))` の分岐が 16 個なくなる。

  - `Button` / `IconButton` の solid の primary・secondary は、hover も active も `*-bg-emphasize` にした（これまで hover は `*-bg-emphasize` の 80%）。
  - `Button` の solid の base は、hover を `bg-mute`、active を `bg-emphasize` にした（これまで hover は `bg-mute` の 80%、active は `bg-mute`）。
  - interactive な `Badge` の solid のステータス色（info・success・warning・error）は、hover も active も地を `bg-base` にした（これまで地の色の 80%・60%）。outline は hover も active も `bg-{tone}` にした（これまで active は 80%）。
  - 無効な `PasswordInput` の表示切り替えボタンは、アイコンを `fg-subtle` にした（これまで `fg-mute` の 70%）。
  - `docs/references/color.md` のコントラストの表に、`fg-base` on `bg-mute`（AAA）と `fg-base` on `bg-emphasize`（AA）を足した。

- `Autocomplete` と `Combobox` の不具合を直しました。

  - `Autocomplete` は、IME で変換している間の Enter と矢印キーを変換のものとして扱います。これまでは一覧の中を動かし、Enter でポインタを載せた候補を選んでいました。
  - `Autocomplete` の矢印キーが、一覧の中を動かすのと一緒に入力欄のキャレットを行頭・行末へ動かしていたのを止めました。
  - `Autocomplete` の候補の id を、値ではなく `useId` から作ります。空白を含む値では id が無効になり、空白で区切って読む支援技術には `aria-activedescendant` の指す候補が見つかりませんでした。
  - `Combobox` と `Autocomplete` は、フォームの送信中に `disabled` ではなく `readOnly` になります。Enter で送ると、Chromium がフォーカスを body へ落としていました。送信中と `readOnly` のときは一覧を開かず、値も変えません。`Autocomplete` のタグを外すボタンと「すべて削除」は、`disabled` のときも押せなくなりました。

- `FileField.Dropzone` がファイルを運ぶドラッグにだけ反応するようにする。これまではページ内の文字の選択範囲やリンクをドラッグしても枠が光り（`data-dragging`）、コピーのカーソルを出していたが、落としても何も起きなかった。`PromptInput` と同じく、ファイルを運ばないドラッグは `dragenter` / `dragleave` / `dragover` / `drop` とも素通しにする。無効のときも、ファイルのドラッグは従来どおり既定の動作を止め、ブラウザがファイルを開いてページを離れないようにする。

  あわせて、ドラッグ中に枠と地の色が移り変わる動きを `PromptInput` と同じ `transition-colors duration-150 ease-out` に揃えた（長さは 150ms のままで、加速の付き方だけが変わる）。

- 縦書きの中に置いた Autocomplete・Combobox・Tabs・Toolbar・ResizablePanels が、最初の描画から縦の向きで描かれるようにする。これまでは書字方向を ResizeObserver の最初の通知で知るまで横書きとして扱い、その間に開いた Autocomplete の一覧は入力欄の幅（縦書きでは高さを使うべきところ）に合わせていた。

- Updated dependencies:
  - @k8ordo/i18n@1.0.0

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
