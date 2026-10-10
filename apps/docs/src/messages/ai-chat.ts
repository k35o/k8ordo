import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'AIのチャット画面を組み立てるコンポーネントです。通信とメッセージの状態はアプリが持ち、コンポーネントはメッセージの配列を表示します。AI SDKにも自前のバックエンドにもつなげます。',
  en: 'Components for building an AI chat screen. Your application holds the requests and the message state, and the components display the message array. They work with the AI SDK and with a backend of your own.',
});

export const demoTitle = message({
  ja: 'チャット画面のデモ',
  en: 'Chat demo',
});

export const demoDescription = message({
  ja: 'これらのコンポーネントで組んだチャット画面です。ツールの実行を許可すると、回答と出典が表示されます。メッセージの送信、ファイルの添付、回答のコピーや評価もできます。',
  en: 'A chat screen made of these components. Allow the tool call and the answer appears with its sources. You can also send messages, attach files, and copy or rate an answer.',
});

export const overviewTitle = message({
  ja: '基本の構成',
  en: 'Basic structure',
});

export const overviewConversation = message({
  ja: '`Conversation`は会話のスクロール領域です。新しいメッセージが来ると末尾までスクロールします。上にスクロールしているあいだは、`ScrollButton`で最新のメッセージに戻れます。',
  en: '`Conversation` is the scroll region of the log. It scrolls to the end as messages arrive. While you have scrolled up, `ScrollButton` takes you back to the latest one.',
});

export const overviewMessage = message({
  ja: '`Message.Root`は1つのメッセージです。`from="user"`は右寄せの吹き出しに、`from="assistant"`は吹き出しの無い本文になります。`avatar`はメッセージの横に置かれ、子要素はその隣に縦に並びます。',
  en: '`Message.Root` is one message. `from="user"` renders as a right-aligned bubble and `from="assistant"` as plain text without a bubble. `avatar` sits beside the message, and the children stack in a column next to it.',
});

export const overviewInput = message({
  ja: '`PromptInput`は入力欄です。3つとも`@k8ordo/ui/ai`からimportします。',
  en: '`PromptInput` is the input box. All three are imported from `@k8ordo/ui/ai`.',
});

export const inputTitle = message({
  ja: '入力欄',
  en: 'Prompt input',
});

export const inputKeys = message({
  ja: 'Enterで送信し、Shift+Enterで改行します。IMEの変換を確定するEnterでは送信しません。本文は前後の空白を除いて`onSubmit`に渡されます。本文も添付も無いメッセージは送信しません。',
  en: 'Enter sends and Shift+Enter inserts a newline. The Enter that confirms an IME composition does not send. The body reaches `onSubmit` trimmed. A message with neither text nor attachments is not sent.',
});

export const inputStatus = message({
  ja: '`status`の値はAI SDKの`status`と同じで、`ready`か`submitted`か`streaming`か`error`です。`submitted`と`streaming`のあいだは`Submit`が停止ボタンになり、押すと`onStop`が呼ばれます。',
  en: '`status` takes the AI SDK’s values: `ready`, `submitted`, `streaming` or `error`. While it is `submitted` or `streaming`, `Submit` turns into a stop button that calls `onStop`.',
});

export const attachmentsTitle = message({
  ja: 'ファイルの添付',
  en: 'Attaching files',
});

export const attachmentsAccept = message({
  ja: '`accept`を渡すと、`Attach`のファイル選択とドロップ、貼り付けでファイルを受け取ります。どの経路も、`<input accept>`と同じ規則で絞られます。`accept`が無いときはテキストだけを受け取り、`Attach`は何も表示しません。',
  en: 'Pass `accept` and files come in from the `Attach` picker, a drop and a paste. Every route is filtered by the same rule as `<input accept>`. Without `accept` the input takes text only, and `Attach` renders nothing.',
});

export const attachmentsList = message({
  ja: '送る前のファイルは`PromptInput.Attachments`に並び、それぞれに削除ボタンが付きます。`Textarea`の上に1行を使うので、先頭に置きます。`maxFiles`を超えた分は受け取りません。',
  en: 'Files waiting to be sent are listed in `PromptInput.Attachments`, each with a remove button. It takes a row of its own above the `Textarea`, so put it first. Files beyond `maxFiles` are not accepted.',
});

