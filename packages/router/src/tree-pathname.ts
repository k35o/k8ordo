'use client';

import { createContext } from 'react';
import type { Context } from 'react';

/**
 * The pathname the tree a component renders in was applied for, normalized
 * and in the URL's terms (`withBase`'s, not the table's), or `null` where no
 * router says. Under interception the URL commits before the next tree
 * arrives, so the two differ exactly while the tree on screen is being left.
 * Not exported: `@k8ordo/state` reads it to keep a page state's values with
 * the tree on screen, and `@k8ordo/framework`'s runtime provides it as
 * `<Router>` does.
 */
// state は router を実行時に読まず、framework の runtime は router の内部を
// import できないので、3 つとも同じ名前で globalThis の同じ context を指す
const KEY = Symbol.for('@k8ordo/router/tree-pathname');

type Global = { [KEY]?: Context<string | null> };

export const TreePathname: Context<string | null> = ((globalThis as Global)[
  KEY
] ??= createContext<string | null>(null));
