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
  ja: '実際のチャット画面です。サジェスチョンを選ぶか、メッセージを入力して送信すると、吹き出しが会話に積まれていきます。思考過程やツール呼び出しは折りたたみで確認できます。',
  en: 'A working chat screen. Pick a suggestion or type a message and send it — bubbles stack up in the conversation, and reasoning and tool calls fold into collapsible blocks.',
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
  ja: '`Conversation`はstick-to-bottomと「最新へ」ボタン付きのスクロール領域、`Message`はroleごとの吹き出し、`PromptInput`は入力欄です。メッセージ配列は利用側が持ちます。',
  en: '`Conversation` provides the scroll region with stick-to-bottom and a scroll-to-latest button; `Message` renders the bubble per role; `PromptInput` is the composer. You own the message list.',
});

export const inputTitle = message({
  ja: '入力欄（IME対応）',
  en: 'Prompt input (IME-safe)',
});

export const inputDescription = message({
  ja: 'Enterで送信、Shift+Enterで改行、そしてIME変換を確定するEnterでは送信しません。`status`に応じて送信 / 停止ボタンが切り替わります。',
  en: 'Enter sends, Shift+Enter inserts a newline, and the Enter that confirms an IME composition never submits. `status` switches the button between send and stop.',
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

export const aiSdkTitle = message({
  ja: 'AI SDK連携',
  en: 'AI SDK integration',
});

export const aiSdkDescription = message({
  ja: '`mapMessageParts`（`@k8ordo/ui/ai-sdk`）はAI SDKの`UIMessage.parts`を、自分で描画しやすい素朴な配列に変換します。optional peerの`ai`が必要です。',
  en: '`mapMessageParts` (from `@k8ordo/ui/ai-sdk`) turns an AI SDK `UIMessage.parts` array into a flat list you render yourself. It needs the `ai` optional peer.',
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
  ja: 'コンポーネントの型から生成したpropsの一覧です。開閉を持つコンポーネント（Reasoning / ToolInvocation）はisOpen / defaultOpen / onChangeのcontrolled / uncontrolled両対応です。',
  en: 'Props generated from the component types. Collapsible components (Reasoning / ToolInvocation) support both controlled and uncontrolled usage via isOpen / defaultOpen / onChange.',
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
