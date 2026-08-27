'use client';

import { Button, Form, FormControl, TextField } from '@k8ordo/ui';
import { useActionState, useState } from 'react';

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export function FormBasicPreview() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <Form
        action={async (formData) => {
          await sleep(1000);
          const name = formData.get('name');
          setSubmitted(typeof name === 'string' ? name : null);
        }}
      >
        <FormControl
          label="Name"
          renderInput={(props) => <TextField {...props} name="name" />}
        />
        <Button type="submit">Submit</Button>
      </Form>
      {submitted !== null && (
        <p className="text-fg-base text-sm">Submitted name: {submitted}</p>
      )}
    </div>
  );
}

export function FormActionStatePreview() {
  const [message, formAction] = useActionState(
    async (_prev: string, formData: FormData) => {
      await sleep(1000);
      const name = formData.get('name');
      return typeof name === 'string' && name.length > 0
        ? `Hello, ${name}!`
        : 'Please enter your name';
    },
    '',
  );

  return (
    <Form action={formAction}>
      <FormControl
        label="Name"
        renderInput={(props) => <TextField {...props} name="name" />}
      />
      <Button type="submit">Submit</Button>
      {message && <p className="text-fg-base text-sm">{message}</p>}
    </Form>
  );
}
