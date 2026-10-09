'use client';

import { definePageState, useAppState } from '@k8ordo/state';
import { Badge, DataTable, EmptyState, Pagination } from '@k8ordo/ui';
import type { DataTableColumn, DataTableSort } from '@k8ordo/ui';
import { useState } from 'react';
import * as z from 'zod/mini';

type Member = {
  id: string;
  name: string;
  role: string;
  projects: number;
};

const MEMBERS: Member[] = [
  { id: 'm1', name: 'Aoki', role: 'Designer', projects: 3 },
  { id: 'm2', name: 'Inoue', role: 'Engineer', projects: 8 },
  { id: 'm3', name: 'Ueda', role: 'Engineer', projects: 5 },
  { id: 'm4', name: 'Endo', role: 'PM', projects: 2 },
  { id: 'm5', name: 'Ota', role: 'Designer', projects: 6 },
  { id: 'm6', name: 'Kato', role: 'Engineer', projects: 1 },
];

const COLUMNS: Array<DataTableColumn<Member>> = [
  { id: 'name', header: 'Name', cell: (member) => member.name, sortable: true },
  {
    id: 'role',
    header: 'Role',
    cell: (member) => <Badge label={member.role} />,
  },
  {
    id: 'projects',
    header: 'Projects',
    cell: (member) => member.projects,
    align: 'right',
    sortable: true,
  },
];

const collator = new Intl.Collator('en');

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

export function DataTablePreview() {
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>([]);

  return (
    <div className="w-full">
      <DataTable
        columns={COLUMNS}
        getRowId={(member) => member.id}
        hiddenColumnIds={hiddenColumnIds}
        label="Members"
        onHiddenColumnIdsChange={setHiddenColumnIds}
        onSelectedIdsChange={setSelectedIds}
        onSortChange={setSort}
        rows={sortMembers(MEMBERS.slice(0, 3), sort)}
        selectedIds={selectedIds}
        sort={sort}
      />
    </div>
  );
}

export function DataTableEmptyPreview() {
  return (
    <div className="w-full">
      <DataTable
        columns={COLUMNS}
        emptyState={<EmptyState title="No members yet" />}
        getRowId={(member) => member.id}
        label="Members"
        rows={[]}
      />
    </div>
  );
}

const PAGE_SIZE = 3;

// 並べ替えとページは URL（共有される面）に置く。リンクを渡した相手にも
// 同じ並びの同じページが見え、戻るで前の並びに戻る
/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
const membersState = definePageState('ui-data-table-demo', {
  url: z.object({
    sort: z._default(z.enum(['', 'name', 'projects']), ''),
    dir: z._default(z.enum(['ascending', 'descending']), 'ascending'),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
  }),
});
/* oxlint-enable no-underscore-dangle */

export function DataTableUrlStatePreview() {
  const [{ sort, dir, page }, update] = useAppState(membersState);
  const current: DataTableSort | null =
    sort === '' ? null : { columnId: sort, direction: dir };
  const rows = sortMembers(MEMBERS, current);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  return (
    <div className="flex w-full flex-col gap-4">
      <DataTable
        columns={COLUMNS}
        getRowId={(member) => member.id}
        label="Members"
        onSortChange={(next) => {
          update(
            next === null
              ? { sort: '', dir: 'ascending', page: 1 }
              : {
                  sort: next.columnId === 'projects' ? 'projects' : 'name',
                  dir: next.direction,
                  page: 1,
                },
            { history: 'push' },
          );
        }}
        rows={rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
        sort={current}
      />
      <Pagination
        currentPage={page}
        onChange={(next) => {
          update({ page: next }, { history: 'push' });
        }}
        totalPages={totalPages}
      />
    </div>
  );
}