export const attachmentsSubmit = message({
  ja: "`onSubmit`の第2引数が`FileList`で、AI SDKの`sendMessage`にそのまま渡せます。添付だけを送るときは`{ files }`だけを渡します。`text: ''`を渡すと空のテキストパートになり、プロバイダによってはエラーになります。",
  en: "`onSubmit` receives them as a `FileList` in its second argument, which the AI SDK’s `sendMessage` takes as it is. To send files alone, pass `{ files }` only. Passing `text: ''` creates an empty text part, which some providers reject with an error.",
});

export const suggestionTitle = message({
  ja: '質問の候補',
  en: 'Suggested prompts',
});

export const suggestionDescription = message({
  ja: '`Suggestion.Item`は候補のチップです。押すと`value`が`onSelect`に渡ります。`children`を省くと、`value`がそのまま表示の文字になります。',
  en: '`Suggestion.Item` is a chip for one prompt. Pressing it passes `value` to `onSelect`. Without `children`, `value` is also the visible text.',
});

export const responseTitle = message({
  ja: 'Markdownの表示',
  en: 'Markdown',
});

export const responseDescription = message({
  ja: '`Response`は、ストリーミング中のMarkdownを表示します。閉じていないコードブロックがあっても崩れません。`@k8ordo/ui/ai/response`からimportします。',
  en: '`Response` renders Markdown while it is still arriving, and an unclosed code block does not break it. It is imported from `@k8ordo/ui/ai/response`.',
});

export const responseInstall = message({
  ja: (version: string) =>
    `\`streamdown\`の${version}以上を入れ、そのスタイルシートを読み込みます。`,
  en: (version) =>
    `Install \`streamdown\` ${version} or later, and load its stylesheet.`,
});

export const responseTailwind = message({
  ja: "`streamdown`のスタイルは`styles.css`に含まれません。`Response`を使うアプリでは、`@k8ordo/ui/tailwind.css`を読み込むTailwindのビルドが必要です。アプリのCSSに`@source '../node_modules/streamdown/dist/*.js';`を足します。パスはそのCSSファイルから`node_modules`への相対パスです。",
  en: "`streamdown`’s styles are not part of `styles.css`. An app that uses `Response` needs a Tailwind build that loads `@k8ordo/ui/tailwind.css`. Add `@source '../node_modules/streamdown/dist/*.js';` to the app’s CSS; the path is relative from that CSS file to `node_modules`.",
});

export const toolTitle = message({
  ja: 'ツールと思考の表示',
  en: 'Tool calls and reasoning',
});

export const toolInvocation = message({
  ja: '`ToolInvocation`はツールの呼び出しを折りたたみで表示します。アイコンは`state`に応じて変わります。実行中はスピナーで、終わると成功かエラーか拒否のアイコンになります。`state`の値はAI SDKのツールのパートと同じです。',
  en: '`ToolInvocation` shows a tool call in a collapsible panel. The icon follows `state`: a spinner while it runs, then success, error or denied. The values of `state` are the AI SDK’s tool part states.',
});

export const toolIo = message({
  ja: '`input`は文字列以外ならJSONで表示されます。`output`は文字列なら`pre`に、要素ならそのまま表示されます。`Reasoning`は思考の過程を折りたたみで表示します。`isStreaming`のあいだは、ラベルが「思考中…」になります。',
  en: '`input` is shown as JSON unless it is a string. A string `output` goes in a `pre`, and an element renders as it is. `Reasoning` shows the model’s reasoning in a collapsible panel. While `isStreaming`, its label says it is thinking.',
});

export const approvalTitle = message({
  ja: 'ツールの承認',
  en: 'Tool approval',
});

