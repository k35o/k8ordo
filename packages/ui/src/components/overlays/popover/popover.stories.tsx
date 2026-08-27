import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';

import type { Placement } from '../../../types/variables';
import { Button } from '../../buttons/button';
import { Modal } from '../modal';
import { Popover } from './popover';

const meta: Meta<typeof Popover.Root> = {
  title: 'components/overlays/popover',
  component: Popover.Root,
};

export default meta;
type Story = StoryObj<typeof Popover.Root>;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger
        renderItem={(props) => (
          <Button {...props} size="md" type="button">
            メニュー
          </Button>
        )}
      />
      <Popover.Content
        renderItem={(props) => (
          <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
            <div role="menuitem">ポップオーバーのコンテンツ</div>
          </div>
        )}
      />
    </Popover.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'メニュー',
    });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
  },
};

// APG menu button パターン: メニュー項目から Tab で抜けたらメニューを閉じ、
// trigger の aria-expanded を false に戻し、フォーカスは次のタブ順要素へ進む。
export const CloseOnTabOut: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Popover.Root>
        <Popover.Trigger
          renderItem={(props) => (
            <Button {...props} size="md" type="button">
              メニュー
            </Button>
          )}
        />
        <Popover.Content
          renderItem={(props) => (
            <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
              <button role="menuitem" type="button">
                項目1
              </button>
            </div>
          )}
        />
      </Popover.Root>
      <Button size="md" type="button">
        次のフォーカス先
      </Button>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'メニュー' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const item = canvas.getByRole('menuitem', { name: '項目1' });
    await waitFor(() => {
      expect(item).toHaveFocus();
    });

    await userEvent.tab();

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(item).not.toBeVisible();
    });
    expect(
      canvas.getByRole('button', { name: '次のフォーカス先' }),
    ).toHaveFocus();
  },
};

const ControllableRender = ({
  onChange,
}: {
  onChange?: (isOpen: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        size="md"
        type="button"
      >
        外から開く
      </Button>
      <Button
        onClick={() => {
          setIsOpen(false);
        }}
        size="md"
        type="button"
      >
        外から閉じる
      </Button>
      <input aria-label="別の入力" type="text" />
      <p>状態: {isOpen ? '開' : '閉'}</p>
      <Popover.Root
        isOpen={isOpen}
        onChange={(next) => {
          onChange?.(next);
          setIsOpen(next);
        }}
      >
        <Popover.Trigger
          renderItem={(props) => (
            <Button {...props} size="md" type="button">
              メニュー
            </Button>
          )}
        />
        <Popover.Content
          renderItem={(props) => (
            <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
              <button role="menuitem" type="button">
                項目1
              </button>
            </div>
          )}
        />
      </Popover.Root>
    </div>
  );
};

// isOpen / onChange で外から開閉できる（controlled）。
export const Controllable: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <ControllableRender onChange={onChange} />,
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'メニュー' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // trigger を触らず、外側の state だけで開く
    await userEvent.click(canvas.getByRole('button', { name: '外から開く' }));
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(canvas.getByRole('menuitem', { name: '項目1' })).toHaveFocus();
    });

    // 内部の閉じる操作は onChange で外へ伝わる
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(canvas.getByText('状態: 閉')).toBeInTheDocument();
    });
    await expect(args.onChange).toHaveBeenCalledWith(false);
  },
};

// controllable 化で isOpen はユーザー操作以外でも落ちるようになった。
// 親がプログラム的に閉じたとき、focus-trap の cleanup が「内側にいた」と
// 誤判定してユーザーの現在位置からフォーカスを奪わないことを固定する。
export const ControlledCloseKeepsOutsideFocus: Story = {
  args: { onChange: fn() },
  render: ({ onChange }) => <ControllableRender onChange={onChange} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'メニュー' });
    await userEvent.click(canvas.getByRole('button', { name: '外から開く' }));
    await waitFor(() => {
      expect(canvas.getByRole('menuitem', { name: '項目1' })).toHaveFocus();
    });

    // ユーザーがポップオーバーの外へフォーカスを移す
    const outside = canvas.getByRole('textbox', { name: '別の入力' });
    await userEvent.click(outside);
    await expect(outside).toHaveFocus();

    // element.click() はフォーカスを移さないので、外側にフォーカスを
    // 残したまま親の state だけで閉じられる
    canvas.getByRole('button', { name: '外から閉じる' }).click();

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
    await expect(outside).toHaveFocus();
  },
};

