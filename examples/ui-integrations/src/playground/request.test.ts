import { describe, expect, it } from 'vite-plus/test';

import { createLineBuffer } from './lines';
import { parseGenerateRequest } from './request';

const SAME_ORIGIN = { origin: 'http://localhost:5173', host: 'localhost:5173' };

describe('parseGenerateRequest', () => {
  it('同じオリジンからの形式と依頼を受け取る', () => {
    expect(
      parseGenerateRequest(SAME_ORIGIN, { format: 'a2ui', prompt: 'フォーム' }),
    ).toStrictEqual({ format: 'a2ui', prompt: 'フォーム' });
  });

  it('別のオリジンからの依頼は鍵を使う前に断る', () => {
    expect(
      parseGenerateRequest(
        { origin: 'https://example.com', host: 'localhost:5173' },
        { format: 'a2ui', prompt: 'フォーム' },
      ),
    ).toMatchObject({ status: 403 });
  });

  it('知らない形式と空の依頼を断る', () => {
    expect(
      parseGenerateRequest(SAME_ORIGIN, { format: 'html', prompt: 'x' }),
    ).toMatchObject({ status: 400 });
    expect(
      parseGenerateRequest(SAME_ORIGIN, { format: 'openui', prompt: ' ' }),
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
