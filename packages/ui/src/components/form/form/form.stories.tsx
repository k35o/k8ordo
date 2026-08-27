import type { Meta, StoryObj } from '@storybook/react-vite';
import { useActionState } from 'react';

import { Button } from '../../buttons/button';
import { FormControl } from '../form-control';
import { TextField } from '../text-field';
import { Form } from './form';

const meta: Meta<typeof Form> = {
  title: 'components/form/form',
  component: Form,
};

export default meta;
type Story = StoryObj<typeof Form>;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const WithAction: Story = {
  render: () => (
    <Form
      action={async (formData) => {
        const name = formData.get('name');
        await sleep(1500);
        console.warn('submitted', { name });
      }}
    >
      <FormControl
        label="お名前"
        renderInput={(props) => <TextField {...props} name="name" />}
      />
      <Button type="submit">送信</Button>
    </Form>
  ),
};

export const WithActionState: Story = {
  render: () => {
    function Inner() {
      const [message, formAction] = useActionState(
        async (_prev: string, formData: FormData) => {
          const name = formData.get('name');
          await sleep(1000);
          return typeof name === 'string' && name.length > 0
            ? `こんにちは、${name}さん`
            : '名前を入力してください';
        },
        '',
      );
      return (
        <Form action={formAction}>
          <FormControl
            label="お名前"
            renderInput={(props) => <TextField {...props} name="name" />}
          />
          <Button type="submit">送信</Button>
          {message && <p className="text-fg-base text-sm">{message}</p>}
        </Form>
      );
    }
    return <Inner />;
  },
};
