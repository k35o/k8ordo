import { createCookies } from './cookies';

const jar = (incoming: Record<string, string> = {}) =>
  createCookies(new Map(Object.entries(incoming)));

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

  it('refuses sameSite "none" without secure, which a browser would drop', () => {
    expect(() => {
      jar().cookies.set('a', 'x', { sameSite: 'none', secure: false });
    }).toThrow(/has to be secure/u);
  });
});
