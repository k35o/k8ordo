# k8ordo UI コンポーネント一覧

## インポート方法

```tsx
// スタイルシート（必須）。Tailwind CSS 4 のプロジェクトは
// 代わりに '@k8ordo/ui/tailwind.css' を import する
import '@k8ordo/ui/styles.css';

// プロバイダー（アプリルートで1回）
import { UIProvider } from '@k8ordo/ui';

// コンポーネント（すべてルートからインポート）
import { Button, Card, TextField } from '@k8ordo/ui';
```

## ボタン・リンク

### Button

```tsx
import { Button } from '@k8ordo/ui';

<Button
  size="sm" | "md" | "lg"
  color="primary" | "secondary" | "base"
  variant="solid" | "outline" | "skeleton"
  fullWidth={false}
  startIcon={<Icon />}
  endIcon={<Icon />}
  disabled={false}
  isActive={false}
>
  ボタン
</Button>
```

Props:

- `children`: `ReactNode`
- `color`: `'primary'` | `'secondary'` | `'base'` (default: `'primary'`)
- `endIcon`: `ReactNode`
- `fullWidth`: `boolean` (default: `false`)
- `isActive`: `boolean` (default: `false`)
- `onAction`: `() => void | Promise<void>`
- `renderItem`: `(props: { className: string; children: ReactNode }) => ReactNode`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `startIcon`: `ReactNode`
- `type`: `'button'` | `'submit'` (default: `'button'`)
- `variant`: `'solid'` | `'outline'` | `'skeleton'` (default: `'solid'`)

リンクとしてレンダーする場合は `renderItem` prop を使う。Next.js の `<Link>` などにも応用できる。

```tsx
<Button
  color="base"
  variant="outline"
  renderItem={({ className, children }) => (
    <a className={className} href="/page">
      {children}
    </a>
  )}
>
  リンク
</Button>
```

### IconButton

アイコンのみのボタン。`color` prop でスタイルを制御。

```tsx
import { IconButton } from '@k8ordo/ui';

<IconButton label="閉じる" color="transparent" size="md">
  <CloseIcon />
</IconButton>;
```

Props:

- `label`: `string` (required)
- `children`: `ReactNode`
- `color`: `'transparent'` | `'base'` | `'primary'` | `'secondary'` (default: `'transparent'`)
- `onAction`: `() => void | Promise<void>`
- `renderItem`: `(props: { className: string; children: ReactNode; 'aria-label': string; triggerProps: IconButtonTriggerProps; }) => ReactNode`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `tooltipDisabled`: `boolean` (default: `false`)
- `tooltipPlacement`: `Placement` (default: `'top'`)

リンクとしてレンダーする場合は `renderItem` prop を使う。`triggerProps` を `<a>` にスプレッドすると hover/focus 時に `label` が Tooltip として表示される。

```tsx
<IconButton
  color="base"
  label="メール"
  renderItem={({
    className,
    children,
    'aria-label': ariaLabel,
    triggerProps,
  }) => (
    <a
      aria-label={ariaLabel}
      className={className}
      href="/contact"
      {...triggerProps}
    >
      {children}
    </a>
  )}
>
  <MailIcon />
</IconButton>
```

### Anchor

テキストリンク。外部リンクには自動で新規タブアイコンが付く。

```tsx
import { Anchor } from '@k8ordo/ui';

<Anchor href="https://example.com">外部リンク</Anchor>
<Anchor href="/about">内部リンク</Anchor>
<Anchor href="/docs" openInNewTab>新規タブで開く</Anchor>
```

Props:

- `children`: `ReactNode` (required)
- `href`: `T` (required)
- `openInNewTab`: `boolean` (default: `false`)
- `renderAnchor`: `(props: RenderAnchorProps<T>) => ReactNode` (default: `defaultRenderAnchor`)

## レイアウト・ナビゲーション

### Accordion

折りたたみ可能なセクション。Compound component パターン。

```tsx
import { Accordion } from '@k8ordo/ui';

<Accordion.Root>
  <Accordion.Item>
    <Accordion.Button>セクション1</Accordion.Button>
    <Accordion.Panel>コンテンツ</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>;
```

Props (Accordion.Button):

- `children`: `ReactNode`

Props (Accordion.Item):

- `children`: `ReactNode`
- `defaultOpen`: `boolean` (default: `false`)
- `isOpen`: `boolean`
- `onChange`: `(isOpen: boolean) => void`

Props (Accordion.Panel):

- `children`: `ReactNode`

Props (Accordion.Root):

- `children`: `ReactNode`

### Breadcrumb

パンくずリスト。Compound component パターン。

