import { message } from '@k8ordo/i18n';

// 両モードに共通するルートのファイルの規約。モードごとの違いは
// static-reference.ts / server-reference.ts が持つ。

export const filesTitle = message({
  ja: 'ルートのファイル',
  en: 'Route files',
});

export const filesDescription = message({
  ja: '`src/routes/`のディレクトリに置けるファイルと、それぞれがexportするもの、受け取るものです。これ以外の名前のファイルは、`_`で始まるディレクトリに置きます。',
  en: 'The files a directory under `src/routes/` may hold, what each exports and what it receives. Anything else goes under a directory whose name starts with `_`.',
});

export const pageDefault = message({
  ja: 'default export：そのディレクトリのURLに答えるページのコンポーネントです。`params`と`pathname`を受け取ります。',
  en: 'Default export: the page component that answers its directory’s URL. It receives `params` and `pathname`.',
});

export const pageSchema = message({
  ja: '`paramsSchema`：パラメータを検証するスキーマです。Standard Schemaを実装したものを渡します。省略できます。',
  en: '`paramsSchema`: a schema that validates the parameters, anything implementing Standard Schema. Optional.',
});

export const layoutDefault = message({
  ja: 'default export：その下で描かれるものを`children`で受け取って包むコンポーネントです。`params`と`pathname`も受け取りますが、`params`は文字列として型が付きます。',
  en: 'Default export: a component that wraps what renders below it, received as `children`. It also receives `params` and `pathname`, with `params` typed as strings.',
});

export const layoutSchema = message({
  ja: '`paramsSchema`：その下のすべてのページで、ページ自身のスキーマより先に走ります。',
  en: '`paramsSchema`: runs for every page below, before the page’s own.',
});

export const notFoundDefault = message({
  ja: 'default export：その下で、どのルートにも当たらなかったURLに答えるコンポーネントです。`params`と`pathname`を受け取り、`params`の値は検証されていない文字列です。',
  en: 'Default export: a component that answers any URL below its directory that no route matched. It receives `params` and `pathname`, and the `params` are unvalidated strings.',
});

export const errorDirective = message({
  ja: "`'use client'`のファイルにします。",
  en: "A `'use client'` file.",
});

export const errorDefault = message({
  ja: 'default export：`error`と`reset`を受け取るコンポーネントです。その下で例外が投げられたとき、代わりに描かれます。`params`は受け取りません。',
  en: 'Default export: a component receiving `error` and `reset`, rendered in place of what is below it when that throws. It receives no `params`.',
});

export const loadingDefault = message({
  ja: 'default export：propsを受け取らないコンポーネントです。その下のページを待つ間、`<Suspense>`のfallbackとして描かれます。',
  en: 'Default export: a component with no props, rendered as the `<Suspense>` fallback while the page below it loads.',
});

export const redirectDefault = message({
  ja: 'default export：行き先の文字列か、`{ to, permanent }`です。`to`はルート表のパターンで書き、パラメータは当たった値で埋まります。',
  en: 'Default export: the target as a string, or `{ to, permanent }`. `to` is a pattern of the route table, filled with the matched parameters.',
});

export const routeMethods = message({
  ja: '`GET`や`POST`などのメソッド名のexport：`{ request, params }`を受け取り、`Response`を返す関数です。',
  en: 'Exports named after methods, such as `GET` and `POST`: functions that receive `{ request, params }` and return a `Response`.',
});

export const routeSchema = message({
  ja: '`paramsSchema`：ページと同じく、パラメータを検証します。',
  en: '`paramsSchema`: validates the parameters, as a page’s does.',
});

export const routerTitle = message({
  ja: '`@k8ordo/router`から使うもの',
  en: 'What route files use from `@k8ordo/router`',
});

export const routerDescription = message({
  ja: 'ルートのファイルが使う型と関数は、モードのパッケージではなく`@k8ordo/router`から来ます。そのためページは、どちらのモードでも同じに書けます。',
  en: 'The types and functions route files use come from `@k8ordo/router`, not from the mode package, so a page reads the same under either mode.',
});

export const routerList = [
  message({
    ja: '`PageProps<pattern>`：ページが受け取るpropsの型です。',
    en: '`PageProps<pattern>`: the props a page receives.',
  }),
  message({
    ja: '`LayoutProps<pattern>`：レイアウトが受け取るpropsの型です。',
    en: '`LayoutProps<pattern>`: the props a layout receives.',
  }),
  message({
    ja: '`ErrorProps`：`error.tsx`が受け取るpropsの型です。',
    en: '`ErrorProps`: the props an `error.tsx` receives.',
  }),
  message({
    ja: '`RouteContext<pattern>`：`route.ts`の関数が受け取る値の型です。',
    en: '`RouteContext<pattern>`: what a `route.ts` function receives.',
  }),
  message({
    ja: '`notFound()`：ページから投げると、いちばん近い`not-found.tsx`が404として答えます。',
    en: '`notFound()`: thrown from a page, it has the nearest `not-found.tsx` answer under a 404.',
  }),
  message({
    ja: '`href()`：ルート表に対して型の付いたURLを作ります。',
    en: '`href()`: builds a URL typed against the route table.',
  }),
  message({
    ja: '`usePathname()`と`useMatch()`：ブラウザで今のURLを読むフックです。',
    en: '`usePathname()` and `useMatch()`: hooks that read the current URL in the browser.',
  }),
  message({
    ja: '`usePendingPathname()`：遷移している途中の行き先を読むフックです。',
    en: '`usePendingPathname()`: a hook that reads where a navigation under way is going.',
  }),
] as const;
