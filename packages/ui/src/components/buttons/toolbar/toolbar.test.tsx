import { describe, expect, it } from 'vite-plus/test';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';

import { Toolbar } from '.';
import { Button } from '../button';

import '../../../styles/index.css';

const pressedLook = () => {
  const probe = document.createElement('div');
  probe.style.backgroundColor = 'var(--color-bg-emphasize)';
  probe.style.color = 'var(--color-fg-base)';
  document.body.append(probe);
  const { backgroundColor, color } = getComputedStyle(probe);
  probe.remove();
  return { backgroundColor, color };
};

const settledLook = async (element: Element) => {
  await Promise.all(
    element.getAnimations().map(async (animation) => animation.finished),
  );
  const { backgroundColor, color } = getComputedStyle(element);
  return { backgroundColor, color };
};

// ストーリーの play の userEvent は合成のイベントで :hover が付かないので、
// ストーリーではなく本物のポインタで確かめる
describe('Toolbar の押した項目の地', () => {
  it('塗りの Button も、ホバーのあいだツールバーの地と文字色のまま', async () => {
    await render(
      <Toolbar.Root aria-label="書式">
        <Toolbar.Item
          renderItem={(props) => (
            <Button {...props} aria-pressed size="sm" variant="solid">
              太字
            </Button>
          )}
        />
      </Toolbar.Root>,
    );
    const bold = page.getByRole('button', { name: '太字' }).element();

    await expect(settledLook(bold)).resolves.toStrictEqual(pressedLook());

    await userEvent.hover(bold);
    expect(bold.matches(':hover')).toBe(true);
    await expect(settledLook(bold)).resolves.toStrictEqual(pressedLook());
  });
});
