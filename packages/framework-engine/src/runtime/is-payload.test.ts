import { isPayload } from './is-payload';

const answer = (status: number, type: string): Response =>
  new Response(null, { status, headers: { 'content-type': type } });

describe('isPayload', () => {
  it('takes the application’s own not-found, which comes with a 404', () => {
    // サーバーモードは知らない URL に not-found を 404 で返す。描くページが
    // 無いのではなく、描くページがそれ。
    expect(isPayload(answer(404, 'text/x-component;charset=utf-8'))).toBe(true);
  });

  it('refuses HTML, whatever the status', () => {
    // 静的ホストが未知の URL に返す 404.html も、ファイルそのものも HTML
    expect(isPayload(answer(404, 'text/html;charset=utf-8'))).toBe(false);
    expect(isPayload(answer(200, 'text/html;charset=utf-8'))).toBe(false);
  });

  it('takes a host that guesses another type for .rsc at its word', () => {
    // 拡張子から MIME を当てられないホストでも、クライアント遷移は動く
    expect(isPayload(answer(200, 'application/octet-stream'))).toBe(true);
  });

  it('refuses what is neither a payload nor an answer', () => {
    expect(isPayload(answer(500, 'text/plain'))).toBe(false);
  });
});
