import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { signedSection } from '../../../../components/framework-guide/csp';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.staticCsp;

const CONFIG = `import { colorSchemeScriptHash } from '@k8ordo/color-scheme';
import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      csp: {
        'script-src': ["'self'", await colorSchemeScriptHash()],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
      },
    }),
  ],
});`;

export default function StaticCspPage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/static/csp">
      {signedSection()}

      <DocSection
        description={t.optionDescription}
        id="option"
        title={t.optionTitle}
      >
        <CodeBlock
          code={CONFIG}
          lang="ts"
          marks={{
            8: 'highlight',
            9: 'highlight',
            10: 'highlight',
            11: 'highlight',
            12: 'highlight',
          }}
          title="vite.config.ts"
        />
        <p>
          <Rich>{t.optionShape()}</Rich>
        </p>
        <p>
          <Rich>{t.optionWhere()}</Rich>
        </p>
        <p>
          <Rich>{t.optionNone()}</Rich>
        </p>
      </DocSection>

      <DocSection description={t.ownDescription} id="own" title={t.ownTitle}>
        <p>
          <Rich>{t.ownPreference()}</Rich>
        </p>
        <p>
          <Rich>{t.ownRefused()}</Rich>
        </p>
      </DocSection>

      <DocSection
        description={t.refusedDescription}
        id="refused"
        title={t.refusedTitle}
      >
        <p>
          <Rich>{t.refusedMeta()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.refusedWhen()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
