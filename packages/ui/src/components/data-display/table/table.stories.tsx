import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../badge';
import { Table } from './table';

const meta: Meta<typeof Table.Root> = {
  title: 'components/data-display/table',
  component: Table.Root,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Table.Root>;

export const Default: Story = {
  render: () => (
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
          <Table.Cell>Avatar</Table.Cell>
          <Table.Cell>
            <Badge label="Stable" tone="success" />
          </Table.Cell>
          <Table.Cell align="right">100%</Table.Cell>
        </Table.Row>
        <Table.Row interactive>
          <Table.Cell>Badge</Table.Cell>
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
  ),
};

export const Empty: Story = {
  render: () => (
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
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table.Root>
      <Table.Caption>Quarterly shipping overview</Table.Caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Region</Table.HeaderCell>
          <Table.HeaderCell align="right">Orders</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Japan</Table.Cell>
          <Table.Cell align="right">128</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>North America</Table.Cell>
          <Table.Cell align="right">96</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};
