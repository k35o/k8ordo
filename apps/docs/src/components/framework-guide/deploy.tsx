import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { Rich } from '../rich';
import { packageOf } from './mode';
import type { Mode } from './mode';

const base = (mode: Mode): string => `import { framework } from '${packageOf(mode)}';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/docs/',
  plugins: [framework()],
});`;

/**
 * A tab opened before a deploy, the same under both modes but for what a
 * Server Action adds. A function rather than a component, so `DocPage` sees
 * the section and lists it in the contents.
 */
export const tabsSection = (mode: Mode) => {
  const t = m.frameworkDeploy;
  return (
    <DocSection description={t.tabsDescription} id="tabs" title={t.tabsTitle}>
      <p>
        <Rich>{t.tabsCheck()}</Rich>
      </p>
      <p>
        <Rich>{t.tabsSame()}</Rich>
      </p>
      {mode === 'server' && (
        <p>
          <Rich>{m.serverDeploy.tabsMode()}</Rich>
        </p>
      )}
    </DocSection>
  );
};

/** Serving under Vite's `base`; where the files sit is the mode's own. */
export const baseSection = (mode: Mode) => {
  const t = m.frameworkDeploy;
  return (
    <DocSection description={t.baseDescription} id="base" title={t.baseTitle}>
      <CodeBlock
        code={base(mode)}
        lang="ts"
        marks={{ 5: 'highlight' }}
        title="vite.config.ts"
      />
      <p>
        <Rich>{t.baseRoot()}</Rich>
      </p>
      <ul>
        {t.baseList.map((item) => (
          <li key={item()}>
            <Rich>{item()}</Rich>
          </li>
        ))}
      </ul>
      {mode === 'static' ? (
        <p>
          <Rich>{m.staticDeploy.baseMode()}</Rich>
        </p>
      ) : (
        <>
          <p>
            <Rich>{m.serverDeploy.baseMode()}</Rich>
          </p>
          <p>
            <Rich>{m.serverDeploy.baseRedirect()}</Rich>
          </p>
        </>
      )}
      <p>
        <Rich>{t.baseRefused()}</Rich>
      </p>
    </DocSection>
  );
};
