'use client';

import { clsx } from 'clsx';
import { useId } from 'react';
import type { ReactNode } from 'react';

import { getMessages } from '../../../i18n/current';
import { Button } from '../../buttons/button';
import { Checkbox } from '../../form/checkbox';
import { CheckboxGroup } from '../../form/checkbox-group';
import { ChevronIcon } from '../../icons';
import { Popover } from '../../overlays/popover';
import { Table } from '../table';
import type { CellAlign } from '../table';

import focusRing from '../../_internal/focus-ring.module.css';
import styles from './data-table.module.css';

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
      className={clsx(
        styles.sortButton,
        column.align === 'right' && styles.alignRight,
        focusRing.ringNoBorder,
      )}
      onClick={() => {
        onSortChange(nextSort(column.id, sort));
      }}
      type="button"
    >
      {column.header}
      <span
        aria-hidden="true"
        className={clsx(styles.sortIcon, direction === null && styles.unsorted)}
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
            className={styles.columnMenu}
          >
            <p className={styles.columnMenuTitle} id={titleId}>
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
  selectedIds = NONE,
  onSelectedIdsChange,
  hiddenColumnIds = NONE,
  onHiddenColumnIdsChange,
  emptyState,
}: Props<Row>) => {
  const messages = getMessages();
  const rowHeaderId = useId();
  const visibleColumns = columns.filter(
    (column) => !hiddenColumnIds.includes(column.id),
  );
  const rowIds = rows.map((row) => getRowId(row));
  const selectedCount = rowIds.filter((id) => selectedIds.includes(id)).length;
  const isSelectable = onSelectedIdsChange !== undefined;
  const columnCount = visibleColumns.length + (isSelectable ? 1 : 0);

  return (
    <div className={styles.root}>
      {onHiddenColumnIdsChange === undefined ? null : (
        <div className={styles.toolbar}>
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
