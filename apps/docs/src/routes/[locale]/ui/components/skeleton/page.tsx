import { Anchor, Heading, Separator, Skeleton } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

export default function SkeletonPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Skeleton</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.skeleton.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-skeleton--docs`}
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
        <CodeBlock code="import { Skeleton } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview code="<Skeleton />">
            <Skeleton />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.skeleton.shapesTitle" />
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
            <T k="components.skeleton.sizesTitle" />
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
            <T k="components.skeleton.animationTitle" />
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
          <T k="components.common.propsTitle" />
        </Heading>
        <PropsTable
          inherits={inheritsOf('Skeleton')}
          items={propsOf('Skeleton')}
        />
      </section>
    </div>
  );
}
