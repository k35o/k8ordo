import { CodeBlock } from '@k8ordo/ui/code-block';

import { Pitfall } from '../../../../components/callout';
import { DocPage, DocSection } from '../../../../components/doc-page';
import { LocaleAnchor } from '../../../../components/locale-anchor';
import { Rich } from '../../../../components/rich';
import * as m from '../../../../messages';

const t = m.stateCookie;

const DEFINE = `import { defineCookieState } from '@k8ordo/state';
import * as z from 'zod';

export const density = defineCookieState(
  'density',
  z.object({
    density: z
      .enum(['comfortable', 'compact'])
      .default('comfortable'),
  }),
);`;

export default function StateCookiePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/state/cookie">
      <DocSection id="define" title={t.defineTitle}>
        <CodeBlock code={DEFINE} lang="ts" title="src/state.ts" />
        <p>
          <Rich>{t.defineSame()}</Rich>
          <LocaleAnchor path="/:locale/state/storage">
            {m.state.navStorage()}
          </LocaleAnchor>
          <Rich>{t.defineSameAfter()}</Rich>
        </p>
        <p>
          <Rich>{t.defineName()}</Rich>
        </p>
        <p>
          <Rich>{t.defineToken()}</Rich>
        </p>
      </DocSection>

      <DocSection id="attributes" title={t.attributesTitle}>
        <p>
          <Rich>{t.attributesApi()}</Rich>
        </p>
        <ul>
          {[
            t.attributesPath,
            t.attributesSameSite,
            t.attributesMaxAge,
            t.attributesSecure,
          ].map((item) => (
            <li key={item()}>
              <Rich>{item()}</Rich>
            </li>
          ))}
        </ul>
        <p>
          <Rich>{t.attributesRead()}</Rich>
        </p>
        <p>
          <Rich>{t.attributesSize()}</Rich>
        </p>
      </DocSection>

      <DocSection id="secret" title={t.secretTitle}>
        <p>
          <Rich>{t.secretScript()}</Rich>
        </p>
        <Pitfall>
          <p>
            <Rich>{t.secretPitfall()}</Rich>
          </p>
        </Pitfall>
      </DocSection>
    </DocPage>
  );
}
