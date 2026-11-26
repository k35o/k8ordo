import { describe, expect, it } from 'vite-plus/test';

import { createLineBuffer } from './lines';
import { parseGenerateRequest } from './request';

const SAME_ORIGIN = { origin: 'http://localhost:5173', host: 'localhost:5173' };

const ask = { role: 'user', content: 'フォーム' } as const;
const answer = { role: 'assistant', content: '{}' } as const;
const pressed = { role: 'user', content: '押した' } as const;

describe('parseGenerateRequest', () => {
  it('同じオリジンからの形式とやり取りを受け取る', () => {
    expect(
      parseGenerateRequest(SAME_ORIGIN, {
        format: 'a2ui',
        messages: [ask, answer, pressed],
      }),
    ).toStrictEqual({ format: 'a2ui', messages: [ask, answer, pressed] });
  });

  it('別のオリジンからの依頼は鍵を使う前に断る', () => {
    expect(
      parseGenerateRequest(
        { origin: 'https://example.com', host: 'localhost:5173' },
        { format: 'a2ui', messages: [ask] },
      ),
    ).toMatchObject({ status: 403 });
  });

  it('知らない形式と空の依頼を断る', () => {
    expect(
      parseGenerateRequest(SAME_ORIGIN, { format: 'html', messages: [ask] }),
    ).toMatchObject({ status: 400 });
    expect(
      parseGenerateRequest(SAME_ORIGIN, {
        format: 'openui',
        messages: [{ role: 'user', content: ' ' }],
      }),
    ).toMatchObject({ status: 400 });
  });

  it.for([
    ['空', []],
    ['assistant で終わる', [ask, answer]],
    ['assistant から始まる', [answer]],
    ['user が続く', [ask, pressed]],
  ] as const)('%s やり取りを断る', ([, messages]) => {
    expect(
      parseGenerateRequest(SAME_ORIGIN, { format: 'a2ui', messages }),
    ).toMatchObject({ status: 400 });
  });
});

describe('createLineBuffer', () => {
  it('切れ目で分かれて届いた行を 1 行ずつ返し、残りは flush で返す', () => {
    const lines = createLineBuffer();

    expect(lines.push('{"a":')).toStrictEqual([]);
    expect(lines.push('1}\n\n{"b"')).toStrictEqual(['{"a":1}']);
    expect(lines.push(':2}')).toStrictEqual([]);
    expect(lines.flush()).toStrictEqual(['{"b":2}']);
  });
});
