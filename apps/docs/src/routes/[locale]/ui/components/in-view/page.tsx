import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import {
  InViewBasicPreview,
  InViewOncePreview,
} from '../_previews/in-view-previews';

export default function InViewPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="InView" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">InView</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.inView.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-observers-in-view--default`}
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
        <CodeBlock code="import { InView } from '@k8ordo/ui';" lang="ts" />
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
const [isInView, setIsInView] = useState(false);

<div ref={setContainer} className="h-48 overflow-y-auto">
  <InView onChange={setIsInView} root={container}>
    <p>Target</p>
  </InView>
</div>`}
          >
            <InViewBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.inView.onceTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.inView.onceDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<InView once onChange={setHasBeenSeen} root={container}>
  <p>Target</p>
</InView>`}
          >
            <InViewOncePreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.inView.multipleTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.inView.multipleDescription()}</Rich>
          </p>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable items={propsOf('InView')} />
      </section>
    </div>
  );
}
