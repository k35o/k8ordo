import { Anchor, CloseIcon, Heading, IconButton, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../components/code-block';
import { ComponentPreview } from '../../components/component-preview';
import { PropsTable } from '../../components/props-table';
import { T } from '../../components/t';
import { STORYBOOK_URL } from '../../constants';
import { inheritsOf, propsOf } from '../../data/component-props';
import { IconButtonAsLinkPreview } from './_previews/icon-button-previews';

export function IconButtonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">IconButton</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.iconButton.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-button-icon-button--docs`}
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
        <CodeBlock code="import { IconButton } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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
            <T k="components.iconButton.sizesTitle" />
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
            <T k="components.iconButton.backgroundsTitle" />
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
            <T k="components.iconButton.disabledTitle" />
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
            <T k="components.iconButton.renderItemTitle" />
          </Heading>
          <ComponentPreview
            code={`<IconButton
  label="Close"
  renderItem={({
    className,
    children,
    'aria-label': ariaLabel,
    triggerProps,
  }) => (
    <a
      aria-label={ariaLabel}
      className={className}
      href="https://example.com"
      {...triggerProps}
    >
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
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable
          inherits={inheritsOf('IconButton')}
          items={propsOf('IconButton')}
        />
      </section>
    </div>
  );
}
