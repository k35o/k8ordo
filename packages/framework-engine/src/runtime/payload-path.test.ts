import { isPayloadPath, pagePathFor, payloadPathFor } from './payload-path';

describe('the payload path convention', () => {
  it('maps a page to a file a static host can serve', () => {
    expect(payloadPathFor('/')).toBe('/index.rsc');
    expect(payloadPathFor('/products/42')).toBe('/products/42/index.rsc');
  });

  it('ignores a trailing slash, like the router does', () => {
    expect(payloadPathFor('/products/')).toBe('/products/index.rsc');
  });

  it('round-trips back to the page it belongs to', () => {
    for (const page of ['/', '/products', '/products/42']) {
      expect(pagePathFor(payloadPathFor(page))).toBe(page);
    }
  });

  it('recognizes its own paths and nothing else', () => {
    expect(isPayloadPath('/products/index.rsc')).toBe(true);
    expect(isPayloadPath('/products')).toBe(false);
  });
});
