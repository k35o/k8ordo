import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'AIチャットUIのためのpresentationalな部品です。通信やメッセージの状態は持たず、データを渡して`messages.map()`で組み立てるだけ。AI SDKでも自前のバックエンドでも接続できます。`@k8ordo/ui/ai`からimportします。',
  en: 'Presentational building blocks for AI chat UIs. They hold no fetching or message state — you pass data in and compose them with `messages.map()`, so they connect to the AI SDK or your own backend. Import from `@k8ordo/ui/ai`.',
});

export const demoTitle = message({
  ja: 'デモ',
  en: 'Demo',
});

export const demoDescription = message({
  ja: '実際のチャット画面です。ツールの実行を許可すると回答と出典が出ます。サジェスチョンを選ぶか、メッセージを入力して送信すると、吹き出しが会話に積まれていきます。ファイルを添えることも、回答をコピーしたり評価したりすることもできます。',
  en: 'A working chat screen. Allow the tool call and the answer arrives with its sources. Pick a suggestion or type a message and send it — bubbles stack up in the conversation. You can attach files, and copy or rate an answer.',
});

export const suggestionTitle = message({
  ja: 'サジェスチョン',
  en: 'Suggestions',
});

export const suggestionDescription = message({
  ja: '`Suggestion`は定型の質問をチップで並べ、選択された値をそのまま送信ハンドラに渡します。',
  en: '`Suggestion` lays out canned prompts as chips and passes the selected value straight to your send handler.',
});

export const overviewTitle = message({
  ja: '会話を組み立てる',
  en: 'Compose a conversation',
});

export const overviewDescription = message({
  ja: '`Conversation`はstick-to-bottomと「最新へ」ボタン付きのスクロール領域、`Message`はroleごとの吹き出し、`PromptInput`は入力欄です。`Message.Root`の`avatar`は吹き出しの横に置かれ、子要素はその隣に縦に積まれます。メッセージ配列は利用側が持ちます。',
  en: '`Conversation` provides the scroll region with stick-to-bottom and a scroll-to-latest button; `Message` renders the bubble per role; `PromptInput` is the composer. `Message.Root` puts its `avatar` beside the bubble and stacks the children next to it. You own the message list.',
});

export const inputTitle = message({
  ja: '入力欄（IME対応）',
  en: 'Prompt input (IME-safe)',
});

export const inputDescription = message({
  ja: 'Enterで送信、Shift+Enterで改行、そしてIME変換を確定するEnterでは送信しません。`status`に応じて送信 / 停止ボタンが切り替わります。',
  en: 'Enter sends, Shift+Enter inserts a newline, and the Enter that confirms an IME composition never submits. `status` switches the button between send and stop.',
});

export const attachmentsTitle = message({
  ja: '添付',
  en: 'Attachments',
});

export const attachmentsDescription = message({
  ja: '`PromptInput.Root`に`accept`を渡すと、`Attach`の選択・ドロップ・貼り付けのどれでもファイルを受け取り、同じ`accept`で選り分けます。待機中の添付は`PromptInput.Attachments`に並び、`onSubmit`の第2引数に`FileList`で届くので、AI SDKの`sendMessage`にそのまま渡せます。添付だけを送るときは`text`を渡さないでください。',
  en: 'Pass `accept` to `PromptInput.Root` and it takes files from the `Attach` picker, a drop, or a paste, filtering all three by the same `accept`. Pending files line up in `PromptInput.Attachments` and reach `onSubmit` as a `FileList` in its second argument, ready for the AI SDK’s `sendMessage`. When sending files alone, leave `text` out.',
});

export const responseTitle = message({
  ja: 'ストリーミングMarkdown',
  en: 'Streaming Markdown',
});

export const responseDescription = message({
  ja: '`Response`はストリーミング中のMarkdownを描画し、未クローズのブロックにも耐えます。別サブパスに分かれており、optional peerの`streamdown`とそのスタイルシートが必要です。',
  en: '`Response` renders streaming Markdown and tolerates unterminated blocks. It lives in a separate subpath and needs the `streamdown` optional peer plus its stylesheet.',
});

export const toolTitle = message({
  ja: 'ツール呼び出しと思考',
  en: 'Tool calls & reasoning',
});

export const toolDescription = message({
  ja: '`ToolInvocation`と`Reasoning`はツールの実行や思考過程を折りたたみで表示します。`state`の語彙はAI SDKのツールパートの状態に揃えています。',
  en: '`ToolInvocation` and `Reasoning` show collapsible tool activity and thinking. Their `state` vocabulary matches the AI SDK tool part states.',
});

