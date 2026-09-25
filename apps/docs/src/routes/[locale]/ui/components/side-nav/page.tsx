import { Anchor, Heading, Separator, SideNav } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function SideNavPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="SideNav" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">SideNav</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.sideNav.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-navigation-side-nav--default`}
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
        <CodeBlock code="import { SideNav } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.sideNav.basicDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<SideNav.Root label="Guide">
  <SideNav.Group title="Getting started">
    <SideNav.Link current href="/get-started">
      Get started
    </SideNav.Link>
    <SideNav.Link href="/theming">Theming</SideNav.Link>
  </SideNav.Group>
  <SideNav.Group title="Components">
    <SideNav.Link href="/button">Button</SideNav.Link>
  </SideNav.Group>
</SideNav.Root>`}
          >
            <div className="w-60">
              <SideNav.Root label="Guide">
                <SideNav.Group title="Getting started">
                  <SideNav.Link current href="#get-started">
                    Get started
                  </SideNav.Link>
                  <SideNav.Link href="#theming">Theming</SideNav.Link>
                </SideNav.Group>
                <SideNav.Group title="Components">
                  <SideNav.Link href="#button">Button</SideNav.Link>
                </SideNav.Group>
              </SideNav.Root>
            </div>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.sideNav.renderAnchorTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.sideNav.renderAnchorDescription()}</Rich>
          </p>
          <CodeBlock
            code={`<SideNav.Link
  current={matchPath(item.path, pathname) !== null}
  href={href(item.path)}
  onClick={closeDrawer}
  renderAnchor={({ children, ...props }) => (
    <Link {...props}>{children}</Link>
  )}
>
  {item.name}
</SideNav.Link>`}
            lang="tsx"
          />
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">SideNav.Root</Heading>
        <PropsTable
          inherits={inheritsOf('SideNav.Root')}
          items={propsOf('SideNav.Root')}
        />
        <Heading level="h3">SideNav.Group</Heading>
        <PropsTable
          inherits={inheritsOf('SideNav.Group')}
          items={propsOf('SideNav.Group')}
        />
        <Heading level="h3">SideNav.Link</Heading>
        <PropsTable
          inherits={inheritsOf('SideNav.Link')}
          items={propsOf('SideNav.Link')}
        />
      </section>
    </div>
  );
}