```tsx
import { Breadcrumb } from '@k8ordo/ui';

<Breadcrumb.List>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">ホーム</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/products">製品</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/products/1" current>
      詳細
    </Breadcrumb.Link>
  </Breadcrumb.Item>
</Breadcrumb.List>;
```

Props (Breadcrumb.List):

- `children`: `ReactNode`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)

Props (Breadcrumb.Link):

- `href`: `T` (required)
- `children`: `ReactNode`
- `current`: `boolean` (default: `false`)
- `renderAnchor`: `(props: RenderBreadcrumbAnchorProps<T>) => ReactNode` (default: `defaultRenderBreadcrumbAnchor`)

Props (Breadcrumb.Item):

- `children`: `ReactNode`

### Pagination

ページ送り。前後ボタンと現在ページの表示のみで、ページ番号のリストは持たない。

```tsx
import { Pagination } from '@k8ordo/ui';

<Pagination currentPage={page} onChange={setPage} totalPages={10} />;
```

Props:

- `currentPage`: `number` (required)
- `onChange`: `(page: number) => void` (required)
- `totalPages`: `number` (required)
- `aria-label`: `string`
- `disabled`: `boolean` (default: `false`)
- `nextLabel`: `string`
- `prevLabel`: `string`
- `ref`: `Ref<HTMLElement>`

### Tabs

タブ切り替え。Compound component パターン。

```tsx
import { Tabs } from '@k8ordo/ui';

<Tabs.Root ids={['tab1', 'tab2']}>
  <Tabs.List label="タブ">
    <Tabs.Tab id="tab1">タブ1</Tabs.Tab>
    <Tabs.Tab id="tab2">タブ2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="tab1">パネル1</Tabs.Panel>
  <Tabs.Panel id="tab2">パネル2</Tabs.Panel>
</Tabs.Root>;
```

Props (Tabs.Root):

- `ids`: `[string, ...string[]]` (required)
- `children`: `ReactNode`
- `defaultSelectedId`: `string` | `null` (default: `null`)
- `onChange`: `(id: string) => void`
- `selectedId`: `string`

Props (Tabs.List):

- `label`: `string` (required)
- `children`: `ReactNode`

Props (Tabs.Panel):

- `id`: `string` (required)
- `children`: `ReactNode`

Props (Tabs.Tab):

- `id`: `string` (required)
- `children`: `ReactNode`

### Card

コンテンツをグループ化するカード。

```tsx
import { Card } from '@k8ordo/ui';

// 静的カード
<Card width="full" variant="shadow">
  <div className="p-6">コンテンツ</div>
</Card>

// クリック可能なカード（hover:scale-[1.02], active:scale-[0.98]）
<Card variant="outline" interactive>
  <div className="p-6">コンテンツ</div>
</Card>
```

Props:

- `children`: `ReactNode`
- `interactive`: `boolean` (default: `false`)
- `variant`: `'shadow'` | `'outline'` (default: `'shadow'`)
- `width`: `'full'` | `'fit'` (default: `'full'`)

### Separator

区切り線。

```tsx
import { Separator } from '@k8ordo/ui';

<Separator />
<Separator color="mute" />
<Separator color="subtle" />
<Separator orientation="vertical" />
```

Props:

- `color`: `'base'` | `'mute'` | `'subtle'` (default: `'base'`)
- `orientation`: `'horizontal'` | `'vertical'` (default: `'horizontal'`)

### ScrollLinked

スクロール進捗をプログレスバーで表示。

```tsx
import { ScrollLinked } from '@k8ordo/ui';

<ScrollLinked />
<ScrollLinked container={containerRef} />
```

Props:

- `container`: `RefObject<HTMLElement | null>`

### Stack

縦横一方向に並べるレイアウト。`gap` はスペーシングトークンから選ぶ。

```tsx
import { Stack } from '@k8ordo/ui';

<Stack gap="lg">
  <Card>1</Card>
  <Card>2</Card>
</Stack>

<Stack direction="row" justify="between" align="center">
  <Heading level="h2">タイトル</Heading>
  <Button>操作</Button>
</Stack>
```

Props:

- `align`: `'start'` | `'center'` | `'end'` | `'stretch'`
- `children`: `ReactNode`
- `direction`: `'row'` | `'column'` (default: `'column'`)
- `gap`: `GapSize` (default: `'md'`)
- `justify`: `'start'` | `'center'` | `'end'` | `'between'`
- `padding`: `PaddingSize`

### Grid

グリッドレイアウト。`cols` に `'auto-fill'` / `'auto-fit'` を渡すと `minItemSize` を下限に折り返す。

