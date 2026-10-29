'use client';

import { createContext } from 'react';
import type { Context } from 'react';

/**
 * The pathname the tree a component renders in was applied for, in the URL's
 * terms, or `null` where no router says. Under interception the URL commits
 * before the next tree arrives, so the two differ exactly while the tree on
 * screen is being left. `@k8ordo/router`'s `<Router>` and
 * `@k8ordo/framework`'s runtime provide it.
 */
// router は型しか読まない任意の peer なので import しない。router と framework
// が同じ名前で globalThis に置く context を、ここも同じ名前で読む
const KEY = Symbol.for('@k8ordo/router/tree-pathname');

type Global = { [KEY]?: Context<string | null> };

export const TreePathname: Context<string | null> = ((globalThis as Global)[
  KEY
] ??= createContext<string | null>(null));
