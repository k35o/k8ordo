import type { input } from 'zod/v4/core';

import { createStoredCodec } from '../entry/codec';
import type { StoredCodec } from '../entry/codec';
import { isRecord } from '../schema/object';
import type { StateSchema, StateValues } from '../schema/object';

/**
 * How a local or cookie state reads rows an older version of its schema
 * wrote. Without it, such a row salvages field by field and every field the
 * schema no longer accepts lands on its default.
 */
export type Versioning<Schema extends StateSchema = StateSchema> = {
  /**
   * The version rows are written with now: a positive integer, raised when the
   * stored shape changes in a way salvage cannot carry across.
   */
  version: number;
  /**
   * Turns the values a row of an older version held into this version's.
   * `fromVersion` is the version the row was written with — `0` for a row
   * written before the definition declared a version. The result passes the
   * schema field by field like any read, so its keys are the schema's but its
   * values may be anything: map what you can, hand old values over as they
   * are, and leave the rest out. A throw reads as nothing stored and leaves
   * the row as it was.
   */
  migrate: (
    old: Readonly<Record<string, unknown>>,
    fromVersion: number,
  ) => { readonly [Key in keyof input<Schema>]?: unknown };
};

/**
 * The codec of a stored row — a Web Storage row or a cookie value, JSON
 * either way. A versioned row is the pair `[version, values]`: an array is
 * never what an unversioned row holds (the values are always an object), so
 * the two never read as each other.
 */
// parse は版を知らない読み方なので、行を読むのは read だけにする
export type RowCodec = Omit<StoredCodec, 'parse'> & {
  /**
   * The values in a parsed row. `stale` when the row was written by an older
   * version and migrated here, so the caller writes it back.
   */
  read: (row: unknown) => { values: StateValues; stale: boolean };
  /** The JSON-ready row for these values. */
  row: (values: Readonly<StateValues>) => unknown;
  /** The version rows are written with, `undefined` when unversioned. */
  version: number | undefined;
};

const envelopeOf = (
  row: unknown,
): { fromVersion: number; values: StateValues } | null => {
  if (isRecord(row)) return { fromVersion: 0, values: row };
  if (
    Array.isArray(row) &&
    row.length === 2 &&
    Number.isSafeInteger(row[0]) &&
    isRecord(row[1])
  ) {
    return { fromVersion: row[0] as number, values: row[1] };
  }
  return null;
};

export const createRowCodec = (
  schema: StateSchema,
  slot: string,
  key: string,
  versioning: Versioning | undefined,
): RowCodec => {
  const stored = createStoredCodec(schema, slot);
  if (versioning === undefined) {
    return {
      ...stored,
      read: (row) => ({ values: stored.parse(row), stale: false }),
      row: (values) => values,
      version: undefined,
    };
  }

  const { version, migrate } = versioning;
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new TypeError(
      `"${key}" version must be a positive integer, got ${String(version)}`,
    );
  }

  const read = (row: unknown): { values: StateValues; stale: boolean } => {
    const envelope = envelopeOf(row);
    if (envelope === null) {
      return { values: stored.parse(undefined), stale: false };
    }
    // 新しい版が書いた行は移行できないので、読めるフィールドだけを拾う。
    // 書き戻すと、その版を動かしているタブの値を古い形で潰してしまう
    if (envelope.fromVersion >= version) {
      return { values: stored.parse(envelope.values), stale: false };
    }
    let migrated: unknown;
    try {
      migrated = migrate(envelope.values, envelope.fromVersion);
    } catch {
      // 直した migrate が次の読み込みでやり直せるよう、行には触らない
      return { values: stored.parse(undefined), stale: false };
    }
    return { values: stored.parse(migrated), stale: true };
  };

  return {
    ...stored,
    read,
    row: (values) => [version, values],
    version,
  };
};
