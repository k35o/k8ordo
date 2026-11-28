import { describe, expect, it } from 'vite-plus/test';

import { parseChatRequest } from './endpoint';

const sameOrigin = { origin: 'http://localhost:5173', host: 'localhost:5173' };
const message = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: '会員登録のフォームを出して' }],
};

describe('parseChatRequest', () => {
  it('やり取りと、画面の今の状態を受け取る', () => {
    expect(
      parseChatRequest(sameOrigin, {
        messages: [message],
        modelContext: ['State of the screen now: {}'],
      }),
    ).toStrictEqual({
      messages: [message],
      modelContext: ['State of the screen now: {}'],
    });
  });

  it('状態が添えられていなければ、状態は空', () => {
    expect(parseChatRequest(sameOrigin, { messages: [message] })).toStrictEqual(
      { messages: [message], modelContext: [] },
    );
  });

  it('ほかのオリジンのページからの要求を断る', () => {
    expect(
      parseChatRequest(
        { origin: 'https://example.com', host: 'localhost:5173' },
        { messages: [message] },
      ),
    ).toMatchObject({ status: 403 });
  });

  it.for([
    ['本文が無い', undefined],
    ['やり取りが空', { messages: [] }],
    ['状態が文字列の並びでない', { messages: [message], modelContext: [{}] }],
  ] as const)('%s要求を断る', ([, body]) => {
    expect(parseChatRequest(sameOrigin, body)).toMatchObject({ status: 400 });
  });
});
