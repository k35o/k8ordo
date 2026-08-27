import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';

import { Radio } from './radio';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
] as const;

const meta: Meta<typeof Radio> = {
  title: 'components/form/radio',
  component: Radio,
  args: {
    disabled: false,
    'aria-labelledby': 'radio-story-label',
    options,
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

const DefaultRender = (props: ComponentProps<typeof Radio>) => {
  const [value, setValue] = useState('react');
  const { defaultValue: _defaultValue, ...radioProps } = props;

  return (
    <div className="w-full max-w-md">
      <p
        className="text-fg-base mb-3 font-medium"
        id={props['aria-labelledby']}
      >
        Framework
      </p>
      <Radio
        {...radioProps}
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
        value={value}
      />
    </div>
  );
};

export const Default: Story = {
  render: (props) => <DefaultRender {...props} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 'vue',
    disabled: true,
  },
};
