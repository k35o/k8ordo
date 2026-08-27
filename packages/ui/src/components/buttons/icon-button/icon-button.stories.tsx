import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect } from 'storybook/test';

import { CopyIcon } from '../../icons';
import { IconButton } from './icon-button';

const meta: Meta<typeof IconButton> = {
  title: 'components/buttons/icon-button',
  component: IconButton,
  args: {
    label: 'コピー',
    children: <CopyIcon />,
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ColorBase: Story = {
  args: {
    color: 'base',
  },
};

export const ColorPrimary: Story = {
  args: {
    color: 'primary',
  },
};

export const ColorSecondary: Story = {
  args: {
    color: 'secondary',
  },
};

const NativeAttributesRender = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [tagName, setTagName] = useState('');
  return (
    <>
      <IconButton
        label="コピー"
        name="action"
        onClick={() => {
          setTagName(ref.current?.tagName ?? '');
        }}
        ref={ref}
        tooltipDisabled
        value="copy"
      >
        <CopyIcon />
      </IconButton>
      <p>{tagName}</p>
    </>
  );
};

export const NativeAttributes: Story = {
  render: () => <NativeAttributesRender />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'コピー' });
    await expect(button).toHaveAttribute('name', 'action');
    await expect(button).toHaveAttribute('value', 'copy');
    await userEvent.click(button);
    await expect(canvas.getByRole('paragraph')).toHaveTextContent('BUTTON');
  },
};
