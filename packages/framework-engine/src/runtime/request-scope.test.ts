import {
  answer,
  cookies,
  inPhase,
  nonce,
  requestHeaders,
  responseHeaders,
  withRequest,
} from './request-scope';

const request = new Request('https://example.test/');

describe.each([
  ['responseHeaders()', responseHeaders],
  ['cookies()', cookies],
  ['requestHeaders()', requestHeaders],
])('%s', (name, api) => {
  it('refuses outside a request, naming where it belongs', () => {
    expect(() => api()).toThrow(
      `${name} needs a request — call it from a guard.ts, a route.ts or a Server Action`,
    );
  });

  it('refuses while a page renders, since a render does not answer the request', () => {
    withRequest(request, () => {
      expect(() => api()).toThrow(/a page is a render/u);
    });
  });

  it.each(['guard', 'route', 'action'] as const)('works in a %s', (phase) => {
    withRequest(request, () => {
      inPhase(phase, () => {
        expect(() => api()).not.toThrow();
      });
    });
  });
});

describe('responseHeaders()', () => {
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

describe('cookies()', () => {
  const withCookie = new Request('https://example.test/', {
    headers: { cookie: 'visitor=k8o; theme=dark' },
  });

  it('reads what the request carried', () => {
    withRequest(withCookie, () => {
      inPhase('action', () => {
        expect(cookies().get('visitor')).toBe('k8o');
      });
    });
  });

  it('carries a write from a guard through to a Server Action in the same request', () => {
    withRequest(withCookie, () => {
      inPhase('guard', () => {
        cookies().set('visitor', 'someone');
      });
      inPhase('action', () => {
        expect(cookies().get('visitor')).toBe('someone');
      });
    });
  });

  it('says every write as a Set-Cookie on the answer', () => {
    const answered = withRequest(withCookie, () => {
      inPhase('action', () => {
        cookies().set('visitor', 'someone');
        cookies().delete('theme');
      });
      return answer(new Response(null));
    });
    expect(answered.headers.getSetCookie()).toStrictEqual([
      'visitor=someone; Path=/; HttpOnly; Secure; SameSite=Lax',
      'theme=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    ]);
  });
});

describe('requestHeaders()', () => {
  it('is the headers the request arrived with', () => {
    const asked = new Request('https://example.test/', {
      headers: { 'accept-language': 'ja' },
    });
    withRequest(asked, () => {
      inPhase('action', () => {
        expect(requestHeaders().get('accept-language')).toBe('ja');
      });
    });
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

describe('nonce()', () => {
  it('refuses outside a request, naming where it belongs', () => {
    expect(() => nonce()).toThrow(
      'nonce() needs a request — call it while one is answered',
    );
  });

  it.each(['guard', 'route', 'action', 'render'] as const)(
    'is the same one in a %s of the request',
    (phase) => {
      withRequest(request, () => {
        const signed = nonce();
        inPhase(phase, () => {
          expect(nonce()).toBe(signed);
        });
      });
    },
  );

  it('is 128 random bits in base64, which a CSP nonce-source accepts', () => {
    const signed = withRequest(request, nonce);
    expect(signed).toMatch(/^[A-Za-z0-9+/]{22}==$/u);
  });

  it('is new for every request', () => {
    const signed = new Set(
      Array.from({ length: 50 }, () => withRequest(request, nonce)),
    );
    expect(signed.size).toBe(50);
  });
});