export const approvalButtons = message({
  ja: '`state`が`approval-requested`のときは、`approval`と`onApprovalResponse`を渡します。折りたたみの外に、問いと「拒否」「許可」のボタンが出ます。問いは`approval.requestReason`で、無ければ既定の文言です。押すと`onApprovalResponse({ id, approved })`が呼ばれます。',
  en: 'When `state` is `approval-requested`, pass `approval` and `onApprovalResponse`. A question with Deny and Allow buttons appears outside the folded panel. The question is `approval.requestReason`, or the default wording without one. Pressing a button calls `onApprovalResponse({ id, approved })`.',
});

export const approvalSdk = message({
  ja: 'この形はAI SDKの`addToolApprovalResponse`の引数と同じなので、そのまま渡せます。答えを自動で送り返すには、`useChat`に`sendAutomaticallyWhen`を渡します。無ければ、答えたあとに何も起きません。',
  en: 'That is what the AI SDK’s `addToolApprovalResponse` takes, so pass it as it is. To send the answer back automatically, give `useChat` a `sendAutomaticallyWhen`; without it nothing happens after the user answers.',
});

export const approvalCases = message({
  ja: '`approval.isAutomatic`のときは問いもボタンも出ません。`onApprovalResponse`が無ければ、問いだけが出ます。`output-denied`では`approval.reason`が理由として表示されます。',
  en: 'With `approval.isAutomatic` neither the question nor the buttons appear. Without `onApprovalResponse` only the question appears. In `output-denied`, `approval.reason` is shown as the reason.',
});

export const partsTitle = message({
  ja: '添付ファイルと出典',
  en: 'Attachments and sources',
});

export const partsAttachment = message({
  ja: '`Attachment.Item`は、メッセージに添えられたファイルです。画像は`filename`を代替テキストにしたサムネイルに、それ以外は名前と種類のチップになります。画像の`url`は描画と同時に読み込まれるので、自分のサーバーが作ったURLかdata URLを渡します。',
  en: '`Attachment.Item` is a file attached to a message. An image shows as a thumbnail with `filename` as its alt text, and anything else as a chip with the name and media type. An image `url` is loaded as soon as it renders, so pass a URL your own server produced or a data URL.',
});

export const partsSource = message({
  ja: '`Source.Item`は回答の出典です。`href`がhttp(s)のURLなら、新しいタブで開くリンクになります。表示する文字列は`title`で、無ければホスト名です。それ以外は文字だけで表示されます。',
  en: '`Source.Item` is a source the answer cites. With an http(s) `href` it is a link that opens in a new tab. Its text is `title`, or the host name without one. Anything else is plain text.',
});

export const actionsTitle = message({
  ja: 'メッセージの操作',
  en: 'Message actions',
});

export const actionsRow = message({
  ja: '`Message.Actions`は、メッセージの下に置くアイコンボタンの列です。`Copy`と`Regenerate`と`Feedback`は、アイコンと文言を持っています。ほかの操作は、`Action`に`label`とアイコンを渡して足します。`label`はツールチップにも出ます。',
  en: '`Message.Actions` is the row of icon buttons under a message. `Copy`, `Regenerate` and `Feedback` bring their own icons and labels. Any other action is an `Action` with a `label` and an icon. The `label` is also the tooltip.',
});

export const actionsBehavior = message({
  ja: '`onAction`がPromiseを返すと、終わるまでボタンは押せなくなります。`Feedback`は2つのトグルです。押したものをもう一度押すと解除され、`onChange`に`null`が渡ります。',
  en: 'When `onAction` returns a promise, the button stays busy until it settles. `Feedback` is a pair of toggles. Pressing the pressed one again clears it, and `onChange` receives `null`.',
});

export const aiSdkTitle = message({
  ja: 'AI SDKとの連携',
  en: 'AI SDK integration',
});

export const aiSdkMap = message({
  ja: '`@k8ordo/ui/ai-sdk`の`mapMessageParts`は、AI SDKの`UIMessage.parts`を表示しやすい1次元の配列に変えます。パートは種類にかかわらず元の順に並びます。',
  en: '`mapMessageParts` from `@k8ordo/ui/ai-sdk` turns the AI SDK’s `UIMessage.parts` into a single array that is easy to render. Parts of every kind stay in their original order.',
});

