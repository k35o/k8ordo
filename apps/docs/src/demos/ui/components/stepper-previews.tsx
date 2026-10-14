'use client';

import { Button, Stepper } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './stepper-previews.module.css';

const STEPS = [
  { label: 'Plan', description: 'Pick what fits' },
  { label: 'Payment', description: 'Card or invoice' },
  { label: 'Review', description: 'Check and send' },
];

export function StepperInteractivePreview() {
  const [step, setStep] = useState(2);
  return (
    <div className={styles.root}>
      <Stepper
        aria-label="Sign-up"
        interactive
        onChange={setStep}
        steps={STEPS}
        value={step}
      />
      <div className={styles.actions}>
        <Button
          disabled={step >= STEPS.length}
          onClick={() => {
            setStep((current) => current + 1);
          }}
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