// defaultOpen で初期表示から開く（uncontrolled）。
export const DefaultOpen: Story = {
  render: () => (
    <Popover.Root defaultOpen>
      <Popover.Trigger
        renderItem={(props) => (
          <Button {...props} size="md" type="button">
            メニュー
          </Button>
        )}
      />
      <Popover.Content
        renderItem={(props) => (
          <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
            <button role="menuitem" type="button">
              項目1
            </button>
          </div>
        )}
      />
    </Popover.Root>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'メニュー' }),
    ).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => {
      expect(canvas.getByRole('menuitem', { name: '項目1' })).toBeVisible();
    });
  },
};

const layerPopover = (name: string) => (
  <Popover.Root closeOnClickAway={false} trapFocus={false} role="dialog">
    <Popover.Trigger
      renderItem={(props) => (
        <Button {...props} size="md" type="button">
          {name}
        </Button>
      )}
    />
    <Popover.Content
      renderItem={(props) => (
        <div
          aria-label={`${name}の中身`}
          className="bg-bg-raised rounded-lg p-4 shadow-md"
          {...props}
        >
          <p>{name}</p>
        </div>
      )}
    />
  </Popover.Root>
);

// APG: Escape は最も内側（最後に開いた）レイヤーだけを閉じる。
export const EscapeClosesOnlyTopLayer: Story = {
  render: () => (
    <div className="flex gap-4">
      {layerPopover('下の層')}
      {layerPopover('上の層')}
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const lower = canvas.getByRole('button', { name: '下の層' });
    const upper = canvas.getByRole('button', { name: '上の層' });

    await userEvent.click(lower);
    await userEvent.click(upper);
    await waitFor(() => {
      expect(lower).toHaveAttribute('aria-expanded', 'true');
      expect(upper).toHaveAttribute('aria-expanded', 'true');
    });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(upper).toHaveAttribute('aria-expanded', 'false');
    });
    await expect(lower).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(lower).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

const EscapeInModalRender = () => (
  <Modal aria-label="モーダル" defaultOpen>
    <div className="p-4">
      <Popover.Root>
        <Popover.Trigger
          renderItem={(props) => (
            <Button {...props} size="md" type="button">
              メニュー
            </Button>
          )}
        />
        <Popover.Content
          renderItem={(props) => (
            <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
              <button role="menuitem" type="button">
                項目1
              </button>
            </div>
          )}
        />
      </Popover.Root>
    </div>
  </Modal>
);

// Modal の中で開いた Popover の Escape は preventDefault され、
// ネイティブ dialog の close request まで届かない。
export const EscapeInModal: Story = {
  render: () => <EscapeInModalRender />,
  play: async ({ canvas, userEvent }) => {
    const dialog = canvas.getByRole('dialog', { name: 'モーダル' });
    const trigger = canvas.getByRole('button', { name: 'メニュー' });
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(canvas.getByRole('menuitem', { name: '項目1' })).toHaveFocus();
    });

    const prevented: boolean[] = [];
    const spy = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        prevented.push(event.defaultPrevented);
      }
    };
    // スタックのリスナ（先に登録済み）より後に走るので、消費されたかを観測できる
    window.addEventListener('keydown', spy);

    try {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
      await expect(prevented).toEqual([true]);
      await expect(dialog.hasAttribute('open')).toBe(true);

      // ポップオーバーが閉じたあとの Escape は誰も消費しない（Modal に届く）
      await userEvent.keyboard('{Escape}');
      await expect(prevented).toEqual([true, false]);
    } finally {
      window.removeEventListener('keydown', spy);
    }
  },
  parameters: {
    a11y: {
      options: {
        rules: {
          'color-contrast': { enabled: false },
        },
      },
    },
  },
};

// 画面の四隅・上下左右の端・中央にトリガーを並べ、各 Popover をクリックで開いて
// 配置と flip（端で入りきらないと反対側へ反転）を目視確認するためのストーリー。
const PLACEMENT_POSITIONS = [
  { key: 'top-left', label: '左上', className: 'top-2 left-2' },
  { key: 'top', label: '上中央', className: 'top-2 left-1/2 -translate-x-1/2' },
  { key: 'top-right', label: '右上', className: 'top-2 right-2' },
  {
    key: 'left',
    label: '左中央',
    className: 'top-1/2 left-2 -translate-y-1/2',
  },
  {
    key: 'center',
    label: '中央',
    className: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },
  {
    key: 'right',
    label: '右中央',
    className: 'top-1/2 right-2 -translate-y-1/2',
  },
  { key: 'bottom-left', label: '左下', className: 'bottom-2 left-2' },
  {
    key: 'bottom',
    label: '下中央',
    className: 'bottom-2 left-1/2 -translate-x-1/2',
  },
  { key: 'bottom-right', label: '右下', className: 'bottom-2 right-2' },
] as const;