```tsx
import { Grid } from '@k8ordo/ui';

<Grid cols={3} gap="md">
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</Grid>

<Grid cols="auto-fill" minItemSize={64}>
  {items.map((item) => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</Grid>
```

Props:

- `children`: `ReactNode`
- `cols`: `1` | `2` | `3` | `4` | `5` | `6` | `'auto-fill'` | `'auto-fit'` (default: `'auto-fill'`)
- `gap`: `GapSize` (default: `'md'`)
- `minItemSize`: `24` | `32` | `40` | `48` | `64` | `80` (default: `48`)

## フォーム

フォームコンポーネントは `FormControl` の `renderInput` パターンと組み合わせて使用する。各フォームコンポーネントは controlled / uncontrolled の両方に対応。

`ref` は実要素（`input` / `textarea` / `select` / `fieldset`）に届く。内部で ref を使う `Textarea` / `FileField` も内部 ref と合成されるため、`react-hook-form` の `register()` などをそのまま渡せる。`Radio`（複数の input を描くグループ）と `FormControl`（ラッパー）は `ref` を受け取らない。

### Form

`<form>` のラッパー。`action` には Server Action（`(formData) => …`）も URL 文字列も渡せる。

```tsx
import { Button, Form, FormControl, TextField } from '@k8ordo/ui';

<Form action={submitAction}>
  <FormControl
    label="メール"
    required
    renderInput={(props) => <TextField {...props} name="email" />}
  />
  <Button type="submit">送信</Button>
</Form>;
```

Props:

- `children`: `ReactNode` (required)
- `action`: `((formData: FormData) => void | Promise<void>)` | `string`

### FormControl

フォームフィールドのラッパー。ラベル・ヘルプテキスト・エラー表示を統一する。

```tsx
import { FormControl, TextField } from '@k8ordo/ui';

<FormControl
  label="メールアドレス"
  errorText="入力してください"
  helpText="会社のメールアドレスを入力してください"
  required
  renderInput={(props) => (
    <TextField {...props} placeholder="example@mail.com" />
  )}
/>;
```

Props:

- `label`: `string` (required)
- `renderInput`: `(props: { id: string; 'aria-describedby': string | undefined; 'aria-labelledby': string; disabled: boolean; invalid: boolean; required: boolean; }) => ReactElement` (required)
- `disabled`: `boolean` (default: `false`)
- `errorText`: `string`
- `helpText`: `string`
- `invalid`: `boolean` (default: `false`)
- `labelAs`: `'label'` | `'legend'` (default: `'label'`)
- `ref`: `Ref<HTMLElement>`
- `required`: `boolean` (default: `false`)

`renderInput` は `{ id, 'aria-describedby', 'aria-labelledby', disabled, invalid, required }` を受け取る。

ラッパー要素は `labelAs` で変わる。`'label'`（既定）は `<div>` + `<label htmlFor>`、`'legend'` は `<fieldset>` + `<legend>`。単一フィールドを名前の無いグループにしないため、`<fieldset>` は `legend` のときだけ使う。`Radio` / `CheckboxGroup` のようなグループ入力を包むときは `labelAs="legend"` を指定する。

### TextField

```tsx
import { TextField } from '@k8ordo/ui';

// Uncontrolled
<TextField id="email" defaultValue="" placeholder="example@mail.com"
  invalid={false} disabled={false} required={false} />

// Controlled
<TextField id="email" value={value} onChange={onChange}
  invalid={false} disabled={false} required={false} />

// type も渡せる（デフォルト: "text"）
<TextField id="tel" type="tel" inputMode="numeric" />
```

Props:

- `children`: `ReactNode`
- `invalid`: `boolean` (default: `false`)
- `ref`: `Ref<HTMLInputElement>`
- `type`: `TextInputType` (default: `'text'`)

### Textarea

```tsx
import { Textarea } from '@k8ordo/ui';

<Textarea
  id="description"
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `autoResize`: `boolean` (default: `false`)
- `children`: `ReactNode`
- `fullHeight`: `boolean` (default: `false`)
- `invalid`: `boolean` (default: `false`)
- `ref`: `Ref<HTMLTextAreaElement>`

### NumberField

```tsx
import { NumberField } from '@k8ordo/ui';

<NumberField
  id="quantity"
  min={0}
  max={100}
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `max`: `number` (default: `9_007_199_254_740_991`)
- `min`: `number` (default: `-9_007_199_254_740_991`)
- `onChange`: `(value: number) => void`
- `precision`: `number` (default: `0`)
- `ref`: `Ref<HTMLInputElement>`
- `step`: `number` (default: `1`)
- `value`: `number`

### PasswordInput

パスワード入力。表示/非表示トグル付き。

