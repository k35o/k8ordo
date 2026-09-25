# @k8ordo/ui AI chat components

Components for building an AI chat UI: the conversation log, messages and their actions, the input box with attachments, reasoning display, tool-invocation display with approval, attachments, and sources. Import them from their dedicated subpaths rather than from the root.

## Importing

```tsx
// Core components (no extra dependencies)
import {
  Attachment,
  Conversation,
  Message,
  PromptInput,
  Reasoning,
  Source,
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
- `ToolApproval`: `{ id: string; approved?: boolean; reason?: string; requestReason?: string; isAutomatic?: boolean }` (the shape of the AI SDK's `part.approval`, so the part's own object can be passed as is)
- `ToolApprovalResponse`: `{ id: string; approved: boolean }` (what `ToolInvocation` answers with)
- `MessageFeedback`: `'positive' | 'negative'`

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

`Conversation` (the log), `Message` (a bubble), and `PromptInput` (the input box) form the skeleton. `Response`, `Reasoning`, `ToolInvocation`, `Attachment`, `Source`, and the message actions can be added later — [AI SDK integration](#ai-sdk-integration-mapmessageparts) shows all of them together.

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
              avatar={
                m.role === 'user' ? undefined : (
                  <Avatar
                    color="primary"
                    icon={<AssistantIcon />}
                    name="AI"
                    size="sm"
                  />
                )
              }
              from={m.role === 'user' ? 'user' : 'assistant'}
              key={m.id}
            >
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

A single message. `from="user"` renders as a right-aligned bubble; `from="assistant"` renders as running text. `avatar` sits beside the message, and the children stack in a column next to it — attachments, the content, sources, and the actions each get their own row.

```tsx
import { Message } from '@k8ordo/ui/ai';

<Message.Root from="user">
  <Message.Content>Hello</Message.Content>
</Message.Root>

<Message.Root avatar={<Avatar icon={<AssistantIcon />} name="AI" size="sm" />} from="assistant">
  <Message.Content isStreaming>Text still streaming…</Message.Content>
</Message.Root>
```

Props (Message.Root):

- `from`: `'user'` | `'assistant'` (required)
- `avatar`: ReactNode (shown beside the message: left for the assistant, right for the user)
- plus the other `div` attributes (`className` and `style` excluded)

Props (Message.Content):

- `isStreaming`: boolean (shows the streaming cursor when true)
- plus the other `div` attributes (`className` and `style` excluded)

### Message actions

`Message.Actions` is the row of icon buttons under a message. `Copy`, `Regenerate`, and `Feedback` carry their own icons and dictionary labels; `Action` is the generic one for anything else. Each shows its label as a tooltip.

```tsx
<Message.Root avatar={avatar} from="assistant">
  <Message.Content>{text}</Message.Content>
  <Message.Actions>
    <Message.Copy value={text} />
    <Message.Regenerate
      disabled={status === 'submitted' || status === 'streaming'}
      onAction={() => regenerate({ messageId: message.id })}
    />
    <Message.Feedback onChange={(value) => saveFeedback(message.id, value)} />
    <Message.Action label="Share" onAction={() => share(message.id)}>
      <LinkIcon size="sm" />
    </Message.Action>
  </Message.Actions>
</Message.Root>
```

- `Copy` writes `value` to the clipboard and switches to 「コピーしました」 with a check icon for two seconds, announced through a `status` region. If the clipboard refuses, nothing changes and nothing is thrown.
- `Regenerate` and `Action` take `onAction`; a returned promise keeps the button busy (`aria-busy`, disabled) until it settles, so `() => regenerate(...)` does not need its own pending state.
- `Feedback` is a pair of toggle buttons (`aria-pressed`). Pressing the pressed one again clears it, so `onChange` receives `null`.

Props (Message.Actions):

- `label`: string (default: `'メッセージの操作'`, used as the group's aria-label)

Props (Message.Action):

- `label`: string (required; the accessible name and the tooltip)
- `onAction`: `() => void | Promise<void>`
- `disabled`: boolean
- `children`: ReactNode (the icon, `size="sm"`)

Props (Message.Copy):

- `value`: string (required; the text to copy)
- `label`: string (default: `'コピー'`)

Props (Message.Regenerate):

- `onAction`: `() => void | Promise<void>` (required)
- `label`: string (default: `'再生成'`)
- `disabled`: boolean

Props (Message.Feedback):

- `value` / `defaultValue` / `onChange`: `MessageFeedback | null`, controlled or uncontrolled (`onChange` is `(value: MessageFeedback | null) => void`; `null` is no feedback)

## PromptInput

The submit form. Enter sends; Shift+Enter inserts a newline; the Enter that commits an IME conversion does not send. While `status` is `'submitted'` or `'streaming'`, `Submit` turns into a stop button. The body is trimmed, and a message with neither text nor attachments is never sent.

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

### Attachments

Pass `accept` to take files. It turns on all three ways in — the `Attach` button's file picker, dropping files onto the input, and pasting them into the textarea — and filters every one of them by the same rule as `<input accept>` (the browser applies it only to the picker). Without `accept` the input takes text only: `Attach` renders nothing and dropped or pasted files are ignored.

`PromptInput.Attachments` lists the files waiting to be sent, image thumbnails included, each with a remove button. `onSubmit` receives them as a `FileList` in its second argument, which the AI SDK's `sendMessage` takes as is. The list empties after each submit, and a message with attachments but no text can be sent — pass `{ files }` alone then, since `sendMessage` turns `text: ''` into an empty text part that some providers reject.

```tsx
<PromptInput.Root
  accept="image/*,application/pdf"
  maxFiles={4}
  onStop={stop}
  onSubmit={(text, files) =>
    sendMessage(text === '' ? { files } : { text, files })
  }
  status={status}
