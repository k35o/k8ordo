import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { EntryDemo } from '../../../../demos/form/multi-step/entry-demo';
import { entrySchema } from '../../../../demos/form/multi-step/entry-schema';
import * as m from '../../../../messages';

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
      <DocSection id="keep" title={t.keepTitle}>
        <CodeBlock
          callouts={{ 2: t.keepHydratedCallout(), 4: t.keepHiddenCallout() }}
          code={KEEP}
          lang="tsx"
          marks={{ 2: 'highlight', 4: 'highlight', 7: 'highlight' }}
          title="entry-form.tsx"
        />
        <p>
          <Rich>{t.keepFieldset()}</Rich>
        </p>
        <p>
          <Rich>{t.keepHydrated()}</Rich>
        </p>
      </DocSection>

      <DocSection id="validate" title={t.validateTitle}>
        <CodeBlock
          callouts={{ 2: t.validateScopeCallout() }}
          code={VALIDATE}
          lang="tsx"
          marks={{ 2: 'highlight', 3: 'highlight', 5: 'highlight' }}
          title="entry-form.tsx"
        />
        <p>
          <Rich>{t.validateScope()}</Rich>
        </p>
        <p>
          <Rich>{t.validateFocus()}</Rich>
        </p>
      </DocSection>

      <DocSection id="submit" title={t.submitTitle}>
        <CodeBlock code={SUBMIT} lang="tsx" title="entry-form.tsx" />
        <p>
          <Rich>{t.submitLast()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.submitEnter()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection id="errors" title={t.errorsTitle}>
        <CodeBlock
          callouts={{ 9: t.errorsSwitchCallout() }}
          code={ERRORS}
          lang="tsx"
          marks={{ 9: 'highlight', 14: 'highlight' }}
          title="entry-form.tsx"
        />
        <p>
          <Rich>{t.errorsFocus()}</Rich>
        </p>
        <p>
          <Rich>{t.errorsSwitch()}</Rich>
        </p>
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
