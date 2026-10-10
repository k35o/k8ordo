import { formFields } from '@k8ordo/form/server';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note, Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Playground } from '../../../../components/playground';
import { Rich } from '../../../../components/rich';
import { RatingDemo } from '../../../../demos/form/custom-inputs/rating-demo';
import { ratingSchema } from '../../../../demos/form/custom-inputs/rating-schema';
import * as m from '../../../../messages';

const t = m.formCustomInputs;

const USE = `const [body, setBody] = useState(post.body);

<Editor onChange={setBody} value={body} />
<HiddenValue name="body" value={body} />`;

const RESET = `<form
  {...form.props}
  onReset={() => {
    form.props.onReset();
    setBody(post.body);
  }}
>`;

export default function FormCustomInputsPage() {
  // 文言はロケールに従うので、描画のたびに導く
  const ratingFields = formFields(ratingSchema);

  return (
    <DocPage introduction={t.introduction} path="/:locale/form/custom-inputs">
      <DocSection id="use" title={t.placeTitle}>
        <CodeBlock
          code={USE}
          lang="tsx"
          marks={{ 4: 'highlight' }}
          title="post-form.tsx"
        />
        <p>
          <Rich>{t.placeState()}</Rich>
        </p>
        <p>
          <Rich>{t.placeSubmit()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.placeUiBefore()}</Rich>
            <LocaleAnchor path="/:locale/ui/form">
              {m.nav.uiForm()}
            </LocaleAnchor>
            <Rich>{t.placeUiAfter()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection id="why" title={t.whyTitle}>
        <p>
          <Rich>{t.whyNoEvent()}</Rich>
        </p>
        <p>
          <Rich>{t.whyEvent()}</Rich>
        </p>
      </DocSection>

      <DocSection id="caution" title={t.cautionTitle}>
        <CodeBlock
          code={RESET}
          lang="tsx"
          marks={{ 4: 'highlight', 5: 'highlight' }}
          title="post-form.tsx"
        />
        <p>
          <Rich>{t.cautionReset()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.cautionValidation()}</Rich>
          </p>
        </Pitfall>
      </DocSection>

      <Playground
        description={t.demoDescription}
        id="demo"
        steps={t.demoSteps}
        title={t.demoTitle}
      >
        <RatingDemo fields={ratingFields} />
      </Playground>
    </DocPage>
  );
}
