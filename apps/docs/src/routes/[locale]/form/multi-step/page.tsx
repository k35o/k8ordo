import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { EntryDemo } from './_parts/entry-demo';
import { entrySchema } from './_parts/entry-schema';

const t = m.formMultiStep;

const KEEP = `const subscribe = () => () => {};
const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

<fieldset hidden={hydrated && step !== 0} ref={stepOne}>
  {/* step 1 */}
</fieldset>
<fieldset hidden={hydrated && step !== 1}>
  {/* step 2 */}
</fieldset>`;

const VALIDATE = `const next = () => {
  const controls = stepOne.current?.querySelectorAll('input') ?? [];
  const invalid = [...controls].find((control) => !control.checkValidity());
  if (invalid !== undefined) {
    invalid.focus();
    return;
  }
  setStep(1);
};`;

const SUBMIT = `{(!hydrated || step === 1) && <button type="submit">Submit</button>}`;

const ERRORS = `const STEP_OF: Record<string, number> = {
  name: 0,
  email: 0,
  title: 1,
  minutes: 1,
};

const [shownState, setShownState] = useState(state);
if (state !== shownState) {
  setShownState(state);
  const failed = Object.keys(state.errors ?? {}).map(
    (key) => STEP_OF[key] ?? 0,
  );
  if (failed.length > 0) setStep(Math.min(...failed));
}`;

export default function FormMultiStepPage() {
  // 文言はロケールに従うので、描画のたびに導く
  const entryFields = formFields(entrySchema);

  return (
    <DocPage introduction={t.introduction} path="/:locale/form/multi-step">
      <DocSection description={t.keepDescription} id="keep" title={t.keepTitle}>
        <CodeBlock code={KEEP} lang="tsx" title="entry-form.tsx" />
        <p>
          <Rich>{t.keepHydrated()}</Rich>
        </p>
        <p>
          <Rich>{t.keepNoJs()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.validateDescription}
        id="validate"
        title={t.validateTitle}
      >
        <CodeBlock code={VALIDATE} lang="tsx" title="entry-form.tsx" />
        <p>
          <Rich>{t.validateFocus()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.submitDescription}
        id="submit"
        title={t.submitTitle}
      >
        <CodeBlock code={SUBMIT} lang="tsx" title="entry-form.tsx" />
        <Pitfall>
          <p>
            <Rich>{t.submitEnter()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.errorsDescription}
        id="errors"
        title={t.errorsTitle}
      >
        <p>
          <Rich>{t.errorsSwitch()}</Rich>
        </p>
        <CodeBlock code={ERRORS} lang="tsx" title="entry-form.tsx" />
        <p>
          <Rich>{t.errorsBrowser()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <EntryDemo fields={entryFields} />
      </Playground>
    </DocPage>
  );
}
