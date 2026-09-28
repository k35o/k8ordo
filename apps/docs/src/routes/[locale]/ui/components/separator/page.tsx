import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function SeparatorPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Separator" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Separator</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.separator.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-layout-separator--block`}
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
        <CodeBlock code="import { Separator } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Separator color="mute" />'>
            <div className="block-32 inline-full">
              <Separator color="mute" />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.separator.orientationsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Separator orientation="horizontal" />
<Separator orientation="vertical" />`}
          >
            <div className="flex flex-col gap-6 block-32 inline-full">
              <div className="flex-1 inline-full">
                <Separator orientation="horizontal" />
              </div>
              <div className="flex items-center block-16 inline-full">
                <Separator orientation="vertical" />
              </div>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.separator.colorsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Separator color="base" />
<Separator color="mute" />
<Separator color="subtle" />`}
          >
            <div className="flex flex-col gap-6 block-32 inline-full">
              <div className="flex-1 inline-full">
                <Separator color="base" />
              </div>
              <div className="flex-1 inline-full">
                <Separator color="mute" />
              </div>
              <div className="flex-1 inline-full">
                <Separator color="subtle" />
              </div>
            </div>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Separator')}
          items={propsOf('Separator')}
        />
      </section>
    </div>
  );
}
