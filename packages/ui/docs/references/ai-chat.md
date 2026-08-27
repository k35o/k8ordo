# k8ordo UI AI チャットコンポーネント

AI チャット UI（会話ログ・メッセージ・入力欄・推論表示・ツール実行表示）を構築するコンポーネント群。ルートではなく専用サブパスからインポートする。

## インポート方法

```tsx
// 基本コンポーネント（追加の依存なし）
import {
  Conversation,
  Message,
  PromptInput,
  Reasoning,
  Suggestion,
  ToolInvocation,
} from '@k8ordo/ui/ai';

// ストリーミング対応 Markdown 描画（optional peer: streamdown）
import { Response } from '@k8ordo/ui/ai/response';

// AI SDK 連携（optional peer: ai）
import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
```

型も `@k8ordo/ui/ai` から export される：

- `ChatStatus`: `'ready' | 'submitted' | 'streaming' | 'error'`（AI SDK の `status` と互換）
- `ToolState`: `'input-streaming' | 'input-available' | 'approval-requested' | 'approval-responded' | 'output-available' | 'output-error' | 'output-denied'`（AI SDK v7 のツール状態と 1:1）

### optional peer のセットアップ

使うサブパスの分だけインストールする。`@k8ordo/ui/ai` 本体はどちらも不要。

```bash
# @k8ordo/ui/ai/response（Response）を使う場合
pnpm add streamdown
# @k8ordo/ui/ai-sdk（mapMessageParts）を使う場合
pnpm add ai
```

`Response` を使う場合は streamdown のスタイルシートの読み込みと、Tailwind の `@source` 設定も必要。streamdown のスタイルはビルド済み `styles.css` には含まれないため、`Response` だけは Tailwind CSS 4 のビルド（`@k8ordo/ui/tailwind.css` エントリ）が前提になる：

```tsx
import 'streamdown/styles.css';
```

```css
/* アプリの CSS エントリに追加（パスは CSS ファイルから node_modules への相対） */
@source '../node_modules/streamdown/dist/*.js';
```

なお本リファレンスの例で使う `useChat` は AI SDK の React バインディング（`pnpm add @ai-sdk/react`）から import する。

以下に出てくる `label` / `sendLabel` などの「デフォルト」は文言辞書の既定値（日本語）。`<UIProvider messages={en}>` で辞書ごと切り替えられる（[i18n](components.md)）。個別の prop を渡した場合はそちらが辞書より優先される。

## 全体像

`Conversation`（会話ログ）+ `Message`（吹き出し）+ `PromptInput`（入力欄）が骨組み。`Response` / `Reasoning` / `ToolInvocation` は後から足せる。

```tsx
'use client';
import { Avatar, AssistantIcon } from '@k8ordo/ui';
import { Conversation, Message, PromptInput } from '@k8ordo/ui/ai';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

const textOf = (m: UIMessage) =>
  m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('');

export function Chat() {
  const { messages, sendMessage, status, stop } = useChat();

  return (
    <div className="flex h-full flex-col gap-3">
      <Conversation.Root>
        <Conversation.Messages isStreaming={status === 'streaming'}>
          {messages.map((m) => (
            <Message.Root
              from={m.role === 'user' ? 'user' : 'assistant'}
              key={m.id}
            >
              {m.role !== 'user' && (
                <Avatar
                  color="primary"
                  icon={<AssistantIcon />}
                  name="AI"
                  size="sm"
                />
              )}
              <Message.Content>{textOf(m)}</Message.Content>
            </Message.Root>
          ))}
        </Conversation.Messages>
        <Conversation.ScrollButton />
      </Conversation.Root>

      <PromptInput.Root
        onStop={stop}
        onSubmit={(text) => sendMessage({ text })}
        status={status}
      >
        <PromptInput.Textarea placeholder="メッセージを入力" />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}
```

## Conversation

会話ログのスクロール領域。Compound component パターン。最下部に張り付き、新しいメッセージで自動スクロールする。最下部から離れると `ScrollButton` が現れる。

