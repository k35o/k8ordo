import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, FC } from 'react';
import { expect, screen, waitFor } from 'storybook/test';

import { Button } from '../../buttons/button';
import { Tooltip } from './tooltip';

const meta: Meta<typeof Tooltip.Root> = {
  title: 'components/overlays/tooltip',
  component: Tooltip.Root,
  parameters: {
    a11y: {
      options: {
        rules: {
          // https://github.com/floating-ui/floating-ui/pull/2298#issuecomment-1518101512
          'aria-hidden-focus': { enabled: false },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip.Root>;

export const Default: Story = {
  render: () => (
    <Tooltip.Root placement="bottom-start">
      <Tooltip.Trigger
        renderItem={(props) => (
          <Button type="button" {...props}>
            ヘルプ
          </Button>
        )}
      />
      <Tooltip.Content>
        <p>ここに補足情報が表示されます</p>
      </Tooltip.Content>
    </Tooltip.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'ヘルプ',
    });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      const animated = tooltip.closest('[style*="opacity"]') ?? tooltip;
      if (getComputedStyle(animated).opacity !== '1') {
        throw new Error('waiting for animation');
      }
    });
  },
};

const ComparisonRow: FC<{
  caption: string;
  description: string;
  triggerText: string;
  delays: Pick<ComponentProps<typeof Tooltip.Root>, 'openDelay' | 'closeDelay'>;
}> = ({ caption, description, triggerText, delays }) => (
  <section className="flex items-center gap-8">
    <Tooltip.Root placement="bottom-start" {...delays}>
      <Tooltip.Trigger
        renderItem={(props) => (
          <Button type="button" {...props}>
            {triggerText}
          </Button>
        )}
      />
      <Tooltip.Content>
        <p>ポインタをここまで移動できますか？</p>
      </Tooltip.Content>
    </Tooltip.Root>
    <div>
      <p className="font-bold">{caption}</p>
      <p className="text-fg-mute text-sm">{description}</p>
    </div>
  </section>
);

/**
 * ホバー寛容化の変種を触り比べるための比較ストーリー。
 * trigger から tooltip 本体へポインタを移動して、閉じずに渡れるかを確かめる。
 */
export const HoverForgivenessComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-4 pb-40">
      <ComparisonRow
        caption="① ブリッジのみ（closeDelay: 0 を明示）"
        delays={{ closeDelay: 0 }}
        description="8px の隙間は真下方向なら渡れるが、斜めに外れると即閉じる。"
        triggerText="ブリッジのみ"
      />
      <ComparisonRow
        caption="② 閉じ遅延 150ms ＋ ブリッジ（既定値）"
        delays={{}}
        description="外れても 150ms は猶予があり、斜め移動でも content に入れば維持される。"
        triggerText="閉じ遅延あり"
      />
      <ComparisonRow
        caption="③ 開き遅延 300ms ＋ 閉じ遅延 150ms"
        delays={{ openDelay: 300 }}
        description="通過しただけでは開かない。意図して留まったときだけ表示される。"
        triggerText="開き遅延もあり"
      />
    </div>
  ),
};

/**
 * 透明ブリッジの可視化。trigger と content の 8px の隙間を覆う当たり判定が
 * 着色される。placement の辺（flip 前の要求値）に応じて付く側が変わる。
 */
export const BridgeDebug: Story = {
  render: () => (
    <>
      <style>{`[role='tooltip']::before {
        background: color-mix(in oklch, var(--color-primary-bg) 40%, transparent);
      }
      [role='tooltip']::after {
        background: color-mix(in oklch, var(--color-secondary-bg) 40%, transparent);
      }`}</style>
      <div className="flex flex-col items-center gap-32 p-32">
        {(['bottom-start', 'top-start', 'right', 'left'] as const).map(
          (placement) => (
            <Tooltip.Root defaultOpen key={placement} placement={placement}>
              <Tooltip.Trigger
                renderItem={(props) => (
                  <Button type="button" {...props}>
                    {`トリガーの方が広い ${placement}`}
                  </Button>
                )}
              />
              <Tooltip.Content>
                <p>短い</p>
              </Tooltip.Content>
            </Tooltip.Root>
          ),
        )}
      </div>
    </>
  ),
};

// closeDelay は既定値（150ms）のまま検証し、デフォルト挙動を固定するテストにする。
export const StaysOpenWhileMovingToContent: Story = {
  render: () => (
    <Tooltip.Root placement="bottom-start">
      <Tooltip.Trigger
        renderItem={(props) => (
          <Button type="button" {...props}>
            ヘルプ
          </Button>
        )}
      />
      <Tooltip.Content>
        <p>ツールチップの本文</p>
      </Tooltip.Content>
    </Tooltip.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'ヘルプ' });
    await userEvent.hover(trigger);
    const tooltip = await screen.findByRole('tooltip');
    // trigger を離れてから閉じ遅延内に content へ入れば、猶予経過後も開いたまま。
    await userEvent.unhover(trigger);
    await userEvent.hover(tooltip);
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
    await expect(tooltip).toBeVisible();
    // content を離れると閉じる。
    await userEvent.unhover(tooltip);
    await waitFor(() => {
      expect(tooltip).not.toBeVisible();
    });
  },
};
