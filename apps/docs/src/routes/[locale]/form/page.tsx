import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import {
  LandingClaim,
  LandingHero,
  NextSteps,
} from '../../../components/landing';
import { Playground } from '../../../components/playground';
import { demoState } from '../../../demos/form/demo-state';
import { FormDemo } from '../../../demos/form/form-demo';
import * as m from '../../../messages';

const HERO_SCHEMA = `export const talkSchema = z.object({
  title: z.string().min(1).max(120),
});`;

const HERO_FORM = `const title = form.field('title');

<input {...title.input} />`;

const HERO_HTML = `<input name="title" type="text" required
  minlength="1" maxlength="120">`;

const CLAIM_SCHEMA = `const fields = formFields(talkSchema);

fields.fields.title.input;
// { name: 'title', type: 'text', required: true,
//   minLength: 1, maxLength: 120 }

fields.fields.title.messages.tooLong;
// 'Too big: expected string to have <=120 characters'`;

const CLAIM_SERVER = `export async function createTalk(
  _prev: FormState,
  formData: FormData,
) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;

  await insertTalk(parsed.data);
  redirect(href('/talks'));
}`;

// Server Component（このファイルにディレクティブは無い）。デモの制約属性は
// ここで導き、JSON として props でクライアントに渡すので、zod はブラウザに
// 届かない。URL 状態のスキーマ（@k8ordo/state）と同じ 1 つを渡す。
const demoFields = formFields(demoState.url);

export default function FormPage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero
        code={
          <>
            <CodeBlock code={HERO_SCHEMA} lang="ts" title="schema.ts" />
            <CodeBlock code={HERO_FORM} lang="tsx" title="talk-form.tsx" />
            <CodeBlock code={HERO_HTML} lang="html" title="HTML" />
          </>
        }
        directory="form"
        install="@k8ordo/form zod"
        name="@k8ordo/form"
        tagline={m.form.tagline}
      />
      <LandingClaim
        body={m.form.claimSchemaBody}
        title={m.form.claimSchemaTitle}
      >
        <CodeBlock code={CLAIM_SCHEMA} lang="ts" title="page.tsx" />
      </LandingClaim>
      <LandingClaim body={m.form.claimNoJsBody} title={m.form.claimNoJsTitle}>
        <Playground
          description={m.form.demoDescription}
          id="demo"
          steps={m.form.demoSteps}
          title={m.form.demoTitle}
        >
          <FormDemo fields={demoFields} />
        </Playground>
      </LandingClaim>
      <LandingClaim
        body={m.form.claimServerBody}
        title={m.form.claimServerTitle}
      >
        <CodeBlock code={CLAIM_SERVER} lang="ts" title="actions.ts" />
      </LandingClaim>
      <NextSteps
        name="@k8ordo/form"
        steps={[
          {
            path: '/:locale/form/get-started',
            label: m.nav.getStarted,
            description: m.form.nextGetStarted,
          },
          {
            path: '/:locale/form/field-types',
            label: m.form.navFieldTypes,
            description: m.form.nextFieldTypes,
          },
          {
            path: '/:locale/form/nested',
            label: m.form.navNested,
            description: m.form.nextNested,
          },
          {
            path: '/:locale/form/errors',
            label: m.form.navErrors,
            description: m.form.nextErrors,
          },
          {
            path: '/:locale/form/reference/server',
            label: m.form.navReferenceServer,
            description: m.form.nextReferenceServer,
          },
          {
            path: '/:locale/form/reference/client',
            label: m.form.navReferenceClient,
            description: m.form.nextReferenceClient,
          },
        ]}
      />
    </div>
  );
}
