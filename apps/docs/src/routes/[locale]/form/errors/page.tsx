import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { signupDefinition } from './_parts/signup-definition';
import { SignupDemo } from './_parts/signup-demo';

const t = m.formErrors;

const FIELD = `const title = form.field('title');

<label htmlFor="title">Title</label>
<input {...title.input} aria-describedby="title-error" id="title" />
{title.error !== undefined && <p id="title-error">{title.error}</p>}`;

const WORDING = `z.object({
  title: z.string().min(1, 'Enter a title').max(120, 'Keep it to 120 characters'),
});`;

const WORDING_LOCALE = `const talkSchema = z.object({
  title: z.string().min(1, { error: () => m.talk.titleMissing() }),
});

export default function NewTalkPage() {
  const talkFields = formFields(talkSchema);
  return <TalkForm action={createTalk} fields={talkFields} />;
}`;

const FORM_ERROR = `<form {...form.props} action={formAction}>
  {form.formError.message !== undefined && (
    <p {...form.formError.props}>{form.formError.message}</p>
  )}
  {/* fields */}
</form>`;

const SERVER = `export async function createTalk(
  _prev: FormState,
  formData: FormData,
) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;

  if (await titleExists(parsed.data.title)) {
    return {
      ...parsed.state,
      errors: { title: 'A talk with this title already exists' },
    };
  }

  await saveTalk(parsed.data);
  redirect(href('/talks'));
}`;

export default function FormErrorsPage() {
  // 文言はロケールに従うので、描画のたびに導く
  const signupFields = formFields(signupDefinition);

  return (
    <DocPage introduction={t.introduction} path="/:locale/form/errors">
      <DocSection
        description={t.fieldDescription}
        id="field"
        title={t.fieldTitle}
      >
        <CodeBlock code={FIELD} lang="tsx" marks={{ 5: 'highlight' }} />
        <p>
          <Rich>{t.fieldWhen()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.wordingDescription}
        id="wording"
        title={t.wordingTitle}
      >
        <CodeBlock code={WORDING} lang="ts" />
        <p>
          <Rich>{t.wordingBoth()}</Rich>
        </p>
        <p>
          <Rich>{t.wordingLocale()}</Rich>
        </p>
        <CodeBlock
          code={WORDING_LOCALE}
          lang="tsx"
          marks={{ 2: 'highlight', 6: 'highlight' }}
          title="page.tsx"
        />
      </DocSection>

      <DocSection
        description={t.focusDescription}
        id="focus"
        title={t.focusTitle}
      >
        <p>
          <Rich>{t.focusOrder()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.focusPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.formErrorDescription}
        id="form-error"
        title={t.formErrorTitle}
      >
        <CodeBlock code={FORM_ERROR} lang="tsx" marks={{ 3: 'highlight' }} />
        <p>
          <Rich>{t.formErrorProps()}</Rich>
        </p>
        <p>
          <Rich>{t.formErrorPlace()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.serverDescription}
        id="server"
        title={t.serverTitle}
      >
        <CodeBlock
          code={SERVER}
          lang="ts"
          marks={{
            5: 'highlight',
            6: 'highlight',
            7: 'highlight',
            8: 'highlight',
            9: 'highlight',
          }}
          title="actions.ts"
        />
        <p>
          <Rich>{t.serverState()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <SignupDemo fields={signupFields} />
      </Playground>
    </DocPage>
  );
}
