import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'AIのコーディングエージェントに、`@k8ordo/ui`の正しい使い方を読ませる設定です。設計のガイドとリファレンスはnpmパッケージに同梱され、StorybookはMCPで参照できます。',
  en: 'How to point an AI coding agent at the correct usage of `@k8ordo/ui`. The design guide and the references ship inside the npm package, and Storybook is available over MCP.',
});

export const setupTitle = message({
  ja: 'エージェントの設定',
  en: 'Agent setup',
});

export const setupDescription = message({
  ja: 'プロジェクトの`CLAUDE.md`か`AGENTS.md`にこの文を貼ります。ドキュメントはnpmパッケージに入っているので、エージェントはインストールしたバージョンのものを読みます。記憶に頼って存在しないpropsや古い書き方を書くのを防ぐための設定です。',
  en: 'Paste this into your project’s `CLAUDE.md` or `AGENTS.md`. The docs ship inside the npm package, so the agent reads the version you installed. It has the real props to go on instead of recalling ones that do not exist or are out of date.',
});

export const surfacesTitle = message({
  ja: '読めるドキュメント',
  en: 'Available docs',
});

export const surfacesDescription = message({
  ja: '`GUIDE.md`とリファレンスは、`node_modules`の中とこのサイトの両方にあります。`design.md`はこのサイトだけに、`props.json`はパッケージの中だけにあります。パッケージの`docs/llms.txt`は`@k8ordo/ui`の索引で、サイトの`/llms.txt`はすべてのパッケージの索引です。',
  en: '`GUIDE.md` and the references are in both `node_modules` and this site. `design.md` is only on this site, and `props.json` only in the package. The package’s `docs/llms.txt` indexes `@k8ordo/ui`; the site’s `/llms.txt` indexes every package.',
});

export const surfaceGuide = message({
  ja: '最初に読む設計のガイドです',
  en: 'The design guide to read first',
});

export const surfaceReference = message({
  ja: 'コンポーネント、型、デザインの規則のリファレンスです',
  en: 'References for components, types, and design rules',
});

export const surfaceIndex = message({
  ja: 'LLM向けのドキュメントの索引です',
  en: 'An index of the docs for LLMs',
});

export const surfaceTokens = message({
  ja: 'デザイントークンの仕様です',
  en: 'The design token spec',
});

export const surfaceProps = message({
  ja: 'すべてのコンポーネントのpropsをJSONにしたものです',
  en: 'The props of every component, as JSON',
});

export const surfaceMcp = message({
  ja: '公開しているStorybookのMCPエンドポイントです',
  en: 'The MCP endpoint of the published Storybook',
});

export const mcpTitle = message({
  ja: 'StorybookのMCP',
  en: 'Storybook over MCP',
});

export const mcpDescription = message({
  ja: 'MCPクライアントの設定に足します。エージェントは、コンポーネントのドキュメントとprops、ストーリーを参照できるようになります。',
  en: 'Add this to your MCP client’s configuration. The agent can then look up each component’s docs, props, and stories.',
});

export const generatedTitle = message({
  ja: 'propsとトークンの生成',
  en: 'Generated props and tokens',
});

export const generatedDescription = message({
  ja: '`props.json`とコンポーネントのリファレンスのpropsは型から、`design.md`のトークンはCSSから生成しています。実装とずれるとCIが失敗するので、ドキュメントだけが古くなることはありません。',
  en: 'The props in `props.json` and the component reference are generated from the types, and the tokens in `design.md` from the CSS. CI fails when either drifts from the implementation, so the docs never fall behind the code.',
});
