import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
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
);

const signupFields = formFields(signup);
const parsed = parseForm(signup, formData);`;

const KINDS = `defineForm(schema, [
  sameAs('confirm', 'password', 'The passwords do not match'),
  minChecked('topics', 2, 'Pick at least two'),
  requiredWhen('reason', 'status', 'rejected', 'Give a reason'),
]);`;

const LOCALE = `import { mismatch, pickAtLeast } from '../messages/signup';

export const signup = defineForm(schema, [
  sameAs('confirm', 'password', mismatch),
  minChecked('topics', 2, () => pickAtLeast(2)),
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
      <DocSection id="declare" title={t.declareTitle}>
        <CodeBlock
          callouts={{ 6: t.declareRuleCallout(), 9: t.declarePassCallout() }}
          code={DECLARE}
          lang="ts"
          marks={{ 6: 'highlight', 9: 'highlight', 10: 'highlight' }}
        />
        <p>
          <Rich>{t.declareForm()}</Rich>
        </p>
        <p>
          <Rich>{t.declareData()}</Rich>
        </p>
        <p>
          <Rich>{t.declareTyped()}</Rich>
        </p>
      </DocSection>

      <DocSection id="kinds" title={t.kindsTitle}>
        <CodeBlock code={KINDS} lang="ts" />
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
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <ReviewDemo fields={reviewFields} />
      </Playground>

      <DocSection id="same" title={t.sameTitle}>
        <p>
          <Rich>{t.sameEvaluator()}</Rich>
        </p>
        <p>
          <Rich>{t.sameCustomValidity()}</Rich>
        </p>
        <p>
          <Rich>{t.sameOrder()}</Rich>
        </p>
      </DocSection>

      <DocSection id="locale" title={t.localeTitle}>
        <CodeBlock
          code={LOCALE}
          lang="ts"
          marks={{ 4: 'highlight', 5: 'highlight' }}
          title="src/lib/signup-form.ts"
        />
        <p>
          <Rich>{t.localeFunction()}</Rich>
        </p>
        <p>
          <Rich>{t.localeZodBefore()}</Rich>
          <LocaleAnchor path="/:locale/form/errors">
            {m.form.navErrors()}
          </LocaleAnchor>
          <Rich>{t.localeZodAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="refine" title={t.refineTitle}>
        <CodeBlock code={REFINE} lang="ts" marks={{ 4: 'highlight' }} />
        <p>
          <Rich>{t.refineServer()}</Rich>
        </p>
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
