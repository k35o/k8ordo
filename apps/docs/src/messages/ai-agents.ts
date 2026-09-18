import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'k8ordo UIは、AIコーディングエージェントが読むための面を用意しています。設計指針とコンポーネントのリファレンスはパッケージに同梱し、トークンとpropsは実装から生成しています。',
  en: 'k8ordo UI ships surfaces meant for AI coding agents: the design guide and the component reference come inside the package, and the tokens and the props are generated from the implementation.',
});

export const setupTitle = message({
  ja: 'エージェントに読ませる',
  en: 'Point your agent at the docs',
});

export const setupDescription = message({
  ja: 'ドキュメントはnpmパッケージに同梱されているので、参照先はインストール済みのバージョンに固定されます。プロジェクトのCLAUDE.md / AGENTS.mdに次を貼るだけで設定は終わりです。',
  en: 'The docs ship inside the npm package, so an agent always reads the version you installed. Paste this into your project’s CLAUDE.md / AGENTS.md and the setup is done.',
});

export const surfacesTitle = message({
  ja: '公開している面',
  en: 'Published surfaces',
});

export const surfacesDescription = message({
  ja: '`GUIDE.md`・リファレンス・`llms.txt`は、パッケージ内（node_modules）とこのサイトの両方から取得できます。`design.md`はこのサイトだけで配信し、`props.json`はパッケージ内にだけあります（サイトでは同じpropsをコンポーネントのリファレンスに載せています）。',
  en: '`GUIDE.md`, the references and `llms.txt` are available both inside the package (node_modules) and from this site. `design.md` is served only from this site, and `props.json` exists only inside the package — on this site the same props appear in the component reference.',
});

export const surfaceGuide = message({
  ja: '設計ガイド。まずここから読む',
  en: 'The design guide — the entry point',
});

export const surfaceReference = message({
  ja: 'コンポーネントと型のリファレンス',
  en: 'Reference for components and types',
});

export const surfaceIndex = message({
  ja: 'LLM向けのドキュメント索引',
  en: 'Documentation index for LLMs',
});

export const surfaceTokens = message({
  ja: 'デザイントークンの仕様（CSSから生成）',
  en: 'Design token spec (generated from CSS)',
});

export const surfaceProps = message({
  ja: '全コンポーネントのprops（型から生成）',
  en: 'Props of every component (generated from the types)',
});

export const surfaceMcp = message({
  ja: '公開StorybookのMCPエンドポイント',
  en: 'MCP endpoint of the published Storybook',
});

export const mcpTitle = message({
  ja: 'MCPでStorybookを引く',
  en: 'Query Storybook over MCP',
});

export const mcpDescription = message({
  ja: '記憶でpropsを書かせず、実際のストーリーと描画結果を引かせるための口です。MCPクライアントの設定に追加します。',
  en: 'So an agent looks up real stories and rendered props instead of recalling them. Add it to your MCP client config.',
});

export const generatedTitle = message({
  ja: '生成されているもの',
  en: 'What is generated',
});

export const generatedDescription = message({
  ja: 'propsはコンポーネントの型から、トークンはCSSから抽出しています。CIが実装との差分を検出するため、ドキュメントだけが古くなることはありません。',
  en: 'Props come from the component types and tokens from the CSS. CI fails when either drifts from the implementation, so the docs cannot quietly rot.',
});
