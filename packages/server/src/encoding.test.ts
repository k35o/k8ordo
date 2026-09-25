import { isCompressible, negotiateEncoding } from './encoding';

describe('negotiateEncoding', () => {
  it('picks br over gzip when the client accepts both equally, whatever order it lists them in', () => {
    expect(negotiateEncoding('gzip, deflate, br', ['br', 'gzip'])).toBe('br');
  });

  it('follows the qualities the client gave', () => {
    expect(negotiateEncoding('br;q=0.5, gzip', ['br', 'gzip'])).toBe('gzip');
  });

  it('never picks a coding the client refused', () => {
    expect(negotiateEncoding('br;q=0, gzip', ['br', 'gzip'])).toBe('gzip');
    expect(negotiateEncoding('br;q=0, gzip;q=0', ['br', 'gzip'])).toBeNull();
  });

  it('sends the bytes as they are to a client that names no coding', () => {
    expect(negotiateEncoding(undefined, ['br', 'gzip'])).toBeNull();
  });

  it('picks only among the codings on offer', () => {
    expect(negotiateEncoding('br', ['gzip'])).toBeNull();
    expect(negotiateEncoding('gzip, br', [])).toBeNull();
  });
});

describe('isCompressible', () => {
  it.each([
    'text/html;charset=utf-8',
    'text/x-component;charset=utf-8',
    'text/javascript; charset=utf-8',
    'image/svg+xml',
  ])('compresses %s', (type) => {
    expect(isCompressible(type)).toBe(true);
  });

  it.each(['image/png', 'font/woff2', 'video/mp4', 'application/zip'])(
    'leaves %s alone, which is compressed already',
    (type) => {
      expect(isCompressible(type)).toBe(false);
    },
  );
});
