import { CodeBlock } from '@k8ordo/ui/code-block';

import { Note } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.routerLinks;

const HREF = `href('/products'); // '/products'
href('/products/:id', { id: '42' }); // '/products/42'
href('/products/:id', { id: 42 }); // '/products/42'
href('/products/:id', { id: 'a/b' }); // '/products/a%2Fb'`;

const ANCHOR = `import { href } from '@k8ordo/router';

type Props = { id: string; name: string };

export function ProductCard({ id, name }: Props) {
  return <a href={href('/products/:id', { id })}>{name}</a>;
}`;

const NAVIGATE = `navigateTo('/products/:id', { id: '42' });
navigateTo('/products/:id', { id: '42' }, { history: 'replace' });
navigateTo('/products');
navigateTo('/products', { history: 'replace' });`;

const FINISHED = `import { navigateTo } from '@k8ordo/router';
import { useTransition } from 'react';

const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';

export function OpenButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const open = () => {
    startTransition(async () => {
      try {
        await navigateTo('/products/:id', { id }).finished;
      } catch (error) {
        if (!isAbort(error)) throw error;
      }
    });
  };

  return (
    <button disabled={isPending} onClick={open} type="button">
      {isPending ? 'Opening…' : 'Open'}
    </button>
  );
}`;

const DOWNLOAD = `<a download href="/report.pdf">
  Download the report
</a>`;

export default function RouterLinksPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/router/links">
      <DocSection description={t.hrefDescription} id="href" title={t.hrefTitle}>
        <CodeBlock code={HREF} lang="ts" />
        <p>
          <Rich>{t.hrefValues()}</Rich>
        </p>
        <p>
          <Rich>{t.hrefReturn()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.hrefErrors()}</Rich>
          </p>
        </Note>
      </DocSection>

      <DocSection
        description={t.anchorDescription}
        id="anchor"
        title={t.anchorTitle}
      >
        <CodeBlock
          code={ANCHOR}
          lang="tsx"
          marks={{ 6: 'highlight' }}
          title="src/product-card.tsx"
        />
        <p>
          <Rich>{t.anchorWhy()}</Rich>
        </p>
        <p>
          <Rich>{t.anchorOthers()}</Rich>
        </p>
        <p>
          <Rich>{t.anchorCurrent()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.navigateDescription}
        id="navigate"
        title={t.navigateTitle}
      >
        <CodeBlock code={NAVIGATE} lang="ts" />
        <p>
          <Rich>{t.navigateReplace()}</Rich>
        </p>
        <p>
          <Rich>{t.navigatePush()}</Rich>
        </p>
        <p>
          <Rich>{t.navigateSplit()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.finishedDescription}
        id="finished"
        title={t.finishedTitle}
      >
        <CodeBlock
          code={FINISHED}
          lang="tsx"
          marks={{ 12: 'highlight' }}
          title="src/open-button.tsx"
        />
        <p>
          <Rich>{t.finishedAction()}</Rich>
        </p>
        <p>
          <Rich>{t.finishedAbort()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.downloadDescription}
        id="download"
        title={t.downloadTitle}
      >
        <CodeBlock code={DOWNLOAD} lang="tsx" />
        <p>
          <Rich>{t.downloadFix()}</Rich>
        </p>
        <Note>
          <p>
            <Rich>{t.downloadFramework()}</Rich>
          </p>
        </Note>
      </DocSection>
    </DocPage>
  );
}
