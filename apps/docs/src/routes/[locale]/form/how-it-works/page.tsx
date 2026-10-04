import { CodeBlock } from '@k8ordo/ui/code-block';

import { DocPage, DocSection } from '../../../../components/doc-page';
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
      <DocSection
        description={t.shapeDescription}
        id="shape"
        title={t.shapeTitle}
      >
        <CodeBlock code={SHAPE} lang="text" />
        <p>
          <Rich>{t.shapeBundle()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.domDescription} id="dom" title={t.domTitle}>
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

      <DocSection
        description={t.noJsDescription}
        id="no-js"
        title={t.noJsTitle}
      >
        <p>
          <Rich>{t.noJsNoValidate()}</Rich>
        </p>
        <p>
          <Rich>{t.noJsEcho()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.wordingDescription}
        id="wording"
        title={t.wordingTitle}
      />

      <DocSection
        description={t.requiredDescription}
        id="required"
        title={t.requiredTitle}
      >
        <p>
          <Rich>{t.requiredEmpty()}</Rich>
        </p>
        <CodeBlock code={EMPTY} lang="ts" />
      </DocSection>

      <DocSection
        description={t.droppedDescription}
        id="dropped"
        title={t.droppedTitle}
      >
        <p>
          <Rich>{t.droppedWarn()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.refuseDescription}
        id="refuse"
        title={t.refuseTitle}
      >
        <p>
          <Rich>{t.refuseWhy()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