>
  <PromptInput.Attachments />
  <PromptInput.Attach />
  <PromptInput.Textarea placeholder="Type a message" />
  <PromptInput.Submit />
</PromptInput.Root>
```

Put `Attachments` first: it takes a row of its own above the textarea. Choose `accept` from what your model reads — the AI SDK turns `image/*` and `text/*` into model input by itself, and other types need handling on your server.

Props (PromptInput.Root):

- `status`: ChatStatus (default: `'ready'`)
- `value` / `defaultValue` / `onChange`: supports both controlled and uncontrolled use (`onChange` is `(value: string) => void`)
- `onSubmit`: `(message: string, files: FileList) => void` (the trimmed body, and the attachments — an empty `FileList` when there are none)
- `onStop`: `() => void` (when the stop button is pressed mid-send)
- `accept`: string (the file types to take, in `<input accept>` syntax; omit to take no files)
- `maxFiles`: number (files beyond it are dropped, first come first kept)

Props (PromptInput.Attachments):

- `label`: string (default: `'添付ファイル'`, used as the list's aria-label)

Props (PromptInput.Attach):

- `label`: string (default: `'ファイルを添付'`)

Props (PromptInput.Textarea):

- `placeholder`: string, plus the other textarea attributes

Props (PromptInput.Submit):

- `sendLabel`: string (default: `'送信'`)
- `stopLabel`: string (default: `'停止'`)

## Attachment

Files attached to a sent message. An image (`image/*`, or the bare `image` the AI SDK allows) shows as a thumbnail with `filename` as its alt text; anything else shows as a chip with its name and media type.

```tsx
import { Attachment } from '@k8ordo/ui/ai';

<Message.Root from="user">
  <Attachment.List>
    {files.map((file) => (
      <Attachment.Item
        filename={file.filename}
        key={file.url}
        mediaType={file.mediaType}
        url={file.url}
      />
    ))}
  </Attachment.List>
  <Message.Content>{text}</Message.Content>
</Message.Root>;
```

Props (Attachment.List):

- `label`: string (default: `'添付ファイル'`, used as the list's aria-label)

Props (Attachment.Item):

- `url`: string (required; a hosted URL or a data URL)
- `mediaType`: string (required)
- `filename`: string (without it an image's alt text is 「添付画像」 and a file chip shows the media type)

## Source

The sources a response cites. An item with an `http(s)` `href` is a link that opens in a new tab, labelled by `title` or else the host name; anything else — a document source, or a URL with another scheme — is plain text. The URL comes from the model, so a `javascript:` URL never becomes a link.

```tsx
import { Source } from '@k8ordo/ui/ai';

<Source.List>
  <Source.Item href="https://ordo.k8o.me/ui/ai/chat" title="AI chat" />
  <Source.Item title="Internal design doc v3" />
</Source.List>;
```

Props (Source.List):

- `label`: string (default: `'出典'`, used as the list's aria-label)

Props (Source.Item):

- `href`: string (the source's URL)
- `title`: string (the source's title; falls back to the host name)

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

A collapsible view of a tool call. The icon switches between spinner, success, error, and denied according to `state` (approval responded and input streaming count as in-progress and show the spinner).

```tsx
import { ToolInvocation } from '@k8ordo/ui/ai';

<ToolInvocation
  name="search_web"
  state="output-available"
  input={{ query: 'k8ordo UI' }}
  output="Search results…"
/>;
```

### Approval

When `state` is `'approval-requested'`, the tool is waiting for the user. Pass the part's `approval` and an `onApprovalResponse`, and a question with Deny / Allow buttons appears below the header — outside the collapsible panel, so it is visible without expanding the call; the input stays one click away in the panel. Pressing one calls `onApprovalResponse({ id: approval.id, approved })`, which is exactly what the AI SDK's `addToolApprovalResponse` takes. Both buttons stay disabled until a returned promise settles.

```tsx
<ToolInvocation
  name={part.name}
  state={part.state}
  input={part.input}
  approval={part.approval}
  onApprovalResponse={addToolApprovalResponse}
/>
```

- The question is `approval.requestReason` when the server gave one, 「このツールの実行を許可しますか？」 otherwise.
- An automatic decision (`approval.isAutomatic`) shows no question and no buttons; there is nothing for the user to answer.
- Without `onApprovalResponse`, the question shows but the buttons do not.
- In `'output-denied'`, the panel explains the denial with `approval.reason`, falling back to the default wording.

With the AI SDK, send the answer back automatically with `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses` on `useChat`; otherwise nothing happens after the user answers.

Props:

- `name`: string (required, the tool name)
- `state`: ToolState (required)
- `input`: unknown (anything other than a string is shown as JSON)
- `output`: ReactNode (a string is shown in a `pre`; an element renders as-is)
- `errorText`: string (shown when `state="output-error"`; falls back to the default wording)
- `approval`: ToolApproval (the approval being asked for or answered; its `reason` explains an `output-denied` call)
- `onApprovalResponse`: `(response: ToolApprovalResponse) => void | PromiseLike<void>` (called with the approval `id` and the user's answer)
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
      approval?: ToolApproval; // the part's own approval object, id included
    }
  | { kind: 'file'; url: string; mediaType: string; filename?: string }
  | {
      kind: 'source'; // both source-url and source-document
      id: string;
      url?: string; // source-url only
      title?: string;
      mediaType?: string; // source-document only
      filename?: string; // source-document only
    }
  | { kind: 'data'; name: string; id?: string; data: unknown }; // `data-weather` → name 'weather'
```

Order is preserved. `step-start`, `custom`, and `reasoning-file` parts are skipped.

Render each part as its own row under `Message.Root` — the children stack in a column. Files and sources read better as one list each, so pull them out with `filter` and skip them in the loop. A `data` part is yours: pick the ones you know by `name`, and validate what the model put in them before drawing it.

```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';
import type { UIMessage } from 'ai';
import { Avatar, AssistantIcon } from '@k8ordo/ui';
import {
  Attachment,
  Message,
  Reasoning,
  Source,
  ToolInvocation,
} from '@k8ordo/ui/ai';
import { Response } from '@k8ordo/ui/ai/response';
import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
import { validateGeneratedSpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

type Chat = ReturnType<typeof useChat>;

function ChatMessage({ message, chat }: { message: UIMessage; chat: Chat }) {
  const parts = mapMessageParts(message);
  const files = parts.filter((part) => part.kind === 'file');
  const sources = parts.filter((part) => part.kind === 'source');
  const text = parts
    .map((part) => (part.kind === 'text' ? part.text : ''))
    .join('');
  const isUser = message.role === 'user';

  return (
    <Message.Root
      avatar={
        isUser ? undefined : (
          <Avatar icon={<AssistantIcon />} name="AI" size="sm" />
        )
      }
      from={isUser ? 'user' : 'assistant'}
    >
      {files.length > 0 && (
        <Attachment.List>
          {files.map((file) => (
            <Attachment.Item
              filename={file.filename}
              key={file.url}
              mediaType={file.mediaType}
              url={file.url}
            />
          ))}
        </Attachment.List>
      )}
      {parts.map((part, i) => {
        const key = `${message.id}-${i}`;
        if (part.kind === 'text') {
          return (
            <Message.Content key={key}>
              <Response>{part.text}</Response>
            </Message.Content>
          );
        }
        if (part.kind === 'reasoning') {
          return <Reasoning key={key}>{part.text}</Reasoning>;
        }
        if (part.kind === 'tool') {
          return (
            <ToolInvocation
              approval={part.approval}
              errorText={part.errorText}
              input={part.input}
              key={part.toolCallId}
              name={part.name}
              onApprovalResponse={chat.addToolApprovalResponse}
              // output is unknown, so convert it to a ReactNode first
              output={
                part.output === undefined
                  ? undefined
                  : JSON.stringify(part.output, null, 2)
              }
              state={part.state}
            />
          );
        }
        if (part.kind === 'data' && part.name === 'ui') {
          const result = validateGeneratedSpec(part.data);
          return result.ok ? (
            <JsonRenderUI key={key} spec={result.spec} />
          ) : null;
        }
        return null;
      })}
      {sources.length > 0 && (
        <Source.List>
          {sources.map((source) => (
            <Source.Item
              href={source.url}
              key={source.id}
              title={source.title}
            />
          ))}
        </Source.List>
      )}
      {!isUser && text !== '' && (
        <Message.Actions>
          <Message.Copy value={text} />
          <Message.Regenerate
            disabled={
              chat.status === 'submitted' || chat.status === 'streaming'
            }
            onAction={() => chat.regenerate({ messageId: message.id })}
          />
          <Message.Feedback />
        </Message.Actions>
      )}
    </Message.Root>
  );
}

export function Chat() {
  const chat = useChat({
    // sends the answers back as soon as every pending approval has one
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });
  // … Conversation.Root / chat.messages.map((message) => <ChatMessage … />) / PromptInput
}
```

`examples/ui-integrations` in the repository runs this against the real `useChat`, with a scripted transport in place of a model.

`@k8ordo/ui/ai-sdk` exports the `MappedPart` type, and re-exports the `ChatStatus`, `ToolState`, `ToolApproval`, and `ToolApprovalResponse` types as well.

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