```tsx
import { PasswordInput } from '@k8ordo/ui';

<PasswordInput
  id="password"
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
  showLabel="表示"
  hideLabel="非表示"
/>;
```

Props:

- `children`: `ReactNode`
- `hideLabel`: `string`
- `invalid`: `boolean` (default: `false`)
- `ref`: `Ref<HTMLInputElement>`
- `showLabel`: `string`

### Select

```tsx
import { Select } from '@k8ordo/ui';

<Select
  id="category"
  options={[
    { value: '1', label: 'オプション1' },
    { value: '2', label: 'オプション2' },
  ]}
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `options`: `readonly Option[]` (required)
- `children`: `ReactNode`
- `invalid`: `boolean` (default: `false`)
- `ref`: `Ref<HTMLSelectElement>`

### Autocomplete

複数選択のオートコンプリート。`value` / `onChange` は `string[]`。

```tsx
import { Autocomplete } from '@k8ordo/ui';

<Autocomplete
  id="tags"
  options={options}
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `id`: `string` (required)
- `options`: `readonly Option[]` (required)
- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLInputElement>`
- `value`: `string[]`

### Checkbox

ラベルは `label` prop で渡す（children ではない）。`onChange` は `(checked, event)`。

```tsx
import { Checkbox } from '@k8ordo/ui';

// Controlled
<Checkbox checked={checked} label="同意する" onChange={onChange} />

// Uncontrolled
<Checkbox defaultChecked label="同意する" />
```

Props:

- `label`: `string` (required)
- `checked`: `boolean`
- `defaultChecked`: `never`
- `itemValue`: `string`
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`

### CheckboxGroup

複数チェックボックスのグループ。子は `CheckboxGroup.Item`（= `Checkbox`）で、`itemValue` が必須。

グループの選択状態は `value` / `onChange`（`string[]`）で持つ。単体の `Checkbox` が真偽値を `checked` で持つのとは別物なので、混同しないこと。

`fieldset[role="group"]` を描くため `aria-labelledby` が必須。必須入力であることは、参照先のラベル要素（`FormControl` の必須表示など）に含めて伝える。`role="group"` は `aria-required` を許可していないので、グループ側には出さない。

```tsx
import { CheckboxGroup } from '@k8ordo/ui';

<p id="interests-label">興味のある分野</p>
<CheckboxGroup.Root
  aria-labelledby="interests-label"
  name="interests"
  value={values}
  onChange={setValues}
>
  <CheckboxGroup.Item itemValue="music" label="音楽" />
  <CheckboxGroup.Item itemValue="movie" label="映画" />
</CheckboxGroup.Root>;
```

Props (CheckboxGroup.Item):

- `label`: `string` (required)
- `checked`: `boolean`
- `defaultChecked`: `never`
- `itemValue`: `string`
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`

Props (CheckboxGroup.Root):

- `aria-labelledby`: `string` (required)
- `name`: `string` (required)
- `children`: `ReactNode`
- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string[]`

### CheckboxCard

カードスタイルのチェックボックス。

```tsx
import { CheckboxCard } from '@k8ordo/ui';

<CheckboxCard
  name="plan"
  disabled={false}
  options={[
    { value: 'basic', label: 'ベーシック', description: '月額980円' },
    {
      value: 'pro',
      label: 'プロ',
      description: '月額1,980円',
      visual: <Icon />,
    },
  ]}
  value={selected}
  onChange={onChange}
/>;
```

Props:

- `aria-labelledby`: `string` (required)
- `options`: `readonly CheckboxCardOption[]` (required)
- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string[]`

### Radio

```tsx
import { Radio } from '@k8ordo/ui';

<Radio
  aria-labelledby="example-radio"
  name="example"
  onChange={onChange}
  options={[
    { value: 'a', label: '選択肢A' },
    { value: 'b', label: '選択肢B' },
  ]}
  value={value}
