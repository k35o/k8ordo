# @k8ordo/ui AI chat components

Components for building an AI chat UI: the conversation log, messages, the input box, reasoning display, and tool-invocation display. Import them from their dedicated subpaths rather than from the root.

## Importing

```tsx
// Core components (no extra dependencies)
import {
  Conversation,
  Message,
  PromptInput,
  Reasoning,
  Suggestion,
  ToolInvocation,
} from '@k8ordo/ui/ai';

// Streaming-aware Markdown rendering (optional peer: streamdown)
import { Response } from '@k8ordo/ui/ai/response';

// AI SDK integration (optional peer: ai)
import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
```

The types are exported from `@k8ordo/ui/ai` too:

- `ChatStatus`: `'ready' | 'submitted' | 'streaming' | 'error'` (compatible with the AI SDK's `status`)
- `ToolState`: `'input-streaming' | 'input-available' | 'approval-requested' | 'approval-responded' | 'output-available' | 'output-error' | 'output-denied'` (1:1 with the AI SDK v7 tool states)

### Setting up the optional peers

Install only what the subpaths you use require. `@k8ordo/ui/ai` itself needs neither.

```bash
# If you use @k8ordo/ui/ai/response (Response)
pnpm add streamdown
# If you use @k8ordo/ui/ai-sdk (mapMessageParts)
pnpm add ai
```

Using `Response` also means loading streamdown's stylesheet and adding a Tailwind `@source` entry. streamdown's styles are not part of the prebuilt `styles.css`, so `Response` alone requires a Tailwind CSS 4 build (the `@k8ordo/ui/tailwind.css` entry):

```tsx
import 'streamdown/styles.css';
```

```css
/* Add to your app's CSS entry (the path is relative from the CSS file to node_modules) */
@source '../node_modules/streamdown/dist/*.js';
```

The `useChat` used in the examples below comes from the AI SDK's React bindings (`pnpm add @ai-sdk/react`).

The "default" shown for `label`, `sendLabel`, and similar props below is the message dictionary's default (Japanese). Swap the whole dictionary with `<UIProvider messages={en}>` (see [i18n](components.md)). Passing the prop directly wins over the dictionary.

## The whole picture

`Conversation` (the log), `Message` (a bubble), and `PromptInput` (the input box) form the skeleton. `Response`, `Reasoning`, and `ToolInvocation` can be added later.

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
        <PromptInput.Textarea placeholder="Type a message" />
        <PromptInput.Submit />
      </PromptInput.Root>
    </div>
  );
}
```

## Conversation

The scrolling region for the conversation log, as a compound component. It sticks to the bottom and auto-scrolls on a new message. Once you scroll away from the bottom, a `ScrollButton` appears.

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

- `label`: string (default: `'チャット'`, used as the aria-label)
- `isStreaming`: boolean (reflected in `aria-busy`)

Props (Conversation.ScrollButton):

- `label`: string (default: `'最新のメッセージへ移動'`)

## Message

A single message. `from="user"` renders as a right-aligned bubble; `from="assistant"` renders as running text. An avatar or anything else can sit freely as a child of `Message.Root`.

```tsx
import { Message } from '@k8ordo/ui/ai';

<Message.Root from="user">
  <Message.Content>Hello</Message.Content>
</Message.Root>

<Message.Root from="assistant">
  <Message.Content isStreaming>Text still streaming…</Message.Content>
</Message.Root>
```

Props (Message.Root):

- `from`: `'user'` | `'assistant'` (required)

Props (Message.Content):

- `isStreaming`: boolean (shows the streaming cursor when true)

## PromptInput

The submit form. Enter sends; Shift+Enter inserts a newline; the Enter that commits an IME conversion does not send. While `status` is `'submitted'` or `'streaming'`, `Submit` turns into a stop button. The body is trimmed, and an empty string is never sent.

```tsx
import { PromptInput } from '@k8ordo/ui/ai';

<PromptInput.Root
  status={status}
  onSubmit={(message) => send(message)}
  onStop={stop}
>
  <PromptInput.Textarea placeholder="Type a message" />
  <PromptInput.Submit />
</PromptInput.Root>;
```

Props (PromptInput.Root):

- `status`: ChatStatus (default: `'ready'`)
- `value` / `defaultValue` / `onChange`: supports both controlled and uncontrolled use (`onChange` is `(value: string) => void`)
- `onSubmit`: `(message: string) => void` (the trimmed body)
- `onStop`: `() => void` (when the stop button is pressed mid-send)

Props (PromptInput.Textarea):

- `placeholder`: string, plus the other textarea attributes

Props (PromptInput.Submit):

- `sendLabel`: string (default: `'送信'`)
- `stopLabel`: string (default: `'停止'`)

## Reasoning

A collapsible view of the model's reasoning. While streaming, the label reads 「思考中…」.

```tsx
import { Reasoning } from '@k8ordo/ui/ai';