```tsx
import { Conversation } from '@k8ordo/ui/ai';

<Conversation.Root>
  <Conversation.Messages isStreaming={isStreaming}>
    {/* Message.Root ... */}
  </Conversation.Messages>
  <Conversation.ScrollButton />
</Conversation.Root>;
```

Props (Conversation.Messages):

- `label`: string（デフォルト: `'チャット'`、aria-label として使用）
- `isStreaming`: boolean（`aria-busy` に反映）

Props (Conversation.ScrollButton):

- `label`: string（デフォルト: `'最新のメッセージへ移動'`）

## Message

メッセージ 1 件。`from="user"` は右寄せの吹き出し、`from="assistant"` は地の文として描画される。アバターなどは `Message.Root` の子として自由に並べられる。

```tsx
import { Message } from '@k8ordo/ui/ai';

<Message.Root from="user">
  <Message.Content>こんにちは</Message.Content>
</Message.Root>

<Message.Root from="assistant">
  <Message.Content isStreaming>生成中の本文…</Message.Content>
</Message.Root>
```

Props (Message.Root):

- `from`: `'user'` | `'assistant'`（必須）

Props (Message.Content):

- `isStreaming`: boolean（true でストリーミングカーソルを表示）

## PromptInput

送信フォーム。Enter で送信、Shift+Enter で改行。IME 変換確定の Enter では送信しない。`status` が `'submitted'` / `'streaming'` の間は `Submit` が停止ボタンに切り替わる。本文は trim され、空文字は送信されない。

```tsx
import { PromptInput } from '@k8ordo/ui/ai';

<PromptInput.Root
  status={status}
  onSubmit={(message) => send(message)}
  onStop={stop}
>
  <PromptInput.Textarea placeholder="メッセージを入力" />
  <PromptInput.Submit />
</PromptInput.Root>;
```

Props (PromptInput.Root):

- `status`: ChatStatus（デフォルト: `'ready'`）
- `value` / `defaultValue` / `onChange`: controlled / uncontrolled 両対応（`onChange` は `(value: string) => void`）
- `onSubmit`: `(message: string) => void`（trim 済みの本文）
- `onStop`: `() => void`（送信中に停止ボタンを押したとき）

Props (PromptInput.Textarea):

- `placeholder`: string ほか textarea 属性

Props (PromptInput.Submit):

- `sendLabel`: string（デフォルト: `'送信'`）
- `stopLabel`: string（デフォルト: `'停止'`）

## Reasoning

推論（思考過程）の折りたたみ表示。ストリーミング中はラベルが「思考中…」になる。

```tsx
import { Reasoning } from '@k8ordo/ui/ai';

<Reasoning isStreaming={isThinking}>{reasoningText}</Reasoning>;
```

Props:

- `isStreaming`: boolean
- `isOpen` / `defaultOpen` / `onChange`: 開閉の controlled / uncontrolled 両対応（`onChange` は `(isOpen: boolean) => void`）

## Response

