import { Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import type { PropItem } from '../../components/props-table';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { UseHoverPreview } from './_previews/use-hover-previews';

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

export function UseHoverPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">useHover</Heading>
        <p className="text-fg-mute text-lg">
          <T k="hooks.useHover.description" />
        </p>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="hooks.common.importTitle" />
        </Heading>
        <CodeBlock code="import { useHover } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <Heading level="h2">
          <T k="hooks.common.usageTitle" />
        </Heading>
        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="hooks.common.basicUsageTitle" />
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
          <T k="hooks.common.returnValueTitle" />
        </Heading>
        <PropsTable items={returnValue} />
      </section>
    </div>
  );
}