<Reasoning isStreaming={isThinking}>{reasoningText}</Reasoning>;
```

Props:

- `isStreaming`: boolean
- `isOpen` / `defaultOpen` / `onChange`: open state, controlled or uncontrolled (`onChange` is `(isOpen: boolean) => void`)

## Response

A streaming-aware Markdown renderer. It renders half-finished Markdown — an unclosed code block, say — without breaking. Requires the optional peer `streamdown` (see [setup](#setting-up-the-optional-peers)).

```tsx
import { Response } from '@k8ordo/ui/ai/response';
import 'streamdown/styles.css';

<Message.Content>
  <Response isStreaming={isStreaming}>{markdown}</Response>
</Message.Content>;
```

Props:

- `children`: string (the Markdown, required)
- `isStreaming`: boolean
- Every other streamdown prop (`translations`, `controls`, `linkSafety`, `plugins`, `components`, `urlTransform`, `dir`, …) passes straight through. The library owns `className` and `mode` (`mode` is derived from `isStreaming`)

The wording comes from the i18n dictionary, so by default strings such as 「コードをコピー」 and 「表をダウンロード」 appear in Japanese. Pass `translations` to change individual strings (prop > dictionary > streamdown's own default).

The library **defaults `linkSafety` to off**. With streamdown's own default (on), links render as `<button>` rather than `<a>`, which loses ⌘-click, middle-click, copying the link address, and the link role for assistive technology. Turn it on explicitly if you want the confirmation dialog:

```tsx
<Response linkSafety={{ enabled: true }}>{markdown}</Response>
```

Dangerous schemes such as `javascript:` are neutralized by rehype-harden regardless of `linkSafety`, so they never become live links even with the default.

## Suggestion

Suggested prompts shown as chips. Clicking one passes its `value` to `onSelect`.

```tsx
import { Suggestion } from '@k8ordo/ui/ai';

<Suggestion.List>
  <Suggestion.Item onSelect={send} value="Tell me about IME support" />
  <Suggestion.Item onSelect={send} value="streaming">
    How does streaming display work?
  </Suggestion.Item>
</Suggestion.List>;
```

Props (Suggestion.List):

- `label`: string (default: `'候補'`, used as the aria-label)

Props (Suggestion.Item):

- `value`: string (required; also serves as the visible text when children is omitted)
- `onSelect`: `(value: string) => void`

## ToolInvocation

A collapsible view of a tool call. The icon switches between spinner, success, error, and denied according to `state` (awaiting approval, approval responded, and input streaming all count as in-progress and show the spinner).

```tsx
import { ToolInvocation } from '@k8ordo/ui/ai';

<ToolInvocation
  name="search_web"
  state="output-available"
  input={{ query: 'k8ordo UI' }}
  output="Search results…"
/>;
```

Props:

- `name`: string (required, the tool name)
- `state`: ToolState (required)
- `input`: unknown (anything other than a string is shown as JSON)
- `output`: ReactNode (a string is shown in a `pre`; an element renders as-is)
- `errorText`: string (shown when `state="output-error"`; falls back to the default wording)
- `deniedReason`: string (shown when `state="output-denied"`; falls back to the default wording)
- `isOpen` / `defaultOpen` / `onChange`: open state, controlled or uncontrolled

## AI SDK integration (mapMessageParts)

`mapMessageParts` from `@k8ordo/ui/ai-sdk` converts the AI SDK's `UIMessage.parts` into a `MappedPart[]` that is easy to render. It has no React dependency and requires the optional peer `ai` (v7).

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

The caller switches on `kind` and renders `Response`, `Reasoning`, or `ToolInvocation`:

```tsx
import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
import { Reasoning, ToolInvocation } from '@k8ordo/ui/ai';
import { Response } from '@k8ordo/ui/ai/response';

<Message.Content>
  {mapMessageParts(message).map((part, i) => {
    if (part.kind === 'reasoning')
      return <Reasoning key={i}>{part.text}</Reasoning>;
    if (part.kind === 'tool') {
      // output is unknown, so convert it to a ReactNode before passing it on
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

The `ChatStatus` and `ToolState` types are re-exported from `@k8ordo/ui/ai-sdk` as well.

## Combining with generative UI

A UI spec returned by an LLM as a tool result can be rendered inside a chat bubble. See the [generative UI reference](generative-ui.md) for details.

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
