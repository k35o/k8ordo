import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

export default function AnchorPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Anchor</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.anchor.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-anchor--docs`}
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
        <CodeBlock code="import { Anchor } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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
            <T k="components.anchor.openInNewTabTitle" />
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
            <T k="components.anchor.renderAnchorTitle" />
          </Heading>
          <p className="text-fg-mute text-sm">
            <T k="components.anchor.renderAnchorDescription" />
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
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable inherits={inheritsOf('Anchor')} items={propsOf('Anchor')} />
      </section>
    </div>
  );
}
