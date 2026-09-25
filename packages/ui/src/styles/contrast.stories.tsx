import type { Meta, StoryObj } from '@storybook/react-vite';

// docs/references/color.md の「Contrast」の表にある組み合わせ。
// components（ライト）と components-dark の両方で axe に確かめさせる。
// Tailwind が拾えるよう、クラスはそのままの文字列で書く

type Pair = { text: string; ground: string };

const AAA_PAIRS: readonly Pair[] = [
  ...[
    'text-fg-base',
    'text-fg-mute',
    'text-fg-info',
    'text-fg-success',
    'text-fg-warning',
    'text-fg-error',
    'text-primary-fg',
    'text-secondary-fg',
  ].flatMap((text) =>
    ['bg-bg-base', 'bg-bg-raised', 'bg-bg-surface', 'bg-bg-subtle'].map(
      (ground) => ({ text, ground }),
    ),
  ),
  { text: 'text-fg-info', ground: 'bg-bg-info' },
  { text: 'text-fg-warning', ground: 'bg-bg-warning' },
  { text: 'text-fg-error', ground: 'bg-bg-error' },
  { text: 'text-primary-fg', ground: 'bg-primary-bg-subtle' },
  { text: 'text-secondary-fg', ground: 'bg-secondary-bg-subtle' },
];

const AA_PAIRS: readonly Pair[] = [
  // ライトでは 6.9:1 で、ほかのステータスと違って AAA に届かない
  { text: 'text-fg-success', ground: 'bg-bg-success' },
  { text: 'text-fg-mute', ground: 'bg-bg-mute' },
  ...['bg-bg-base', 'bg-bg-raised', 'bg-bg-surface', 'bg-bg-subtle'].map(
    (ground) => ({ text: 'text-fg-subtle', ground }),
  ),
  { text: 'text-primary-fg', ground: 'bg-primary-bg' },
  { text: 'text-primary-fg', ground: 'bg-primary-bg-mute' },
  { text: 'text-primary-fg', ground: 'bg-primary-bg-emphasize' },
  { text: 'text-secondary-fg', ground: 'bg-secondary-bg' },
  { text: 'text-secondary-fg', ground: 'bg-secondary-bg-mute' },
  { text: 'text-secondary-fg', ground: 'bg-secondary-bg-emphasize' },
];

const Pairs = ({ pairs }: { pairs: readonly Pair[] }) => (
  <div className="flex flex-col gap-1">
    {pairs.map(({ text, ground }) => (
      <p className={`${text} ${ground} px-3 py-1`} key={`${text} ${ground}`}>
        {text.replace('text-', '')} on {ground.replace('bg-', '')}
      </p>
    ))}
  </div>
);

const meta: Meta = {
  title: 'styles/contrast',
};

export default meta;
type Story = StoryObj;

export const Aaa: Story = {
  parameters: {
    a11y: {
      options: { rules: { 'color-contrast-enhanced': { enabled: true } } },
    },
  },
  render: () => <Pairs pairs={AAA_PAIRS} />,
};

export const Aa: Story = {
  render: () => <Pairs pairs={AA_PAIRS} />,
};