/>;
```

Props:

- `aria-labelledby`: `string` (required)
- `options`: `readonly Option[]` (required)
- `disabled`: `boolean` (default: `false`)
- `name`: `string`
- `onChange`: `(value: string, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLDivElement>`
- `value`: `string`

### RadioCard

カードスタイルのラジオボタン。`fieldset[role="radiogroup"]` の中に本物の `input[type="radio"]` を並べるため、矢印キーのローミングと単一選択はブラウザに任せている。テストからは `getByRole('radio', { checked })` で参照する。

```tsx
import { RadioCard } from '@k8ordo/ui';

<RadioCard
  aria-labelledby="plan-radio"
  name="plan"
  disabled={false}
  options={[
    { value: 'basic', label: 'ベーシック', description: '月額980円' },
    {
      value: 'pro',
      label: 'プロ',
      description: '月額1,980円',
      visual: <Icon />,
    },
  ]}
  value={value}
  onChange={onChange}
/>;
```

Props:

- `aria-labelledby`: `string` (required)
- `options`: `readonly RadioCardOption[]` (required)
- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string`

### Slider

レンジスライダー。

```tsx
import { Slider } from '@k8ordo/ui';

<Slider
  min={0}
  max={100}
  step={1}
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `max`: `number` (default: `100`)
- `min`: `number` (default: `0`)
- `onChange`: `(value: number) => void`
- `ref`: `Ref<HTMLInputElement>`
- `step`: `number` (default: `1`)
- `value`: `number`

### Switch

トグルスイッチ。

```tsx
import { Switch } from '@k8ordo/ui';

<Switch
  checked={checked}
  disabled={false}
  invalid={false}
  label="通知を有効にする"
  onChange={onChange}
  required={false}
/>;
```

Props:

- `label`: `string` (required)
- `checked`: `boolean`
- `defaultChecked`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`

### FileField

コンポジットパターンのファイルアップロード。

```tsx
import { FileField } from '@k8ordo/ui';

<FileField.Root accept="image/*" multiple maxFiles={5}>
  <FileField.Trigger
    renderItem={({ onClick, disabled }) => (
      <Button onClick={onClick} disabled={disabled}>
        ファイルを選択
      </Button>
    )}
  />
  <FileField.ItemList />
</FileField.Root>;
```

Props (Root):

- `children`: `ReactNode`
- `defaultValue`: `File[]`
- `invalid`: `boolean` (default: `false`)
- `maxFiles`: `number`
- `onChange`: `(files: FileList | null, event?: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`
- `webkitDirectory`: `boolean` (default: `false`)

Props (FileField.ItemList):

- `clearable`: `boolean`
- `showWebkitRelativePath`: `boolean`

Props (FileField.Trigger):

- `renderItem`: `(props: { onClick: () => void; disabled: boolean; invalid: boolean; }) => ReactElement` (required)

## データ表示

### Heading

セマンティック見出し。`type` prop で HTML 要素を指定。

```tsx
import { Heading } from '@k8ordo/ui';

<Heading level="h1">ページタイトル</Heading>
<Heading level="h2">セクション見出し</Heading>
<Heading level="h3">サブセクション</Heading>
```

Props:

- `level`: `'h1'` | `'h2'` | `'h3'` | `'h4'` | `'h5'` | `'h6'` (required)
- `children`: `ReactNode`
- `lineClamp`: `1` | `2` | `3` | `4` | `5` | `6`

### Avatar

ユーザーアバター。

```tsx
import { Avatar } from '@k8ordo/ui';

<Avatar src="/avatar.jpg" alt="ユーザー名" size="md" />
<Avatar name="田中太郎" fallback="田" size="lg" />
<Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
```

Props:

- `alt`: `string`
- `children`: `ReactNode`
- `color`: `'base'` | `'primary'` | `'secondary'` (default: `'base'`)
- `fallback`: `string`
- `icon`: `ReactNode`
- `name`: `string`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `src`: `string`

### Badge

ステータスバッジ。

```tsx
import { Badge } from '@k8ordo/ui';

<Badge label="新着" tone="info" variant="solid" />
<Badge label="完了" tone="success" variant="outline" />
<Badge label="フィルター" interactive />
```

Props:

- `label`: `string` (required)
- `interactive`: `true`
- `size`: `Size`
- `tone`: `Tone`
- `variant`: `Variant`

### Code

インラインコード表示。

```tsx
import { Code } from '@k8ordo/ui';

<Code>{`const x = 1;`}</Code>;
```

Props:

- `children`: `string` (required)

### Table

データテーブル。Compound component パターン。

```tsx
import { Table } from '@k8ordo/ui';

<Table.Root>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>名前</Table.HeaderCell>
      <Table.HeaderCell align="right">金額</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row interactive>
      <Table.Cell>商品A</Table.Cell>
      <Table.Cell align="right">¥1,000</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>;
```

Props (Table.Body):

- `children`: `ReactNode`

Props (Table.Caption):

- `children`: `ReactNode`

Props (Table.Cell):

- `align`: `CellAlign` (default: `'left'`)
- `children`: `ReactNode`
- `color`: `'base'` | `'mute'` (default: `'base'`)

Props (Table.EmptyState):

- `children`: `ReactNode` (required)
- `colSpan`: `number` (required)

Props (Table.Head):

- `children`: `ReactNode`

Props (Table.HeaderCell):

- `align`: `CellAlign` (default: `'left'`)
- `children`: `ReactNode`
- `scope`: `'col'` | `'row'` | `'colgroup'` | `'rowgroup'` (default: `'col'`)

Props (Table.Root):

- `children`: `ReactNode`

Props (Table.Row):

- `children`: `ReactNode`
- `interactive`: `boolean` (default: `false`)

## フィードバック

### Alert

```tsx
import { Alert } from '@k8ordo/ui';

<Alert tone="info" message="情報メッセージ" />
<Alert tone="error" message={['エラー1', 'エラー2']} />
```

Props:

- `message`: `string` | `string[]` (required)
- `tone`: `Status` (required)
- `action`: `AlertAction`
- `closeLabel`: `string`
- `onClose`: `() => void`

### Toast

```tsx
import { useToast } from '@k8ordo/ui';

const { open, close, closeAll } = useToast();

open('success', '保存しました');
open('error', 'エラーが発生しました');
```

`ToastProvider` は `UIProvider` に含まれるため、別途ラップ不要。

`useToast()` の戻り値:

- `open`: `(tone: Status, message: string, options?: ToastOptions) => void`（`ToastOptions` は `{ duration?: number; action?: ToastAction }`）
- `close`: `(id: string) => void`
- `closeAll`: `() => void`

### ToastProvider

出す位置や Portal 先を変えたいときだけ、`UIProvider` の内側で明示的にラップする。

```tsx
import { ToastProvider } from '@k8ordo/ui';

<ToastProvider position="absolute" portalRef={containerRef}>
  {children}
</ToastProvider>;
```

Props:

- `children`: `ReactNode`
- `portalRef`: `RefObject<HTMLElement | null>` (default: `null`)
- `position`: `'fixed'` | `'absolute'` (default: `'fixed'`)

### Progress

```tsx
import { Progress } from '@k8ordo/ui';

<Progress value={50} max={100} />
<Progress value={50} max={100} min={0} label="進捗" />
```

Props:

- `max`: `number` (required)
- `value`: `number` (required)
- `label`: `string`
- `min`: `number` (default: `0`)

### Spinner

ローディングスピナー。

```tsx
import { Spinner } from '@k8ordo/ui';

<Spinner size="md" label="読み込み中" />;
```

Props:

- `label`: `string`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)

