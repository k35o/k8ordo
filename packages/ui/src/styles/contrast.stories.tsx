import type { Meta, StoryObj } from '@storybook/react-vite';
import { clsx } from 'clsx';

import styles from './contrast.stories.module.css';

// docs/references/color.md の「Contrast」の表にある組み合わせ。
// components（ライト）と components-dark の両方で axe に確かめさせる。

const TEXT = {
  'fg-base': styles.fgBase,
  'fg-mute': styles.fgMute,
  'fg-subtle': styles.fgSubtle,
  'fg-info': styles.fgInfo,
  'fg-success': styles.fgSuccess,
  'fg-warning': styles.fgWarning,
  'fg-error': styles.fgError,
  'primary-fg': styles.primaryFg,
  'secondary-fg': styles.secondaryFg,
} as const;

const GROUND = {
  'bg-base': styles.bgBase,
  'bg-raised': styles.bgRaised,
  'bg-surface': styles.bgSurface,
  'bg-subtle': styles.bgSubtle,
  'bg-mute': styles.bgMute,
  'bg-emphasize': styles.bgEmphasize,
  'bg-info': styles.bgInfo,
  'bg-success': styles.bgSuccess,
  'bg-warning': styles.bgWarning,
  'bg-error': styles.bgError,
  'primary-bg': styles.primaryBg,
  'primary-bg-subtle': styles.primaryBgSubtle,
  'primary-bg-mute': styles.primaryBgMute,
  'primary-bg-emphasize': styles.primaryBgEmphasize,
  'secondary-bg': styles.secondaryBg,
  'secondary-bg-subtle': styles.secondaryBgSubtle,
  'secondary-bg-mute': styles.secondaryBgMute,
  'secondary-bg-emphasize': styles.secondaryBgEmphasize,
} as const;

type Pair = { text: keyof typeof TEXT; ground: keyof typeof GROUND };

const AAA_PAIRS: readonly Pair[] = [
  ...(
    [
      'fg-base',
      'fg-mute',
      'fg-info',
      'fg-success',
      'fg-warning',
      'fg-error',
      'primary-fg',
      'secondary-fg',
    ] as const
  ).flatMap((text) =>
    (['bg-base', 'bg-raised', 'bg-surface', 'bg-subtle'] as const).map(
      (ground) => ({ text, ground }),
    ),
  ),
  { text: 'fg-info', ground: 'bg-info' },
  { text: 'fg-warning', ground: 'bg-warning' },
  { text: 'fg-error', ground: 'bg-error' },
  { text: 'primary-fg', ground: 'primary-bg-subtle' },
  { text: 'secondary-fg', ground: 'secondary-bg-subtle' },
  { text: 'fg-base', ground: 'bg-mute' },
];

const AA_PAIRS: readonly Pair[] = [
  // ライトでは 6.9:1 で、ほかのステータスと違って AAA に届かない
  { text: 'fg-success', ground: 'bg-success' },
  { text: 'fg-mute', ground: 'bg-mute' },
  { text: 'fg-base', ground: 'bg-emphasize' },
  ...(['bg-base', 'bg-raised', 'bg-surface', 'bg-subtle'] as const).map(
    (ground) => ({ text: 'fg-subtle' as const, ground }),
  ),
  { text: 'primary-fg', ground: 'primary-bg' },
  { text: 'primary-fg', ground: 'primary-bg-mute' },
  { text: 'primary-fg', ground: 'primary-bg-emphasize' },
  { text: 'secondary-fg', ground: 'secondary-bg' },
  { text: 'secondary-fg', ground: 'secondary-bg-mute' },
  { text: 'secondary-fg', ground: 'secondary-bg-emphasize' },
];

const Pairs = ({ pairs }: { pairs: readonly Pair[] }) => (
  <div className={styles.pairs}>
    {pairs.map(({ text, ground }) => (
      <p
        className={clsx(styles.pair, TEXT[text], GROUND[ground])}
        key={`${text} ${ground}`}
      >
        {text} on {ground}
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
