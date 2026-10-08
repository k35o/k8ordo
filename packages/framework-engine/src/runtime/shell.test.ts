import { shellParams } from './shell';

describe('shellParams', () => {
  it('is no shell when no param holds the reserved segment', () => {
    expect(shellParams({ locale: 'ja', id: '3' }, ['id'])).toBeNull();
  });

  it('is no shell when a param that holds it is not open', () => {
    expect(
      shellParams({ locale: '!fallback', id: '!fallback' }, ['id']),
    ).toBeNull();
  });

  it('fills the params the shell knows, leaving out the ones it left to the browser', () => {
    expect(
      shellParams({ locale: 'ja', id: '!fallback' }, ['id']),
    ).toStrictEqual({ locale: 'ja' });
    expect(
      shellParams({ year: '!fallback', slug: '!fallback' }, ['year', 'slug']),
    ).toStrictEqual({});
  });
});
