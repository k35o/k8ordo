import { CodeBlock } from '@k8ordo/ui/code-block';

import * as m from '../../messages';
import { DocSection } from '../doc-page';
import { Rich } from '../rich';
import type { Mode } from './mode';
import { Bullet, Bullets, Paragraph } from './prose';

const CONFIG = (mode: Mode) => `// vite.config.ts
import { framework } from '@k8ordo/${mode}';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/docs/',
  plugins: [framework()],
});`;

const REFUSED = `k8ordo serves its pages under Vite's base, so base has to be a path from the root, like '/docs/' — got './'`;

export function BaseGuide({ mode }: { mode: Mode }) {
  const t = m.frameworkBase;
  return (
    <DocSection description={t.description} title={t.title}>
      <CodeBlock code={CONFIG(mode)} lang="ts" />
      <Paragraph text={t.table} />
      <Bullets>
        <Bullet>
          <Rich>{t.links()}</Rich>
        </Bullet>
        <Bullet>
          <Rich>{t.files()}</Rich>
        </Bullet>
        <Bullet>
          <Rich>{t.redirects()}</Rich>
        </Bullet>
        <Bullet>
          <Rich>{t.outside()}</Rich>
        </Bullet>
      </Bullets>
      <Paragraph text={mode === 'static' ? t.staticMode : t.serverMode} />
      <Paragraph text={t.pathOnly} />
      <CodeBlock code={REFUSED} lang="bash" />
    </DocSection>
  );
}
