import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'AIのコーディングエージェントは、propsを記憶で書くと、存在しないpropsや古い書き方を混ぜがちです。そこで`@k8ordo/ui`は、エージェントが読むためのドキュメントを用意しています。設計の指針とコンポーネントのリファレンスはパッケージに同梱し、トークンとpropsは実装から作っています。',
  en: 'A coding agent writing props from memory tends to mix in props that do not exist and patterns that are out of date. So `@k8ordo/ui` publishes documentation meant for agents to read: the design guide and the component reference ship inside the package, and the tokens and props are derived from the implementation.',
});

export const setupTitle = message({
  ja: 'エージェントに読ませる',
  en: 'Point your agent at the docs',
});

export const setupDescription = message({
  ja: 'ドキュメントはnpmパッケージに入っているので、エージェントが読むのはいつもインストールしたバージョンのものです。プロジェクトの`CLAUDE.md`や`AGENTS.md`に次の文を貼れば、設定は終わりです。',
  en: 'The docs ship inside the npm package, so an agent always reads the version you installed. Paste this into your project’s `CLAUDE.md` or `AGENTS.md` and the setup is done.',
});

export const surfacesTitle = message({
  ja: '読めるドキュメント',
  en: 'What there is to read',
});

export const surfacesDescription = message({
  ja: '`GUIDE.md`とリファレンス、`llms.txt`は、`node_modules`の中とこのサイトのどちらからも読めます。`design.md`はこのサイトだけで配信しています。一方で`props.json`はパッケージの中にだけあり、サイトでは同じpropsをコンポーネントのリファレンスに載せています。',
  en: '`GUIDE.md`, the references and `llms.txt` can be read both inside `node_modules` and from this site. `design.md` is served only from this site, while `props.json` exists only inside the package; on this site the same props appear in the component reference.',
});

export const surfaceGuide = message({
  ja: '設計のガイドです。まずここから読みます',
  en: 'The design guide, and the place to start',
});

export const surfaceReference = message({
  ja: 'コンポーネントと型のリファレンスです',
  en: 'The reference for components and types',
});

export const surfaceIndex = message({
  ja: 'LLMのためのドキュメントの索引です',
  en: 'An index of the docs for LLMs',
});

export const surfaceTokens = message({
  ja: 'デザイントークンの仕様です。CSSから作っています',
  en: 'The design token spec, derived from the CSS',
});

export const surfaceProps = message({
  ja: 'すべてのコンポーネントのpropsです。型から作っています',
  en: 'The props of every component, derived from the types',
});

export const surfaceMcp = message({
  ja: '公開しているStorybookのMCPのエンドポイントです',
  en: 'The MCP endpoint of the published Storybook',
});

export const mcpTitle = message({
  ja: 'MCPでStorybookを引かせる',
  en: 'Have the agent query Storybook over MCP',
});

export const mcpDescription = message({
  ja: 'propsを記憶で書かせるのではなく、実際のストーリーと描画の結果を引かせるための入口です。MCPクライアントの設定に足します。',
  en: 'An entry point that has an agent look up the real stories and what they render, rather than recall props from memory. Add it to your MCP client’s configuration.',
});

export const generatedTitle = message({
  ja: '実装から作っているもの',
  en: 'What is derived from the implementation',
});

export const generatedDescription = message({
  ja: 'propsはコンポーネントの型から、トークンはCSSから取り出しています。実装とずれるとCIが落ちるので、ドキュメントだけが古くなることはありません。',
  en: 'The props come from the component types and the tokens from the CSS. CI fails when either drifts from the implementation, so the docs cannot quietly go stale.',
});
