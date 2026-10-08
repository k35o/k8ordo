'use client';

import { Button, Form, RadioCard } from '@k8ordo/ui';
import { useState } from 'react';

const options = [
  {
    value: 'starter',
    label: 'Starter',
    description: 'A minimal setup for personal use and small prototypes.',
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'A standard setup for continuous updates and production use.',
  },
  {
    value: 'team',
    label: 'Team',
    description: 'For teams that need reviews and collaborative editing.',
  },
] as const;

export function RadioCardControlledPreview() {
  const [value, setValue] = useState('pro');

  return (
    <div className="w-full max-w-2xl">
      <p
        className="text-fg-base mb-3 font-medium"
        id="radio-card-preview-label"
      >
        Choose a plan
      </p>
      <RadioCard
        disabled={false}
        invalid={false}
        aria-labelledby="radio-card-preview-label"
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
        options={options}
        value={value}
      />
    </div>
  );
}

export function RadioCardFormPreview() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Form
        action={(formData) => {
          const plan = formData.get('plan');
          setSubmitted(typeof plan === 'string' ? plan : null);
        }}
      >
        <p className="text-fg-base font-medium" id="radio-card-form-label">
          Choose a plan
        </p>
        <RadioCard
          defaultValue="pro"
          disabled={false}
          invalid={false}
          aria-labelledby="radio-card-form-label"
          name="plan"
          options={options}
        />
        <Button type="submit">Submit</Button>
      </Form>
      {submitted !== null && (
        <p className="text-fg-base text-sm">Submitted plan: {submitted}</p>
      )}
    </div>
  );
}
