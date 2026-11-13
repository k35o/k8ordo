import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FC } from 'react';
import { expect } from 'storybook/test';

import * as icons from '.';
import type { IconRenderProps } from '.';

import styles from './icons.stories.module.css';

const meta: Meta = {
  title: 'components/icons',
};

export default meta;
type Story = StoryObj<FC>;

const { AlertIcon, BaseIcon, ChevronIcon, ...shapes } = icons;

const isDecorative = async (canvasElement: HTMLElement) => {
  const svgs = [...canvasElement.querySelectorAll('svg')];
  await expect(svgs.length).toBeGreaterThan(0);
  await Promise.all(
    svgs.flatMap((svg) => [
      expect(svg).toHaveAttribute('aria-hidden', 'true'),
      expect(svg).toHaveAttribute('focusable', 'false'),
    ]),
  );
};

export const Gallery: Story = {
  render: () => (
    <ul className={styles.gallery}>
      {Object.entries(shapes).map(([name, Icon]) => (
        <li className={styles.item} key={name}>
          <span className={styles.sizes}>
            <Icon size="sm" />
            <Icon />
          </span>
          <span className={styles.name}>{name}</span>
        </li>
      ))}
    </ul>
  ),
  play: ({ canvasElement }) => isDecorative(canvasElement),
};

export const Sizes: Story = {
  render: () => (
    <div className={styles.row}>
      <shapes.CheckIcon size="xs" />
      <shapes.CheckIcon size="sm" />
      <shapes.CheckIcon size="md" />
      <shapes.CheckIcon size="lg" />
      <shapes.CheckIcon size="xl" />
      <shapes.CheckIcon size="2xl" />
      <shapes.CheckIcon size="3xl" />
    </div>
  ),
  play: ({ canvasElement }) => isDecorative(canvasElement),
};

export const Chevron: Story = {
  render: () => (
    <div className={styles.row}>
      <ChevronIcon direction="up" />
      <ChevronIcon direction="down" />
      <ChevronIcon direction="left" />
      <ChevronIcon direction="right" />
    </div>
  ),
  play: ({ canvasElement }) => isDecorative(canvasElement),
};

export const Alert: Story = {
  render: () => (
    <div className={styles.row}>
      <AlertIcon status="success" />
      <AlertIcon status="info" />
      <AlertIcon status="warning" />
      <AlertIcon status="error" />
    </div>
  ),
  play: ({ canvasElement }) => isDecorative(canvasElement),
};

const Dot: FC<IconRenderProps> = (props) => (
  <svg {...props} viewBox="0 0 16 16">
    <circle cx="8" cy="8" fill="currentColor" r="4" />
  </svg>
);

export const OwnIcon: Story = {
  render: () => (
    <div className={styles.row}>
      <BaseIcon renderItem={(props) => <Dot {...props} />} size="sm" />
      <BaseIcon renderItem={(props) => <Dot {...props} />} size="lg" />
    </div>
  ),
  play: ({ canvasElement }) => isDecorative(canvasElement),
};
