import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor, within } from 'storybook/test';

import { DataTable } from '.';
import type { DataTableColumn, DataTableSort } from '.';
import { EmptyState } from '../../feedback/empty-state';
import { Badge } from '../badge';

const meta: Meta<typeof DataTable> = {
  title: 'components/data-display/data-table',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

type Member = {
  id: string;
  name: string;
  role: string;
  projects: number;
};

const MEMBERS: Member[] = [
  { id: 'm1', name: '青木', role: 'デザイナー', projects: 3 },
  { id: 'm2', name: '井上', role: 'エンジニア', projects: 8 },
  { id: 'm3', name: '上田', role: 'エンジニア', projects: 5 },
];

const COLUMNS: Array<DataTableColumn<Member>> = [
  { id: 'name', header: '名前', cell: (member) => member.name, sortable: true },
  {
    id: 'role',
    header: '役割',
    cell: (member) => <Badge label={member.role} />,
  },
  {
    id: 'projects',
    header: 'プロジェクト',
    cell: (member) => member.projects,
    align: 'right',
    sortable: true,
  },
];

const collator = new Intl.Collator('ja');

// 並べ替えは呼び出し側の仕事。DataTable は渡された順に描く
const sortMembers = (
  members: readonly Member[],
  sort: DataTableSort | null,
): Member[] => {
  if (sort === null) return [...members];
  const sorted = members.toSorted((a, b) =>
    sort.columnId === 'projects'
      ? a.projects - b.projects
      : collator.compare(a.name, b.name),
  );
  return sort.direction === 'ascending' ? sorted : sorted.toReversed();
};

const Controlled = () => {
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>([]);
  return (
    <DataTable
      columns={COLUMNS}
      getRowId={(member) => member.id}
      hiddenColumnIds={hiddenColumnIds}
      label="メンバー"
      onHiddenColumnIdsChange={setHiddenColumnIds}
      onSelectedIdsChange={setSelectedIds}
      onSortChange={setSort}
      rows={sortMembers(MEMBERS, sort)}
      selectedIds={selectedIds}
      sort={sort}
    />
  );
};

const namesInOrder = (table: HTMLElement): string[] =>
  within(table)
    .getAllByRole('rowheader')
    .map((cell) => cell.textContent);

export const Sorting: Story = {
  render: () => <Controlled />,
  play: async ({ canvas, userEvent }) => {
    const table = canvas.getByRole('table', { name: 'メンバー' });
    const header = canvas.getByRole('columnheader', { name: 'プロジェクト' });

    await expect(header).toHaveAttribute('aria-sort', 'none');
    await expect(namesInOrder(table)).toStrictEqual(['青木', '井上', '上田']);

    // 押すたびに 昇順 → 降順 → 並べ替えなし と巡る
    await userEvent.click(canvas.getByRole('button', { name: 'プロジェクト' }));
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(namesInOrder(table)).toStrictEqual(['青木', '上田', '井上']);

    await userEvent.click(canvas.getByRole('button', { name: 'プロジェクト' }));
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(namesInOrder(table)).toStrictEqual(['井上', '上田', '青木']);

    await userEvent.click(canvas.getByRole('button', { name: 'プロジェクト' }));
    await expect(header).toHaveAttribute('aria-sort', 'none');

    // 並べ替えられない列には aria-sort もボタンも無い
    await expect(
      canvas.getByRole('columnheader', { name: '役割' }),
    ).not.toHaveAttribute('aria-sort');
  },
};

export const Selection: Story = {
  render: () => <Controlled />,
  play: async ({ canvas, userEvent }) => {
    const all = canvas.getByRole('checkbox', { name: 'すべての行を選択' });
    const inoue = canvas.getByRole('checkbox', { name: '行を選択 井上' });

    await userEvent.click(inoue);
    await expect(inoue).toBeChecked();
    // 一部だけ選ぶと、見出しのチェックボックスは途中の状態になる
    await expect(all).toBePartiallyChecked();

    await userEvent.click(all);
    await expect(
      canvas
        .getAllByRole('checkbox', { name: /^行を選択/u })
        .every((box) => (box as HTMLInputElement).checked),
    ).toBe(true);
    await expect(all).toBeChecked();

    await userEvent.click(all);
    await expect(inoue).not.toBeChecked();
  },
};

export const ColumnVisibility: Story = {
  render: () => <Controlled />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '表示する列' }));
    const dialog = await canvas.findByRole('dialog', { name: '表示する列' });

    await userEvent.click(
      within(dialog).getByRole('checkbox', { name: '役割' }),
    );

    await waitFor(() => {
      expect(
        canvas.queryByRole('columnheader', { name: '役割' }),
      ).not.toBeInTheDocument();
    });
    await expect(
      canvas.getByRole('columnheader', { name: '名前' }),
    ).toBeInTheDocument();
  },
};

export const Empty: Story = {
  render: () => (
    <DataTable
      columns={COLUMNS}
      emptyState={<EmptyState title="メンバーがいません" />}
      getRowId={(member) => member.id}
      label="メンバー"
      onSelectedIdsChange={() => undefined}
      rows={[]}
      selectedIds={[]}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('メンバーがいません')).toBeInTheDocument();
    await expect(canvas.getByRole('cell')).toHaveAttribute('colspan', '4');
    await expect(
      canvas.getByRole('checkbox', { name: 'すべての行を選択' }),
    ).toBeDisabled();
  },
};

// 状態を渡さなければ、並べ替えも選択も列の切り替えも出ない
export const Plain: Story = {
  render: () => (
    <DataTable
      columns={COLUMNS}
      getRowId={(member) => member.id}
      label="メンバー"
      rows={MEMBERS}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('checkbox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};
