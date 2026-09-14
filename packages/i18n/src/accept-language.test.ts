import { parseAcceptLanguage } from './accept-language';

describe('parseAcceptLanguage', () => {
  it('orders tags by q, keeping the header order among equals', () => {
    expect(
      parseAcceptLanguage('en-US;q=0.8, ja, en;q=0.9, fr;q=0.8'),
    ).toStrictEqual(['ja', 'en', 'en-US', 'fr']);
  });

  it('drops the wildcard and anything weighted zero', () => {
    expect(parseAcceptLanguage('*;q=0.5, en;q=0, ja')).toStrictEqual(['ja']);
  });

  it('treats a missing or empty header as an empty list', () => {
    expect(parseAcceptLanguage(null)).toStrictEqual([]);
    expect(parseAcceptLanguage('   ')).toStrictEqual([]);
  });

  it('tolerates spacing and parameters it does not know', () => {
    expect(parseAcceptLanguage(' en ; foo=bar ; Q=0.5 ,ja')).toStrictEqual([
      'ja',
      'en',
    ]);
  });
});
