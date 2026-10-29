'use client';

import { createContext } from 'react';
import type { Context } from 'react';

/**
 * `@k8ordo/router`'s context for the pathname each tree was applied for,
 * which `<Router>` provides and `@k8ordo/state` reads to keep a page state's
 * values with the tree on screen. `AppRouter` provides it the same way.
 */
// router はこの context を export しないので、router と state と同じ名前で
// globalThis の同じものを指す
const KEY = Symbol.for('@k8ordo/router/tree-pathname');

type Global = { [KEY]?: Context<string | null> };

export const TreePathname: Context<string | null> = ((globalThis as Global)[
  KEY
] ??= createContext<string | null>(null));
