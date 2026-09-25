'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';

import { cn } from '../../../helpers/cn';
import { getMessages } from '../../../i18n/current';
import { FOCUS_RING_NO_BORDER } from '../../_internal/focus-ring';
import { Button } from '../../buttons/button';
import { Checkbox } from '../../form/checkbox';
import { CheckboxGroup } from '../../form/checkbox-group';
import { ChevronIcon } from '../../icons';
import { Popover } from '../../overlays/popover';
import { Table } from '../table';
import type { CellAlign } from '../table';

export type DataTableColumn<Row> = {
  id: string;
  header: string;
  cell: (row: Row) => ReactNode;
  align?: CellAlign;
  sortable?: boolean;
  hideable?: boolean;
};

export type DataTableSort = {
  columnId: string;
  direction: 'ascending' | 'descending';
};

type Props<Row> = {
  label: string;
  columns: ReadonlyArray<DataTableColumn<Row>>;
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  selectedIds?: readonly string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  hiddenColumnIds?: readonly string[];
  onHiddenColumnIdsChange?: (ids: string[]) => void;
  emptyState?: ReactNode;
};

// 既定の空の配列。描画ごとに作り直すと、同じ値でも別の参照になる
const NONE: readonly string[] = [];

// 押すたびに 昇順 → 降順 → 並べ替えなし と巡る
const nextSort = (
  columnId: string,
  current: DataTableSort | null,
): DataTableSort | null => {
  if (current?.columnId !== columnId) {
    return { columnId, direction: 'ascending' };
  }
  return current.direction === 'ascending'
    ? { columnId, direction: 'descending' }
    : null;
};

const SortButton = <Row,>({
  column,
  sort,
  onSortChange,
}: {
  column: DataTableColumn<Row>;
  sort: DataTableSort | null;
  onSortChange: (sort: DataTableSort | null) => void;
}) => {
  const direction = sort?.columnId === column.id ? sort.direction : null;
  return (
    <button
      className={cn(
        'group -mx-2 inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium transition-colors hover:bg-bg-mute',
        column.align === 'right' && 'flex-row-reverse',
        FOCUS_RING_NO_BORDER,
      )}
      onClick={() => {
        onSortChange(nextSort(column.id, sort));
      }}
      type="button"
    >
      {column.header}
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex transition-opacity',
          direction === null && 'opacity-0 group-hover:opacity-60',
        )}
      >
        <ChevronIcon
          direction={direction === 'descending' ? 'down' : 'up'}
          size="sm"
        />
      </span>
    </button>
  );
};

const ColumnMenu = <Row,>({
  columns,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
}: {
  columns: ReadonlyArray<DataTableColumn<Row>>;
  hiddenColumnIds: readonly string[];
  onHiddenColumnIdsChange: (ids: string[]) => void;
}) => {
  const messages = getMessages();
  const titleId = useId();
  const hideable = columns.filter((column) => column.hideable !== false);
  const visible = hideable
    .filter((column) => !hiddenColumnIds.includes(column.id))
    .map((column) => column.id);

  return (
    <Popover.Root placement="bottom-end" role="dialog">
      <Popover.Trigger
        renderItem={(props) => (
          <Button
            {...props}
            color="base"
            size="sm"
            type="button"
            variant="outline"
          >
            {messages.dataTableColumns}
          </Button>
        )}
      />
      <Popover.Content
        renderItem={(props) => (
          <div
            {...props}
            aria-labelledby={titleId}
            className="bg-bg-raised flex flex-col gap-3 rounded-lg p-4 shadow-md"
          >
            <p className="text-fg-mute text-xs font-bold" id={titleId}>
              {messages.dataTableColumns}
            </p>
            <CheckboxGroup.Root
              aria-labelledby={titleId}
              name={`${titleId}-columns`}
              onChange={(next) => {
                onHiddenColumnIdsChange(
                  hideable
                    .map((column) => column.id)
                    .filter((id) => !next.includes(id)),
                );
              }}
              value={visible}
            >
              {hideable.map((column) => (
                <CheckboxGroup.Item
                  itemValue={column.id}
                  key={column.id}
                  label={column.header}
                />
              ))}
            </CheckboxGroup.Root>
          </div>
        )}
      />
    </Popover.Root>
  );
};