ストリーミング対応の Markdown レンダラ。未クローズのコードブロックなど途中の Markdown も破綻なく描画する。optional peer の `streamdown` が必要（[セットアップ](#optional-peer-のセットアップ)参照）。

```tsx
import { Response } from '@k8ordo/ui/ai/response';
import 'streamdown/styles.css';

<Message.Content>
  <Response isStreaming={isStreaming}>{markdown}</Response>
</Message.Content>;
```

Props:

- `children`: string（Markdown 文字列、必須）
- `isStreaming`: boolean
- 上記以外の streamdown の props（`translations` / `controls` / `linkSafety` / `plugins` / `components` / `urlTransform` / `dir` など）はそのまま透過する。`className` と `mode` はライブラリが握る（`mode` は `isStreaming` から決まる）

文言は i18n 辞書から引くので、既定では「コードをコピー」「表をダウンロード」などが日本語で出る。個別に変えたいときは `translations` を渡す（prop > 辞書 > streamdown 既定）。

`linkSafety` はライブラリ側で**無効を既定にしている**。streamdown の既定（有効）ではリンクが `<a>` ではなく `<button>` で描画され、⌘クリック・中クリック・リンクアドレスのコピー・支援技術の link ロールが失われるため。確認ダイアログを挟みたい場合は明示的に有効化する:

```tsx
<Response linkSafety={{ enabled: true }}>{markdown}</Response>
```

なお `javascript:` のような危険なスキームは `linkSafety` とは無関係に rehype-harden が無効化するので、既定のままでも生きたリンクにはならない。

## Suggestion

候補プロンプトのチップ表示。クリックで `onSelect` に `value` が渡る。

```tsx
import { Suggestion } from '@k8ordo/ui/ai';

<Suggestion.List>
  <Suggestion.Item onSelect={send} value="IME 対応について教えて" />
  <Suggestion.Item onSelect={send} value="streaming">
    ストリーミング表示は？
  </Suggestion.Item>
</Suggestion.List>;
```

Props (Suggestion.List):

- `label`: string（デフォルト: `'候補'`、aria-label として使用）

Props (Suggestion.Item):

- `value`: string（必須。children 省略時は表示テキストも兼ねる）
- `onSelect`: `(value: string) => void`

## ToolInvocation

ツール呼び出しの折りたたみ表示。`state` に応じてスピナー / 成功 / エラー / 拒否のアイコンが切り替わる（承認待ち・承認応答・入力中は進行中としてスピナー）。

```tsx
import { ToolInvocation } from '@k8ordo/ui/ai';

<ToolInvocation
  name="search_web"
  state="output-available"
  input={{ query: 'k8ordo UI' }}
  output="検索結果…"
/>;
```

Props:

- `name`: string（必須、ツール名）
- `state`: ToolState（必須）
- `input`: unknown（文字列以外は JSON 表示）
- `output`: ReactNode（文字列は `pre` 表示、要素はそのまま描画）
- `errorText`: string（`state="output-error"` 時の表示。省略時は既定文言）
- `deniedReason`: string（`state="output-denied"` 時の表示。省略時は既定文言）
- `isOpen` / `defaultOpen` / `onChange`: 開閉の controlled / uncontrolled 両対応

## AI SDK 連携（mapMessageParts）

`@k8ordo/ui/ai-sdk` の `mapMessageParts` は、AI SDK の `UIMessage.parts` を描画しやすい `MappedPart[]` に変換する。React 非依存で、optional peer の `ai`（v7）が必要。

```ts
type MappedPart =
  | { kind: 'text'; text: string }
  | { kind: 'reasoning'; text: string }
  | {
      kind: 'tool';
      name: string;
      toolCallId: string;
      state: ToolState;
      input?: unknown;
      output?: unknown;
      errorText?: string;
      deniedReason?: string;
    };
```

利用側が `kind` で分岐して `Response` / `Reasoning` / `ToolInvocation` を描画する：

```tsx
import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
import { Reasoning, ToolInvocation } from '@k8ordo/ui/ai';
import { Response } from '@k8ordo/ui/ai/response';

<Message.Content>
  {mapMessageParts(message).map((part, i) => {
    if (part.kind === 'reasoning')
      return <Reasoning key={i}>{part.text}</Reasoning>;
    if (part.kind === 'tool') {
      // output は unknown なので、ReactNode に変換してから渡す
      return (
        <ToolInvocation
          key={part.toolCallId}
          name={part.name}
          state={part.state}
          input={part.input}
          output={
            typeof part.output === 'string'
              ? part.output
              : JSON.stringify(part.output, null, 2)
          }
          errorText={part.errorText}
          deniedReason={part.deniedReason}
        />
      );
    }
    return <Response key={i}>{part.text}</Response>;
  })}
</Message.Content>;
```

`ChatStatus` / `ToolState` 型は `@k8ordo/ui/ai-sdk` からも re-export される。

## 生成 UI との組み合わせ

LLM がツール結果として返した UI spec を、チャットの吹き出し内で描画できる。詳細は [生成 UI リファレンス](generative-ui.md) を参照。

```tsx
'use client';
import { Message } from '@k8ordo/ui/ai';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

<Message.Root from="assistant">
  <Message.Content>
    <JsonRenderUI spec={spec} />
  </Message.Content>
</Message.Root>;
```
