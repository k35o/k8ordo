import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { STORYBOOK_URL } from '../../constants';
import { propsOf } from '../../data/component-props';
import { ScrollLinkedBasicPreview } from './_previews/scroll-linked-previews';

export function ScrollLinkedPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">ScrollLinked</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.scrollLinked.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-scroll-linked--docs`}
            openInNewTab
          >
            <T k="components.common.storybookLink" />
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.importTitle" />
        </Heading>
        <CodeBlock
          code="import { ScrollLinked } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.common.basicUsageTitle" />
          </Heading>
          <ComponentPreview
            code={`const containerRef = useRef<HTMLDivElement>(null);

<div
  className="relative h-64 overflow-y-scroll rounded-lg border"
  ref={containerRef}
>
  <ScrollLinked container={containerRef} />
  <div className="h-[800px] p-4">
    <p>Scroll this container to see the progress bar.</p>
  </div>
</div>`}
          >
            <ScrollLinkedBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.scrollLinked.windowScrollTitle" />
          </Heading>
          <CodeBlock
            code={`// Without a container prop, ScrollLinked tracks the window scroll position.
<ScrollLinked />`}
            lang="tsx"
          />
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable items={propsOf('ScrollLinked')} />
      </section>
    </div>
  );
}
