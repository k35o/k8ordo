import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import {
  BreadcrumbBasicPreview,
  BreadcrumbCurrentPagePreview,
  BreadcrumbSizesPreview,
} from '../_previews/breadcrumb-previews';

export default function BreadcrumbPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Breadcrumb</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.breadcrumb.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-breadcrumb--docs`}
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
        <CodeBlock code="import { Breadcrumb } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
          </Heading>
          <ComponentPreview
            code={`<Breadcrumb.List>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/components/breadcrumb">
      Breadcrumb
    </Breadcrumb.Link>
  </Breadcrumb.Item>
</Breadcrumb.List>`}
          >
            <BreadcrumbBasicPreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.breadcrumb.currentPageTitle" />
          </Heading>
          <ComponentPreview
            code={`<Breadcrumb.List>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link current href="/components/breadcrumb">
      Breadcrumb
    </Breadcrumb.Link>
  </Breadcrumb.Item>
</Breadcrumb.List>`}
          >
            <BreadcrumbCurrentPagePreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <T k="components.breadcrumb.sizesTitle" />
          </Heading>
          <ComponentPreview
            code={`<Breadcrumb.List size="sm">
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link current href="/docs">Docs</Breadcrumb.Link>
  </Breadcrumb.Item>
</Breadcrumb.List>

<Breadcrumb.List size="md">
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link current href="/docs">Docs</Breadcrumb.Link>
  </Breadcrumb.Item>
</Breadcrumb.List>

<Breadcrumb.List size="lg">
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link current href="/docs">Docs</Breadcrumb.Link>
  </Breadcrumb.Item>
</Breadcrumb.List>`}
          >
            <BreadcrumbSizesPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
        </Heading>
        <Heading level="h3">Breadcrumb.List</Heading>
        <PropsTable items={propsOf('Breadcrumb.List')} />
        <Heading level="h3">Breadcrumb.Item</Heading>
        <PropsTable items={propsOf('Breadcrumb.Item')} />
        <Heading level="h3">Breadcrumb.Separator</Heading>
        <PropsTable items={propsOf('Breadcrumb.Separator')} />
        <Heading level="h3">Breadcrumb.Link</Heading>
        <PropsTable items={propsOf('Breadcrumb.Link')} />
      </section>
    </div>
  );
}
