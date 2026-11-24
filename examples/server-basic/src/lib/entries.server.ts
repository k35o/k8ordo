import 'server-only';

// ゲストブックの署名。Server Action（sign）と route.ts（api/entries）が
// 同じものを読み書きする。本物ならデータベース
const entries: string[] = [];

export const readEntries = (): readonly string[] => entries;

export const addEntry = (name: string): void => {
  entries.push(name);
};

// 書き終えるまでに時間のかかる保存。本物なら遠くのデータベースへの書き込み
export const addEntrySlowly = async (name: string): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });
  addEntry(name);
};
