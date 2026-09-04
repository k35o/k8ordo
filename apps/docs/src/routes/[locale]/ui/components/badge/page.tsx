import { Anchor, Badge, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

export default function BadgePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Badge</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.badge.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-badge--docs`}
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
        <CodeBlock code="import { Badge } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview code='<Badge label="New" />'>
            <Badge label="New" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.badge.tonesTitle" />
          </Heading>
          <ComponentPreview
            code={`<Badge label="Neutral" />
<Badge label="Info" tone="info" />
<Badge label="Success" tone="success" />
<Badge label="Warning" tone="warning" />
<Badge label="Error" tone="error" />`}
          >
            <Badge label="Neutral" />
            <Badge label="Info" tone="info" />
            <Badge label="Success" tone="success" />
            <Badge label="Warning" tone="warning" />
            <Badge label="Error" tone="error" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.badge.variantsTitle" />
          </Heading>
          <ComponentPreview
            code={`<Badge label="Solid" tone="success" />
<Badge label="Outline" tone="success" variant="outline" />`}
          >
            <Badge label="Solid" tone="success" />
            <Badge label="Outline" tone="success" variant="outline" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.badge.interactiveTitle" />
          </Heading>
          <ComponentPreview
            code={`<Badge interactive label="Neutral Solid" />
<Badge interactive label="Neutral Outline" variant="outline" />
<Badge interactive label="Info Solid" tone="info" />
<Badge interactive label="Info Outline" tone="info" variant="outline" />
<Badge interactive label="Success Solid" tone="success" />
<Badge interactive label="Success Outline" tone="success" variant="outline" />
<Badge interactive label="Warning Solid" tone="warning" />
<Badge interactive label="Warning Outline" tone="warning" variant="outline" />
<Badge interactive label="Error Solid" tone="error" />
<Badge interactive label="Error Outline" tone="error" variant="outline" />`}
          >
            <Badge interactive label="Neutral Solid" />
            <Badge interactive label="Neutral Outline" variant="outline" />
            <Badge interactive label="Info Solid" tone="info" />
            <Badge
              interactive
              label="Info Outline"
              tone="info"
              variant="outline"
            />
            <Badge interactive label="Success Solid" tone="success" />
            <Badge
              interactive
              label="Success Outline"
              tone="success"
              variant="outline"
            />
            <Badge interactive label="Warning Solid" tone="warning" />
            <Badge
              interactive
              label="Warning Outline"
              tone="warning"
              variant="outline"
            />
            <Badge interactive label="Error Solid" tone="error" />
            <Badge
              interactive
              label="Error Outline"
              tone="error"
              variant="outline"
            />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable inherits={inheritsOf('Badge')} items={propsOf('Badge')} />
      </section>
    </div>
  );
}
