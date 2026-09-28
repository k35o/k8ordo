import { mapMessageParts } from '@k8ordo/ui/ai-sdk';
import { validateGeneratedSpec } from '@k8ordo/ui/json-render';
import { readUIMessageStream } from 'ai';
import type { UIMessage, UIMessageChunk } from 'ai';

import { answerSpec, scriptedTransport } from './scripted-transport';

const question: UIMessage = {
  id: 'user-1',
  role: 'user',
  parts: [{ type: 'text', text: '何から始めればいい？' }],
};

const lastMessageOf = async (
  stream: ReadableStream<UIMessageChunk>,
): Promise<UIMessage> => {
  let last: UIMessage | undefined;
  for await (const next of readUIMessageStream({ stream })) {
    last = next;
  }
  if (last === undefined) {
    throw new Error('the stream produced no message');
  }
  return last;
};

test('data パーツで送る spec は現行スキーマで検証を通り、自動修正も要らない', () => {
  expect(validateGeneratedSpec(answerSpec)).toMatchObject({
    fixes: [],
    ok: true,
  });
});

test('最初の返事は、承認 ID を持ったツール呼び出しで止まる', async () => {
  // 手書きのパーツではなく、AI SDK 自身が組み立てたメッセージを通す
  const stream = await scriptedTransport.sendMessages({
    trigger: 'submit-message',
    chatId: 'chat',
    messageId: undefined,
    messages: [question],
    abortSignal: undefined,
  });
  const reply = await lastMessageOf(stream);

  expect(mapMessageParts(reply)).toMatchObject([
    { kind: 'reasoning' },
    {
      kind: 'tool',
      name: 'searchDocs',
      state: 'approval-requested',
      approval: {
        id: 'approval-1',
        requestReason: 'ordo.k8o.me と ai-sdk.dev を検索します。',
      },
    },
  ]);
});