### Skeleton

コンテンツプレースホルダー。

```tsx
import { Skeleton } from '@k8ordo/ui';

<Skeleton shape="rect" size="md" />
<Skeleton shape="circle" size="lg" />
<Skeleton shape="rect" size="sm" animate={false} />
```

Props:

- `animate`: `boolean` (default: `true`)
- `shape`: `'rect'` | `'circle'` (default: `'rect'`)
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)

## オーバーレイ

### Modal

ベースのオーバーレイコンポーネント。`<dialog>` 要素を使用。

```tsx
import { Modal } from '@k8ordo/ui';

<Modal isOpen={open} onClose={onClose} side="center">
  コンテンツ
</Modal>;
```

Props:

- `aria-describedby`: `string`
- `aria-label`: `string`
- `aria-labelledby`: `string`
- `children`: `ReactNode`
- `defaultOpen`: `boolean`
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `ref`: `Ref<HTMLDialogElement>`
- `side`: `ModalSide` (default: `'center'`)

名前の解決順は `aria-label` / `aria-labelledby` > 中の `Dialog.Root` が登録した見出し。どちらも無ければ無名の dialog になるため、`Dialog` を入れずに直接コンテンツを置くときは `aria-label` を渡す。

```tsx
<Modal aria-label="画像プレビュー" isOpen={open} onClose={onClose}>
  <img alt="" src={src} />
</Modal>
```

### Dialog

Compound component パターン。Modal と組み合わせて使用。

```tsx
import { Modal, Dialog } from '@k8ordo/ui';

<Modal isOpen={open} onClose={onClose}>
  <Dialog.Root>
    <Dialog.Header title="確認" onClose={onClose} />
    <Dialog.Content>コンテンツ</Dialog.Content>
  </Dialog.Root>
</Modal>;
```

Props (Dialog.Content):

- `children`: `ReactNode`

Props (Dialog.Header):

- `onClose`: `() => void` (required)
- `title`: `ReactNode` (required)

Props (Dialog.Root):

- `children`: `ReactNode`
- `id`: `string`
- `ref`: `Ref<HTMLElement>`
- `role`: `'dialog'` | `'alertdialog'`
- `tabIndex`: `number`

### Drawer

サイドパネル。内部で Modal を使用。

```tsx
import { Drawer } from '@k8ordo/ui';

<Drawer title="メニュー" isOpen={open} onClose={onClose} side="right">
  コンテンツ
</Drawer>;
```

