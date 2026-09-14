import { Anchor, Avatar, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function AvatarPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Avatar" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Avatar</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.avatar.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-avatar--docs`}
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
        <CodeBlock code="import { Avatar } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<Avatar name="Ada Lovelace" />'>
            <Avatar name="Ada Lovelace" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.avatar.withImageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Avatar
  alt="Ada Lovelace"
  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
/>`}
          >
            <Avatar
              alt="Ada Lovelace"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
            />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.avatar.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Avatar name="Small" size="sm" />
<Avatar name="Medium" size="md" />
<Avatar name="Large" size="lg" />`}
          >
            <Avatar name="Small" size="sm" />
            <Avatar name="Medium" size="md" />
            <Avatar name="Large" size="lg" />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable inherits={inheritsOf('Avatar')} items={propsOf('Avatar')} />
      </section>
    </div>
  );
}
