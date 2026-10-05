import type { Message } from '@k8ordo/i18n';
import { Code } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.formFieldTypes;

const OVERVIEW: ReadonlyArray<{
  schema: string | Message;
  input: string | Message;
}> = [
  { schema: 'z.string()', input: 'type="text"' },
  { schema: 'z.email() / z.url()', input: 'type="email" / type="url"' },
  { schema: 'z.iso.date() / z.iso.time()', input: 'type="date" / type="time"' },
  {
    schema: 'z.iso.datetime({ local: true })',
    input: 'type="datetime-local"',
  },
  { schema: 'z.coerce.number()', input: 'type="number"' },
  { schema: 'z.boolean() / z.literal(true)', input: 'type="checkbox"' },
  { schema: 'z.stringbool()', input: 'type="checkbox" value="true"' },
  { schema: 'z.file()', input: 'type="file"' },
  { schema: 'z.enum([…])', input: t.rowSelect },
  { schema: 'z.array(z.enum([…]))', input: t.rowCheckboxGroup },
  { schema: t.rowOther, input: 'type="text"' },
];

const TEXT = `z.object({
  handle: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
});

// handle.input
// { name: 'handle', type: 'text', required: true,
//   minLength: 3, maxLength: 20, pattern: '^[a-z0-9_]+$' }`;

const TEXT_BLANK = `bio: z.string().min(1).optional(),
bio: z.string().max(200),`;

const DATES = `z.object({
  day: z.iso.date(),
  start: z.iso.time(),
  doors: z.iso.datetime({ local: true }),
});`;

const NUMBERS = `z.object({
  seats: z.coerce.number().int().min(1).max(500),
  price: z.coerce.number().multipleOf(0.01).optional(),
});

// seats.input → { type: 'number', required: true, step: 1, min: 1, max: 500 }
// price.input → { type: 'number', step: 0.01 }`;

const SELECT = `const format = form.field('format');

<select {...format.input}>
  <option value="">Choose a format</option>
  <option value="talk">Talk</option>
  <option value="workshop">Workshop</option>
</select>`;

const RADIO = `const format = form.field('format');

{['talk', 'workshop'].map((option) => (
  <label key={option}>
    <input
      defaultChecked={state.values?.format === option}
      name={format.input.name}
      required={format.input.required}
      type="radio"
      value={option}
    />
    {option}
  </label>
))}`;

const CHECKBOX = `z.object({
  newsletter: z.boolean(),
  terms: z.literal(true, 'Agree to the terms to continue'),
});`;

const STRINGBOOL = `z.object({
  inStock: z.stringbool().default(false),
});

// inStock.input → { name: 'inStock', type: 'checkbox', value: 'true' }`;

const GROUP = `const tags = form.field('tags');
const checked = state.values?.tags;

{['react', 'css', 'a11y'].map((option) => (
  <label key={option}>
    <input
      defaultChecked={Array.isArray(checked) && checked.includes(option)}
      name={tags.input.name}
      type="checkbox"
      value={option}
    />
    {option}
  </label>
))}`;

const FILES = `z.object({
  slides: z.file().mime(['application/pdf']).max(10_000_000),
});

// slides.input → { name: 'slides', type: 'file', required: true,
//                  accept: 'application/pdf' }`;

const PASSWORD = `password: z.string().min(8).meta({ input: 'password' }),`;

const PASSWORD_MINI = `password: z.string().check(z.minLength(8), z.meta({ input: 'password' })),`;

export default function FormFieldTypesPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/form/field-types">
      <DocSection
        description={t.overviewDescription}
        id="overview"
        title={t.overviewTitle}
      >
        <table>
          <thead>
            <tr>
              <th>{t.columnSchema()}</th>
              <th>{t.columnInput()}</th>
            </tr>
          </thead>
          <tbody>
            {OVERVIEW.map((row) => (
              <tr key={typeof row.schema === 'string' ? row.schema : 'other'}>
                <td>
                  {typeof row.schema === 'string' ? (
                    <Code>{row.schema}</Code>
                  ) : (
                    <Rich>{row.schema()}</Rich>
                  )}
                </td>
                <td>
                  {typeof row.input === 'string' ? (
                    <Code>{row.input}</Code>
                  ) : (
                    <Rich>{row.input()}</Rich>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>

      <DocSection description={t.textDescription} id="text" title={t.textTitle}>
        <CodeBlock code={TEXT} lang="ts" />
        <p>
          <Rich>{t.textFormats()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.textPitfall()}</Rich>
          </p>
          <p>
            <Rich>{t.textPitfallFix()}</Rich>
          </p>
          <CodeBlock
            code={TEXT_BLANK}
            lang="ts"
            marks={{ 1: 'remove', 2: 'add' }}
          />
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.datesDescription}
        id="dates"
        title={t.datesTitle}
      >
        <CodeBlock code={DATES} lang="ts" />
        <p>
          <Rich>{t.datesCoerce()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.numbersDescription}
        id="numbers"
        title={t.numbersTitle}
      >
        <CodeBlock code={NUMBERS} lang="ts" />
        <p>
          <Rich>{t.numbersStep()}</Rich>
        </p>
        <p>
          <Rich>{t.numbersEmpty()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.numbersPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.selectDescription}
        id="select"
        title={t.selectTitle}
      >
        <CodeBlock code={SELECT} lang="tsx" marks={{ 4: 'highlight' }} />
        <p>
          <Rich>{t.selectOptional()}</Rich>
        </p>
        <DocSubsection id="radio" title={t.radioTitle}>
          <p>
            <Rich>{t.radioDescription()}</Rich>
          </p>
          <CodeBlock
            code={RADIO}
            lang="tsx"
            marks={{ 6: 'highlight', 7: 'highlight', 8: 'highlight' }}
          />
          <Pitfall>
            <p>
              <Rich>{t.radioPitfall()}</Rich>
            </p>
          </Pitfall>
          <Note>
            <p>
              <Rich>{t.radioUi()}</Rich>
            </p>
          </Note>
        </DocSubsection>
      </DocSection>

      <DocSection
        description={t.checkboxDescription}
        id="checkbox"
        title={t.checkboxTitle}
      >
        <p>
          <Rich>{t.checkboxConsent()}</Rich>
        </p>
        <CodeBlock code={CHECKBOX} lang="ts" />
        <DocSubsection id="stringbool" title={t.stringboolTitle}>
          <p>
            <Rich>{t.stringboolDescription()}</Rich>
          </p>
          <CodeBlock code={STRINGBOOL} lang="ts" />
          <p>
            <Rich>{t.stringboolUnchecked()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection
        description={t.groupDescription}
        id="checkbox-group"
        title={t.groupTitle}
      >
        <CodeBlock code={GROUP} lang="tsx" marks={{ 7: 'highlight' }} />
        <p>
          <Rich>{t.groupMin()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.filesDescription}
        id="files"
        title={t.filesTitle}
      >
        <CodeBlock code={FILES} lang="ts" />
        <p>
          <Rich>{t.filesServer()}</Rich>
        </p>
        <p>
          <Rich>{t.filesEcho()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.passwordDescription}
        id="password"
        title={t.passwordTitle}
      >
        <CodeBlock code={PASSWORD} lang="ts" />
        <p>
          <Rich>{t.passwordEcho()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.passwordMini()}</Rich>
          </p>
          <CodeBlock code={PASSWORD_MINI} lang="ts" />
        </Note>
      </DocSection>
    </DocPage>
  );
}