Props:

- `title`: `ReactNode` (required)
- `children`: `ReactNode`
- `defaultOpen`: `boolean`
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `side`: `DrawerSide` (default: `'right'`)

### Popover

CSS Anchor Positioning ベースのポップオーバー。Compound component パターン。

```tsx
import { Popover } from '@k8ordo/ui';

<Popover.Root placement="bottom">
  <Popover.Trigger renderItem={(props) => <Button {...props}>開く</Button>} />
  <Popover.Content
    renderItem={(props) => <div {...props}>ポップオーバーコンテンツ</div>}
  />
</Popover.Root>;
```

Props (Root):

- `children`: `ReactNode`
- `closeOnClickAway`: `boolean` (default: `true`)
- `defaultOpen`: `boolean` (default: `false`)
- `flipDisabled`: `boolean` (default: `false`)
- `isOpen`: `boolean`
- `onChange`: `(isOpen: boolean) => void`
- `placement`: `Placement` (default: `'bottom-start'`)
- `role`: `'dialog'` | `'menu'` | `'listbox'` (default: `'menu'`)
- `trapFocus`: `boolean` (default: `true`)

Escape は入れ子のうち**最も内側の 1 枚だけ**を閉じる。

Props (Popover.Content):

- `renderItem`: `(props: PopoverContentProps) => ReactElement` (required)
- `animation`: `'scale'` | `'fade'` (default: `'scale'`)

Props (Popover.Trigger):

- `renderItem`: `(props: PopoverTriggerProps) => ReactElement` (required)

### Tooltip

ツールチップ。Compound component パターン。

```tsx
import { Tooltip } from '@k8ordo/ui';

<Tooltip.Root placement="top">
  <Tooltip.Trigger renderItem={(props) => <Button {...props}>ホバー</Button>} />
  <Tooltip.Content>ヒント</Tooltip.Content>
</Tooltip.Root>;
```

Props (Root):

- `children`: `ReactNode`
- `closeDelay`: `number` (default: `150`)
- `defaultOpen`: `boolean`
- `isOpen`: `boolean`
- `onChange`: `(isOpen: boolean) => void`
- `openDelay`: `number` (default: `0`)
- `placement`: `Placement` (default: `'bottom'`)

Props (Tooltip.Content):

- `children`: `ReactNode`

Props (Tooltip.Trigger):

- `renderItem`: `(props: TooltipTriggerProps) => ReactElement` (required)

### DropdownMenu

ドロップダウンメニュー。Compound component パターン。

```tsx
import { DropdownMenu } from '@k8ordo/ui';

<DropdownMenu.Root>
  <DropdownMenu.Trigger label="メニュー" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="アイテム1" onAction={handleClick} />
    <DropdownMenu.Item label="アイテム2" onAction={handleClick} />
  </DropdownMenu.Content>
</DropdownMenu.Root>;
```

Props (Root):

- `children`: `ReactNode`
- `defaultOpen`: `boolean`
- `isOpen`: `boolean`
- `onChange`: `(isOpen: boolean) => void`
- `placement`: `Placement` (default: `'bottom-start'`)

Trigger バリアント:

- `DropdownMenu.Trigger`: テキストベース（`label`, `size`, `variant`）
- `DropdownMenu.IconTrigger`: アイコンベース（`icon`, `label`）

Props (DropdownMenu.Content):

- `children`: `ReactNode`

Props (DropdownMenu.IconTrigger):

- `icon`: `ReactNode` (required)
- `label`: `string` (required)

Props (DropdownMenu.Item):

- `label`: `string` (required)
- `onAction`: `() => void` (required)

`DropdownMenu.SubMenu` は入れ子メニュー。`label` の行をホバーまたはキーボードで開くと、子要素のメニューが右側に開く。

Props (DropdownMenu.SubMenu):

- `label`: `string` (required)
- `children`: `ReactNode`

Props (DropdownMenu.Trigger):

- `label`: `string` (required)
- `size`: `ComponentProps<typeof Button>['size']` (default: `'md'`)
- `variant`: `ComponentProps<typeof Button>['variant']` (default: `'solid'`)

### ListBox

リスト選択。Compound component パターン。選択肢は `Select` と同じ `Option`（`{ value, label }`）。

```tsx
import { ListBox } from '@k8ordo/ui';

<ListBox.Root
  onChange={onChange}
  options={[
    { value: '1', label: 'オプション1' },
    { value: '2', label: 'オプション2' },
  ]}
  value={value}
>
  <ListBox.Trigger label="表示件数" size="md" />
  <ListBox.Content />
</ListBox.Root>;
```

