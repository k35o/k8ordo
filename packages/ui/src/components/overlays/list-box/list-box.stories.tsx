import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor, within } from 'storybook/test';

import { ListIcon } from '../../icons';
import type { Option } from './../../../types/variables';
import { ListBox } from './list-box';

const meta: Meta<typeof ListBox.Root> = {
  title: 'components/overlays/list-box',
  component: ListBox.Root,
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
type Story = StoryObj<typeof ListBox.Root>;

const OPTIONS: readonly Option[] = [
  { value: '1', label: 'りんご' },
  { value: '2', label: 'バナナ' },
  { value: '3', label: 'さくらんぼ' },
  { value: '4', label: 'ぶどう' },
  { value: '5', label: 'メロン' },
  { value: '6', label: 'いちご' },
  { value: '7', label: 'みかん' },
  { value: '8', label: 'もも' },
  { value: '9', label: 'キウイ' },
  { value: '10', label: 'レモン' },
];

const DefaultRender = () => {
  const [selected, setSelected] = useState<string>();
  return (
    <div className="w-56">
      <ListBox.Root
        onChange={(value: string) => {
          setSelected(value);
        }}
        options={OPTIONS}
        value={selected}
      >
        <ListBox.Trigger />
        <ListBox.Content />
      </ListBox.Root>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultRender />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', {
      name: '選択してください',
    });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
  },
};

const WithLabelRender = () => {
  const [selected, setSelected] = useState<string>();
  return (
    <div className="w-56">
      <ListBox.Root
        onChange={(value: string) => {
          setSelected(value);
        }}
        options={OPTIONS}
        value={selected}
      >
        <ListBox.Trigger label="果物" />
        <ListBox.Content />
      </ListBox.Root>
    </div>
  );
};

// label は「何を選ぶ入力か」をアクセシブル名に足す。可視テキストは現在値のまま。
export const WithLabel: Story = {
  render: () => <WithLabelRender />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', {
      name: '果物 選択してください',
    });
    await expect(trigger).toHaveTextContent('選択してください');

    await userEvent.click(trigger);
    const option = await waitFor(() =>
      canvas.getByRole('option', { name: 'バナナ' }),
    );
    await userEvent.click(option);

    await waitFor(() => {
      expect(
        canvas.getByRole('combobox', { name: '果物 バナナ' }),
      ).toHaveTextContent('バナナ');
    });
  },
};

const WithHelpContentRender = () => {
  const [selected, setSelected] = useState<string>('1');
  return (
    <div className="w-56">
      <ListBox.Root
        onChange={(value: string) => {
          setSelected(value);
        }}
        options={OPTIONS}
        value={selected}
      >
        <ListBox.Trigger label="果物" />
        <ListBox.Content
          helpContent={
            <p className="text-fg-mute px-3 pb-2 text-sm">ひとつだけ選べます</p>
          }
        />
      </ListBox.Root>
    </div>
  );
};

// helpContent は listbox の外（ポップオーバー直下）に置く。
// listbox の直下に置くと axe の aria-required-children 違反になる。
export const WithHelpContent: Story = {
  render: () => <WithHelpContentRender />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: '果物 りんご' });
    await userEvent.click(trigger);

    const listbox = await waitFor(() => canvas.getByRole('listbox'));
    await expect(within(listbox).getAllByRole('option')).toHaveLength(
      OPTIONS.length,
    );
    await expect(listbox).not.toHaveTextContent('ひとつだけ選べます');
    // listbox の外に出しても、読み上げには aria-describedby で繋がっている
    await expect(listbox).toHaveAccessibleDescription('ひとつだけ選べます');
  },
};

const IconTriggerRender = () => {
  const [selected, setSelected] = useState<string>('2');
  return (
    <ListBox.Root
      onChange={(value: string) => {
        setSelected(value);
      }}
      options={OPTIONS}
      value={selected}
    >
      <ListBox.IconTrigger icon={<ListIcon />} label="果物" />
      <ListBox.Content />
    </ListBox.Root>
  );
};

export const IconTrigger: Story = {
  render: () => <IconTriggerRender />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: '果物 バナナ' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(canvas.getByRole('listbox')).toBeVisible();
    });
  },
};

// value / onChange を渡さない非制御利用。defaultValue が初期選択になり、
// 選択状態はコンポーネント内部で保持される
export const Uncontrolled: Story = {
  render: () => (
    <ListBox.Root defaultValue="2" options={OPTIONS}>
      <ListBox.Trigger label="果物" />
      <ListBox.Content />
    </ListBox.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: '果物 バナナ' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(canvas.getByRole('listbox')).toBeVisible();
    });
    await userEvent.click(canvas.getByRole('option', { name: 'りんご' }));
    // onChange を渡していなくても内部状態が更新される
    await waitFor(() => {
      expect(
        canvas.getByRole('combobox', { name: '果物 りんご' }),
      ).toBeVisible();
    });
  },
};
