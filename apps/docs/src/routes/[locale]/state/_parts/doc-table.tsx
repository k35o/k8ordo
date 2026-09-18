import { Table } from '@k8ordo/ui';
import type { ReactNode } from 'react';

type DocTableRow = {
  key: string;
  cells: readonly ReactNode[];
};

type DocTableProps = {
  head: readonly string[];
  rows: readonly DocTableRow[];
};

/** state のガイドの表。列見出しは文言、セルは Rich や Code を含む任意の要素。 */
export function DocTable({ head, rows }: DocTableProps) {
  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          {head.map((label) => (
            <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.key}>
            {row.cells.map((cell, index) => (
              // 1 行の列は位置そのものが意味で、並び替わることがない
              // oxlint-disable-next-line react/no-array-index-key
              <Table.Cell color={index === 0 ? 'base' : 'mute'} key={index}>
                {cell}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
