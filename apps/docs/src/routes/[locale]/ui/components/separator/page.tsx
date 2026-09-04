import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

export default function SeparatorPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Separator</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.separator.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-separator--docs`}
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
        <CodeBlock code="import { Separator } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview code='<Separator color="mute" />'>
            <div className="block-32 inline-full">
              <Separator color="mute" />
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.separator.orientationsTitle" />
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
            <T k="components.separator.colorsTitle" />
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
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable
          inherits={inheritsOf('Separator')}
          items={propsOf('Separator')}
        />
      </section>
    </div>
  );
}
