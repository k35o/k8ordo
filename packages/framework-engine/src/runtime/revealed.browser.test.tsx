import { whenRevealed } from './revealed';

const placed: Comment[] = [];

// サーバーの HTML と同じ形で、Suspense 境界の開始と終了のコメントを文書に置く
const boundary = (mark: string): Comment => {
  const start = document.createComment(mark);
  const end = document.createComment('/$');
  document.body.append(start, end);
  placed.push(start, end);
  return start;
};

// 変更の通知が回りきった後で、決着したかどうかを読む
const settledYet = (promise: Promise<void>): Promise<boolean> =>
  Promise.race([
    promise.then(() => true),
    new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 0);
    }),
  ]);

afterEach(() => {
  for (const node of placed.splice(0)) node.remove();
});

describe('whenRevealed', () => {
  it('settles at once when every boundary is on screen or left to the browser', async () => {
    boundary('$');
    boundary('$!');

    expect(await settledYet(whenRevealed())).toBe(true);
  });

  it.each(['$?', '$~'])(
    'waits for a boundary marked %s until it is moved in',
    async (mark) => {
      const start = boundary(mark);
      const revealed = whenRevealed();
      expect(await settledYet(revealed)).toBe(false);

      start.data = '$';

      await expect(revealed).resolves.toBeUndefined();
    },
  );

  it('keeps waiting for a boundary that streamed in inside one just moved in', async () => {
    const outer = boundary('$?');
    const revealed = whenRevealed();
    const inner = boundary('$?');
    outer.data = '$';
    expect(await settledYet(revealed)).toBe(false);

    inner.data = '$';

    await expect(revealed).resolves.toBeUndefined();
  });
});
