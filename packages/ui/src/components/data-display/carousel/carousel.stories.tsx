import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Carousel } from '.';

const meta: Meta<typeof Carousel.Root> = {
  title: 'components/data-display/carousel',
  component: Carousel.Root,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Carousel.Root>;

const SEASONS = [
  { name: '春', note: '桜が咲き、新しい年度が始まる' },
  { name: '夏', note: '日が長く、夕立がよく降る' },
  { name: '秋', note: '空気が澄み、木々が色づく' },
  { name: '冬', note: '朝晩が冷え、雪が舞う' },
] as const;

// 「2 / 4」の表示。数字だけで探すと総数の側にも当たる
const positionOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[aria-live="polite"]');

const SeasonSlides = () =>
  SEASONS.map((season) => (
    <Carousel.Slide key={season.name} label={season.name}>
      <div className="bg-bg-subtle flex h-48 flex-col justify-end gap-1 rounded-xl p-6">
        <p className="text-fg-base text-2xl font-bold">{season.name}</p>
        <p className="text-fg-mute text-sm">{season.note}</p>
      </div>
    </Carousel.Slide>
  ));

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Carousel.Root label="四季">
        <SeasonSlides />
      </Carousel.Root>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const previous = canvas.getByRole('button', { name: '前のスライド' });
    const next = canvas.getByRole('button', { name: '次のスライド' });

    await waitFor(() => {
      expect(positionOf(canvasElement)).toHaveTextContent('1/4');
    });
    await expect(previous).toBeDisabled();

    await userEvent.click(next);
    await waitFor(() => {
      expect(positionOf(canvasElement)).toHaveTextContent('2/4');
    });
    await expect(previous).toBeEnabled();

    await userEvent.click(next);
    await userEvent.click(next);
    await waitFor(() => {
      expect(next).toBeDisabled();
    });
    await expect(positionOf(canvasElement)).toHaveTextContent('4/4');

    await userEvent.click(previous);
    await waitFor(() => {
      expect(positionOf(canvasElement)).toHaveTextContent('3/4');
    });
  },
};

// region とスライドは、読み上げでカルーセルとスライドだと分かる
export const Semantics: Story = {
  render: () => (
    <div className="max-w-md">
      <Carousel.Root label="四季">
        <SeasonSlides />
      </Carousel.Root>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: '四季' })).toHaveAttribute(
      'aria-roledescription',
      'カルーセル',
    );
    const slides = canvas.getAllByRole('group');

    await expect(slides).toHaveLength(4);
    await expect(slides[0]).toHaveAccessibleName('春');
    await expect(slides[0]).toHaveAttribute('aria-roledescription', 'スライド');
  },
};

// 複数枚を並べるときは「何枚目か」を出さず、送り終えたら次へを止める
export const SeveralPerView: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Carousel.Root label="四季" slideSize="sm">
        <SeasonSlides />
      </Carousel.Root>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const next = canvas.getByRole('button', { name: '次のスライド' });

    await expect(positionOf(canvasElement)).toBeNull();
    await waitFor(() => {
      expect(next).toBeEnabled();
    });

    await userEvent.click(next);
    await waitFor(() => {
      expect(next).toBeDisabled();
    });
  },
};

// トラックそのものにフォーカスを置けるので、矢印キーでもスクロールできる
// （play の userEvent は合成イベントでスクロールを起こせないので、フォーカスまでを見る）
export const FocusableTrack: Story = {
  render: () => (
    <div className="max-w-md">
      <Carousel.Root label="四季" slideSize="lg">
        <SeasonSlides />
      </Carousel.Root>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    await userEvent.tab();

    await expect(canvasElement.querySelector('[tabindex="0"]')).toHaveFocus();
  },
};

// 続けて押しても、押した回数だけ送れる
export const RapidClicks: Story = {
  render: () => (
    <div className="max-w-md">
      <Carousel.Root label="四季">
        <SeasonSlides />
      </Carousel.Root>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const next = canvas.getByRole('button', { name: '次のスライド' });

    await waitFor(() => {
      expect(next).toBeEnabled();
    });
    await userEvent.dblClick(next);

    await waitFor(() => {
      expect(positionOf(canvasElement)).toHaveTextContent('3/4');
    });
  },
};

export const Vertical: Story = {
  parameters: {
    writingMode: 'vertical',
  },
  render: () => (
    <div className="h-96">
      <Carousel.Root label="四季">
        <SeasonSlides />
      </Carousel.Root>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const next = canvas.getByRole('button', { name: '次のスライド' });

    await waitFor(() => {
      expect(next).toBeEnabled();
    });
    await userEvent.click(next);
    await waitFor(() => {
      expect(positionOf(canvasElement)).toHaveTextContent('2/4');
    });
  },
};
