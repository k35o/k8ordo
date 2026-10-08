'use client';

import { useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { Button, FormControl, TextField } from '@k8ordo/ui';
import { useRef, useState, useSyncExternalStore } from 'react';

import * as m from '../../../messages';

type Props = {
  /** ページの Server Component が `formFields(entrySchema)` で導いたもの。 */
  fields: FormFields<'name' | 'email' | 'title' | 'minutes', never>;
};

const subscribe = () => () => {};

// 後のステップはまだ入力していないので、フォーム全体ではなくこのステップの中だけを確かめる
const firstInvalidIn = (
  step: HTMLElement | null,
): HTMLInputElement | undefined =>
  [...(step?.querySelectorAll('input') ?? [])].find(
    (control) => !control.checkValidity(),
  );

export function EntryDemo({ fields }: Props) {
  const form = useForm(fields);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const stepOne = useRef<HTMLFieldSetElement>(null);
  const name = form.field('name');
  const email = form.field('email');
  const title = form.field('title');
  const minutes = form.field('minutes');

  return (
    <form
      {...form.props}
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        form.props.onSubmit(event);
        if (event.defaultPrevented) {
          setSent(false);
          return;
        }
        event.preventDefault();
        setSent(true);
      }}
    >
      <p className="text-fg-mute text-sm">
        {m.formMultiStep.demoProgress(step + 1)}
      </p>
      <fieldset
        className="flex flex-col gap-4"
        hidden={hydrated && step !== 0}
        ref={stepOne}
      >
        <legend className="mb-2 font-bold">
          {m.formMultiStep.demoStepOne()}
        </legend>
        <FormControl
          errorText={name.error}
          invalid={name.invalid}
          label={m.formMultiStep.demoLabelName()}
          renderInput={(props) => (
            <TextField {...props} {...name.input} autoComplete="off" />
          )}
          required={name.required}
        />
        <FormControl
          errorText={email.error}
          invalid={email.invalid}
          label={m.formMultiStep.demoLabelEmail()}
          renderInput={(props) => (
            <TextField {...props} {...email.input} autoComplete="off" />
          )}
          required={email.required}
        />
        {hydrated && (
          <div>
            <Button
              onAction={() => {
                const invalid = firstInvalidIn(stepOne.current);
                if (invalid === undefined) {
                  setStep(1);
                  return;
                }
                invalid.focus();
              }}
              variant="solid"
            >
              {m.formMultiStep.demoNext()}
            </Button>
          </div>
        )}
      </fieldset>
      <fieldset className="flex flex-col gap-4" hidden={hydrated && step !== 1}>
        <legend className="mb-2 font-bold">
          {m.formMultiStep.demoStepTwo()}
        </legend>
        <FormControl
          errorText={title.error}
          invalid={title.invalid}
          label={m.formMultiStep.demoLabelTitle()}
          renderInput={(props) => (
            <TextField {...props} {...title.input} autoComplete="off" />
          )}
          required={title.required}
        />
        <FormControl
          errorText={minutes.error}
          invalid={minutes.invalid}
          label={m.formMultiStep.demoLabelMinutes()}
          renderInput={(props) => <TextField {...props} {...minutes.input} />}
          required={minutes.required}
        />
        <div className="flex flex-wrap items-center gap-3">
          {hydrated && (
            <Button
              color="base"
              onAction={() => {
                setStep(0);
              }}
              variant="outline"
            >
              {m.formMultiStep.demoBack()}
            </Button>
          )}
          {(!hydrated || step === 1) && (
            <Button type="submit" variant="solid">
              {m.formMultiStep.demoSubmit()}
            </Button>
          )}
          <p aria-live="polite" className="text-fg-success text-sm">
            {sent ? m.formMultiStep.demoSent() : ''}
          </p>
        </div>
      </fieldset>
    </form>
  );
}
