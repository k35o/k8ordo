import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '../components/buttons/button';
import { Card } from '../components/data-display/card';
import { Alert } from '../components/feedback/alert';
import { Progress } from '../components/feedback/progress';
import { CheckboxCard } from '../components/form/checkbox-card';
import { Radio } from '../components/form/radio';
import { Switch } from '../components/form/switch';
import { Separator } from '../components/layout/separator';
import { Tabs } from '../components/navigation/tabs';

import styles from './high-contrast.stories.module.css';

// OS の設定を再現できるのは Vitest の専用プロジェクト（Playwright の
// forcedColors / contrast）だけなので、ふだんの一覧とスナップショットからは外す
const meta: Meta = {
  title: 'styles/high-contrast',
  tags: ['!dev', '!autodocs'],
  parameters: { chromatic: { disableSnapshot: true } },
};

export default meta;
type Story = StoryObj;

const isTransparent = (color: string): boolean =>
  color === 'transparent' || /^rgba\([^)]*,\s*0\)$/u.test(color);

const canvasColor = (): string => {
  const probe = document.createElement('span');
  probe.style.backgroundColor = 'Canvas';
  document.body.append(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
};

const backgroundOf = (element: Element): string =>
  getComputedStyle(element).backgroundColor;

// 強制カラーでは地の色がすべて Canvas に揃うので、それと違う色で塗られていれば見える
const isPainted = (element: Element): boolean => {
  const color = backgroundOf(element);
  return !isTransparent(color) && color !== canvasColor();
};

const drawsOutline = (element: Element): boolean => {
  const style = getComputedStyle(element);
  return (
    style.outlineStyle !== 'none' &&
    style.outlineWidth !== '0px' &&
    !isTransparent(style.outlineColor)
  );
};

const partOf = (element: Element | null | undefined): Element => {
  if (!element) {
    throw new Error('部品の見た目を担う要素が見つからない');
  }
  return element;
};

const CARD_OPTIONS = [
  { value: 'history', label: 'Version history' },
  { value: 'comments', label: 'Inline comments' },
];

export const ForcedColors: Story = {
  tags: ['forced-colors'],
  render: () => (
    <div className={styles.parts}>
      <Card data-testid="card">
        <p className={styles.cardBody}>影だけで縁取るカード</p>
      </Card>
      <Alert message="お知らせ" tone="info" />
      <Button>フォーカスを受けるボタン</Button>
      <Tabs.Root defaultSelectedId="settings" ids={['overview', 'settings']}>
        <Tabs.List label="設定メニュー">
          <Tabs.Tab id="overview">概要</Tabs.Tab>
          <Tabs.Tab id="settings">設定</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="overview">概要の中身</Tabs.Panel>
        <Tabs.Panel id="settings">設定の中身</Tabs.Panel>
      </Tabs.Root>
      <Switch defaultChecked label="オンのスイッチ" />
      <Switch label="オフのスイッチ" />
      <p id="high-contrast-radio">フレームワーク</p>
      <Radio
        aria-labelledby="high-contrast-radio"
        defaultValue="vue"
        options={[
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
        ]}
      />
      <p id="high-contrast-checkbox-card">機能</p>
      <CheckboxCard
        aria-labelledby="high-contrast-checkbox-card"
        defaultValue={['history']}
        options={CARD_OPTIONS}
      />
      <Progress label="進捗" max={100} value={40} />
      <Separator />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(matchMedia('(forced-colors: active)').matches).toBe(true);

    // 境界線: 影と地の色は消えるので、線で縁取られている
    await expect(drawsOutline(canvas.getByTestId('card'))).toBe(true);
    await expect(drawsOutline(canvas.getByRole('status'))).toBe(true);
    const progress = canvas.getByRole('progressbar', { name: '進捗' });
    await expect(drawsOutline(partOf(progress.parentElement))).toBe(true);
    const off = canvas.getByRole('switch', { name: 'オフのスイッチ' });
    await expect(drawsOutline(partOf(off.nextElementSibling))).toBe(true);
    await expect(isPainted(canvas.getByRole('separator'))).toBe(true);

    // フォーカスリング: box-shadow の ring は消えるので、outline で見える
    await userEvent.tab();
    const button = canvas.getByRole('button', {
      name: 'フォーカスを受けるボタン',
    });
    await expect(button).toHaveFocus();
    await expect(drawsOutline(button)).toBe(true);

    // 選択状態
    await expect(
      // インジケータは tablist の最後の子
      isPainted(partOf(canvas.getByRole('tablist').lastElementChild)),
    ).toBe(true);

    const on = canvas.getByRole('switch', { name: 'オンのスイッチ' });
    const onTrack = partOf(on.nextElementSibling);
    await expect(isPainted(onTrack)).toBe(true);
    // オンのつまみは塗られた軌道の上にあるので、軌道と違う色なら見える
    await expect(backgroundOf(partOf(onTrack.firstElementChild))).not.toBe(
      backgroundOf(onTrack),
    );
    await expect(
      isPainted(partOf(off.nextElementSibling?.firstElementChild)),
    ).toBe(true);

    const vueDot = partOf(
      canvas.getByRole('radio', { name: 'Vue' }).nextElementSibling
        ?.firstElementChild,
    );
    await expect(isPainted(vueDot)).toBe(true);
    await expect(getComputedStyle(vueDot).opacity).toBe('1');

    const checkOf = (name: string): Element =>
      partOf(
        canvas.getByRole('checkbox', { name }).parentElement?.lastElementChild
          ?.firstElementChild,
      );
    await expect(getComputedStyle(checkOf('Version history')).visibility).toBe(
      'visible',
    );
    await expect(getComputedStyle(checkOf('Inline comments')).visibility).toBe(
      'hidden',
    );

    await expect(isPainted(progress)).toBe(true);
  },
};

const TEXT_TOKENS = [
  { token: 'text-fg-base', className: styles.fgBase },
  { token: 'text-fg-mute', className: styles.fgMute },
  { token: 'text-fg-subtle', className: styles.fgSubtle },
  { token: 'text-primary-fg', className: styles.primaryFg },
  { token: 'text-secondary-fg', className: styles.secondaryFg },
] as const;

const Samples = () => (
  <div className={styles.samples}>
    {TEXT_TOKENS.map(({ token, className }) => (
      <p className={className} key={token}>
        {token}
      </p>
    ))}
    <p className={styles.subtle}>text-fg-subtle on bg-subtle</p>
    <p className={styles.info}>text-fg-info on bg-info</p>
    <p className={styles.success}>text-fg-success on bg-success</p>
    <p className={styles.warning}>text-fg-warning on bg-warning</p>
    <p className={styles.error}>text-fg-error on bg-error</p>
  </div>
);

export const ContrastMore: Story = {
  tags: ['contrast-more'],
  parameters: {
    // 高コントラストでは、ページとカードの地、各ステータスの地の上の文字を AAA にする
    a11y: {
      options: { rules: { 'color-contrast-enhanced': { enabled: true } } },
    },
  },
  render: () => (
    <div className={styles.column}>
      <Samples />
      <div className="dark">
        <Samples />
      </div>
      <Card data-testid="card">
        <p className={styles.cardBody}>影だけで縁取るカード</p>
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(matchMedia('(prefers-contrast: more)').matches).toBe(true);
    await expect(drawsOutline(canvas.getByTestId('card'))).toBe(true);
  },
};
