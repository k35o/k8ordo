import 'server-only';

// ゲストブックの署名。Server Action（sign）と route.ts（api/entries）が
// 同じものを読み書きする。本物ならデータベース
const entries: string[] = [];

export const readEntries = (): readonly string[] => entries;

export const addEntry = (name: string): void => {
  entries.push(name);
};
