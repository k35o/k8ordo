import { useRef, useState } from 'react';
import type { FC } from 'react';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

import { useFocusTrap } from '.';

const Popup: FC<{
  withFocusable?: boolean;
}> = ({ withFocusable = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(contentRef, triggerRef, isOpen);

  return (
    <>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        ref={triggerRef}
        type="button"
      >
        トリガー
      </button>
      {isOpen ? (
        <div ref={contentRef}>
          {withFocusable ? (
            <button type="button">ポップアップ内ボタン</button>
          ) : (
            <p>フォーカス可能な要素なし</p>
          )}
        </div>
      ) : null}
      <button type="button">外側のボタン</button>
      {/* トリガー以外の経路で閉じる。userEvent で押すとフォーカスは外側に残る */}
      <button
        onClick={() => {
          setIsOpen(false);
        }}
        type="button"
      >
        外から閉じる
      </button>
    </>
  );
};

const activeElement = () => document.activeElement;

describe('useFocusTrap', () => {
  it('開いたときポップアップ内の先頭のフォーカス可能要素へフォーカスを移す', async () => {
    const screen = await render(<Popup />);

    await userEvent.click(screen.getByRole('button', { name: 'トリガー' }));

    const inner = screen
      .getByRole('button', { name: 'ポップアップ内ボタン' })
      .element();
    await expect.poll(activeElement).toBe(inner);
  });

  it('フォーカス可能な要素が無いときはコンテナ自体へフォーカスを移す', async () => {
    const screen = await render(<Popup withFocusable={false} />);

    await userEvent.click(screen.getByRole('button', { name: 'トリガー' }));

    const container = screen
      .getByText('フォーカス可能な要素なし')
      .element().parentElement;
    await expect.poll(activeElement).toBe(container);
  });

  it('内側にフォーカスがある状態で閉じるとトリガーへ返す', async () => {
    const screen = await render(<Popup />);
    const trigger = screen.getByRole('button', { name: 'トリガー' }).element();

    await userEvent.click(trigger);
    const inner = screen
      .getByRole('button', { name: 'ポップアップ内ボタン' })
      .element();
    await expect.poll(activeElement).toBe(inner);

    // element.click() はフォーカスを移さないので、内側にフォーカスを
    // 残したままトリガー以外の経路で閉じられる
    (
      screen
        .getByRole('button', { name: '外から閉じる' })
        .element() as HTMLElement
    ).click();

    await expect.poll(activeElement).toBe(trigger);
  });

  it('外側を意図的にフォーカスしてから閉じてもフォーカスを奪い返さない', async () => {
    const screen = await render(<Popup />);

    await userEvent.click(screen.getByRole('button', { name: 'トリガー' }));
    const inner = screen
      .getByRole('button', { name: 'ポップアップ内ボタン' })
      .element();
    await expect.poll(activeElement).toBe(inner);

    // 外側のボタンを押して閉じる。押した時点でフォーカスは外側にあるので、
    // cleanup がトリガーへ奪い返してはいけない
    const closer = screen
      .getByRole('button', { name: '外から閉じる' })
      .element();
    await userEvent.click(closer);

    await expect.poll(activeElement).toBe(closer);
  });

  it('enabled が false の間はフォーカスを操作しない', async () => {
    const screen = await render(<Popup />);
    const outside = screen
      .getByRole('button', { name: '外側のボタン' })
      .element();

    await userEvent.click(outside);

    await expect.poll(activeElement).toBe(outside);
  });
});
