import {
  Anchor,
  Button,
  ChevronIcon,
  Heading,
  MailIcon,
  Separator,
} from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { ButtonAsLinkPreview } from '../_previews/button-previews';

export default function ButtonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Button" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Button</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.button.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-buttons-button--primary`}
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
        <CodeBlock code="import { Button } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Button variant="solid" color="primary">
  Click me
</Button>`}
          >
            <Button color="primary" variant="solid">
              Click me
            </Button>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.button.variantsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Button variant="solid">Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="skeleton">Skeleton</Button>`}
          >
            <Button variant="solid">Solid</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="skeleton">Skeleton</Button>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.button.colorsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="base">Base</Button>`}
          >
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="base">Base</Button>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.button.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
          >
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.button.iconsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`import { MailIcon, ChevronIcon } from '@k8ordo/ui';

<Button startIcon={<MailIcon size="sm" />}>
  Send Email
</Button>
<Button endIcon={<ChevronIcon direction="right" size="sm" />}>
  Next
</Button>`}
          >
            <Button startIcon={<MailIcon size="sm" />}>Send Email</Button>
            <Button endIcon={<ChevronIcon direction="right" size="sm" />}>
              Next
            </Button>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.button.fullWidthTitle()}</Rich>
          </Heading>
          <ComponentPreview code="<Button fullWidth>Full Width Button</Button>">
            <div className="w-full">
              <Button fullWidth>Full Width Button</Button>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.button.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview code="<Button disabled>Disabled</Button>">
            <Button disabled>Disabled</Button>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.button.renderItemTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Button
  renderItem={({ children, disabled: _disabled, type: _type, ...props }) => (
    <a href="https://example.com" {...props}>
      {children}
    </a>
  )}
>
  Visit
</Button>`}
          >
            <ButtonAsLinkPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Button')} items={propsOf('Button')} />
      </section>
    </div>
  );
}
