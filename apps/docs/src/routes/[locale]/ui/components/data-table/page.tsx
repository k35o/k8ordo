import { Anchor, Heading, Separator } from '@k8ordo/ui';
import { CodeBlock } from '@k8ordo/ui/code-block';

import { ComponentPreview } from '../../../../../components/component-preview';
import { PageTitle } from '../../../../../components/page-title';
import { PropsTable } from '../../../../../components/props-table';
import { Rich } from '../../../../../components/rich';
import { STORYBOOK_URL } from '../../../../../constants';
import { inheritsOf, propsOf } from '../../../../../data/component-props';
import * as m from '../../../../../messages';
import {
  DataTableEmptyPreview,
  DataTablePreview,
  DataTableUrlStatePreview,
} from '../_previews/data-table-previews';

const BASIC = `const [sort, setSort] = useState<DataTableSort | null>(null);
const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>([]);

<DataTable
  columns={[
    { id: 'name', header: 'Name', cell: (m) => m.name, sortable: true },
    { id: 'role', header: 'Role', cell: (m) => <Badge label={m.role} /> },
    {
      id: 'projects',
      header: 'Projects',
      cell: (m) => m.projects,
      align: 'right',
      sortable: true,
    },
  ]}
  getRowId={(m) => m.id}
  hiddenColumnIds={hiddenColumnIds}
  label="Members"
  onHiddenColumnIdsChange={setHiddenColumnIds}
  onSelectedIdsChange={setSelectedIds}
  onSortChange={setSort}
  rows={sortMembers(members, sort)}
  selectedIds={selectedIds}
  sort={sort}
/>`;

const URL_STATE = `// members-state.ts
export const membersState = definePageState('members', {
  url: z.object({
    sort: z._default(z.enum(['', 'name', 'projects']), ''),
    dir: z._default(z.enum(['ascending', 'descending']), 'ascending'),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
  }),
});

// members-table.tsx
const [{ sort, dir, page }, update] = useAppState(membersState);
const current = sort === '' ? null : { columnId: sort, direction: dir };
const rows = sortMembers(members, current);

<DataTable
  columns={columns}
  getRowId={(m) => m.id}
  label="Members"
  onSortChange={(next) => {
    update(
      next === null
        ? { sort: '', dir: 'ascending', page: 1 }
        : { sort: next.columnId, dir: next.direction, page: 1 },
      { history: 'push' },
    );
  }}
  rows={rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
  sort={current}
/>
<Pagination
  currentPage={page}
  onChange={(next) => update({ page: next }, { history: 'push' })}
  totalPages={Math.ceil(rows.length / PAGE_SIZE)}
/>`;

export default function DataTablePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 md:px-8">
      <PageTitle name="DataTable" />
      <div className="flex flex-col gap-4">
        <Heading level="h1">DataTable</Heading>
        <p className="text-fg-mute text-lg">
          <Rich>{m.components.dataTable.description()}</Rich>
        </p>
        <div>
          <Anchor
            href={`${STORYBOOK_URL}/?path=/story/components-data-display-data-table--sorting`}
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
        <CodeBlock
          code="import { DataTable, type DataTableSort } from '@k8ordo/ui';"
          lang="ts"
        />
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Heading level="h2">
            <Rich>{m.components.common.usageTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.dataTable.basicDescription()}</Rich>
          </p>
          <ComponentPreview code={BASIC}>
            <DataTablePreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dataTable.urlTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.dataTable.urlDescription()}</Rich>
          </p>
          <ComponentPreview code={URL_STATE}>
            <DataTableUrlStatePreview />
          </ComponentPreview>
        </div>

        <div className="flex flex-col gap-4">
          <Heading level="h3">
            <Rich>{m.components.dataTable.emptyTitle()}</Rich>
          </Heading>
          <p className="text-fg-mute">
            <Rich>{m.components.dataTable.emptyDescription()}</Rich>
          </p>
          <ComponentPreview
            code={`<DataTable
  columns={columns}
  emptyState={<EmptyState title="No members yet" />}
  getRowId={(m) => m.id}
  label="Members"
  rows={[]}
/>`}
          >
            <DataTableEmptyPreview />
          </ComponentPreview>
        </div>
      </section>
      <Separator color="mute" />

      <section className="flex flex-col gap-4">
        <Heading level="h2">
          <Rich>{m.components.common.propsTitle()}</Rich>
        </Heading>
        <PropsTable
          inherits={inheritsOf('DataTable')}
          items={propsOf('DataTable')}
          messagesNote
        />
      </section>
    </div>
  );
}
