import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.formHowItWorks;

const SHAPE = `server   formFields(schema)       → { fields, arrays, rules, dropped }
           ↓ props (JSON)
client   useForm(fields, state)   → props for <form>, input for each field
           ↓ submit
server   parseForm(schema, data)  → typed data, or errors per field`;

const EMPTY = `z.object({ bio: z.string() });
// bio: { name: 'bio', type: 'text' }

z.object({ title: z.string().min(1) });
// title: { name: 'title', required: true, type: 'text', minLength: 1 }

z.object({ age: z.coerce.number().optional() });
// age: { name: 'age', type: 'number', step: 'any' }`;

export default function FormHowItWorksPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/form/how-it-works">
      <DocSection id="shape" title={t.shapeTitle}>
        <CodeBlock code={SHAPE} lang="text" />
        <p>
          <Rich>{t.shapeServer()}</Rich>
        </p>
        <p>
          <Rich>{t.shapeBundle()}</Rich>
        </p>
        <p>
          <Rich>{t.shapeWhenBefore()}</Rich>
          <LocaleAnchor path="/:locale/form/errors">
            {m.form.navErrors()}
          </LocaleAnchor>
          <Rich>{t.shapeWhenAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="dom" title={t.domTitle}>
        <p>
          <Rich>{t.domIntro()}</Rich>
        </p>
        <ul>
          {[
            t.domMessages,
            t.domServerErrors,
            t.domRows,
            t.domDirty,
            t.domBaseline,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.domWhy()}</Rich>
        </p>
      </DocSection>

      <DocSection id="no-js" title={t.noJsTitle}>
        <p>
          <Rich>{t.noJsAttributes()}</Rich>
        </p>
        <p>
          <Rich>{t.noJsNoValidate()}</Rich>
        </p>
        <p>
          <Rich>{t.noJsEcho()}</Rich>
        </p>
      </DocSection>

      <DocSection id="wording" title={t.wordingTitle}>
        <p>
          <Rich>{t.wordingProbe()}</Rich>
        </p>
        <p>
          <Rich>{t.wordingSame()}</Rich>
        </p>
      </DocSection>

      <DocSection id="required" title={t.requiredTitle}>
        <CodeBlock
          code={EMPTY}
          lang="ts"
          marks={{ 2: 'highlight', 8: 'highlight' }}
        />
        <p>
          <Rich>{t.requiredRule()}</Rich>
        </p>
        <p>
          <Rich>{t.requiredExample()}</Rich>
        </p>
        <p>
          <Rich>{t.requiredEmptyBefore()}</Rich>
          <LocaleAnchor path="/:locale/form/reference/schema">
            {m.form.navReferenceSchema()}
          </LocaleAnchor>
          <Rich>{t.requiredEmptyAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="dropped" title={t.droppedTitle}>
        <p>
          <Rich>{t.droppedListBefore()}</Rich>
          <LocaleAnchor path="/:locale/form/reference/schema">
            {m.form.navReferenceSchema()}
          </LocaleAnchor>
          <Rich>{t.droppedListAfter()}</Rich>
        </p>
        <p>
          <Rich>{t.droppedWarn()}</Rich>
        </p>
        <p>
          <Rich>{t.droppedRulesBefore()}</Rich>
          <LocaleAnchor path="/:locale/form/rules">
            {m.form.navRules()}
          </LocaleAnchor>
          <Rich>{t.droppedRulesAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="refuse" title={t.refuseTitle}>
        <p>
          <Rich>{t.refuseStrings()}</Rich>
        </p>
        <p>
          <Rich>{t.refuseWhen()}</Rich>
        </p>
        <p>
          <Rich>{t.refuseSchemaBefore()}</Rich>
          <LocaleAnchor path="/:locale/form/reference/schema">
            {m.form.navReferenceSchema()}
          </LocaleAnchor>
          <Rich>{t.refuseSchemaAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="guarantees" title={t.guaranteesTitle}>
        <ul>
          {[
            t.guaranteeNoZod,
            t.guaranteeTyping,
            t.guaranteeNoJs,
            t.guaranteeEcho,
            t.guaranteeWording,
            t.guaranteeRequired,
            t.guaranteeDropped,
            t.guaranteeRefuse,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="non-guarantees" title={t.nonGuaranteesTitle}>
        <ul>
          {[
            t.nonGuaranteeDropped,
            t.nonGuaranteeBeforeJs,
            t.nonGuaranteeRefine,
            t.nonGuaranteeNumberField,
            t.nonGuaranteeFile,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>
    </DocPage>
  );
}
