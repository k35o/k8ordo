import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { ScrollLinkedBasicPreview } from '../_previews/scroll-linked-previews';

export default function ScrollLinkedPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="ScrollLinked" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">ScrollLinked</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.scrollLinked.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-layout-scroll-linked--no-scroll`}
            openInNewTab
          >
            <Rich>{m.components.common.storybookLink()}</Rich>
          </Anchor>
        </div>
      </div>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
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
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.common.basicUsageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`const [container, setContainer] = useState<HTMLElement | null>(null);

<div
  className="relative h-64 overflow-y-scroll rounded-lg border"
  ref={setContainer}
>
  <ScrollLinked container={container} />
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
            <Rich>{m.components.scrollLinked.windowScrollTitle()}</Rich>
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
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable items={propsOf('ScrollLinked')} />
      </section>
    </div>
  );
}
