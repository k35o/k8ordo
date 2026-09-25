import { Anchor, CloseIcon, Heading, IconButton, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { IconButtonAsLinkPreview } from '../_previews/icon-button-previews';

export default function IconButtonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="IconButton" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">IconButton</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.iconButton.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-buttons-icon-button--large`}
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
        <CodeBlock code="import { IconButton } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`import { CloseIcon } from '@k8ordo/ui';

<IconButton label="Close">
  <CloseIcon size="sm" />
</IconButton>`}
          >
            <IconButton label="Close">
              <CloseIcon size="sm" />
            </IconButton>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.iconButton.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<IconButton label="Close" size="sm">
  <CloseIcon size="sm" />
</IconButton>
<IconButton label="Close" size="md">
  <CloseIcon size="sm" />
</IconButton>
<IconButton label="Close" size="lg">
  <CloseIcon size="sm" />
</IconButton>`}
          >
            <IconButton label="Close" size="sm">
              <CloseIcon size="sm" />
            </IconButton>
            <IconButton label="Close" size="md">
              <CloseIcon size="sm" />
            </IconButton>
            <IconButton label="Close" size="lg">
              <CloseIcon size="sm" />
            </IconButton>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.iconButton.backgroundsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<IconButton color="transparent" label="Close">
  <CloseIcon size="sm" />
</IconButton>
<IconButton color="base" label="Close">
  <CloseIcon size="sm" />
</IconButton>
<IconButton color="primary" label="Close">
  <CloseIcon size="sm" />
</IconButton>
<IconButton color="secondary" label="Close">
  <CloseIcon size="sm" />
</IconButton>`}
          >
            <IconButton color="transparent" label="Close">
              <CloseIcon size="sm" />
            </IconButton>
            <IconButton color="base" label="Close">
              <CloseIcon size="sm" />
            </IconButton>
            <IconButton color="primary" label="Close">
              <CloseIcon size="sm" />
            </IconButton>
            <IconButton color="secondary" label="Close">
              <CloseIcon size="sm" />
            </IconButton>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.iconButton.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<IconButton disabled label="Close">
  <CloseIcon size="sm" />
</IconButton>`}
          >
            <IconButton disabled label="Close">
              <CloseIcon size="sm" />
            </IconButton>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.iconButton.renderItemTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<IconButton
  label="Close"
  renderItem={({
    children,
    disabled: _disabled,
    triggerProps,
    type: _type,
    ...props
  }) => (
    <a href="https://example.com" {...props} {...triggerProps}>
      {children}
    </a>
  )}
>
  <CloseIcon size="sm" />
</IconButton>`}
          >
            <IconButtonAsLinkPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('IconButton')}
          items={propsOf('IconButton')}
        />
      </section>
    </div>
  );
}
