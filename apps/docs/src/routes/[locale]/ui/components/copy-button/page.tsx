import { Anchor, CopyButton, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import { CopyButtonLazyValuePreview } from '../_previews/copy-button-previews';

export default function CopyButtonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="CopyButton" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">CopyButton</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.copyButton.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-buttons-copy-button--default`}
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
        <CodeBlock code="import { CopyButton } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.copyButton.feedbackDescription()}</Rich>
          </p>
          <ComponentPreview code='<CopyButton value="pnpm add @k8ordo/ui" label="Copy command" size="sm" />'>
            <CopyButton
              label="Copy command"
              size="sm"
              value="pnpm add @k8ordo/ui"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.copyButton.iconOnlyTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.copyButton.iconOnlyDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<CopyButton value={code} label="Copy code" iconOnly size="sm" />
<CopyButton value={code} label="Copy code" iconOnly />
<CopyButton value={code} label="Copy code" iconOnly size="lg" />`}
          >
            <CopyButton
              iconOnly
              label="Copy code"
              size="sm"
              value="const answer = 42;"
            />
            <CopyButton iconOnly label="Copy code" value="const answer = 42;" />
            <CopyButton
              iconOnly
              label="Copy code"
              size="lg"
              value="const answer = 42;"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.copyButton.lazyValueTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.copyButton.lazyValueDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`'use client';

<CopyButton label="Copy link" value={() => window.location.href} />

// A promise is fine too: the write still starts inside the click
<CopyButton
  label="Copy as Markdown"
  value={async () => (await fetch(\`/blog/\${slug}.md\`)).text()}
/>`}
          >
            <CopyButtonLazyValuePreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable items={propsOf('CopyButton')} />
      </section>
    </div>
  );
}
