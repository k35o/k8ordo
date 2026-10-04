import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';
import { EditDemo } from './_parts/edit-demo';
import { talkSchema } from './_parts/talk-schema';

const t = m.formEdit;

const DEFAULTS = `const title = form.field('title');
const isPublic = form.field('public');

<input defaultValue={talk.title} {...title.input} />
<input defaultChecked={talk.public} {...isPublic.input} />`;

const LEAVE = `useEffect(() => {
  if (!form.isDirty) return;
  const confirm = (event: BeforeUnloadEvent) => {
    event.preventDefault();
  };
  addEventListener('beforeunload', confirm);
  return () => {
    removeEventListener('beforeunload', confirm);
  };
}, [form.isDirty]);`;

const RESET = `<button type="reset">Revert</button>`;

export default function FormEditPage() {
  // 文言はロケールに従うので、描画のたびに導く
  const talkFields = formFields(talkSchema);

  return (
    <DocPage introduction={t.introduction} path="/:locale/form/edit">
      <DocSection
        description={t.defaultsDescription}
        id="defaults"
        title={t.defaultsTitle}
      >
        <CodeBlock
          code={DEFAULTS}
          lang="tsx"
          marks={{ 4: 'highlight', 5: 'highlight' }}
          title="edit-talk-form.tsx"
        />
        <p>
          <Rich>{t.defaultsOrder()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.defaultsPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.dirtyDescription}
        id="dirty"
        title={t.dirtyTitle}
      >
        <p>
          <Rich>{t.dirtyCost()}</Rich>
        </p>
        <p>
          <Rich>{t.dirtyLeave()}</Rich>
        </p>
        <CodeBlock code={LEAVE} lang="tsx" title="edit-talk-form.tsx" />
        <Pitfall>
          <p>
            <Rich>{t.dirtyPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <DocSection
        description={t.resetDescription}
        id="reset"
        title={t.resetTitle}
      >
        <CodeBlock code={RESET} lang="tsx" />
        <p>
          <Rich>{t.resetAction()}</Rich>
        </p>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <EditDemo fields={talkFields} />
      </Playground>
    </DocPage>
  );
}
