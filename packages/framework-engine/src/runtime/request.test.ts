import { fileRequest, routeRequestOf } from './request';

describe('routeRequestOf', () => {
  it('hands the headers through and parses the cookies by name', () => {
    const request = new Request('https://example.test/', {
      headers: {
        'accept-language': 'ja',
        cookie: 'theme=dark; session="abc%20def"; broken; =nameless',
      },
    });
    const route = routeRequestOf(request);
    expect(route.headers.get('accept-language')).toBe('ja');
    expect([...route.cookies]).toStrictEqual([
      ['theme', 'dark'],
      ['session', 'abc def'],
    ]);
  });

  it('keeps the first of a cookie sent twice', () => {
    const route = routeRequestOf(
      new Request('https://example.test/', {
        headers: { cookie: 'a=1; a=2' },
      }),
    );
    expect(route.cookies.get('a')).toBe('1');
  });

  it('has no cookies when none were sent', () => {
    expect(
      routeRequestOf(new Request('https://example.test/')).cookies.size,
    ).toBe(0);
  });
});

describe('fileRequest', () => {
  it.each(['headers', 'cookies'] as const)(
    'refuses a page reading %s, naming static mode, rather than rendering a fallback for every visitor',
    (name) => {
      expect(() => fileRequest[name]).toThrow(
        `a page read request.${name}, and under mode: 'static' a page is a file written once for every visitor, with no request to read\nthis application wants mode: 'server'`,
      );
    },
  );

  it('is an empty object to whatever hands the props on', () => {
    expect(Object.keys(fileRequest)).toStrictEqual([]);
    expect(JSON.stringify({ request: fileRequest })).toBe('{"request":{}}');
  });
});
