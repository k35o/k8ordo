import { Anchor, Heading, Separator, SideNav } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/side-nav.module.css';

export default function SideNavPage() {
  return (
    <div className={page.page}>
      <PageTitle name="SideNav" />
      <div className={page.stack}>
        <Heading level="h1">SideNav</Heading>
        <p className={page.lead}>
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

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.importTitle()}</Rich>
        </Heading>
        <CodeBlock code="import { SideNav } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
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
            <div className={styles.frame}>
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

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.sideNav.renderAnchorTitle()}</Rich>
          </Heading>
          <p className={page.mute}>
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

      <section className={page.stack}>
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
