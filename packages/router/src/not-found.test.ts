import { isNotFound, notFound } from './not-found';

describe('notFound', () => {
  it('throws what isNotFound recognises', () => {
    let thrown: unknown;
    try {
      notFound();
    } catch (error) {
      thrown = error;
    }
    expect(isNotFound(thrown)).toBe(true);
  });

  it('is recognised by its brand, so a second copy of the package agrees', () => {
    const fromAnotherCopy = Object.assign(new Error('not found'), {
      [Symbol.for('k8ordo.not-found')]: true,
    });
    expect(isNotFound(fromAnotherCopy)).toBe(true);
  });

  it.each([new Error('not found'), 'not found', null, undefined])(
    'does not mistake %s for it',
    (value) => {
      expect(isNotFound(value)).toBe(false);
    },
  );
});
