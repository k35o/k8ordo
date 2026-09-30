import { Heading } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentCatalog } from '../../../../components/component-catalog';
import { PageTitle } from '../../../../components/page-title';
import { Rich } from '../../../../components/rich';
import { componentGroups } from '../../../../data/component-groups';
import * as m from '../../../../messages';

export default function Components() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-8">
      <PageTitle title={m.nav.components} />
      <header className="flex flex-col gap-4">
        <Heading level="h1">{m.nav.components()}</Heading>
        <p className="text-fg-mute max-w-2xl text-lg leading-relaxed">
          <Rich>{m.components.description()}</Rich>
        </p>
      </header>
      <ComponentCatalog
        groups={componentGroups}
        serverPreviews={{
          CodeBlock: (
            <div className="w-full max-w-64">
              <CodeBlock code="const sum = a + b;" lang="ts" />
            </div>
          ),
        }}
      />
    </div>
  );
}
