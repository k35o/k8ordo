import { withBase, withoutBase } from './base';

describe('withBase', () => {
  it('puts the base in front of a pathname', () => {
    expect(withBase('/products/42', '/docs/')).toBe('/docs/products/42');
  });

  it('spells the root as the base itself, with its slash', () => {
    expect(withBase('/', '/docs/')).toBe('/docs/');
  });

  it('adds nothing at the root base', () => {
    expect(withBase('/products', '/')).toBe('/products');
  });

  it('adds nothing for a relative base, which names no path', () => {
    expect(withBase('/products', './')).toBe('/products');
  });

  it('reads the base Vite serves the application under', () => {
    vi.stubEnv('BASE_URL', '/docs/');
    try {
      expect(withBase('/products')).toBe('/docs/products');
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

describe('withoutBase', () => {
  it('takes the base off a pathname under it', () => {
    expect(withoutBase('/docs/products/42', '/docs/')).toBe('/products/42');
  });

  it('reads the base, with or without its slash, as the root', () => {
    expect(withoutBase('/docs/', '/docs/')).toBe('/');
    expect(withoutBase('/docs', '/docs/')).toBe('/');
  });

  it('answers null for a pathname outside the base', () => {
    expect(withoutBase('/products', '/docs/')).toBeNull();
    // 区切りまで見る。/docs の下ではない
    expect(withoutBase('/docsify', '/docs/')).toBeNull();
  });

  it('leaves a pathname alone at the root base', () => {
    expect(withoutBase('/products', '/')).toBe('/products');
  });

  it('undoes withBase', () => {
    expect(withoutBase(withBase('/a/b', '/x/y/'), '/x/y/')).toBe('/a/b');
    expect(withoutBase(withBase('/', '/x/y/'), '/x/y/')).toBe('/');
  });
});
