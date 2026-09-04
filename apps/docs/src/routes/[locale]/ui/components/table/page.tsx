import { Anchor, Badge, Heading, Separator, Table } from '@k8ordo/ui';

import { CodeBlock } from '../../../../../components/code-block';
import { ComponentPreview } from '../../../../../components/component-preview';
import { PropsTable } from '../../../../../components/props-table';
import { T } from '../../../../../components/t';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';

export default function TablePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <div className="flex flex-col gap-4">
        <Heading level="h1">Table</Heading>
        <p className="text-fg-mute text-lg">
          <T k="components.table.description" />
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/docs/components-table--docs`}
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
        <CodeBlock code="import { Table } from '@k8ordo/ui';" lang="ts" />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <T k="components.common.usageTitle" />
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
            <T k="components.table.emptyStateTitle" />
          </Heading>
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
    <Table.EmptyState colSpan={3}>
      No records have been added yet.
    </Table.EmptyState>
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
                <Table.EmptyState colSpan={3}>
                  No records have been added yet.
                </Table.EmptyState>
              </Table.Body>
            </Table.Root>
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <T k="components.common.propsTitle" />
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
        <PropsTable items={propsOf('Table.EmptyState')} />
      </section>
    </div>
  );
}
