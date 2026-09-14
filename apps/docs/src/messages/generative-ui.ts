import { message } from '@k8ordo/i18n';

export const introduction = message({
  ja: 'k8ordo UIは、LLMがk8ordo UIコンポーネントだけでUIを生成できる公式アダプタ（json-render / OpenUI）を同梱しています。プロンプトはサーバーで生成し、出力を検証してからクライアントで描画します。',
  en: 'k8ordo UI ships official adapters so an LLM can generate UIs constrained to these components, via json-render or OpenUI. Generate the prompt on the server, validate the output, and render it on the client.',
});

export const promptTitle = message({
  ja: 'プロンプトを生成（サーバー）',
  en: 'Generate the prompt (server)',
});

export const promptDescription = message({
  ja: 'catalogはサーバー安全です。Server Componentでシステムプロンプトを生成し、`uiRules`で横断ルールを注入します。',
  en: 'The catalog is server-safe. Generate the system prompt in a Server Component, and inject cross-cutting rules with `uiRules`.',
});

export const renderTitle = message({
  ja: '描画（クライアント）',
  en: 'Render (client)',
});

export const renderDescription = message({
  ja: '`JsonRenderUI`がプロバイダー・レンダラー・registryを内部結線済みなので、specを渡すだけで描画できます。',
  en: '`JsonRenderUI` wires the provider, renderer, and registry for you — just pass a spec.',
});

export const validateTitle = message({
  ja: 'LLM出力の検証と修復',
  en: 'Validate & repair LLM output',
});

export const validateDescription = message({
  ja: '`validateGeneratedSpec`が機械修正・構造検証・コンポーネントごとのprops検証を行い、失敗時はそのまま投げ返せる修復プロンプトを返します。',
  en: '`validateGeneratedSpec` auto-fixes, checks structure, and validates props per component, returning a ready-to-resend repair prompt on failure.',
});

export const typedTitle = message({
  ja: '型付きspec',
  en: 'Typed specs',
});

export const typedDescription = message({
  ja: '`satisfies UISpec`で書くと、component名・propsのtypoがコンパイル時に検出されます。',
  en: 'Write specs with `satisfies UISpec` so component names and props are checked at compile time.',
});

export const openuiTitle = message({
  ja: 'OpenUI',
  en: 'OpenUI',
});

export const openuiDescription = message({
  ja: 'OpenUIはDSL文字列を`library`で描画します。プロンプトは専用の`openui/prompt`エントリでサーバー生成できます。',
  en: 'OpenUI renders a DSL string with the `library`. Generate the prompt on the server with the dedicated `openui/prompt` entry.',
});
