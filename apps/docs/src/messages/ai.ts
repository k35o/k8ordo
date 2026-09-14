import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'k8ordo UIはAIプロダクトのための面を揃えています。チャット画面を組み立てるUI部品、LLMにk8ordo UIのUIを生成させるアダプタ、そしてAIコーディングエージェントに読ませるドキュメントの3つです。',
  en: 'k8ordo UI ships three surfaces for AI products: UI parts for composing chat screens, adapters that let LLMs generate UI constrained to k8ordo UI components, and documentation surfaces for AI coding agents.',
});

export const chatSummary = message({
  ja: 'Conversation・Message・PromptInputでチャット画面を組み立てるpresentationalな部品集。',
  en: 'Presentational parts — Conversation, Message and PromptInput — for composing chat screens.',
});

export const generativeUiSummary = message({
  ja: 'LLMがk8ordo UIコンポーネントだけでUIを生成するためのjson-render / OpenUIアダプタ。',
  en: 'json-render / OpenUI adapters that let LLMs generate UI using only k8ordo UI components.',
});

export const agentsSummary = message({
  ja: '設計指針・リファレンス・propsをAIコーディングエージェントに読ませるためのドキュメント面。',
  en: 'Documentation surfaces that feed the design guide, references and props to AI coding agents.',
});
