import { answer, inPhase, responseHeaders, withRequest } from './request-scope';

const request = new Request('https://example.test/');

describe('responseHeaders()', () => {
  it('refuses outside a request, naming where it belongs', () => {
    expect(() => responseHeaders()).toThrow(/needs a request — .*guard\.ts/u);
  });

  it('refuses while a page renders, since a render does not answer the request', () => {
    withRequest(request, () => {
      expect(() => responseHeaders()).toThrow(/a page is a render/u);
    });
  });

  it('is what a guard writes to, for the answer to carry', () => {
    const answered = withRequest(request, () => {
      inPhase('guard', () => {
        responseHeaders().set('content-security-policy', "script-src 'self'");
      });
      return answer(new Response('page', { headers: { 'x-page': '1' } }));
    });
    expect(answered.headers.get('content-security-policy')).toBe(
      "script-src 'self'",
    );
    expect(answered.headers.get('x-page')).toBe('1');
  });
});

describe('answer()', () => {
  it('replaces a header the answer already carries with what was added', () => {
    const answered = withRequest(request, () => {
      inPhase('guard', () => {
        responseHeaders().set('cache-control', 'private');
      });
      return answer(
        new Response(null, { headers: { 'cache-control': 'public' } }),
      );
    });
    expect(answered.headers.get('cache-control')).toBe('private');
  });

  it('keeps every Set-Cookie, the answer’s and the added ones', () => {
    const answered = withRequest(request, () => {
      inPhase('guard', () => {
        responseHeaders().append('set-cookie', 'a=1');
        responseHeaders().append('set-cookie', 'b=2');
      });
      return answer(
        new Response(null, { headers: { 'set-cookie': 'page=1' } }),
      );
    });
    expect(answered.headers.getSetCookie()).toStrictEqual([
      'page=1',
      'a=1',
      'b=2',
    ]);
  });

  it('writes onto a response whose own headers cannot be written', async () => {
    const answered = await withRequest(request, async () => {
      inPhase('guard', () => {
        responseHeaders().set('x-guarded', 'yes');
      });
      await Promise.resolve();
      return answer(Response.redirect('https://example.test/login', 303));
    });
    expect(answered.status).toBe(303);
    expect(answered.headers.get('location')).toBe('https://example.test/login');
    expect(answered.headers.get('x-guarded')).toBe('yes');
  });

  it('hands back the answer itself when nothing was added', () => {
    const response = new Response('page');
    expect(withRequest(request, () => answer(response))).toBe(response);
  });

  it('keeps two requests in flight apart', async () => {
    const guarded = withRequest(request, async () => {
      inPhase('guard', () => {
        responseHeaders().set('x-who', 'first');
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 5);
      });
      return answer(new Response(null));
    });
    const plain = withRequest(request, async () => {
      await Promise.resolve();
      return answer(new Response(null));
    });
    expect((await guarded).headers.get('x-who')).toBe('first');
    expect((await plain).headers.get('x-who')).toBeNull();
  });
});
