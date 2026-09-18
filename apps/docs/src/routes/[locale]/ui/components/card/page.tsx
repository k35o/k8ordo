import { Anchor, Card, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function CardPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Card" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Card</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.card.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-card--primary`}
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
        <CodeBlock code="import { Card } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
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
            <Rich>{m.components.card.widthTitle()}</Rich>
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
            <Rich>{m.components.card.interactiveDescription()}</Rich>
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
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Card')} items={propsOf('Card')} />
      </section>
    </div>
  );
}
