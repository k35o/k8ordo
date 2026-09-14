import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import { UseBreakpointPreview } from '../_previews/use-breakpoint-previews';

const parameters: PropItem[] = [
  {
    name: 'breakpoint',
    types: ["'sm'", "'md'", "'lg'", "'xl'", "'2xl'"],
    defaultValue: null,
  },
];

const returnValue: PropItem[] = [
  {
    name: 'matches',
    types: ['boolean'],
    defaultValue: null,
  },
];

export default function UseBreakpointPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useBreakpoint" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useBreakpoint</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.breakpoint.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock
          code="import { useBreakpoint } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <Rich>{m.hooks.common.usageTitle()}</Rich>
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.hooks.common.basicUsageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const isMd = useBreakpoint('md');
const isLg = useBreakpoint('lg');

return (
  <div>
    <p>md (48rem): {isMd ? 'Yes' : 'No'}</p>
    <p>lg (64rem): {isLg ? 'Yes' : 'No'}</p>
  </div>
);`}
          >
            <UseBreakpointPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.parametersTitle()}</Rich>
        </Heading>
        <PropsTable items={parameters} />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.returnValueTitle()}</Rich>
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
