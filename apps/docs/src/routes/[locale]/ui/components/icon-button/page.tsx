import { Anchor, Heading, IconButton, Separator } from '@k8ordo/ui';
import { XIcon } from '@k8ordo/ui/icons';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import { IconButtonAsLinkPreview } from '../../../../../demos/ui/components/icon-button-previews';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';

export default function IconButtonPage() {
  return (
    <div className={page.page}>
      <PageTitle name="IconButton" />
      <div className={page.stack}>
        <Heading level="h1">IconButton</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { IconButton } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`import { XIcon } from '@k8ordo/ui/icons';

<IconButton label="Close">
  <XIcon size="sm" />
</IconButton>`}
          >
            <IconButton label="Close">
              <XIcon size="sm" />
            </IconButton>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.iconButton.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<IconButton label="Close" size="sm">
  <XIcon size="sm" />
</IconButton>
<IconButton label="Close" size="md">
  <XIcon size="sm" />
</IconButton>
<IconButton label="Close" size="lg">
  <XIcon size="sm" />
</IconButton>`}
          >
            <IconButton label="Close" size="sm">
              <XIcon size="sm" />
            </IconButton>
            <IconButton label="Close" size="md">
              <XIcon size="sm" />
            </IconButton>
            <IconButton label="Close" size="lg">
              <XIcon size="sm" />
            </IconButton>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.iconButton.backgroundsTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<IconButton color="transparent" label="Close">
  <XIcon size="sm" />
</IconButton>
<IconButton color="base" label="Close">
  <XIcon size="sm" />
</IconButton>
<IconButton color="primary" label="Close">
  <XIcon size="sm" />
</IconButton>
<IconButton color="secondary" label="Close">
  <XIcon size="sm" />
</IconButton>`}
          >
            <IconButton color="transparent" label="Close">
              <XIcon size="sm" />
            </IconButton>
            <IconButton color="base" label="Close">
              <XIcon size="sm" />
            </IconButton>
            <IconButton color="primary" label="Close">
              <XIcon size="sm" />
            </IconButton>
            <IconButton color="secondary" label="Close">
              <XIcon size="sm" />
            </IconButton>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.iconButton.disabledTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<IconButton disabled label="Close">
  <XIcon size="sm" />
</IconButton>`}
          >
            <IconButton disabled label="Close">
              <XIcon size="sm" />
            </IconButton>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
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
  <XIcon size="sm" />
</IconButton>`}
          >
            <IconButtonAsLinkPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
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
