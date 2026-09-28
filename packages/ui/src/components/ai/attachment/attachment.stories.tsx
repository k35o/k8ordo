import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Attachment } from '.';

const meta: Meta<typeof Attachment.List> = {
  title: 'components/ai/attachment',
  component: Attachment.List,
};

export default meta;
type Story = StoryObj<typeof Attachment.List>;

const image = (fill: string) =>
  `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"%3E%3Crect width="4" height="3" fill="${encodeURIComponent(fill)}"/%3E%3C/svg%3E`;

export const Images: Story = {
  render: () => (
    <Attachment.List>
      <Attachment.Item
        filename="before.svg"
        mediaType="image/svg+xml"
        url={image('#99d5c9')}
      />
      <Attachment.Item
        filename="after.svg"
        mediaType="image/svg+xml"
        url={image('#a5d8e6')}
      />
    </Attachment.List>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'before.svg' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'after.svg' })).toBeVisible();
  },
};

export const Files: Story = {
  render: () => (
    <Attachment.List>
      <Attachment.Item
        filename="spec.pdf"
        mediaType="application/pdf"
        url="https://example.com/spec.pdf"
      />
      <Attachment.Item
        filename="a-very-long-file-name-that-should-be-truncated-in-the-chip.csv"
        mediaType="text/csv"
        url="data:text/csv;base64,YSxi"
      />
    </Attachment.List>
  ),
  play: async ({ canvas }) => {
    // 画像でないものは名前と種類のチップで出る
    await expect(canvas.getByText('spec.pdf')).toBeVisible();
    await expect(canvas.getByText('application/pdf')).toBeVisible();
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
  },
};

export const WithoutFilename: Story = {
  render: () => (
    <Attachment.List>
      <Attachment.Item mediaType="image" url={image('#99d5c9')} />
      <Attachment.Item mediaType="application/json" url="data:," />
    </Attachment.List>
  ),
  play: async ({ canvas }) => {
    // AI SDK の FileUIPart は filename も完全な MIME タイプも持たないことがある
    await expect(canvas.getByRole('img', { name: '添付画像' })).toBeVisible();
    await expect(canvas.getByText('application/json')).toBeVisible();
  },
};

export const CustomLabel: Story = {
  render: () => (
    <Attachment.List label="生成された画像">
      <Attachment.Item
        filename="chart.svg"
        mediaType="image/svg+xml"
        url={image('#99d5c9')}
      />
    </Attachment.List>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('list', { name: '生成された画像' }),
    ).toBeVisible();
  },
};
