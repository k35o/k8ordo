import { Anchor, Heading, Separator } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
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
          <Rich>{m.components.breadcrumb.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-navigation-breadcrumb--medium`}
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
        <CodeBlock code="import { Breadcrumb } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
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
            <Rich>{m.components.breadcrumb.currentPageTitle()}</Rich>
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
            <Rich>{m.components.breadcrumb.sizesTitle()}</Rich>
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
          <Rich>{m.components.common.propsTitle()}</Rich>
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
