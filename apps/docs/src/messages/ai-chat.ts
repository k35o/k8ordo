import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'AIのチャット画面を組み立てる部品です。通信やメッセージの状態は持たないので、アプリが持つメッセージの配列を`messages.map()`で描くだけで使えます。そのため、AI SDKにも自前のバックエンドにもつなげます。どれも`@k8ordo/ui/ai`からimportします。',
  en: 'Parts for building an AI chat screen. They hold no requests and no message state: map over the messages your application already has, and they draw them. That is why they connect to the AI SDK and to a backend of your own alike. Everything is imported from `@k8ordo/ui/ai`.',
});

export const demoTitle = message({
  ja: '動かしてみる',
  en: 'Try it',
});

export const demoDescription = message({
  ja: '部品を組み合わせた、実際に動くチャット画面です。ツールの実行を許可すると、回答と出典が届きます。候補を選ぶか、メッセージを書いて送ると、吹き出しが会話に積まれていきます。ファイルを添えたり、回答をコピーしたり評価したりもできます。',
  en: 'A working chat screen made of these parts. Allow the tool call and the answer arrives with its sources. Pick a suggestion or write a message and send it, and bubbles stack up in the conversation. You can attach files, and copy or rate an answer.',
});

export const suggestionTitle = message({
  ja: '質問の候補を並べる',
  en: 'Offer suggested prompts',
});

export const suggestionDescription = message({
  ja: '`Suggestion`は、よくある質問をチップで並べます。選ばれたチップの値は、そのまま送信の関数に渡ります。',
  en: '`Suggestion` lays out common prompts as chips. The value of the chip picked goes straight to your send function.',
});

export const overviewTitle = message({
  ja: '会話を組み立てる',
  en: 'Compose a conversation',
});

export const overviewDescription = message({
  ja: '`Conversation`は会話のスクロール領域で、新しいメッセージが来ると末尾に追従し、遡っているときは「最新へ」のボタンを出します。`Message`はroleごとの吹き出しで、`PromptInput`は入力欄です。`Message.Root`の`avatar`は吹き出しの横に置かれ、子要素はその隣に縦に積まれます。',
  en: '`Conversation` is the scroll region: it follows the end as messages arrive, and shows a button back to the latest while you read back. `Message` is a bubble per role, and `PromptInput` is the composer. `Message.Root` puts its `avatar` beside the bubble and stacks its children next to it.',
});

export const inputTitle = message({
  ja: '入力欄で送る',
  en: 'Send from the composer',
});

export const inputDescription = message({
  ja: 'Enterで送信し、Shift+Enterで改行します。ただし、IMEの変換を確定するEnterでは送信しません。`status`はAI SDKと同じく`ready`と`submitted`、`streaming`、`error`のどれかです。応答を待つあいだは、ボタンが送信から停止に変わります。',
  en: 'Enter sends and Shift+Enter starts a new line, but the Enter that confirms an IME composition never sends. `status` takes the AI SDK’s values, `ready`, `submitted`, `streaming` and `error`, and while a reply is on its way the button turns from send into stop.',
});

export const attachmentsTitle = message({
  ja: 'ファイルを添える',
  en: 'Attach files',
});

export const attachmentsDescription = message({
  ja: '`PromptInput.Root`に`accept`を渡すと、`Attach`での選択、ドロップ、貼り付けのどれでもファイルを受け取ります。どの経路でも、同じ`accept`で選り分けます。送る前の添付は`PromptInput.Attachments`に並び、`onSubmit`の第2引数に`FileList`で届きます。そのため、AI SDKの`sendMessage`にそのまま渡せます。添付だけを送るときは、`text`を渡さないでください。',
  en: 'Pass `accept` to `PromptInput.Root` and it takes files from the `Attach` picker, a drop and a paste, filtering all three by the same `accept`. Files waiting to be sent line up in `PromptInput.Attachments` and reach `onSubmit` as a `FileList` in its second argument, ready for the AI SDK’s `sendMessage`. When sending files alone, leave `text` out.',
});

export const responseTitle = message({
  ja: '流れてくるMarkdownを描く',
  en: 'Render streaming Markdown',
});

export const responseDescription = message({
  ja: '`Response`は、届いている途中のMarkdownを描きます。閉じていないコードブロックがあっても崩れません。ほかの部品とは別のサブパスにあります。',
  en: '`Response` renders Markdown while it is still arriving, and an unclosed code block does not break it. It lives in its own subpath.',
});

export const responseInstall = message({
  ja: (version: string) =>
    `この部品だけは\`streamdown\`で描くので、${version}以上を入れ、そのスタイルシートも読み込みます。`,
  en: (version) =>
    `This part alone renders with \`streamdown\`: install ${version} or later, and load its stylesheet too.`,
});

