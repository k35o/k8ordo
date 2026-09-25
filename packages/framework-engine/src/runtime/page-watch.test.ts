import type { RouteComponent } from '@k8ordo/router';

import { watchPage } from './page-watch';

const settledNow = (settled: Promise<unknown>): Promise<boolean> =>
  Promise.race([
    settled.then(() => true),
    new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 20);
    }),
  ]);

const call = (Page: unknown, props: unknown = {}): unknown =>
  (Page as (props: unknown) => unknown)(props);

const describeProduct = (props: { id: string }): string => `page ${props.id}`;

function ProductPage(): null {
  return null;
}

describe('watchPage', () => {
  it('hands the page its props and returns what it returned', () => {
    const { Page } = watchPage(describeProduct);
    expect(call(Page, { id: '7' })).toBe('page 7');
  });

  it('settles once a synchronous page has returned', async () => {
    const { Page, settled } = watchPage((() => 'page') as RouteComponent);
    expect(await settledNow(settled)).toBe(false);
    call(Page);
    expect(await settledNow(settled)).toBe(true);
  });

  it('settles once an async page has resolved, and not before', async () => {
    const { promise, resolve } = Promise.withResolvers<string>();
    const { Page, settled } = watchPage((() => promise) as RouteComponent);
    const returned = call(Page);
    expect(returned).toBe(promise);
    expect(await settledNow(settled)).toBe(false);
    resolve('page');
    expect(await settledNow(settled)).toBe(true);
  });

  it('settles once an async page has rejected, with the reason', async () => {
    const gone = new Error('gone');
    const { Page, settled } = watchPage((async () => {
      await Promise.resolve();
      throw gone;
    }) as RouteComponent);
    await expect(call(Page)).rejects.toThrow('gone');
    expect(await settled).toBe(gone);
  });

  it('leaves a synchronous throw unsettled, since a suspension is thrown too', async () => {
    const { Page, settled } = watchPage((() => {
      throw new Error('suspended, or broken');
    }) as RouteComponent);
    expect(() => call(Page)).toThrow('suspended, or broken');
    expect(await settledNow(settled)).toBe(false);
  });

  it('keeps the page’s name, for the render’s own messages', () => {
    expect(watchPage(ProductPage).Page.name).toBe('ProductPage');
  });

  it('leaves a client reference alone, settled — the browser renders it', async () => {
    const reference = Object.assign(() => null, {
      $$typeof: Symbol.for('react.client.reference'),
    });
    const watched = watchPage(reference);
    expect(watched.Page).toBe(reference);
    expect(await settledNow(watched.settled)).toBe(true);
  });
});
