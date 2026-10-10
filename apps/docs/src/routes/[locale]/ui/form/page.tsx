import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.uiForm;

const BASIC = `const title = form.field('title');

<FormControl
  errorText={title.error}
  invalid={title.invalid}
  label="Title"
  required={title.required}
  renderInput={(props) => <TextField {...props} {...title.input} />}
/>`;

const GROUP = `const tags = form.field('tags');
const checked = state.values?.tags;

<FormControl
  errorText={tags.error}
  invalid={tags.invalid}
  label="Tags"
  labelAs="legend"
  renderInput={(props) => (
    <CheckboxCard
      {...props}
      {...tags.input}
      defaultValue={Array.isArray(checked) ? checked : []}
      options={options}
    />
  )}
/>`;

const FORM_ERROR = `{form.formError.message !== undefined && (
  <Alert
    {...form.formError.props}
    message={form.formError.message}
    tone="error"
  />
)}`;

export default function UiFormPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/ui/form">
      <DocSection id="basic" title={t.basicTitle}>
        <CodeBlock
          code={BASIC}
          lang="tsx"
          marks={{ 8: 'highlight' }}
          title="talk-form.tsx"
        />
        <p>
          <Rich>{t.basicForm()}</Rich>
          <LocaleAnchor path="/:locale/form/get-started">
            {m.nav.getStarted()}
          </LocaleAnchor>
          <Rich>{t.see()}</Rich>
        </p>
        <p>
          <Rich>{t.basicSpread()}</Rich>
        </p>
        <p>
          <Rich>{t.basicDom()}</Rich>
        </p>
      </DocSection>

      <DocSection id="map" title={t.mapTitle}>
        <p>
          <Rich>{t.mapLead()}</Rich>
        </p>
        <ul>
          {[
            t.mapText,
            t.mapPassword,
            t.mapNumber,
            t.mapEnum,
            t.mapBoolean,
            t.mapGroup,
            t.mapFile,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="choice" title={t.choiceTitle}>
        <CodeBlock
          code={GROUP}
          lang="tsx"
          marks={{ 13: 'highlight' }}
          title="tags-field.tsx"
        />
        <p>
          <Rich>{t.choiceGroup()}</Rich>
        </p>
        <p>
          <Rich>{t.choiceRadio()}</Rich>
        </p>
        <p>
          <Rich>{t.choiceSelect()}</Rich>
        </p>
      </DocSection>

      <DocSection id="exceptions" title={t.exceptionsTitle}>
        <Pitfall>
          <p>
            <Rich>{t.exceptionStringbool()}</Rich>
          </p>
        </Pitfall>
        <p>
          <Rich>{t.exceptionNumber()}</Rich>
        </p>
        <p>
          <Rich>{t.exceptionTextarea()}</Rich>
        </p>
        <p>
          <Rich>{t.exceptionFile()}</Rich>
        </p>
      </DocSection>

      <DocSection id="form-error" title={t.formErrorTitle}>
        <CodeBlock code={FORM_ERROR} lang="tsx" title="talk-form.tsx" />
        <p>
          <Rich>{t.formErrorAlert()}</Rich>
        </p>
        <p>
          <Rich>{t.formErrorTwice()}</Rich>
        </p>
      </DocSection>
    </DocPage>
  );
}