Props (Root):

- `options`: `readonly Option[]` (required)
- `children`: `ReactNode`
- `defaultValue`: `Option['value']`
- `onChange`: `(value: Option['value']) => void`
- `placement`: `Placement` (default: `'bottom'`)
- `value`: `Option['value']`

Trigger バリアント:

- `ListBox.Trigger`: テキストベース（`size`, `label`）
- `ListBox.IconTrigger`: アイコンベース（`size`, `icon`, `label`）

`label` を渡すとトリガーのアクセシブル名が「ラベル + 現在値」になる。省略すると現在値だけになるため、周囲に見出しが無いときは渡す。

Props (Content):

- `helpContent`: `ReactElement`

Props (ListBox.IconTrigger):

- `icon`: `ReactElement` (required)
- `label`: `string`
- `size`: `ComponentProps<typeof Button>['size']` (default: `'md'`)

Props (ListBox.Trigger):

- `label`: `string`
- `size`: `ComponentProps<typeof Button>['size']` (default: `'md'`)

## プロバイダー

### UIProvider

アプリのルートで1回ラップする。ToastProvider と文言辞書（下記 i18n）を含む。

```tsx
import { UIProvider } from '@k8ordo/ui';

<UIProvider>
  <App />
</UIProvider>;
```

Props:

- `children`: `ReactNode`
- `messages`: `Partial<Messages>`

### PortalRootProvider

Portal のルート要素を指定する。

```tsx
import { PortalRootProvider, usePortalRoot } from '@k8ordo/ui';

<PortalRootProvider value={containerRef}>{children}</PortalRootProvider>;
```

Props:

- `children`: `ReactNode`
- `value`: `RefObject<HTMLElement | null>`

## i18n（文言辞書）

コンポーネントが内部で持つ文言（閉じる、必須、読み込み中 …）は辞書から引く。**既定は日本語**で、Provider を置かなくても、`messages` を渡さなくても日本語で動く。

英語に切り替えるときは `@k8ordo/ui/i18n` の `en` を渡す。

```tsx
import { UIProvider } from '@k8ordo/ui';
import { en } from '@k8ordo/ui/i18n';

<UIProvider messages={en}>
  <App />
</UIProvider>;
```

一部だけ差し替えるときは辞書をスプレッドして上書きする（`Partial<Messages>` なので全キーを埋める必要はない）。

```tsx
<UIProvider messages={{ ...en, close: 'Dismiss' }}>
  <App />
</UIProvider>
```

日本語のまま一部だけ変えるなら、そのキーだけ渡せばよい。

```tsx
<UIProvider messages={{ close: '閉じる（Esc）' }}>
  <App />
</UIProvider>
```

### 優先順位

**コンポーネントの prop > Provider に渡した辞書 > 既定（日本語）**。

`Spinner` の `label`、`Alert` の `closeLabel`、`PasswordInput` の `showLabel` / `hideLabel`、`Pagination` の `prevLabel` / `nextLabel` のように個別の文言 prop を持つコンポーネントは、その prop が辞書より優先される。

```tsx
// 辞書が en でも、この Spinner だけは「保存中」になる
<Spinner label="保存中" />
```

### エクスポート

```tsx
import { en, ja, type Messages } from '@k8ordo/ui/i18n';
```

`ja` / `en` は本体のバンドルに載らないよう、ルートではなく `@k8ordo/ui/i18n` サブパスからのみ export される。

### キー一覧

`Messages` 型の全キー。値はすべて `string`。

| 分類          | キー                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 共通          | `close`, `required`, `loading`, `avatar`, `color`                                                                                  |
| Alert         | `alertSuccess`, `alertInfo`, `alertWarning`, `alertError`                                                                          |
| Toast         | `toastRegion`                                                                                                                      |
| Autocomplete  | `autocompletePlaceholder`, `autocompleteRemoveTag`, `autocompleteClear`, `autocompleteEmpty`                                       |
| FileField     | `fileFieldRemove`                                                                                                                  |
| NumberField   | `numberFieldIncrement`, `numberFieldDecrement`                                                                                     |
| PasswordInput | `passwordShow`, `passwordHide`                                                                                                     |
| ListBox       | `listBoxPlaceholder`                                                                                                               |
| Breadcrumb    | `breadcrumb`                                                                                                                       |
| Pagination    | `paginationLabel`, `paginationPrevious`, `paginationNext`                                                                          |
| AI チャット   | `chat`, `scrollToLatest`, `reasoning`, `reasoningStreaming`, `suggestions`, `send`, `stop`, `toolInput`, `toolOutput`, `toolError` |
