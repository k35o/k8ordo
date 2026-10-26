import { createElement, lazy, Suspense } from 'react';
import { describe, expect, it } from 'vite-plus/test';

import { whenClientReady } from './client-ready';

/**
 * A lazy standing for `value` until it arrives — what the Flight client hands
 * over for a client component still loading, and for a row of the payload
 * still on its way. Typed as anything, since it goes wherever React takes a
 * component or a node.
 */
const later = (
  value: unknown,
): { lazy: never; arrive: () => void; fail: () => void } => {
  const { promise, resolve, reject } = Promise.withResolvers<{
    default: never;
  }>();
  return {
    lazy: lazy(() => promise) as never,
    arrive: () => {
      resolve({ default: value as never });
    },
    fail: () => {
      reject(new Error('could not load'));
    },
  };
};

const Nothing = (): null => null;

// マイクロタスクを流し切ってから、終わったかを見る
const hasSettled = async (promise: Promise<void>): Promise<boolean> => {
  let settled = false;
  void promise.then(() => {
    settled = true;
  });
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
  return settled;
};

const LEAVE = { inSuspense: 'leave' } as const;
const WAIT = { inSuspense: 'wait' } as const;

describe('whenClientReady', () => {
  describe('正常系', () => {
    it('settles at once for trees that name no client component', async () => {
      const ready = whenClientReady(
        [createElement('main', null, createElement(Nothing)), undefined],
        LEAVE,
      );

      expect(await hasSettled(ready)).toBe(true);
    });

    it('waits for a client component named as an element type', async () => {
      const component = later(Nothing);
      const ready = whenClientReady(
        [createElement('main', null, createElement(component.lazy))],
        LEAVE,
      );
      expect(await hasSettled(ready)).toBe(false);

      component.arrive();

      expect(await hasSettled(ready)).toBe(true);
    });

    it('waits for one in a prop other than children, in an array and in a plain object', async () => {
      const inProp = later(Nothing);
      const inArray = later(Nothing);
      const inObject = later(Nothing);
      const ready = whenClientReady(
        [
          createElement(Nothing, {
            icon: createElement(inProp.lazy),
            items: [createElement(inArray.lazy)],
            slots: { end: createElement(inObject.lazy) },
          } as never),
        ],
        LEAVE,
      );

      inProp.arrive();
      inArray.arrive();
      expect(await hasSettled(ready)).toBe(false);
      inObject.arrive();

      expect(await hasSettled(ready)).toBe(true);
    });

    it('waits for a client component in a row that arrives while it waits', async () => {
      const component = later(Nothing);
      const row = later(
        createElement('section', null, createElement(component.lazy)),
      );
      const ready = whenClientReady(
        [createElement('main', null, row.lazy)],
        LEAVE,
      );

      row.arrive();
      expect(await hasSettled(ready)).toBe(false);
      component.arrive();

      expect(await hasSettled(ready)).toBe(true);
    });
  });

  describe("with inSuspense: 'leave'", () => {
    it('leaves a row still on its way inside a Suspense boundary to its fallback', async () => {
      const row = later(createElement('p'));
      const ready = whenClientReady(
        [createElement(Suspense, { fallback: null }, row.lazy)],
        LEAVE,
      );

      expect(await hasSettled(ready)).toBe(true);
    });

    it('still waits for a client component inside a Suspense boundary', async () => {
      const component = later(Nothing);
      const ready = whenClientReady(
        [
          createElement(
            Suspense,
            { fallback: null },
            createElement(component.lazy),
          ),
        ],
        LEAVE,
      );
      expect(await hasSettled(ready)).toBe(false);

      component.arrive();

      expect(await hasSettled(ready)).toBe(true);
    });

    it('waits for a row outside every Suspense boundary', async () => {
      const row = later(createElement('p'));
      const ready = whenClientReady(
        [createElement('main', null, row.lazy)],
        LEAVE,
      );
      expect(await hasSettled(ready)).toBe(false);

      row.arrive();

      expect(await hasSettled(ready)).toBe(true);
    });

    it('waits for a row in a fallback, which shows outside its boundary', async () => {
      const row = later(createElement('p'));
      const ready = whenClientReady(
        [createElement(Suspense, { fallback: row.lazy }, createElement('p'))],
        LEAVE,
      );
      expect(await hasSettled(ready)).toBe(false);

      row.arrive();

      expect(await hasSettled(ready)).toBe(true);
    });
  });

  describe("with inSuspense: 'wait'", () => {
    it('waits for a row inside a Suspense boundary too', async () => {
      const row = later(createElement('p'));
      const ready = whenClientReady(
        [createElement(Suspense, { fallback: null }, row.lazy)],
        WAIT,
      );
      expect(await hasSettled(ready)).toBe(false);

      row.arrive();

      expect(await hasSettled(ready)).toBe(true);
    });
  });

  describe('異常系', () => {
    it('settles when a client component fails to load', async () => {
      const component = later(Nothing);
      const ready = whenClientReady([createElement(component.lazy)], LEAVE);

      component.fail();

      expect(await hasSettled(ready)).toBe(true);
    });

    it('settles when a row fails', async () => {
      const row = later(createElement('p'));
      const ready = whenClientReady([row.lazy], WAIT);

      row.fail();

      expect(await hasSettled(ready)).toBe(true);
    });
  });

  describe('エッジケース', () => {
    it('walks a tree that holds itself, and one shared twice, without end', async () => {
      const shared: Record<string, unknown> = {};
      shared.self = shared;
      const ready = whenClientReady(
        [createElement(Nothing, { a: shared, b: shared } as never)],
        LEAVE,
      );

      expect(await hasSettled(ready)).toBe(true);
    });
  });
});