export const toolTitle = message({
  ja: 'ツールの呼び出しと思考を見せる',
  en: 'Show tool calls and reasoning',
});

export const toolDescription = message({
  ja: '`ToolInvocation`と`Reasoning`は、ツールの実行や思考の過程を折りたためる形で見せます。`ToolInvocation`の`state`は、AI SDKのツールのパートと同じ値です。',
  en: '`ToolInvocation` and `Reasoning` show tool activity and thinking in a panel that folds away. `ToolInvocation`’s `state` takes the same values as the AI SDK’s tool parts.',
});

export const approvalTitle = message({
  ja: 'ツールの実行を承認する',
  en: 'Approve a tool call',
});

export const approvalDescription = message({
  ja: '`state`が`approval-requested`のときに`approval`と`onApprovalResponse`を渡すと、折りたたみの外に問いと「拒否」「許可」のボタンが出ます。答えは`{ id, approved }`の形で返るので、AI SDKの`addToolApprovalResponse`をそのまま渡せます。自動で判断された承認（`isAutomatic`）には、ボタンを出しません。',
  en: 'When `state` is `approval-requested`, pass `approval` and `onApprovalResponse` and a question with Deny and Allow buttons appears outside the folded panel. The answer comes back as `{ id, approved }`, so the AI SDK’s `addToolApprovalResponse` can be passed as it is. An automatic decision (`isAutomatic`) shows no buttons.',
});

export const partsTitle = message({
  ja: '添付ファイルと出典を見せる',
  en: 'Show attachments and sources',
});

export const partsDescription = message({
  ja: '`Attachment`は、メッセージに添えられたファイルを見せます。画像ならサムネイルで、それ以外は名前と種類のチップです。`Source`は回答の出典を並べ、http(s)のURLだけをリンクにします。',
  en: '`Attachment` shows the files on a message: a thumbnail for an image, and a chip with the name and media type for anything else. `Source` lists what an answer cites, and links only http(s) URLs.',
});

export const actionsTitle = message({
  ja: 'メッセージに操作を付ける',
  en: 'Add actions to a message',
});

export const actionsDescription = message({
  ja: '`Message.Actions`は、メッセージの下に置く操作の列です。`Copy`と`Regenerate`、`Feedback`はアイコンと文言を持っていて、それ以外の操作は`Action`で足せます。`onAction`がPromiseを返すと、それが終わるまでボタンは押せなくなります。',
  en: '`Message.Actions` is the row of actions under a message. `Copy`, `Regenerate` and `Feedback` bring their own icons and labels, and `Action` adds anything else. When `onAction` returns a promise, the button stays busy until it settles.',
});

export const aiSdkTitle = message({
  ja: 'AI SDKのメッセージを描く',
  en: 'Render AI SDK messages',
});

export const aiSdkDescription = message({
  ja: '`@k8ordo/ui/ai-sdk`の`mapMessageParts`は、AI SDKの`UIMessage.parts`を、自分で描きやすい平らな配列に変えます。テキストと思考、ツール、ファイルと出典、dataのパートが届いた順に並びます。ツールのパートには承認の情報も入っています。',
  en: '`mapMessageParts` from `@k8ordo/ui/ai-sdk` turns an AI SDK `UIMessage.parts` array into a flat list you render yourself: text, reasoning, tools with their approval, files, sources and data parts, in the order they came.',
});

export const aiSdkVersion = message({
  ja: (version: string) => `AI SDKの\`ai\`は、${version}以上に対応しています。`,
  en: (version) => `It supports the AI SDK’s \`ai\` ${version} or later.`,
});

export const jsonRenderTitle = message({
  ja: '吹き出しの中に生成UIを描く',
  en: 'Render generated UI in a bubble',
});

export const jsonRenderDescription = message({
  ja: '`Message.Content`は任意の子要素を受け取ります。そのため、LLMがツールの結果として返したUIのspecを、json-renderのアダプタで吹き出しの中に描けます。',
  en: '`Message.Content` takes any children, so a UI spec the model returned as a tool result can be drawn inside the bubble with the json-render adapter.',
});

export const propsDescription = message({
  ja: 'コンポーネントの型から作ったpropsの一覧です。開閉する`Reasoning`と`ToolInvocation`は`isOpen`と`defaultOpen`、`onChange`を受け取ります。`Message.Feedback`は`value`と`defaultValue`、`onChange`です。どれも、状態を外から渡しても中に任せても使えます。',
  en: 'The props, derived from the component types. `Reasoning` and `ToolInvocation`, which fold, take `isOpen`, `defaultOpen` and `onChange`, and `Message.Feedback` takes `value`, `defaultValue` and `onChange`. Each works controlled or uncontrolled.',
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
    ja: 'AIチャット — k8ordo',
    en: 'AI chat — k8ordo',
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
