import { Anchor, Heading, Separator, Skeleton } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function SkeletonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Skeleton" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Skeleton</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.skeleton.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-skeleton--docs`}
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
        <CodeBlock code="import { Skeleton } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code="<Skeleton />">
            <Skeleton />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.skeleton.shapesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Skeleton shape="rect" />
<Skeleton shape="circle" />`}
          >
            <Skeleton shape="rect" />
            <Skeleton shape="circle" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.skeleton.sizesTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Skeleton size="sm" />
<Skeleton size="md" />
<Skeleton size="lg" />`}
          >
            <Skeleton size="sm" />
            <Skeleton size="md" />
            <Skeleton size="lg" />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.skeleton.animationTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Skeleton animate />
<Skeleton animate={false} />`}
          >
            <Skeleton animate />
            <Skeleton animate={false} />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('Skeleton')}
          items={propsOf('Skeleton')}
        />
      </section>
    </div>
  );
}