export const aiSdkRender = message({
  ja: 'ツールのパートは`approval`も含むので、`ToolInvocation`にそのまま渡せます。ファイルと出典は`filter`で先に取り出し、それぞれ1つの一覧にまとめます。`data`のパートは`name`で選び、中身を検証してから表示します。',
  en: 'A tool part carries its `approval`, so it can be handed to `ToolInvocation` as it is. Pull the files and sources out with `filter` first and show each as one list. Pick `data` parts by `name` and validate their contents before rendering them.',
});

export const aiSdkVersion = message({
  ja: (version: string) =>
    `\`ai\`は任意のpeer dependencyです。${version}以上を入れます。`,
  en: (version) =>
    `\`ai\` is an optional peer dependency. Install ${version} or later.`,
});

export const jsonRenderTitle = message({
  ja: '吹き出しの中の生成UI',
  en: 'Generative UI in a bubble',
});

export const jsonRenderDescription = message({
  ja: '`Message.Content`の子要素は自由です。LLMがツールの結果として返したUIのspecを、json-renderのアダプタで吹き出しの中に表示できます。',
  en: '`Message.Content` takes any children. A UI spec the model returned as a tool result can be rendered inside the bubble with the json-render adapter.',
});

export const jsonRenderAdapter = message({
  ja: 'アダプタの使い方は',
  en: 'For how to use the adapter, see ',
});

export const see = message({
  ja: 'を見てください。',
  en: '.',
});

export const propsDescription = message({
  ja: 'コンポーネントの型から作ったpropsの一覧です。`label`や`sendLabel`を省くと、`@k8ordo/i18n`の現在のロケールの辞書の文言になります。`Reasoning`と`ToolInvocation`の開閉、`Message.Feedback`の値は、制御と非制御のどちらでも使えます。',
  en: 'The props, derived from the component types. Leave out `label` or `sendLabel` and the text comes from the current `@k8ordo/i18n` locale’s dictionary. The open state of `Reasoning` and `ToolInvocation` and the value of `Message.Feedback` work controlled or uncontrolled.',
});

export const demo = {
  greeting: message({
    ja: 'こんにちは。k8ordo UIのAIチャットについて、何でも聞いてください。',
    en: 'Hi! Ask me anything about the k8ordo UI AI chat components.',
  }),
  seedQuestion: message({
    ja: 'ReactでAIチャットを作るとき、何から始めればいい？',
    en: 'Where should I start when building an AI chat in React?',
  }),
  seedReasoning: message({
    ja: '土台は会話の領域と吹き出し、入力欄の3つ。Markdownやツールの表示はあとから足せる。',
    en: 'The conversation area, message bubbles, and the input are the foundation. Markdown and tool views can come later.',
  }),
  seedToolOutput: message({
    ja: 'Conversation、Message、PromptInputの3つから始めるのがおすすめです。',
    en: 'Starting with Conversation, Message, and PromptInput is recommended.',
  }),
  seedAnswer: message({
    ja: 'まずはConversation、Message、PromptInputの3つで会話の骨組みを作ります。そのあとで、MarkdownのResponseやToolInvocationを足していくのがおすすめです。',
    en: 'Start with Conversation, Message, and PromptInput to frame the conversation, then add Response (Markdown) and ToolInvocation on top.',
  }),
  seedApprovalReason: message({
    ja: 'k8ordo UIのドキュメントを検索します。',
    en: 'Searches the k8ordo UI docs.',
  }),
  seedSourceTitle: message({
    ja: 'AIチャット · k8ordo',
    en: 'AI chat · k8ordo',
  }),
  reply: message({
    ja: 'なるほど。ドキュメントの該当箇所をまとめますね。',
    en: 'Got it — let me pull together the relevant docs.',
  }),
  suggestionIme: message({
    ja: 'IME対応について教えて',
    en: 'Tell me about IME support',
  }),
  suggestionStreaming: message({
    ja: 'ストリーミング表示は？',
    en: 'How does streaming rendering work?',
  }),
  suggestionTool: message({
    ja: 'ツール呼び出しの表示例',
    en: 'Show me a tool call example',
  }),
  placeholder: message({
    ja: 'メッセージを入力…',
    en: 'Type a message…',
  }),
};
