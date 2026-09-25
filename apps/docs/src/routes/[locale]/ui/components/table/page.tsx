import { Anchor, Badge, Heading, Separator, Table } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';

export default function TablePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="Table" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">Table</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.table.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-table--default`}
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
        <CodeBlock code="import { Table } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <ComponentPreview
            code={`<Table.Root>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Feature</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell align="right">Coverage</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row interactive>
      <Table.Cell>Switch</Table.Cell>
      <Table.Cell>Stable</Table.Cell>
      <Table.Cell align="right">100%</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>`}
          >
            <Table.Root>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Feature</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell align="right">Coverage</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row interactive>
                  <Table.Cell>Switch</Table.Cell>
                  <Table.Cell>
                    <Badge label="Stable" tone="success" />
                  </Table.Cell>
                  <Table.Cell align="right">100%</Table.Cell>
                </Table.Row>
                <Table.Row interactive>
                  <Table.Cell>Table</Table.Cell>
                  <Table.Cell>
                    <Badge label="Planned" tone="info" variant="outline" />
                  </Table.Cell>
                  <Table.Cell align="right">0%</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.table.emptyStateTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.table.emptyStateDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<Table.Root>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Role</Table.HeaderCell>
      <Table.HeaderCell align="right">Projects</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.EmptyState
      colSpan={3}
      description="Invite a teammate to get started."
      title="No records have been added yet."
    />
  </Table.Body>
</Table.Root>`}
          >
            <Table.Root>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell align="right">Projects</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.EmptyState
                  colSpan={3}
                  description="Invite a teammate to get started."
                  title="No records have been added yet."
                />
              </Table.Body>
            </Table.Root>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <Heading level="h3">Table.Root</Heading>
        <PropsTable
          inherits={inheritsOf('Table.Root')}
          items={propsOf('Table.Root')}
        />
        <Heading level="h3">Table.Caption</Heading>
        <PropsTable
          inherits={inheritsOf('Table.Caption')}
          items={propsOf('Table.Caption')}
        />
        <Heading level="h3">Table.Head</Heading>
        <PropsTable
          inherits={inheritsOf('Table.Head')}
          items={propsOf('Table.Head')}
        />
        <Heading level="h3">Table.Body</Heading>
        <PropsTable
          inherits={inheritsOf('Table.Body')}
          items={propsOf('Table.Body')}
        />
        <Heading level="h3">Table.Row</Heading>
        <PropsTable
          inherits={inheritsOf('Table.Row')}
          items={propsOf('Table.Row')}
        />
        <Heading level="h3">Table.HeaderCell</Heading>
        <PropsTable
          inherits={inheritsOf('Table.HeaderCell')}
          items={propsOf('Table.HeaderCell')}
        />
        <Heading level="h3">Table.Cell</Heading>
        <PropsTable
          inherits={inheritsOf('Table.Cell')}
          items={propsOf('Table.Cell')}
        />
        <Heading level="h3">Table.EmptyState</Heading>
        <PropsTable
          inherits={inheritsOf('Table.EmptyState')}
          items={propsOf('Table.EmptyState')}
        />
      </section>
    </div>
  );
}
