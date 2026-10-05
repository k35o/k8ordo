import { CodeBlock } from '@k8ordo/ui/code-block';

import { ApiEntry } from '../../../../components/api-entry';
import { DocPage } from '../../../../components/doc-page';
import {
  filesSection,
  routerSection,
} from '../../../../components/framework-guide/reference';
import * as m from '../../../../messages';

const t = m.staticReference;

const CONFIG = `import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    framework({
      paths: () => ['/products/1', '/products/2'],
      site: 'https://example.com',
    }),
  ],
});`;

export default function StaticReferencePage() {
  return (
    <DocPage introduction={t.introduction} path="/:locale/static/reference">
      <ApiEntry
        caveats={t.frameworkCaveats}
        from="@k8ordo/static"
        id="framework"
        name="framework"
        params={[
          {
            name: 'options.routesDir',
            type: 'string',
            description: t.frameworkRoutesDir,
          },
          {
            name: 'options.paths',
            type: '(patterns: readonly string[]) => readonly string[] | Promise<readonly string[]>',
            description: t.frameworkPaths,
          },
          {
            name: 'options.site',
            type: 'string',
            description: t.frameworkSite,
          },
          {
            name: 'options.csp',
            type: 'Readonly<Record<string, readonly string[]>>',
            description: t.frameworkCsp,
          },
        ]}
        returns={{ type: 'PluginOption[]', description: t.frameworkReturns }}
        signature="framework(options?: StaticOptions): PluginOption[]"
        summary={t.frameworkSummary}
      >
        <CodeBlock code={CONFIG} lang="ts" title="vite.config.ts" />
      </ApiEntry>
      {filesSection('static')}
      {routerSection()}
    </DocPage>
  );
}
