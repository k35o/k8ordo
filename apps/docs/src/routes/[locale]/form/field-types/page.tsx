import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import {
  DocPage,
  DocSection,
  DocSubsection,
} from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.formFieldTypes;

const OVERVIEW = `z.string()                        → type="text"
z.email() / z.url()               → type="email" / type="url"
z.iso.date() / z.iso.time()       → type="date" / type="time"
z.iso.datetime({ local: true })   → type="datetime-local"
z.coerce.number()                 → type="number"
z.boolean() / z.literal(true)     → type="checkbox"
z.stringbool()                    → type="checkbox" value="true"
z.file()                          → type="file"
z.enum([…])                       → <select>
z.array(z.enum([…]))              → type="checkbox"
z.uuid()                          → type="text"`;

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
      <DocSection id="overview" title={t.overviewTitle}>
        <CodeBlock code={OVERVIEW} lang="ts" />
        <p>
          <Rich>{t.overview()}</Rich>
        </p>
        <p>
          <Rich>{t.overviewNoType()}</Rich>
        </p>
      </DocSection>

      <DocSection id="text" title={t.textTitle}>
        <CodeBlock code={TEXT} lang="ts" marks={{ 2: 'highlight' }} />
        <p>
          <Rich>{t.text()}</Rich>
        </p>
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

      <DocSection id="dates" title={t.datesTitle}>
        <CodeBlock code={DATES} lang="ts" />
        <p>
          <Rich>{t.dates()}</Rich>
        </p>
        <p>
          <Rich>{t.datesCoerce()}</Rich>
        </p>
      </DocSection>

      <DocSection id="numbers" title={t.numbersTitle}>
        <CodeBlock
          code={NUMBERS}
          lang="ts"
          marks={{ 6: 'highlight', 7: 'highlight' }}
        />
        <p>
          <Rich>{t.numbers()}</Rich>
        </p>
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

      <DocSection id="select" title={t.selectTitle}>
        <CodeBlock code={SELECT} lang="tsx" marks={{ 4: 'highlight' }} />
        <p>
          <Rich>{t.select()}</Rich>
        </p>
        <p>
          <Rich>{t.selectOptional()}</Rich>
        </p>
        <DocSubsection id="radio" title={t.radioTitle}>
          <CodeBlock
            code={RADIO}
            lang="tsx"
            marks={{ 6: 'highlight', 7: 'highlight', 8: 'highlight' }}
          />
          <p>
            <Rich>{t.radio()}</Rich>
          </p>
          <p>
            <Rich>{t.radioUiBefore()}</Rich>
            <LocaleAnchor path="/:locale/ui/form">
              {m.nav.uiForm()}
            </LocaleAnchor>
            <Rich>{t.radioUiAfter()}</Rich>
          </p>
          <Pitfall>
            <p>
              <Rich>{t.radioPitfall()}</Rich>
            </p>
          </Pitfall>
        </DocSubsection>
      </DocSection>

      <DocSection id="checkbox" title={t.checkboxTitle}>
        <CodeBlock code={CHECKBOX} lang="ts" marks={{ 3: 'highlight' }} />
        <p>
          <Rich>{t.checkbox()}</Rich>
        </p>
        <p>
          <Rich>{t.checkboxConsent()}</Rich>
        </p>
        <DocSubsection id="stringbool" title={t.stringboolTitle}>
          <CodeBlock code={STRINGBOOL} lang="ts" marks={{ 5: 'highlight' }} />
          <p>
            <Rich>{t.stringbool()}</Rich>
          </p>
          <p>
            <Rich>{t.stringboolUnchecked()}</Rich>
          </p>
        </DocSubsection>
      </DocSection>

      <DocSection id="checkbox-group" title={t.groupTitle}>
        <CodeBlock code={GROUP} lang="tsx" marks={{ 7: 'highlight' }} />
        <p>
          <Rich>{t.group()}</Rich>
        </p>
        <p>
          <Rich>{t.groupMinBefore()}</Rich>
          <LocaleAnchor path="/:locale/form/rules">
            {m.form.navRules()}
          </LocaleAnchor>
          <Rich>{t.groupMinAfter()}</Rich>
        </p>
      </DocSection>

      <DocSection id="files" title={t.filesTitle}>
        <CodeBlock code={FILES} lang="ts" marks={{ 5: 'highlight' }} />
        <p>
          <Rich>{t.files()}</Rich>
        </p>
        <p>
          <Rich>{t.filesServer()}</Rich>
        </p>
        <p>
          <Rich>{t.filesEcho()}</Rich>
        </p>
      </DocSection>

      <DocSection id="password" title={t.passwordTitle}>
        <CodeBlock code={PASSWORD} lang="ts" />
        <p>
          <Rich>{t.password()}</Rich>
        </p>
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
