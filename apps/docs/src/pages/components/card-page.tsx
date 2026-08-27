import { Anchor, Card, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { STORYBOOK_URL } from '../../constants';
import { inheritsOf, propsOf } from '../../data/component-props';

export function CardPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Card</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.card.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-card--docs`}
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
        <CodeBlock code="import { Card } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview
            code={`<Card>
  <div className="p-6">Card content</div>
</Card>`}
          >
            <Card>
              <div className="p-6">Card content</div>
            </Card>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.card.widthTitle" />
          </Heading>
          <ComponentPreview
            code={`<Card width="full">
  <div className="p-6">Full width</div>
</Card>
<Card width="fit">
  <div className="p-6">Fit content</div>
</Card>`}
          >
            <div className="w-full">
              <Card width="full">
                <div className="p-6">Full width</div>
              </Card>
            </div>
            <Card width="fit">
              <div className="p-6">Fit content</div>
            </Card>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">Interactive</Heading>
          <p className="text-fg-mute">
            <T k="components.card.interactiveDescription" />
          </p>
          <ComponentPreview
            code={`<Card interactive>
  <a className="block p-6" href="https://example.com">
    Hover to scale up
  </a>
</Card>`}
          >
            <Card interactive>
              <a className="block p-6" href="https://example.com">
                Hover to scale up
              </a>
            </Card>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">Appearance</Heading>
          <ComponentPreview
            code={`<Card variant="shadow">
  <div className="p-6">Shadow</div>
</Card>
<Card variant="outline">
  <div className="p-6">Bordered</div>
</Card>`}
          >
            <Card variant="shadow">
              <div className="p-6">Shadow</div>
            </Card>
            <Card variant="outline">
              <div className="p-6">Bordered</div>
            </Card>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable inherits={inheritsOf('Card')} items={propsOf('Card')} />
      </section>
    </div>
  );
}
