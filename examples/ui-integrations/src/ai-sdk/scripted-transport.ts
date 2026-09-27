import type { UISpec } from '@k8ordo/ui/json-render';
import {
  isFileUIPart,
  isTextUIPart,
  isToolUIPart,
  simulateReadableStream,
} from 'ai';
import type { ChatTransport, UIMessage, UIMessageChunk } from 'ai';

export const SEARCH_TOOL = 'searchDocs';

export const SOURCES = [
  {
    url: 'https://ordo.k8o.me/ui/ai/chat',
    title: 'AI チャット — k8ordo',
  },
  {
    url: 'https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage',
    title: 'Chatbot Tool Usage — AI SDK',
  },
] as const;

/** 回答に添える data パーツ（`data-ui`）。json-render の spec を運ぶ */
export const answerSpec = {
  root: 'root',
  elements: {
    root: {
      type: 'Card',
      props: { variant: 'outline' },
      children: ['body'],
    },
    body: {
      type: 'Stack',
      props: { direction: 'column', gap: 'sm' },
      children: ['title', 'steps'],
    },
    title: {
      type: 'Heading',
      props: { label: '組み立てる順番', level: 'h4' },
      children: [],
    },
    steps: {
      type: 'Table',
      props: {
        caption: 'AI チャットの部品',
        columns: [{ label: '段階' }, { label: '部品' }],
        rows: [
          ['骨組み', 'Conversation / Message / PromptInput'],
          ['中身', 'Response / Reasoning / ToolInvocation'],
          ['添え物', 'Attachment / Source / Message.Actions'],
        ],
      },
      children: [],
    },
  },
} satisfies UISpec;

const textChunks = (id: string, text: string): UIMessageChunk[] => [
  { type: 'text-start', id },
  { type: 'text-delta', id, delta: text },
  { type: 'text-end', id },
];

// 利用者の発言への最初の返事。ドキュメント検索を呼び、実行の許可を求めて止まる
const askToSearch = (user: UIMessage, turn: number): UIMessageChunk[] => {
  const query = user.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join('');
  const files = user.parts.filter(isFileUIPart);
  const toolCallId = `call-${turn.toString()}`;

  return [
    { type: 'start' },
    { type: 'start-step' },
    { type: 'reasoning-start', id: 'reasoning' },
    {
      type: 'reasoning-delta',
      id: 'reasoning',
      delta: 'ドキュメントを引いてから答える。',
    },
    { type: 'reasoning-end', id: 'reasoning' },
    ...(files.length === 0
      ? []
      : textChunks(
          'files',
          `添付を ${files.length.toString()} 件受け取りました（${files
            .map((file) => file.filename ?? file.mediaType)
            .join('、')}）。`,
        )),
    {
      type: 'tool-input-available',
      toolCallId,
      toolName: SEARCH_TOOL,
      input: { query: query === '' ? '添付ファイル' : query },
    },
    {
      type: 'tool-approval-request',
      approvalId: `approval-${turn.toString()}`,
      toolCallId,
      reason: 'ordo.k8o.me と ai-sdk.dev を検索します。',
    },
    { type: 'finish-step' },
    { type: 'finish' },
  ];
};

// 許可・拒否の答えを受けた続き。useChat は最後のアシスタントのメッセージに書き足す
const continueAfterApproval = (
  toolCallId: string,
  approved: boolean,
): UIMessageChunk[] => {
  if (!approved) {
    return [
      { type: 'start' },
      { type: 'start-step' },
      { type: 'tool-output-denied', toolCallId },
      ...textChunks(
        'answer',
        '検索せずに答えます。まずは Conversation・Message・PromptInput の 3 つで骨組みを作ってください。',
      ),
      { type: 'finish-step' },
      { type: 'finish' },
    ];
  }
  return [
    { type: 'start' },
    { type: 'start-step' },
    {
      type: 'tool-output-available',
      toolCallId,
      output: { hits: SOURCES.length },
    },
    { type: 'finish-step' },
    { type: 'start-step' },
    ...textChunks(
      'answer',
      'Conversation・Message・PromptInput で骨組みを作り、Response や ToolInvocation を足していくのがおすすめです。',
    ),
    ...SOURCES.map((source, i): UIMessageChunk => ({
      type: 'source-url',
      sourceId: `source-${i.toString()}`,
      url: source.url,
      title: source.title,
    })),
    { type: 'data-ui', id: 'answer-ui', data: answerSpec },
    { type: 'finish-step' },
    { type: 'finish' },
  ];
};

const replyTo = (messages: UIMessage[]): UIMessageChunk[] => {
  const last = messages.at(-1);
  if (last?.role === 'assistant') {
    const answered = last.parts
      .filter(isToolUIPart)
      .find((part) => part.state === 'approval-responded');
    if (answered !== undefined) {
      return continueAfterApproval(
        answered.toolCallId,
        answered.approval.approved,
      );
    }
  }
  if (last?.role === 'user') {
    // 何度目の質問かで ID を振り分ける。再生成は同じ質問への答え直しなので同じ ID になる
    const turn = messages.filter((message) => message.role === 'user').length;
    return askToSearch(last, turn);
  }
  return [{ type: 'start' }, { type: 'finish' }];
};

/**
 * モデルの代わりに、決まった返事を UI メッセージのストリームで流す。
 * サーバーも API キーも無しに、useChat の承認・添付・出典・data パーツ・
 * 再生成の流れをそのまま通すためのもの。
 */
export const scriptedTransport: ChatTransport<UIMessage> = {
  sendMessages: ({ messages }) =>
    Promise.resolve(
      simulateReadableStream({
        chunks: replyTo(messages),
        chunkDelayInMs: null,
        initialDelayInMs: null,
      }),
    ),
  reconnectToStream: () => Promise.resolve(null),
};
