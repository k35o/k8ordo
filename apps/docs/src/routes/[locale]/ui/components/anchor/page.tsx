import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function AnchorPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Anchor" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Anchor</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.anchor.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-navigation-anchor--external`}
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
        <CodeBlock code="import { Anchor } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Anchor href="https://example.com" openInNewTab>
  External Link
</Anchor>`}
          >
            <Anchor href="https://example.com" openInNewTab>
              External Link
            </Anchor>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.anchor.openInNewTabTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Anchor href="#">
  Same Tab Link
</Anchor>
<Anchor href="https://example.com" openInNewTab>
  New Tab Link
</Anchor>`}
          >
            <Anchor href="#">Same Tab Link</Anchor>
            <Anchor href="https://example.com" openInNewTab>
              New Tab Link
            </Anchor>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.anchor.renderAnchorTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute text-sm">
            <Rich>{m.components.anchor.renderAnchorDescription()}</Rich>
          </p>
          <CodeBlock
            code={`// Swap in the Next.js Link
import Link from 'next/link';

<Anchor
  href="/about"
  renderAnchor={({ children, ...rest }) => (
    <Link {...rest}>{children}</Link>
  )}
>
  About
</Anchor>`}
            lang="tsx"
          />
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Anchor')} items={propsOf('Anchor')} />
      </section>
    </div>
  );
}
