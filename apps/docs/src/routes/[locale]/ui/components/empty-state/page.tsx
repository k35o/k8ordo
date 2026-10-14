import {
  Anchor,
  Button,
  EmptyState,
  Heading,
  Separator,
  Table,
  TableIcon,
} from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

import page from '../../../../../styles/page.module.css';
import styles from '../../../../../styles/pages/ui/components/empty-state.module.css';

export default function EmptyStatePage() {
  return (
    <div className={page.page}>
      <PageTitle name="EmptyState" />
      <div className={page.stack}>
        <Heading level="h1">EmptyState</Heading>
        <p className={page.lead}>
          <Rich>{m.components.emptyState.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-feedback-empty-state--default`}
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
        <CodeBlock code="import { EmptyState } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className={page.stackLg}>
        <div className={page.stack}>
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview code='<EmptyState title="No posts yet" />'>
            <div className={styles.frame}>
              <EmptyState title="No posts yet" />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">
            <Rich>{m.components.emptyState.withActionTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<EmptyState
  action={
    <Button color="base" size="sm" variant="outline">
      Clear filters
    </Button>
  }
  description="Removing a filter may bring some back."
  icon={<TableIcon size="lg" />}
  title="No matching posts"
/>`}
          >
            <div className={styles.frame}>
              <EmptyState
                action={
                  <Button color="base" size="sm" variant="outline">
                    Clear filters
                  </Button>
                }
                description="Removing a filter may bring some back."
                icon={<TableIcon size="lg" />}
                title="No matching posts"
              />
            </div>
          </ComponentPreview>
        </div>

        <div className={page.stack}>
          <Heading level="h3">Table.EmptyState</Heading>
          <p className={page.mute}>
            <Rich>{m.components.emptyState.inTableDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Table.Root>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Role</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.EmptyState colSpan={2} title="No members yet" />
  </Table.Body>
</Table.Root>`}
          >
            <Table.Root>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.EmptyState colSpan={2} title="No members yet" />
              </Table.Body>
            </Table.Root>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className={page.stack}>
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('EmptyState')}
          items={propsOf('EmptyState')}
        />
      </section>
    </div>
  );
}
