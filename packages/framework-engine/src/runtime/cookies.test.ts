import { createCookies } from './cookies';

const jar = (
  incoming: Record<string, string> = {},
  url = 'https://example.test/',
) => createCookies(new Map(Object.entries(incoming)), new URL(url));

describe('the cookie jar', () => {
  it('reads what the request carried', () => {
    const { cookies } = jar({ session: 'abc' });
    expect(cookies.get('session')).toBe('abc');
    expect(cookies.has('theme')).toBe(false);
  });

  it('says nothing when nothing was written', () => {
    expect(jar({ session: 'abc' }).lines()).toStrictEqual([]);
  });

  it('writes a session cookie by default: every path, no script, HTTPS, same site', () => {
    const { cookies, lines } = jar();
    cookies.set('session', 'abc');
    expect(lines()).toStrictEqual([
      'session=abc; Path=/; HttpOnly; Secure; SameSite=Lax',
    ]);
  });

  it('spells every option it is given', () => {
    const { cookies, lines } = jar();
    cookies.set('theme', 'dark', {
      path: '/docs',
      domain: 'example.test',
      maxAge: 3600.7,
      expires: new Date('2030-01-02T03:04:05Z'),
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
    });
    expect(lines()).toStrictEqual([
      'theme=dark; Path=/docs; Domain=example.test; Max-Age=3600; Expires=Wed, 02 Jan 2030 03:04:05 GMT; SameSite=Strict',
    ]);
  });

  it('encodes a value the way the request side decodes it', () => {
    const { cookies, lines } = jar();
    cookies.set('name', 'k8o; ほげ');
    expect(lines()[0]).toMatch(/^name=k8o%3B%20%E3%81%BB%E3%81%92; /u);
    expect(cookies.get('name')).toBe('k8o; ほげ');
  });

  it('sees its own writes on the next read', () => {
    const { cookies } = jar({ session: 'old' });
    cookies.set('session', 'new');
    cookies.delete('theme');
    expect(cookies.get('session')).toBe('new');
    cookies.delete('session');
    expect(cookies.has('session')).toBe(false);
  });

  it('expires a deleted cookie where it lives', () => {
    const { cookies, lines } = jar({ session: 'abc' });
    cookies.delete('session', { path: '/admin' });
    expect(lines()).toStrictEqual([
      'session=; Path=/admin; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    ]);
  });

  it('says a cookie written twice at one place once, the last way', () => {
    const { cookies, lines } = jar();
    cookies.set('a', '1');
    cookies.set('b', '2');
    cookies.set('a', '3');
    cookies.set('a', '4', { path: '/x' });
    expect(lines()).toStrictEqual([
      'b=2; Path=/; HttpOnly; Secure; SameSite=Lax',
      'a=3; Path=/; HttpOnly; Secure; SameSite=Lax',
      'a=4; Path=/x; HttpOnly; Secure; SameSite=Lax',
    ]);
  });

  it.each(['', 'a b', 'a=b', 'a;b', 'ほげ'])('refuses %j as a name', (name) => {
    expect(() => {
      jar().cookies.set(name, 'x');
    }).toThrow(/cannot be a cookie name/u);
  });

  it.each([
    ['path', { path: '/; Domain=evil.test' }],
    ['path', { path: '/\r\nx-injected: 1' }],
    ['domain', { domain: 'example.test; HttpOnly' }],
    ['domain', { domain: 'example.test\n' }],
  ])(
    'refuses a %s that would write attributes or headers of its own',
    (name, options) => {
      expect(() => {
        jar().cookies.set('a', 'x', options);
      }).toThrow(new RegExp(`cannot be a cookie's ${name}`, 'u'));
      expect(() => {
        jar().cookies.delete('a', options);
      }).toThrow(new RegExp(`cannot be a cookie's ${name}`, 'u'));
    },
  );

  it.each(['http://localhost:5173/', 'http://127.0.0.1/', 'http://[::1]/'])(
    'leaves Secure off by default on plain HTTP to this machine (%s), where Safari would drop it',
    (url) => {
      const { cookies, lines } = jar({ session: 'abc' }, url);
      cookies.set('theme', 'dark');
      cookies.delete('session');
      expect(lines()).toStrictEqual([
        'theme=dark; Path=/; HttpOnly; SameSite=Lax',
        'session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
      ]);
    },
  );

  it.each(['https://localhost/', 'http://example.test/'])(
    'keeps Secure by default anywhere else (%s)',
    (url) => {
      const { cookies, lines } = jar({}, url);
      cookies.set('theme', 'dark');
      expect(lines()).toStrictEqual([
        'theme=dark; Path=/; HttpOnly; Secure; SameSite=Lax',
      ]);
    },
  );

  it('writes Secure on plain HTTP to this machine when asked, and for sameSite "none"', () => {
    const { cookies, lines } = jar({}, 'http://localhost/');
    cookies.set('a', '1', { secure: true });
    cookies.set('b', '2', { sameSite: 'none' });
    expect(lines()).toStrictEqual([
      'a=1; Path=/; HttpOnly; Secure; SameSite=Lax',
      'b=2; Path=/; HttpOnly; Secure; SameSite=None',
    ]);
  });

  it('refuses sameSite "none" without secure, which a browser would drop', () => {
    expect(() => {
      jar().cookies.set('a', 'x', { sameSite: 'none', secure: false });
    }).toThrow(/has to be secure/u);
  });
});