export const approvalTitle = message({
  ja: 'ツールの承認',
  en: 'Tool approval',
});

export const approvalDescription = message({
  ja: '`state`が`approval-requested`のとき、`approval`と`onApprovalResponse`を渡すと、折りたたみの外に問いと「拒否」「許可」のボタンが出ます。答えは`{ id, approved }`で返るので、AI SDKの`addToolApprovalResponse`をそのまま渡せます。自動で判断される承認（`isAutomatic`）にはボタンを出しません。',
  en: 'When `state` is `approval-requested`, pass `approval` and `onApprovalResponse` and a question with Deny and Allow buttons appears outside the collapsed panel. The answer comes back as `{ id, approved }`, so the AI SDK’s `addToolApprovalResponse` can be passed as is. An automatic decision (`isAutomatic`) shows no buttons.',
});

export const partsTitle = message({
  ja: '添付ファイルと出典',
  en: 'Attachments & sources',
});

export const partsDescription = message({
  ja: '`Attachment`はメッセージに添えられたファイルを、画像ならサムネイル、それ以外は名前と種類のチップで表示します。`Source`は回答の出典を並べ、http(s)のURLだけをリンクにします。',
  en: '`Attachment` shows the files on a message — a thumbnail for an image, a name and media-type chip for anything else. `Source` lists the sources an answer cites and links only http(s) URLs.',
});

export const actionsTitle = message({
  ja: 'メッセージの操作',
  en: 'Message actions',
});

export const actionsDescription = message({
  ja: '`Message.Actions`はメッセージの下に置く操作の列です。`Copy`・`Regenerate`・`Feedback`はアイコンと文言を持っていて、それ以外の操作は`Action`で足せます。`onAction`が返すPromiseが終わるまでボタンは止まります。',
  en: '`Message.Actions` is the row of actions under a message. `Copy`, `Regenerate`, and `Feedback` come with their own icons and labels, and `Action` adds anything else. A button stays busy until the promise its `onAction` returns settles.',
});

export const aiSdkTitle = message({
  ja: 'AI SDK連携',
  en: 'AI SDK integration',
});

export const aiSdkDescription = message({
  ja: '`mapMessageParts`（`@k8ordo/ui/ai-sdk`）はAI SDKの`UIMessage.parts`を、自分で描画しやすい素朴な配列に変換します。テキスト・思考・ツール（承認を含む）・ファイル・出典・dataパーツを順に返します。optional peerの`ai`が必要です。',
  en: '`mapMessageParts` (from `@k8ordo/ui/ai-sdk`) turns an AI SDK `UIMessage.parts` array into a flat list you render yourself: text, reasoning, tools (approval included), files, sources, and data parts, in order. It needs the `ai` optional peer.',
});

export const jsonRenderTitle = message({
  ja: '吹き出しの中にGenerative UI',
  en: 'Generative UI inside a bubble',
});

export const jsonRenderDescription = message({
  ja: 'Message.Contentは任意のchildrenを取れるので、json-renderのregistryを使ってLLMが生成したUI specを吹き出しの中に描画できます。会話の中へそのままGenerative UIを届けられます。',
  en: 'Because Message.Content takes any children, you can render an LLM-generated UI spec inside a bubble with the json-render registry — generative UI delivered straight into the conversation.',
});

export const propsDescription = message({
  ja: 'コンポーネントの型から生成したpropsの一覧です。開閉を持つコンポーネント（Reasoning / ToolInvocation）はisOpen / defaultOpen / onChange、Message.Feedbackはvalue / defaultValue / onChangeで、controlled / uncontrolled両対応です。',
  en: 'Props generated from the component types. Collapsible components (Reasoning / ToolInvocation) take isOpen / defaultOpen / onChange and Message.Feedback takes value / defaultValue / onChange, each controlled or uncontrolled.',
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
    ja: 'まず会話の器・吹き出し・入力欄の3つが土台。Markdownやツール表示は後段で足せる。',
    en: 'The conversation area, message bubbles, and the input are the foundation. Markdown and tool views can come later.',
  }),
  seedToolOutput: message({
    ja: 'Conversation / Message / PromptInputの3つから始めるのが推奨です。',
    en: 'Starting with Conversation, Message, and PromptInput is recommended.',
  }),
  seedAnswer: message({
    ja: 'まずはConversation・Message・PromptInputの3つで会話の骨組みを作り、そのあとResponse（Markdown）やToolInvocationを足していくのがおすすめです。',
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
