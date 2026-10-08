import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { reviewDefinition } from '../../../../demos/form/rules/review-definition';
import { ReviewDemo } from '../../../../demos/form/rules/review-demo';
import * as m from '../../../../messages';

const t = m.formRules;

const DECLARE = `export const signup = defineForm(
  z.object({
    password: z.string().min(8),
    confirm: z.string(),
  }),
  [sameAs('confirm', 'password', 'The passwords do not match')],
);`;

const PASS = `const signupFields = formFields(signup);

const parsed = parseForm(signup, formData);`;

const KINDS = `defineForm(schema, [
  sameAs('confirm', 'password', 'The passwords do not match'),
  minChecked('topics', 2, 'Pick at least two'),
  requiredWhen('reason', 'status', 'rejected', 'Give a reason'),
]);`;

const LOCALE = `export const signup = defineForm(schema, [
  sameAs('confirm', 'password', m.signup.mismatch),
  minChecked('topics', 2, () => m.signup.pickAtLeast(2)),
]);`;

const REFINE = `z.object({
  start: z.iso.date(),
  end: z.iso.date(),
}).refine((value) => value.start <= value.end, {
  message: 'The end comes before the start',
});`;

export default function FormRulesPage() {
  // 文言はロケールに従うので、描画のたびに導く
  const reviewFields = formFields(reviewDefinition);

  return (
    <DocPage introduction={t.introduction} path="/:locale/form/rules">
      <DocSection
        description={t.declareDescription}
        id="declare"
        title={t.declareTitle}
      >
        <CodeBlock code={DECLARE} lang="ts" title="schema.ts" />
        <p>
          <Rich>{t.declarePass()}</Rich>
        </p>
        <CodeBlock code={PASS} lang="ts" />
        <p>
          <Rich>{t.declareTyped()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.kindsDescription}
        id="kinds"
        title={t.kindsTitle}
      >
        <ul>
          <li>
            <Rich>{t.kindSameAs()}</Rich>
          </li>
          <li>
            <Rich>{t.kindMinChecked()}</Rich>
          </li>
          <li>
            <Rich>{t.kindRequiredWhen()}</Rich>
          </li>
        </ul>
        <CodeBlock code={KINDS} lang="ts" title="schema.ts" />
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <ReviewDemo fields={reviewFields} />
      </Playground>

      <DocSection description={t.sameDescription} id="same" title={t.sameTitle}>
        <p>
          <Rich>{t.sameCustomValidity()}</Rich>
        </p>
        <p>
          <Rich>{t.sameOrder()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.localeDescription}
        id="locale"
        title={t.localeTitle}
      >
        <CodeBlock code={LOCALE} lang="ts" title="schema.ts" />
        <p>
          <Rich>{t.localeRender()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.refineDescription}
        id="refine"
        title={t.refineTitle}
      >
        <CodeBlock code={REFINE} lang="ts" title="schema.ts" />
        <p>
          <Rich>{t.refineWhole()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.refinePitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