export const DataTable = <Row,>({
  label,
  columns,
  rows,
  getRowId,
  sort = null,
  onSortChange,
  selectedIds: selectedIdsProp,
  onSelectedIdsChange,
  hiddenColumnIds: hiddenColumnIdsProp,
  onHiddenColumnIdsChange,
  emptyState,
}: Props<Row>) => {
  const messages = getMessages();
  const selectedIds = selectedIdsProp ?? NONE;
  const hiddenColumnIds = hiddenColumnIdsProp ?? NONE;
  const rowHeaderId = useId();
  const visibleColumns = columns.filter(
    (column) => !hiddenColumnIds.includes(column.id),
  );
  const rowIds = rows.map((row) => getRowId(row));
  const selectedCount = rowIds.filter((id) => selectedIds.includes(id)).length;
  const isSelectable = onSelectedIdsChange !== undefined;
  const columnCount = visibleColumns.length + (isSelectable ? 1 : 0);

  return (
    <div className="flex flex-col gap-3">
      {onHiddenColumnIdsChange === undefined ? null : (
        <div className="flex justify-end">
          <ColumnMenu
            columns={columns}
            hiddenColumnIds={hiddenColumnIds}
            onHiddenColumnIdsChange={onHiddenColumnIdsChange}
          />
        </div>
      )}
      <Table.Root aria-label={label}>
        <Table.Head>
          <Table.Row>
            {isSelectable ? (
              <Table.HeaderCell>
                <Checkbox
                  checked={rows.length > 0 && selectedCount === rows.length}
                  disabled={rows.length === 0}
                  indeterminate={
                    selectedCount > 0 && selectedCount < rows.length
                  }
                  label={messages.dataTableSelectAll}
                  labelHidden
                  onChange={(checked) => {
                    onSelectedIdsChange(
                      checked
                        ? [...new Set([...selectedIds, ...rowIds])]
                        : selectedIds.filter((id) => !rowIds.includes(id)),
                    );
                  }}
                />
              </Table.HeaderCell>
            ) : null}
            {visibleColumns.map((column) => {
              const isSortable =
                column.sortable === true && onSortChange !== undefined;
              return (
                <Table.HeaderCell
                  align={column.align}
                  aria-sort={
                    isSortable
                      ? sort?.columnId === column.id
                        ? sort.direction
                        : 'none'
                      : undefined
                  }
                  key={column.id}
                >
                  {isSortable ? (
                    <SortButton
                      column={column}
                      onSortChange={onSortChange}
                      sort={sort}
                    />
                  ) : (
                    column.header
                  )}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={columnCount}>{emptyState}</Table.Cell>
            </Table.Row>
          ) : (
            rows.map((row, rowIndex) => {
              const id = rowIds[rowIndex] ?? '';
              const isSelected = selectedIds.includes(id);
              const headerId = `${rowHeaderId}-${String(rowIndex)}`;
              return (
                <Table.Row key={id} selected={isSelected}>
                  {isSelectable ? (
                    <Table.Cell>
                      <Checkbox
                        // 「行を選択」に行の見出しを続けて、どの行かを名前にする
                        aria-label={messages.dataTableSelectRow}
                        aria-labelledby={`${headerId}-select ${headerId}`}
                        checked={isSelected}
                        id={`${headerId}-select`}
                        label={messages.dataTableSelectRow}
                        labelHidden
                        onChange={(checked) => {
                          onSelectedIdsChange(
                            checked
                              ? [...selectedIds, id]
                              : selectedIds.filter((value) => value !== id),
                          );
                        }}
                      />
                    </Table.Cell>
                  ) : null}
                  {visibleColumns.map((column, columnIndex) =>
                    // 最初の列を行の見出しにして、選択のチェックボックスの名前にも使う
                    columnIndex === 0 ? (
                      <Table.HeaderCell
                        align={column.align}
                        id={headerId}
                        key={column.id}
                        scope="row"
                      >
                        {column.cell(row)}
                      </Table.HeaderCell>
                    ) : (
                      <Table.Cell align={column.align} key={column.id}>
                        {column.cell(row)}
                      </Table.Cell>
                    ),
                  )}
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
