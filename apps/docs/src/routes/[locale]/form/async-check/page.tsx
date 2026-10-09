import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { HandleDemo } from '../../../../demos/form/async-check/handle-demo';
import { handleSchema } from '../../../../demos/form/async-check/handle-schema';
import * as m from '../../../../messages';

const t = m.formAsyncCheck;

const ACTION = `'use server';

export async function checkHandle(handle: string) {
  return (await handleExists(handle))
    ? 'This username is already taken'
    : undefined;
}`;

const ATTACH = `const handle = form.field('handle');
const taken = useAsyncCheck(checkHandle);

<input {...handle.input} {...taken.props} />
{handle.error !== undefined && <p>{handle.error}</p>}
<button disabled={taken.isChecking} type="submit">
  Sign up
</button>`;

export default function FormAsyncCheckPage() {
  // 文言はロケールに従うので、描画のたびに導く
  const handleFields = formFields(handleSchema);

  return (
    <DocPage introduction={t.introduction} path="/:locale/form/async-check">
      <DocSection
        description={t.attachDescription}
        id="attach"
        title={t.attachTitle}
      >
        <CodeBlock code={ACTION} lang="ts" title="actions.ts" />
        <CodeBlock
          code={ATTACH}
          lang="tsx"
          marks={{ 2: 'highlight', 4: 'highlight' }}
          title="signup-form.tsx"
        />
        <p>
          <Rich>{t.attachAction()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.pathDescription} id="path" title={t.pathTitle}>
        <p>
          <Rich>{t.pathSubmit()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.timingDescription}
        id="timing"
        title={t.timingTitle}
      >
        <p>
          <Rich>{t.timingRules()}</Rich>
        </p>
        <ul>
          <li>
            <Rich>{t.timingSame()}</Rich>
          </li>
          <li>
            <Rich>{t.timingOrder()}</Rich>
          </li>
          <li>
            <Rich>{t.timingEmpty()}</Rich>
          </li>
          <li>
            <Rich>{t.timingFailure()}</Rich>
          </li>
        </ul>
        <Note>
          <p>
            <Rich>{t.serverNote()}</Rich>
          </p>
        </Note>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <HandleDemo fields={handleFields} />
      </Playground>
    </DocPage>
  );
}
