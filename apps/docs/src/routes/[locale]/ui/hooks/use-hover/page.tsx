import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import type { PropItem } from '../../../../../components/props-table';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';
import { UseHoverPreview } from '../_previews/use-hover-previews';

const returnValue: PropItem[] = [
  {
    name: 'isHovered',
    types: ['boolean'],
    defaultValue: null,
  },
  {
    name: 'hoverProps',
    types: ['{ onPointerEnter: () => void; onPointerLeave: () => void }'],
    defaultValue: null,
  },
];

export default function UseHoverPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="useHover" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">useHover</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.hooks.hover.description()}</Rich>
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.hooks.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { useHover } from '@k8ordo/ui';" lang="ts" />
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
            code={`const { isHovered, hoverProps } = useHover();

return (
  <div>
    <div {...hoverProps}>Hover me</div>
    <p>State: {isHovered ? 'Hovered' : 'Not hovered'}</p>
  </div>
);`}
          >
            <UseHoverPreview />
          </ComponentPreview>
        </div>
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