export const Placements: Story = {
  render: () => (
    <div className="fixed inset-0">
      {PLACEMENT_POSITIONS.map(({ key, label, className }) => (
        <div className={`absolute ${className}`} key={key}>
          <Popover.Root>
            <Popover.Trigger
              renderItem={(props) => (
                <Button {...props} size="sm" type="button">
                  {label}
                </Button>
              )}
            />
            <Popover.Content
              renderItem={(props) => (
                <div
                  className="bg-bg-raised rounded-lg p-4 shadow-md"
                  {...props}
                >
                  <div role="menuitem">{label}のポップオーバー</div>
                </div>
              )}
            />
          </Popover.Root>
        </div>
      ))}
    </div>
  ),
};

// 各 placement が「意図した側・整列」で出ることをアサーションで保証する。
// 画面中央のトリガーから開くため flip は起きず、要求した placement がそのまま反映される。
const assertPlacement = (
  placement: Placement,
  trigger: Element,
  content: Element,
) => {
  const t = trigger.getBoundingClientRect();
  const c = content.getBoundingClientRect();
  const TOL = 2;
  const [side, align] = placement.split('-');

  // 出る側（offset 8px ぶん必ず外側になる）
  if (side === 'top') expect(c.bottom).toBeLessThanOrEqual(t.top + TOL);
  if (side === 'bottom') expect(c.top).toBeGreaterThanOrEqual(t.bottom - TOL);
  if (side === 'left') expect(c.right).toBeLessThanOrEqual(t.left + TOL);
  if (side === 'right') expect(c.left).toBeGreaterThanOrEqual(t.right - TOL);

  // 整列（上下placementなら水平、左右placementなら垂直）
  const horizontal = side === 'top' || side === 'bottom';
  const startGap = horizontal ? c.left - t.left : c.top - t.top;
  const endGap = horizontal ? t.right - c.right : t.bottom - c.bottom;
  const centerGap = horizontal
    ? (c.left + c.right) / 2 - (t.left + t.right) / 2
    : (c.top + c.bottom) / 2 - (t.top + t.bottom) / 2;
  if (align === 'start') {
    expect(Math.abs(startGap)).toBeLessThanOrEqual(TOL);
  } else if (align === 'end') {
    expect(Math.abs(endGap)).toBeLessThanOrEqual(TOL);
  } else {
    expect(Math.abs(centerGap)).toBeLessThanOrEqual(TOL + 1);
  }
};

const placementStory = (placement: Placement): Story => ({
  render: () => (
    // 縦横ともビューポートを埋めてトリガーを中央に置く（min-h-svh だけだと
    // 縦書きで block 軸=横となり幅が埋まらずトリガーが左端に寄ってしまう）。
    <div className="fixed inset-0 flex items-center justify-center">
      <Popover.Root placement={placement}>
        <Popover.Trigger
          renderItem={(props) => (
            <Button {...props} size="sm" type="button">
              {placement}
            </Button>
          )}
        />
        <Popover.Content
          renderItem={(props) => (
            <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
              <div role="menuitem">{placement}</div>
            </div>
          )}
        />
      </Popover.Root>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: placement });
    await userEvent.click(trigger);
    const content = await waitFor(() => {
      const el = [...document.querySelectorAll('[popover]')].find(
        (p) => p.matches(':popover-open') && !p.id.startsWith('storybook'),
      );
      if (!el) {
        throw new Error('popover did not open');
      }
      return el;
    });
    // 開くアニメーション（scale）で寸法がぶれないよう最終状態に固定してから測る
    for (const animation of content.getAnimations()) {
      animation.finish();
    }
    assertPlacement(placement, trigger, content);
  },
});

export const Top = placementStory('top');
export const TopStart = placementStory('top-start');
export const TopEnd = placementStory('top-end');
export const Bottom = placementStory('bottom');
export const BottomStart = placementStory('bottom-start');
export const BottomEnd = placementStory('bottom-end');
export const Left = placementStory('left');
export const LeftStart = placementStory('left-start');
export const LeftEnd = placementStory('left-end');
export const Right = placementStory('right');
export const RightStart = placementStory('right-start');
export const RightEnd = placementStory('right-end');
